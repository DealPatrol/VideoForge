# VideoForge Pixel Studio Feature Spec

## Goal

Add a mobile-first AI video creation workflow inspired by Google Pixel's newest on-device Studio-style creation experience: fast prompt-to-video, image-to-video, remixing, scene editing, style controls, and one-tap publishing. The feature should feel like a built-in creative studio, not a separate tool bolted onto the app.

Working name: **VideoForge Studio**

## Product Positioning

VideoForge Studio turns a raw idea, photo, Drive clip, or trend into a finished Short/Reel with:

- AI-generated concept, script, scenes, captions, voiceover, music direction, and thumbnails.
- Timeline editing with prompt-based changes.
- Rights-safe trend inspiration instead of copying source videos.
- Human approval before publishing.
- YouTube-first export, with Instagram/TikTok-ready variants.

## Core User Flow

1. User opens **Studio** from the main dashboard.
2. User chooses a starting point:
   - Text idea
   - Upload media
   - Google Drive video/photo
   - Trend/topic
   - Product/service promo
   - Repurpose long video
3. Studio generates a **Creative Brief** with target platform, audience, hook, style, video length, CTA, visual sources, and risk/provenance notes.
4. User taps **Generate Draft**.
5. Worker creates script, scene plan, voiceover, captions, timeline JSON, preview MP4, thumbnail options, and title/description/tags.
6. User edits using controls or natural language.
7. User approves, schedules, exports, or publishes.

## Main Screens

### Studio Home

- Prompt box: “What do you want to make?”
- Idea to Short
- Photo to Video
- Drive to YouTube
- Trend to Original Video
- Product Promo
- Local Business Ad
- Long Video to Clips
- Recent projects
- Publishing queue
- Connected accounts status

### Creative Brief Builder

Controls for platform, format, length, goal, tone, visual style, voice, captions, music, and CTA.

### AI Draft Review

Show hook options, script, storyboard, assets, voiceover preview, caption preview, thumbnail concepts, metadata, and safety/provenance before expensive rendering.

### Timeline Studio

Include preview player, scene strip timeline, layer list, prompt edit bar, and inspector panel. Support regenerate, replace, trim, split, caption/visual/voice changes, B-roll, logo/product overlays, before/after, pacing, pattern interrupts, alternate hooks/endings, platform variants, and A/B thumbnails.

### Publish Center

Final preview, platform variants, YouTube metadata, upload status, visibility, scheduling, Drive ready/posted/failed folders, and manual download.

## High-Value Features

### Prompt-Based Video Editing

Store every video as `timeline_json`. Convert natural-language edits into structured operations, apply them to the timeline, and re-render only affected scenes where possible.

### Trend-Informed Originality Guard

Extract topic, hook pattern, pacing structure, audience promise, and emotional arc from trend inspiration, then generate an original video with different words, visuals, voiceover, and assets.

Display: “Studio uses trends for inspiration, not copying. Final approval is yours before publishing.”

### One-Tap Platform Variants

Generate YouTube Shorts, Instagram Reels, TikTok, Facebook Reels, and 16:9 YouTube variants with platform-specific safe zones, hook lengths, end screens, hashtags, metadata, and logo placement.

### Creator Memory

Save business name, logo, colors, offer, CTAs, preferred voice, caption style, audience, platforms, and posting schedule.

### Local Business Mode

Templates for lawn care before/after, fence build promo, real estate listing, restaurant special, auto sales lead video, memorial product story, and contractor job recap.

### Batch Studio

Generate from Drive folders, CSV topic lists, product catalogs, blog URLs, long videos, and weekly trend lists. Queue states: drafting, needs approval, rendering, ready to publish, posted, failed.

### Mobile Capture Companion

Upload phone clips, automatically select best shots, remove dead air, stabilize/crop, generate captions, and turn rough clips into a polished Short.

## Data Model

### `studio_projects`

`id`, `user_id`, `title`, `status`, `source_type`, `source_url`, `source_drive_file_id`, `target_platforms`, `aspect_ratio`, `duration_target_seconds`, `goal`, `tone`, `visual_style`, `created_at`, `updated_at`

### `studio_briefs`

`id`, `project_id`, `prompt`, `audience`, `hook`, `cta`, `style_settings`, `brand_settings`, `safety_notes`, `approved_at`

### `studio_timelines`

`id`, `project_id`, `version`, `timeline_json`, `render_status`, `preview_url`, `final_url`, `created_at`

### `studio_assets`

`id`, `project_id`, `type`, `source`, `url`, `drive_file_id`, `license_status`, `metadata`

### `studio_publish_jobs`

`id`, `project_id`, `platform`, `status`, `scheduled_for`, `published_url`, `error_message`, `created_at`, `updated_at`

## API Routes

- `POST /api/studio/projects`
- `POST /api/studio/projects/:id/brief`
- `POST /api/studio/projects/:id/draft`
- `POST /api/studio/projects/:id/edit`
- `POST /api/studio/projects/:id/render`
- `POST /api/studio/projects/:id/variants`
- `POST /api/studio/projects/:id/publish`

## Worker Jobs

- `studio.generateBrief`
- `studio.generateDraft`
- `studio.applyEdit`
- `studio.renderPreview`
- `studio.renderFinal`
- `studio.publish`

## AI Prompt Contract

Every AI generation response should be structured JSON and validated before saving.

```json
{
  "hook_options": ["string"],
  "script": "string",
  "scenes": [{
    "scene_id": "string",
    "duration_seconds": 4,
    "voiceover": "string",
    "visual_prompt": "string",
    "caption": "string",
    "asset_requirements": ["string"],
    "transition": "cut"
  }],
  "metadata": {
    "title": "string",
    "description": "string",
    "tags": ["string"],
    "hashtags": ["string"]
  },
  "safety": {
    "copyright_risk": "low|medium|high",
    "notes": ["string"]
  }
}
```

## Timeline JSON Contract

```json
{
  "version": 1,
  "canvas": {"width": 1080, "height": 1920, "fps": 30},
  "duration_seconds": 30,
  "tracks": [
    {"type": "video", "clips": []},
    {"type": "voiceover", "clips": []},
    {"type": "captions", "clips": []},
    {"type": "music", "clips": []}
  ]
}
```

## UI Acceptance Criteria

- Studio is reachable from dashboard navigation.
- User can create a project from text prompt.
- User can generate a creative brief before rendering.
- User can generate a preview draft.
- User can edit the draft using at least five structured controls and one prompt edit box.
- User can approve final render.
- User can export/download MP4.
- YouTube publish flow respects private/unlisted/public settings.
- Failed render/publish jobs show clear recovery actions.
- Mobile layout works on iPhone-sized screens without clipped controls.

## Engineering Acceptance Criteria

- Expensive rendering runs in worker service, not Vercel request lifecycle.
- Project state survives refresh.
- Timeline versions are preserved so edits can be undone.
- AI outputs are validated before saving.
- Publishing requires explicit user approval.
- Trend mode generates original content and shows provenance/risk notes.
- Drive ready/posted/failed folders are supported.
- Queue retries are idempotent.

## Implementation Phases

### Phase 1 — Studio MVP
Studio home, prompt to brief, brief to draft, draft preview, manual download.

### Phase 2 — Timeline Editing
Timeline JSON, scene strip, prompt edits, version history, partial re-render.

### Phase 3 — Publishing Workflow
YouTube metadata, private upload, scheduling, Drive folder routing, publish status dashboard.

### Phase 4 — Power Features
Trend originality guard, platform variants, Batch Studio, Creator Memory, Local Business templates.

## Builder Prompt

Add a new VideoForge Studio feature to the existing Next.js video app. Use a Next.js dashboard/UI/API facade, Supabase for auth/metadata/project state/queues, a separate FFmpeg/media worker, Google Drive ready/posted/failed folders, and a YouTube-first upload flow.

Do not render expensive videos inside Vercel functions. Store each video as `timeline_json` so it can be edited, versioned, re-rendered, and turned into platform variants.

Implement `/studio`, Studio project creation, Creative Brief Builder, AI Draft Review, Timeline Studio, API routes, Supabase tables, worker contracts, YouTube publishing, responsive mobile UI, trend-informed originality, one-tap platform variants, creator memory, local-business templates, and batch generation. Use structured validated AI outputs with clear loading/error/retry states and explicit approval before publishing.
