// Shared sliding underline for the desktop homepage navigation.
(() => {
  const header = document.querySelector(".home-nav");
  const nav = header?.querySelector("nav");
  if (!header || !nav) return;

  const links = [...nav.querySelectorAll("a")].filter(
    (link) => getComputedStyle(link).display !== "none",
  );
  if (!links.length) return;

  const desktop = window.matchMedia("(min-width: 701px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const style = document.createElement("style");
  style.id = "sliding-nav-indicator-styles";
  style.textContent = `
@media (min-width:701px) {
  .home-nav nav { position: relative; }
  .home-nav nav a[aria-current]::after { display: none !important; }
  .home-nav .nav-slide-indicator {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 5;
    width: 0;
    height: 3px;
    background: var(--accent, #c06b49);
    transform: translate3d(0,0,0);
    transform-origin: left center;
    opacity: var(--home-nav-links, 1);
    pointer-events: none;
    will-change: transform, width;
  }
}
@media (max-width:700px) {
  .home-nav .nav-slide-indicator { display: none; }
}
`;
  document.head.appendChild(style);

  const indicator = document.createElement("span");
  indicator.className = "nav-slide-indicator";
  indicator.setAttribute("aria-hidden", "true");
  nav.appendChild(indicator);

  let hovered = null;
  let animation = null;
  let initialised = false;
  let resizeFrame = 0;

  const activeLink = () =>
    links.find((link) => link.hasAttribute("aria-current")) || links[0];

  const geometryFor = (link) => ({ x: link.offsetLeft, width: link.offsetWidth });

  const place = (link, instant = false) => {
    if (!desktop.matches || !link || link.offsetWidth <= 0) return;

    const target = geometryFor(link);
    animation?.cancel();
    animation = null;

    if (!initialised || instant || reducedMotion.matches || !indicator.animate) {
      indicator.style.transform = `translate3d(${target.x}px,0,0)`;
      indicator.style.width = `${target.width}px`;
      initialised = true;
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const currentRect = indicator.getBoundingClientRect();
    const startX = currentRect.left - navRect.left;
    const startWidth = currentRect.width;
    const distance = target.x - startX;
    const stretch = Math.min(18, Math.abs(distance) * 0.075);
    const movingLeft = distance < 0;
    const midX = startX + distance * 0.62 - (movingLeft ? stretch : 0);
    const midWidth = startWidth + (target.width - startWidth) * 0.62 + stretch;

    indicator.style.transform = `translate3d(${target.x}px,0,0)`;
    indicator.style.width = `${target.width}px`;

    animation = indicator.animate(
      [
        { transform: `translate3d(${startX}px,0,0)`, width: `${startWidth}px`, offset: 0 },
        { transform: `translate3d(${midX}px,0,0)`, width: `${midWidth}px`, offset: 0.58 },
        { transform: `translate3d(${target.x}px,0,0)`, width: `${target.width}px`, offset: 1 },
      ],
      { duration: 440, easing: "cubic-bezier(.22,1,.36,1)" },
    );

    animation.addEventListener("finish", () => { animation = null; }, { once: true });
  };

  const restoreActive = () => place(activeLink());

  for (const link of links) {
    link.addEventListener("pointerenter", () => { hovered = link; place(link); });
    link.addEventListener("focus", () => { hovered = link; place(link); });
    link.addEventListener("blur", () => { hovered = null; restoreActive(); });
  }

  header.addEventListener("pointerleave", () => {
    hovered = null;
    restoreActive();
  });

  const activeObserver = new MutationObserver(() => {
    if (!hovered && !nav.contains(document.activeElement)) restoreActive();
  });
  links.forEach((link) =>
    activeObserver.observe(link, { attributes: true, attributeFilter: ["aria-current"] }),
  );

  const reposition = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => place(hovered || activeLink(), true));
  };

  window.addEventListener("resize", reposition, { passive: true });
  desktop.addEventListener("change", reposition);
  reducedMotion.addEventListener("change", reposition);

  const initialise = () => requestAnimationFrame(() => place(activeLink(), true));
  if (document.fonts?.ready) document.fonts.ready.then(initialise);
  else initialise();
})();
