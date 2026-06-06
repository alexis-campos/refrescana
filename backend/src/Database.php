<?php
declare(strict_types=1);

namespace App;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $pdo = null;

    public static function getInstance(array $cfg = []): PDO
    {
        if (static::$pdo !== null) return static::$pdo;

        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            $cfg['host']    ?? 'localhost',
            $cfg['port']    ?? '3306',
            $cfg['name']    ?? 'refrescana',
            $cfg['charset'] ?? 'utf8mb4',
        );

        static::$pdo = new PDO($dsn, $cfg['user'] ?? 'root', $cfg['pass'] ?? '', [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);

        return static::$pdo;
    }

    public static function pdo(): PDO
    {
        return static::$pdo ?? static::getInstance();
    }
}
