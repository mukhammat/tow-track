CREATE UNIQUE INDEX `unique_order_partner_chat` ON `chats` (`order_id`,`partner_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_order_partner` ON `offers` (`order_id`,`partner_id`);