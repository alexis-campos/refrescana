<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\UploadHandler;
use App\Models\ProductRepo;

class AdminUploadController
{
    private const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    private const MAX     = 10 * 1024 * 1024; // 10 MB

    public static function upload(Request $req): void
    {
        $file = $req->files['file'] ?? null;
        if (!$file) Response::error('No se recibió ningún archivo');

        try {
            $url = UploadHandler::save($file, 'products', static::ALLOWED, static::MAX, 'img');
        } catch (\RuntimeException $e) {
            Response::error($e->getMessage());
        }

        // Optionally attach to product
        $productId = $req->body['productId'] ?? null;
        if ($productId) {
            $image = ProductRepo::addImage($productId, $url);
            Response::json(['url' => $url, 'image' => $image]);
        }

        Response::json(['url' => $url]);
    }
}
