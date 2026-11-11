# Studio kit (generic, client-neutral)
Reusable scenario components for any client's `studio/src/lib/` (copy, do not symlink, so each client stays self-contained):
- `lib/map.tsx` + `data/geo.json`: Africa (+ India, Arabian Peninsula) from Natural Earth 1:50m (public domain), camera zoom, pins, labels
- `lib/flags.tsx`: waving national flags in official colours (NG, CM, TD, CI, GH, SN, KE, IN; add more as needed)
- `lib/people.tsx`: drawn characters (skin tones, hair, outfits, poses, expressions, props) + speech bubble
- `lib/thread.tsx`: the thread / node / knot device
Rules: no client names, brands or logos in this folder; client-specific pictograms live in the client's own studio.
Install: `cp hq/kit/lib/*.tsx clients/<slug>/studio/src/lib/ && mkdir -p clients/<slug>/studio/src/data && cp hq/kit/data/geo.json clients/<slug>/studio/src/data/`
