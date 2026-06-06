<?php
declare(strict_types=1);

namespace App;

class Jwt
{
    private static string $secret = '';

    public static function init(string $secret): void
    {
        static::$secret = $secret;
    }

    public static function encode(array $payload, int $ttl): string
    {
        $header  = static::b64url(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload['iat'] = time();
        $payload['exp'] = time() + $ttl;
        $claims  = static::b64url(json_encode($payload));
        $sig     = static::b64url(hash_hmac('sha256', "$header.$claims", static::$secret, true));
        return "$header.$claims.$sig";
    }

    public static function decode(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $claims, $sig] = $parts;
        $expected = static::b64url(hash_hmac('sha256', "$header.$claims", static::$secret, true));
        if (!hash_equals($expected, $sig)) return null;

        $payload = json_decode(static::b64urlDecode($claims), true);
        if (!$payload || (isset($payload['exp']) && $payload['exp'] < time())) return null;

        return $payload;
    }

    private static function b64url(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function b64urlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
    }
}
