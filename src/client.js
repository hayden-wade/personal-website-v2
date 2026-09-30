// Progressive enhancements: page navigation and article links work without JavaScript.
const header = document.querySelector(".site-header");
const menu = document.querySelector(".menu-toggle");
function closeMenu() {
  header?.classList.remove("menu-open");
  menu?.setAttribute("aria-expanded", "false");
}
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  header.classList.toggle("menu-open", open);
  menu.setAttribute("aria-expanded", String(open));
});
header
  ?.querySelectorAll("nav a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && header?.classList.contains("menu-open")) {
    closeMenu();
    menu.focus();
  }
});

// Use Lenis for restrained, production-grade inertial scrolling on the homepage.
// It loads only after the intro loader has fully left the DOM, and falls back to
// ordinary browser scrolling if the CDN is unavailable.
const smoothScrollEligible =
  document.querySelector(".hero") &&
  window.matchMedia("(pointer: fine)").matches;

if (smoothScrollEligible) {
  const initLenis = () => {
    if (!window.Lenis || window.__siteLenis) return;

    window.__siteLenis = new window.Lenis({
      autoRaf: true,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.0,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });
  };

  const loadLenis = () => {
    if (window.Lenis) {
      initLenis();
      return;
    }

    if (!document.getElementById("lenis-stylesheet")) {
      const stylesheet = document.createElement("link");
      stylesheet.id = "lenis-stylesheet";
      stylesheet.rel = "stylesheet";
      stylesheet.href = "https://unpkg.com/lenis@1.3.26/dist/lenis.css";
      document.head.appendChild(stylesheet);
    }

    const existingScript = document.getElementById("lenis-script");
    if (existingScript) {
      existingScript.addEventListener("load", initLenis, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "lenis-script";
    script.src = "https://unpkg.com/lenis@1.3.26/dist/lenis.min.js";
    script.async = true;
    script.addEventListener("load", initLenis, { once: true });
    document.head.appendChild(script);
  };

  const startAfterLoader = () => {
    if (!document.querySelector(".site-loader")) {
      loadLenis();
      return;
    }

    const observer = new MutationObserver(() => {
      if (!document.querySelector(".site-loader")) {
        observer.disconnect();
        loadLenis();
      }
    });
    observer.observe(document.body, { childList: true });
  };

  if (document.readyState === "complete") startAfterLoader();
  else window.addEventListener("load", startAfterLoader, { once: true });
}

const sections = [...document.querySelectorAll(".home-section,.contact")];
if (sections.length) {
  const nav = [...document.querySelectorAll(".home-nav nav a")];
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          nav.forEach((a) => {
            const active = a.hash === "#" + entry.target.id;
            active
              ? a.setAttribute("aria-current", "location")
              : a.removeAttribute("aria-current");
          });
        }
    },
    { rootMargin: "-15% 0px -65% 0px" },
  );
  sections.forEach((s) => observer.observe(s));
}
document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    const value = button.dataset.filter;
    document
      .querySelectorAll("[data-filter]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    let visible = 0;
    document.querySelectorAll(".project-grid .project-card").forEach((card) => {
      card.hidden = value !== "all" && card.dataset.status !== value;
      if (!card.hidden) visible++;
    });
    document.getElementById("filter-result").textContent =
      `Showing ${visible} ${value === "all" ? "" : value + " "}projects.`;
  }),
);
const tabs = [...document.querySelectorAll("[data-view]")];
function activateTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (e) => {
    let n;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    else return;
    e.preventDefault();
    activateTab(tabs[n]);
    tabs[n].focus();
  });
});
const dialog = document.querySelector(".lightbox");
const triggers = [...document.querySelectorAll("[data-enlarge]")];
let photos = [],
  current = 0,
  opener = null;
function renderViewer(root) {
  const p = photos[current];
  if (!p) return;
  const img = root.querySelector(".viewer-stage figure>img");
  img.src = p.src;
  img.alt = p.caption;
  root.querySelector(".viewer-caption").textContent = p.caption;
  root.querySelector(".viewer-count").textContent =
    `${current + 1} / ${photos.length}`;
  root
    .querySelectorAll(".viewer-prev,.viewer-next")
    .forEach((b) => (b.disabled = photos.length < 2));
}
function move(root, delta) {
  current = (current + delta + photos.length) % photos.length;
  renderViewer(root);
}
triggers.forEach((trigger) =>
  trigger.addEventListener("click", (e) => {
    if (!dialog?.showModal) return;
    e.preventDefault();
    opener = trigger;
    photos = triggers.map((t) => ({
      src: t.dataset.enlarge,
      caption: t.dataset.caption || "",
    }));
    current = triggers.indexOf(trigger);
    renderViewer(dialog);
    window.__siteLenis?.stop();
    dialog.showModal();
    document.body.classList.add("lightbox-open");
    dialog.querySelector(".lightbox-close").focus();
  }),
);
dialog
  ?.querySelector(".lightbox-close")
  .addEventListener("click", () => dialog.close());
dialog?.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  window.__siteLenis?.start();
  opener?.focus();
});
for (const root of [
  dialog,
  document.querySelector("[data-viewer-page]"),
].filter(Boolean)) {
  root
    .querySelector(".viewer-prev")
    .addEventListener("click", () => move(root, -1));
  root
    .querySelector(".viewer-next")
    .addEventListener("click", () => move(root, 1));
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      move(root, e.key === "ArrowLeft" ? -1 : 1);
    }
  });
  let startX;
  root.querySelector(".viewer-stage").addEventListener(
    "touchstart",
    (e) => {
      startX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );
  root.querySelector(".viewer-stage").addEventListener(
    "touchend",
    (e) => {
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 60) move(root, delta > 0 ? -1 : 1);
    },
    { passive: true },
  );
}
const standalone = document.querySelector("[data-viewer-page]");
if (standalone) {
  photos = [...standalone.querySelectorAll("[data-src]")].map((t) => ({
    src: t.dataset.src,
    caption: t.dataset.caption,
  }));
  const requested = Number(new URLSearchParams(location.search).get("photo"));
  current =
    Number.isInteger(requested) && requested >= 0 && requested < photos.length
      ? requested
      : 0;
  renderViewer(standalone);
}
const progress = document.querySelector(".reading-progress");
if (progress) {
  let pending = false;
  const update = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${total > 0 ? Math.min(100, (scrollY / total) * 100) : 100}%`;
    pending = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  addEventListener("resize", update);
  update();
}

// Shared-element/FLIP-style hero identity handoff. Once scrolling begins, one
// fixed visual proxy represents Hayden/Wade all the way from the hero to the
// header. The real source and destination remain in the DOM but are hidden so
// there can never be a doubled/cross-faded wordmark.
function installHeroWordmarkProxy() {
  const hero = document.querySelector(".hero");
  const source = hero?.querySelector(".hero-title");
  const destination = document.querySelector(".home-nav .wordmark");
  if (!hero || !source || !destination) return;

  const desktop = window.matchMedia("(min-width: 701px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let proxy = null;
  let scheduled = false;
  let sourceCenterY = 0;
  let targetCenterY = 37;
  let heroFontSize = 196;
  let dockScale = 30 / 196;
  let startLetterEm = -0.0255;

  const clamp01 = (value) => Math.min(1, Math.max(0, value));
  const smoothstep = (start, end, value) => {
    const t = clamp01((value - start) / (end - start));
    return t * t * (3 - 2 * t);
  };
  const mix = (from, to, progress) => from + (to - from) * progress;

  const measure = () => {
    const previousTransform = source.style.transform;
    const previousOpacity = source.style.opacity;
    const previousLetterSpacing = source.style.letterSpacing;
    source.style.transform = "none";
    source.style.opacity = "1";
    source.style.letterSpacing = "";

    const sourceRect = source.getBoundingClientRect();
    sourceCenterY = sourceRect.top + sourceRect.height / 2;
    const computed = getComputedStyle(source);
    heroFontSize = parseFloat(computed.fontSize) || 196;
    const letterSpacingPx = parseFloat(computed.letterSpacing);
    startLetterEm = Number.isFinite(letterSpacingPx)
      ? letterSpacingPx / heroFontSize
      : -0.0255;
    dockScale = 30 / heroFontSize;

    source.style.transform = previousTransform;
    source.style.opacity = previousOpacity;
    source.style.letterSpacing = previousLetterSpacing;

    const targetRect = destination.getBoundingClientRect();
    if (targetRect.height) targetCenterY = targetRect.top + targetRect.height / 2;
  };

  const buildProxy = () => {
    if (proxy) return;
    proxy = source.cloneNode(true);
    proxy.classList.add("hero-wordmark-proxy");
    proxy.removeAttribute("id");
    proxy.setAttribute("aria-hidden", "true");
    proxy.style.transform = "";
    proxy.style.opacity = "";
    proxy.style.letterSpacing = "";
    document.body.appendChild(proxy);
    document.documentElement.classList.add("hero-wordmark-proxy-active");
  };

  const removeProxy = () => {
    proxy?.remove();
    proxy = null;
    document.documentElement.classList.remove("hero-wordmark-proxy-active");
  };

  const update = () => {
    scheduled = false;
    if (!desktop.matches || reducedMotion.matches) {
      removeProxy();
      return;
    }

    const ratio = clamp01(window.scrollY / Math.max(1, hero.offsetHeight));
    if (ratio <= 0 && !proxy) return;
    if (!sourceCenterY) measure();
    buildProxy();

    const travel = smoothstep(0.08, 0.9, ratio);
    const y = mix(sourceCenterY, targetCenterY, travel);
    const scale = mix(1, dockScale, travel);
    const letterEm = mix(startLetterEm, -0.055, travel);

    proxy.style.top = `${y}px`;
    proxy.style.transform = `translate3d(-50%,-50%,0) scale(${scale})`;
    proxy.style.letterSpacing = `${letterEm}em`;
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  measure();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", () => {
    removeProxy();
    sourceCenterY = 0;
    measure();
    schedule();
  });
  desktop.addEventListener("change", schedule);
  reducedMotion.addEventListener("change", schedule);
}

if (document.readyState === "complete") installHeroWordmarkProxy();
else window.addEventListener("load", installHeroWordmarkProxy, { once: true });
