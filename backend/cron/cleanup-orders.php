<?php
declare(strict_types=1);

// Este script se ejecuta via CLI desde el cron de cPanel:
// php /home/johepiga/public_html/backend/cron/cleanup-orders.php

$days = 3; // Cancelar pedidos PENDING con más de X días sin pago

require __DIR__ . '/../src/Bootstrap.php';

use App\Models\OrderRepo;

$cancelled = OrderRepo::cancelExpiredPending($days);

$msg = date('[Y-m-d H:i:s]') . " Cleanup: {$cancelled} pedidos PENDING cancelados (>{$days} días)\n";
echo $msg;
error_log($msg);
