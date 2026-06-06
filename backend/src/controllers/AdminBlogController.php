<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\BlogRepo;

class AdminBlogController
{
    public static function list(Request $req): void
    {
        Response::json(BlogRepo::listAdmin());
    }

    public static function create(Request $req): void
    {
        $b = $req->body;
        if (empty($b['title']) || empty($b['slug']) || empty($b['content'])) {
            Response::error('Título, slug y contenido son requeridos');
        }
        Response::json(BlogRepo::create($b), 201);
    }

    public static function update(Request $req): void
    {
        $id = $req->param('id');
        if (!BlogRepo::findById($id)) Response::notFound();
        Response::json(BlogRepo::update($id, $req->body));
    }

    public static function delete(Request $req): void
    {
        $id = $req->param('id');
        if (!BlogRepo::findById($id)) Response::notFound();
        BlogRepo::delete($id);
        Response::json(['ok' => true]);
    }
}
