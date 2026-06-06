<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\ProductRepo;

class AdminProductsController
{
    public static function list(Request $req): void
    {
        Response::json(ProductRepo::listAdmin());
    }

    public static function create(Request $req): void
    {
        $b = $req->body;
        foreach (['name', 'slug', 'description', 'price', 'categoryId'] as $f) {
            if (empty($b[$f])) Response::error("Campo requerido: $f");
        }
        Response::json(ProductRepo::create($b), 201);
    }

    public static function get(Request $req): void
    {
        $p = ProductRepo::findById($req->param('id'));
        if (!$p) Response::notFound();
        Response::json($p);
    }

    public static function update(Request $req): void
    {
        $id = $req->param('id');
        if (!ProductRepo::findById($id)) Response::notFound();
        Response::json(ProductRepo::update($id, $req->body));
    }

    public static function delete(Request $req): void
    {
        $id   = $req->param('id');
        $user = $req->user ?? [];
        if (($user['role'] ?? '') !== 'ADMIN') Response::forbidden('Solo el administrador puede eliminar productos');

        if (!ProductRepo::findById($id)) Response::notFound();
        if (ProductRepo::hasOrders($id)) {
            Response::error('No se puede eliminar: el producto tiene pedidos asociados', 409);
        }
        ProductRepo::delete($id);
        Response::json(['ok' => true]);
    }
}
