<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\UploadHandler;
use App\Models\NotificationRepo;
use App\Models\OrderRepo;

class AdminOrdersController
{
    public static function list(Request $req): void
    {
        $status = $req->query('status') ?: null;
        Response::json(OrderRepo::listAdmin($status));
    }

    public static function get(Request $req): void
    {
        $order = OrderRepo::findById($req->param('id'));
        if (!$order) Response::notFound('Pedido no encontrado');
        Response::json($order);
    }

    public static function updateStatus(Request $req): void
    {
        $id     = $req->param('id');
        $status = $req->body['status'] ?? '';
        $allowed = ['PENDING','PAYMENT_UPLOADED','PAID','PREPARING','SHIPPED','DELIVERED','CANCELLED','REJECTED'];
        if (!in_array($status, $allowed, true)) Response::error('Estado inválido');

        if (!OrderRepo::updateStatus($id, $status)) Response::notFound('Pedido no encontrado');
        Response::json(['ok' => true]);
    }

    public static function create(Request $req): void
    {
        $b = $req->body; // $_POST for multipart

        // Required fields
        $required = ['customerName', 'customerEmail', 'customerPhone',
                     'shippingAddress', 'shippingCity', 'shippingProvince',
                     'shippingCost', 'items', 'source'];
        foreach ($required as $field) {
            if (!isset($b[$field]) || (string)$b[$field] === '') {
                Response::error("Campo requerido: {$field}");
            }
        }

        $items = json_decode($b['items'], true);
        if (!is_array($items) || count($items) === 0) {
            Response::error('Debe agregar al menos un producto');
        }

        // Validate all products exist
        $pdo        = \App\Database::pdo();
        $productIds = array_column($items, 'productId');
        $ph         = implode(',', array_fill(0, count($productIds), '?'));
        $stmt       = $pdo->prepare("SELECT id FROM products WHERE id IN ({$ph})");
        $stmt->execute($productIds);
        $found = array_column($stmt->fetchAll(), 'id');
        foreach ($productIds as $pid) {
            if (!in_array($pid, $found, true)) {
                Response::error("Producto no encontrado: {$pid}");
            }
        }

        // Calculate total
        $shippingCost = (float)$b['shippingCost'];
        $totalAmount  = $shippingCost;
        $lineItems    = [];
        foreach ($items as $item) {
            $qty          = max(1, (int)($item['quantity'] ?? 1));
            $price        = (float)($item['price'] ?? 0);
            $totalAmount += $qty * $price;
            $lineItems[]  = ['productId' => $item['productId'], 'qty' => $qty, 'price' => $price];
        }

        // Validate & upload optional voucher
        $voucherUrl = null;
        $file       = $req->files['voucher'] ?? null;
        if ($file && ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
            try {
                $voucherUrl = UploadHandler::save(
                    $file, 'yape', ['image/jpeg', 'image/png', 'image/webp'], 5 * 1024 * 1024, 'yape'
                );
            } catch (\RuntimeException $e) {
                Response::error($e->getMessage());
            }
        }

        $allowedStatuses = ['PENDING', 'PAYMENT_UPLOADED', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'];
        $status          = $b['status'] ?? 'PENDING';
        if (!in_array($status, $allowedStatuses, true)) $status = 'PENDING';
        if ($voucherUrl && $status === 'PENDING') $status = 'PAYMENT_UPLOADED';

        $allowedSources = ['WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'TELEFONO', 'PRESENCIAL', 'OTRO'];
        $source         = strtoupper(trim($b['source']));
        if (!in_array($source, $allowedSources, true)) $source = 'OTRO';

        $data = [
            'status'          => $status,
            'source'          => $source,
            'customerName'    => trim($b['customerName']),
            'customerEmail'   => trim($b['customerEmail']),
            'customerPhone'   => trim($b['customerPhone']),
            'customerDni'     => trim($b['customerDni'] ?? ''),
            'shippingAddress' => trim($b['shippingAddress']),
            'shippingCity'    => trim($b['shippingCity']),
            'shippingProvince'=> trim($b['shippingProvince']),
            'shippingNotes'   => trim($b['shippingNotes'] ?? ''),
            'shippingCost'    => $shippingCost,
            'totalAmount'     => $totalAmount,
            'voucherUrl'      => $voucherUrl,
            'securityCode'    => trim($b['yapeSecurityCode'] ?? ''),
            'paymentTime'     => trim($b['yapePaymentTime'] ?? ''),
        ];

        try {
            $orderId = OrderRepo::createExternal($data, $lineItems);
        } catch (\Throwable $e) {
            error_log('External order error: ' . $e->getMessage());
            Response::error('Error al crear el pedido', 500);
        }

        // Notification (best-effort)
        try {
            $receipt = OrderRepo::findById($orderId)['receiptNumber'] ?? $orderId;
            NotificationRepo::create(
                'ORDER_CREATED',
                'Pedido Externo Registrado',
                "Pedido {$receipt} de {$data['customerName']} vía {$source}",
                $orderId
            );
        } catch (\Throwable) {}

        Response::json(OrderRepo::findById($orderId), 201);
    }
}
