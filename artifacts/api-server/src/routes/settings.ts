import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { maskKey } from "../lib/ai";

const router = Router();

router.get("/settings", async (req, res) => {
  try {
    const [settings] = await db.select().from(settingsTable).where(eq(settingsTable.id, "singleton")).limit(1);
    const s = settings ?? { openaiApiKey: null, pexelsApiKey: null, youtubeClientId: null, youtubeClientSecret: null, defaultVoice: "nova", defaultFormat: "both" };
    res.json({
      openaiApiKey: maskKey(s.openaiApiKey),
      pexelsApiKey: maskKey(s.pexelsApiKey),
      youtubeClientId: s.youtubeClientId ? maskKey(s.youtubeClientId) : null,
      youtubeClientSecret: s.youtubeClientSecret ? "****" : null,
      defaultVoice: s.defaultVoice ?? "nova",
      defaultFormat: s.defaultFormat ?? "both",
      openaiKeySet: !!s.openaiApiKey,
      pexelsKeySet: !!s.pexelsApiKey,
      youtubeConfigured: !!(s.youtubeClientId && s.youtubeClientSecret),
    });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const { openaiApiKey, pexelsApiKey, youtubeClientId, youtubeClientSecret, defaultVoice, defaultFormat } = req.body;

    const existing = await db.select().from(settingsTable).where(eq(settingsTable.id, "singleton")).limit(1);
    const current = existing[0] ?? {};
    const updates: Record<string, any> = { updatedAt: new Date() };

    // Only update keys if they are not masked (don't have ****)
    if (openaiApiKey !== undefined && !openaiApiKey.includes("****")) updates.openaiApiKey = openaiApiKey || null;
    if (pexelsApiKey !== undefined && !pexelsApiKey.includes("****")) updates.pexelsApiKey = pexelsApiKey || null;
    if (youtubeClientId !== undefined && !youtubeClientId.includes("****")) updates.youtubeClientId = youtubeClientId || null;
    if (youtubeClientSecret !== undefined && youtubeClientSecret !== "****") updates.youtubeClientSecret = youtubeClientSecret || null;
    if (defaultVoice !== undefined) updates.defaultVoice = defaultVoice;
    if (defaultFormat !== undefined) updates.defaultFormat = defaultFormat;

    let settings;
    if (existing.length > 0) {
      [settings] = await db.update(settingsTable).set(updates).where(eq(settingsTable.id, "singleton")).returning();
    } else {
      [settings] = await db.insert(settingsTable).values({ id: "singleton", ...updates }).returning();
    }

    res.json({
      openaiApiKey: maskKey(settings.openaiApiKey),
      pexelsApiKey: maskKey(settings.pexelsApiKey),
      youtubeClientId: settings.youtubeClientId ? maskKey(settings.youtubeClientId) : null,
      youtubeClientSecret: settings.youtubeClientSecret ? "****" : null,
      defaultVoice: settings.defaultVoice ?? "nova",
      defaultFormat: settings.defaultFormat ?? "both",
      openaiKeySet: !!settings.openaiApiKey,
      pexelsKeySet: !!settings.pexelsApiKey,
      youtubeConfigured: !!(settings.youtubeClientId && settings.youtubeClientSecret),
    });
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
