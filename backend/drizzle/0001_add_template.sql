-- Add template column to spaces table
ALTER TABLE "spaces" ADD COLUMN IF NOT EXISTS "template" varchar(50) DEFAULT 'modern' NOT NULL;

