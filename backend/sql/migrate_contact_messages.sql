-- Migration: add is_read and product_interest to contact_messages
-- Run once on existing databases:
--   mysql -u root -p refrescana < backend/sql/migrate_contact_messages.sql

USE `refrescana`;

ALTER TABLE `contact_messages`
  ADD COLUMN IF NOT EXISTS `product_interest` VARCHAR(255) NULL AFTER `subject`,
  ADD COLUMN IF NOT EXISTS `is_read` TINYINT(1) NOT NULL DEFAULT 0 AFTER `message`,
  ADD INDEX IF NOT EXISTS `idx_contact_read` (`is_read`);
