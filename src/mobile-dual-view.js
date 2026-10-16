// Mobile only: touch-friendly native snap, animated scene and project detail reveal.
(function installMobileProjectSlideshow() {
  const root = document.querySelector("[data-project-dual]");
  if (!root) return;
  const viewport = root.querySelector("[data-dual-viewport]");
  const slides = Array.from(root.querySelectorAll("[data-dual-slide]"));
  const counter = root.querySelector("[data-dual-counter]");
  const steps = Array.from(root.querySelectorAll(".project-dual-progress span"));
  const prev = root.querySelector(".project-dual-prev");
  const next = root.querySelector(".project-dual-next");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!viewport || !slides.length) return;

  let current = 0;
  let frame = 0;
  const closeDetails = (slide, focusReveal = false) => {
    const panel = slide.querySelector(".project-dual-detail");
    const reveal = slide.querySelector(".project-dual-reveal");
    if (!slide.classList.contains("is-open")) return;
    slide.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    panel.inert = true;
    reveal.setAttribute("aria-expanded", "false");
    if (focusReveal) reveal.focus({ preventScroll: true });
  };
  const update = () => {
    const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const delta = Math.abs(rect.left + rect.width / 2 - center);
      if (delta < distance) { distance = delta; nearest = index; }
    });
    if (nearest !== current) closeDetails(slides[current]);
    current = nearest;
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === current));
    steps.forEach((step, index) => step.classList.toggle("is-active", index === current));
    counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  };
  const goTo = (index) => {
    if (index < 0 || index >= slides.length) return;
    closeDetails(slides[current]);
    const bounds = slides[index].getBoundingClientRect();
    const view = viewport.getBoundingClientRect();
    const offset = bounds.left + bounds.width / 2 - (view.left + view.width / 2);
    viewport.scrollBy({ left: offset, behavior: reduced.matches ? "instant" : "smooth" });
  };

  slides.forEach((slide) => {
    const reveal = slide.querySelector(".project-dual-reveal");
    const close = slide.querySelector(".project-dual-close");
    const panel = slide.querySelector(".project-dual-detail");
    reveal.addEventListener("click", () => {
      const open = !slide.classList.contains("is-open");
      slides.forEach((other) => { if (other !== slide) closeDetails(other); });
      slide.classList.toggle("is-open", open);
      reveal.setAttribute("aria-expanded", String(open));
      panel.setAttribute("aria-hidden", String(!open));
      panel.inert = !open;
      if (open) {
        const scroller = panel.querySelector(".project-dual-detail-scroll");
        scroller.scrollTop = 0;
        close.focus({ preventScroll: true });
      }
    });
    close.addEventListener("click", () => closeDetails(slide, true));
  });
  prev.addEventListener("click", () => goTo(current - 1));
  next.addEventListener("click", () => goTo(current + 1));
  viewport.addEventListener("keydown", (event) => {
    if (event.target.closest("button, a") && event.target !== viewport) return;
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(current + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(current - 1); }
    if (event.key === "Escape") closeDetails(slides[current], true);
  });
  viewport.addEventListener("scroll", () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; update(); });
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
