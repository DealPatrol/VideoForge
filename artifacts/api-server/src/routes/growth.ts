import { Router } from "express";
import { and, desc, eq, gte } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import {
  db,
  growthCampaignsTable,
  growthPostsTable,
  projectsTable,
  scriptsTable,
  type GrowthStrategy,
  type PlatformVariant,
  type PostMetrics,
  type ScriptSection,
} from "@workspace/db";
import { callOpenAIJSON } from "../lib/ai";

const router = Router();

const DEFAULT_STRATEGY: GrowthStrategy = {
  pillars: ["fast result", "mistake to avoid", "before and after", "tool test"],
  targetLengthSeconds: [18, 35],
  hookTestCount: 3,
  successThresholds: {
    threeSecondHoldRate: 70,
    averagePercentageViewed: 85,
    shareRate: 1,
    followerConversionRate: 0.5,
  },
};

type GeneratedIdea = {
  topic: string;
  contentPillar: string;
  seriesName: string;
  hookVariants: string[];
  script: string;
  visualPlan: string[];
  titles: Record<string, string>;
  captions: Record<string, string>;
};

function serializeCampaign(row: typeof growthCampaignsTable.$inferSelect) {
  return {
    ...row,
    lastRunAt: row.lastRunAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function serializePost(row: typeof growthPostsTable.$inferSelect) {
  return {
    ...row,
    scheduledAt: row.scheduledAt?.toISOString() ?? null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function fallbackIdeas(
  niche: string,
  recentTopics: readonly string[] = [],
): GeneratedIdea[] {
  const usedTopics = new Set(
    recentTopics.map((topic) => topic.trim().toLowerCase()),
  );
  const seeds = [
    [
      "The expensive mistake almost everyone makes",
      "mistake to avoid",
      "Stop Doing This",
    ],
    [
      "I tested the fastest method so you do not have to",
      "tool test",
      "Worth It or Waste",
    ],
    [
      "Watch this go from bad to finished",
      "before and after",
      "The Transformation",
    ],
    [
      "Three improvements you can make today",
      "fast result",
      "Three Quick Wins",
    ],
    [
      "The result surprised me more than the price",
      "tool test",
      "Real-World Test",
    ],
    [
      "Most advice about this leaves out one critical step",
      "mistake to avoid",
      "The Missing Step",
    ],
  ];
  return seeds.map(([hook, pillar, series]) => {
    const topicBase = `${niche}: ${series}`;
    let edition = 1;
    while (usedTopics.has(`${topicBase} #${edition}`.toLowerCase())) {
      edition += 1;
    }
    const topic = `${topicBase} #${edition}`;
    usedTopics.add(topic.toLowerCase());
    return {
      topic,
      contentPillar: pillar,
      seriesName: series,
      hookVariants: [
        hook,
        `Do not try ${niche} until you see this`,
        `This changes how you think about ${niche}`,
      ],
      script: `${hook}. Here is the problem in one sentence. Now watch the quickest practical solution, step by step. The important detail is the final step because that is where most people lose time or money. Here is the finished result. Follow for the next real-world test.`,
      visualPlan: [
        "0-2s: show the result first",
        "2-7s: demonstrate the problem",
        "7-25s: rapid proof-driven steps",
        "final 3s: payoff and next-episode CTA",
      ],
      titles: {
        youtube: `${series}: ${niche}`,
        instagram: `${series} — ${niche}`,
        tiktok: `${series}: ${niche}`,
        facebook: `${series}: ${niche}`,
      },
      captions: {
        youtube: `A fast, original ${niche} test.`,
        instagram: `Save this before your next ${niche} project.`,
        tiktok: `Would you try this?`,
        facebook: `A practical ${niche} result in under a minute.`,
      },
    };
  });
}

function parseIdeas(
  value: Record<string, unknown> | null,
  niche: string,
  recentTopics: readonly string[],
): GeneratedIdea[] {
  const raw = value?.["ideas"];
  if (!Array.isArray(raw)) return fallbackIdeas(niche, recentTopics);
  const usedTopics = new Set(
    recentTopics.map((topic) => topic.trim().toLowerCase()),
  );
  const ideas = raw
    .slice(0, 6)
    .map((item): GeneratedIdea | null => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const hooks = Array.isArray(row.hookVariants)
        ? row.hookVariants.map(String).filter(Boolean).slice(0, 3)
        : [];
      if (!row.topic || !row.script || hooks.length === 0) return null;
      const titles =
        row.titles && typeof row.titles === "object"
          ? (row.titles as Record<string, string>)
          : {};
      const captions =
        row.captions && typeof row.captions === "object"
          ? (row.captions as Record<string, string>)
          : {};
      return {
        topic: String(row.topic),
        contentPillar: String(row.contentPillar ?? "fast result"),
        seriesName: String(row.seriesName ?? "Fast Results"),
        hookVariants: hooks,
        script: String(row.script),
        visualPlan: Array.isArray(row.visualPlan)
          ? row.visualPlan.map(String).slice(0, 8)
          : [],
        titles,
        captions,
      };
    })
    .filter((idea): idea is GeneratedIdea => {
      if (idea === null) return false;
      const topic = idea.topic.trim().toLowerCase();
      if (usedTopics.has(topic)) return false;
      usedTopics.add(topic);
      return true;
    });
  return ideas.length >= 3 ? ideas : fallbackIdeas(niche, recentTopics);
}

function scoreMetrics(metrics: PostMetrics): number {
  const views = Math.max(metrics.views ?? 0, 1);
  const hold = Math.min(metrics.threeSecondHoldRate ?? 0, 100);
  const viewed = Math.min(metrics.averagePercentageViewed ?? 0, 150);
  const shareRate = ((metrics.shares ?? 0) / views) * 100;
  const followRate = ((metrics.followersGained ?? 0) / views) * 100;
  return Math.round(
    Math.min(
      100,
      hold * 0.3 +
        viewed * 0.35 +
        Math.min(shareRate, 3) * 8 +
        Math.min(followRate, 2) * 10,
    ),
  );
}

function meetsSuccessThresholds(
  metrics: PostMetrics,
  thresholds: GrowthStrategy["successThresholds"],
): boolean {
  const views = metrics.views ?? 0;
  if (views <= 0) return false;
  return (
    (metrics.threeSecondHoldRate ?? 0) >= thresholds.threeSecondHoldRate &&
    (metrics.averagePercentageViewed ?? 0) >=
      thresholds.averagePercentageViewed &&
    ((metrics.shares ?? 0) / views) * 100 >= thresholds.shareRate &&
    ((metrics.followersGained ?? 0) / views) * 100 >=
      thresholds.followerConversionRate
  );
}

function platformVariants(
  idea: GeneratedIdea,
  platforms: string[],
): PlatformVariant[] {
  return platforms.map((platform) => ({
    platform: platform as PlatformVariant["platform"],
    title: idea.titles[platform] ?? idea.topic,
    caption: idea.captions[platform] ?? idea.topic,
  }));
}

router.get("/growth", async (req, res): Promise<void> => {
  try {
    const campaigns = await db
      .select()
      .from(growthCampaignsTable)
      .orderBy(desc(growthCampaignsTable.updatedAt));
    const posts = await db
      .select()
      .from(growthPostsTable)
      .orderBy(desc(growthPostsTable.createdAt));
    const published = posts.filter((post) => post.status === "published");
    const winners = [...published]
      .filter((p) => p.performanceScore !== null)
      .sort((a, b) => (b.performanceScore ?? 0) - (a.performanceScore ?? 0))
      .slice(0, 5);
    res.json({
      campaigns: campaigns.map(serializeCampaign),
      posts: posts.map(serializePost),
      summary: {
        activeCampaigns: campaigns.filter((c) => c.status === "active").length,
        awaitingApproval: posts.filter((p) => p.status === "awaiting_approval")
          .length,
        scheduled: posts.filter((p) => p.status === "scheduled").length,
        published: published.length,
        winners: winners.map(serializePost),
      },
      guardrails: [
        "Use original scripts, licensed media, and distinct edits for every platform.",
        "Never automate follows, likes, comments, or repetitive unsolicited messages.",
        "Keep approval on until real rendering and every platform connection pass a private-post test.",
      ],
    });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/growth/campaigns", async (req, res): Promise<void> => {
  try {
    const { name, niche, audience, platforms, currentFollowers, videosPerDay } =
      req.body;
    if (!name || !niche) {
      res.status(400).json({ error: "name and niche are required" });
      return;
    }
    const selectedPlatforms = Array.isArray(platforms)
      ? platforms.filter((p) =>
          ["youtube", "instagram", "tiktok", "facebook"].includes(p),
        )
      : DEFAULT_PLATFORMS;
    const [campaign] = await db
      .insert(growthCampaignsTable)
      .values({
        id: uuidv4(),
        name: String(name),
        niche: String(niche),
        audience: String(audience || "English-speaking US audience"),
        platforms: selectedPlatforms.length
          ? selectedPlatforms
          : DEFAULT_PLATFORMS,
        currentFollowers: Math.max(0, Number(currentFollowers) || 0),
        videosPerDay: Math.min(3, Math.max(1, Number(videosPerDay) || 2)),
        approvalRequired: true,
        strategy: DEFAULT_STRATEGY,
      })
      .returning();
    res.status(201).json(serializeCampaign(campaign));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

const DEFAULT_PLATFORMS = ["youtube", "instagram", "tiktok", "facebook"];

router.patch(
  "/growth/campaigns/:campaignId",
  async (req, res): Promise<void> => {
    try {
      const { campaignId } = req.params;
      const updates: Partial<typeof growthCampaignsTable.$inferInsert> = {
        updatedAt: new Date(),
      };
      if (["active", "paused"].includes(req.body.status))
        updates.status = req.body.status;
      if (req.body.currentFollowers !== undefined)
        updates.currentFollowers = Math.max(
          0,
          Number(req.body.currentFollowers) || 0,
        );
      if (req.body.videosPerDay !== undefined)
        updates.videosPerDay = Math.min(
          3,
          Math.max(1, Number(req.body.videosPerDay) || 2),
        );
      if (req.body.approvalRequired !== undefined)
        updates.approvalRequired = Boolean(req.body.approvalRequired);
      const [campaign] = await db
        .update(growthCampaignsTable)
        .set(updates)
        .where(eq(growthCampaignsTable.id, campaignId))
        .returning();
      if (!campaign) {
        res.status(404).json({ error: "Campaign not found" });
        return;
      }
      res.json(serializeCampaign(campaign));
    } catch (err) {
      req.log.error({ err });
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.post(
  "/growth/campaigns/:campaignId/run",
  async (req, res): Promise<void> => {
    try {
      const { campaignId } = req.params;
      const [campaign] = await db
        .select()
        .from(growthCampaignsTable)
        .where(eq(growthCampaignsTable.id, campaignId))
        .limit(1);
      if (!campaign || campaign.status !== "active") {
        res.status(404).json({ error: "Active campaign not found" });
        return;
      }
      const recent = await db
        .select()
        .from(growthPostsTable)
        .where(
          and(
            eq(growthPostsTable.campaignId, campaignId),
            gte(
              growthPostsTable.createdAt,
              new Date(Date.now() - 30 * 86400000),
            ),
          ),
        )
        .orderBy(desc(growthPostsTable.createdAt));
      const winners = recent
        .filter((post) =>
          meetsSuccessThresholds(
            post.metrics,
            campaign.strategy.successThresholds,
          ),
        )
        .sort((a, b) => (b.performanceScore ?? 0) - (a.performanceScore ?? 0))
        .slice(0, 5);
      const ai = await callOpenAIJSON(
        `Create exactly 6 original vertical short-video ideas for this growth campaign.\nNiche: ${campaign.niche}\nAudience: ${campaign.audience}\nContent pillars: ${campaign.strategy.pillars.join(", ")}\nAvoid repeating: ${recent.map((p) => p.topic).join(" | ") || "none"}\nWinning patterns to expand: ${winners.map((p) => `${p.seriesName}: ${p.hook}`).join(" | ") || "none yet"}\nEach video must be 18-35 seconds, show the payoff in the first two seconds, deliver proof or a useful result, and end with a natural reason to follow for the next episode. No copied scripts, engagement bait, unverifiable claims, or copyrighted clips.\nReturn JSON { ideas: [{ topic, contentPillar, seriesName, hookVariants: [three distinct hooks], script, visualPlan: [shot instructions], titles: {youtube,instagram,tiktok,facebook}, captions: {youtube,instagram,tiktok,facebook} }] }.`,
        "You are a rigorous short-form growth producer. Optimize for retention, shares, and qualified followers while obeying platform rules.",
      );
      const ideas = parseIdeas(
        ai,
        campaign.niche,
        recent.map((post) => post.topic),
      );
      const created = [];
      const now = Date.now();
      for (let index = 0; index < ideas.length; index += 1) {
        const idea = ideas[index];
        const projectId = uuidv4();
        const postId = uuidv4();
        const scheduledAt = new Date(
          now +
            Math.floor(index / campaign.videosPerDay) * 86400000 +
            (index % campaign.videosPerDay) * 6 * 3600000,
        );
        const words = idea.script.trim().split(/\s+/).filter(Boolean).length;
        const duration = Math.max(
          18,
          Math.min(35, Math.round((words / 165) * 60)),
        );
        const sections: ScriptSection[] = [
          {
            id: uuidv4(),
            type: "hook",
            title: "Hook",
            content: idea.hookVariants[0],
            durationSeconds: 2,
          },
          {
            id: uuidv4(),
            type: "main",
            title: "Proof and payoff",
            content: idea.script,
            durationSeconds: Math.max(13, duration - 5),
          },
          {
            id: uuidv4(),
            type: "cta",
            title: "Next episode",
            content: "Follow for the next real-world test.",
            durationSeconds: 3,
          },
        ];
        await db.insert(projectsTable).values({
          id: projectId,
          title: idea.topic,
          description: `${idea.seriesName} | ${idea.contentPillar}\n${idea.visualPlan.join("\n")}`,
          referenceTopic: campaign.niche,
          status: "draft",
          outputFormats: ["portrait"],
        });
        await db.insert(scriptsTable).values({
          id: uuidv4(),
          projectId,
          content: idea.script,
          sections,
          wordCount: words,
          estimatedDuration: duration,
          isMock: !ai,
        });
        const [post] = await db
          .insert(growthPostsTable)
          .values({
            id: postId,
            campaignId,
            projectId,
            topic: idea.topic,
            contentPillar: idea.contentPillar,
            seriesName: idea.seriesName,
            hook: idea.hookVariants[0],
            hookVariants: idea.hookVariants,
            script: idea.script,
            visualPlan: idea.visualPlan,
            platformVariants: platformVariants(idea, campaign.platforms),
            status: campaign.approvalRequired
              ? "awaiting_approval"
              : "approved",
            scheduledAt,
          })
          .returning();
        created.push(serializePost(post));
      }
      await db
        .update(growthCampaignsTable)
        .set({ lastRunAt: new Date(), updatedAt: new Date() })
        .where(eq(growthCampaignsTable.id, campaignId));
      res
        .status(201)
        .json({
          created,
          usedAI: Boolean(ai),
          message: `Created ${created.length} original short-video packages.`,
        });
    } catch (err) {
      req.log.error({ err });
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.post(
  "/growth/posts/:postId/approve",
  async (req, res): Promise<void> => {
    try {
      const [post] = await db
        .update(growthPostsTable)
        .set({ status: "approved", updatedAt: new Date() })
        .where(eq(growthPostsTable.id, req.params.postId))
        .returning();
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json(serializePost(post));
    } catch (err) {
      req.log.error({ err });
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.post(
  "/growth/posts/:postId/metrics",
  async (req, res): Promise<void> => {
    try {
      const metrics = req.body as PostMetrics;
      const score = scoreMetrics(metrics);
      const [post] = await db
        .update(growthPostsTable)
        .set({
          metrics,
          performanceScore: score,
          status: "published",
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(growthPostsTable.id, req.params.postId))
        .returning();
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json(serializePost(post));
    } catch (err) {
      req.log.error({ err });
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
