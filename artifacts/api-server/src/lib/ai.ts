import OpenAI from "openai";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

let openaiClient: OpenAI | null = null;

async function getSettings() {
  const rows = await db.select().from(settingsTable).where(eq(settingsTable.id, "singleton")).limit(1);
  return rows[0] ?? null;
}

export async function getOpenAI(): Promise<OpenAI | null> {
  const settings = await getSettings();
  const key = settings?.openaiApiKey || process.env.OPENAI_API_KEY;
  if (!key) return null;
  if (openaiClient) return openaiClient;
  openaiClient = new OpenAI({ apiKey: key });
  return openaiClient;
}

export async function getPexelsKey(): Promise<string | null> {
  const settings = await getSettings();
  return settings?.pexelsApiKey || process.env.PEXELS_API_KEY || null;
}

export function maskKey(key: string | null | undefined): string | null {
  if (!key) return null;
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "****" + key.slice(-4);
}

export async function callOpenAI(prompt: string, systemPrompt?: string): Promise<string | null> {
  const client = await getOpenAI();
  if (!client) return null;
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 2048,
      temperature: 0.8,
    });
    return res.choices[0]?.message?.content ?? null;
  } catch (err) {
    return null;
  }
}

export async function callOpenAIJSON(prompt: string, systemPrompt?: string): Promise<Record<string, unknown> | null> {
  const client = await getOpenAI();
  if (!client) return null;
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 4096,
      temperature: 0.8,
      response_format: { type: "json_object" },
    });
    const text = res.choices[0]?.message?.content ?? "{}";
    return JSON.parse(text);
  } catch {
    return null;
  }
}
