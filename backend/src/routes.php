<?php
declare(strict_types=1);

use App\Auth;
use App\Request;
use App\Router;
use App\Controllers\AuthController;
use App\Controllers\PublicProductsController;
use App\Controllers\PublicCategoriesController;
use App\Controllers\PublicBlogController;
use App\Controllers\PublicHomeController;
use App\Controllers\CheckoutController;
use App\Controllers\AdminProductsController;
use App\Controllers\AdminCategoriesController;
use App\Controllers\AdminOrdersController;
use App\Controllers\AdminBlogController;
use App\Controllers\AdminUploadController;
use App\Controllers\AdminNotificationsController;
use App\Controllers\AdminDashboardController;
use App\Controllers\AdminExportController;
use App\Controllers\ContactController;
use App\Controllers\AdminContactController;

$admin = fn(Request $req) => Auth::admin($req);

$router = new Router();

// Auth
$router->post('/api/auth/login',  [AuthController::class, 'login']);
$router->post('/api/auth/logout', [AuthController::class, 'logout']);
$router->get('/api/auth/me',      [AuthController::class, 'me']);

// Public storefront
$router->get('/api/public/home-data',        [PublicHomeController::class, 'homeData']);
$router->get('/api/public/products',         [PublicProductsController::class, 'list']);
$router->get('/api/public/products/:slug',   [PublicProductsController::class, 'get']);
$router->get('/api/public/categories',       [PublicCategoriesController::class, 'list']);
$router->get('/api/public/blog',             [PublicBlogController::class, 'list']);
$router->get('/api/public/blog/:slug',       [PublicBlogController::class, 'get']);

// Checkout (public)
$router->post('/api/checkout',                      [CheckoutController::class, 'create']);
$router->post('/api/checkout/upload-voucher',       [CheckoutController::class, 'uploadVoucher']);
$router->get('/api/checkout/:orderId',              [CheckoutController::class, 'getOrder']);

// Admin — categories (GET is public so product pages can list them)
$router->get('/api/admin/categories',              [AdminCategoriesController::class, 'list']);
$router->post('/api/admin/categories',             [AdminCategoriesController::class, 'create'],    $admin);
$router->put('/api/admin/categories/:id',          [AdminCategoriesController::class, 'update'],    $admin);
$router->delete('/api/admin/categories/:id',       [AdminCategoriesController::class, 'delete'],    $admin);

// Admin — products
$router->get('/api/admin/products',                [AdminProductsController::class, 'list'],        $admin);
$router->post('/api/admin/products',               [AdminProductsController::class, 'create'],      $admin);
$router->get('/api/admin/products/:id',            [AdminProductsController::class, 'get'],         $admin);
$router->put('/api/admin/products/:id',            [AdminProductsController::class, 'update'],      $admin);
$router->delete('/api/admin/products/:id',         [AdminProductsController::class, 'delete'],      $admin);

// Admin — orders
$router->get('/api/admin/orders',                  [AdminOrdersController::class, 'list'],          $admin);
$router->post('/api/admin/orders',                 [AdminOrdersController::class, 'create'],        $admin);
$router->get('/api/admin/orders/:id',              [AdminOrdersController::class, 'get'],           $admin);
$router->patch('/api/admin/orders/:id',            [AdminOrdersController::class, 'updateStatus'],  $admin);
$router->post('/api/admin/orders/cancel-expired',  [AdminOrdersController::class, 'cancelExpired'], $admin);

// Admin — blog
$router->get('/api/admin/blog',                    [AdminBlogController::class, 'list'],            $admin);
$router->post('/api/admin/blog',                   [AdminBlogController::class, 'create'],          $admin);
$router->put('/api/admin/blog/:id',                [AdminBlogController::class, 'update'],          $admin);
$router->delete('/api/admin/blog/:id',             [AdminBlogController::class, 'delete'],          $admin);

// Admin — upload
$router->post('/api/admin/upload',                 [AdminUploadController::class, 'upload'],        $admin);

// Admin — notifications
$router->get('/api/admin/notifications',           [AdminNotificationsController::class, 'list'],    $admin);
$router->patch('/api/admin/notifications',         [AdminNotificationsController::class, 'markRead'], $admin);

// Admin — dashboard
$router->get('/api/admin/dashboard-stats',         [AdminDashboardController::class, 'stats'],      $admin);

// Admin — export
$router->get('/api/admin/export/orders',           [AdminExportController::class, 'orders'],        $admin);

// Contact messages (public submit)
$router->post('/api/contact',                      [ContactController::class, 'create']);

// Admin — contact messages
$router->get('/api/admin/contact',                 [AdminContactController::class, 'list'],      $admin);
$router->get('/api/admin/contact/:id',             [AdminContactController::class, 'get'],       $admin);
$router->patch('/api/admin/contact',               [AdminContactController::class, 'markRead'],  $admin);
$router->delete('/api/admin/contact/:id',          [AdminContactController::class, 'delete'],    $admin);

return $router;
