export function doubleSlideshowMarkup(projectData, mediaMap, img, esc, label) {
  // Start with photographic projects so the immersive treatment has a strong first impression.
  const priority = ["respray", "honda", "chassiswire", "house", "318is", "m54"];
  const projects = [...projectData].sort((a,b) => priority.indexOf(a.id) - priority.indexOf(b.id));
  const count = projects.length;
  const countString = String(count).padStart(2,"0");

  const abstract = (project, role) => {
    const mark = {chassiswire:"⌁",house:"⌂","318is":"E30",m54:"M54"}[project.id] || "✳";
    const descriptor = role === "foreground" ? "IN DEVELOPMENT" : project.visual;
    return `<div class="ds-abstract ds-abstract--${esc(project.id)} ds-abstract--${role}" aria-hidden="true">
      <span class="ds-abstract-grid"></span><span class="ds-abstract-ring"></span>
      <span class="ds-abstract-mark">${esc(mark)}</span>
      <span class="ds-abstract-caption">${esc(descriptor)}</span>
    </div>`;
  };
  const photo = (project, imageIndex, role, eager) => {
    const media = mediaMap[project.id] || [];
    const image = media[imageIndex]?.image || (imageIndex === 1 ? media[0]?.image : null) || project.image;
    return image ? img(image, "", "ds-image", eager) : abstract(project, role);
  };
  const frames = (role) => projects.map((project,index) => {
    const active = index === 0;
    return `<div class="ds-frame${active ? " is-current" : ""}" data-ds-frame data-ds-index="${index}" aria-hidden="true">
      <div class="ds-frame-inner">${photo(project, role === "background" ? 0 : 1, role, index < 2)}</div>
    </div>`;
  }).join("");
  const titles = projects.map((project,index) =>
    `<h3 class="ds-title${index === 0 ? " is-current" : ""}" data-ds-title aria-hidden="true">${esc(project.name)}</h3>`
  ).join("");
  const first = projects[0];
  return `<section class="home-section project-reel-section double-project-section" id="projects">
    <div class="project-reel-intro ds-intro">
      <div class="section-label">${label("03 / projects")}<span aria-hidden="true">↘</span></div>
      <h2 class="serif">Selected work.<br><em>Things I’m building, restoring and finishing.</em></h2>
    </div>
    <div class="ds-root" data-double-slideshow data-ds-count="${count}">
      <div class="ds-stage" data-ds-stage tabindex="0" role="region" aria-roledescription="carousel" aria-label="Selected projects. Use the arrows, swipe, or previous and next controls to change projects.">
        <div class="ds-layer ds-layer--bg">${frames("background")}</div>
        <div class="ds-scrim" aria-hidden="true"></div>
        <div class="ds-layer ds-layer--fg">${frames("foreground")}</div>
        <div class="ds-topline"><span>ENGINEERING / RESTORATION / DESIGN</span><span>SELECTED PROJECTS — 2022 / NOW</span></div>
        <div class="ds-type">${titles}</div>
        <div class="ds-bottom">
          <div class="ds-bottom-copy">
            <span class="ds-count" data-ds-counter>01 / ${countString}</span>
            <span class="ds-category" data-ds-category>${esc(first.category)}</span>
            <p class="ds-description" data-ds-description>${esc(first.description)}</p>
            <a class="ds-visit" data-ds-link href="${first.url || "/projects/"}">${first.url ? "Explore project" : "All projects"} <span aria-hidden="true">↗</span></a>
          </div>
          <div class="ds-controls">
            <span class="ds-swipe-hint">SWIPE TO EXPLORE <span aria-hidden="true">↔</span></span>
            <div class="ds-buttons">
              <button type="button" data-ds-prev aria-label="Previous project"><span aria-hidden="true">←</span><span class="ds-btn-label">PREV</span></button>
              <button type="button" data-ds-next aria-label="Next project"><span class="ds-btn-label">NEXT</span><span aria-hidden="true">→</span></button>
            </div>
          </div>
        </div>
        <div class="ds-progress" aria-hidden="true">${projects.map((_,index) => `<i class="${index === 0 ? "is-current" : ""}"></i>`).join("")}</div>
        <span class="ds-sr" data-ds-live aria-live="polite">Project 1 of ${count}: ${esc(first.name)}</span>
      </div>
      <div class="ds-after"><span>IMAGE-LED STORIES / 001—${countString}</span><span>SCROLL TO CONTINUE ↓</span></div>
    </div>
  </section>`;
}
