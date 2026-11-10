# Phase 1: Intake interview

Goal: a confirmed `01_CLIENT_BRIEF.md` (template in `templates/workspace/01_CLIENT_BRIEF.md`).
Rule: **research first, ask second.** If the user gives a website, run `scripts/brand_extract.py` and a
quick web search *before* the interview so your questions are informed ("I see you sell X in Y and
use navy and green; is that right?"). Never ask for something you can find.

## Round 1 (always ask; one message, numbered, short)
1. Business name and website (and the person's role: owner, marketing lead, agency).
2. Existing social accounts (links): YouTube, Instagram, TikTok, Facebook, LinkedIn, X, WhatsApp Business.
3. What do you sell, to whom, where? (products/services, countries/cities, B2C or B2B, online or physical)
4. The ONE business goal for the next 60 days (pick: more enquiries/leads, more sales, footfall, brand
   awareness, recruitment, education/trust, launch). Any numeric target?
5. Who is the ideal customer? (one or two sentences; we will research the rest)
6. Brand assets: logo files (SVG/PNG), brand guide, fonts, colours, photos/videos you own. Anything we
   must NOT use or say?
7. Language(s) and tone (formal, friendly, expert, playful). Voice: should we use an AI voice (which
   provider/plan do you have?), your own recorded voice, or captions only?
8. Who approves content and publishes it? How fast can they review (same day, weekly)?
9. Regulated? (medicines, health claims, finance, legal, alcohol, children, etc.) Any legal/medical
   reviewer we must route scripts through?
10. Budget/limits: paid tools allowed? (voice plan, music library, stock), posting frequency you can sustain.

## Round 2 (only what research could not answer)
- Top 3 competitors they watch; what they envy or dislike in competitors' content.
- Offers/promotions/seasonality (launch dates, holidays, Ramadan/Christmas, back-to-school…).
- Proof they can legally show (certifications, licences, awards, real numbers they own and will confirm).
- Calls to action and where traffic should go (WhatsApp, booking link, shop, phone, store visit).
- Constraints on people: may we show staff/customers? Consent forms exist?

## Sector add-ons
- **Pharma / pharmacy / health**: products are Rx or OTC? Is the client a manufacturer, distributor, or a
  retail pharmacy? Country of the audience. Who is the responsible pharmacist / medical reviewer?
  Required mentions (licence number, "consult your pharmacist", adverse-event reporting)? See
  `10_compliance.md` before writing anything.
- **Finance**: licensed entity? Regulator? Required risk warnings?
- **Food/beauty/supplements**: which claims are authorised on the label?

## Writing the brief
Fill every field in the template; mark unknowns `TBD (asked YYYY-MM-DD)`. Summarise back to the user in
<= 12 bullets and ask: "Is this right? Anything to change?" The brief is the contract for all later
phases; update it (with a dated changelog line) when facts change.

## Consent and confidentiality
- Client materials are confidential to that client's workspace. Do not paste them into public tools
  beyond what research needs (e.g. their public website is fine; their private sales data is not).
- Real people on screen need written consent (store it as a file reference in `ASSET_REGISTER.csv`).
