import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const tasks = pgTable("tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  title: text("title").notNull(),

  description: text("description"),

  status: text("status").notNull().default("TODO"),

  priority: text("priority").notNull().default("MEDIUM"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$onUpdate(() => new Date()),

  completedAt: timestamp("completed_at", {
    withTimezone: true,
    mode: "date",
  }),
});
