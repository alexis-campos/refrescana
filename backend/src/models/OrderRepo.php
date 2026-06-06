<?php
declare(strict_types=1);

namespace App\Models;

use App\Database;

class OrderRepo
{
    public static function listAdmin(?string $status = null): array
    {
        $sql = 'SELECT * FROM orders';
        $params = [];
        if ($status) { $sql .= ' WHERE status = ?'; $params[] = $status; }
        $sql .= ' ORDER BY created_at DESC';
        $stmt = Database::pdo()->prepare($sql);
        $stmt->execute($params);
        return array_map([static::class, 'toClient'], $stmt->fetchAll());
    }

    public static function findById(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM orders WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $r = $stmt->fetch();
        if (!$r) return null;
        return static::toClientFull($r, static::getItems($id));
    }

    public static function findByIdAndEmail(string $id, string $email): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM orders WHERE id = ? AND customer_email = ? LIMIT 1');
        $stmt->execute([$id, $email]);
        $r = $stmt->fetch();
        if (!$r) return null;
        return static::toClientFull($r, static::getItems($id));
    }

    public static function updateStatus(string $id, string $status): bool
    {
        $stmt = Database::pdo()->prepare('UPDATE orders SET status=?, updated_at=NOW() WHERE id=?');
        $stmt->execute([$status, $id]);
        return $stmt->rowCount() > 0;
    }

    public static function updateVoucher(string $id, string $url, string $code, string $time): bool
    {
        $stmt = Database::pdo()->prepare('
            UPDATE orders SET yape_voucher_url=?, yape_security_code=?, yape_payment_time=?, status="PAYMENT_UPLOADED", updated_at=NOW()
            WHERE id=?
        ');
        $stmt->execute([$url, $code, $time, $id]);
        return $stmt->rowCount() > 0;
    }

    public static function getNextReceiptNumber(\PDO $pdo): string
    {
        $stmt = $pdo->query('SELECT receipt_number FROM orders WHERE receipt_number IS NOT NULL ORDER BY created_at DESC LIMIT 1');
        $last = $stmt->fetchColumn();
        $num  = 1;
        if ($last && preg_match('/RF-(\d+)/', $last, $m)) {
            $num = (int)$m[1] + 1;
        }
        return 'RF-' . str_pad((string)$num, 4, '0', STR_PAD_LEFT);
    }

    public static function getRecentWithItems(int $limit = 5): array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ?');
        $stmt->execute([$limit]);
        return array_map([static::class, 'toClient'], $stmt->fetchAll());
    }

    public static function dashboardStats(): array
    {
        $pdo = Database::pdo();

        $totalProducts = (int)$pdo->query('SELECT COUNT(*) FROM products WHERE is_active = 1')->fetchColumn();
        $totalOrders   = (int)$pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn();

        $totalRevenue  = (float)$pdo->query(
            "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'CANCELLED'"
        )->fetchColumn();

        $uniqueClients = (int)$pdo->query('SELECT COUNT(DISTINCT customer_email) FROM orders')->fetchColumn();

        // Monthly revenue for current year
        $year = date('Y');
        $stmt = $pdo->prepare("
            SELECT MONTH(created_at) AS m, SUM(total_amount) AS rev
            FROM orders WHERE status != 'CANCELLED' AND YEAR(created_at) = ?
            GROUP BY MONTH(created_at)
        ");
        $stmt->execute([$year]);
        $byMonth = array_fill(1, 12, 0.0);
        foreach ($stmt->fetchAll() as $row) {
            $byMonth[(int)$row['m']] = (float)$row['rev'];
        }
        $monthNames = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $monthlyRevenue = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthlyRevenue[] = ['month' => $monthNames[$i], 'revenue' => $byMonth[$i]];
        }

        // Top categories by revenue
        $stmt = $pdo->query("
            SELECT c.name, SUM(oi.price * oi.quantity) AS total
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            JOIN categories c ON c.id = p.category_id
            JOIN orders o ON o.id = oi.order_id
            WHERE o.status != 'CANCELLED'
            GROUP BY c.id, c.name
            ORDER BY total DESC
            LIMIT 4
        ");
        $topCategories = array_map(fn($r) => ['name' => $r['name'], 'count' => (float)$r['total']], $stmt->fetchAll());

        // Recent orders
        $recentOrders = static::getRecentWithItems(5);

        return compact('totalProducts', 'totalOrders', 'totalRevenue', 'uniqueClients', 'monthlyRevenue', 'topCategories', 'recentOrders');
    }

    private static function getItems(string $orderId): array
    {
        $stmt = Database::pdo()->prepare('
            SELECT oi.*, p.name AS product_name, p.price AS product_price,
                   c.name AS category_name,
                   (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC, id ASC LIMIT 1) AS product_image
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE oi.order_id = ?
        ');
        $stmt->execute([$orderId]);
        return array_map(fn($r) => [
            'id'       => $r['id'],
            'quantity' => (int)$r['quantity'],
            'price'    => (float)$r['price'],
            'product'  => [
                'id'           => $r['product_id'],
                'name'         => $r['product_name'],
                'image'        => $r['product_image'] ?? '',
                'categoryName' => $r['category_name'] ?? '',
                'price'        => (float)$r['product_price'],
            ],
        ], $stmt->fetchAll());
    }

    public static function createExternal(array $data, array $lineItems, ?\PDO $externalPdo = null): string
    {
        $pdo = $externalPdo ?? Database::pdo();
        $pdo->beginTransaction();
        try {
            $receiptNumber = static::getNextReceiptNumber($pdo);
            $orderId       = \App\Uuid::v4();

            $ins = $pdo->prepare('
                INSERT INTO orders (
                    id, receipt_number, status, source,
                    customer_name, customer_email, customer_phone, customer_dni,
                    shipping_address, shipping_city, shipping_province,
                    shipping_notes, shipping_cost, total_amount,
                    yape_voucher_url, yape_security_code, yape_payment_time
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            ');
            $ins->execute([
                $orderId, $receiptNumber,
                $data['status'], $data['source'],
                $data['customerName'], $data['customerEmail'], $data['customerPhone'],
                $data['customerDni'] ?: null,
                $data['shippingAddress'], $data['shippingCity'], $data['shippingProvince'],
                $data['shippingNotes'] ?: null,
                $data['shippingCost'], $data['totalAmount'],
                $data['voucherUrl'] ?? null,
                $data['securityCode'] ?? null,
                $data['paymentTime'] ?? null,
            ]);

            $ii = $pdo->prepare('INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?,?,?,?,?)');
            foreach ($lineItems as $li) {
                $ii->execute([\App\Uuid::v4(), $orderId, $li['productId'], $li['qty'], $li['price']]);
            }

            $pdo->commit();
            return $orderId;
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            throw $e;
        }
    }

    private static function toClient(array $r): array
    {
        return [
            'id'              => $r['id'],
            'receiptNumber'   => $r['receipt_number'],
            'status'          => $r['status'],
            'source'          => $r['source'] ?? null,
            'customerName'    => $r['customer_name'],
            'customerEmail'   => $r['customer_email'],
            'customerPhone'   => $r['customer_phone'],
            'customerDni'     => $r['customer_dni'],
            'shippingAddress' => $r['shipping_address'],
            'shippingCity'    => $r['shipping_city'],
            'shippingProvince'=> $r['shipping_province'],
            'shippingDistrict'=> $r['shipping_district'] ?? null,
            'shippingNotes'   => $r['shipping_notes'],
            'shippingCost'    => (float)$r['shipping_cost'],
            'totalAmount'     => (float)$r['total_amount'],
            'yapeVoucherUrl'  => $r['yape_voucher_url'],
            'yapeSecurityCode'=> $r['yape_security_code'],
            'yapePaymentTime' => $r['yape_payment_time'],
            'items'           => [],
            'createdAt'       => $r['created_at'],
            'updatedAt'       => $r['updated_at'],
        ];
    }

    private static function toClientFull(array $r, array $items): array
    {
        $out = static::toClient($r);
        $out['items'] = $items;
        return $out;
    }
}
