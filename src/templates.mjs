import { site, posts, jobs, gallery } from "./site.mjs";
import { projects as projectData, hondaPosts } from "./projects.mjs";
import fs from "node:fs";
const dimensions = JSON.parse(
  fs.readFileSync(
    new URL("../public/image-sizes.json", import.meta.url),
    "utf8",
  ),
);
export const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export const postUrl = (p) => "/writing/e30-respray/" + p.slug + "/";
export const e30Image = (n) => "/images/e30-respray/" + n + ".jpg";
export const img = (src, alt, cls = "", eager = false) =>
  `<img src="${src}" alt="${esc(alt)}" class="${cls}" ${dimensions[src] ? `width="${dimensions[src][0]}" height="${dimensions[src][1]}"` : ""} loading="${eager ? "eager" : "lazy"}" decoding="async" ${eager ? 'fetchpriority="high"' : ""}>`;
const link = (url, label, cls = "text-link") =>
  `<a class="${cls}" href="${url}">${label}</a>`;
const label = (text) => `<p class="eyebrow">${text}</p>`;
const placeholder = (text, cls = "") =>
  `<div class="media-placeholder ${cls}" role="img" aria-label="${esc(text)} — image to be added"><span>${text}</span></div>`;
const figure = (src, caption, cls = "", eager = false) =>
  `<figure class="media ${cls}"><button class="image-button" data-enlarge="${src}" data-caption="${esc(caption)}" aria-label="Enlarge: ${esc(caption)}">${img(src, caption, "", eager)}</button><figcaption>${caption}</figcaption></figure>`;
const header = (home = false) =>
  `<header class="site-header ${home ? "home-nav" : ""}"><a class="wordmark" href="/">HAYDEN WADE</a><button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">MENU <span aria-hidden="true">+</span></button><nav id="site-nav" aria-label="Main navigation">${(home
    ? [
        ["/#about", "About"],
        ["/#experience", "Experience"],
        ["/#projects", "Projects"],
        ["/#photography", "Photography"],
        ["/#contact", "Contact"],
      ]
    : [
        ["/projects/", "Projects"],
        ["/photography/", "Photography"],
        ["/#about", "About"],
      ]
  )
    .map(([u, t]) => link(u, t))
    .join("")}</nav></header>`;
const footer = () =>
  `<footer class="site-footer"><a href="/">HAYDEN WADE</a><nav aria-label="Footer navigation">${link("/projects/", "Projects")}${link("/photography/", "Photography")}${link("/#about", "About")}${link("#top", "Top ↑")}</nav></footer>`;
const modal = `<dialog class="lightbox" aria-label="Photograph viewer"><div class="viewer-header"><span>HAYDEN WADE</span><span>PHOTOGRAPHY</span><button class="lightbox-close">CLOSE ×</button></div><div class="viewer-stage"><button class="viewer-prev" aria-label="Previous photograph">←</button><figure><img alt=""><figcaption><span class="viewer-caption"></span><span class="viewer-count"></span></figcaption></figure><button class="viewer-next" aria-label="Next photograph">→</button></div></dialog>`;
export function shell(title, description, body) {
  return `<!doctype html><html lang="en-AU" id="top"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#171a18"><title>${esc(title)}${title === "Hayden Wade" ? " — Engineer & Builder" : " — Hayden Wade"}</title><meta name="description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/styles.css"><script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script><script src="/assets/client.js" defer></script><script src="/assets/home-motion.js" defer></script></head><body><a class="skip" href="#main">Skip to content</a>${body}${modal}</body></html>`;
}
const wires = () =>
  `<div class="wire-preview"><span>SCHEMATIC / UI / WIRING</span><div>${Array.from({ length: 5 }, (_, i) => `<i style="--wire-width:${100 - i * 12.5}%"></i>`).join("")}</div></div>`;
function card(p, i, home = false) {
  const visual = p.image
    ? img(p.image, p.name)
    : p.id === "chassiswire"
      ? wires()
      : placeholder(p.visual);
  return `<article class="project-card project-${p.id}" data-status="${p.status}">${!home ? `<span class="card-number">${String(i + 1).padStart(2, "0")}</span>` : ""}${p.url ? `<a class="card-visual" href="${p.url}" aria-label="View ${esc(p.name)}">${visual}</a>` : `<div class="card-visual">${visual}</div>`}<div class="card-copy">${!home ? label(p.category) : ""}<h3>${p.url ? link(p.url, `${p.name}<span aria-hidden="true">↗</span>`, "card-title") : p.name}</h3><p>${p.description}</p><p class="status ${p.status}"><img class="status-dot" alt="" src="/assets/figma/marker-${p.status === "active" ? 0 : p.status === "planned" ? 1 : 2}.svg">${home ? p.category + " · " : ""}${p.status} · ${p.period}</p>${!home ? (p.url ? link(p.url, "View →") : label(p.status === "planned" ? "Project not started" : "Project page in progress")) : ""}</div></article>`;
}
const jobList = () =>
  `<div class="experience-list">${jobs.map((j, i) => `<details class="job" ${i === 0 ? "open" : ""}><summary><span class="job-number">0${i + 1}</span><img class="job-logo job-logo-${["boeing", "adha", "raaf"][i]}" src="/assets/logos/${["boeing", "adha", "raaf"][i]}.svg" alt="" width="28" height="28"><span class="job-title"><strong>${j.name}</strong><span>${j.role}</span></span><time>${j.date}</time><span class="job-toggle" aria-hidden="true"></span></summary><div class="job-copy">${i === 0 ? label("Brisbane, Australia · Defence / Cyber / Engineering") : ""}<p>${j.copy}</p><div class="job-tags">${(i === 0 ? ["Product security", "Systems engineering", "Defence", "Cyber"] : i === 1 ? ["Cybersecurity", "Project coordination"] : ["Engineering", "Capability", "Cyber"]).map((t) => `<span>${t}</span>`).join("")}</div></div></details>`).join("")}</div>`;
const homeSection = (id, n, title, body) =>
  `<section class="home-section" id="${id}"><div class="section-label">${label("0" + n + " / " + id)}<span aria-hidden="true">↘</span></div><h2 class="serif">${title}</h2>${body}</section>`;
export function home() {
  return shell(
    "Hayden Wade",
    "Product Security Engineer in Brisbane. Engineering, old cars and projects in progress.",
    `<div class="home-reveal-shell"><header class="hero">${img("/images/hero/alpine-e30.jpg", "Red E30 in an alpine landscape — concept artwork", "hero-image", true)}<div class="hero-top"><span>CYBERSECURITY · ENGINEERING · OLD CARS</span>${link("#contact", "Let’s talk ↗")}</div><h1 class="hero-title"><span>Hayden</span><em>Wade</em></h1><p class="hero-role">PRODUCT SECURITY ENGINEER<br> + BUILDER</p><div class="hero-bottom"><span>BASED IN BRISBANE,<br> AUSTRALIA</span>${link("#about", "↓ &nbsp; EXPLORE")}<span>SELECTED WORK<br> 2026</span></div></header>${header(true)}<main id="main" class="home-main">${homeSection("about", 1, "Engineer by profession.<br> <em>Compulsive project starter<br> by nature.</em>", `<div class="about-grid"><div><p>I work across engineering, cyber, software and complex technical systems.</p><p>Outside work, I’m usually rebuilding an old BMW, working on the house, taking photos or starting something else I probably don’t have time for.</p></div>${figure("/images/about/portrait.jpg", "Blue Mountains / Away from the workshop")}</div><div class="interest-strip"><span>Brisbane, AU</span><span>Engineering</span><span>Old cars</span><span>Photography</span><span>Making</span></div>`)}${homeSection("experience", 2, "A technical foundation.<br> <em>A broader perspective.</em>", jobList())}${homeSection("projects", 3, "Selected work.<br> <em>Things I’m building, restoring<br> and finishing.</em>", `<div class="home-projects">${projectData.map((p, i) => card(p, i, true)).join("")}</div><div class="section-end"><p>Notes from doing things the difficult way.</p>${link("/projects/", "All projects →")}</div>`)}${homeSection("photography", 4, "Places, cars<br> <em>& other things.</em>", `<section class="photo-3d-stage" aria-label="Photography gallery"><div class="photo-3d-grid" data-staggered-photo-grid>${gallery.slice(0, 35).map((g, i) => `<a class="photo-3d-item" href="/photography/viewer/?photo=${i}" data-gallery-photo="${i}" data-enlarge="${g.image}" data-caption="${esc(g.caption + " / " + g.category)}" aria-label="View ${esc(g.caption)}">${img(g.image, g.caption)}<span class="photo-3d-meta">${g.category}</span></a>`).join("")}</div></section><div class="section-end">${link("/photography/", "View photography →")}</div>`)}</main></div><footer class="footer" id="contact">
  <div class="footer__marquee">
    <div class="footer__marquee-content rail">
      <span>
        The artist is not a person who creates art, but one who creates
        possibilities in every breath they take. Creation is not confined to the
        canvas or the stage; it’s a perpetual dance between intuition and the
        unknown, unfolding in every moment.
      </span>
      <span>
        The artist is not a person who creates art, but one who creates
        possibilities in every breath they take. Creation is not confined to the
        canvas or the stage; it’s a perpetual dance between intuition and the
        unknown, unfolding in every moment.
      </span>
    </div>
  </div>
  <div class="footer__center">
    <div class="footer__center-content">
      <p>The artist’s role is not to control or dictate, but to serve as a channel, allowing the raw energy of creation to flow through them unfiltered. In every brushstroke, note, or word, there is a glimpse of the infinite—a reminder that creativity is not something you do, but something you are.</p>
    </div>
    <div class="footer__svg-animation">
      <svg width="100%" viewBox="0 0 242 94" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-animation" aria-hidden="true">
        <text class="svg-letter" x="159" y="94" textLength="83" lengthAdjust="spacingAndGlyphs" font-family="Inter, Helvetica Neue, Arial, sans-serif" font-size="128" font-weight="300">W</text>
        <text class="svg-letter" x="82" y="94" textLength="69" lengthAdjust="spacingAndGlyphs" font-family="Inter, Helvetica Neue, Arial, sans-serif" font-size="128" font-weight="300">B</text>
        <text class="svg-letter" x="0" y="94" textLength="70" lengthAdjust="spacingAndGlyphs" font-family="Inter, Helvetica Neue, Arial, sans-serif" font-size="128" font-weight="300">H</text>
      </svg>
    </div>
  </div>
  <div class="footer__bottom">
    <div class="footer__bottom-links">
      <a href="#" class="footer__link">Explore your own path</a>
      <a href="#" class="footer__link">Create from within</a>
      <a href="#" class="footer__link">Listen to your inner voice</a>
    </div>
    <div class="footer__bottom-text">
      <p>Safeguarding the unseen, made seen ― © 2024</p>
    </div>
  </div>
</footer>`,
  );
}
export function projects() {
  return shell(
    "Projects",
    "Cars, motorcycles, software and a house. A growing record of projects.",
    `${header()}<main id="main" class="page-wrap"><section class="index-intro">${label("Projects")}<div class="split-heading"><h1>Things I’ve built,<br> rebuilt & probably<br> spent too much time on.</h1><p>Cars, motorcycles, software and a house.<br> A growing record of projects I’ve worked on over the years.</p></div></section><div class="filters" role="group" aria-label="Filter projects">${["all", "active", "complete", "archive", "planned"].map((s, i) => `<button data-filter="${s}" aria-pressed="${i === 0}">${s} <span>${String(s === "all" ? projectData.length : projectData.filter((p) => p.status === s).length).padStart(2, "0")}</span></button>`).join("")}</div><p class="sr-only" aria-live="polite" id="filter-result"></p><div class="project-grid">${projectData.map((p, i) => card(p, i)).join("")}</div><div class="more-to-come">${label("More to come.")}<p>This page will probably never actually be finished.</p><span class="meta">06 projects · Last updated 2026</span></div></main>${footer()}`,
  );
}
function projectIntro(name, title, meta, period, visual) {
  return `<div class="breadcrumb">${link("/projects/", "← All projects")}<span>${period}</span></div><section class="project-intro">${label(name)}<div class="split-heading"><h1>${title}</h1><p class="meta">${meta}</p></div>${visual}</section>`;
}
const projectNav = (prev, next) =>
  `<nav class="project-navigation" aria-label="Other projects"><div>${prev ? `${label("← Previous project")}${link(prev[0], prev[1])}` : ""}</div><div>${label("Next project →")}${link(next[0], next[1])}</div></nav>`;
const chapter = (p, i, total) =>
  `<article class="chapter"><div class="chapter-heading">${label(String(i + 1).padStart(2, "0"))}<h2>${link(p.url || postUrl(p), p.title, "heading-link")}</h2><p>${p.description}</p></div><a class="chapter-image" href="${p.url || postUrl(p)}" aria-label="Read ${esc(p.title)}">${img(p.url ? p.image : e30Image(p.image), p.caption || p.title)}</a><div class="chapter-foot"><span>${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>${link(p.url || postUrl(p), "Read ↗")}</div></article>`;
export function series() {
  return shell(
    "E30 sedan respray",
    "Seven chapters documenting the restoration of a Glacier Blue BMW E30.",
    `${header()}<main id="main" class="page-wrap project-page">${projectIntro("E30 sedan respray", "Learning bodywork by doing<br> essentially all of it<br> the hard way.", "1990 BMW E30 318i<br> Glacier Blue<br> Adelaide, SA<br> 7-part series", "2021 — 2026", figure(e30Image("finished"), "The finished Glacier Blue E30", "project-hero", true))}<div class="down-link">${link("#story", "↓")}</div><section id="story" class="project-section">${label("01 / The story")}<div class="story-grid"><h2>A $4,000 daily driver, a hailstorm, an insurance write-off and a slightly questionable decision to learn bodywork myself.</h2><p>The project took over much of 2023: stripping the car, repairing hail damage and rust, preparing it for paint and eventually putting the whole thing back together.</p></div><div class="media-pair">${figure(e30Image("primer"), "During preparation / stripped shell")}${figure(e30Image("finished"), "After / finished car")}</div></section><section class="project-section" id="chapters">${label("02 / The process")}<h2>Seven chapters documenting the project<br> from daily driver to finished car.</h2><div class="chapters">${posts.map((p, i) => chapter(p, i, 7)).join("")}</div></section><section class="project-section">${label("03 / The result")}<div class="media-pair">${figure(e30Image("bodywork"), "Bodywork / preparation")}${figure(e30Image("finished"), "Finished E30")}</div><aside class="editorial-note">${label("2026 update")}<p>The paint and filler have held up remarkably well. Some boot-channel rust has returned, and there’s still finishing work I’d like to do.</p></aside></section><section class="project-section detail-grid">${figure(e30Image("paint-detail"), "Glacier Blue / paint detail")}${figure(e30Image("current-car"), "Back in the workshop")}${figure(e30Image("final-front"), "The finished car")}</section>${projectNav(null, ["/projects/honda-cb500-four/", "Honda CB500 Four"])}</main>${footer()}`,
  );
}
export function honda() {
  return shell(
    "Honda CB500 Four",
    "Rebuilding a forty-year-old Honda, one system at a time. Six original build articles.",
    `${header()}<main id="main" class="page-wrap project-page">${projectIntro("Honda CB500 Four", "Rebuilding a forty-year-old<br> Honda, one system<br> at a time.", "Honda CB500 Four<br> SOHC inline-four<br> Cafe racer build<br> 6-part series", "Archive", figure(hondaPosts[0].image, "Honda CB500 Four / from the original build journal", "project-hero", true))}<div class="down-link">${link("#story", "↓")}</div><section class="project-section" id="story">${label("01 / The beginning")}<div class="story-grid"><h2>It arrived as a partially disassembled collection of old Honda parts.</h2><p>What followed was a ground-up rebuild spanning the engine, carburettors, chassis, wheels and an entirely new electrical system.</p></div><div class="media-pair">${figure(hondaPosts[1].image, "Disassembly / original build journal")}${figure(hondaPosts[4].image, "Engine / original build journal")}</div></section><section class="project-section">${label("02 / Systems")}<h2>One motorcycle.<br> Five interconnected systems.</h2><div class="system-grid">${["Engine", "Carburettors", "Electrical", "Chassis", "Wheels"].map((t) => `<span>${t}</span>`).join("")}</div><p class="centred-copy">Instead of a purely chronological restoration, almost every system on the motorcycle became its own project.</p></section><section class="project-section">${label("03 / The build")}<div class="chapters">${hondaPosts.map((p, i) => chapter(p, i, 6)).join("")}</div></section><section class="project-section"><h2>The parts are the photography.</h2><div class="detail-grid">${[hondaPosts[2], hondaPosts[4], hondaPosts[3], hondaPosts[5]].map((p) => figure(p.image, p.title)).join("")}</div></section><section class="project-section story-grid"><h2>I bought it because I wanted<br> to build a motorcycle.</h2><div><p>I ended up learning how to rebuild an engine, lace wheels, fabricate brackets, restore carburettors and design an electrical system from scratch.</p>${label("Mechanical · Fabrication · Electrical · Restoration")}</div></section>${projectNav(["/writing/e30-respray/", "E30 sedan respray"], ["/projects/chassiswire/", "ChassisWire"])}</main>${footer()}`,
  );
}
export function chassiswire() {
  const views = [
    "Schematic",
    "Harness",
    "Connector",
    "Library",
    "BOM",
    "Diagnostics",
  ];
  return shell(
    "ChassisWire",
    "A connected vehicle model for schematics, harnesses, connectors and diagnostics. In development.",
    `${header()}<main id="main" class="page-wrap project-page chassis-page">${projectIntro("ChassisWire", "Understand the<br> electrical system.<br> Not just the diagram.", "Automotive software<br> Electrical systems<br> Open source<br> In development", "2026 —", placeholder("CHASSISWIRE / SCHEMATIC + HARNESS + CONNECTOR", "project-hero"))}<div class="section-end">${link("https://github.com/ChassisWire", "GitHub ↗")}${link("https://chassiswire.com", "ChassisWire.com ↗")}</div><section class="project-section">${label("The problem")}<h2>Vehicle wiring is<br> more than a schematic.</h2><div class="problem-grid">${[
      ["Schematic", "logical design"],
      ["Harness", "physical wiring"],
      ["Vehicle", "actual system"],
    ]
      .map(([a, b]) => `<div>${placeholder(a)}${label(b)}</div>`)
      .join(
        "",
      )}</div><div class="story-grid"><p>A schematic tells you what connects electrically. It doesn’t necessarily tell you which harness the wire belongs to, which connector it passes through, which cavity it occupies, where a splice exists, which fuse protects it, or what changed during a swap.</p><h3>ChassisWire is an attempt to keep those relationships together.</h3></div></section><section class="project-section" id="model">${label("The model")}<h2>The vehicle as connected data.</h2><ol class="model-chain">${["Vehicle", "System", "Harness", "Connector", "Pin", "Wire", "Net"].map((t) => `<li${t === "Connector" ? ' class="accent"' : ""}>${t}</li>`).join("")}</ol><p class="centred-copy meta">Fuse &nbsp; Splice &nbsp; Relay &nbsp; Ground &nbsp; Modification &nbsp; Part</p><details class="model-details"><summary>Explore model →</summary><p>The vehicle contains systems and harnesses. Connectors expose pins; wires and nets describe the electrical connections. Splices, protection, grounds and modifications stay linked to the same model.</p></details></section><section class="project-section" id="views">${label("One model. Multiple views.")}<div class="view-tabs" role="tablist" aria-label="ChassisWire concept views">${views.map((v, i) => `<button role="tab" id="tab-${v.toLowerCase()}" aria-controls="panel-${v.toLowerCase()}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-view="${v.toLowerCase()}">${v}</button>`).join("")}</div><section id="panel-schematic" role="tabpanel" aria-labelledby="tab-schematic" class="concept-panel"><p class="meta">Schematic view / same underlying vehicle model</p><div class="schematic-demo"><div>X60004</div><span>GN / VI &nbsp; NET: IGNITION_RUN</span><div>C101</div><small>F18</small></div></section>${views
      .slice(1)
      .map(
        (v) =>
          `<section id="panel-${v.toLowerCase()}" role="tabpanel" aria-labelledby="tab-${v.toLowerCase()}" class="concept-panel" hidden><p class="meta">${v} / planned view</p><h3>${{ Harness: "Physical wiring, organised by harness.", Connector: "Every cavity connected to the wider system.", Library: "Reusable parts and trusted source information.", BOM: "Parts derived from the vehicle model.", Diagnostics: "Follow the same model when a circuit fails." }[v]}</h3><p>This view is part of the ChassisWire product concept and is still in development.</p></section>`,
      )
      .join(
        "",
      )}<p class="concept-caption">Product concept / illustrative data, not a released editor.</p></section><section class="project-section">${label("Connectors")}<h2>The connector should be<br> a first-class object.</h2><div class="connector-layout"><div class="connector-face">${label("X20 / Connector face")}<div class="pin-grid">${Array.from({ length: 18 }, (_, i) => `<img alt="Pin ${i + 1}" src="/assets/figma/marker-${i === 8 ? 4 : 3}.svg">`).join("")}</div></div><div>${label("X20 / Engine harness · 20 pin")}<p class="pin-list">01 &nbsp; IGNITION<br> 02 &nbsp; START<br> 03 &nbsp; OIL PRESSURE<br> 04 &nbsp; TACH<br> 05 &nbsp; FUEL PUMP<br> …</p><p>Physical cavity ↔ pin ↔ wire ↔ net ↔ destination.</p></div></div></section><section class="project-section">${label("Real use case")}<h2>E30 + M54</h2><p>The project that made<br> the problem obvious.</p><div class="media-pair">${placeholder("M54B30 / PARTS COLLECTED")}${placeholder("BMW E30 / EXISTING VEHICLE")}</div><div class="swap-model"><span>E30</span><span>C101</span><span>Adapter / modification layer</span><span>X60004</span><span>M54</span></div><p class="centred-copy">Instead of maintaining a spreadsheet, schematic, connector diagrams and handwritten notes independently, the conversion can exist as one model.</p></section><section class="project-section">${label("Modifications")}<h2>OEM wiring should<br> remain OEM wiring.</h2><div class="modification-model">${[
      ["OEM", "E30 / C101 / PIN 7", "Original"],
      ["Modification", "M54 swap / adapter harness", "User created"],
      ["Vehicle as built", "My E30", "Current"],
    ]
      .map(
        ([a, b, c]) =>
          `<div>${label(a)}<p>${b}</p><span class="meta">${c}</span></div>`,
      )
      .join(
        "",
      )}</div></section><section class="project-section">${label("Diagnostics")}<div class="story-grid"><h2>Design it. Then use the same data<br> when something breaks.</h2><div class="diagnostic-path">${[
      ["Fuel pump doesn’t run", "Symptom"],
      ["Fuse F18", "Pass"],
      ["Relay K96", "Pass"],
      ["X20 / pin 13", "Test"],
      ["Pump connector", "Next"],
    ]
      .map(
        ([a, b], i) =>
          `<div class="${i === 3 ? "accent" : ""}"><span>${a}</span><span>${b}</span></div>`,
      )
      .join(
        "",
      )}<p>ChassisWire already knows the path.</p></div></div></section><section class="project-section">${label("BOM & provenance")}<div class="story-grid"><h2>What do I need?<br> Where did this information come from?</h2><div class="table-scroll"><table><caption class="sr-only">Illustrative bill of materials</caption><thead><tr><th>Part</th><th>Qty</th><th>Source</th><th>Status</th></tr></thead><tbody>${[
      ["TE connector", "1", "BMW / TE", "✓"],
      ["Terminal", "8", "Mouser", "✓"],
      ["1.0mm² wire", "4m", "Local", "✓"],
      ["Heat shrink", "2m", "Raychem", "○"],
    ]
      .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join(
        "",
      )}</tbody></table>${label("Source reference")}<p class="meta">BMW ETM · 1990 318i · 1240.0-03 · C101 · Pin 7</p></div></div></section><section class="project-section">${label("Where it’s at")}<h2>ChassisWire is still being built.</h2><p class="meta">✓ Domain model &nbsp; ✓ Product architecture &nbsp; ○ Schematic editor &nbsp; ○ Connector tooling &nbsp; ○ Harness modelling &nbsp; ○ BOM &nbsp; ○ Diagnostics</p><div class="section-end">${link("https://github.com/ChassisWire", "GitHub ↗")}${link("https://chassiswire.com", "ChassisWire.com ↗")}</div></section>${projectNav(["/projects/honda-cb500-four/", "Honda CB500 Four"], ["/writing/e30-respray/", "E30 sedan respray"])}</main>${footer()}`,
  );
}
export function article(p, index, html, headings, wordCount) {
  const next = posts[index + 1];
  return shell(
    p.title,
    p.description,
    `<div class="reading-progress" aria-hidden="true"></div>${header()}<main id="main" class="article-page"><div class="page-wrap"><div class="breadcrumb">${link("/writing/e30-respray/", "← E30 sedan respray")}<span>0${index + 1} / 07</span></div><header class="article-intro">${label("Bodywork · Project journal")}<h1>${esc(p.title)}</h1><p class="deck">${p.description}</p><div class="article-meta"><span>Hayden Wade · ${p.period}</span><span>${Math.ceil(wordCount / 220)} min read</span></div></header>${figure(e30Image(p.image), p.caption, "article-hero", true)}</div><div class="article-body"><details class="article-contents"><summary>In this chapter</summary><nav aria-label="Article contents">${headings.map((h) => link("#" + h.id, esc(h.text))).join("")}</nav></details><article class="prose">${html}</article></div><section class="article-end page-wrap">${label(next ? "Next" : "The complete journal")}<h2>${link(next ? postUrl(next) : "/writing/e30-respray/", next ? `0${index + 2} / ${next.title} →` : "Back to the whole story →", "heading-link")}</h2>${next ? `<p>${next.description}</p>` : ""}<nav class="series-nav" aria-label="E30 chapters">${posts.map((s, i) => `<a href="${postUrl(s)}" ${i === index ? 'aria-current="page"' : ""}>0${i + 1} / ${s.title}</a>`).join("")}</nav></section><div class="page-wrap breadcrumb">${link("/writing/e30-respray/", "← E30 sedan respray")}<span>0${index + 1} / 07</span>${link("#top", "Top ↑")}</div></main>${footer()}`,
  );
}
export function photography() {
  return shell(
    "Photography",
    "Photographs of places, machines and people.",
    `${header()}<main id="main" class="gallery-page"><section class="page-wrap index-intro">${label("Photography")}<div class="split-heading"><h1>Photographs of places,<br> machines & people.</h1><div>${link("/photography/index/", "Index ⠿")}<p>A visual archive — automotive, people and places.</p></div></div></section><section class="photo-3d-stage" aria-label="Photography gallery"><div class="photo-3d-grid" data-staggered-photo-grid>${gallery.slice(0, 35).map((g, i) => `<a class="photo-3d-item" href="/photography/viewer/?photo=${i}" data-gallery-photo="${i}" data-enlarge="${g.image}" data-caption="${esc(g.caption + " / " + g.category)}" aria-label="View ${esc(g.caption)}">${img(g.image, g.caption)}<span class="photo-3d-meta">${g.category}</span></a>`).join("")}</div></section><div class="page-wrap section-end">${label(gallery.length + " photographs")}${link("/photography/index/", "Index ⠿")}</div></main>${footer()}`,
  );
}
export function photographyIndex() {
  return shell(
    "Photography index",
    "Browse the photography collection.",
    `<header class="viewer-header page-wrap"><a href="/">HAYDEN WADE</a><span>PHOTOGRAPHY</span>${link("/photography/", "Close ×")}</header><main id="main" class="page-wrap photo-index"><h1>Index</h1>${gallery.map((g, i) => `<section>${label(String(i + 1).padStart(2, "0") + " / " + g.category)}<a href="/photography/viewer/?photo=${i}" data-gallery-photo="${i}" data-enlarge="${g.image}" data-caption="${esc(g.caption + " / " + g.category)}">${img(g.image, g.caption)}</a></section>`).join("")}</main>${footer()}`,
  );
}
export function photographyViewer() {
  return shell(
    "Photograph viewer",
    "View photographs from Hayden Wade’s collection.",
    `<main id="main" class="standalone-viewer" data-viewer-page><h1 class="sr-only">Photograph viewer</h1><header class="viewer-header"><a href="/">HAYDEN WADE</a><span>PHOTOGRAPHY</span>${link("/photography/", "Close ×")}</header><div class="viewer-stage"><button class="viewer-prev" aria-label="Previous photograph">←</button><figure><img src="${gallery[0].image}" alt="${gallery[0].caption}"><figcaption><span class="viewer-caption">${gallery[0].caption}</span><span class="viewer-count">1 / ${gallery.length}</span></figcaption></figure><button class="viewer-next" aria-label="Next photograph">→</button></div><div class="viewer-data" hidden>${gallery.map((g) => `<span data-src="${g.image}" data-caption="${esc(g.caption + " / " + g.category)}"></span>`).join("")}</div></main>`,
  );
}
export function textPage(title, kicker, html) {
  return shell(
    title,
    title + " — engineering and life outside the workshop.",
    `${header()}<main id="main" class="page-wrap text-page">${label(kicker)}<h1>${title}</h1><div class="prose">${html}</div></main>${footer()}`,
  );
}
export function experience(html) {
  return shell(
    "Experience & credentials",
    "Engineering, cyber and project experience.",
    `${header()}<main id="main" class="page-wrap text-page">${label("Professional background")}<h1>Experience & credentials.</h1>${jobList()}<div class="prose">${html}</div></main>${footer()}`,
  );
}
export function writing() {
  return shell(
    "Writing",
    "E30 respray journal and original Honda build articles.",
    `${header()}<main id="main" class="page-wrap text-page">${label("The journal")}<h1>Things worth<br> writing down.</h1><h2>E30 sedan respray</h2><div class="writing-list">${posts.map((p, i) => link(postUrl(p), `<span>0${i + 1}</span><span>${p.title}</span><span>→</span>`)).join("")}</div><h2>Honda CB500 Four / Original archive</h2><div class="writing-list">${hondaPosts.map((p, i) => link(p.url, `<span>0${i + 1}</span><span>${p.title}</span><span>↗</span>`)).join("")}</div></main>${footer()}`,
  );
}
