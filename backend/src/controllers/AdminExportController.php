<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Database;
use App\Request;
use App\XlsxWriter;

class AdminExportController
{
    public static function orders(Request $req): void
    {
        $pdo = Database::pdo();

        // ── Sheet 1: all orders ──────────────────────────────────────────────
        $rows = $pdo->query('
            SELECT o.receipt_number, o.customer_name, o.customer_email, o.customer_phone,
                   o.shipping_address, o.shipping_city, o.shipping_province,
                   o.total_amount, o.shipping_cost, o.status, o.source, o.created_at
            FROM orders o ORDER BY o.created_at DESC
        ')->fetchAll();

        $statusLabels = [
            'PENDING'          => 'Pendiente',
            'PAYMENT_UPLOADED' => 'Comprobante Enviado',
            'PAID'             => 'Pagado',
            'PREPARING'        => 'En Preparación',
            'SHIPPED'          => 'Enviado',
            'DELIVERED'        => 'Entregado',
            'CANCELLED'        => 'Cancelado',
            'REJECTED'         => 'Rechazado',
        ];
        $sourceLabels = [
            'WEB'        => 'Tienda Web',
            'WHATSAPP'   => 'WhatsApp',
            'FACEBOOK'   => 'Facebook',
            'INSTAGRAM'  => 'Instagram',
            'TELEFONO'   => 'Teléfono',
            'PRESENCIAL' => 'Presencial',
            'OTRO'       => 'Otro',
        ];

        $orderRows = [
            ['Nº Recibo', 'Cliente', 'Email', 'Teléfono', 'Dirección', 'Ciudad',
             'Provincia', 'Total (S/)', 'Envío (S/)', 'Estado', 'Canal', 'Fecha'],
        ];
        foreach ($rows as $r) {
            $orderRows[] = [
                $r['receipt_number'] ?? '',
                $r['customer_name'],
                $r['customer_email'],
                $r['customer_phone'],
                $r['shipping_address'],
                $r['shipping_city'],
                $r['shipping_province'],
                (float)$r['total_amount'],
                (float)$r['shipping_cost'],
                $statusLabels[$r['status']] ?? $r['status'],
                $sourceLabels[$r['source'] ?? ''] ?? ($r['source'] ?? 'Tienda Web'),
                $r['created_at'],
            ];
        }

        // ── Sheet 2: monthly revenue summary ────────────────────────────────
        $year    = date('Y');
        $stmt    = $pdo->prepare("
            SELECT MONTH(created_at) AS m,
                   COUNT(*) AS total_orders,
                   SUM(total_amount) AS revenue,
                   SUM(shipping_cost) AS shipping
            FROM orders
            WHERE status NOT IN ('CANCELLED','REJECTED') AND YEAR(created_at) = ?
            GROUP BY MONTH(created_at)
            ORDER BY m
        ");
        $stmt->execute([$year]);
        $monthData = [];
        foreach ($stmt->fetchAll() as $row) {
            $monthData[(int)$row['m']] = $row;
        }

        $monthNames = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        $revenueRows = [
            ['Mes', 'Pedidos', 'Ingresos Brutos (S/)', 'Costo Envío (S/)', 'Ingresos Netos (S/)'],
        ];
        $totOrders   = 0;
        $totRevenue  = 0.0;
        $totShipping = 0.0;
        for ($i = 1; $i <= 12; $i++) {
            $d           = $monthData[$i] ?? null;
            $orders      = $d ? (int)$d['total_orders'] : 0;
            $rev         = $d ? (float)$d['revenue'] : 0.0;
            $ship        = $d ? (float)$d['shipping'] : 0.0;
            $totOrders  += $orders;
            $totRevenue += $rev;
            $totShipping += $ship;
            $revenueRows[] = [
                $monthNames[$i] . ' ' . $year,
                $orders,
                round($rev, 2),
                round($ship, 2),
                round($rev - $ship, 2),
            ];
        }
        $revenueRows[] = ['TOTAL', $totOrders, round($totRevenue, 2), round($totShipping, 2), round($totRevenue - $totShipping, 2)];

        // ── Generate and stream ──────────────────────────────────────────────
        $xlsx = new XlsxWriter();
        $xlsx->addSheet('Pedidos', $orderRows);
        $xlsx->addSheet('Ganancias ' . $year, $revenueRows);
        $content = $xlsx->generate();

        $filename = 'refrescana-pedidos-' . date('Y-m-d') . '.xlsx';
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header("Content-Disposition: attachment; filename=\"{$filename}\"");
        header('Content-Length: ' . strlen($content));
        header('Cache-Control: no-cache, must-revalidate');
        echo $content;
        exit;
    }
}
