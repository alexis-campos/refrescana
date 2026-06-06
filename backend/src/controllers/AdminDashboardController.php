<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\OrderRepo;

class AdminDashboardController
{
    public static function stats(Request $req): void
    {
        Response::json(OrderRepo::dashboardStats());
    }
}
