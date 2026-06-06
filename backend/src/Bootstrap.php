<?php
declare(strict_types=1);

namespace App;

// Manual PSR-4 autoloader for the App\ namespace
// Note: subdirectories (controllers/, models/) are lowercase on disk
spl_autoload_register(function (string $class): void {
    if (!str_starts_with($class, 'App\\')) return;
    $parts    = explode('\\', substr($class, 4)); // strip 'App\'
    $filename = array_pop($parts) . '.php';       // e.g. AuthController.php
    // Lowercase every subdirectory segment to match disk layout
    $dirs = array_map('strtolower', $parts);       // ['controllers'] or ['models']
    $rel  = ($dirs ? implode('/', $dirs) . '/' : '') . $filename;
    $file = __DIR__ . '/' . $rel;
    if (file_exists($file)) require $file;
});

// Load config
$config = require __DIR__ . '/../config.php';
$GLOBALS['__APP_CONFIG__'] = $config;

// Timezone
date_default_timezone_set($config['timezone'] ?? 'America/Lima');

// CORS for development (Vite proxy bypasses this; needed for direct fetch in dev)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['http://localhost:3000', 'http://localhost:5173'];
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Init singletons
Database::getInstance($config['db']);
Jwt::init($config['jwt_secret']);
