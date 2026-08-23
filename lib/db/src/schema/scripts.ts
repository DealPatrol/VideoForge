import { pgTable, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scriptsTable = pgTable("scripts", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  content: text("content").notNull(),
  sections: jsonb("sections").$type<ScriptSection[]>().default([]),
  wordCount: integer("word_count").notNull().default(0),
  estimatedDuration: integer("estimated_duration").notNull().default(0),
  originalityScore: integer("originality_score"),
  isMock: boolean("is_mock").default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ScriptSection = {
  id: string;
  type: "hook" | "intro" | "main" | "cta" | "outro";
  title: string;
  content: string;
  durationSeconds: number;
};

export const insertScriptSchema = createInsertSchema(scriptsTable).omit({ updatedAt: true });
export type InsertScript = z.infer<typeof insertScriptSchema>;
export type Script = typeof scriptsTable.$inferSelect;
