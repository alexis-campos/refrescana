<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\ProductRepo;
use App\Models\CategoryRepo;

class PublicHomeController
{
    public static function homeData(Request $req): void
    {
        $featuredProducts = ProductRepo::getFeatured(4);
        $categories       = CategoryRepo::listAll();
        Response::json(compact('featuredProducts', 'categories'));
    }
}
