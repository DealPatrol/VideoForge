import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const conceptsTable = pgTable("concepts", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  angle: text("angle").notNull(),
  hook: text("hook").notNull(),
  structure: text("structure").notNull(),
  targetAudience: text("target_audience").notNull(),
  estimatedDuration: integer("estimated_duration").notNull().default(60),
  uniqueElements: jsonb("unique_elements").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertConceptSchema = createInsertSchema(conceptsTable).omit({ createdAt: true });
export type InsertConcept = z.infer<typeof insertConceptSchema>;
export type Concept = typeof conceptsTable.$inferSelect;
