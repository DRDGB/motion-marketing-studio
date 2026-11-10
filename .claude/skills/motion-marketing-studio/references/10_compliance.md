# Compliance, rights and platform rules

Sections: A (every client) · B (health, pharma, pharmacy, supplements, cosmetics: strict) ·
C (other sectors) · D (platform policies).

Applies to every script before any voice is generated, and again to the final render. The
compliance reviewer agent fills the script's `## Compliance` section with PASS or CHANGES REQUIRED.
You never approve on behalf of a human legal, medical or regulatory reviewer. Sources and details:
`sources_snapshot_2026-11.md` (dated snapshot; **re-verify** what you rely on).

## A. Every client (all sectors)
- [ ] Every factual line maps to a `RESEARCH_LEDGER.csv` row (URL, publisher, date). No invented
      numbers, results, reviews, testimonials, customers or experts. Illustrative examples are labelled
      on screen ("Illustrative example").
- [ ] Claims are the client's to make: prices, guarantees, awards, certifications confirmed by them in
      writing (store the confirmation reference).
- [ ] No disparagement of named competitors; comparisons only if factual, sourced and fair.
- [ ] No fake platform UI, no impersonation of a real person, organisation or official body.
- [ ] People: real people only with written consent; no synthetic "customers", "patients", "doctors"
      or "reviews". Ever.
- [ ] Rights: fonts, logos, music, footage, images, voices licensed and logged in `ASSET_REGISTER.csv`.
      Voice generated on a plan that grants commercial use at generation time.
- [ ] AI disclosure: tick the platform's "altered or synthetic content" / AI label when a **realistic**
      synthetic human voice, face or scene could be mistaken for real (e.g. a cloned real voice).
      A clearly animated video with a generic designed narrator usually does not require it; when in
      doubt, and always for health content with a realistic voice, disclose.
- [ ] Children: nothing targeted at minors for age-restricted products; set 18+ targeting where required.
- [ ] Remotion licence: free only for individuals, non-profits, or companies with ≤ 3 people in total
      (count freelancers; if the client also operates the project, add their headcount). Otherwise a
      Remotion Company License is required. Deliver finished files by default; record the status.

## B. Health, pharma, pharmacy, supplements, cosmetics (strict)
**Gate 0: classify** (block until answered): product type (Rx-only medicine / OTC / device / supplement
/ cosmetic / phytomedicine / pharmacy service / corporate brand only) · advertiser (manufacturer /
distributor / retail pharmacy / telehealth) · target countries and platforms (apply the strictest set)
· marketing authorisation / registration number for every product named.

**Gate 1: can this be promoted at all?**
- Rx-only medicine + general public = **STOP** (EU Dir. 2001/83/EC art. 88; UK HMR 2012 reg. 284;
  the international norm). Offer instead: disease-awareness or pharmacy-service education with no product
  name, or professional-only material through professional channels.
- No call to buy medicines online / via social DMs where online sale is not authorised.
  **Côte d'Ivoire (reported 2026):** the regulator (AIRP) says online sale of medicines is not
  authorised, and any advertising with health claims needs prior approval from the national advertising
  authorisation commission; unapproved advertising is illegal (Décret 2016-717 covers medicines, other
  health products and pharmaceutical establishments). Treat both product ads and a pharmacy's own
  promotion as needing that approval until the client's regulatory lead confirms otherwise in writing.
- Paid ads: platform eligibility first (Google healthcare certification + LegitScript/VIPPS for
  pharmacies; Meta online pharmacy permission + LegitScript, Rx ads only in a few countries; TikTok local
  law + 18+). Organic posts still follow local advertising law.

**Gate 2: claims, line by line**
- Benefits only as stated in approved labelling (SmPC/patient leaflet/registration) or substantiation
  on file; log the reference.
- Blocked words/ideas: cure, guaranteed, miracle, 100%, no side effects, safe for everyone, natural =
  safe; disease-treatment claims for supplements/cosmetics; fear-based messaging.
- Blocked by default for medicines: patient testimonials, before/after visuals, celebrity or health-
  professional endorsement.
- Nothing contradicts WHO or the local health authority (YouTube medical misinformation policy).
- Mandatory mentions (product name, INN, indication, "read the leaflet", "ask your pharmacist or
  doctor", risk info) as specified by the client's regulatory lead / regulator. Do not invent them.

**Gate 3: fair balance (motion-specific)**
- Risk/safety information gets comparable prominence: same voice, pace and volume; on-screen text
  legible long enough (≥ reading time at 2.5 words/s); no music swells, fast cuts or competing animation
  during it. Regulators judge the **net impression**, including visuals and pacing.

**Gate 4: approval record**
- Responsible pharmacist / regulatory lead signs off script + storyboard (keep the reference).
- Regulator authorisation number (where required, e.g. Côte d'Ivoire) logged **before** any public post.

**Safe content that usually works for pharmacies (still reviewed):** how to read a medicine leaflet,
storing medicines in heat, why finish an antibiotic course *as prescribed*, how to dispose of old
medicines, what a pharmacist can help with, opening hours/services, prevention messages aligned with
health authorities, spotting counterfeit medicines, when to see a doctor.

## C. Other sectors (quick checklists; the compliance agent researches the client's country rules in Phase 2)
For every sector: identify the regulator / advertising code that applies in the audience's country, the
client's licence or registration, and any wording the client must use. Ask for their approved wording.

| Sector | Never | Always / check |
|---|---|---|
| **Finance, banking, insurance, crypto, investment** | guaranteed returns; "risk-free"; get-rich framing; individual advice; unlicensed products | licensed entity named; regulator's risk warnings verbatim; past-performance caveat; fees stated fairly; crypto/forex often heavily restricted on platforms (check ad policies) |
| **Food, restaurants, catering** | health or disease claims for food; fake reviews; misleading "homemade/organic/halal" claims without proof | prices and offers accurate and dated; allergen info if a dish is named; hygiene/licence claims only if verified; delivery areas and hours correct |
| **Beauty, cosmetics, wellness, fitness** | "cures"/medical claims; before/after edits; unrealistic body promises; skin-lightening promotion where banned | results "may vary" where relevant; ingredient claims match the label; trainers' qualifications only if verified; age-appropriate targeting |
| **Real estate, construction** | invented prices, yields or availability; renders shown as finished property without saying so | "artist's impression" labels on renders; licence/registration numbers if required; price, fees and conditions current |
| **Education, training, schools** | guaranteed jobs, grades or visas; fake accreditation | accreditation named only if verified; fees and dates current; outcomes only with sourced data |
| **Recruitment, jobs** | discriminatory criteria; fake salary ranges | role, location and pay accurate; equal-opportunity wording where required |
| **Alcohol, tobacco/vaping, gambling** | targeting minors; linking to social/sexual success or health; "safe" gambling | age-gating and platform eligibility first (often banned or certification-only); mandatory warnings |
| **Kids' products, toys** | direct appeals to children to buy/pester; collecting children's data | made-for-kids settings on platforms; parent-directed CTAs |
| **NGOs, causes, politics** | misleading statistics; impersonating officials | sources for every figure; platform rules for social-issue/political ads (often need authorisation and disclaimers) |
| **Legal, accounting, consultancy** | promising outcomes; "best lawyer" claims where professional rules forbid them | professional body rules on advertising; general information disclaimer |
| **Telecom, tech, SaaS** | "unlimited" without the fair-use terms; fake UI of other brands | prices, contract terms and coverage claims sourced; comparisons fair and current |

If the client's sector is not listed, apply section A and research the sector before the first script.

## D. Platform policy quick checks (re-verify at publish time)
- YouTube: medical misinformation, spam/deceptive practices, inauthentic content (repetitive mass-
  produced videos), altered/synthetic disclosure, made-for-kids setting.
- Meta: restricted goods (drugs/pharma), health data restrictions on audiences/pixels.
- TikTok: branded content toggle for paid partnerships, healthcare policy (18+, local approval).
- Captions/descriptions follow the same rules as the voice (claims in text count too).
