import path from "path";
import fs from "fs";

export const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
export const RENDERS_DIR = process.env.RENDERS_DIR || path.join(process.cwd(), "renders");
export const VOICEOVERS_DIR = process.env.VOICEOVERS_DIR || path.join(process.cwd(), "voiceovers");

export function ensureDirs() {
  for (const dir of [UPLOADS_DIR, RENDERS_DIR, VOICEOVERS_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

export function getPublicUrl(subpath: string): string {
  return `/api/files/${subpath}`;
}
