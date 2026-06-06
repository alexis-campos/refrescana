-- Add source column to orders (tracks order origin: WEB, WHATSAPP, FACEBOOK, etc.)
ALTER TABLE `orders`
  ADD COLUMN `source` VARCHAR(50) NULL DEFAULT NULL AFTER `status`;
