# SEO / GBP Changelog — branch `seo-gbp-nl`

Scope: maximize organic SEO and Google Business Profile (GBP) support for **tz-digital.nl**
(the Maastricht/NL-market site). Everything below was done autonomously; the "Open questions"
section at the bottom lists the handful of things that need a human decision.

Before touching anything: this Claude Code session was originally launched inside the
**tz-digital DE** repo folder by mistake (the launch prompt targeted tz-digital-nl, but the
working directory was the German sibling repo). I caught the mismatch before making any
changes, confirmed it with you, and switched into the correct `tz-digital` (NL) repo — the DE
repo was never touched.

---

## 1. The most important finding: real NAP data exists in this repo

`impressum.html` / `datenschutz.html` (required German legal pages, since the business is a
German *Einzelunternehmen*) contain the only real, documented business address in the whole
site:

```
TZ Digital
Inhaber: Albert Zapke
Am Ruhrstein 56
45133 Essen
Deutschland
E-Mail: albertjnr.zapke@t-online.de
Telefon: +49 1517 2507603
```

This is the **same legal entity** as the DE sibling site (tz-digital.de) — there is only one
registered business, based in Essen, Germany, marketing itself to two different geographic
markets (Essen/DE via tz-digital.de, and Maastricht/NL/BE border region via tz-digital.nl).
The homepage schema previously had no `address` field at all. I used this Essen address as the
canonical NAP for structured data everywhere on this site, since inventing a Maastricht address
that doesn't exist would be worse than using the real, legally-filed one. **This has real
implications for the GBP setup — see Open Questions #1, it's the biggest one.**

## 2. Meta tags (title / description)

Audited all 16 HTML pages (9 EN at root, 7 in `/nl/`, including the 2 German-language legal
pages). Titles targeted 50–60 chars, descriptions 140–160 chars.

- Shortened both homepage titles (EN was 68 chars, NL was 61) and the NL homepage description
  (was 172 chars)
- Shortened: `nl/nfc-tags-maastricht.html` title (73→41), `nl/seo-kapsalons-maastricht.html`
  description (181→160), `nl/website-laten-maken-kapsalons-maastricht.html` title/description,
  `nl/website-laten-maken-maastricht.html` title, `seo-hair-salons-maastricht.html`
  description, `website-design-hair-salons-maastricht.html` description,
  `website-design-maastricht.html` title/description
- All `og:title`/`og:description` kept in sync with the corresponding `<title>`/description
- No duplicate titles or descriptions existed before or after — the site was already good
  about this, I just tightened lengths
- `ai-agents-maastricht.html` (EN, 48 chars) and a couple of NL titles landed slightly under 50
  after trimming — left them, since padding a title with filler words to hit a number is worse
  than a clean, accurate title a few characters short

## 3. Headings

All 16 pages already had exactly one `<h1>` and logical `h2`/`h3` nesting. No changes needed —
verified with a scripted count across every file.

## 4. Structured data (JSON-LD)

- **Homepage** (`index.html`, `nl/index.html`): added a full `PostalAddress` (the real Essen
  NAP above) to the `ProfessionalService` schema, and gave it a stable `@id`
  (`https://tz-digital.nl/#business`) so every other page can reference the same entity instead
  of re-declaring it.
- **All 12 service subpages**: added `BreadcrumbList` JSON-LD (none existed anywhere before).
  Two-level for top-tier pages (Home → Service), three-level for the salon-niche pages (Home →
  Service → Salon variant), matching the site's actual content hierarchy.
- **All 12 service subpages**: changed `Service.provider` from an inline duplicate
  `ProfessionalService` object (repeated 12 times with slightly different `url` values) to a
  single `"@id": "https://tz-digital.nl/#business"` reference. This avoids Google seeing 13
  near-identical-but-not-identical business entities across the site.
- Did **not** add `logo`, `sameAs`, `priceRange`, or `openingHours` — none of these exist
  anywhere in the repo and I didn't want to invent them. See Open Questions.
- Did **not** add `Review`/`AggregateRating` schema — there are no testimonials or reviews
  anywhere on the site to mark up, and fabricating reviews would be both dishonest and a
  violation of Google's structured-data guidelines (which can get a site penalized). Real
  reviews will come from the GBP listing once it's live — see the GBP content deliverable for
  review-response templates to use once you have some.
- Verified every JSON-LD block on every page parses as valid JSON (scripted check, 0 errors
  across all 16 files, both before and after edits).

## 5. hreflang

- Homepage (`index.html`, `nl/index.html`) already had `en`/`nl`/`x-default` hreflang pairing
  the two homepages with each other — that was correct and untouched.
- Added `hreflang="de"` on **both homepages only**, pointing at `https://tz-digital.de/` (the
  DE sibling's live URL, confirmed from your memory notes on the DE repo). Also added the
  matching `de` alternate to the two homepage `<url>` entries in `sitemap.xml`.
- **Did not** add `de` hreflang to the 12 service subpages. hreflang is meant to link
  *translations of the same content* — tz-digital.de and tz-digital.nl serve genuinely
  different markets (Essen vs. Maastricht) with different service pages (e.g. DE has
  `ki-agentur-essen.html`, `nfc-bewertungstags-essen.html`; NL has differently-scoped
  equivalents). Pairing them 1:1 the way EN/NL pages are paired would be semantically wrong and
  could confuse Google's indexing rather than help it. I limited this to the homepage, which is
  the one place both sites genuinely represent "the same business."
- This is a one-way link — the DE session would need to add the reciprocal `hreflang="nl"` →
  `https://tz-digital.nl/` on the DE homepage for it to fully take effect. Flagging this so you
  can coordinate the two sessions.

## 6. Images

- Added explicit `width`/`height` to all 6 meaningful images on both homepages (3 portfolio
  screenshots, 3 team photos), using their real intrinsic pixel dimensions (extracted directly
  from the JPEG headers, not guessed). Practically, this doesn't fix any real layout-shift bug —
  the CSS already hard-sizes both image types (`.browser-mockup__shot` is a fixed-height box,
  `.team-card__photo` is a fixed 96×96 circle) — but it's still correct per the checklist and
  costs nothing.
- Alt text was already descriptive and per-language (e.g. "de Vriendschap Kapsalon website
  screenshot" / "Screenshot van de website van de Vriendschap Kapsalon") — no changes needed.
- `loading="lazy"` was already present on every image.
- Did not touch the actual image files. `portfolio-roundabout.jpg` is 328KB, which is larger
  than ideal for a screenshot rendered at a max ~330px-tall box — converting the 3 portfolio
  JPGs to WebP would meaningfully help LCP on the homepage. I don't have image-processing
  tooling available in this environment (no ImageMagick, no PIL), so I didn't attempt it rather
  than risk corrupting the assets. Flagging as a follow-up.

## 7. Sitemap & robots.txt

- `robots.txt` was already correct (`Allow: /`, correct `Sitemap:` reference) — no changes.
- `sitemap.xml`: removed `impressum.html` and `datenschutz.html` — both carry
  `<meta name="robots" content="noindex, follow">`, so they shouldn't be in the sitemap (minor
  inconsistency, now fixed). Added the `de` hreflang alternate to the two homepage entries to
  match the HTML. Bumped `lastmod` to 2026-08-01 on every entry actually touched.
- Every real, indexable page is listed; no orphaned or missing URLs.

## 8. Canonical tags

All 14 indexable pages already had correct, self-referencing canonicals — no changes needed.
Added canonical tags to `impressum.html` and `datenschutz.html` too (they stay `noindex`, this
is just best practice / harmless).

## 9. Internal linking

- The site already had a partial "related service" cross-link mesh (e.g.
  `seo-maastricht.html` → `seo-hair-salons-maastricht.html`,
  `website-laten-maken-kapsalons-maastricht.html` ↔ `seo-kapsalons-maastricht.html`).
- The **AI Agents** and **NFC Review Tags** pages (both languages) had *no* contextual internal
  links at all — they were reachable only from the homepage services grid and the sitemap, with
  no other page linking into them. Added a "Related service"/"Gerelateerde dienst" section
  cross-linking AI Agents ↔ NFC Review Tags on all 4 pages, since they're natural companion
  "growth add-on" services.
- Ran a scripted crawl of every internal `href`/`src` on every page against the actual
  filesystem: **zero broken links**, both before and after all edits.

## 10. Core Web Vitals

The site was already in decent shape here: fonts are self-hosted `.woff2` with
`font-display: swap`, all non-critical scripts sit at the end of `<body>` (not render-blocking),
and images are already lazy-loaded with CSS-fixed box sizes. I added:

- `<link rel="preconnect">` hints for every external origin each page actually loads
  (`cdnjs.cloudflare.com` + `cdn.jsdelivr.net` + `googletagmanager.com` on the homepage;
  `cdn.jsdelivr.net` + `googletagmanager.com` on the lighter subpages, which don't load
  Three.js/GSAP) — shaves the DNS/TLS handshake off the critical path for those requests.
- Explicit image dimensions (see §6).

The one real follow-up opportunity is the portfolio JPG file sizes mentioned in §6.

## 11. Mobile usability — found and fixed a real bug

This was the most significant finding of the whole audit. `.nav__links { display: none; }`
kicked in below 640px width with **no replacement navigation** — on any phone, the entire
primary nav (Work / Services / Pricing / About / Contact) simply disappeared. Visitors on
mobile could only reach the language toggle, the logo (scroll-to-top), and whatever was in the
footer. This is the same category of bug as the portfolio-swipe issue already fixed on the DE
sibling site, just in a different component.

Fixed by adding a working hamburger menu:
- New `.nav__toggle` button (animates to an ✕ when open) on all 16 pages
- New CSS: on mobile, the button appears and `.nav__links` becomes a full-width dropdown panel
  triggered by a `.nav--open` class
- New JS in both `js/main.js` (homepage) and `js/subpage.js` (every other page): click toggles
  the class + `aria-expanded`, and clicking any link inside the menu closes it automatically
- `impressum.html` and `datenschutz.html` previously loaded **no JavaScript at all** (not even
  Lenis), so the new button would have been dead on those two pages — added the same
  `<script>` includes every other page uses. `datenschutz.html` already discloses site-wide
  Lenis usage in its own text, so this didn't require a new privacy-policy disclosure.
- Caught and fixed a follow-up bug during testing: the toggle button initially rendered with
  the browser's default white button chrome (only `font`/`color` are globally reset on
  `<button>`, not `background`/`border`). Fixed by explicitly resetting both.
- **Verified in an actual browser**, not just by reading the CSS: started a local static
  server, loaded the homepage, and confirmed the full open → dropdown-panel-renders →
  tap-a-link → menu-closes-and-smooth-scrolls flow works end-to-end (the automated window-resize
  tool available in this environment didn't actually shrink the viewport, so I validated the
  real breakpoint behavior by injecting the exact `@media (max-width: 640px)` ruleset at runtime
  and clicking through it).
- The portfolio horizontal-scroll section on the homepage already had proper mobile swipe
  support (`scroll-snap-type`, `touch-action: pan-x`, dot-navigation synced to scroll position)
  — this was already correct, likely built after the same fix was made on the DE site.
- Tap targets: buttons (`.btn`) already have ~44px effective height via padding — meets the
  standard 44×44px minimum. No changes needed.
- Viewport meta tag (`width=device-width, initial-scale=1.0`) was already correct on every
  page.

## 12. 404s / broken links

Scripted crawl of every internal link and asset reference across all 16 pages, resolved against
the actual filesystem. Zero broken links found, before or after this branch's changes.

## 13. GBP on-site support

- **LocalBusiness/NAP schema**: see §1 and §4 — the real Essen address is now in the homepage
  schema, referenced by every subpage's `Service.provider`.
- **Google Map embed**: the homepage had no map at all. Added a Google Maps iframe embed near
  the contact section on both homepages (`index.html`, `nl/index.html`). Deliberately embedded
  a **service-area map centered on "Maastricht, Netherlands"**, not a pin dropped on the Essen
  legal address. Reasoning: this site markets to the Maastricht/NL market, and a map pin on a
  German street address ~250km away would be confusing to visitors and could work against a
  service-area-business GBP setup (which typically doesn't show a public address at all). This
  sidesteps Open Question #1 below rather than presupposing an answer to it.
- **Review/AggregateRating schema**: not added. There are no testimonials or reviews anywhere
  in the site content to mark up honestly — see §4. `GBP-CONTENT-NL.md` includes
  review-response templates for once real reviews start coming in via the GBP listing itself.
- **Multi-location / service-area pages**: the site serves one location (legally) across four
  named cities (Maastricht, Heerlen, Sittard-Geleen, Aachen) via `areaServed` in schema, but
  only Maastricht gets a full page — there's no dedicated Heerlen/Sittard-Geleen/Aachen landing
  page. Per your instructions I'm not building these unprompted; flagging it as a strategic
  next-phase idea (see below) rather than scope creep.

## 14. Content gaps (strategic recommendations, not built)

- **No blog/resources/FAQ hub.** Each service page has its own `FAQPage` schema and Q&A
  content, which is good, but there's no central FAQ or blog section to build topical authority
  or catch long-tail queries. Worth considering as a next phase.
- **No secondary-city landing pages.** Heerlen, Sittard-Geleen, and Aachen are named in every
  page's `areaServed` schema but have no dedicated content. If those markets matter
  commercially, city-specific landing pages (mirroring the existing Maastricht pages) would be
  a natural next SEO phase.
- **No social profile links anywhere in the repo.** If TZ Digital has Instagram/LinkedIn/etc.,
  adding `sameAs` to the business schema and linking them from the footer would help citation
  consistency and GBP "profile" signals.

---

## Open questions (need a human decision — did not guess)

1. **GBP listing structure, given the Essen address.** The legally registered address is in
   Essen, Germany (~250km from Maastricht). This site markets to Maastricht/NL/BE border area.
   Before publishing anything in `GBP-CONTENT-NL.md`, you need to decide:
   - **One shared GBP listing** (service-area business based in Essen, hiding the address,
     service area = Maastricht + Heerlen + Sittard-Geleen + Aachen, possibly combined with the
     DE-market service area too), or
   - **Two separate GBP listings** (one for the DE-market brand, one for the NL-market brand) —
     note Google's duplicate-listing policy is strict about the *same business* having multiple
     listings at the *same address*; this only works cleanly if the two are positioned as
     genuinely distinct offerings/brands, or
   - Getting an actual NL/Maastricht-area correspondence address if one exists that isn't
     documented in this repo.
   This determines the address field, service-area configuration, and whether the map/schema
   approach I chose (service-area map, no address pin) is the right long-term answer or just a
   safe placeholder.
2. **No logo file exists in this repo's `assets/` folder.** I saw evidence of "Logo GBP.png"
   and other logo files in your broader `AJ Digital` folder (outside this repo), but nothing
   committed to the site itself. A logo is needed both for GBP (required for a complete
   profile) and for the `logo` schema property. If you want it added, drop a logo file into
   `assets/` and I (or the DE session, since it's the same brand) can wire it up.
3. **No social media profile URLs found anywhere.** If TZ Digital has Instagram, LinkedIn,
   Facebook, etc., these should be added as `sameAs` in the schema and linked from the site —
   they help GBP profile strength and citation consistency.
4. **No opening hours documented anywhere.** GBP requires these for most business categories.
   Since this is a service business without walk-in customers, "by appointment" or specific
   hours both work, but I won't guess which.
5. **VAT/tax ID still pending.** `impressum.html` itself says
   *"[TBD — Umsatzsteuer-Identifikationsnummer bzw. Kleinunternehmer-Hinweis nach § 19 UStG,
   sobald vom Finanzamt bestätigt]"* — the business's own tax registration isn't finalized yet.
   Not a website SEO issue, but relevant context for GBP verification, which sometimes asks for
   business registration documents.
6. **hreflang reciprocity with the DE site** (see §5) — the DE session needs to add a matching
   `hreflang="nl"` tag on `tz-digital.de`'s homepage for this to be a complete pair.

## Build / lint / test

This is a static HTML/CSS/JS site with no `package.json` and no build step. "Testing" for this
branch consisted of:
- A scripted JSON-LD validity check across all 16 pages (0 errors)
- A scripted internal-link/asset-reference crawl across all 16 pages (0 broken links)
- An XML well-formedness check on `sitemap.xml`
- Loading the homepage in an actual browser and manually verifying the new mobile nav menu
  (open, dropdown renders, link-click closes + scrolls) — this is also where I caught and fixed
  the white-button-background bug (§11)

Nothing else in the repo (styling, existing JS behavior, portfolio swipe, contact form) was
touched outside of what's described above.
