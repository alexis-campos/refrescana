<?php
declare(strict_types=1);

namespace App\Models;

use App\Database;
use App\Uuid;

class NotificationRepo
{
    public static function create(string $type, string $title, string $message, ?string $orderId = null): void
    {
        $id   = Uuid::v4();
        $stmt = Database::pdo()->prepare(
            'INSERT INTO notifications (id, type, title, message, order_id, is_read) VALUES (?,?,?,?,?,0)'
        );
        $stmt->execute([$id, $type, $title, $message, $orderId]);
    }

    public static function list(bool $onlyUnread = false): array
    {
        $sql = 'SELECT * FROM notifications';
        if ($onlyUnread) $sql .= ' WHERE is_read = 0';
        $sql .= ' ORDER BY created_at DESC LIMIT 50';
        return array_map([static::class, 'toClient'], Database::pdo()->query($sql)->fetchAll());
    }

    public static function markRead(?string $id = null): void
    {
        if ($id) {
            $stmt = Database::pdo()->prepare('UPDATE notifications SET is_read=1 WHERE id=?');
            $stmt->execute([$id]);
        } else {
            Database::pdo()->exec('UPDATE notifications SET is_read=1');
        }
    }

    private static function toClient(array $r): array
    {
        return [
            'id'        => $r['id'],
            'type'      => $r['type'],
            'title'     => $r['title'],
            'message'   => $r['message'],
            'orderId'   => $r['order_id'],
            'isRead'    => (bool)$r['is_read'],
            'createdAt' => $r['created_at'],
        ];
    }
}
