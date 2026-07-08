<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Database;
use App\Request;
use App\Response;
use App\Uuid;
use App\UploadHandler;
use App\Models\NotificationRepo;
use App\Models\OrderRepo;

class CheckoutController
{
    private const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'];
    private const MAX_VOUCHER_BYTES  = 5 * 1024 * 1024; // 5 MB

    public static function create(Request $req): void
    {
        $b = $req->body;
        $required = ['customerName', 'customerEmail', 'customerPhone', 'shippingAddress',
                     'shippingCity', 'shippingProvince', 'shippingZone', 'shippingCost', 'items'];
        foreach ($required as $field) {
            if (empty($b[$field]) && $b[$field] !== 0) {
                Response::error("Campo requerido: $field");
            }
        }

        $items = (array)($b['items'] ?? []);
        if (empty($items)) Response::error('El carrito está vacío');

        $pdo = Database::pdo();
        $pdo->beginTransaction();

        try {
            // Lock product rows and validate
            $ids    = array_map(fn($i) => $i['id'], $items);
            $ph     = implode(',', array_fill(0, count($ids), '?'));
            $stmt   = $pdo->prepare("SELECT * FROM products WHERE id IN ($ph) AND is_active = 1 FOR UPDATE");
            $stmt->execute($ids);
            $prods  = [];
            foreach ($stmt->fetchAll() as $p) $prods[$p['id']] = $p;

            $totalAmount = 0.0;
            $lineItems   = [];
            foreach ($items as $item) {
                $id  = $item['id'];
                $qty = (int)($item['quantity'] ?? 1);
                if (!isset($prods[$id])) Response::error("Producto no disponible: $id");
                $p = $prods[$id];
                if ((int)$p['stock'] < $qty) Response::error("Stock insuficiente para: {$p['name']}");
                $price = (float)$p['price'];
                $totalAmount += $price * $qty;
                $lineItems[] = ['id' => $id, 'qty' => $qty, 'price' => $price];
            }

            $shippingCost = (float)$b['shippingCost'];
            $totalAmount += $shippingCost;
            $receiptNumber = OrderRepo::getNextReceiptNumber($pdo);
            $orderId = Uuid::v4();

            // Insert order
            $ins = $pdo->prepare('
                INSERT INTO orders (id, receipt_number, customer_name, customer_email, customer_phone,
                    customer_dni, shipping_address, shipping_city, shipping_province, shipping_zone,
                    shipping_notes, shipping_cost, total_amount, status)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,"PENDING")
            ');
            $ins->execute([
                $orderId, $receiptNumber,
                $b['customerName'], $b['customerEmail'], $b['customerPhone'],
                $b['customerDni'] ?? null,
                $b['shippingAddress'], $b['shippingCity'], $b['shippingProvince'],
                $b['shippingZone'], $b['shippingNotes'] ?? null,
                $shippingCost, $totalAmount,
            ]);

            // Insert items and decrement stock
            $ii = $pdo->prepare('INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?,?,?,?,?)');
            $up = $pdo->prepare('UPDATE products SET stock = stock - ?, updated_at = NOW() WHERE id = ?');
            foreach ($lineItems as $li) {
                $ii->execute([Uuid::v4(), $orderId, $li['id'], $li['qty'], $li['price']]);
                $up->execute([$li['qty'], $li['id']]);
            }

            $pdo->commit();

            // Best-effort notification
            try {
                NotificationRepo::create(
                    'ORDER_CREATED',
                    'Nuevo Pedido',
                    "Pedido {$receiptNumber} de {$b['customerName']}",
                    $orderId
                );
            } catch (\Throwable $__ignored) {}

            Response::json([
                'orderId'       => $orderId,
                'receiptNumber' => $receiptNumber,
                'totalAmount'   => $totalAmount,
                'shippingCost'  => $shippingCost,
            ], 201);

        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            if ($e instanceof \RuntimeException || strpos($e->getMessage(), 'Stock') !== false) {
                Response::error($e->getMessage());
            }
            error_log('Checkout error: ' . $e->getMessage());
            Response::error('Error interno al procesar el pedido', 500);
        }
    }

    public static function uploadVoucher(Request $req): void
    {
        $orderId = $req->body['orderId'] ?? '';
        $code    = $req->body['securityCode'] ?? '';
        $time    = $req->body['paymentTime'] ?? '';
        $file    = $req->files['file'] ?? null;

        if (!$orderId || !$code || !$time || !$file) {
            Response::error('Faltan campos requeridos');
        }

        try {
            $url = UploadHandler::save(
                $file, 'yape', static::ALLOWED_IMAGE_MIME, static::MAX_VOUCHER_BYTES, 'yape'
            );
        } catch (\RuntimeException $e) {
            Response::error($e->getMessage());
        }

        if (!OrderRepo::updateVoucher($orderId, $url, $code, $time)) {
            Response::notFound('Pedido no encontrado');
        }

        try {
            NotificationRepo::create('VOUCHER_UPLOADED', 'Comprobante Enviado',
                "Se subió el comprobante para pedido {$orderId}", $orderId);
        } catch (\Throwable $__ignored) {}

        Response::json(['ok' => true, 'voucherUrl' => $url]);
    }

    public static function getOrder(Request $req): void
    {
        $orderId = $req->param('orderId');
        $email   = $req->query('email');

        if (!$email) Response::error('Email requerido', 400);

        $order = OrderRepo::findByIdAndEmail($orderId, $email);
        if (!$order) Response::notFound('Pedido no encontrado');
        Response::json($order);
    }
}
