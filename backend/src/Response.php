<?php
declare(strict_types=1);

namespace App;

class Response
{
    public static function json($data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function error(string $message, int $status = 400): void
    {
        static::json(['error' => $message], $status);
    }

    public static function notFound(string $message = 'Not found'): void
    {
        static::error($message, 404);
    }

    public static function unauthorized(string $message = 'Unauthorized'): void
    {
        static::error($message, 401);
    }

    public static function forbidden(string $message = 'Forbidden'): void
    {
        static::error($message, 403);
    }
}
