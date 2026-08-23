import { Router } from "express";
import { db } from "@workspace/db";
import { captionsTable, scriptsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const router = Router();

function serializeCaptions(c: typeof captionsTable.$inferSelect) {
  return { ...c, createdAt: c.createdAt.toISOString() };
}

function formatSrtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function generateSRT(text: string): { srt: string; entries: Array<{ index: number; startTime: string; endTime: string; text: string }> } {
  const words = text.replace(/\[.*?\]/g, "").trim().split(/\s+/).filter(Boolean);
  const wordsPerCaption = 8;
  const secondsPerWord = 0.4;
  const entries = [];
  let srt = "";
  let wordIdx = 0;
  let captionIdx = 1;
  let timeOffset = 0;

  while (wordIdx < words.length) {
    const chunk = words.slice(wordIdx, wordIdx + wordsPerCaption).join(" ");
    const duration = chunk.split(/\s+/).length * secondsPerWord;
    const startTime = formatSrtTime(timeOffset);
    const endTime = formatSrtTime(timeOffset + duration);
    entries.push({ index: captionIdx, startTime, endTime, text: chunk });
    srt += `${captionIdx}\n${startTime} --> ${endTime}\n${chunk}\n\n`;
    timeOffset += duration;
    wordIdx += wordsPerCaption;
    captionIdx++;
  }

  return { srt, entries };
}

router.get("/projects/:projectId/captions", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [captions] = await db.select().from(captionsTable).where(eq(captionsTable.projectId, projectId)).limit(1);
    if (!captions) res.status(404).json({ error: "No captions found" });
 return;
    res.json(serializeCaptions(captions));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects/:projectId/captions", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [script] = await db.select().from(scriptsTable).where(eq(scriptsTable.projectId, projectId)).limit(1);
    const text = script?.content ?? "Demo caption text for VideoForge. Your captions will appear here once you have a script.";
    const { srt, entries } = generateSRT(text);

    const existing = await db.select().from(captionsTable).where(eq(captionsTable.projectId, projectId)).limit(1);
    let captions;
    if (existing.length > 0) {
      [captions] = await db.update(captionsTable).set({ srtContent: srt, entries }).where(eq(captionsTable.projectId, projectId)).returning();
    } else {
      [captions] = await db.insert(captionsTable).values({ id: uuidv4(), projectId, srtContent: srt, entries, language: "en" }).returning();
    }
    res.json(serializeCaptions(captions));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
