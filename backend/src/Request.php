<?php
declare(strict_types=1);

namespace App;

class Request
{
    public readonly string  $method;
    public readonly string  $path;
    public readonly array   $query;
    public readonly array   $body;
    public readonly array   $files;
    public readonly array   $cookies;
    public readonly array   $headers;
    public ?array           $user   = null;
    public array            $params = [];

    private function __construct(
        string $method,
        string $path,
        array  $query,
        array  $body,
        array  $files,
        array  $cookies,
        array  $headers,
    ) {
        $this->method  = $method;
        $this->path    = $path;
        $this->query   = $query;
        $this->body    = $body;
        $this->files   = $files;
        $this->cookies = $cookies;
        $this->headers = $headers;
    }

    public static function fromGlobals(): static
    {
        $method  = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $uri     = $_SERVER['REQUEST_URI'] ?? '/';
        $path    = parse_url($uri, PHP_URL_PATH) ?? '/';

        // Strip the project's web root prefix so routes always start at /api/...
        // e.g. /Refrescana-copia/api/auth/login → /api/auth/login
        // SCRIPT_NAME is something like /Refrescana-copia/api/index.php
        $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
        $basePath   = dirname(dirname($scriptName)); // → /Refrescana-copia
        if ($basePath !== '/' && $basePath !== '' && str_starts_with($path, $basePath)) {
            $path = substr($path, strlen($basePath));
        }
        if ($path === '' || $path[0] !== '/') {
            $path = '/' . $path;
        }

        // Parse JSON body
        $body = [];
        $ct   = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($ct, 'application/json')) {
            $raw  = file_get_contents('php://input');
            $body = json_decode($raw ?: '{}', true) ?? [];
        } elseif (!empty($_POST)) {
            $body = $_POST;
        }

        // Collect request headers
        $headers = [];
        foreach ($_SERVER as $k => $v) {
            if (str_starts_with($k, 'HTTP_')) {
                $name = strtolower(str_replace('_', '-', substr($k, 5)));
                $headers[$name] = $v;
            }
        }

        return new static($method, $path, $_GET, $body, $_FILES, $_COOKIE, $headers);
    }

    public function json(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $default;
    }

    public function query(string $key, mixed $default = null): mixed
    {
        return $this->query[$key] ?? $default;
    }

    public function param(string $key, mixed $default = null): mixed
    {
        return $this->params[$key] ?? $default;
    }

    public function bearerToken(): ?string
    {
        $auth = $this->headers['authorization'] ?? '';
        if (str_starts_with($auth, 'Bearer ')) {
            return substr($auth, 7);
        }
        return null;
    }
}
