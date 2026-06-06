<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Auth;
use App\Jwt;
use App\Request;
use App\Response;
use App\Models\UserRepo;

class AuthController
{
    public static function login(Request $req): void
    {
        $email    = trim((string)($req->body['email'] ?? ''));
        $password = (string)($req->body['password'] ?? '');

        if (!$email || !$password) {
            Response::error('Email y contraseña son requeridos');
        }

        $user = UserRepo::findByEmail($email);
        if (!$user || !password_verify($password, $user['password'])) {
            Response::error('Credenciales incorrectas', 401);
        }

        $config = $GLOBALS['__APP_CONFIG__'];
        $payload = ['id' => $user['id'], 'email' => $user['email'], 'name' => $user['name'], 'role' => $user['role']];
        $jwt     = Jwt::encode($payload, $config['jwt_ttl']);

        Auth::setCookie($jwt, $config['jwt_ttl']);
        Response::json($payload);
    }

    public static function logout(Request $req): void
    {
        Auth::clearCookie();
        Response::json(['ok' => true]);
    }

    public static function me(Request $req): void
    {
        $payload = Auth::fromRequest($req);
        if (!$payload) {
            Response::unauthorized();
        }
        $user = UserRepo::findById($payload['id']);
        if (!$user) Response::unauthorized();
        Response::json($user);
    }
}
