<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\CategoryRepo;

class PublicCategoriesController
{
    public static function list(Request $req): void
    {
        Response::json(CategoryRepo::listAll());
    }
}
