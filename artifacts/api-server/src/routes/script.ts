import { Router } from "express";
import { db } from "@workspace/db";
import { scriptsTable, conceptsTable, projectsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { callOpenAI, callOpenAIJSON } from "../lib/ai";
import type { ScriptSection } from "@workspace/db";

const router = Router();

function serializeScript(s: typeof scriptsTable.$inferSelect) {
  return { ...s, updatedAt: s.updatedAt.toISOString() };
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function estimateDuration(wordCount: number) {
  return Math.round((wordCount / 150) * 60);
}

const MOCK_SECTIONS: ScriptSection[] = [
  {
    id: "mock-hook",
    type: "hook",
    title: "Hook",
    content: "Here's the one thing that changed everything for me — and I wish someone had told me sooner. Most people are doing this completely wrong, and it's costing them months of wasted effort.",
    durationSeconds: 15,
  },
  {
    id: "mock-intro",
    type: "intro",
    title: "Introduction",
    content: "In this video I'm going to show you exactly how to avoid the most common mistake beginners make — and give you a simple system you can start using today.",
    durationSeconds: 20,
  },
  {
    id: "mock-main",
    type: "main",
    title: "Main Content",
    content: "Let's start with why the conventional approach fails. Most people try the common approach because they've been told it works. But here's what actually happens...\n\nThe real reason this problem occurs is more nuanced than most people think. Once you understand this, everything changes.\n\nHere's the system I developed:\n\nStep 1: Start with the outcome in mind. Define exactly what success looks like before you begin.\nStep 2: Identify the one constraint holding you back. Most problems have a single bottleneck.\nStep 3: Remove that constraint systematically. Work on the cause, not the symptoms.\n\nI've used this approach consistently and the results speak for themselves.",
    durationSeconds: 360,
  },
  {
    id: "mock-cta",
    type: "cta",
    title: "Call to Action",
    content: "If this was helpful, hit that like button — it helps more people find this video. And if you want to go deeper on this topic, subscribe so you don't miss the follow-up.",
    durationSeconds: 20,
  },
  {
    id: "mock-outro",
    type: "outro",
    title: "Outro",
    content: "Thanks for watching. I'll see you in the next one.",
    durationSeconds: 10,
  },
];

router.get("/projects/:projectId/script", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [script] = await db.select().from(scriptsTable).where(eq(scriptsTable.projectId, projectId)).limit(1);
    if (!script) {
      res.status(404).json({ error: "No script found" });
      return;
    }
    res.json(serializeScript(script));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/projects/:projectId/script", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { content, sections } = req.body as { content: string; sections?: ScriptSection[] };
    if (!content) {
      res.status(400).json({ error: "content is required" });
      return;
    }
    const wordCount = countWords(content);
    const estimatedDuration = estimateDuration(wordCount);
    const existing = await db.select().from(scriptsTable).where(eq(scriptsTable.projectId, projectId)).limit(1);

    let script;
    if (existing.length > 0) {
      [script] = await db.update(scriptsTable).set({
        content, sections: sections ?? existing[0].sections, wordCount, estimatedDuration, updatedAt: new Date(),
      }).where(eq(scriptsTable.projectId, projectId)).returning();
    } else {
      [script] = await db.insert(scriptsTable).values({
        id: uuidv4(), projectId, content, sections: sections ?? [], wordCount, estimatedDuration,
      }).returning();
    }
    res.json(serializeScript(script));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects/:projectId/script/generate", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId)).limit(1);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const conceptId = project.selectedConceptId;
    let concept = null;
    if (conceptId) {
      const [c] = await db.select().from(conceptsTable).where(eq(conceptsTable.id, conceptId)).limit(1);
      concept = c ?? null;
    }

    const upsertScript = async (content: string, sections: ScriptSection[], isMock: boolean) => {
      const wordCount = countWords(content);
      const estimatedDuration = estimateDuration(wordCount);
      const existing = await db.select().from(scriptsTable).where(eq(scriptsTable.projectId, projectId)).limit(1);
      if (existing.length > 0) {
        const [s] = await db.update(scriptsTable).set({ content, sections, wordCount, estimatedDuration, isMock, updatedAt: new Date() })
          .where(eq(scriptsTable.projectId, projectId)).returning();
        return s;
      } else {
        const [s] = await db.insert(scriptsTable).values({ id: uuidv4(), projectId, content, sections, wordCount, estimatedDuration, isMock }).returning();
        return s;
      }
    };

    if (concept) {
      const aiText = await callOpenAI(
        `Write an original video script based on this concept: ${JSON.stringify({ title: concept.title, angle: concept.angle, hook: concept.hook, structure: concept.structure })}.
         Write a complete, engaging YouTube script with hook (15s), intro (20s), main content (5+ minutes), CTA (20s), outro (10s).
         This must be 100% original content. Write naturally as a presenter would speak.`,
        "You are a professional YouTube scriptwriter. Write compelling, original scripts optimized for retention."
      );

      if (aiText) {
        const len = aiText.length;
        const sections: ScriptSection[] = [
          { id: uuidv4(), type: "hook", title: "Hook", content: aiText.substring(0, Math.min(300, len)), durationSeconds: 15 },
          { id: uuidv4(), type: "intro", title: "Introduction", content: aiText.substring(Math.min(300, len), Math.min(600, len)), durationSeconds: 20 },
          { id: uuidv4(), type: "main", title: "Main Content", content: aiText.substring(Math.min(600, len), Math.max(0, len - 200)), durationSeconds: 300 },
          { id: uuidv4(), type: "cta", title: "Call to Action", content: aiText.substring(Math.max(0, len - 200), Math.max(0, len - 80)), durationSeconds: 20 },
          { id: uuidv4(), type: "outro", title: "Outro", content: aiText.substring(Math.max(0, len - 80)), durationSeconds: 10 },
        ];
        const script = await upsertScript(aiText, sections, false);
        res.json(serializeScript(script));
        return;
      }
    }

    // Fall back to mock
    const mockSections: ScriptSection[] = MOCK_SECTIONS.map((s) => ({ ...s, id: uuidv4() }));
    const content = mockSections.map((s) => `## ${s.title}\n${s.content}`).join("\n\n");
    const script = await upsertScript(content, mockSections, true);
    res.json(serializeScript(script));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects/:projectId/script/check", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [script] = await db.select().from(scriptsTable).where(eq(scriptsTable.projectId, projectId)).limit(1);
    if (!script) {
      res.status(404).json({ error: "No script found" });
      return;
    }

    let result: { score: number; riskLevel: "low" | "medium" | "high"; issues: string[]; suggestions: string[]; isMock: boolean } = {
      score: 88,
      riskLevel: "low",
      issues: ["Minor phrasing similarity to common industry language — consider rewording"],
      suggestions: ["Use more personal anecdotes", "Add specific original examples", "Vary sentence structure in the intro"],
      isMock: true,
    };

    const aiResult = await callOpenAIJSON(
      `Review this script for originality and similarity risk. Script excerpt: ${script.content.substring(0, 2000)}.
       Return JSON: { score: number 0-100, riskLevel: "low"|"medium"|"high", issues: string[], suggestions: string[] }`,
      "You are an originality reviewer for video content. Provide honest, actionable feedback."
    );

    if (aiResult) {
      const r = aiResult as Record<string, unknown>;
      const rl = String(r["riskLevel"] ?? "low");
      result = {
        score: Number(r["score"]) || 85,
        riskLevel: (rl === "medium" || rl === "high" ? rl : "low") as "low" | "medium" | "high",
        issues: Array.isArray(r["issues"]) ? (r["issues"] as unknown[]).map(String) : result.issues,
        suggestions: Array.isArray(r["suggestions"]) ? (r["suggestions"] as unknown[]).map(String) : result.suggestions,
        isMock: false,
      };
    }

    await db.update(scriptsTable).set({ originalityScore: result.score }).where(eq(scriptsTable.projectId, projectId));
    res.json(result);
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
