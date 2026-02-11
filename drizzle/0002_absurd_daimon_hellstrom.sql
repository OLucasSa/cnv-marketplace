ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','editor') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `products` ADD `createdBy` int;