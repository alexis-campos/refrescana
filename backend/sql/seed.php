#!/usr/bin/env php
<?php
declare(strict_types=1);

/**
 * Refrescaña — Script de inicialización de base de datos
 *
 * Si la base de datos YA EXISTE: la elimina completamente y la recrea.
 * Si NO EXISTE: la crea desde cero.
 *
 * En ambos casos aplica el schema completo (tablas + usuario admin).
 *
 * Uso:
 *   php backend/sql/seed.php
 *   /opt/lampp/bin/php backend/sql/seed.php  (si usas XAMPP)
 *
 * Credenciales admin que se crean:
 *   Email:    admin@refrescana.com
 *   Password: adminrefrescana
 */

$config = require __DIR__ . '/../config.php';
$cfg    = $config['db'];
$dbName = $cfg['name'];

// ─── 1. Conectar SIN base de datos para poder crearla/eliminarla ───────────
$dsnNoDB = "mysql:host={$cfg['host']};port={$cfg['port']};charset={$cfg['charset']}";

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "  Refrescaña — Inicialización de DB\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

try {
    $pdoRoot = new PDO($dsnNoDB, $cfg['user'], $cfg['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $e) {
    echo "✗ Error de conexión a MySQL: {$e->getMessage()}\n";
    exit(1);
}

// ─── 2. Verificar si la DB ya existe ──────────────────────────────────────
$check  = $pdoRoot->query("SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = " . $pdoRoot->quote($dbName));
$exists = (bool) $check->fetch();

if ($exists) {
    echo "⚠  La base de datos '$dbName' ya existe.\n";
    echo "   Eliminando y recreando desde cero...\n\n";
    $pdoRoot->exec("DROP DATABASE `$dbName`");
    echo "✓ DROP DATABASE '$dbName' completado.\n";
} else {
    echo "ℹ  La base de datos '$dbName' no existe. Creando...\n\n";
}

// ─── 3. Crear la base de datos ────────────────────────────────────────────
$pdoRoot->exec("CREATE DATABASE `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
echo "✓ CREATE DATABASE '$dbName' completado.\n\n";

// Cerrar conexión sin DB
unset($pdoRoot);

// ─── 4. Reconectar ya con la base de datos creada ─────────────────────────
$dsnWithDB = "mysql:host={$cfg['host']};port={$cfg['port']};dbname={$cfg['name']};charset={$cfg['charset']}";

try {
    $pdo = new PDO($dsnWithDB, $cfg['user'], $cfg['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $e) {
    echo "✗ Error al reconectar con '$dbName': {$e->getMessage()}\n";
    exit(1);
}

// ─── 5. Leer schema y filtrar solo las sentencias de tablas/datos ─────────
$schemaPath = __DIR__ . '/schema.sql';
if (!file_exists($schemaPath)) {
    echo "✗ No se encontró el archivo schema.sql en: $schemaPath\n";
    exit(1);
}

$sql = file_get_contents($schemaPath);

// Dividir por ; y filtrar sentencias de gestión de DB (ya las ejecutamos arriba)
$skipPrefixes = ['DROP DATABASE', 'CREATE DATABASE', 'USE '];

$statements = array_filter(
    array_map(function (string $raw): string {
        // Eliminar líneas de comentario para quedarnos solo con el SQL real
        $lines = explode("\n", $raw);
        $sqlLines = array_filter($lines, fn($l) => !preg_match('/^\s*--/', $l));
        return trim(implode("\n", $sqlLines));
    }, explode(';', $sql)),
    function (string $s) use ($skipPrefixes): bool {
        if ($s === '') return false;
        // Ignorar sentencias de gestión de base de datos
        foreach ($skipPrefixes as $prefix) {
            if (stripos(ltrim($s), $prefix) === 0) return false;
        }
        return true;
    }
);

// ─── 6. Ejecutar cada sentencia ───────────────────────────────────────────
echo "Ejecutando schema (tablas + datos iniciales)...\n";

foreach ($statements as $statement) {
    if (trim($statement) === '') continue;
    try {
        $pdo->exec($statement);
    } catch (PDOException $e) {
        echo "✗ Error ejecutando sentencia:\n";
        echo "  " . substr(preg_replace('/\s+/', ' ', $statement), 0, 150) . "\n";
        echo "  Error: {$e->getMessage()}\n";
        exit(1);
    }
}

// ─── 7. Verificar resultado ───────────────────────────────────────────────
$tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
$user   = $pdo->query("SELECT email, role FROM users LIMIT 1")->fetch(PDO::FETCH_ASSOC);

echo "\n✓ Schema aplicado correctamente.\n";
echo "✓ Tablas creadas: " . implode(', ', $tables) . "\n\n";

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "  Base de datos '$dbName' lista.\n\n";
echo "  Usuario admin:\n";
echo "    Email:    " . ($user['email'] ?? '—') . "\n";
echo "    Password: adminrefrescana\n";
echo "    Rol:      " . ($user['role']  ?? '—') . "\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
