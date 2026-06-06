<?php
declare(strict_types=1);

namespace App\Models;

use App\Database;
use App\Uuid;

class CategoryRepo
{
    public static function listAll(bool $withCount = false): array
    {
        if ($withCount) {
            $rows = Database::pdo()
                ->query('SELECT c.*, COUNT(p.id) AS product_count FROM categories c LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id ORDER BY c.name ASC')
                ->fetchAll();
            return array_map(fn($r) => static::toClient($r, true), $rows);
        }
        $rows = Database::pdo()->query('SELECT * FROM categories ORDER BY name ASC')->fetchAll();
        return array_map([static::class, 'toClient'], $rows);
    }

    public static function findById(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM categories WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $r = $stmt->fetch();
        return $r ? static::toClient($r) : null;
    }

    public static function findBySlug(string $slug): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM categories WHERE slug = ? LIMIT 1');
        $stmt->execute([$slug]);
        $r = $stmt->fetch();
        return $r ? static::toClient($r) : null;
    }

    public static function create(array $data): array
    {
        $id = Uuid::v4();
        $stmt = Database::pdo()->prepare(
            'INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$id, $data['name'], $data['slug'], $data['description'] ?? null]);
        return static::findById($id);
    }

    public static function update(string $id, array $data): ?array
    {
        $stmt = Database::pdo()->prepare(
            'UPDATE categories SET name = ?, slug = ?, description = ?, updated_at = NOW() WHERE id = ?'
        );
        $stmt->execute([$data['name'], $data['slug'], $data['description'] ?? null, $id]);
        return static::findById($id);
    }

    public static function delete(string $id): bool
    {
        $stmt = Database::pdo()->prepare('DELETE FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public static function productCount(string $id): int
    {
        $stmt = Database::pdo()->prepare('SELECT COUNT(*) FROM products WHERE category_id = ?');
        $stmt->execute([$id]);
        return (int)$stmt->fetchColumn();
    }

    private static function toClient(array $r, bool $withCount = false): array
    {
        $out = [
            'id'          => $r['id'],
            'name'        => $r['name'],
            'slug'        => $r['slug'],
            'description' => $r['description'],
        ];
        if ($withCount) $out['_count'] = ['products' => (int)($r['product_count'] ?? 0)];
        return $out;
    }
}
