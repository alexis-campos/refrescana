<?php
declare(strict_types=1);

namespace App\Models;

use App\Database;
use App\Uuid;

class ProductRepo
{
    public static function listPublic(?string $categorySlug = null): array
    {
        $sql = '
            SELECT p.*, c.name AS category_name, c.slug AS category_slug,
                   pi.url AS first_image
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN product_images pi ON pi.product_id = p.id
                AND pi.id = (SELECT id FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC, id ASC LIMIT 1)
            WHERE p.is_active = 1
        ';
        $params = [];
        if ($categorySlug) {
            $sql .= ' AND c.slug = ?';
            $params[] = $categorySlug;
        }
        $sql .= ' ORDER BY p.created_at DESC';
        $stmt = Database::pdo()->prepare($sql);
        $stmt->execute($params);
        return array_map([static::class, 'toClientPublic'], $stmt->fetchAll());
    }

    public static function listAdmin(): array
    {
        $sql = '
            SELECT p.*, c.name AS category_name, c.slug AS category_slug
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            ORDER BY p.created_at DESC
        ';
        $rows = Database::pdo()->query($sql)->fetchAll();
        return array_map(fn($r) => static::toClientAdmin($r, static::getImages($r['id'])), $rows);
    }

    public static function findBySlugPublic(string $slug): ?array
    {
        $stmt = Database::pdo()->prepare('
            SELECT p.*, c.name AS category_name, c.slug AS category_slug
            FROM products p LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.slug = ? AND p.is_active = 1 LIMIT 1
        ');
        $stmt->execute([$slug]);
        $r = $stmt->fetch();
        if (!$r) return null;
        return static::toClientAdmin($r, static::getImages($r['id']));
    }

    public static function findById(string $id): ?array
    {
        $stmt = Database::pdo()->prepare('
            SELECT p.*, c.name AS category_name, c.slug AS category_slug
            FROM products p LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.id = ? LIMIT 1
        ');
        $stmt->execute([$id]);
        $r = $stmt->fetch();
        if (!$r) return null;
        return static::toClientAdmin($r, static::getImages($id));
    }

    public static function create(array $data): array
    {
        $id   = Uuid::v4();
        $stmt = Database::pdo()->prepare('
            INSERT INTO products (id, name, slug, description, price, stock, is_active, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $id, $data['name'], $data['slug'], $data['description'],
            $data['price'], $data['stock'] ?? 0, (int)($data['isActive'] ?? true), $data['categoryId'],
        ]);

        // Insert images if provided
        $images = array_values(array_filter((array)($data['images'] ?? [])));
        foreach ($images as $order => $url) {
            if ($url) static::insertImage($id, (string)$url, $order);
        }

        return static::findById($id);
    }

    public static function update(string $id, array $data): ?array
    {
        $stmt = Database::pdo()->prepare('
            UPDATE products SET name=?, slug=?, description=?, price=?, stock=?, is_active=?, category_id=?, updated_at=NOW()
            WHERE id=?
        ');
        $stmt->execute([
            $data['name'], $data['slug'], $data['description'],
            $data['price'], $data['stock'], (int)$data['isActive'], $data['categoryId'], $id,
        ]);

        // Replace images if the key is present in the payload
        if (array_key_exists('images', $data)) {
            Database::pdo()->prepare('DELETE FROM product_images WHERE product_id=?')->execute([$id]);
            $images = array_values(array_filter((array)($data['images'] ?? [])));
            foreach ($images as $order => $url) {
                if ($url) static::insertImage($id, (string)$url, $order);
            }
        }

        return static::findById($id);
    }

    public static function delete(string $id): bool
    {
        $stmt = Database::pdo()->prepare('DELETE FROM products WHERE id=?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public static function addImage(string $productId, string $url): array
    {
        $id   = Uuid::v4();
        $sort = (int)Database::pdo()->prepare('SELECT COUNT(*) FROM product_images WHERE product_id=?')
            ->execute([$productId]) ? Database::pdo()->query("SELECT COUNT(*) FROM product_images WHERE product_id='$productId'")->fetchColumn() : 0;
        $stmt = Database::pdo()->prepare('INSERT INTO product_images (id, product_id, url, sort_order) VALUES (?,?,?,?)');
        $stmt->execute([$id, $productId, $url, $sort]);
        return ['id' => $id, 'url' => $url];
    }

    public static function deleteImage(string $id): bool
    {
        $stmt = Database::pdo()->prepare('DELETE FROM product_images WHERE id=?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public static function hasOrders(string $id): bool
    {
        $stmt = Database::pdo()->prepare('SELECT COUNT(*) FROM order_items WHERE product_id=?');
        $stmt->execute([$id]);
        return (int)$stmt->fetchColumn() > 0;
    }

    public static function getFeatured(int $limit = 4): array
    {
        $stmt = Database::pdo()->prepare('
            SELECT p.*, c.name AS category_name, c.slug AS category_slug,
                   pi.url AS first_image
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN product_images pi ON pi.product_id = p.id
                AND pi.id = (SELECT id FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC, id ASC LIMIT 1)
            WHERE p.is_active = 1
            ORDER BY p.created_at DESC
            LIMIT ?
        ');
        $stmt->execute([$limit]);
        return array_map([static::class, 'toClientPublic'], $stmt->fetchAll());
    }

    private static function insertImage(string $productId, string $url, int $sortOrder = 0): void
    {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO product_images (id, product_id, url, sort_order) VALUES (?,?,?,?)'
        );
        $stmt->execute([Uuid::v4(), $productId, $url, $sortOrder]);
    }

    private static function getImages(string $productId): array
    {
        $stmt = Database::pdo()->prepare('SELECT id, url FROM product_images WHERE product_id=? ORDER BY sort_order ASC, id ASC');
        $stmt->execute([$productId]);
        return $stmt->fetchAll();
    }

    private static function toClientPublic(array $r): array
    {
        return [
            'id'           => $r['id'],
            'name'         => $r['name'],
            'slug'         => $r['slug'],
            'description'  => $r['description'],
            'price'        => (float)$r['price'],
            'stock'        => (int)$r['stock'],
            'isActive'     => (bool)$r['is_active'],
            'categoryId'   => $r['category_id'],
            'category'     => [
                'name' => $r['category_name'] ?? '',
                'slug' => $r['category_slug'] ?? '',
            ],
            'image'        => $r['first_image'] ?? '',
            'images'       => $r['first_image'] ? [['id' => '', 'url' => $r['first_image']]] : [],
        ];
    }

    private static function toClientAdmin(array $r, array $images): array
    {
        return [
            'id'          => $r['id'],
            'name'        => $r['name'],
            'slug'        => $r['slug'],
            'description' => $r['description'],
            'price'       => (float)$r['price'],
            'stock'       => (int)$r['stock'],
            'isActive'    => (bool)$r['is_active'],
            'categoryId'  => $r['category_id'],
            'category'    => [
                'id'   => $r['category_id'],
                'name' => $r['category_name'] ?? '',
                'slug' => $r['category_slug'] ?? '',
            ],
            'images'      => $images,
            'createdAt'   => $r['created_at'],
            'updatedAt'   => $r['updated_at'],
        ];
    }
}
