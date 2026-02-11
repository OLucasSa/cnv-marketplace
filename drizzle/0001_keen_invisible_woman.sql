CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100) NOT NULL,
	`price` varchar(50) NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`imageUrl` text,
	`imageKey` varchar(255),
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`colors` text,
	`sizes` text,
	`specifications` text,
	`features` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
