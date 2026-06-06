<?php
declare(strict_types=1);

// El código fuente PHP vive en backend/src/ (no expuesto al web)
require __DIR__ . '/../backend/src/Bootstrap.php';

$req    = App\Request::fromGlobals();
$router = require __DIR__ . '/../backend/src/routes.php';
$router->dispatch($req);
