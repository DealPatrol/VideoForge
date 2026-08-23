import { pgTable, text, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trendAnalysesTable = pgTable("trend_analyses", {
  id: text("id").primaryKey(),
  topic: text("topic").notNull(),
  hookTypes: jsonb("hook_types").$type<string[]>().default([]),
  popularFormats: jsonb("popular_formats").$type<string[]>().default([]),
  audienceInsights: text("audience_insights").notNull(),
  contentGaps: jsonb("content_gaps").$type<string[]>().default([]),
  recommendedAngles: jsonb("recommended_angles").$type<string[]>().default([]),
  isMock: boolean("is_mock").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTrendSchema = createInsertSchema(trendAnalysesTable).omit({ createdAt: true });
export type InsertTrend = z.infer<typeof insertTrendSchema>;
export type TrendAnalysis = typeof trendAnalysesTable.$inferSelect;
