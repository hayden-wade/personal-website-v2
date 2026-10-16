export function mobileProjectSlideshow(projects, mediaById, img, esc) {
  const total = projects.length;
  const slides = projects.map((project, index) => {
    const [main, secondary] = mediaById[project.id] || [];
    const number = String(index + 1).padStart(2, "0");
    const count = String(total).padStart(2, "0");
    const image = main?.image
      ? img(main.image, `${project.name}: ${main.label}`, "project-dual-image")
      : `<div class="project-dual-art project-dual-art--${esc(project.id)}" role="img" aria-label="${esc(project.visual)}"><div class="project-dual-art-grid" aria-hidden="true"></div><span class="project-dual-art-label">${esc(project.visual)}</span><span class="project-dual-art-symbol" aria-hidden="true">${project.id === "chassiswire" ? "⌁" : project.id === "house" ? "⌂" : project.id === "m54" ? "↝" : "✳"}</span></div>`;
    const detailPhoto = secondary?.image
      ? `<figure class="project-dual-detail-photo">${img(secondary.image, `${project.name}: ${secondary.label}`, "project-dual-detail-image")}<figcaption>${esc(secondary.label)}</figcaption></figure>`
      : "";
    const title = esc(project.name);
    const category = esc(project.category);
    const period = esc(project.period);
    const description = esc(project.description);
    const destination = project.url || "/projects/";
    return `<article class="project-dual-slide" data-dual-slide role="group" aria-roledescription="slide" aria-label="${number} of ${count}: ${title}">
  <div class="project-dual-scene">
    <div class="project-dual-visual">${image}</div>
    <div class="project-dual-gradient" aria-hidden="true"></div>
    <div class="project-dual-top"><span>SELECTED WORK / ${number}</span><span>${period}</span></div>
    <div class="project-dual-bottom">
      <span class="project-dual-category">${category}</span>
      <h3>${title}</h3>
      <button type="button" class="project-dual-reveal" aria-expanded="false" aria-controls="project-dual-detail-${esc(project.id)}"><span>Discover the project</span><span class="project-dual-down" aria-hidden="true">↓</span></button>
    </div>
    <section class="project-dual-detail" id="project-dual-detail-${esc(project.id)}" aria-hidden="true" inert aria-labelledby="project-dual-title-${esc(project.id)}">
      <div class="project-dual-detail-head"><span>PROJECT ${number} / ${count}</span><button class="project-dual-close" type="button" aria-label="Close ${title} details">×</button></div>
      <div class="project-dual-detail-scroll">
        <p class="project-dual-detail-eyebrow">${category}</p>
        <h3 id="project-dual-title-${esc(project.id)}">${title}</h3>
        <p class="project-dual-description">${description}</p>
        ${detailPhoto}
        <div class="project-dual-detail-meta"><span>${period}</span><span>${esc(project.status)}</span></div>
        <a class="project-dual-visit" href="${destination}">${project.url ? "Explore full project" : "Browse all projects"} <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  </div>
</article>`;
  }).join("");
  return `<div class="project-dual-mobile" data-project-dual aria-label="Mobile projects gallery">
    <div class="project-dual-heading"><span>DRAG TO EXPLORE <span aria-hidden="true">↔</span></span><span class="project-dual-counter" data-dual-counter>01 / ${String(total).padStart(2,"0")}</span></div>
    <div class="project-dual-viewport" data-dual-viewport role="region" aria-roledescription="carousel" aria-label="Projects — swipe horizontally to browse" tabindex="0">
      <div class="project-dual-track">${slides}</div>
    </div>
    <div class="project-dual-footer">
      <div class="project-dual-progress" aria-label="Project position">${projects.map((_, i) => `<span class="${i === 0 ? "is-active" : ""}" aria-hidden="true"></span>`).join("")}</div>
      <div class="project-dual-controls"><button type="button" class="project-dual-prev" aria-label="Previous project" disabled>←</button><button type="button" class="project-dual-next" aria-label="Next project">→</button></div>
    </div>
  </div>`;
}
