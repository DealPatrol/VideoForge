import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const voiceoversTable = pgTable("voiceovers", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, generating, ready, error
  url: text("url"),
  voice: text("voice").notNull().default("nova"),
  duration: integer("duration"),
  error: text("error"),
  isMock: boolean("is_mock").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVoiceoverSchema = createInsertSchema(voiceoversTable).omit({ createdAt: true });
export type InsertVoiceover = z.infer<typeof insertVoiceoverSchema>;
export type Voiceover = typeof voiceoversTable.$inferSelect;
