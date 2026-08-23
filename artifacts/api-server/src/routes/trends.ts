import { Router } from "express";
import { db } from "@workspace/db";
import { trendAnalysesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { callOpenAIJSON } from "../lib/ai";

const router = Router();

function serializeTrend(t: typeof trendAnalysesTable.$inferSelect) {
  return { ...t, createdAt: t.createdAt.toISOString() };
}

const MOCK_TREND = (topic: string) => ({
  hookTypes: ["Problem-agitation-solution", "Listicle reveal", "Controversial opinion", "Before/after story"],
  popularFormats: ["8-15 minute deep dive", "60-second shorts", "Tutorial walkthrough", "Talking head with B-roll"],
  audienceInsights: `Audience searching for '${topic}' skews toward motivated beginners and intermediate practitioners who are frustrated with slow progress. They respond well to honest, direct communication and clear step-by-step breakdowns.`,
  contentGaps: [
    "Advanced-level content is underserved",
    "Personal experience stories vs generic advice",
    "Long-term results follow-ups",
    "Budget-focused approaches",
  ],
  recommendedAngles: [
    `The biggest mistake people make with ${topic}`,
    `What I wish I knew before starting ${topic}`,
    `${topic} in 30 days: honest results`,
    `Why popular ${topic} advice is wrong`,
  ],
  isMock: true,
});

router.get("/trends", async (req, res): Promise<void> => {
  try {
    const trends = await db.select().from(trendAnalysesTable).orderBy(desc(trendAnalysesTable.createdAt));
    res.json(trends.map(serializeTrend));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/trends", async (req, res): Promise<void> => {
  try {
    const { topic } = req.body;
    if (!topic) res.status(400).json({ error: "topic is required" });
 return;

    let data = MOCK_TREND(topic);
    let isMock = true;

    const aiResult = await callOpenAIJSON(
      `Analyze YouTube content trends for the topic: "${topic}". 
       Return JSON with: hookTypes (array of 4 popular hook styles), popularFormats (array of 4 video formats), audienceInsights (one detailed paragraph), contentGaps (array of 4 underserved areas), recommendedAngles (array of 4 specific title angles for original videos).
       Base this on general knowledge of what performs well on YouTube for this topic. Be specific and actionable.`,
      "You are a YouTube content strategist with deep knowledge of what makes videos perform well."
    );

    if (aiResult) {
      const r = aiResult as Record<string, unknown>;
      data = {
        hookTypes: Array.isArray(r["hookTypes"]) ? (r["hookTypes"] as unknown[]).map(String) : data.hookTypes,
        popularFormats: Array.isArray(r["popularFormats"]) ? (r["popularFormats"] as unknown[]).map(String) : data.popularFormats,
        audienceInsights: String(r["audienceInsights"] ?? data.audienceInsights),
        contentGaps: Array.isArray(r["contentGaps"]) ? (r["contentGaps"] as unknown[]).map(String) : data.contentGaps,
        recommendedAngles: Array.isArray(r["recommendedAngles"]) ? (r["recommendedAngles"] as unknown[]).map(String) : data.recommendedAngles,
        isMock: false,
      };
      isMock = false;
    }

    const [trend] = await db.insert(trendAnalysesTable).values({
      id: uuidv4(),
      topic,
      ...data,
      isMock,
    }).returning();

    res.json(serializeTrend(trend));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
