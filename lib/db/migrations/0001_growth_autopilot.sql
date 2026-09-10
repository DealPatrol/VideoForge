CREATE TABLE IF NOT EXISTS "growth_campaigns" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "niche" text NOT NULL,
  "audience" text DEFAULT 'English-speaking US audience' NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "platforms" jsonb DEFAULT '["youtube","instagram","tiktok","facebook"]'::jsonb NOT NULL,
  "goal_followers" integer DEFAULT 100000 NOT NULL,
  "current_followers" integer DEFAULT 0 NOT NULL,
  "videos_per_day" integer DEFAULT 2 NOT NULL,
  "approval_required" boolean DEFAULT true NOT NULL,
  "strategy" jsonb NOT NULL,
  "last_run_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "growth_posts" (
  "id" text PRIMARY KEY NOT NULL,
  "campaign_id" text NOT NULL,
  "project_id" text NOT NULL,
  "topic" text NOT NULL,
  "content_pillar" text NOT NULL,
  "series_name" text NOT NULL,
  "hook" text NOT NULL,
  "hook_variants" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "script" text NOT NULL,
  "visual_plan" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "platform_variants" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "status" text DEFAULT 'awaiting_approval' NOT NULL,
  "scheduled_at" timestamp,
  "published_at" timestamp,
  "metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "performance_score" real,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "growth_posts_campaign_id_idx" ON "growth_posts" ("campaign_id");
CREATE INDEX IF NOT EXISTS "growth_posts_status_idx" ON "growth_posts" ("status");
CREATE INDEX IF NOT EXISTS "growth_posts_scheduled_at_idx" ON "growth_posts" ("scheduled_at");

