CREATE TABLE `a` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`partner_id` integer NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`partner_id`) REFERENCES `partners`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` integer NOT NULL,
	`message` text NOT NULL,
	`sent_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`is_intercity` integer DEFAULT 0 NOT NULL,
	`location_url` text,
	`phone` text,
	`vehicle_info` text NOT NULL,
	`partner_id` integer,
	`price` real,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`partner_id`) REFERENCES `partners`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`iin` text NOT NULL,
	`phone` text NOT NULL,
	`telegram_account` text NOT NULL,
	`vehicle_info` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `partners_iin_unique` ON `partners` (`iin`);--> statement-breakpoint
CREATE UNIQUE INDEX `partners_phone_unique` ON `partners` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `partners_telegram_account_unique` ON `partners` (`telegram_account`);