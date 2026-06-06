<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\ProductRepo;

class PublicProductsController
{
    public static function list(Request $req): void
    {
        $category = $req->query('category') ?: null;
        Response::json(ProductRepo::listPublic($category));
    }

    public static function get(Request $req): void
    {
        $slug = $req->param('slug');
        $product = ProductRepo::findBySlugPublic($slug);
        if (!$product) Response::notFound('Producto no encontrado');
        Response::json($product);
    }
}
