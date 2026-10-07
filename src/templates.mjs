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
const homeLoaderBoot = `<style id="site-loader-boot-style">html.site-loader-pending,html.site-loader-pending body{background:#0f1210}html.site-loader-pending body{overflow:hidden}html.site-loader-pending body::before{content:"";position:fixed;inset:0;z-index:2147483647;background:#0f1210;pointer-events:none}</style><script>(()=>{const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;const navigation=performance.getEntriesByType?.("navigation")?.[0];const referrer=document.referrer;let show=!reduced&&!location.hash&&(navigation?.type==="reload"||!referrer);if(!show&&referrer){try{show=new URL(referrer).origin!==location.origin}catch{show=true}}if(show)document.documentElement.classList.add("site-loader-pending")})()</script>`;
export function shell(title, description, body) {
  return `<!doctype html><html lang="en-AU" id="top"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#171a18">${title === "Hayden Wade" ? homeLoaderBoot : ""}<title>${esc(title)}${title === "Hayden Wade" ? " — Engineer & Builder" : " — Hayden Wade"}</title><meta name="description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/styles.css"><script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script><script src="/assets/client.js" defer></script><script src="/assets/home-motion.js" defer></script></head><body><a class="skip" href="#main">Skip to content</a>${body}${modal}</body></html>`;
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
const projectReelMedia = {
  chassiswire: [
    { kind: "wire", label: "Schematic / UI / wiring", href: "/projects/chassiswire/" },
    { kind: "concept", label: "Connector / diagnostics", href: "/projects/chassiswire/" },
  ],
  house: [
    { kind: "placeholder", label: "Redbank Plains / renovation" },
    { kind: "placeholder", label: "Renovation / in progress" },
  ],
  "318is": [
    { kind: "placeholder", label: "BMW E30 318iS" },
    { kind: "placeholder", label: "Restoration / details" },
  ],
  m54: [
    { kind: "placeholder", label: "M54B30 / parts collection" },
    { kind: "placeholder", label: "Engine / integration" },
  ],
  respray: [
    { image: "/images/e30-respray/finished.jpg", label: "Finished / Glacier Blue", href: "/writing/e30-respray/" },
    { image: "/images/e30-respray/painting.jpg", label: "Paint / colour", href: "/writing/e30-respray/04-painting-the-e30/" },
  ],
  honda: [
    { image: "/images/honda/how-to-build-a-classic-honda-cafe-racer-1972-honda-cb500f.jpg", label: "Honda CB500 Four", href: "/projects/honda-cb500-four/" },
    { image: "/images/honda/engine-rebuild.jpg", label: "Engine / rebuild", href: "https://haydenbwade.com/engine-rebuild/" },
  ],
};
const projectReelMediaMarkup = (p, media, role) => {
  const content = media.image
    ? img(media.image, `${p.name} — ${media.label}`, "project-reel-parallax-image")
    : media.kind === "wire"
      ? wires()
      : `<div class="project-reel-placeholder project-reel-placeholder--${media.kind || "placeholder"}"><span>${esc(media.label)}</span>${media.kind === "concept" ? "<i></i><i></i><i></i>" : ""}</div>`;
  const inner = `<div class="project-reel-media-inner">${content}<span class="project-reel-media-label">${esc(media.label)}</span></div>`;
  return media.href
    ? `<a class="project-reel-media project-reel-media--${role}" href="${media.href}" aria-label="${esc(`Open ${p.name}: ${media.label}`)}">${inner}</a>`
    : `<div class="project-reel-media project-reel-media--${role}" aria-label="${esc(`${p.name}: ${media.label}`)}">${inner}</div>`;
};
const projectReelSlide = (p, index) => {
  const media = projectReelMedia[p.id] || [
    { image: p.image, label: p.visual, href: p.url },
    { kind: "placeholder", label: `${p.name} / detail` },
  ];
  return `<article class="project-reel-slide" data-project-slide data-project-index="${index}" data-project-name="${esc(p.name)}" data-project-category="${esc(p.category)}" data-project-period="${esc(p.period)}" data-project-description="${esc(p.description)}" data-project-url="${p.url || ""}"><div class="project-reel-gallery">${projectReelMediaMarkup(p, media[0], "primary")}${projectReelMediaMarkup(p, media[1], "secondary")}</div><span class="project-reel-slide-number">${String(index + 1).padStart(2, "0")}</span><div class="project-reel-mobile-copy"><span>${String(index + 1).padStart(2, "0")} / ${String(projectData.length).padStart(2, "0")}</span><h3>${esc(p.name)}</h3><p>${esc(p.category)} · ${esc(p.period)}</p>${p.url ? `<a href="${p.url}">View project ↗</a>` : `<a href="/projects/">All projects →</a>`}</div><div class="sr-only"><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p></div></article>`;
};
const projectReelSection = () =>
  `<section class="home-section project-reel-section" id="projects"><div class="project-reel-intro"><div class="section-label">${label("03 / projects")}<span aria-hidden="true">↘</span></div><h2 class="serif">Selected work.<br> <em>Things I’m building, restoring<br> and finishing.</em></h2></div><div class="project-reel-stage" data-project-reel><div class="project-reel-viewport"><div class="project-reel-track" data-project-reel-track>${projectData.map(projectReelSlide).join("")}</div><div class="project-reel-caption" data-project-reel-caption aria-live="polite"><span class="project-reel-caption-index">01 / ${String(projectData.length).padStart(2, "0")}</span><h3>${esc(projectData[0].name)}</h3><p class="project-reel-caption-meta">${esc(projectData[0].category)} · ${esc(projectData[0].period)}</p><p class="project-reel-caption-description">${esc(projectData[0].description)}</p><a class="project-reel-caption-link" href="${projectData[0].url || "/projects/"}">${projectData[0].url ? "View project" : "All projects"} <span aria-hidden="true">↗</span></a></div></div></div></section>`;

const photographyLetters = "PHOTOGRAPHY"
  .split("")
  .map(
    (character, index) =>
      `<span data-photo-letter style="--photo-letter:${index}">${character}</span>`,
  )
  .join("");
const photoOutroWord = (text) =>
  `<span class="photo-outro-word">${[...text]
    .map(
      (character) =>
        `<span class="photo-outro-char" aria-hidden="true">${esc(character)}</span>`,
    )
    .join("")}</span>`;
const aboutSection = () =>
  `<section class="home-section about-cinematic" id="about" data-about-cinematic><div class="about-cinema-stage"><div class="about-cinema-sticky"><div class="about-cinema-meta">${label("01 / about")}<span aria-hidden="true">↘</span></div><div class="about-cinema-headline"><h2 class="serif about-cinema-title" aria-label="Engineer by profession. Compulsive project starter by nature."><span class="about-title-line about-title-line--roman"><span data-about-title-line>Engineer by profession.</span></span><span class="about-title-line about-title-line--italic"><span data-about-title-line><em>Compulsive project starter</em></span></span><span class="about-title-line about-title-line--italic"><span data-about-title-line><em>by nature.</em></span></span></h2></div><figure class="media about-cinema-portrait" data-about-portrait><button class="image-button" data-enlarge="/images/about/portrait.jpg" data-caption="Blue Mountains / Away from the workshop" aria-label="Enlarge: Blue Mountains / Away from the workshop">${img("/images/about/portrait.jpg", "Blue Mountains / Away from the workshop", "about-cinema-image")}</button><figcaption>Blue Mountains / Away from the workshop</figcaption></figure><div class="about-cinema-copy" data-about-copy><p>I work across engineering, cyber, software and complex technical systems.</p><p>Outside work, I’m usually rebuilding an old BMW, working on the house, taking photos or starting something else I probably don’t have time for.</p></div><div class="about-cinema-strip" data-about-strip><span class="about-strip-location">Brisbane, AU</span><span data-about-interest>Engineering</span><span data-about-interest>Old cars</span><span data-about-interest>Photography</span><span data-about-interest>Making</span></div></div></div></section>`;

const photographySection = () =>
  `<section class="home-section photography-section" id="photography"><div class="section-label">${label("04 / photography")}<span aria-hidden="true">↘</span></div><section class="photo-title-stage" data-photo-title-stage aria-labelledby="photography-title"><div class="photo-title-sticky"><div class="photo-title-frame"><h2 class="photo-cinematic-title" id="photography-title" data-photo-title aria-label="Photography">${photographyLetters}</h2><p class="photo-cinematic-subtitle" data-photo-subtitle>Places, cars <em>&amp; other things.</em></p><span class="photo-title-rule" data-photo-rule aria-hidden="true"></span></div></div></section><section class="photo-3d-stage" aria-label="Photography gallery"><div class="photo-3d-grid" data-staggered-photo-grid>${gallery.slice(0, 35).map((g, i) => `<a class="photo-3d-item" href="/photography/viewer/?photo=${i}" data-gallery-photo="${i}" data-enlarge="${g.image}" data-caption="${esc(g.caption + " / " + g.category)}" aria-label="View ${esc(g.caption)}">${img(g.image, g.caption)}<span class="photo-3d-meta">${g.category}</span></a>`).join("")}</div></section><section class="photo-outro" aria-labelledby="photo-outro-title"><h3 class="photo-outro-title" id="photo-outro-title" data-photo-outro-title aria-label="Photography, here."><span class="photo-outro-line">${photoOutroWord("Photography,")}</span><span class="photo-outro-line"><a class="photo-outro-here" href="/photography/" aria-label="Open photography archive"><em>${photoOutroWord("here.")}</em><span class="photo-outro-here-arrow" aria-hidden="true">↗</span></a></span></h3></section></section>`;
export function home() {
  return shell(
    "Hayden Wade",
    "Product Security Engineer in Brisbane. Engineering, old cars and projects in progress.",
    `<div class="home-reveal-shell"><header class="hero">${img("/images/hero/alpine-e30.jpg", "Red E30 in an alpine landscape — concept artwork", "hero-image", true)}<div style="position:absolute;top:90px;left:50%;transform:translateX(-50%);z-index:50;background:#ff00ff;color:#000;padding:10px 16px;font:900 22px/1 Arial,sans-serif;letter-spacing:2px;border:4px solid #000;">POOP TEST</div><div class="hero-top"><span>CYBERSECURITY · ENGINEERING · OLD CARS</span>${link("#contact", "Let’s talk ↗")}</div><h1 class="hero-title"><span>Hayden</span><em>Wade</em></h1><p class="hero-role">PRODUCT SECURITY ENGINEER<br> + BUILDER</p><div class="hero-bottom"><span>BASED IN BRISBANE,<br> AUSTRALIA</span>${link("#about", "↓ &nbsp; EXPLORE")}<span>SELECTED WORK<br> 2026</span></div></header>${header(true)}<main id="main" class="home-main">${aboutSection()}${homeSection("experience", 2, "A technical foundation.<br> <em>A broader perspective.</em>", jobList())}${projectReelSection()}${photographySection()}</main></div><footer class="footer" id="contact">
  <div class="footer__marquee">
    <div class="footer__marquee-content rail">
      <span>ENGINEERING — OLD BMWs — SOFTWARE — PHOTOGRAPHY — RENOVATION — PROJECTS — NOTES — BUILT, BROKEN &amp; REBUILT —</span>
      <span>ENGINEERING — OLD BMWs — SOFTWARE — PHOTOGRAPHY — RENOVATION — PROJECTS — NOTES — BUILT, BROKEN &amp; REBUILT —</span>
    </div>
  </div>
  <div class="footer__center">
    <div class="footer__center-content">
      <p class="footer__contact-copy">Have a project, idea,<br>or old BMW problem?<br><a href="mailto:${site.email}">Let’s talk.</a></p>
      <nav class="footer__socials" aria-label="Contact links">
        <a class="footer__social-link" href="mailto:${site.email}" aria-label="Email Hayden">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.25"/><path d="m4 7 8 6 8-6"/></svg>
        </a>
        <a class="footer__social-link footer__social-link--fill" href="${site.linkedin}" aria-label="LinkedIn">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708C16 15.487 15.474 16 14.825 16H1.175C.526 16 0 15.487 0 14.854V1.146Zm4.943 12.248V6.169H2.542v7.225h2.401Zm-1.2-8.213c.837 0 1.358-.554 1.358-1.248-.015-.709-.521-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016Zm3.908 8.213h2.4V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.4V9.25c0-2.22-1.184-3.252-2.763-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225Z"/></svg>
        </a>
        <a class="footer__social-link footer__social-link--fill" href="${site.github}" aria-label="GitHub">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8a8.003 8.003 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 4.85c.68 0 1.36.09 2 .26 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
        </a>
        <a class="footer__social-link footer__social-link--fill" href="${site.instagram}" aria-label="Instagram">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.441c2.135 0 2.389.008 3.232.046.78.036 1.204.166 1.486.276.373.145.64.318.92.598.28.28.453.547.598.92.11.282.24.706.276 1.486.038.843.046 1.097.046 3.232s-.008 2.389-.046 3.232c-.036.78-.166 1.204-.276 1.486a4.367 4.367 0 0 1-.598.92 4.367 4.367 0 0 1-.92.598c-.282.11-.706.24-1.486.276-.843.038-1.097.046-3.232.046s-2.389-.008-3.232-.046c-.78-.036-1.204-.166-1.486-.276a4.367 4.367 0 0 1-.92-.598 4.367 4.367 0 0 1-.598-.92c-.11-.282-.24-.706-.276-1.486C1.449 10.389 1.441 10.135 1.441 8s.008-2.389.046-3.232c.036-.78.166-1.204.276-1.486.145-.373.318-.64.598-.92.28-.28.547-.453.92-.598.282-.11.706-.24 1.486-.276C5.611 1.449 5.865 1.441 8 1.441ZM8 0C5.829 0 5.556.01 4.703.048 3.85.087 3.269.222 2.76.42a5.807 5.807 0 0 0-1.51.83A5.807 5.807 0 0 0 .42 2.76c-.198.509-.333 1.09-.372 1.943C.01 5.556 0 5.829 0 8s.01 2.444.048 3.297c.039.853.174 1.434.372 1.943.205.526.478.97.83 1.322.352.352.796.625 1.51.83.509.198 1.09.333 1.943.372C5.556 15.99 5.829 16 8 16s2.444-.01 3.297-.048c.853-.039 1.434-.174 1.943-.372a5.807 5.807 0 0 0 1.51-.83 5.807 5.807 0 0 0 .83-1.51c.198-.509.333-1.09.372-1.943C15.99 10.444 16 10.171 16 8s-.01-2.444-.048-3.297c-.039-.853-.174-1.434-.372-1.943a5.807 5.807 0 0 0-.83-1.51 5.807 5.807 0 0 0-1.51-.83c-.509-.198-1.09-.333-1.943-.372C10.444.01 10.171 0 8 0Zm0 3.892a4.108 4.108 0 1 0 0 8.216 4.108 4.108 0 0 0 0-8.216Zm0 6.775a2.667 2.667 0 1 1 0-5.334 2.667 2.667 0 0 1 0 5.334Zm5.231-6.937a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0Z"/></svg>
        </a>
      </nav>
    </div>
    <div class="footer__svg-animation">
      <svg width="100%" viewBox="0 0 252 94" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-animation" aria-hidden="true">
        <text class="svg-letter" x="163" y="94" textLength="83" lengthAdjust="spacingAndGlyphs" font-family="Bodoni Moda, Instrument Serif, Georgia, serif" font-size="128" font-weight="500">W</text>
        <text class="svg-letter" x="82" y="94" textLength="69" lengthAdjust="spacingAndGlyphs" font-family="Bodoni Moda, Instrument Serif, Georgia, serif" font-size="128" font-weight="500">B</text>
        <text class="svg-letter" x="0" y="94" textLength="70" lengthAdjust="spacingAndGlyphs" font-family="Bodoni Moda, Instrument Serif, Georgia, serif" font-size="128" font-weight="500">H</text>
      </svg>
    </div>
  </div>
  <div class="footer__bottom">
    <div class="footer__bottom-location"><p>Brisbane, Australia</p></div>
    <div class="footer__bottom-text"><p>© 2026 Hayden Wade</p></div>
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
    `<main id="main" class="infinite-photo-page" data-infinite-photo-gallery>
      <div class="infinite-photo-chrome infinite-photo-chrome--top">
        <a class="infinite-photo-wordmark" href="/">HAYDEN WADE</a>
        <span class="infinite-photo-section">04 / PHOTOGRAPHY</span>
        <nav class="infinite-photo-nav" aria-label="Photography navigation">
          ${link("/photography/index/", "INDEX ⠿")}
          ${link("/", "CLOSE ×")}
        </nav>
      </div>
      <div class="infinite-photo-stage" data-infinite-photo-stage aria-label="Infinite draggable photography gallery">
        <div class="infinite-photo-canvas" data-infinite-photo-canvas></div>
        <div class="infinite-photo-overlay" data-infinite-photo-overlay aria-hidden="true"></div>
        <div class="infinite-photo-expanded-copy" data-infinite-photo-expanded-copy aria-hidden="true">
          <p class="infinite-photo-expanded-kicker"></p>
          <h1 class="infinite-photo-expanded-title"></h1>
          <a class="infinite-photo-expanded-link" href="/photography/viewer/">View photograph ↗</a>
        </div>
      </div>
      <div class="infinite-photo-chrome infinite-photo-chrome--bottom">
        <span>DRAG TO EXPLORE</span>
        <span>${String(gallery.length).padStart(2, "0")} PHOTOGRAPHS / INFINITE FIELD</span>
      </div>
      <div class="infinite-photo-data" hidden>
        ${gallery.map((g, i) => `<span data-photo-src="${g.image}" data-photo-caption="${esc(g.caption)}" data-photo-category="${esc(g.category)}" data-photo-index="${i}"></span>`).join("")}
      </div>
    </main>`,
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
