-- Add selected_testimonials column to spaces table
ALTER TABLE "spaces" ADD COLUMN IF NOT EXISTS "selected_testimonials" text;

