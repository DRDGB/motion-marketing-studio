# Phase 5c: Package and deliver

## The package (one folder per video: `deliverables/<ID>/`)
- `<ID>_v1.mp4`: the video (not committed to git).
- `POST.md`: title, description, hashtags, tags, pinned comment (sources), playlist/series,
  publish slot (date + local time + tz), platform notes, cover frame time. Built from the
  `## Package` section of the script.
- `<ID>.<lang>.srt`: captions from the timeline (exactly what is spoken).
- `<ID>_cover.png`: a still at the cover frame (readable at thumbnail size).
- `QC_REPORT.txt`, `frames/`, `DELIVERED.md` (where it went, md5, QC numbers, open risks).

```bash
python3 -I $SKILL_DIR/scripts/package_episode.py --ws . --id <ID> --script episodes/<ID>/SCRIPT_AND_VOICE.md \
  --timeline studio/src/episodes/<ID>/timeline.json --mp4 renders/<ID>/<ID>_v1.mp4 --thumb 1.6 \
  --date DD-MM-YYYY --slot "18:30 Africa/Abidjan" --slug short-slug [--upload --drive-parent <folderId>]
```

## Copy rules (every platform)
- Title: the viewer's question or the concrete promise; ≤ 60 characters; no clickbait the video does
  not pay off.
- Description: 2–4 short paragraphs in plain language that restate the value; the CTA; 3–5 hashtags.
  No raw URLs unless the client wants them; no "AI voice"/tool credits unless a rule requires it.
- Sources go in a **pinned comment** (short, readable), not the description (unless a regulated
  sector requires on-screen or in-caption references; then follow `10_compliance.md`).
- Regulated sectors: include the mandatory mentions exactly as cleared by the reviewer.

## Platform notes (verify current specs at production time)
| Platform | Aspect | Length sweet spot | Notes |
|---|---|---|---|
| YouTube Shorts | 9:16 | 25–50 s | title + description + pinned comment; playlists by series |
| Instagram Reels | 9:16 | 15–45 s | caption first line = hook; cover crop 4:5 grid preview |
| TikTok | 9:16 | 20–45 s | on-screen text matters; avoid bottom 20% UI zone |
| Facebook Reels | 9:16 | 15–40 s | captions on; strong first frame |
| LinkedIn | 1:1 or 4:5 | 30–60 s | B2B; professional tone; captions required |
| WhatsApp Status | 9:16 | ≤ 30 s per status | export a ≤ 30 s cut-down if used |

## Delivery to Google Drive
- Folder per video: `DD-MM-YYYY_<ID>_<slug>` inside the client's production folder.
- With the bundled uploader (`scripts/drive_upload.py`, env `GDRIVE_CLIENT_ID`, `GDRIVE_CLIENT_SECRET`,
  `GDRIVE_REFRESH_TOKEN`, scope drive.file): `package_episode.py --upload --drive-parent <folderId>`
  uploads MP4 + POST + SRT + cover and verifies the MP4 md5 against Drive. Setup guide:
  `references/11_automation.md` §Drive.
- With a Drive connector instead: upload the same four files and record the links in `DELIVERED.md`.
- No Drive at all: leave the package in `deliverables/<ID>/` and tell the user where it is.

## Human publish step
The client (or the agency) publishes and schedules. Record the actual publish date/time and URL in
`CONTENT_CALENDAR.csv` when they tell you. Never log into or post to their social accounts yourself.
