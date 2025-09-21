CREATE TABLE `pain_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`body_part` text NOT NULL,
	`pain_level` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `treatment_forms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pain_entry_id` integer NOT NULL,
	`form_data` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`pain_entry_id`) REFERENCES `pain_entries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `users` (`phone`);