CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"google_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");

CREATE TABLE IF NOT EXISTS "spaces" (
	"id" text PRIMARY KEY NOT NULL,
	"space_name" varchar(255) NOT NULL,
	"header_title" varchar(500) NOT NULL,
	"custom_message" varchar(1000) NOT NULL,
	"question1" varchar(500) NOT NULL,
	"question2" varchar(500) NOT NULL,
	"question3" varchar(500) NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "space_name_user_id_idx" ON "spaces" ("space_name", "user_id");
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "spaces" ("user_id");

CREATE TABLE IF NOT EXISTS "testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"image" varchar(1000),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"space_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

ALTER TABLE "spaces" ADD CONSTRAINT "spaces_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE cascade ON UPDATE no action;
