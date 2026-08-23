# VideoForge

A personal-use AI video creation studio — go from trend analysis to a finished YouTube video in one app. Single-user, no billing, no public signup.

## Run & Operate

- `pnpm --filter @workspace/videoforge run dev` — frontend (port set by env)
- `pnpm --filter @workspace/api-server run dev` — API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned on Replit)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4, wouter routing, @tanstack/react-query, framer-motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- AI: OpenAI (GPT-4o-mini for generation, TTS-1 for voiceover)
- Stock footage: Pexels API
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table definitions (projects, concepts, scripts, media, voiceovers, renders, captions, settings, trends)
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/api-server/src/lib/ai.ts` — OpenAI client + Pexels key helpers
- `artifacts/api-server/src/lib/uploads.ts` — file storage paths
- `artifacts/videoforge/src/` — React frontend (pages, components, hooks)
- `lib/api-client-react/src/generated/` — auto-generated React Query hooks (do not edit)

## Product Flow

1. **New Project** → Enter title + YouTube URL or topic
2. **Analyze** → Extract structural patterns (hook type, pacing, story structure, caption density, CTA timing, audience angle)
3. **Concepts** → Generate 3 original video concepts, pick one
4. **Script** → Generate and edit full script with sections; run originality check (0-100 score)
5. **Media** → Search Pexels stock footage/photos, upload owned media
6. **Voiceover** → Generate AI TTS via OpenAI (6 voices, adjustable speed)
7. **Captions** → Auto-generate SRT from script
8. **Render** → Assemble 16:9 landscape + 9:16 portrait (simulated; extend with FFmpeg)
9. **Publish** → Download MP4, SRT, thumbnail, project JSON, attribution text; YouTube upload when OAuth configured

## API Keys (via Settings page)

- `OPENAI_API_KEY` — enables AI script generation, voiceover TTS, originality checks, trend analysis
- `PEXELS_API_KEY` — enables real stock footage/photo search
- YouTube OAuth — client ID + secret for direct YouTube upload
- All features have mock/demo fallbacks when keys are missing

## Architecture decisions

- Mock-first: every AI/external call falls back to realistic demo data when keys are missing, so the app is always testable
- Single-user personal tool: no auth, no multi-tenancy
- PostgreSQL via Replit's built-in database (no SQLite — keeps it consistent with the workspace template)
- OpenAI TTS generates real MP3s saved to `./voiceovers/` on the server; rendered files go to `./renders/`
- Render jobs run async on the server (in-process setTimeout simulation); extend `render.ts` with fluent-ffmpeg for real video assembly

## User preferences

_Populate as you use the app._

## Gotchas

- After OpenAPI spec changes: run `pnpm --filter @workspace/api-spec run codegen` before touching frontend code
- After DB schema changes: run `pnpm --filter @workspace/db run push`
- The render pipeline is currently simulated (progress bar + mock URLs). Wire up fluent-ffmpeg in `artifacts/api-server/src/routes/render.ts` for real video output
- YouTube OAuth upload is stubbed — requires full OAuth flow implementation with googleapis

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
