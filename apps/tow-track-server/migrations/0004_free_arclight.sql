PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_partners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`iin` text NOT NULL,
	`phone` text NOT NULL,
	`telegram_account` integer NOT NULL,
	`vehicle_info` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
INSERT INTO `__new_partners`("id", "first_name", "last_name", "iin", "phone", "telegram_account", "vehicle_info", "created_at") SELECT "id", "first_name", "last_name", "iin", "phone", "telegram_account", "vehicle_info", "created_at" FROM `partners`;--> statement-breakpoint
DROP TABLE `partners`;--> statement-breakpoint
ALTER TABLE `__new_partners` RENAME TO `partners`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `partners_iin_unique` ON `partners` (`iin`);--> statement-breakpoint
CREATE UNIQUE INDEX `partners_phone_unique` ON `partners` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `partners_telegram_account_unique` ON `partners` (`telegram_account`);