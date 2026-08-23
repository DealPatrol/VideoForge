import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type CaptionEntry = {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
};

export const captionsTable = pgTable("captions", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  srtContent: text("srt_content").notNull(),
  entries: jsonb("entries").$type<CaptionEntry[]>().default([]),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCaptionSchema = createInsertSchema(captionsTable).omit({ createdAt: true });
export type InsertCaption = z.infer<typeof insertCaptionSchema>;
export type Caption = typeof captionsTable.$inferSelect;
