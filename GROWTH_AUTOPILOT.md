# VideoForge Growth Autopilot

Growth Autopilot turns VideoForge into a measured content-growth loop targeting 100,000 genuine followers.

## Production loop

1. Create one campaign with a narrow audience promise.
2. Run a cycle to create six original 18–35 second video packages.
3. Each package includes three opening-hook variations, a complete script, visual directions, and tailored metadata for YouTube, Instagram, TikTok, and Facebook.
4. Approve packages before rendering or publishing.
5. Import post analytics after publishing.
6. The next cycle expands high-scoring series and avoids topics used during the previous 30 days.

## Default operating rules

- Start with two strong videos per day. Increase to three only when the production quality remains consistent.
- Reveal the result or payoff during the first two seconds.
- Use one idea per video and keep most videos between 18 and 35 seconds.
- Build recognizable recurring series instead of unrelated viral attempts.
- Create original scripts and use owned or licensed footage, music, images, and voices.
- Do not automate follows, likes, comments, repetitive direct messages, or artificial engagement.
- Keep human approval enabled until final rendering, OAuth connections, and private-post tests are complete.

## Performance score

The score weights three-second hold rate, average percentage viewed, share rate, and follower conversion. A score of 70 or more marks a format as a candidate for sequels and hook variations.

Initial targets:

- Three-second hold rate: 70% or higher
- Average percentage viewed: 85% or higher
- Share rate: 1% or higher
- Follower conversion: 0.5% or higher

These are internal decision thresholds, not promises of distribution or follower growth.

## Deployment requirements

Apply `lib/db/migrations/0001_growth_autopilot.sql` to the configured PostgreSQL database before opening `/growth`.

Live publishing still requires each account owner to authorize the relevant platform app. YouTube uses OAuth 2.0 and the YouTube Data API. TikTok direct publishing requires an approved app and the `video.publish` scope; draft upload uses `video.upload`. Instagram and Facebook publishing require eligible professional/Page accounts and Meta permissions.

Do not disable approval merely because credentials exist. First complete a private or draft upload on every connected platform and confirm that the final file, caption, rights, and destination account are correct.
