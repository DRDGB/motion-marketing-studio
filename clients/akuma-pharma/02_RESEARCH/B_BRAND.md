# Track B: Brand extraction for AKUMA PHARMA

Client: **akuma-pharma** (Akuma Enterprise Pharma Pvt. Ltd., per site meta)
Source: https://akumaenterprises-pharma.com/ (home page, main CSS `assets/index-D_DeLMVN.css`, `logo.svg`, icons, `site.webmanifest`)
Retrieved: 2026-11-10
Method: `scripts/brand_extract.py`, run once the network opened (the first run failed with a proxy 403). Also Firecrawl (branding, screenshots, rawHtml, links), curl of assets and Playwright screenshots, all verified by looking at the screenshots and by sampling pixels.
Status: **DRAFT, not client-approved.** Claim IDs (B-0xx) refer to `ledger_B.csv`; assets are logged in `assets_B.csv`.
Web content was handled as untrusted data. I followed no instructions found in it.

## 1. What the site looks like (verified visually)
Screenshots are in `raw/brand/`: `home_desktop.png`, `home_full.png` and `home_mobile.png` (Playwright), plus `desktop_fullpage_2026-11-10.png` and `mobile_2026-11-10.png` (Firecrawl; on the desktop shot a catalogue pop-up dims the hero).

- **Layout:** a light, clinical B2B layout. Near-white sections alternate between #FFFFFF and #FAFAFB, with thin #E2E8F0 hairlines. The content sits in a centred ~1200 px container. Cards have 14 px corners and soft shadows; buttons are pills. Above the white header sits a dark navy top bar (#06090F) with contact details. The footer is near-black (#0D1117), and just before it a wine-red CTA band uses a #670D1C → #30060D gradient with a 24 px radius. (FACT, observed)
- **Type pairing:** the headings use a high-contrast serif, Playfair Display 700. Each hero headline has one crimson italic emphasis word: "engineered for *confidence.*" Body and UI text use Plus Jakarta Sans. Small uppercase crimson eyebrows sit above sections ("EXPLORE OUR PORTFOLIO", "QUALITY & COMPLIANCE"). Product codes use a system monospace ("AKP-048 · Sterile Dry Powder Vial"). (FACT)
- **The CSS ranking is a hint, not the truth.** The script ranked amber #F59E0B 5th, but amber makes up only about 0.06% of the visible pixels; it comes from shadow tokens (B-021). The CSS variable `--accent` is **green** (hsl 160 84% 39–45%), yet it appears only on "In Stock" status labels. The WhatsApp and Tawk chat green (#03A84E/#25D366) belongs to third-party widgets. Crimson is the only brand hue anyone actually sees, at about 4.3% of the page's pixels (B-002).

## 2. Palette roles (draft tokens in `studio/src/brand/brand.json`)

| Role | Hex | Where it comes from |
|---|---|---|
| bg | **#FAFAFB** | alternating section background |
| surface | **#FFFFFF** | cards, header, hero |
| ink | **#111318** | headings, primary text |
| dim | **#64748B** | secondary text (#475569 for body paragraphs) |
| **accent (ONE action colour)** | **#E31B36** | emphasis word, eyebrows, links, search and CTA buttons, logo gradient start |
| accentDeep | **#B3122B** | theme-color / tile colour, header "Request a Dossier" pill, logo gradient end (B-001) |
| dark (dark world) | **#0D1117** | footer; top bar #06090F |
| darkSurface | **#1E293B** | footer chips and borders |
| light (text on dark) | **#F8FAFC** | |
| support[0] | #CBD5E1 | grid lines, neutral shapes |
| support[1] | #670D1C | wine: CTA band, logo stroke (an alternative "crimson world" for Direction 2) |
| support[2] | #334155 | slate fills |
| support[3] | #FEF2F2 | rose tint (icon tiles, quote block) |
| status only | #059669 | "In stock" labels. Not brand; keep it out of the frames. |

**WCAG contrast (computed; ≥4.5 = AA for body text, ≥3 = AA large):**

| Pair | Ratio | |
|---|---|---|
| ink #111318 on bg #FAFAFB | 17.81:1 | AA |
| ink on surface #FFFFFF | 18.58:1 | AA |
| dim #64748B on bg | 4.56:1 | AA (just) |
| dim on surface | 4.76:1 | AA |
| body #475569 on surface | 7.58:1 | AA |
| accent #E31B36 on surface | 4.69:1 | AA |
| accent on bg #FAFAFB | 4.50:1 | AA, borderline; prefer large text |
| white on accent | 4.69:1 | AA (button text) |
| white on accentDeep #B3122B | 6.91:1 | AA |
| accentDeep on surface | 6.91:1 | AA |
| light #F8FAFC on dark #0D1117 | 18.09:1 | AA |
| #94A3B8 on dark | 7.38:1 | AA |
| **accent on dark** | **4.03:1** | large text only (fine for 132 px display words) |
| accent on darkSurface #1E293B | 3.12:1 | large text only |
| white on wine #670D1C | 12.72:1 | AA |
| #94A3B8 on white | 2.56:1 | FAIL: never use for text on light |
| #059669 on white | 3.77:1 | large only |

Rule for the animators: on dark frames, use accent for large payoff words only. Small red text on dark should use #F87171 (6.84:1).

## 3. Fonts and licences

| Family | Use on site | Licence | Files in `studio/public/fonts/` |
|---|---|---|---|
| **Playfair Display** | headings (`.pharma-serif`), 700 and 700 italic | SIL OFL 1.1, Reserved Font Name "Playfair Display" (B-005) | PlayfairDisplay-SemiBold.ttf (600), -Bold.ttf (700), -BoldItalic.ttf (700 italic) + OFL-PlayfairDisplay.txt |
| **Plus Jakarta Sans** | body, UI, wordmark text | SIL OFL 1.1 (B-006) | PlusJakartaSans-Medium.ttf (500), -Bold.ttf (700), -ExtraBold.ttf (800) + OFL-PlusJakartaSans.txt |
| ui-monospace | product codes | system font, not shippable | none. If needed, pick an OFL mono (e.g. JetBrains Mono / IBM Plex Mono) and log it |
| Lato | Tawk chat widget only | not brand (B-007) | none |

All files are unmodified static TTFs from the Google Fonts API, downloaded 2026-11-10. Because of the Reserved Font Name, never modify a Playfair Display file and redistribute it under that name; using the unmodified files in videos is fine. The Inter files stay as the engine fallback. Note for Phase 4: the engine's `big`/`accent` styles request weight 900, which resolves to the 700 face (the heaviest the site uses), so set them to 700 for brand fidelity.

## 4. Logo
- **`logo.svg`** (copied to `raw/brand/logo.svg`) is the 32×32 header mark and favicon. It is a hexagon filled with a gradient from #E31B36 (top-left) to #B3122B, with a #670D1C stroke. Inside is a white geometric "A" with a counter and a small crimson "molecular node" dot. It is a mark only: the wordmark is live text in Plus Jakarta Sans bold, "Akuma Enterprise Pharma", plus the crimson uppercase descriptor "FINISHED FORMULATIONS & GLOBAL DOSSIERS".
- **PNG icons** (`icon-512.png`, `icon-192.png`, `apple-touch-icon.png`, `favicon-32.png`) are **drawn differently** (B-008): a flat #E31B36 hexagon with no stroke, and an "A" with compass-like legs, a crossbar and a dot. `icon-512.png` is the logo declared in the site's JSON-LD.
- I did not redraw anything. `brand.json` keeps `"logo": null` (the end card shows the name in text) until the client confirms the master. **We must request the official vector logo** (SVG/AI/EPS: mark + horizontal lockup + mono/white versions, plus clear-space rules) and ask which "A" drawing is current.

## 5. Imagery, iconography, motion
- **Photography:** mostly generic laboratory scenes in a cool blue-white grade (a scientist with a pipette, stainless-steel tanks, analytical instruments, a document with pills). They look like stock or AI-generated images, not the client's own facility (INFERENCE). The hero image is a staged vial labelled "PHARMA-CO. … CRIMSON VIAL", clearly a placeholder and not a client product (B-009). The og-image shares the lab photo, and its three stat cards are blank (B-010); tell the client.
- **Product images:** packshots of boxes and vials on white with a slight 3D/mockup look (AKP-002, -005, -048, API-02). Whether these are real packs or renders needs confirming.
- **Icons:** Lucide line icons (thin stroke, crimson) on rose-tinted rounded squares, plus circular outline icons in the supply-chain row. Stamp-like crimson pill badges ("WHO-GMP", "In Stock").
- **Motion on the site:** minimal. Fades of 0.2 s and slides of 0.25 s (`cubic-bezier(0.16,1,0.3,1)`), and 0.3 s colour/shadow transitions. No scroll choreography or video. → tokens `energy: calm`, `texture: clean`, `shadow: soft`, `radius: 24`.
- **Translation to motion (proposal):** clean white "dossier" world → a navy or wine dark-world reveal; one crimson italic serif word per beat; thin line pictograms (vial, hexagon, shipping route, document); mono labels for codes.

## 6. Tone of voice
**Five adjectives:** precise, regulatory-fluent, assured, export-minded (pan-African), procurement-practical.

**Words they use:** WHO-GMP, ISO 9001:2015, Zone IVb (30°C/75% RH), eCTD/ACTD dossiers, NAFDAC / PPB / SAHPRA / TMDA / FDA Ghana / EFDA, CoA, CoPP, batch traceability, "engineered for confidence", "all 54 African countries", "on request", "tender", "procurement", "partner", "healthier Africa & world", "Request a Dossier".

**Words to avoid in our videos:** cure / heal / miracle; "guaranteed", "100% safe", "best/No.1"; "unrestricted"; urgency hype ("hurry", "limited stock"); any patient-benefit or therapeutic claim for named molecules; consumer language for B2B products; slang.

**Claims language for compliance review** (listed for review only; I make no judgement on legality):
1. "WHO-GMP & ISO 9001:2015 certified": a self-claim. Certificate numbers and scope are not shown (B-014).
2. "Exporting to all 54 African countries" and named NRA "readiness" (B-015).
3. "≥99.0% HPLC purity", "Immediate CoA", "In Stock", "24-hour quotes" (B-016, B-018).
4. Research Peptides (RUO) such as BPC-157 and Retatrutide (meta keywords); Semaglutide and Tirzepatide APIs; a "Sexual Wellness Sector" (B-017). These are high-risk topics for social platforms and advertising rules.
5. "Unrestricted custom sourcing" / "any molecule … on request" (B-018).
6. The self-description is inconsistent: "manufacturer and exporter" versus "supplier" sourcing on request (B-019). Clarify before we state either.
7. The JSON-LD gives a founding date of 2009 (B-020); this needs confirming.

## 7. Requests to the client
1. Official vector logo (mark + lockups + mono/reversed versions), plus which "A" drawing is current.
2. A brand guide if one exists (official hex values, typography, do/don't rules). Confirm crimson #E31B36 as the primary and #B3122B as the deep shade.
3. Confirmation that Playfair Display + Plus Jakarta Sans are the brand fonts (or licensed files of others).
4. Their own photography and video (facility, QC lab, warehouse, real product packs) and the rights to it. The site images look like stock or AI.
5. Social media handles (none are linked on the site) and the preferred end-card CTA (draft: "REQUEST A DOSSIER").
6. Evidence for the certification and purity claims, and the name of the regulatory reviewer.
7. FYI fix for them: the og-image stat cards are blank.

## 8. Files
- `clients/akuma-pharma/BRAND_EXTRACT.json`: merged script and Firecrawl output, method "brand_extract.py + firecrawl"
- `clients/akuma-pharma/studio/src/brand/brand.json`: draft tokens. The `_note` key is safe because theme.ts casts `as unknown as Brand`.
- `clients/akuma-pharma/studio/public/fonts/`: 6 TTFs + 2 OFL licence files
- `clients/akuma-pharma/02_RESEARCH/raw/brand/`: logo.svg, icon-512/192, apple-touch-icon, favicon-32, ref_og-image.jpg, ref_hero-vial.jpg, site.webmanifest, brand_extract_script.json, 5 screenshots
- `clients/akuma-pharma/02_RESEARCH/ledger_B.csv` (B-001…B-022), `02_RESEARCH/assets_B.csv` (B-AS-001…022)
