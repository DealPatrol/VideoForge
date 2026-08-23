import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("settings", {
  id: text("id").primaryKey().default("singleton"),
  openaiApiKey: text("openai_api_key"),
  pexelsApiKey: text("pexels_api_key"),
  youtubeClientId: text("youtube_client_id"),
  youtubeClientSecret: text("youtube_client_secret"),
  defaultVoice: text("default_voice").notNull().default("nova"),
  defaultFormat: text("default_format").notNull().default("both"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ updatedAt: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;
