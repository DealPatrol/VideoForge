import { Router } from "express";
import { db } from "@workspace/db";
import { conceptsTable, projectsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { callOpenAIJSON } from "../lib/ai";

const router = Router();

function serializeConcept(c: typeof conceptsTable.$inferSelect) {
  return { ...c, createdAt: c.createdAt.toISOString() };
}

const MOCK_CONCEPTS = [
  {
    title: "The Beginner's Mistake You're Making",
    angle: "Problem-first revelation",
    hook: "I made this mistake for 3 years before I figured out the fix",
    structure: "Hook → Common Mistake → Why It Happens → The Fix → Results → CTA",
    targetAudience: "Beginners who feel stuck and frustrated",
    estimatedDuration: 480,
    uniqueElements: ["Personal failure story", "Specific numbered steps", "Before/after comparison", "Relatable struggle"],
  },
  {
    title: "The Counterintuitive Method That Actually Works",
    angle: "Myth-busting authority",
    hook: "Everything you've been told about this is wrong",
    structure: "Shocking claim → Common belief → Why it fails → Real method → Proof → CTA",
    targetAudience: "Intermediate creators ready for advanced thinking",
    estimatedDuration: 540,
    uniqueElements: ["Contrarian positioning", "Expert-backed claims", "Data points", "Challenge to status quo"],
  },
  {
    title: "How I Did X in 30 Days (Step by Step)",
    angle: "Journey documentary with practical takeaways",
    hook: "30 days ago I had zero. Here's exactly what happened",
    structure: "Results hook → Context → Day-by-day breakdown → Lessons → Your turn → CTA",
    targetAudience: "Action-oriented viewers who want proven systems",
    estimatedDuration: 600,
    uniqueElements: ["Timeline structure", "Transparency about failures", "Repeatable system", "Community invitation"],
  },
];

router.get("/projects/:projectId/concepts", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const concepts = await db.select().from(conceptsTable).where(eq(conceptsTable.projectId, projectId));
    res.json(concepts.map(serializeConcept));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects/:projectId/concepts", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { analysisResult } = req.body;

    // Delete old concepts
    await db.delete(conceptsTable).where(eq(conceptsTable.projectId, projectId));

    let conceptData = MOCK_CONCEPTS;
    const subject = analysisResult?.summary || analysisResult?.hookType;

    if (subject) {
      const aiResult = await callOpenAIJSON(
        `Based on this video analysis, generate 3 completely original video concepts. Analysis: ${JSON.stringify(analysisResult)}.
         Return JSON with a "concepts" array of 3 objects, each with: title, angle, hook, structure, targetAudience, estimatedDuration (seconds), uniqueElements (array of 4 strings).
         Make each concept distinct in angle and audience. All content must be 100% original.`,
        "You are a creative video strategist. Generate original concepts inspired by structural patterns, never copying actual content."
      );
      if (aiResult && Array.isArray(aiResult.concepts) && aiResult.concepts.length >= 3) {
        conceptData = aiResult.concepts;
      }
    }

    const toInsert = conceptData.slice(0, 3).map((c: any) => ({
      id: uuidv4(),
      projectId,
      title: String(c.title),
      angle: String(c.angle),
      hook: String(c.hook),
      structure: String(c.structure),
      targetAudience: String(c.targetAudience),
      estimatedDuration: Number(c.estimatedDuration) || 480,
      uniqueElements: Array.isArray(c.uniqueElements) ? c.uniqueElements.map(String) : [],
    }));

    const inserted = await db.insert(conceptsTable).values(toInsert).returning();
    await db.update(projectsTable).set({ status: "concepts", updatedAt: new Date() }).where(eq(projectsTable.id, projectId));

    res.json(inserted.map(serializeConcept));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects/:projectId/concepts/:conceptId/select", async (req, res): Promise<void> => {
  try {
    const { projectId, conceptId } = req.params;
    const [project] = await db.update(projectsTable).set({
      selectedConceptId: conceptId,
      status: "scripting",
      updatedAt: new Date(),
    }).where(eq(projectsTable.id, projectId)).returning();
    if (!project) res.status(404).json({ error: "Project not found" });
 return;
    res.json({ ...project, createdAt: project.createdAt.toISOString(), updatedAt: project.updatedAt.toISOString() });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
