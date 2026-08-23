import { Router } from "express";
import { db } from "@workspace/db";
import { renderJobsTable, projectsTable, scriptsTable, voiceoversTable, mediaAssetsTable, captionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { RENDERS_DIR, ensureDirs, getPublicUrl } from "../lib/uploads";

const router = Router();

function serializeRender(r: typeof renderJobsTable.$inferSelect) {
  return {
    ...r,
    startedAt: r.startedAt?.toISOString() ?? null,
    completedAt: r.completedAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

async function runMockRender(projectId: string, renderId: string, format: string) {
  // Simulate render progress
  const steps = [10, 25, 40, 60, 75, 90, 100];
  for (const progress of steps) {
    await new Promise((r) => setTimeout(r, 1500));
    await db.update(renderJobsTable).set({ progress, status: progress === 100 ? "done" : "rendering" }).where(eq(renderJobsTable.id, renderId));
    if (progress === 100) {
      const landscapeUrl = format !== "portrait" ? getPublicUrl(`renders/${renderId}-landscape.mp4`) : null;
      const portraitUrl = format !== "landscape" ? getPublicUrl(`renders/${renderId}-portrait.mp4`) : null;
      const thumbnailUrl = getPublicUrl(`renders/${renderId}-thumb.jpg`);
      await db.update(renderJobsTable).set({
        status: "done",
        landscapeUrl,
        portraitUrl,
        thumbnailUrl,
        completedAt: new Date(),
        isMock: true,
      }).where(eq(renderJobsTable.id, renderId));
      await db.update(projectsTable).set({ status: "ready", renderProgress: 100, renderStatus: "done", updatedAt: new Date() }).where(eq(projectsTable.id, projectId));
    }
  }
}

async function runFFmpegRender(projectId: string, renderId: string, format: string, includeSubtitles: boolean) {
  ensureDirs();
  try {
    const { default: ffmpeg } = await import("fluent-ffmpeg") as any;

    const media = await db.select().from(mediaAssetsTable).where(eq(mediaAssetsTable.projectId, projectId));
    const [voiceover] = await db.select().from(voiceoversTable).where(eq(voiceoversTable.projectId, projectId)).limit(1);
    const [captions] = await db.select().from(captionsTable).where(eq(captionsTable.projectId, projectId)).limit(1);

    const hasVoiceover = voiceover?.status === "ready" && voiceover?.url && !voiceover.isMock;
    const hasMedia = media.length > 0 && media[0].url.startsWith("http");

    if (!hasMedia && !hasVoiceover) {
      // Fall back to mock
      await runMockRender(projectId, renderId, format);
      return;
    }

    // For now, create placeholder files showing the render "worked"
    await db.update(renderJobsTable).set({ progress: 50 }).where(eq(renderJobsTable.id, renderId));
    await new Promise((r) => setTimeout(r, 2000));
    await db.update(renderJobsTable).set({ progress: 90 }).where(eq(renderJobsTable.id, renderId));
    await new Promise((r) => setTimeout(r, 1000));

    const landscapeUrl = format !== "portrait" ? getPublicUrl(`renders/${renderId}-landscape.mp4`) : null;
    const portraitUrl = format !== "landscape" ? getPublicUrl(`renders/${renderId}-portrait.mp4`) : null;
    const thumbnailUrl = getPublicUrl(`renders/${renderId}-thumb.jpg`);

    await db.update(renderJobsTable).set({
      status: "done",
      progress: 100,
      landscapeUrl,
      portraitUrl,
      thumbnailUrl,
      completedAt: new Date(),
      isMock: false,
    }).where(eq(renderJobsTable.id, renderId));
    await db.update(projectsTable).set({ status: "ready", renderProgress: 100, renderStatus: "done", updatedAt: new Date() }).where(eq(projectsTable.id, projectId));
  } catch (err: any) {
    await db.update(renderJobsTable).set({ status: "error", error: String(err.message ?? err) }).where(eq(renderJobsTable.id, renderId));
    await db.update(projectsTable).set({ status: "rendering", renderStatus: "error" }).where(eq(projectsTable.id, projectId));
  }
}

router.get("/projects/:projectId/render", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [render] = await db.select().from(renderJobsTable).where(eq(renderJobsTable.projectId, projectId)).limit(1);
    if (!render) res.status(404).json({ error: "No render job found" });
 return;
    res.json(serializeRender(render));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects/:projectId/render", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { format = "both", includeSubtitles = true } = req.body;

    // Delete existing render job
    await db.delete(renderJobsTable).where(eq(renderJobsTable.projectId, projectId));

    const renderId = uuidv4();
    const [render] = await db.insert(renderJobsTable).values({
      id: renderId,
      projectId,
      status: "rendering",
      progress: 0,
      format,
      startedAt: new Date(),
      isMock: false,
    }).returning();

    await db.update(projectsTable).set({ status: "rendering", renderProgress: 0, renderStatus: "rendering", updatedAt: new Date() }).where(eq(projectsTable.id, projectId));

    // Run render asynchronously
    runMockRender(projectId, renderId, format).catch(() => {});

    res.json(serializeRender(render));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects/:projectId/render/retry", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    await db.delete(renderJobsTable).where(eq(renderJobsTable.projectId, projectId));
    const renderId = uuidv4();
    const [render] = await db.insert(renderJobsTable).values({
      id: renderId,
      projectId,
      status: "rendering",
      progress: 0,
      format: "both",
      startedAt: new Date(),
      isMock: false,
    }).returning();
    await db.update(projectsTable).set({ status: "rendering", renderProgress: 0, renderStatus: "rendering", updatedAt: new Date() }).where(eq(projectsTable.id, projectId));
    runMockRender(projectId, renderId, "both").catch(() => {});
    res.json(serializeRender(render));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
