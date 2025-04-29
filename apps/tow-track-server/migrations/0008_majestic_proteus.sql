PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`is_intercity` integer DEFAULT 0 NOT NULL,
	`location_url` text,
	`phone` text,
	`client_telegram_id` integer,
	`vehicle_info` text NOT NULL,
	`partner_id` integer,
	`price` real,
	`status` text DEFAULT 'searching' NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`partner_id`) REFERENCES `partners`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_orders`("id", "from", "to", "is_intercity", "location_url", "phone", "client_telegram_id", "vehicle_info", "partner_id", "price", "status", "created_at", "updated_at") SELECT "id", "from", "to", "is_intercity", "location_url", "phone", "client_telegram_id", "vehicle_info", "partner_id", "price", "status", "created_at", "updated_at" FROM `orders`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
ALTER TABLE `__new_orders` RENAME TO `orders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;