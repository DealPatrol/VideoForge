import { Router } from "express";
import { db } from "@workspace/db";
import { mediaAssetsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getPexelsKey } from "../lib/ai";

const router = Router();

function serializeMedia(m: typeof mediaAssetsTable.$inferSelect) {
  return { ...m, createdAt: m.createdAt.toISOString() };
}

const MOCK_STOCK_RESULTS = {
  results: [
    {
      id: "mock-1",
      url: "https://videos.pexels.com/video-files/3571264/3571264-sd_640_360_30fps.mp4",
      thumbnailUrl: "https://images.pexels.com/videos/3571264/free-video-3571264.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      type: "video",
      duration: 30,
      width: 1920,
      height: 1080,
      photographer: "Demo Creator",
      attribution: "Video by Demo Creator on Pexels",
      license: "Pexels License",
    },
    {
      id: "mock-2",
      url: "https://videos.pexels.com/video-files/3214440/3214440-sd_640_360_30fps.mp4",
      thumbnailUrl: "https://images.pexels.com/videos/3214440/free-video-3214440.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      type: "video",
      duration: 45,
      width: 1920,
      height: 1080,
      photographer: "Demo Creator B",
      attribution: "Video by Demo Creator B on Pexels",
      license: "Pexels License",
    },
    {
      id: "mock-3",
      url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
      thumbnailUrl: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      type: "photo",
      duration: null,
      width: 3840,
      height: 2160,
      photographer: "Demo Photographer",
      attribution: "Photo by Demo Photographer on Pexels",
      license: "Pexels License",
    },
  ],
  totalResults: 3,
  page: 1,
  perPage: 15,
  isMock: true,
};

router.get("/projects/:projectId/media", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const media = await db.select().from(mediaAssetsTable).where(eq(mediaAssetsTable.projectId, projectId));
    res.json(media.map(serializeMedia));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/projects/:projectId/media/:mediaId", async (req, res): Promise<void> => {
  try {
    const { mediaId } = req.params;
    await db.delete(mediaAssetsTable).where(eq(mediaAssetsTable.id, mediaId));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects/:projectId/media/stock", async (req, res): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { externalId, url, thumbnailUrl, type, attribution, license, duration, width, height } = req.body;
    if (!externalId || !url || !type || !attribution) {
      res.status(400).json({ error: "externalId, url, type, attribution are required" });

      return;
    }
    const existing = await db.select().from(mediaAssetsTable).where(eq(mediaAssetsTable.projectId, projectId));
    const [asset] = await db.insert(mediaAssetsTable).values({
      id: uuidv4(),
      projectId,
      type,
      source: "pexels",
      url,
      thumbnailUrl: thumbnailUrl ?? null,
      filename: `pexels-${externalId}`,
      duration: duration ?? null,
      width: width ?? null,
      height: height ?? null,
      attribution,
      license: license ?? "Pexels License",
      orderIndex: existing.length,
    }).returning();
    res.status(201).json(serializeMedia(asset));
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/search/stock", async (req, res): Promise<void> => {
  try {
    const { query, page = "1", perPage = "15", type = "video" } = req.query as Record<string, string>;
    if (!query) res.status(400).json({ error: "query is required" });
 return;

    const pexelsKey = await getPexelsKey();
    if (!pexelsKey) {
      res.json({ ...MOCK_STOCK_RESULTS, isMock: true });

      return;
    }

    try {
      const endpoint = type === "photo"
        ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`
        : `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;

      const response = await fetch(endpoint, {
        headers: { Authorization: pexelsKey ?? "" },
      });

      if (!response.ok) {
        res.json({ ...MOCK_STOCK_RESULTS, isMock: true });

        return;
      }

      const data = await response.json() as any;

      if (type === "photo") {
        const results = (data.photos ?? []).map((p: any) => ({
          id: String(p.id),
          url: p.src?.original ?? p.url,
          thumbnailUrl: p.src?.medium ?? p.src?.original,
          type: "photo",
          duration: null,
          width: p.width,
          height: p.height,
          photographer: p.photographer,
          attribution: `Photo by ${p.photographer} on Pexels`,
          license: "Pexels License",
        }));
        res.json({ results, totalResults: data.total_results ?? results.length, page: Number(page), perPage: Number(perPage), isMock: false });

        return;
      } else {
        const results = (data.videos ?? []).map((v: any) => {
          const videoFile = v.video_files?.find((f: any) => f.quality === "hd") ?? v.video_files?.[0];
          return {
            id: String(v.id),
            url: videoFile?.link ?? v.url,
            thumbnailUrl: v.image ?? videoFile?.link,
            type: "video",
            duration: v.duration,
            width: v.width,
            height: v.height,
            photographer: v.user?.name ?? "Unknown",
            attribution: `Video by ${v.user?.name ?? "Unknown"} on Pexels`,
            license: "Pexels License",
          };
        });
        res.json({ results, totalResults: data.total_results ?? results.length, page: Number(page), perPage: Number(perPage), isMock: false });

        return;
      }
    } catch {
      res.json({ ...MOCK_STOCK_RESULTS, isMock: true });

      return;
    }
  } catch (err) {
    req.log.error({ err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
