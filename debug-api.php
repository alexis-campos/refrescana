<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/plain; charset=utf-8');

echo "PHP: " . PHP_VERSION . "\n\n";

// Simulate GET /api/auth/me
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI']    = '/api/auth/me';
$_SERVER['SCRIPT_NAME']    = '/api/index.php';
$_SERVER['CONTENT_TYPE']   = '';

echo "=== Bootstrap ===\n";
try {
    require __DIR__ . '/backend/src/Bootstrap.php';
    echo "OK\n\n";
} catch (Throwable $e) {
    echo "FAIL: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine() . "\n"; exit;
}

echo "=== Request ===\n";
try {
    $req = App\Request::fromGlobals();
    echo "OK - path: " . $req->path . "\n\n";
} catch (Throwable $e) {
    echo "FAIL: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine() . "\n"; exit;
}

echo "=== Routes ===\n";
try {
    $router = require __DIR__ . '/backend/src/routes.php';
    echo "OK\n\n";
} catch (Throwable $e) {
    echo "FAIL: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine() . "\n"; exit;
}

echo "=== Dispatch /api/auth/me ===\n";
try {
    ob_start();
    $router->dispatch($req);
    $output = ob_get_clean();
    echo "Response: " . $output . "\n";
} catch (Throwable $e) {
    ob_end_clean();
    echo "FAIL: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine() . "\n";
}
