# Environment check (2026-11-10 11:36 UTC)

| Item | Result |
|---|---|
| python | 3.13.18 |
| numpy | OK |
| node | v22.23.4 |
| npm | 10.9.9 |
| ffmpeg | ffmpeg version 6.1.1-3ubuntu5 Copyright (c) 2000-2023 the FFmpeg developers |
| ffprobe | ffprobe version 6.1.1-3ubuntu5 Copyright (c) 2007-2023 the FFmpeg developers |
| git | git version 2.43.0 |
| chrome/chromium | /opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell |
| disk free here | 31.4 GB (cloud sessions may have a smaller allowance than df shows) |
| reach https://registry.npmjs.org/ | OK (200) |
| reach https://fonts.googleapis.com/ | reachable, HTTP 404 |
| reach https://api.elevenlabs.io/ | blocked/unreachable (URLError) |
| reach https://www.googleapis.com/ | reachable, HTTP 404 |
| env ELEVENLABS_API_KEY | not set |
| env GDRIVE_CLIENT_ID | not set |
| env GDRIVE_CLIENT_SECRET | not set |
| env GDRIVE_REFRESH_TOKEN | not set |
| env REMOTION_BROWSER_EXECUTABLE | not set |

**Suggested mode:** FULL (can render)
Also list the callable tools yourself (Agent, web search/fetch, Drive connector, ElevenLabs MCP, scheduling).

## Callable tools (checked 2026-11-10)
| Tool | Status |
|---|---|
| Agent / subagents (mms-* team + general-purpose) | available |
| Web search (WebSearch, Firecrawl search) | available |
| Client website akumaenterprises-pharma.com | BLOCKED from the container (proxy 403 for curl, Python, Playwright, WebFetch); readable via Firecrawl MCP. Fix: add the domain under Allowed domains in the environment's network settings |
| Google Drive connector (MCP) | available (scripts/drive_upload.py has no GDRIVE_* credentials) |
| ElevenLabs | NOT available: api.elevenlabs.io unreachable, no API key, no MCP |
| Scheduling (scheduled tasks) | available |
| Renderer | verified: Remotion still rendered from the demo engine with the shared engine install |

**Mode: FULL** (render capable). Voice: human recording or another provider until ElevenLabs is configured.
