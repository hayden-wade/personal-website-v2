// Shared sliding underline for the desktop homepage navigation.
// One physical indicator moves between links, then returns to the active section.
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

  const geometryFor = (link) => ({
    x: link.offsetLeft,
    width: link.offsetWidth,
  });

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
    const midWidth =
      startWidth + (target.width - startWidth) * 0.62 + stretch;

    indicator.style.transform = `translate3d(${target.x}px,0,0)`;
    indicator.style.width = `${target.width}px`;

    animation = indicator.animate(
      [
        {
          transform: `translate3d(${startX}px,0,0)`,
          width: `${startWidth}px`,
          offset: 0,
        },
        {
          transform: `translate3d(${midX}px,0,0)`,
          width: `${midWidth}px`,
          offset: 0.58,
        },
        {
          transform: `translate3d(${target.x}px,0,0)`,
          width: `${target.width}px`,
          offset: 1,
        },
      ],
      {
        duration: 440,
        easing: "cubic-bezier(.22,1,.36,1)",
      },
    );

    animation.addEventListener(
      "finish",
      () => {
        animation = null;
      },
      { once: true },
    );
  };

  const restoreActive = () => place(activeLink());

  for (const link of links) {
    link.addEventListener("pointerenter", () => {
      hovered = link;
      place(link);
    });
    link.addEventListener("focus", () => {
      hovered = link;
      place(link);
    });
    link.addEventListener("blur", () => {
      hovered = null;
      restoreActive();
    });
  }

  header.addEventListener("pointerleave", () => {
    hovered = null;
    restoreActive();
  });

  const activeObserver = new MutationObserver(() => {
    if (!hovered && !nav.contains(document.activeElement)) restoreActive();
  });
  links.forEach((link) =>
    activeObserver.observe(link, {
      attributes: true,
      attributeFilter: ["aria-current"],
    }),
  );

  const reposition = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() =>
      place(hovered || activeLink(), true),
    );
  };

  window.addEventListener("resize", reposition, { passive: true });
  desktop.addEventListener("change", reposition);
  reducedMotion.addEventListener("change", reposition);

  const initialise = () =>
    requestAnimationFrame(() => place(activeLink(), true));

  if (document.fonts?.ready) document.fonts.ready.then(initialise);
  else initialise();
})();

// Own the homepage Experience accordion in capture phase so its opening and
// closing are fully controlled. Content is revealed naturally by the changing
// panel height; there is no separate text fade or scale that can pop to 100%.
(() => {
  const jobs = [...document.querySelectorAll(".experience-list .job")];
  if (!jobs.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const openingDuration = 520;
  const closingDuration = 420;
  const openingEasing = "cubic-bezier(.45,0,.55,1)";
  const closingEasing = "cubic-bezier(.65,0,.35,1)";

  if (!document.getElementById("experience-open-motion-override")) {
    const style = document.createElement("style");
    style.id = "experience-open-motion-override";
    style.textContent = `
.job.is-opening::before {
  transition-duration: ${openingDuration}ms !important;
  transition-timing-function: ${openingEasing} !important;
}
`;
    document.head.appendChild(style);
  }

  for (const job of jobs) {
    const summary = job.querySelector("summary");
    const copy = job.querySelector(".job-copy");
    if (!summary || !copy) continue;

    let heightAnimation = null;
    let targetOpen = job.open;

    const collapsedHeight = () => {
      const styles = getComputedStyle(job);
      return (
        summary.getBoundingClientRect().height +
        parseFloat(styles.borderTopWidth || 0) +
        parseFloat(styles.borderBottomWidth || 0)
      );
    };

    const stopAnimation = () => {
      if (!heightAnimation) return;
      const current = heightAnimation;
      heightAnimation = null;
      current.cancel();
    };

    const clean = () => {
      job.style.height = "";
      job.style.overflow = "";
      job.classList.remove("is-opening", "is-closing");
      copy.style.opacity = "";
      copy.style.transform = "";
      copy.style.willChange = "";
    };

    const run = (opening) => {
      const startHeight = job.getBoundingClientRect().height;
      stopAnimation();
      targetOpen = opening;

      job.style.height = `${startHeight}px`;
      job.style.overflow = "hidden";
      copy.style.opacity = "1";
      copy.style.transform = "none";
      copy.style.willChange = "auto";

      if (opening) {
        job.classList.remove("is-closing");
        job.classList.add("is-opening");
        job.open = true;

        job.style.height = "auto";
        const endHeight = job.getBoundingClientRect().height;
        job.style.height = `${startHeight}px`;

        // Lock the collapsed geometry for one layout pass before animating.
        // This prevents the native details content from flashing fully open.
        void job.offsetHeight;

        heightAnimation = job.animate(
          [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
          {
            duration: openingDuration,
            easing: openingEasing,
            fill: "both",
          },
        );
      } else {
        job.classList.remove("is-opening");
        job.classList.add("is-closing");

        const endHeight = collapsedHeight();
        heightAnimation = job.animate(
          [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
          {
            duration: closingDuration,
            easing: closingEasing,
            fill: "both",
          },
        );
      }

      const current = heightAnimation;
      current.finished
        .then(() => {
          if (heightAnimation !== current) return;
          heightAnimation = null;
          current.cancel();
          if (!targetOpen) job.open = false;
          clean();
        })
        .catch(() => {});
    };

    summary.addEventListener(
      "click",
      (event) => {
        if (reducedMotion.matches || typeof job.animate !== "function") return;

        event.preventDefault();
        event.stopImmediatePropagation();
        const opening = heightAnimation ? !targetOpen : !job.open;
        run(opening);
      },
      { capture: true },
    );
  }
})();
