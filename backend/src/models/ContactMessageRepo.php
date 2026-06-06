<?php
declare(strict_types=1);

namespace App\Models;

use App\Database;
use App\Uuid;

class ContactMessageRepo
{
    public static function create(
        string $name,
        string $email,
        ?string $phone,
        ?string $subject,
        ?string $productInterest,
        string $message
    ): string {
        $id   = Uuid::v4();
        $stmt = Database::pdo()->prepare(
            'INSERT INTO contact_messages (id, name, email, phone, subject, product_interest, message, is_read)
             VALUES (?, ?, ?, ?, ?, ?, ?, 0)'
        );
        $stmt->execute([$id, $name, $email, $phone, $subject, $productInterest, $message]);
        return $id;
    }

    public static function list(bool $onlyUnread = false): array
    {
        $sql = 'SELECT * FROM contact_messages';
        if ($onlyUnread) $sql .= ' WHERE is_read = 0';
        $sql .= ' ORDER BY created_at DESC LIMIT 200';
        return array_map([static::class, 'toClient'], Database::pdo()->query($sql)->fetchAll());
    }

    public static function get(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM contact_messages WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? static::toClient($row) : null;
    }

    public static function markRead(string $id): void
    {
        $stmt = Database::pdo()->prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?');
        $stmt->execute([$id]);
    }

    public static function markAllRead(): void
    {
        Database::pdo()->exec('UPDATE contact_messages SET is_read = 1 WHERE is_read = 0');
    }

    public static function delete(string $id): void
    {
        $stmt = Database::pdo()->prepare('DELETE FROM contact_messages WHERE id = ?');
        $stmt->execute([$id]);
    }

    public static function unreadCount(): int
    {
        return (int) Database::pdo()->query('SELECT COUNT(*) FROM contact_messages WHERE is_read = 0')->fetchColumn();
    }

    private static function toClient(array $r): array
    {
        return [
            'id'              => $r['id'],
            'name'            => $r['name'],
            'email'           => $r['email'],
            'phone'           => $r['phone'],
            'subject'         => $r['subject'],
            'productInterest' => $r['product_interest'],
            'message'         => $r['message'],
            'isRead'          => (bool)$r['is_read'],
            'createdAt'       => $r['created_at'],
        ];
    }
}
