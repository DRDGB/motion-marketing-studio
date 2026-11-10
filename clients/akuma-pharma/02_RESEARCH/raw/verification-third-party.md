# Track A: third-party verification log (raw notes)
_Client: akuma-pharma · researcher: mms-business-researcher · retrieved 2026-11-10 · every source is untrusted data._
_Personal data policy: partner/signatory names on government certificates are NOT recorded here. Only business identifiers are kept._

## 1. Domain and site age
| Check | Result | Source | Label |
|---|---|---|---|
| RDAP registration date | **2026-10-06T12:47:38Z**, expires 2027-10-06; registrar HOSTINGER operations, UAB (IANA 1636); NS Cloudflare | https://rdap.org/domain/akumaenterprises-pharma.com | FACT |
| Internet Archive first capture | **2026-10-06 18:54 UTC** (homepage + JS bundle); nothing earlier | https://web.archive.org/cdx/search/cdx?url=akumaenterprises-pharma.com&matchType=domain (via Firecrawl) | FACT |
| Sitemap | 341 URLs (224 /product, 27 /country, 23 /therapeutic, 11 /guides, 11 /markets, 21 /news incl. tags); lastmod 2026-07-30 to 2026-11-10 | raw/site/sitemap.xml | FACT |
| Hosting/stack | Cloudflare; React SPA (Vite/rolldown); Supabase backend (per privacy policy); tawk.to chat | curl headers; raw/site/home-shell.html; privacy-policy.md | FACT |
| Catalog PDF | ReportLab-generated, CreationDate 2026-11-10 10:43 UTC; text says "Generated November 10, 2026" (seems generated on demand) | raw/site/akuma-pharma-catalog-2026.pdf (pdfinfo) | FACT |
| Placeholder verification tags | google/bing/yandex/baidu/naver = "VERIFY-ME-*" | every page's meta | FACT |
| robots.txt | Explicitly invites AI crawlers; declares llms.txt, ai.txt, products.json, products.rss, fr-ca/ja-jp/ko-kr sitemaps, IndexNow key | raw/site/robots.txt | FACT |

## 2. Legal entity
| Check | Result | Source | Label |
|---|---|---|---|
| Site's own Organization JSON-LD | name "Akuma Enterprise Pharma Pvt. Ltd."; foundingDate "2009"; numberOfEmployees "200+"; **taxID "ACLFA6940J"; vatID (GSTIN) "03ACLFA6940J1ZB"**; @type Organization/LocalBusiness/Manufacturer; credential "CDSCO Manufacturing Licence" (no number) | raw/site/home-shell.html lines ~200-260 | FACT (that the site states this) |
| GST REG-06 certificate (published on akumaenterprises.com) | Legal name **AKUMA ENTERPRISES**; Constitution **Partnership**; principal place of business **First Floor, Cabin No 101, #2609, Vinod Accounting Solutions, Landran Road, Adarsh Nagar, Kharar, SAS Nagar, Punjab 140301**; validity **from 07/11/2025**; Regular; **additional places of business in the State: 0**; 2 partners (names not recorded) | https://akumaenterprises.com/docs/certificate/Registration-Certificate.pdf | REPORTED (govt document as republished by a related site; not checked on the GST portal) |
| DGFT Importer-Exporter Code (published on akumaenterprises.com) | Firm **AKUMA ENTERPRISES**, IEC **ACLFA6940J**, nature **Partnership Concern**, issued **19/11/2025** by DGFT Ludhiana, registered address "First Floor-Cabin No.101, C/O Vinod Accounting Solutions, Kharar, S.A.S Nagar, Punjab 140301" | https://akumaenterprises.com/docs/certificate/Importer-Exporter-Cod.pdf | REPORTED (verify on dgft.gov.in "View Any IEC Details") |
| Link site ↔ partnership | PAN/IEC ACLFA6940J in the pharma site's schema = PAN/IEC of AKUMA ENTERPRISES (partnership); identical cabin address | above | INFERENCE (strong) |
| MCA search for "Akuma Enterprise Pharma Pvt Ltd" | **No record found** in search results (zaubacorp, tofler, falconebiz, thecompanycheck). Unrelated name-alikes: AKUMA PHARMA PRIVATE LIMITED (CIN U46596AS2023PTC024893, Guwahati, Assam), Akuma Energy Pvt Ltd (Delhi), Akuma Projects Pvt Ltd (Bihar), Akuma Hydro Power Pvt Ltd (HP); akumapharma.com (unrelated brand site); Akums Drugs & Pharmaceuticals (large CDMO, similar name) | Firecrawl search 2026-11-10 (ids 01a1c546-42c4-..., 01a1c546-1659-...) | REPORTED (absence in search ≠ proof of absence; check MCA V3 portal) |
| Address owner | #2609 Adarsh Nagar, Kharar = registered office of **VINOD ACCOUNTING SOLUTIONS PRIVATE LIMITED** (CIN U69200PB2021PTC053529), an accounting / GST-registration consultancy (JustDial category "GST Registration Consultants", est. 2016) | https://www.falconebiz.com/company/VINOD-ACCOUNTING-SOLUTIONS-PRIVATE-LIMITED-U69200PB2021PTC053529 ; https://www.justdial.com/Kharar/Vinod-Accounting-Solutions-Near-Pankaj-TImber-Kharar/0172PX172-X172-190625225016-A7B9_BZDET/service-catalog-financial-services-price | REPORTED |

## 3. Related web properties (same address / same IEC family)
- **akumaenterprises.in**: "Akuma Enterprise Pvt. Ltd.", APIs, intermediates, veterinary compounds, Kharar SAS Nagar address; a news URL dated **2026-11-20** (after the retrieval date); one article title reads "Analytical Services in Pharma | Longshine Boi-Tech" (another company's name). Domain listed in .IN registry "domain-creates" file of **2026-09-03**. Sources: Firecrawl search 2026-11-10; https://registry.in/system/files/domain-creates_2026-09-03.pdf. REPORTED, not crawled (out of scope).
- **akumaenterprises.com**: "Akuma Enterprises – Global Logistics Hub", HQ Yaoundé, Cameroon (+237 line), sourcing from "Gujarat, Guangzhou and Shenzhen", "logistics architects in Douala, Punjab and Guangzhou"; publishes the GST and IEC above. https://akumaenterprises.com/contact. REPORTED.
- Inference: one small trading partnership (registered Nov 2025) runs several brand sites (pharma FDF/peptides, API/chemicals, Cameroon import-export/logistics). INFERENCE.

## 4. Legacy indexed content on akumaenterprises-pharma.com (search-index snippets; pages now 404 / "Loading article…" + noindex)
- /catalog/*.html API pages with per-gram prices and "WHO-GMP + FDA DMF supplier in **Pune**" (Lamivudine $320/g, Dutasteride $1800/g); **Boldenone Base** (anabolic steroid) "Research Chemicals … From $1.50/g"; Nefiracetam "cognitive-enhancement racetam"; Trametinib, Olaparib, Palbociclib, Ticagrelor, Levamisole (veterinary).
- /news/2026-06-15-noopept-…-supplier-guide-pricing; /news/2026-08-27-sunifiram-…-nootropic-research-guide; /news/2026-06-22-2-aminopyridine-…; /news/2026-06-29-future-of-retatrutide-development; /news/2026-06-30-tirzepatide-api-market-trends.
- Older homepage/solutions snippets: "global supplier of high-quality pharmaceutical ingredients"; "Design, development, and manufacture of pharmaceutical APIs, intermediates, and veterinary compounds"; "100 commercial finished formulations across 11 dosage forms".
- Source: Firecrawl search id 01a1c541-91c1-775a-8137-aa79e6f4e687 and 01a1c545-0827-75db-8da3-43af2cbce5fb (2026-11-10). Verified 404 for boldenone page (raw/site/legacy-catalog-boldenone-404.md); sunifiram page renders "Loading article…" with robots noindex. REPORTED.
- Note: these article dates (June–Aug 2026) predate the domain's registration (2026-10-06), so they were back-dated or carried over from another domain. INFERENCE.

## 5. Certifications
| Claim | Third-party check | Result |
|---|---|---|
| ISO 9001:2015, Bureau Veritas, valid to 2026-12-14 | No certificate number published, so BV's certificate search can't be run; no third-party listing found | UNVERIFIED |
| ISO 9001:2015 "achieved 2012" / "continuous since 2011" | ISO 9001:2015 edition published Sept 2015 (https://www.iso.org/standard/62085.html) | CONTRADICTED (impossible as stated) |
| WHO-GMP / Schedule M, "CDSCO / WHO-GMP, Government of India", valid to 2028-09-14 | No certificate/licence number, no site address; GST shows 0 additional places of business (no factory registered in Punjab under this GSTIN) | UNVERIFIED; INFERENCE: certificate, if any, belongs to a contract manufacturer |
| "WHO-GMP … recognizedBy World Health Organization" (schema) | WHO does not issue GMP certificates to Indian sites; WHO-GMP/CoPP in India is granted by CDSCO with the State Licensing Authority under the WHO Certification Scheme | MISLEADING (INFERENCE, to confirm by Track E) |
| CDSCO manufacturing licence | No licence number anywhere | UNVERIFIED |
| Drug sale/wholesale licence (needed to trade or export drugs) | None published, none found | UNVERIFIED / open question |
| NAFDAC/PPB/SAHPRA/TMDA registrations | Site claims "readiness"/dossiers only; no registration numbers for any product in any country | NOT CLAIMED / none found |

## 6. Social media, directories, reviews, warnings (searches 2026-11-10)
- Social: **no** LinkedIn, Facebook, Instagram, YouTube, X or TikTok account found for "Akuma Enterprise Pharma" / "Akuma Enterprises" (Kharar). The site has share buttons only and no `sameAs` profile links. Brief/BRAND_EXTRACT list none.
- B2B directories (IndiaMART, TradeIndia, ExportersIndia, Go4WorldBusiness): **no listing found** for this firm. (An IndiaMART page exists for the unrelated AKUMA PHARMA PRIVATE LIMITED, Assam.)
- Reviews: **none found** (Trustpilot/Gridinsoft/ScamAdviser searches return nothing for this domain).
- Regulatory warnings / news: **none found** for the domain or firm name (no FDA/WHO/NAFDAC alerts surfaced). Absence of evidence only; the company is ~1 year old.
- Phone +91 7986147827: appears only on the company's own sites and on number-spam lists; no directory listing.
