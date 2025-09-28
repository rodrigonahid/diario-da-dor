CREATE TABLE "pain_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"body_part" text NOT NULL,
	"pain_level" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treatment_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"pain_entry_id" integer NOT NULL,
	"form_data" json NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "pain_entries" ADD CONSTRAINT "pain_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treatment_forms" ADD CONSTRAINT "treatment_forms_pain_entry_id_pain_entries_id_fk" FOREIGN KEY ("pain_entry_id") REFERENCES "public"."pain_entries"("id") ON DELETE cascade ON UPDATE no action;