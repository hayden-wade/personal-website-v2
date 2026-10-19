/*
 * Mobile Projects — scroll-driven Codrops DoubleSlideshow.
 * GSAP ScrollTrigger owns pinning and the entire animation timeline.
 * No custom fixed-position toggles, wheel traps, or asynchronous slide queue.
 */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#projects [data-double-slideshow]");
  if (!root || !window.matchMedia("(max-width: 700px)").matches) return;
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("Projects: GSAP unavailable; showing first project without pinning.");
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const section = root.closest("#projects");
  const stage = root.querySelector("[data-ds-stage]");
  const backgrounds = gsap.utils.toArray(root.querySelectorAll(".ds-layer--bg .ds-frame"));
  const foregrounds = gsap.utils.toArray(root.querySelectorAll(".ds-layer--fg .ds-frame"));
  const titles = gsap.utils.toArray(root.querySelectorAll("[data-ds-title]"));
  const count = backgrounds.length;
  if (!section || !stage || count < 2 || foregrounds.length !== count || titles.length !== count) return;

  const counter = root.querySelector("[data-ds-counter]");
  const category = root.querySelector("[data-ds-category]");
  const description = root.querySelector("[data-ds-description]");
  const link = root.querySelector("[data-ds-link]");
  const live = root.querySelector("[data-ds-live]");
  const markers = gsap.utils.toArray(root.querySelectorAll(".ds-progress i"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let shown = -1;

  const showMetadata = (index) => {
    if (index === shown) return;
    shown = index;
    const frame = backgrounds[index];
    const data = frame.dataset;
    if (counter) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
    if (category) category.textContent = data.category || "";
    if (description) description.textContent = data.description || "";
    if (link) {
      link.href = data.url || "/projects/";
      if (link.firstChild) link.firstChild.textContent = data.url ? "Explore project " : "All projects ";
    }
    markers.forEach((marker, i) => marker.classList.toggle("is-current", i === index));
    if (live) live.textContent = `Project ${index + 1} of ${count}: ${titles[index].textContent.trim()}`;
  };

  // First image remains visible if animation cannot initialise.
  gsap.set([...backgrounds, ...foregrounds], { visibility: "hidden", opacity: 1, yPercent: 0 });
  gsap.set([backgrounds[0], foregrounds[0]], { visibility: "visible" });
  gsap.set(titles, { visibility: "hidden", opacity: 0, y: 0, rotation: 0 });
  gsap.set(titles[0], { visibility: "visible", opacity: 1 });

  backgrounds.forEach((frame, i) => { frame.style.zIndex = String(i + 1); });
  foregrounds.forEach((frame, i) => { frame.style.zIndex = String(i + 1); });

  const timeline = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
  const transitionLength = 1;

  for (let i = 0; i < count - 1; i++) {
    const at = i * transitionLength;
    const bgOut = backgrounds[i], bgIn = backgrounds[i + 1];
    const fgOut = foregrounds[i], fgIn = foregrounds[i + 1];
    const titleOut = titles[i], titleIn = titles[i + 1];

    timeline.set([bgIn, fgIn, titleIn], { visibility: "visible" }, at);
    timeline.fromTo(bgOut, { yPercent: 0 }, { yPercent: -100, duration: transitionLength, immediateRender: false }, at);
    timeline.fromTo(bgIn, { yPercent: 100 }, { yPercent: 0, duration: transitionLength, immediateRender: false }, at);
    timeline.fromTo(fgOut, { yPercent: 0 }, { yPercent: 100, duration: transitionLength, immediateRender: false }, at);
    timeline.fromTo(fgIn, { yPercent: -100 }, { yPercent: 0, duration: transitionLength, immediateRender: false }, at);
    if (!reduceMotion) {
      timeline.fromTo(titleOut,
        { opacity: 1, y: 0, rotation: 0 },
        { opacity: 0, y: -38, rotation: -2, duration: .65, immediateRender: false }, at);
      timeline.fromTo(titleIn,
        { opacity: 0, y: 42, rotation: 2 },
        { opacity: 1, y: 0, rotation: 0, duration: .65, immediateRender: false }, at + .32);
    } else {
      timeline.set(titleOut, { opacity: 0 }, at + .5);
      timeline.set(titleIn, { opacity: 1 }, at + .5);
    }
  }

  // One viewport of native scroll per project change. ScrollTrigger handles
  // pin spacing and unpins automatically when the last project is reached.
  const scrollDistance = () => Math.round(stage.getBoundingClientRect().height * (count - 1));
  ScrollTrigger.create({
    id: "mobile-projects-scroll-story",
    // Pin the SECTION, not the nested .ds-root. With pinReparent the
    // section retains its #projects descendant selectors while moved to body.
    // Pinning .ds-root caused those selectors to stop matching on Safari,
    // making the slideshow disappear immediately after pin activation.
    trigger: section,
    pin: section,
    pinSpacing: true,
    pinReparent: true,
    start: "top top",
    end: () => "+=" + scrollDistance(),
    scrub: reduceMotion ? true : .25,
    invalidateOnRefresh: true,
    animation: timeline,
    anticipatePin: 1,
    onUpdate: (self) => {
      // Read progress from the same timeline driving the images, never from
      // an independently queued animation or Safari viewport measurement.
      const index = Math.max(0, Math.min(count - 1, Math.round(self.progress * (count - 1))));
      showMetadata(index);
    },
    onRefresh: (self) => {
      const index = Math.max(0, Math.min(count - 1, Math.round(self.progress * (count - 1))));
      showMetadata(index);
    }
  });

  showMetadata(0);
  // Refresh after images/fonts affect layout; avoid doing so on every scroll.
  // Other page sections create pins earlier in the document. Sort by actual
  // scroll position so their pin spacing is incorporated before this section.
  ScrollTrigger.sort();
  if (document.fonts?.ready) document.fonts.ready.then(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh(true);
  });
});
