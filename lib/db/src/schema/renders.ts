import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const renderJobsTable = pgTable("render_jobs", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  status: text("status").notNull().default("queued"), // queued, rendering, done, error
  progress: integer("progress").notNull().default(0),
  format: text("format").notNull().default("both"), // landscape, portrait, both
  landscapeUrl: text("landscape_url"),
  portraitUrl: text("portrait_url"),
  thumbnailUrl: text("thumbnail_url"),
  error: text("error"),
  isMock: boolean("is_mock").default(false),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRenderJobSchema = createInsertSchema(renderJobsTable).omit({ createdAt: true });
export type InsertRenderJob = z.infer<typeof insertRenderJobSchema>;
export type RenderJob = typeof renderJobsTable.$inferSelect;
