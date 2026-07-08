-- ============================================================
--  Refrescaña MySQL Schema
--  Uso directo: mysql -u root -p < backend/sql/schema.sql
--  O bien ejecutar: php backend/sql/seed.php
-- ============================================================

-- Eliminar y recrear la base de datos limpia
DROP DATABASE IF EXISTS `refrescana`;
CREATE DATABASE `refrescana`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `refrescana`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------
-- users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`         CHAR(36)     NOT NULL PRIMARY KEY,
  `name`       VARCHAR(255) NOT NULL,
  `email`      VARCHAR(255) NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `role`       ENUM('ADMIN','EDITOR','SALES','CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- categories
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          CHAR(36)     NOT NULL PRIMARY KEY,
  `name`        VARCHAR(255) NOT NULL,
  `slug`        VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT         NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- products
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id`          CHAR(36)       NOT NULL PRIMARY KEY,
  `name`        VARCHAR(255)   NOT NULL,
  `slug`        VARCHAR(255)   NOT NULL UNIQUE,
  `description` TEXT           NOT NULL,
  `price`       DECIMAL(10,2)  NOT NULL,
  `stock`       INT            NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)     NOT NULL DEFAULT 1,
  `category_id` CHAR(36)       NOT NULL,
  `created_at`  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- product_images
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_images` (
  `id`         CHAR(36)     NOT NULL PRIMARY KEY,
  `product_id` CHAR(36)     NOT NULL,
  `url`        VARCHAR(512) NOT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- orders
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id`                 CHAR(36)       NOT NULL PRIMARY KEY,
  `receipt_number`     VARCHAR(20)    NULL UNIQUE,
  `status`             ENUM('PENDING','PAYMENT_UPLOADED','PAID','PREPARING','SHIPPED','DELIVERED','CANCELLED','REJECTED')
                                      NOT NULL DEFAULT 'PENDING',
  `source`             VARCHAR(50)    NULL DEFAULT NULL,
  `customer_name`      VARCHAR(255)   NOT NULL,
  `customer_email`     VARCHAR(255)   NOT NULL,
  `customer_phone`     VARCHAR(50)    NOT NULL,
  `customer_dni`       VARCHAR(20)    NULL,
  `shipping_address`   VARCHAR(500)   NOT NULL,
  `shipping_city`      VARCHAR(255)   NOT NULL,
  `shipping_province`  VARCHAR(255)   NOT NULL,
  `shipping_district`  VARCHAR(255)   NULL,
  `shipping_zone`      VARCHAR(100)   NULL,
  `shipping_notes`     TEXT           NULL,
  `shipping_cost`      DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  `total_amount`       DECIMAL(10,2)  NOT NULL,
  `yape_voucher_url`   VARCHAR(512)   NULL,
  `yape_security_code` VARCHAR(100)   NULL,
  `yape_payment_time`  VARCHAR(20)    NULL,
  `created_at`         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_orders_email` (`customer_email`),
  INDEX `idx_orders_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- order_items
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id`         CHAR(36)      NOT NULL PRIMARY KEY,
  `order_id`   CHAR(36)      NOT NULL,
  `product_id` CHAR(36)      NOT NULL,
  `quantity`   INT           NOT NULL,
  `price`      DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_id`)   REFERENCES `orders`(`id`)   ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- blog_posts
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id`         CHAR(36)     NOT NULL PRIMARY KEY,
  `title`      VARCHAR(255) NOT NULL,
  `slug`       VARCHAR(255) NOT NULL UNIQUE,
  `content`    LONGTEXT     NOT NULL,
  `image_url`  VARCHAR(512) NULL,
  `published`  TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- contact_messages
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`               CHAR(36)     NOT NULL PRIMARY KEY,
  `name`             VARCHAR(255) NOT NULL,
  `email`            VARCHAR(255) NOT NULL,
  `phone`            VARCHAR(50)  NULL,
  `subject`          VARCHAR(255) NULL,
  `product_interest` VARCHAR(255) NULL,
  `message`          TEXT         NOT NULL,
  `is_read`          TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_contact_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- notifications
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id`         CHAR(36)     NOT NULL PRIMARY KEY,
  `type`       VARCHAR(50)  NOT NULL,
  `title`      VARCHAR(255) NOT NULL,
  `message`    TEXT         NOT NULL,
  `order_id`   CHAR(36)     NULL,
  `is_read`    TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notif_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
