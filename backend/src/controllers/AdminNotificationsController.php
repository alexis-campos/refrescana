<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\NotificationRepo;

class AdminNotificationsController
{
    public static function list(Request $req): void
    {
        $unread        = filter_var($req->query('unread'), FILTER_VALIDATE_BOOLEAN);
        $notifications = NotificationRepo::list($unread);
        $unreadCount   = count(array_filter($notifications, fn($n) => !$n['isRead']));
        Response::json(compact('notifications', 'unreadCount'));
    }

    public static function markRead(Request $req): void
    {
        $id  = $req->body['id'] ?? null;
        $ids = $req->body['ids'] ?? null;

        if ($ids && is_array($ids)) {
            foreach ($ids as $i) NotificationRepo::markRead($i);
        } else {
            NotificationRepo::markRead($id ?: null);
        }
        Response::json(['ok' => true]);
    }
}
