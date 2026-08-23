import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";

const router = Router();

router.get("/dashboard", async (req, res): Promise<void> => {
  try {
    const allProjects = await db.select().from(projectsTable).orderBy(desc(projectsTable.updatedAt));
    const total = allProjects.length;
    const completed = allProjects.filter((p) => p.status === "ready" || p.status === "published").length;
    const drafts = allProjects.filter((p) => p.status === "draft").length;
    const recent = allProjects.slice(0, 6);
    const rendering = allProjects.filter((p) => p.status === "rendering");
    res.json({
      totalProjects: total,
      completedRenders: completed,
      draftProjects: drafts,
      recentProjects: recent.map(serializeProject),
      renderingProjects: rendering.map(serializeProject),
    });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

function serializeProject(p: typeof projectsTable.$inferSelect) {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export default router;
