# ChapChapCV: Track B, brand extraction

Client: **chapchapcv**. Source: https://chapchapcv.com/fr (public pages only, retrieved 2026-11-11).
Method: Playwright Chromium (desktop UA, fr-FR, light + dark colour scheme). I read `getComputedStyle` on real
elements (h1, h2, paragraphs, nav, buttons, wordmark spans, sections), harvested the hex values from the
stylesheets, converted lab() values to sRGB in the browser, and looked at every screenshot.
Plain HTTP (`brand_extract.py`) is blocked by Cloudflare. `/fr/templates` returned 429, so I stopped after three pages.
Evidence: `raw/brand/` (screenshots, `probe_*.json`). Claims: `ledger_B.csv` (B-001…B-018). Assets: `assets_B.csv`.

## 1. Palette roles (light world)

| Role | Hex | Where it comes from on the site | Contrast (WCAG) |
|---|---|---|---|
| bg | `#FAFAFA` | alternating section background (neutral-50) | — |
| surface | `#FFFFFF` | page, cards (1px `#E5E5E5` border, soft shadow) | — |
| ink | `#18181B` | h1/h2 (zinc-900); body text `#0A0A0A` | 16.97 on bg · 17.72 on white |
| dim | `#4A5565` | lead paragraphs, nav links (gray-600) | 7.24 on bg · 7.56 on white |
| **accent** | **`#FF5500`** | THE action colour: "Créer mon CV", "S'inscrire", "Utiliser ce modèle", the "ChapChap" wordmark, headline payoff words ("commence ici.", "Payez uniquement ce que vous utilisez.") | white on it **3.21**, it on white 3.21, ink on it 5.53 |
| accentDeep | `#E03D00` | orange hover/pressed (14 CSS refs) | white on it 4.34 |
| support[0] | `#059669` | emerald: `theme-color`, CV badge, "Trouver un job", checkmarks, prices | white on it 3.77 |
| support[1] | `#065F46` | deep emerald: badge border + 3D shadow, About-page hero ("green world") | white on it 7.68 |
| support[2] | `#1E2939` | slate for device bodies / UI chrome (gray-800) | white on it ≈ 14.7 |
| tints | `#FFF0E8` orange 8%, emerald 8% | small rounded-full section labels ("Comment ça marche", "Modèles premium") | — |

**Rules for motion**
- Orange is the ONE accent. With white text it is only 3.21:1, which passes WCAG *large text* only. Use it for
  shapes, buttons and big bold words (≥ 40 px bold at 1080 px wide). Never use it for captions or small copy.
- Emerald is the brand's second colour (CV badge, "Jobs", success states). It is a **support** colour: it means
  "done / match / verified" and must never compete with orange as a second subject in the same beat.
- Never put orange text on emerald (2.43:1). On green, orange appears only as a filled pill with white text.

## 2. Dark world (site dark mode)
| Role | Hex | Contrast |
|---|---|---|
| dark | `#0A0A0A` (neutral near-black, not navy) | white 19.8 |
| darkSurface | `#171717` (cards); muted `#262626` | white 17.93 |
| light | `#FFFFFF` headings | — |
| dim on dark | `#99A1AF` | 7.61 on dark · 6.89 on darkSurface |
| accent on dark | `#FF5500` | **6.18**: orange is strongest on black |
| emerald on dark | `#10B981` (or `#059669` = 5.25) | 7.80 |

Orange and emerald are unchanged in dark mode. The footer uses a slate gradient (`#0F172A → #334155`).
**Alternative "green world"**: the About hero is a full-bleed `#065F46` with white type (7.68) and an orange pill CTA.
This is a strong brand-native alternative to black for reveals and end cards.

## 3. Typography
- The site uses **Inter only** (variable 100–900 via next/font): h1 800 at 47.5 px, tracking −0.025em,
  line-height 1.08; h2 700–800; body 400; nav 500; buttons 600–700; the wordmark is Inter **900**.
- Licence: **SIL OFL 1.1** (rsms/inter; Google Fonts). Files in `studio/public/fonts/`: Regular 400,
  SemiBold 600, ExtraBold 800 (TTF, Google Fonts v20, `OFL-Inter-GoogleFonts.txt`) plus the existing Medium 500,
  Bold 700, Black 900 (OTF, `OFL.txt`). Nothing unlicensed is shipped.
- Kinetic type: display = Inter 800/900 with tight tracking. One payoff word in orange per beat, which mirrors the site's
  two-line headline (black line, then orange line).

## 4. Logo
- There is **no published vector**. The header logo is live HTML text: "ChapChap" (Inter 900, `#FF5500`) plus "CV"
  (white Inter 900) on an emerald gradient badge (`#00BC7D → #007A55`, 2 px border `#006045`, radius 10 px, a 3D
  "key-cap" under-shadow `0 4px 0 #065F46` and a soft drop shadow).
- Files (`raw/brand/`): `logo.png` (1366×484, **opaque white box**, orange is `#EF8031`, duller than the live colour),
  `og-image.png` (logo on white, 1200²), `favicon.png` (transparent CV badge), `icon-512(-maskable).png`, and
  `wordmark_live_transparent_4x.png` (the live nav wordmark, captured on black and on white and difference-matted
  to a true transparent PNG; pixels are unchanged, nothing redrawn).
- Studio: `studio/public/brand/logo.png` = the transparent live wordmark (929×246). It reads on white and on a dark
  background (composited and checked). `studio/public/brand/mark-cv.png` = the CV badge (favicon) for app icons and phone mockups.
- **On-dark / inverted version**: the wordmark already works on `#0A0A0A` (orange 6.18:1, badge self-contained).
  On the `#065F46` green world, the orange "ChapChap" is weak (2.4:1), so a **white "ChapChap" variant** would be
  needed. We must **ask the client** for it (and for SVG/AI masters) and not recolour it ourselves. Until then,
  end cards on green use the CV badge alone or sit on black/white.

## 5. Imagery style
- **People**: young Black West African women are the heroes (long braids, emerald blazer or white tee, confident
  smile), holding a phone or a printed CV. One intergenerational Abidjan home/office scene: a mother in white lace
  with a gele and coral beads and her daughter with CV and laptop, with young men in the background. Mood: proud,
  aspirational, warm, "professional success at home in Africa". Named sample personas: **Awa Koffi** (Marketing
  Digital, Abidjan), **Linda Kouassi** (template sample).
- **UI**: floating product cards around the hero (ChapChap Portfolio browser card, ChapChap Jobs "Nouvelle offre ·
  Chargée de marketing · Abidjan · CDI · 92 % Match", CV card), an "Assistant IA" panel (suggestion, missing
  keywords, "+18 points", "78 % Score CV"), credit-pack price list in FCFA, A4 CV template thumbnails.
- **Graphics**: Lucide line icons (2 px stroke) in orange/emerald tinted rounded tiles; pill buttons with a white
  circle + arrow; soft orange radial glow on white; small rounded-full section labels. **No flat illustrations
  and no maps** on the site.
- **Africa**: shown through people, place names (Abidjan, Dakar, Côte d'Ivoire), FCFA prices and "Conçu pour
  l'Afrique". There are no clichés (no savanna or masks). It reads modern, urban and office-ready.
- Caution: the photos look AI-generated, and `hero-woman-4.webp` contains garbled French text. Do not reuse the photos in
  videos (consent and rights are unknown). Use them as mood reference only.

**Mirror in motion**: draw flat African characters in the same casting (young urban professional women and men,
braids/short hair, emerald/white clothing accents) and an intergenerational "family pride" beat. Use phones and A4
CV documents as hero objects. Animate the product's own UI vocabulary: the score ring ("92 % Match"), a "Score CV"
bar filling up, keyword chips appearing, an orange pill button with a white arrow circle, a CV badge that "presses"
like a key cap. Use Abidjan/Dakar maps or route pins (the site uses a map-pin icon). Use the "Linda Kouassi / Awa Koffi"
style naming for sample CVs. Never fake third-party UIs (LinkedIn, ATS vendors). Never use the partner logos (Google,
Simplon, Jokkolab…) without written permission.

## 6. Tone of voice (French)
- **What the name means**: "chap chap" is Nouchi (Ivorian urban French, from Nigerian pidgin) for *vite, rapidement*
  (B-011, REPORTED). The site itself says "**Vitesse ChapChap**: un CV professionnel prêt en moins de 5 minutes".
  The name promises speed with local street credibility. Product family: ChapChap CV / Jobs / Portfolio / Talents
  (bientôt), templates "ChapChap Red/Healthcare/Geometric/Onion/Creative".
- **5 adjectives**: *rapide* · *rassurant* · *ambitieux* · *fier d'être local* · *pratique*.
- **Address**: **vouvoiement** everywhere ("Créez votre CV", "Votre carrière…"). Buttons are in the first person
  ("Créer **mon** CV", "Trouver un job", "Transformer mon CV en portfolio web").
- **Emoji**: none in the site copy. Keep video on-screen text emoji-free; at most a light touch in captions, to be
  agreed with the client.
- **Recurring words**: carrière, parcours, CV professionnel, en quelques minutes, IA ("Notre IA s'occupe de tout",
  "propulsé par l'IA"), ATS / filtres ATS / mots-clés, offres vérifiées, recruteurs, démarquez-vous, écosystème,
  "Conçu pour l'Afrique", marché ivoirien/africain, premium "sans complexité", gratuitement / "Payez uniquement ce
  que vous utilisez" / "Aucun abonnement", FCFA, crédits, "Boostez votre carrière".
- **Sentence shape**: short imperative plus a benefit. Two-beat headlines (statement, then orange payoff). Colons and
  contrasts ("Pas un simple correcteur. Un assistant carrière intégré.").
- **Avoid**: tutoiement in brand copy; heavy Nouchi slang (the name carries the local wink, the copy stays
  professional); anglicisms beyond "job", "ATS" and "portfolio"; unverifiable promises ("trouvez un emploi garanti", "85 %
  de succès", user counts) unless the client proves them (B-013/B-014); "gratuit" without the credit nuance; fear
  tactics about unemployment; clichés about Africa.

## 7. Tokens written
`studio/src/brand/brand.json`: name ChapChapCV · tagline "Votre carrière professionnelle commence ici." · handle
chapchapcv.com · cta "CRÉER MON CV" · logo `brand/logo.png` · colours above · Inter (display 900/800/700, text
400/500/600/700) · texture `clean` · motion `lively`, radius 24, shadow soft. `npx tsc --noEmit` passes.

## 8. Open questions for the client
1. SVG/AI logo masters, plus a white/one-colour wordmark for use on green or photos.
2. Is the logo.png orange (`#EF8031`) old? We use the live `#FF5500`.
3. Rights and consent for the hero photos (AI-generated?). We will not reuse them by default.
4. Proof for the About-page figures and the testimonials before any video quotes them.
5. Is "chap chap" (Nouchi for *vite*) the intended meaning, and may videos play on it?
