import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { callOpenAIJSON } from "../lib/ai";

const router = Router();

const MOCK_ANALYSIS = {
  hookType: "Problem-agitation-solution",
  pacing: "Fast-paced with cuts every 2-4 seconds",
  storyStructure: "Hook → Problem → Story → Solution → CTA",
  captionDensity: "High — captions present throughout at 85% coverage",
  ctaTiming: "CTA appears at 75% and 95% of video duration",
  audienceAngle: "Beginner-friendly with relatable struggles",
  estimatedDuration: 480,
  keyPatterns: [
    "Strong emotional hook in first 3 seconds",
    "Relatable thumbnail with text overlay",
    "Personal story woven into advice",
    "Multiple CTAs at strategic intervals",
    "B-roll heavily used over voiceover",
  ],
  contentWarnings: [
    "Do not copy the specific examples, metaphors, or phrasing",
    "Original scripting required — use pattern inspiration only",
  ],
  summary: "Demo analysis: fast-paced problem-solution format targeting beginners with strong hook and multi-CTA structure. Use these patterns to inspire your own original video.",
  isMock: true,
};

router.post("/analyze", async (req, res): Promise<void> => {
  try {
    const { url, topic, projectId } = req.body;
    if (!projectId) res.status(400).json({ error: "projectId is required" });
 return;

    // Update project status
    await db.update(projectsTable).set({ status: "analyzing", updatedAt: new Date() }).where(eq(projectsTable.id, projectId));

    let result = { ...MOCK_ANALYSIS, projectId, isMock: true };

    const subject = url || topic;
    if (subject) {
      const aiResult = await callOpenAIJSON(
        `Analyze this YouTube reference for a video creator. Subject: "${subject}". 
         Extract NON-PROTECTABLE patterns only (not actual content). 
         Return JSON with fields: hookType, pacing, storyStructure, captionDensity, ctaTiming, audienceAngle, estimatedDuration (seconds), keyPatterns (array of 5 strings), contentWarnings (array of 2 strings), summary.
         Focus on structural patterns, timing, and approach — NOT specific content, jokes, or scripts.`,
        "You are a video strategy analyst. Extract only structural and stylistic patterns, never copyrightable content."
      );
      if (aiResult) {
        const r = aiResult as Record<string, unknown>;
        result = {
          projectId,
          hookType: String(r["hookType"] ?? MOCK_ANALYSIS.hookType),
          pacing: String(r["pacing"] ?? MOCK_ANALYSIS.pacing),
          storyStructure: String(r["storyStructure"] ?? MOCK_ANALYSIS.storyStructure),
          captionDensity: String(r["captionDensity"] ?? MOCK_ANALYSIS.captionDensity),
          ctaTiming: String(r["ctaTiming"] ?? MOCK_ANALYSIS.ctaTiming),
          audienceAngle: String(r["audienceAngle"] ?? MOCK_ANALYSIS.audienceAngle),
          estimatedDuration: Number(r["estimatedDuration"] ?? MOCK_ANALYSIS.estimatedDuration),
          keyPatterns: Array.isArray(r["keyPatterns"]) ? (r["keyPatterns"] as unknown[]).map(String) : MOCK_ANALYSIS.keyPatterns,
          contentWarnings: Array.isArray(r["contentWarnings"]) ? (r["contentWarnings"] as unknown[]).map(String) : MOCK_ANALYSIS.contentWarnings,
          summary: String(r["summary"] ?? MOCK_ANALYSIS.summary),
          isMock: false,
        };
      }
    }

    // Update project status to concepts
    await db.update(projectsTable).set({
      status: "concepts",
      referenceUrl: url ?? null,
      referenceTopic: topic ?? null,
      updatedAt: new Date(),
    }).where(eq(projectsTable.id, projectId));

    res.json(result);
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
