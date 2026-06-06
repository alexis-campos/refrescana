<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\BlogRepo;

class PublicBlogController
{
    public static function list(Request $req): void
    {
        Response::json(BlogRepo::listPublic());
    }

    public static function get(Request $req): void
    {
        $slug = $req->param('slug');
        $post = BlogRepo::findBySlug($slug, true);
        if (!$post) Response::notFound('Artículo no encontrado');
        Response::json($post);
    }
}
