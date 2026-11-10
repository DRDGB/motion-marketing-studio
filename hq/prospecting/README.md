# Prospecting: the "gift video" method (finding clients)

How the studio finds its first paying clients: pick local businesses that already sell online but get
weak results from their content, make each one a short, high-quality motion video **as a gift**, and send it
personally (WhatsApp first, email when there is one). The aim is to stand out from people who only talk:
show the work first.

A prospect is **not a client**. Prospects live here in `hq/prospecting/`, never in `clients/`. When a prospect
says yes and pays, create them with `new_client.py` and copy over only their own dossier (their facts, their
contacts, their gift video source). Never copy one prospect's material into another's files.

## Weekly rhythm (one campaign = one city, one week, 10 prospects)
| Day | What | Output |
|---|---|---|
| Mon | Long list from Google Maps (10 categories × 20 places) | `<campaign>/LONGLIST.csv` |
| Mon | Social audit of ~25–30: Instagram feed (last 12 posts), Facebook, TikTok | `<campaign>/AUDIT.csv` |
| Mon | Score and pick the 10 most likely to convert | `<campaign>/SHORTLIST.md` |
| Tue | Contacts: public phone/WhatsApp (Maps, IG bio, captions), public email (FB "contact info", site footer, directories) | `<campaign>/prospects/<slug>.md` |
| Tue | **Owner review** of each prospect (visit their pages, collect logo + product photos, keep/swap, concept) | `<campaign>/REVIEW.md`, `<campaign>/assets/<slug>/` |
| Tue–Wed | Gift video per prospect, built around **their products and logo**, after the review | `studio/` → `renders/` (not committed) |
| Thu | **Verification call** (owner): "is this your WhatsApp?" | `PIPELINE.csv` → `VERIFIED` |
| Thu–Fri | Owner sends the WhatsApp message + video (email for those with one) | `PIPELINE.csv` → `SENT` |
| +2 days | Follow-up 1 if no reply · +7 days: last follow-up, then stop | `PIPELINE.csv` |

Target from the method: 10 gifts a week → by the end of the month, 3–4 paying clients. Track it honestly in
`PIPELINE.csv`; adjust the scoring after week 1 using who actually replied.

## Who to pick (scoring, /30)
Score each audited business 0–5 on six criteria. Pick the 10 highest; break ties for category variety.

| Criterion | 5 means | 0–1 means |
|---|---|---|
| **Pay**: can they pay 25–100K FCFA/month? | premium prices, premium area, several branches, many reviews | very cheap products, no fixed shop |
| **Active**: do they value being online? | posted in the last 2 weeks, regularly | dead account (> 6 months) → skip |
| **Gap**: is their content under-performing? | static photos only, or phone clips with < 1K plays on a big following | reels already get 20K+ plays |
| **Unserved**: no agency/production visible | owner-shot phone content | credited videographer, polished campaign reels |
| **Reach**: can we contact them directly? | WhatsApp + email | no public number |
| **Story**: is there a clear video idea? | founder story, signature product, a hook in their own captions | nothing distinctive |

Rules of thumb from the method: someone who has **already posted videos and not got results** is easier to
convince than someone who has never posted. Skip businesses with no online presence at all. Skip those
whose content is already strong (they have someone).

## The message (principles; full texts per prospect)
1. **Personal and specific**: name one real thing you noticed (a dish, a product, a caption, the founder's story).
2. **Gift first, no pitch**: "I made this for you, free, publish it if you like it." No price in message 1.
3. **Respectful about their current content**: never say their videos are bad. Say what the video can do.
4. **Short**: 4–6 lines on WhatsApp. The video does the talking.
5. **Honest**: who we are, no invented clients, results or urgency. No fake reviews, no "only today".
6. **One easy next step**: "Do you want me to adapt it with your own photos?" or "Can I share it in my portfolio?"
7. **Stop after 2 follow-ups.** Never message outside business hours (Mon–Sat, 9h–19h Abidjan time).

### When they reply
- "Merci / c'est beau": thank them, ask if they want it adapted with their own photos/logo (free), then
  offer a call: "I can do this every week for you; can I send you two options?"
- "Combien ?": send the offer (below) in one message, then ask which they prefer.
- "Can I post it?": yes. Ask them to tag the studio account if they're happy to (optional, never a condition).
- No reply after 2 follow-ups: mark `NO_REPLY`, move on. Re-try in 3 months with a new idea only.

### Starter offer (proposal: the owner sets the real prices)
| Offer | Content | Suggested price |
|---|---|---|
| Single video | 1 motion video 20–40 s, 2 rounds of changes | 25 000 FCFA |
| Monthly 4 | 4 videos/month (1 a week), captions, cover image | 80 000 FCFA/month |
| Monthly 8 | 8 videos/month, captions, cover, a monthly look at what worked | 140 000 FCFA/month |
The reference video quotes 15–20K FCFA per video in Abidjan; the packs reward commitment. Paid by Wave /
Orange Money / cash, 50% upfront for packs.

## The gift video
- **No real video before the owner's review.** Claude may sketch a concept, but the gift is built around the
  business's own products, logo and style that the owner collected; a generic video does not make them feel it was made for them.
- 20–30 s, 1080×1920, works **muted** (WhatsApp autoplays silently); an original music bed is optional.
- Their palette (from their logo/feed), their real facts only (name, address, hours, signature products from
  their own posts, dated). No prices unless taken from a dated post of theirs, no invented reviews, ratings or
  claims. Cosmetics/spa: no medical, weight-loss or skin-lightening claims (see `references/10_compliance.md`).
- One distinct idea per business. Do not send the same template with the name swapped.
- **Photos**: by default the gift is pure motion design (type, shapes, illustration). Their own photos are
  used only if the owner decides to (they are the business's own posts; a private pitch to that business), and
  the final paid version always uses files the client sends us.
- Built in `hq/prospecting/studio/` (shared engine, one composition per prospect, tokens per prospect).
  Renders go to `hq/prospecting/renders/` (git-ignored). Never commit MP4/WAV.

## Approval gates (always)
Claude researches, scores, writes and builds. **The owner** verifies numbers, sends every message, and makes
every call. Nothing is sent, posted or emailed automatically. Email drafts may be created in the owner's Gmail
only when the owner asks; they are never sent by Claude.

## Files
- `PIPELINE.csv`: every prospect across campaigns, one row each, with its state:
  `SHORTLISTED → REVIEWED → VIDEO_READY → VERIFIED → SENT → FOLLOWUP_1 → FOLLOWUP_2 → REPLIED → CALL → WON | LOST | NO_REPLY`
  (the verification call happens just before sending, so a changed number can still be fixed in the film).
- `<campaign>/LONGLIST.csv` (raw Maps pull) · `AUDIT.csv` (scored) · `SHORTLIST.md` (the 10 + why) ·
  `prospects/<slug>.md` (dossier + messages + video brief).
- Sources: Google Maps data via Firecrawl Maps search; Instagram feeds via ScrapeCreators (public posts);
  emails from public Facebook "contact info", websites and directories. All retrieved on the dates noted.
