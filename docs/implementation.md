# Implementation

The agreed repository structure is preserved. The portfolio uses static HTML generated from small shared Node templates and Markdown content. This keeps the site portable, easy to inspect, and usable directly from the exported folder without a local development environment.

## Design

- Exact eight-colour palette from `design-system.md`.
- Instrument Serif for editorial headings, DM Sans for interface and body copy; both served locally.
- Full-screen landscape hero with restrained title movement.
- Sticky desktop table of contents with active section indicator; collapsible mobile index.
- Alternating E30 chapter compositions, including the deep green-grey painting section.
- Long-form articles with contents, next chapter and full-series navigation.
- Image enlargement uses a native modal dialog, Escape dismissal and restored focus.
- Reduced-motion preference disables reveal and scroll effects; content is visible without JavaScript.
- Print styles remove navigation and controls.

## Content editing

Articles use `#` for title, `##` for section headings, paragraphs, `**bold**`, Markdown links, image syntax and `>` blockquotes. The generator escapes content before rendering. The deliberately small Markdown subset does not support raw HTML or nested lists.

Homepage summaries and gallery selections live in `src/site.mjs`; long-form pages read their Markdown. The E30 series landing composition is in `src/templates.mjs`.

`dist` is tracked so the user can download the repository and immediately open it. Run `npm run build` after source edits, and commit the regenerated output with the source change. Font files require no network connection when viewing the site.
