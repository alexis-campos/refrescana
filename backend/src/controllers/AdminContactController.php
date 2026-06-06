<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\ContactMessageRepo;

class AdminContactController
{
    public static function list(Request $req): void
    {
        $onlyUnread  = filter_var($req->query('unread'), FILTER_VALIDATE_BOOLEAN);
        $messages    = ContactMessageRepo::list($onlyUnread);
        $unreadCount = ContactMessageRepo::unreadCount();
        Response::json(compact('messages', 'unreadCount'));
    }

    public static function get(Request $req): void
    {
        $id  = $req->param('id');
        $msg = ContactMessageRepo::get($id);
        if (!$msg) Response::notFound('Mensaje no encontrado');

        // Auto-mark as read when opened
        if (!$msg['isRead']) ContactMessageRepo::markRead($id);
        $msg['isRead'] = true;

        Response::json($msg);
    }

    public static function markRead(Request $req): void
    {
        $id  = $req->body['id']  ?? null;
        $all = $req->body['all'] ?? false;

        if ($all) {
            ContactMessageRepo::markAllRead();
        } elseif ($id) {
            ContactMessageRepo::markRead((string)$id);
        } else {
            Response::error('Se requiere id o all=true');
        }

        Response::json(['ok' => true]);
    }

    public static function delete(Request $req): void
    {
        $id = $req->param('id');
        ContactMessageRepo::delete($id);
        Response::json(['ok' => true]);
    }
}
