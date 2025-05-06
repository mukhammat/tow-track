ALTER TABLE `messages` ADD `is_client` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `messages` DROP COLUMN `sender`;