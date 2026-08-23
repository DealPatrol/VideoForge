import { Router } from "express";
import { db } from "@workspace/db";
import { voiceoversTable, scriptsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { getOpenAI } from "../lib/ai";
import { VOICEOVERS_DIR, ensureDirs, getPublicUrl } from "../lib/uploads";

const router = Router();

function serializeVoiceover(v: typeof voiceoversTable.$inferSelect) {
  return { ...v, createdAt: v.createdAt.toISOString() };
}

router.get("/projects/:projectId/voiceover", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const [vo] = await db.select().from(voiceoversTable).where(eq(voiceoversTable.projectId, projectId)).limit(1);
    if (!vo) res.status(404).json({ error: "No voiceover found" });
 return;
    res.json(serializeVoiceover(vo));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects/:projectId/voiceover", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { voice = "nova", speed = 1.0 } = req.body;

    ensureDirs();

    // Get script
    const [script] = await db.select().from(scriptsTable).where(eq(scriptsTable.projectId, projectId)).limit(1);
    const scriptText = script?.content ?? "This is a demo voiceover for VideoForge. Your script will be converted to speech here.";

    // Upsert voiceover record as generating
    const existing = await db.select().from(voiceoversTable).where(eq(voiceoversTable.projectId, projectId)).limit(1);
    let voId = existing[0]?.id ?? uuidv4();

    if (existing.length > 0) {
      await db.update(voiceoversTable).set({ status: "generating", voice, error: null, url: null, isMock: false }).where(eq(voiceoversTable.projectId, projectId));
    } else {
      await db.insert(voiceoversTable).values({ id: voId, projectId, status: "generating", voice, isMock: false });
    }

    const openai = await getOpenAI();
    if (!openai) {
      // Mock voiceover
      if (existing.length > 0) {
        await db.update(voiceoversTable).set({ status: "ready", isMock: true, duration: 120, url: null }).where(eq(voiceoversTable.projectId, projectId));
      } else {
        await db.update(voiceoversTable).set({ status: "ready", isMock: true, duration: 120, url: null }).where(eq(voiceoversTable.id, voId));
      }
      const [vo] = await db.select().from(voiceoversTable).where(eq(voiceoversTable.projectId, projectId)).limit(1);
      res.json({ ...serializeVoiceover(vo), isMock: true });

      return;
    }

    try {
      // Truncate script to 4096 chars for TTS
      const ttsText = scriptText.replace(/\[.*?\]/g, "").substring(0, 4000);
      const mp3Response = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice as any,
        input: ttsText,
        speed: Number(speed),
      });

      const filename = `voiceover-${projectId}.mp3`;
      const filepath = path.join(VOICEOVERS_DIR, filename);
      const buffer = Buffer.from(await mp3Response.arrayBuffer());
      await fs.writeFile(filepath, buffer);

      const url = getPublicUrl(`voiceovers/${filename}`);
      const duration = Math.round(ttsText.split(/\s+/).length / 2.5); // rough estimate

      await db.update(voiceoversTable).set({ status: "ready", url, duration, isMock: false, error: null }).where(eq(voiceoversTable.projectId, projectId));
    } catch (err: any) {
      await db.update(voiceoversTable).set({ status: "error", error: String(err.message ?? err) }).where(eq(voiceoversTable.projectId, projectId));
    }

    const [vo] = await db.select().from(voiceoversTable).where(eq(voiceoversTable.projectId, projectId)).limit(1);
    res.json(serializeVoiceover(vo));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
