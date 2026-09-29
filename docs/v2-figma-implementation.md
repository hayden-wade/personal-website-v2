# V2 Figma implementation — 30 September 2026

## Source of truth

Master file: https://www.figma.com/design/SmRGpeF2FU2aR4DYtJ65S9

Implemented from high-fidelity design context and screenshots of the `V2 - Prototype` page (`63:2`), with the mobile reference (`59:3`). The first metadata page listing incorrectly returned only V1; direct document inspection confirmed all fourteen pages.

| Figma frame                  | Website                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| 63:3 / Homepage              | `/`                                                        |
| 63:156 / Projects            | `/projects/`                                               |
| 63:229 / ChassisWire         | `/projects/chassiswire/`                                   |
| 63:386 / E30 Sedan Respray   | `/writing/e30-respray/`                                    |
| 63:487 / Honda CB500 Four    | `/projects/honda-cb500-four/`                              |
| 63:590 / Article             | All seven existing E30 chapter routes                      |
| 63:648 / Photography Gallery | `/photography/`                                            |
| 63:705 / Photography Index   | `/photography/index/`                                      |
| 63:750 / Photography Viewer  | `/photography/viewer/?photo=0` and accessible image dialog |

## What changed

Replaced the warm-stone implementation with charcoal/green surfaces, copper accents, Instrument Serif homepage headings and DM Sans project typography. Rebuilt the navigation, asymmetric homepage cards, compact three-column catalogue, alternating chapter layouts, ChassisWire case study, article layout, photography index and viewer. Retained the existing static generator, contact links, original content and historical routes.

Shared page functions and content arrays supply cards, headers, footers, chapter links and metadata. No framework or production dependency was added. Source files are formatted for editing.

The mobile layout collapses navigation behind a menu, uses compact homepage project rows, stacks editorial sections and keeps readable text measures. Native scrolling is retained. Motion is limited to restrained hover feedback and optional smooth anchor scrolling, with reduced-motion support.

## Working interactions

- Main navigation, mobile menu with Escape handling and section indication.
- Native experience accordions.
- Catalogue filters with live result announcements and counts derived from content.
- ChassisWire concept tabs with arrow-key, Home and End navigation; explanatory content identifies unreleased views.
- Photography gallery/index links, direct-link viewer, image dialog, previous/next arrows, keyboard arrows, Escape, swipe and focus restoration.
- Article contents, reading progress, chapter navigation and project-to-project links.
- Email, LinkedIn, GitHub and all six original Honda posts.

## Content and design decisions

Figma contains many labelled empty image rectangles. Existing verified photographs fill portrait, E30 and photography slots. Six original Honda images were retrieved from the user's published articles and checked against surrounding text; the Suzuki inspiration project and third-party inspiration photographs were excluded. The Honda hero uses the actual purchased project bike, with an accurate caption, rather than claiming an unavailable finished-bike photograph.

Only four verified photography entries are published. The layout and index adapt to those entries, and counts are computed from the collection. Guatemala/Bali captions and empty 24-photo totals were not invented. The current `blue-mountains.jpg` photograph contains Hayden at the lookout; it retains its existing gallery metadata.

Redbank Plains, E30 318iS and M54 remain non-clickable. Their images are still labelled placeholders. M54 uses the more precise planned/collecting-parts state from the approved catalogue, rather than the older ongoing label on the homepage prototype. No future work is described as completed.

The ChassisWire hero, three conceptual view image blocks and E30/M54 use-case photos remain labelled design placeholders. Concept schematics, pin views and diagnostic/BOM examples are illustrative rather than technical wiring guidance. Status/pin SVGs were exported directly from the original Figma nodes after temporary asset URLs returned an unavailable page. Accidental floating lifecycle dots and white backgrounds on prototype navigation wrappers were not reproduced as interface content.

The existing E30 Markdown remains the publication copy. The misleading `before.jpg` filename is not interpreted as evidence of chronology: it is a post-respray photograph, and captions remain accurate. Actual preparation/primer photographs are used for the comparison section. The article template adapts to real article length instead of filling fixed 8,750-pixel frames with invented copy.

## Remaining content slots

- Final chosen homepage hero imagery (the approved dark hero treatment is implemented).
- Redbank Plains, E30 318iS and M54 project photographs and future detail pages.
- ChassisWire product screenshots when available.
- A finished Honda side-profile hero if desired.
- Additional travel/people photographs and verified metadata for the larger gallery design.

## Validation

- `npm run build` succeeds: 19 routes plus the 404 page.
- `npm run check`: 20 HTML pages and 597 local references pass.
- Chromium renders of all nine core screens at 1440px and 390px: one H1 per page, all referenced images decode, no horizontal overflow and no JavaScript exceptions.
- Additional checks at 320px, 768px and 1024px pass without horizontal overflow. Mobile menu, experience accordion, all five project filters, unfinished-project exclusions, keyboard concept tabs, photo viewer focus restoration/arrow navigation/Escape, direct photo URLs, article progress and no-JavaScript page navigation pass.
- Existing E30 Markdown content was not rewritten.

No live-domain deployment is part of this commit.
