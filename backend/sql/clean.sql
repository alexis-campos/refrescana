-- ============================================================
--  Refrescaña – Limpieza de base de datos
--  Elimina TODOS los datos excepto el usuario admin
--  Ejecutar: mysql -u root -p refrescana < backend/sql/clean.sql
-- ============================================================

USE `refrescana`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar tablas (hijos primero, luego padres)
DELETE FROM `notifications`;
DELETE FROM `contact_messages`;
DELETE FROM `order_items`;
DELETE FROM `orders`;
DELETE FROM `product_images`;
DELETE FROM `products`;
DELETE FROM `categories`;
DELETE FROM `blog_posts`;

-- Eliminar todos los usuarios EXCEPTO el admin
DELETE FROM `users` WHERE `role` != 'ADMIN';

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  Listo: base de datos limpia, solo queda el usuario admin
-- ============================================================
