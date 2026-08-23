import { Router } from "express";
import { db } from "@workspace/db";
import { renderJobsTable, projectsTable, settingsTable, captionsTable, scriptsTable, mediaAssetsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/projects/:projectId/publish", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [settings] = await db.select().from(settingsTable).where(eq(settingsTable.id, "singleton")).limit(1);
    const [render] = await db.select().from(renderJobsTable).where(eq(renderJobsTable.projectId, projectId)).limit(1);

    res.json({
      projectId,
      youtubeEnabled: !!(settings?.youtubeClientId && settings?.youtubeClientSecret),
      lastPublishedAt: null,
      youtubeVideoId: null,
      downloadUrls: {
        landscape: render?.landscapeUrl ?? null,
        portrait: render?.portraitUrl ?? null,
        srt: render?.status === "done" ? `/api/projects/${projectId}/download/srt` : null,
        thumbnail: render?.thumbnailUrl ?? null,
        projectJson: `/api/projects/${projectId}/export`,
        attribution: `/api/projects/${projectId}/download/attribution`,
      },
    });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects/:projectId/publish", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { platform = "download", title, description, tags } = req.body;
    const [settings] = await db.select().from(settingsTable).where(eq(settingsTable.id, "singleton")).limit(1);
    const [render] = await db.select().from(renderJobsTable).where(eq(renderJobsTable.projectId, projectId)).limit(1);

    if (platform === "youtube") {
      if (!settings?.youtubeClientId || !settings?.youtubeClientSecret) {
        res.status(400).json({ error: "YouTube not configured. Add OAuth credentials in Settings." });

        return;
      }
      // YouTube upload would go here with googleapis
      res.json({
        success: false,
        platform: "youtube",
        youtubeVideoId: null,
        youtubeUrl: null,
        downloadUrls: {},
        message: "YouTube OAuth upload is configured but requires additional OAuth flow. Use direct download for now.",
      });

      return;
    }

    await db.update(projectsTable).set({ status: "published", updatedAt: new Date() }).where(eq(projectsTable.id, projectId));

    res.json({
      success: true,
      platform: "download",
      youtubeVideoId: null,
      youtubeUrl: null,
      downloadUrls: {
        landscape: render?.landscapeUrl ?? null,
        portrait: render?.portraitUrl ?? null,
        srt: `/api/projects/${projectId}/download/srt`,
        thumbnail: render?.thumbnailUrl ?? null,
        projectJson: `/api/projects/${projectId}/export`,
        attribution: `/api/projects/${projectId}/download/attribution`,
      },
      message: "Project is ready for download.",
    });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

// Download helpers
router.get("/projects/:projectId/download/srt", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [captions] = await db.select().from(captionsTable).where(eq(captionsTable.projectId, projectId)).limit(1);
    if (!captions) res.status(404).json({ error: "No captions found" });
 return;
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename="captions-${projectId}.srt"`);
    res.send(captions.srtContent);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/:projectId/download/attribution", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const media = await db.select().from(mediaAssetsTable).where(eq(mediaAssetsTable.projectId, projectId));
    const lines = [
      "MEDIA ATTRIBUTION",
      "=================",
      "",
      ...media.filter((m) => m.attribution).map((m) => `${m.filename}: ${m.attribution} (${m.license ?? "Pexels License"})`),
      media.filter((m) => m.attribution).length === 0 ? "No external media used." : "",
      "",
      "DISCLAIMER",
      "==========",
      "This video was created with trend-informed original creation using VideoForge.",
      "All scripts and creative content are original. Stock footage used under license.",
    ];
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename="attribution-${projectId}.txt"`);
    res.send(lines.join("\n"));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
