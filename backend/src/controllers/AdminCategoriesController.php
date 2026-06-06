<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\CategoryRepo;

class AdminCategoriesController
{
    public static function list(Request $req): void
    {
        Response::json(CategoryRepo::listAll(true));
    }

    public static function create(Request $req): void
    {
        $b = $req->body;
        if (empty($b['name']) || empty($b['slug'])) Response::error('Nombre y slug son requeridos');
        Response::json(CategoryRepo::create($b), 201);
    }

    public static function update(Request $req): void
    {
        $id = $req->param('id');
        if (!CategoryRepo::findById($id)) Response::notFound();
        Response::json(CategoryRepo::update($id, $req->body));
    }

    public static function delete(Request $req): void
    {
        $id   = $req->param('id');
        $user = $req->user ?? [];
        if (($user['role'] ?? '') !== 'ADMIN') Response::forbidden('Solo el administrador puede eliminar categorías');

        if (!CategoryRepo::findById($id)) Response::notFound();
        if (CategoryRepo::productCount($id) > 0) {
            Response::error('No se puede eliminar: la categoría tiene productos asociados', 409);
        }
        CategoryRepo::delete($id);
        Response::json(['ok' => true]);
    }
}
