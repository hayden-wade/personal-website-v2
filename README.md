# Hayden Wade — Personal Website V2

Responsive implementation of the approved **V2 — Dark Minimalistic** Figma design, using the existing dependency-free static site generator. Includes the homepage, project catalogue, ChassisWire case study, E30 respray journal, Honda CB500 Four archive and photography gallery/index/viewer.

## View locally

From your existing Windows checkout:

```powershell
cd C:\Users\hwade\Documents\Github\personal-website-v2
git pull --ff-only
npm run build
npm run preview
```

Open **http://localhost:4173**. Press Ctrl+C to stop the server.

If you have not cloned it on that computer:

```powershell
cd C:\Users\hwade\Documents\Github
git clone https://github.com/hayden-wade/personal-website-v2.git
cd personal-website-v2
npm run preview
```

Requires Node.js 20 or newer. No `npm install` is required. The checked-in `dist` is ready to view. You can also open `dist/index.html` directly; links, fonts, images and viewer controls use relative paths.

## Commands

- `npm run build` regenerates `dist` from source and content.
- `npm run preview` serves `dist` at port 4173.
- `npm run dev` builds once and serves the result; refresh after rebuilding edits.
- `npm run check` checks generated pages, local links, anchors, images and heading presence.

## Where to edit

| File                           | Purpose                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| `src/templates.mjs`            | Shared header/footer, cards, page templates, articles and galleries                       |
| `src/styles.css`               | Dark design tokens, layouts, responsive rules and reduced-motion support                  |
| `src/client.js`                | Mobile menu, accordions, project filters, concept tabs, photo viewer and reading progress |
| `src/projects.mjs`             | Project status, descriptions, routes and all six Honda archive links                      |
| `src/site.mjs`                 | Contact details, career summaries, E30 chapter metadata and photography collection        |
| `content/writing/e30-respray/` | The seven existing E30 articles in Markdown                                               |
| `public/images/`               | Local photographs                                                                         |
| `public/assets/figma/`         | Original exported Figma status/pin vectors                                                |
| `scripts/build.mjs`            | Static generator and relative URL handling                                                |

## Design reference and implementation notes

[Master Figma / V2 prototype](https://www.figma.com/design/SmRGpeF2FU2aR4DYtJ65S9?node-id=63-2)

See [the implementation handover](docs/v2-figma-implementation.md) for screen mappings, checks, deliberate content decisions and remaining image slots.

The gallery currently contains the four verified photographs already in the repository. Add entries to `gallery` in `src/site.mjs` to grow it; viewer counts follow the content automatically. The Figma's 24 empty photo slots are not presented as 24 real photographs.

Redbank Plains, E30 318iS and the M54 conversion have catalogue entries but no clickable detail pages. M54 remains **planned / collecting parts**. ChassisWire UI examples are explicitly labelled as product concepts; the portfolio does not claim to contain a released wiring editor.

The six Honda articles link to their original published versions. Their selected photographs are hosted locally. The E30 articles and original routes are retained.

## Publishing

This change updates GitHub source and the generated `dist` folder. It does not publish to the live domain. The site is static and needs no secrets, database or account system.
