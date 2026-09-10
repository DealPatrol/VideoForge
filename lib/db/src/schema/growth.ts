import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
  real,
} from "drizzle-orm/pg-core";

export type GrowthStrategy = {
  pillars: string[];
  targetLengthSeconds: [number, number];
  hookTestCount: number;
  successThresholds: {
    threeSecondHoldRate: number;
    averagePercentageViewed: number;
    shareRate: number;
    followerConversionRate: number;
  };
};

export type PlatformVariant = {
  platform: "youtube" | "instagram" | "tiktok" | "facebook";
  title: string;
  caption: string;
  scheduledAt?: string;
};

export type PostMetrics = {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  followersGained?: number;
  threeSecondHoldRate?: number;
  averagePercentageViewed?: number;
};

export const growthCampaignsTable = pgTable("growth_campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  niche: text("niche").notNull(),
  audience: text("audience").notNull().default("English-speaking US audience"),
  status: text("status").notNull().default("active"),
  platforms: jsonb("platforms")
    .$type<string[]>()
    .notNull()
    .default(["youtube", "instagram", "tiktok", "facebook"]),
  goalFollowers: integer("goal_followers").notNull().default(100000),
  currentFollowers: integer("current_followers").notNull().default(0),
  videosPerDay: integer("videos_per_day").notNull().default(2),
  approvalRequired: boolean("approval_required").notNull().default(true),
  strategy: jsonb("strategy").$type<GrowthStrategy>().notNull(),
  lastRunAt: timestamp("last_run_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const growthPostsTable = pgTable("growth_posts", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  projectId: text("project_id").notNull(),
  topic: text("topic").notNull(),
  contentPillar: text("content_pillar").notNull(),
  seriesName: text("series_name").notNull(),
  hook: text("hook").notNull(),
  hookVariants: jsonb("hook_variants").$type<string[]>().notNull().default([]),
  script: text("script").notNull(),
  visualPlan: jsonb("visual_plan").$type<string[]>().notNull().default([]),
  platformVariants: jsonb("platform_variants")
    .$type<PlatformVariant[]>()
    .notNull()
    .default([]),
  status: text("status").notNull().default("awaiting_approval"),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  metrics: jsonb("metrics").$type<PostMetrics>().notNull().default({}),
  performanceScore: real("performance_score"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
