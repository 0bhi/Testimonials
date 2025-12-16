import {
  pgTable,
  text,
  varchar,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// IMPORTANT: keep this table name in sync with your DB and migrations.
// The initial Drizzle migration creates a table named "users", so we use "users" here.
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  googleId: varchar("google_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const spaces = pgTable(
  "spaces",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    spaceName: varchar("space_name", { length: 255 }).notNull(),
    headerTitle: varchar("header_title", { length: 500 }).notNull(),
    customMessage: varchar("custom_message", { length: 1000 }).notNull(),
    question1: varchar("question1", { length: 500 }).notNull(),
    question2: varchar("question2", { length: 500 }).notNull(),
    question3: varchar("question3", { length: 500 }).notNull(),
    template: varchar("template", { length: 50 }).default("modern").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    spaceNameUserIdIdx: uniqueIndex("space_name_user_id_idx").on(
      table.spaceName,
      table.userId
    ),
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

export const testimonials = pgTable("testimonials", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  content: text("content").notNull(),
  image: varchar("image", { length: 1000 }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  spaceId: text("space_id")
    .notNull()
    .references(() => spaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Space = typeof spaces.$inferSelect;
export type NewSpace = typeof spaces.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
