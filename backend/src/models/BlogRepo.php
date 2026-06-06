<?php
declare(strict_types=1);

namespace App\Models;

use App\Database;
use App\Uuid;

class BlogRepo
{
    public static function listPublic(): array
    {
        $rows = Database::pdo()->query('SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC')->fetchAll();
        return array_map([static::class, 'toClient'], $rows);
    }

    public static function listAdmin(): array
    {
        $rows = Database::pdo()->query('SELECT * FROM blog_posts ORDER BY created_at DESC')->fetchAll();
        return array_map([static::class, 'toClient'], $rows);
    }

    public static function findBySlug(string $slug, bool $onlyPublished = true): ?array
    {
        $sql = 'SELECT * FROM blog_posts WHERE slug = ?';
        if ($onlyPublished) $sql .= ' AND published = 1';
        $sql .= ' LIMIT 1';
        $stmt = Database::pdo()->prepare($sql);
        $stmt->execute([$slug]);
        $r = $stmt->fetch();
        return $r ? static::toClient($r) : null;
    }

    public static function findById(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM blog_posts WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $r = $stmt->fetch();
        return $r ? static::toClient($r) : null;
    }

    public static function create(array $data): array
    {
        $id = Uuid::v4();
        $stmt = Database::pdo()->prepare('INSERT INTO blog_posts (id, title, slug, content, image_url, published) VALUES (?,?,?,?,?,?)');
        $stmt->execute([
            $id, $data['title'], $data['slug'], $data['content'],
            $data['imageUrl'] ?? null, (int)($data['published'] ?? false),
        ]);
        return static::findById($id);
    }

    public static function update(string $id, array $data): ?array
    {
        $stmt = Database::pdo()->prepare('UPDATE blog_posts SET title=?, slug=?, content=?, image_url=?, published=?, updated_at=NOW() WHERE id=?');
        $stmt->execute([
            $data['title'], $data['slug'], $data['content'],
            $data['imageUrl'] ?? null, (int)$data['published'], $id,
        ]);
        return static::findById($id);
    }

    public static function delete(string $id): bool
    {
        $stmt = Database::pdo()->prepare('DELETE FROM blog_posts WHERE id=?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    private static function toClient(array $r): array
    {
        return [
            'id'        => $r['id'],
            'title'     => $r['title'],
            'slug'      => $r['slug'],
            'content'   => $r['content'],
            'imageUrl'  => $r['image_url'],
            'published' => (bool)$r['published'],
            'createdAt' => $r['created_at'],
            'updatedAt' => $r['updated_at'],
        ];
    }
}
