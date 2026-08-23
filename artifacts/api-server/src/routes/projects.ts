import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable, conceptsTable, scriptsTable, mediaAssetsTable, voiceoversTable, renderJobsTable, captionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const router = Router();

function serializeProject(p: typeof projectsTable.$inferSelect) {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/projects", async (req, res): Promise<void> => {
  try {
    const projects = await db.select().from(projectsTable).orderBy(desc(projectsTable.updatedAt));
    res.json(projects.map(serializeProject));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects", async (req, res): Promise<void> => {
  try {
    const { title, description, referenceUrl, referenceTopic } = req.body;
    if (!title) res.status(400).json({ error: "title is required" });
 return;
    const id = uuidv4();
    const now = new Date();
    const [project] = await db.insert(projectsTable).values({
      id,
      title,
      description: description ?? null,
      referenceUrl: referenceUrl ?? null,
      referenceTopic: referenceTopic ?? null,
      status: "draft",
      outputFormats: [],
    }).returning();
    res.status(201).json(serializeProject(project));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/:projectId", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId)).limit(1);
    if (!project) res.status(404).json({ error: "Project not found" });
 return;
    res.json(serializeProject(project));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/projects/:projectId", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { title, description, status, thumbnailUrl } = req.body;
    const updates: Partial<typeof projectsTable.$inferInsert> = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (thumbnailUrl !== undefined) updates.thumbnailUrl = thumbnailUrl;
    const [project] = await db.update(projectsTable).set(updates).where(eq(projectsTable.id, projectId)).returning();
    if (!project) res.status(404).json({ error: "Project not found" });
 return;
    res.json(serializeProject(project));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/projects/:projectId", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    await db.delete(projectsTable).where(eq(projectsTable.id, projectId));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/:projectId/export", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId)).limit(1);
    if (!project) res.status(404).json({ error: "Project not found" });
 return;
    const concepts = await db.select().from(conceptsTable).where(eq(conceptsTable.projectId, projectId));
    const [script] = await db.select().from(scriptsTable).where(eq(scriptsTable.projectId, projectId)).limit(1);
    const media = await db.select().from(mediaAssetsTable).where(eq(mediaAssetsTable.projectId, projectId));
    const [captions] = await db.select().from(captionsTable).where(eq(captionsTable.projectId, projectId)).limit(1);

    const attribution = media
      .filter((m) => m.attribution)
      .map((m) => `${m.filename}: ${m.attribution} (${m.license ?? "Pexels License"})`)
      .join("\n");

    res.json({
      project: serializeProject(project),
      script: script ? { ...script, updatedAt: script.updatedAt.toISOString() } : null,
      concepts: concepts.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })),
      captions: captions ? { ...captions, createdAt: captions.createdAt.toISOString() } : null,
      mediaAssets: media.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })),
      rightsManifest: {
        projectId,
        exportedAt: new Date().toISOString(),
        disclaimer: "This content was created with trend-informed original creation. Do not copy scripts, footage, music, or creator likenesses.",
        mediaItems: media.map((m) => ({ id: m.id, source: m.source, license: m.license, attribution: m.attribution })),
      },
      attributionText: attribution || "No external media used",
      exportedAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
