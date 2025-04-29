DROP INDEX `partners_telegram_account_unique`;--> statement-breakpoint
ALTER TABLE `partners` ADD `telegram_id` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `partners_telegram_id_unique` ON `partners` (`telegram_id`);--> statement-breakpoint
ALTER TABLE `partners` DROP COLUMN `telegram_account`;