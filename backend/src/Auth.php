<?php
declare(strict_types=1);

namespace App;

class Auth
{
    private const COOKIE = 'refrescana_auth';
    private const ADMIN_ROLES = ['ADMIN', 'EDITOR', 'SALES'];

    public static function admin(Request $req): void
    {
        $token = $_COOKIE[static::COOKIE] ?? $req->bearerToken();
        if (!$token) {
            Response::unauthorized('No autenticado');
        }

        $payload = Jwt::decode($token);
        if (!$payload) {
            Response::unauthorized('Token inválido o expirado');
        }

        if (!in_array($payload['role'] ?? '', static::ADMIN_ROLES, true)) {
            Response::forbidden('Acceso denegado');
        }

        $req->user = $payload;
    }

    public static function setCookie(string $jwt, int $ttl): void
    {
        $config = $GLOBALS['__APP_CONFIG__'];
        setcookie(static::COOKIE, $jwt, [
            'expires'  => time() + $ttl,
            'path'     => '/',
            'secure'   => $config['cookie_secure'] ?? false,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    public static function clearCookie(): void
    {
        setcookie(static::COOKIE, '', [
            'expires'  => time() - 3600,
            'path'     => '/',
            'secure'   => $GLOBALS['__APP_CONFIG__']['cookie_secure'] ?? false,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    public static function fromRequest(Request $req): ?array
    {
        $token = $_COOKIE[static::COOKIE] ?? $req->bearerToken();
        if (!$token) return null;
        return Jwt::decode($token);
    }
}
