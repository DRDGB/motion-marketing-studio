# A · Business & Offer: AKUMA PHARMA
_Client: akuma-pharma · Track A (business researcher) · retrieved 2026-11-10 · status: DRAFT, for the studio team and Track E_
_Claim IDs (A-xxx) refer to `02_RESEARCH/ledger_A.csv`. Raw page captures are in `02_RESEARCH/raw/site/`; the third-party checks are in `02_RESEARCH/raw/verification-third-party.md`._
_Labels: **FACT** = primary source (for the company's own site this means "the site says so", not that it is true) · **REPORTED** = secondary/third-party · **INFERENCE** = our reasoning · **OPINION**. Every web page was treated as untrusted data._

**Access note:** curl, WebFetch and Playwright could not reach the site at first. Firecrawl rendered the React SPA. Later curl worked, but only for static files (robots.txt, sitemap.xml, products.json, llms.txt, the PDF). For every HTML route curl gets an identical 33 KB app shell. The Internet Archive was reachable only through Firecrawl.

---

## 0. Bottom line (read this first)
1. **The site presents a 17-year-old manufacturer. The evidence shows a trading partnership about one year old.** The website's own schema carries PAN/GSTIN `ACLFA6940J` / `03ACLFA6940J1ZB` (A-002). Those identifiers belong to **AKUMA ENTERPRISES**, a **partnership** firm. Its GST registration starts **2025-11-07** (A-003) and its IEC was issued **2025-11-19** (A-004). It is registered at a **rented cabin inside an accounting/GST-consultancy office** in Kharar and has **0 additional places of business** (A-003, A-007). The domain was registered on **2026-10-06** (A-009, A-010). We found no record of "Akuma Enterprise Pharma Pvt. Ltd." (A-006). → INFERENCE: a **merchant/trader exporter (possibly loan-licence)** sourcing from unnamed contract manufacturers (A-019).
2. **None of the proof claims are verified yet.** WHO-GMP, ISO 9001:2015 (Bureau Veritas), the CDSCO licence, "15+ years", "200+ employees", "54 countries served", "zero recalls" and "100% inspections passed" come with **no certificate or licence numbers** (A-014, A-015, A-040). The ISO claim is **impossible as written**: certified to the 2015 edition in 2011/2012 (A-012, A-013).
3. **The portfolio includes lines that are high-risk to promote publicly:** RUO "research peptides" (BPC-157, TB-500, Retatrutide, MK-677, Melanotan…), GLP-1 APIs, ED/"sexual wellness" drugs including a "Herbal Sex Booster", **Nandrolone (anabolic steroid)**, clobetasol creams, and **third-party trademarks sold under the Akuma name** (Ventolin, Crocin, Becosules, Candid) (A-032 to A-037, A-047, A-048).
4. For video marketing this means **no product, certification or heritage claim can go on screen** until the client sends documents (§11). The safe starting space is corporate/capability content about export logistics, dossier support and tropical packaging, with no product names and no certificate claims (Track E to confirm).

---

## 1. Identity: claimed vs verified
| Item | What the site CLAIMS | What third parties show | Status |
|---|---|---|---|
| Legal name | "Akuma Enterprise Pharma Pvt. Ltd." (A-001) | GST + IEC: **AKUMA ENTERPRISES**, Partnership (A-003, A-004); no MCA record found for the Pvt. Ltd. (A-006) | **CONTRADICTED** |
| Year founded | 2009, "15+ Years of Excellence" (A-011) | GST valid from 2025-11-07; IEC 2025-11-19; domain 2026-10-06; first archive capture 2026-10-06 (A-003, A-004, A-009, A-010) | **CONTRADICTED** |
| Address | Cabin 101, #2609, Vinod Accounting Solutions, Landran Rd, Adarsh Nagar, Kharar, SAS Nagar, Punjab 140301 (A-001) | Same address on GST/IEC. The building is the registered office of Vinod Accounting Solutions Pvt Ltd, a GST-registration consultancy (A-007) | **VERIFIED (address)**; it is an office cabin, not a plant (A-008) |
| Employees | "200+" (schema) (A-002) | Nothing supports this | UNVERIFIED |
| Leadership | Dr. Rajesh Kumar (CEO & Founder), Dr. Priya Sharma (CTO, "PhD … IIT Mumbai"), Amit Patel (VP Sales) (A-020) | No trace found. "IIT Mumbai" does not exist (it is IIT Bombay). Generic names suggest placeholders. People were not researched individually (privacy). | UNVERIFIED, likely placeholder |
| Contacts | sales@ / executive desk email, +91 07986147827 (call/WhatsApp), tawk.to chat | Number appears only on the company's own sites | Business contacts only |
| Brand name | "Akuma Enterprise Pharma"; alternate name "Akuma Pharma" | **Name collisions:** AKUMA PHARMA PRIVATE LIMITED (Assam, unrelated), akumapharma.com (unrelated), Akums Drugs & Pharmaceuticals (large CDMO with a similar name) (A-006) | Brand/trademark risk |
| Related properties | none disclosed | akumaenterprises.in ("Akuma Enterprise Pvt. Ltd.", APIs/veterinary) and akumaenterprises.com (Cameroon logistics/sourcing hub), both tied to the same cabin address/IEC (A-043) | REPORTED |

## 2. Manufacturer or trader?
- **The site claims** "Leading manufacturer", WHO-GMP suites across 11 dosage forms, ISO Class 5/Grade A aseptic filling, peptide SPPS and lyophilization, QC and stability labs, and "QP release" (A-017). Schema type is `Manufacturer`, and products.json lists Akuma as `manufacturer` and `brand` for all 224 SKUs (A-032).
- **Against that:**
  - No plant address, manufacturing-licence number or plant photo that can be checked.
  - GST shows **no additional place of business** (A-003).
  - The meta description says products are "manufactured **or sourced** on request" (A-018).
  - The guide page targets the keyword "WHO-GMP **loan license** manufacturer Punjab" (A-018).
  - The catalog includes **other companies' brands** (A-032).
  - The legacy index shows earlier positioning as an API/research-chemical supplier "in Pune" (A-042).
- **Stated manufacturing partners: none named** anywhere on the site, catalog, llms.txt or products.json.
- **INFERENCE (A-019):** this is a merchant exporter, possibly holding loan-licence arrangements, that sources from Indian WHO-GMP contract manufacturers and third-party brand owners. **The client must confirm** the model and name its partners (§11).

## 3. What they sell (counts)
The source is the 2026 catalog PDF (25 pp.). The count matches `products.json` (224) and the sitemap (224 /product URLs). The web listing paginates 10 × 24 (A-021).

**By category (12):**
| Category | SKUs |
|---|---:|
| Tablets | 45 |
| Capsules | 17 |
| Dry Powder Injections | 18 |
| Liquid Injections | 14 |
| Oral Liquids | 11 |
| Ointments & Creams | 11 |
| Eye-Ear Drops | 10 |
| Nasal Spray (incl. 1 MDI) | 11 |
| Dry Syrup | 4 |
| Drops (paediatric) | 3 |
| Sanitizer | 8 |
| Peptides: Pharmaceutical APIs | 36 |
| Peptides: Research (RUO) | 36 |
| **Total** | **224** |

**By therapeutic sector (15)** (A-022): Peptide APIs 36 · Research Peptides (RUO) 36 · Anti-Infectives & Antibiotics 22 · Gastroenterology & PPIs 19 · Sexual Wellness 18 · Anti-Diabetic 17 · Respiratory & Allergy 15 · Antimalarials 15 · Dermatology 10 · Ophthalmic & Otic 10 · Hospital Antiseptics 8 · Pain/NSAIDs 7 · Nutrition & Tonics 6 · Endocrine & Supportive 3 · Antivirals 2.

Flagship stories the site pushes:
- Artesunate injection 30–240 mg (8 strengths), Artemether injections, Artemether-Lumefantrine, chloroquine
- Ceftriaxone ± sulbactam/tazobactam vials
- Paediatric dry syrups
- GLP-1 peptide APIs (Semaglutide, Tirzepatide)
- RUO peptides (BPC-157, TB-500, Retatrutide)

Data-quality notes:
- SKU codes collide (AKP-004 vs AKP-004-MAL; AKP-030 vs -030-MAL vs -030-AYUR; AKP-100 vs AKP-100-DM). AKP-005-MAL's page says "Catalog Reference AKP-005", which is a different product.
- Some "peptides" are small molecules (MK-677, SLU-PP-332, Orforglipron).
- Pages give storage "below 25 °C" while claiming Zone IVb (30 °C/75 % RH) (A-038).
- Peptide APIs are sold "in vials" carrying finished-product dossier wording (A-036).
- The catalog PDF is generated on demand (ReportLab, 2026-11-10) (A-023).

**Price points:** none published. "Quote on request · Bulk pricing" everywhere, and structured-data price is 0.00 USD (A-024). Legacy indexed API pages showed per-gram USD prices (A-042).

## 4. Proof: certifications and licences
| Claim (site) | Issuer stated | Validity stated | Number published? | Third-party check |
|---|---|---|---|---|
| ISO 9001:2015 (A-014) | Bureau Veritas Certification | to 2026-12-14 | No | Cannot be looked up without a number. Timeline says 2011/2012, before the standard existed (A-012, A-013) → **CONTRADICTED** as stated |
| WHO-GMP / Schedule M (A-015) | "CDSCO / WHO-GMP, Government of India" (schema says "recognized by WHO", which is misleading) (A-016) | to 2028-09-14 | No | **UNVERIFIED.** With no own site registered under GST, any certificate probably belongs to a contract manufacturer (INFERENCE) |
| CDSCO manufacturing licence | CDSCO | "valid through 2028" | No | **UNVERIFIED** |
| WHO-format CoPP / FSC | CDSCO / State FDA | "per product on request" | n/a | A CoPP is issued to the licence holder (manufacturer). Ask whose name is on it |
| eCTD/ACTD dossiers, BE summaries, Zone IVb stability | self | "ready to file" | n/a | Never seen. The dossier library is dated 2018 (About) and also "launched" Sept 2026 (news) (A-041) |
| Product registrations (NAFDAC, PPB, SAHPRA, TMDA, FDA Ghana…) | — | — | **None claimed** | Site only offers "readiness" (A-039) |
| Drug sale/wholesale-export licence (India) | — | — | No | Not found. Ask |
| Quality KPIs: 99.8 % pass, 100 % inspections passed (5 yrs), zero recalls, 54 countries served (A-040) | self | — | — | Unsubstantiated; impossible to square with a firm registered in Nov 2025 |

## 5. Markets and logistics (claimed)
- **Target:** "all 54 African countries & worldwide". Regional pages cover West, East, Southern, Central, North Africa, Middle East, LATAM, APAC, Europe and North America, plus 26–27 country profiles. Priority West Africa list: Nigeria, Ghana, Côte d'Ivoire, Senegal, Togo, Benin, Burkina Faso, Mali, Niger, Sierra Leone.
- **Logistics:** BOM / JNPT / DEL to Apapa, Tema, Abidjan, Dakar, Mombasa, Dar es Salaam, Durban, Djibouti. 2–8 °C cold chain for peptides and injections. West Africa lead time 4–6 weeks by sea, 5–8 days by air (A-027).
- **Languages:** EN/FR/PT/AR packs, Swahili on request. The site itself is EN + FR, with stub locales fr-CA, ja-JP and ko-KR.
- **Customers named: none.** No distributor, tender win or case study appears anywhere.

## 6. Funnel: how a buyer converts today
1. **Discovery:** SEO-heavy site (341 URLs, llms.txt/ai.txt inviting AI crawlers, IndexNow, products.json/RSS). No social channels and no directory listings (A-044, A-045). The search engines' verification tags are still placeholders ("VERIFY-ME-*"), so Search Console and Bing aren't connected yet.
2. **Browse:** product grid with filters, product page (specs table) and SDS link, plus a PDF catalog download.
3. **Contact paths** (A-030):
   - WhatsApp +91 07986147827: prefilled wa.me links site-wide and per product. "24/7".
   - Per-product **mailto "Request Dossier & Quote"** to sales@.
   - **Contact form** (name, company, country, inquiry type including "Payment Support" and "Order Status"). It carries a **mandatory marketing-consent checkbox**, which contradicts the privacy policy's "no unsolicited marketing".
   - **Sample request form**: 5–7 day DHL/FedEx dispatch; intended-use dropdown; **no licence upload or buyer verification**; free or paid not stated (A-028).
   - "Email me the catalogue", newsletter, tawk.to chat, "Help / Track order".
4. **Commercial terms:**
   - MOQ 1,000 packs (1,000–2,500 per the guide), 50 vials API, 10 vials RUO (A-025).
   - Incoterms FOB/CIF/CFR/CIP/EXW (A-026).
   - Quote "within 24 h" vs "3–5 days" on the contact page (A-029).
   - **Payment terms not stated.**
   - Privacy policy mentions cart checkout, accounts and order payment data (A-031), which suggests an RFQ cart or e-commerce layer.
5. **Missing trust signals:**
   - No CIN, GSTIN, IEC or drug-licence number in the footer (GSTIN appears only in hidden schema).
   - No certificate images or numbers.
   - No named people a buyer can verify.
   - No reviews, no social proof.

## 7. Digital footprint
| Signal | Finding | Ref |
|---|---|---|
| Domain | Registered 2026-10-06 (Hostinger), Cloudflare | A-009 |
| Archive | First capture 2026-10-06 | A-010 |
| Content age | News dated 2026-07-30 to 2026-10-28 and privacy policy dated 2026-05-21 both predate the domain, so they were back-dated or carried over | A-031, A-041 |
| Legacy index | API/research-chemical catalogue ("supplier in Pune"), Boldenone, nootropics; now 404/noindex but still in search results | A-042 |
| Social media | **None found** (LinkedIn, Facebook, Instagram, YouTube, X, TikTok). No sameAs links | A-044 |
| B2B directories | **None found** (IndiaMART, TradeIndia, ExportersIndia, Go4WorldBusiness) | A-045 |
| Reviews | **None found** | A-045 |
| Regulatory warnings / news | **None found** (absence of evidence; firm is ~1 yr old) | A-045 |

## 8. Gate 0 classification by product line (flag only; Track E decides legality)
Advertiser type: **distributor/trader-exporter** (INFERENCE), B2B. Targets: India → Africa (NG, GH, CI, SN, KE, TZ, UG, ET, ZA…) and "worldwide". No marketing-authorisation number exists for any product.

| Line (SKUs) | Gate 0 class | Public-promotion risk | Why flagged |
|---|---|---|---|
| Antimalarials (15): artesunate & artemether inj., AL tablets, chloroquine | **Rx-only** (injections hospital-only) | High | Rx; injectables; malaria is a top counterfeit category in Africa; no MAs |
| Anti-infectives (22): cephalosporin vials, amikacin, ofloxacin, itraconazole, paediatric dry syrups | **Rx-only** | High | Antibiotics (AMR messaging rules); paediatric |
| Anti-diabetic (17): glimepiride/metformin/pioglitazone FDCs, dapagliflozin | **Rx-only** | High | Rx; several FDCs unapproved outside India |
| **Sexual wellness (18)**: sildenafil, tadalafil, vardenafil, **dapoxetine combos**, silodosin, tamsulosin/dutasteride, **"Herbal Sex Booster Capsules"** | **Rx-only** + herbal/"Ayurvedic" | **Very high** | ED drugs are heavily counterfeited; platform restrictions; dapoxetine FDCs unapproved in many markets; herbal "booster" adulteration and claim risk |
| Gastro/PPIs (19), Respiratory (15), Pain/NSAIDs (7), Ophthalmic/Otic (10), Endocrine (3) | Mostly **Rx-only**; some **OTC** in some markets (antacids, saline/xylometazoline sprays, CMC eye drops, levocetirizine, paracetamol drops) | Medium–High | OTC status is country-specific; "Ventolin" (salbutamol MDI) is Rx |
| **Nandrolone decanoate inj. (2)** | **Rx-only / controlled** (anabolic steroid) | **Very high** | Controlled/doping substance in many jurisdictions |
| Dermatology (10) incl. **clobetasol** creams | Rx-only (steroids) / OTC (antifungals) | High | Skin-lightening misuse of potent steroids in African markets (A-047) |
| Nutrition & tonics (6) incl. **cyproheptadine appetite drops for infants** | Rx/OTC mixed | High | Paediatric appetite stimulant marketed for "infant anorexia, poor weight gain" (A-048) |
| Hospital antiseptics / sanitizers (8) | **Sanitizer/biocide** (OTC/general) | Low | Lowest-risk product line; claims ("kills 99.9 %") still need substantiation |
| **Pharmaceutical Peptide APIs (36)**: Semaglutide, Tirzepatide, Liraglutide, Cagrilintide, Leuprorelin, Oxytocin, Carbetocin… | **API** (B2B to licensed manufacturers only) | **Very high** | GLP-1 APIs feed illegal compounding and the grey market; patents in many markets; no DMF/CEP; sold "in vials" |
| **Research Peptides RUO (36)**: Retatrutide, BPC-157, TB-500, MK-677, Melanotan I/II, PT-141, CJC-1295, Ipamorelin, SLU-PP-332… | **RUO** | **Highest; do not promote** | Classic human-use grey market; several are on doping lists; investigational/unapproved molecules; page copy hints at human use ("Recovery", "tendon-healing"); no buyer-qualification step (A-034, A-035) |
| Third-party brands: Ventolin, Crocin Baby, Becosules, Candid, Mucolite (5) | Rx/OTC | **Very high (IP)** | Other companies' trademarks listed under Akuma brand/manufacturer (A-032) |

## 9. Red flags (summary)
1. Entity mismatch: "Pvt. Ltd., founded 2009, 200+ staff" vs a **partnership registered Nov 2025** working from a **cabin in an accountant's office** (A-002 to A-008).
2. Manufacturer claims with **no plant, licence or partner named** (A-017 to A-019).
3. **Impossible ISO timeline** and certificates with no numbers (A-012 to A-015). WHO presented as the GMP certifier (A-016).
4. **Likely placeholder leadership** ("IIT Mumbai") (A-020).
5. **Third-party trademarks** sold under the Akuma brand (A-032).
6. **RUO peptides, GLP-1 APIs, anabolic steroid, ED drugs, herbal sex booster** in the same storefront as hospital antimalarials (A-033 to A-037).
7. **Legacy research-chemical/steroid/nootropic pages** still in the search index (A-042).
8. Back-dated content and placeholder site-verification tags. Unsubstantiated KPIs (A-040, A-041).
9. No social, directory or review footprint (A-044, A-045).
10. Mandatory marketing consent on the contact form vs "no unsolicited marketing" in the privacy policy (A-030, A-031).

## 10. Implications for the studio (for Synthesis and Track E; not a legal opinion)
- **Treat the client as a claims-unverified B2B trader** until documents arrive. Every proof point a video would want (WHO-GMP, ISO, years in business, countries served, team) is currently **unusable**.
- **Exclude** RUO, peptide APIs, nandrolone, sexual-wellness and third-party-brand SKUs from any public content and from the visual library, including product renders.
- The **site's own copy needs correcting** before videos point traffic to it: entity name, founding year, ISO timeline, "manufacturer" wording, KPIs, leadership. Otherwise our videos would amplify misleading claims.
- **Possible safe angles** (subject to Gate 1/Track E):
  - How dossier/CoPP support works for importers (no product names)
  - Tropical-packaging explainers
  - Export logistics corridors
  - Anti-counterfeit and "verify your supplier" education (only once the client's own credentials are verifiable)

## 11. Open questions for the client (send before any production)
1. **Legal entity:** Is the contracting entity AKUMA ENTERPRISES (partnership, GSTIN 03ACLFA6940J1ZB, IEC ACLFA6940J)? Does "Akuma Enterprise Pharma Pvt. Ltd." exist? If so, send its CIN and certificate of incorporation. What relates you to akumaenterprises.in and akumaenterprises.com?
2. **History:** What is the basis for "founded 2009 / 15+ years / 200+ employees / 54 countries served / zero recalls / 100 % inspections passed"? Please send evidence or approve removing these claims.
3. **Manufacturing:** Do you own a plant? If not, name each contract manufacturer and loan-licence partner per product line. Send their manufacturing licence numbers and WHO-GMP certificates (issuing authority, number, validity, site address).
4. **Your licences:** Drug sale/wholesale licence (Punjab), export authorisations, the CDSCO licence number claimed on the site.
5. **ISO 9001:2015:** Certificate number, certification body (Bureau Veritas?), certified entity and site, scope, and validity (the site says it expires 2026-12-14).
6. **Registrations:** Which products hold marketing authorisations (NAFDAC, FDA Ghana, PPB, TMDA, SAHPRA, AIRP…)? Send numbers. Have you actually supplied any African NRA or tender? Name customers we may cite, with their written consent.
7. **Third-party brands:** Are Ventolin, Crocin, Becosules, Candid and Mucolite resold genuine branded goods (with what authorisation) or placeholders? Can they be removed?
8. **High-risk lines:** Will you drop or wall off the RUO peptides, GLP-1/peptide APIs, nandrolone, the herbal sex booster and the ED combinations from the public site and from marketing? How do you verify buyers (licence check, end-use declaration)?
9. **Leadership:** Real names, roles and photos of the people who may appear or be quoted, with written consent. Are the current team profiles placeholders?
10. **Commercial:** Price bands or a sample price list, payment terms (LC/TT/advance), whether samples are free, and the real quote turnaround (24 h or 3–5 days?).
11. **Channels:** Any existing LinkedIn, Facebook, Instagram, YouTube, X or TikTok accounts? Who will own them and approve posts?
12. **Website:** Can you fix the "VERIFY-ME" tags, the de-indexing of legacy pages (Boldenone, nootropics, the "Pune" API catalogue), Zone IVb vs "store below 25 °C", and the mandatory marketing-consent checkbox?
13. **Brand name:** Are you aware of AKUMA PHARMA PRIVATE LIMITED (Assam) and Akums Drugs? Do you hold any trademark application for "Akuma"?

## 12. Source index (raw captures, all retrieved 2026-11-10)
- Site pages (`raw/site/`):
  - about.md, products.md, capabilities.md, contact.md, compliance.md (= /certifications), quality.md
  - product-AKP-002.md, product-AKP-005-MAL.md, product-AKP-048.md, product-AKP-API-02.md, product-AKP-RP-03-BPC-157.md
  - markets-west-africa.md, sample-request.md, privacy-policy.md, guide-third-party-manufacturing.md
  - news-index.md + 8 news-*.md
  - catalog-2026-pdf.md (+ akuma-pharma-catalog-2026.pdf)
  - home-shell.html (JSON-LD), robots.txt, sitemap.xml, products.json, llms.txt, ai.txt, dmf-updates.html, legacy-catalog-boldenone-404.md
- Not captured individually: /return-policy, /supply, /solutions, /company, /country/*, /therapeutic/*, other /markets/*, other guides. They are in the sitemap; follow up if needed.
- Third-party: `raw/verification-third-party.md` (RDAP, Internet Archive CDX, GST REG-06, DGFT IEC, Zaubacorp/FalconEbiz/JustDial snippets, ISO standard page, search logs).
