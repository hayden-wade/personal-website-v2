# Hayden Wade — Personal Website V2

A complete, responsive personal portfolio and seven-part E30 restoration journal, built around the agreed warm-stone palette, editorial typography and persistent section navigation.

## Open the finished website

**No installation required:** download this repository using **Code → Download ZIP**, extract it, open the `dist` folder and double-click `index.html`. All page links, fonts and photographs work locally. Keep the whole `dist` folder together.

For a local web server, from the repository folder in Windows PowerShell:

```powershell
py -m http.server 8000 --directory dist
```

Then open **http://localhost:8000**. Leave the PowerShell window open while viewing; press Ctrl+C to stop it. If the Python launcher is unavailable, use the double-click option above, or the Node option below.

## Edit and rebuild

Install Node.js 20 or newer. No npm packages or dependency installation are needed.

```sh
npm run build
npm run preview
```

Open **http://localhost:4173**. Re-run `npm run build` after source edits and refresh the browser. `npm run dev` builds once and starts the same local server; it does not hot-reload.

```sh
npm run check
```

The check validates generated pages, local links, image references, heading presence and unfinished draft markers.

## Repository structure

- `docs/`: the original design brief, architecture, palette and motion decisions, plus implementation, asset provenance and validation notes.
- `content/about.md`, `content/experience.md`: editable long-form biographical and professional content.
- `content/projects/`: project descriptions.
- `content/writing/e30-respray/`: seven real Markdown articles plus the series introduction.
- `src/site.mjs`: homepage summaries, article titles, images, links and gallery metadata.
- `src/templates.mjs`: shared layouts and page templates.
- `src/styles.css`: responsive design tokens and styling.
- `src/client.js`: active navigation, restrained motion, reading progress and accessible image enlargement.
- `public/images/`: selected photographs organised by purpose.
- `public/fonts/`: locally served fonts and their OFL licences.
- `scripts/build.mjs`: dependency-free static generator.
- `scripts/serve.mjs`: local HTTP server.
- `scripts/check.mjs`: generated-site validation.
- `dist/`: complete, checked-in, ready-to-open website.

## Pages

Homepage; About; Experience; Projects; ChassisWire; Automotive Engineering; Writing; Photography; E30 series index; and all seven individual E30 articles. A custom 404 page is included.

Navigation flow: **Homepage → Writing → Restoring an E30 → individual chapter**. Every article also includes its own contents, next chapter and full series navigation.

## Content notes

The E30 articles adapt the supplied Word draft. The document contained two versions of the series; the later set was used, with editorial/photo prompts removed and verified photos inserted. Personal recollections remain qualified. The paint-correction chapter does not claim the entire correction was completed. The final spray was handled by a painter after Hayden prepared the car.

ChassisWire and automotive engineering projects are explicitly described as in development. The ChassisWire drawing is a concept schematic, not a released-product screenshot.

The hero uses the existing AI-generated alpine E30 artwork from the design exploration. Restoration photographs are the actual Glacier Blue sedan. The hero artwork is kept out of the photography gallery. See `docs/assets-and-content.md` for sources and image selection.

## Deployment

The site is static: publish the contents of `dist` to a static host. No database, API keys, account system or build-time environment variables are needed. A private Sites preview is configured in `.openai/hosting.json`; GitHub remains the requested source repository.
