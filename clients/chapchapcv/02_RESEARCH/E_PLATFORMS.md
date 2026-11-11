# E: Platforms and rules (ChapChapCV), light review
_Client: chapchapcv · Track E · run 2026-11-11 · claims in `ledger_E.csv` (E-xxx). Not legal advice. Re-verify specs and
policies at publish time._

## 1. Platforms, specs, posting times

**Priority (INFERENCE from D-035/D-036).** In CI: TikTok, Facebook Reels and WhatsApp Status/Channel first. In SN:
TikTok first. In CM: Facebook first. YouTube Shorts as an archive and for search. LinkedIn for the graduate/professional
segment. Instagram is small in CI (895k).

| Platform | Master format | Length to aim for | Hard limits (reported) | Practical notes | Claims |
|---|---|---|---|---|---|
| TikTok | 1080×1920, 9:16 | 20–60 s (humour 40–65 s) | Canvas 1080×1920. Keep text clear of the top ~12.5% and bottom ~34% (In-Feed template) | Use the official safe-zone template. Burned-in FR captions. Business account means the Commercial Music Library | E-014, E-017 |
| Instagram / Facebook Reels | 1080×1920, 9:16 | 15–60 s | Up to 3 min. Longer Reels reportedly not recommended to new audiences | Cross-post from Meta Business Suite. Keep the FB caption short, with the CTA in the first line | E-012, E-013 |
| YouTube Shorts | 1080×1920 (or 1:1) | 30–60 s | Up to 3 min (since 2024-10-15) | French title with a keyword ("CV", "entretien d'embauche") | E-011 |
| LinkedIn | 1080×1920, or 1080×1350 (4:5) | 30–90 s | 3 s–15 min desktop (10 min mobile reported), 5 GB, 1:2.4–2.4:1 | Calmer, professional cut. Use subtitles: many people watch muted | E-015 |
| WhatsApp Status / Channel | 1080×1920 | ≤ 60 s (safe) | Status up to 90 s (rolled out 2025). Channel limits not confirmed | Export a light file (< 16 MB target) for mobile data. One clear CTA link | E-016 |

**Posting-time hypotheses (INFERENCE, E-021; test in `analytics/EXPERIMENTS.csv`).** Abidjan and Dakar are GMT and
Douala is WAT (GMT+1) (E-020). Use the same local clock times in each city; Douala posts go out one hour earlier in GMT.
- Weekdays 12:00–13:30 local (lunch scroll) and **19:00–21:30 local** (main slot). Douala's main slot is 18:00–20:30 GMT.
- WhatsApp Status 07:00–08:30 local (commute / morning job check).
- Monday morning for job-search content, Sunday 17:00–20:00 for humour.
- The first 4 weeks are an A/B test between the 12:30 and 20:00 slots. Decide on watch-time and shares, not likes.

## 2. Rules for careers and recruitment content

**Claims (10_compliance.md section A, plus section C rows "Recruitment, jobs" and "Education", E-023/E-024)**
- Never promise a job, interview, shortlist, salary or visa. Not even "décroche ton job", unless it is softened to a
  verb about chances ("augmente tes chances", "prépare-toi"). Meta and TikTok ad policies also ban guaranteed
  employment or income and vague job offers (E-003, E-004).
- No get-rich or easy-money framing ("gagne 300 000 F par mois", "sans expérience, embauche immédiate").
- ATS score and match score: show them as **indicative** ("score indicatif"). Never say "100 % compatible = embauché".
- No invented statistics ("90 % des CV sont rejetés…") unless a ledger row backs them.

**People and testimonials**
- Only real people, with **written consent** and real names. Do **not** reuse website testimonials in videos unless the
  client confirms in writing that they are real and consented. Never create synthetic "users", "recruiters" or "success
  stories".
- Illustrated characters are fine. They must not look like real, identifiable people.

**Job offers on screen**
- Show **no real or realistic-looking live job offers** unless the client provides them, they are accurate (role,
  location, pay) and they are dated. Otherwise use fictional companies and label every offer, CV and score screen
  **"Exemple illustratif"**.
- No discriminatory criteria in any example offer: age, sex, ethnicity, religion, marital status, "jolie
  présentation", photo required. Both TikTok and Meta ban discriminatory practices globally (E-002, E-005).
- No real employer logos or brand names. That includes companies named in scam warnings.

**Paid ads (only if the client later runs ads, with their approval)**
- TikTok HEC policy: ads for "employment-seeking services" count as employment ads. The self-declare toggle is
  mandatory for US-based advertisers and for ads targeting the US or Canada (E-001).
- Meta: the Employment special ad category is reported as mandatory for the US, Canada and Europe (E-006). For
  CI/SN/CM-only targeting it is probably not mandatory (INFERENCE). If ads reach France/EU diaspora audiences, select
  it. Re-verify in Ads Manager.
- Branded or paid partnerships with creators: switch on the platform's paid-partnership/branded-content toggle.

**AI disclosure**
- ChapChapCV videos are clearly animated with a designed narrator. As a rule that needs **no** AI label
  (YouTube: E-008; TikTok and Meta label *realistic* synthetic media: E-007, E-009).
- Tick the AI/altered label if a **realistic** synthetic voice or face could pass as a real person, or if a real
  person's voice is cloned. TikTok reportedly requires disclosure on ads with realistic AI content (E-010, low
  confidence). Disclose when in doubt.
- Product honesty: when showing the AI CV or cover-letter writer, show the user **reviewing and editing** the text
  ("l'IA propose, tu valides").

**Music and assets**
- TikTok business accounts use the Commercial Music Library. Those licences do not cover cross-posting to other
  platforms (E-017). Default to studio-licensed or original music logged in `ASSET_REGISTER.csv`.
- Do not reuse the audio of viral comedians, even though competitors' animations do.

**Data and privacy, as content guardrails only**
- In CI, personal data falls under Law n°2013-450 (19 June 2013), with ARTCI as the authority (E-018). ARTCI's stated
  line: tell people why their data is collected, get their consent, and respect their access, objection, rectification
  and deletion rights (E-019).
- In videos: show no real CVs, names, phone numbers or photos of real people. Use **fictional data only**.
- Do not claim "conforme ARTCI", "données 100 % sécurisées" or "déclaré à l'ARTCI" unless the client provides proof
  (a reference number) in writing.
- Senegal and Cameroon have their own data-protection laws. They were not checked in this run, so check them before
  making any privacy claim aimed at those markets.

## 3. Mandatory / recommended mentions for ChapChapCV videos

| Type | Mention (FR) | When |
|---|---|---|
| Mandatory | « Exemple illustratif » | Any on-screen job offer, CV, ATS/match score or user profile |
| Mandatory | Price line confirmed by the client, e.g. « Création gratuite · export PDF payant (crédits, Mobile Money) » plus the date | Any video that mentions price or "gratuit" |
| Mandatory | « Score indicatif » | ATS score or match score shown |
| Mandatory (if used) | Client's written definition of « offre vérifiée » | Any "verified offers" claim |
| Recommended | « Ne paie jamais pour postuler à une offre. » | Scam-awareness and job-offer videos (E-022) |
| Recommended | « L'IA propose, tu relis et tu personnalises. » | AI CV or cover-letter features |
| Recommended | CTA without promises: « Crée ton CV gratuitement sur chapchapcv.com » (URL to confirm) | End card |
| Platform | AI/altered-content toggle | Only for realistic synthetic voice or face (see above) |
| Platform | Paid partnership toggle | Creator or sponsored posts |

**Approval gate.** The studio delivers packages. A human at ChapChapCV publishes. No posting, scheduling, ad spend or
account change without the owner's explicit approval.
