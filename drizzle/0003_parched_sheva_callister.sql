CREATE TABLE `siteSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`heroImageUrl` text,
	`heroImageKey` varchar(255),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteSettings_id` PRIMARY KEY(`id`)
);
