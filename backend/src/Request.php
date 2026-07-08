<?php
declare(strict_types=1);

namespace App;

class Request
{
    public string  $method;
    public string  $path;
    public array   $query;
    public array   $body;
    public array   $files;
    public array   $cookies;
    public array   $headers;
    public ?array  $user   = null;
    public array   $params = [];

    private function __construct(
        string $method,
        string $path,
        array  $query,
        array  $body,
        array  $files,
        array  $cookies,
        array  $headers
    ) {
        $this->method  = $method;
        $this->path    = $path;
        $this->query   = $query;
        $this->body    = $body;
        $this->files   = $files;
        $this->cookies = $cookies;
        $this->headers = $headers;
    }

    public static function fromGlobals(): self
    {
        $method  = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $uri     = $_SERVER['REQUEST_URI'] ?? '/';
        $path    = parse_url($uri, PHP_URL_PATH) ?? '/';

        // Strip the project's web root prefix so routes always start at /api/...
        $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
        $basePath   = dirname(dirname($scriptName));
        if ($basePath !== '/' && $basePath !== '' && strpos($path, $basePath) === 0) {
            $path = substr($path, strlen($basePath));
        }
        if ($path === '' || $path[0] !== '/') {
            $path = '/' . $path;
        }

        // Parse JSON body
        $body = [];
        $ct   = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($ct, 'application/json') !== false) {
            $raw  = file_get_contents('php://input');
            $body = json_decode($raw ?: '{}', true) ?? [];
        } elseif (!empty($_POST)) {
            $body = $_POST;
        }

        // Collect request headers
        $headers = [];
        foreach ($_SERVER as $k => $v) {
            if (strpos($k, 'HTTP_') === 0) {
                $name = strtolower(str_replace('_', '-', substr($k, 5)));
                $headers[$name] = $v;
            }
        }

        return new static($method, $path, $_GET, $body, $_FILES, $_COOKIE, $headers);
    }

    public function json(string $key, $default = null)
    {
        return $this->body[$key] ?? $default;
    }

    public function query(string $key, $default = null)
    {
        return $this->query[$key] ?? $default;
    }

    public function param(string $key, $default = null)
    {
        return $this->params[$key] ?? $default;
    }

    public function bearerToken(): ?string
    {
        $auth = $this->headers['authorization'] ?? '';
        if (strpos($auth, 'Bearer ') === 0) {
            return substr($auth, 7);
        }
        return null;
    }
}
