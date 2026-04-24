# Fotosoutez Phase 2 backlog

Moved from Phase 1 plan — to be addressed after MVP is live and stable.

## Admin in content-network-cms (admin.samecdigital.com)

- Build new Next.js sidebar item "Fotosoutěž"
- Moderation queue (parallel to `/admin/fotosoutez/moderace/` in agro-svet)
- Round editor (replaces manual SQL in Task 26)
- Statistics dashboard (growth, engagement, geo heatmap)
- Fraud monitoring (IP clusters, velocity alerts)
- Winner announcement with social card generator
- CSV export per round/year

Once ready, remove `/admin/fotosoutez/` pages from agro-svet.

## Other Phase 2

- EXIF deeper parse + pHash duplicate detection
- AI moderation via Cloudflare Workers AI (NSFW + AI-generated)
- Author profile page `/fotosoutez/autor/[slug]/`
- Full archive with year filter
- Comments under entries
- Newsletter flow (opt-in digest)
- Hourly rank-delta snapshot table + cron (show ↑2 in leaderboard)
- Replace our `contest-og` with Cloudflare Images if Resvg is slow
- Image resize on upload (wasm-vips or Cloudflare Images)
