<?php
declare(strict_types=1);

namespace App;

class Router
{
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler, ?callable $middleware = null): void
    {
        $this->routes[] = compact('method', 'pattern', 'handler', 'middleware');
    }

    public function get(string $p, callable $h, ?callable $m = null): void    { $this->add('GET',    $p, $h, $m); }
    public function post(string $p, callable $h, ?callable $m = null): void   { $this->add('POST',   $p, $h, $m); }
    public function put(string $p, callable $h, ?callable $m = null): void    { $this->add('PUT',    $p, $h, $m); }
    public function patch(string $p, callable $h, ?callable $m = null): void  { $this->add('PATCH',  $p, $h, $m); }
    public function delete(string $p, callable $h, ?callable $m = null): void { $this->add('DELETE', $p, $h, $m); }

    public function dispatch(Request $req): void
    {
        foreach ($this->routes as $route) {
            if ($route['method'] !== $req->method) continue;

            $regex  = preg_replace('#:([a-zA-Z_]+)#', '(?P<$1>[^/]+)', $route['pattern']);
            $regex  = '#^' . $regex . '$#';
            if (!preg_match($regex, $req->path, $m)) continue;

            // Extract named params
            $params = array_filter($m, 'is_string', ARRAY_FILTER_USE_KEY);
            $req->params = $params;

            if ($route['middleware']) ($route['middleware'])($req);
            ($route['handler'])($req);
            return;
        }

        Response::notFound('Ruta no encontrada');
    }
}
