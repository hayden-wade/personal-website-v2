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

const sections = [...document.querySelectorAll(".home-section,.contact-reveal-spacer")];
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

// Exact fixed-footer reveal baseline from the referenced CodePen.
function footerBehindContent() {
  const footer = document.querySelector(".footer");
  const main = document.querySelector(".home-reveal-shell");
  if (footer && main) {
    if (window.matchMedia("(max-width: 700px)").matches) {
      main.style.marginBottom = "";
    } else {
      const footerHeight = footer.offsetHeight;
      main.style.marginBottom = footerHeight + "px";
    }
  }
}

function horizontalLoop(items, config) {
  items = window.gsap.utils.toArray(items);
  config = config || {};
  let tl = window.gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () =>
        tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap =
      config.snap === false
        ? (v) => v
        : window.gsap.utils.snap(config.snap || 1),
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;

  window.gsap.set(items, {
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(
        window.gsap.getProperty(el, "width", "px"),
      ));
      xPercents[i] = snap(
        (parseFloat(window.gsap.getProperty(el, "x", "px")) / w) * 100 +
          window.gsap.getProperty(el, "xPercent"),
      );
      return xPercents[i];
    },
  });

  window.gsap.set(items, { x: 0 });

  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      window.gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart +
      widths[i] * window.gsap.getProperty(item, "scaleX");
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0,
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) /
            pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond,
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index, vars) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length);
    let newIndex = window.gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = {
        time: window.gsap.utils.wrap(0, tl.duration()),
      };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true);

  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
}

function installContactReveal() {
  const footer = document.querySelector(".footer");
  const main = document.querySelector(".home-reveal-shell");
  const homeNav = document.querySelector(".home-nav");
  if (!footer || !main) return;

  footerBehindContent();
  window.addEventListener("resize", footerBehindContent);

  if (
    typeof window.gsap === "undefined" ||
    typeof window.ScrollTrigger === "undefined"
  )
    return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  const paths = document.querySelectorAll(".svg-animation .svg-letter");
  if (paths.length) {
    const svgTimeline = window.gsap.timeline({
      scrollTrigger: {
        trigger: main,
        start: "bottom 80%",
        end: "bottom top",
        scrub: true,
        toggleActions: "play none none reverse",
        markers: false,
        onEnter: () => homeNav?.classList.add("footer-active"),
        onLeaveBack: () => homeNav?.classList.remove("footer-active"),
      },
    });

    paths.forEach((path, i) => {
      svgTimeline.fromTo(
        path,
        { opacity: 0, y: 75 },
        { opacity: 1, y: 0, ease: "power3.out" },
        i * 0.25,
      );
    });
  }

  const scrollingText = window.gsap.utils.toArray(
    ".footer__marquee-content span",
  );
  if (scrollingText.length) {
    const loopTimeline = horizontalLoop(scrollingText, {
      repeat: -1,
      speed: 1,
    });

    let speedTween;
    window.ScrollTrigger.create({
      trigger: main,
      start: "bottom 80%",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        if (speedTween) speedTween.kill();
        speedTween = window.gsap
          .timeline()
          .to(loopTimeline, {
            timeScale: 3 * self.direction,
            duration: 0.25,
          })
          .to(
            loopTimeline,
            {
              timeScale: 1 * self.direction,
              duration: 1.5,
            },
            "+=0.5",
          );
      },
      markers: false,
    });
  }

  window.ScrollTrigger.refresh();
}

installContactReveal();

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

function installPhotographyTitleTransition() {
  const title = document.querySelector("[data-photo-title]");
  const subtitle = document.querySelector("[data-photo-subtitle]");
  const rule = document.querySelector("[data-photo-rule]");
  const chars = title
    ? [...title.querySelectorAll("[data-photo-letter]")]
    : [];

  if (!title || !chars.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const reset = () => {
    chars.forEach((char) => {
      char.style.transform = "none";
      char.style.opacity = "1";
      char.style.willChange = "auto";
    });
    if (subtitle) {
      subtitle.style.opacity = "1";
      subtitle.style.transform = "none";
    }
    if (rule) rule.style.transform = "scaleX(1)";
  };

  if (
    reducedMotion.matches ||
    typeof window.gsap === "undefined" ||
    typeof window.ScrollTrigger === "undefined"
  ) {
    reset();
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  // Adapted directly from Codrops' "Waking Life" (data-effect20)
  // in OnScrollTypographyAnimations. MIT licensed; see THIRD_PARTY_NOTICES.md.
  chars.forEach((char) => gsap.set(char.parentNode, { perspective: 1000 }));

  gsap.fromTo(
    chars,
    {
      willChange: "opacity, transform",
      transformOrigin: "50% 100%",
      opacity: 0,
      rotationX: 90,
    },
    {
      ease: "power4",
      opacity: 1,
      stagger: {
        each: 0.03,
        from: "random",
      },
      rotationX: 0,
      scrollTrigger: {
        trigger: title,
        start: "center bottom",
        end: "bottom top+=20%",
        scrub: true,
      },
    },
  );

  if (subtitle) {
    gsap.fromTo(
      subtitle,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: title,
          start: "center 58%",
          end: "bottom 30%",
          scrub: true,
        },
      },
    );
  }

  if (rule) {
    gsap.fromTo(
      rule,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: title,
          start: "center 52%",
          end: "bottom 28%",
          scrub: true,
        },
      },
    );
  }

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      ScrollTrigger.getAll()
        .filter((trigger) => trigger.trigger === title)
        .forEach((trigger) => trigger.kill());
      reset();
    }
  });
}

installPhotographyTitleTransition();

// Photography wall: scroll-scrubbed center-out column reveal inspired by
// Codrops' Staggered 3D Grid Animations demo:
// https://github.com/codrops/Staggered3DGridAnimations
function installPhotographyStaggeredGrid() {
  const grid = document.querySelector("[data-staggered-photo-grid]");
  if (!grid) return;

  const originals = [...grid.querySelectorAll(":scope > .photo-3d-item")];
  if (!originals.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let items = [];
  let columns = 0;
  let scheduled = false;

  const clamp01 = (value) => Math.min(1, Math.max(0, value));

  const getColumns = () =>
    Math.max(
      1,
      getComputedStyle(grid)
        .gridTemplateColumns.split(" ")
        .filter(Boolean).length,
    );

  const decorate = (item, index) => {
    item.style.setProperty("--photo-x", `${18 + ((index * 31) % 65)}%`);
    item.style.setProperty("--photo-y", `${16 + ((index * 19) % 68)}%`);
  };

  const syncTiles = () => {
    grid
      .querySelectorAll(":scope > .photo-3d-clone")
      .forEach((clone) => clone.remove());

    columns = getColumns();
    const rows = columns >= 7 ? 5 : columns >= 5 ? 5 : 6;
    const targetCount = Math.max(originals.length, columns * rows);

    for (let i = originals.length; i < targetCount; i++) {
      const source =
        originals[(i * 3 + Math.floor(i / columns)) % originals.length];
      const clone = source.cloneNode(true);
      clone.classList.add("photo-3d-clone");
      clone.removeAttribute("href");
      clone.removeAttribute("data-enlarge");
      clone.removeAttribute("data-caption");
      clone.removeAttribute("data-gallery-photo");
      clone.removeAttribute("aria-label");
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("role", "presentation");
      clone.tabIndex = -1;
      grid.appendChild(clone);
    }

    items = [...grid.querySelectorAll(":scope > .photo-3d-item")];
    items.forEach(decorate);
  };

  const reset = () => {
    items.forEach((item) => {
      item.style.transform = "none";
      item.style.opacity = "1";
    });
  };

  const update = () => {
    scheduled = false;

    if (reducedMotion.matches) {
      reset();
      return;
    }

    const liveColumns = getColumns();
    if (liveColumns !== columns) syncTiles();

    const rect = grid.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const endTop = (viewportHeight - rect.height) / 2;
    const progress = clamp01(
      (viewportHeight - rect.top) / Math.max(1, viewportHeight - endTop),
    );
    const middleColumn = (columns - 1) / 2;

    items.forEach((item, index) => {
      const columnIndex = index % columns;
      const distance = Math.abs(columnIndex - middleColumn);
      // Match the Codrops grid--full timing more closely: each step away
      // from centre starts 0.2 later, producing the steeper pyramid profile.
      const delay = Math.min(0.6, distance * 0.2);
      const localProgress = clamp01((progress - delay) / (1 - delay));
      const eased = Math.sin((localProgress * Math.PI) / 2);
      const yPercent = 450 * (1 - eased);

      item.style.transform = `translate3d(0, ${yPercent}%, 0)`;
      item.style.opacity = String(Math.min(1, localProgress * 1.35));
    });
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  syncTiles();
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", () => {
    syncTiles();
    schedule();
  });
  reducedMotion.addEventListener("change", schedule);
}

installPhotographyStaggeredGrid();

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
function viewerTriggersFor(trigger) {
  const gallery = trigger.closest(".home-photos,.photo-3d-grid,.photo-index");
  return gallery ? [...gallery.querySelectorAll("[data-enlarge]")] : triggers;
}
triggers.forEach((trigger) =>
  trigger.addEventListener("click", (e) => {
    if (!dialog?.showModal) return;
    e.preventDefault();
    opener = trigger;
    const activeTriggers = viewerTriggersFor(trigger);
    photos = activeTriggers.map((t) => ({
      src: t.dataset.enlarge,
      caption: t.dataset.caption || "",
    }));
    current = activeTriggers.indexOf(trigger);
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

// Experience accordion adapted from the WAAPI <details> animation pattern:
// https://codepen.io/EvilSpark/pen/ewWyVO
// The <details> element itself animates between the summary height and the
// measured summary + content height, so the copy is clipped/revealed naturally.
function installExperienceAccordionMotion() {
  const jobs = [...document.querySelectorAll(".experience-list .job")];
  if (!jobs.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const duration = 400;
  const easing = "ease-out";

  if (!document.getElementById("experience-accordion-motion")) {
    const style = document.createElement("style");
    style.id = "experience-accordion-motion";
    style.textContent = `
.job::before {
  content: "";
  position: absolute;
  left: 0;
  top: 24px;
  bottom: 30px;
  width: 2px;
  background: var(--accent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform ${duration}ms ${easing};
  pointer-events: none;
  will-change: transform;
}
.job[open]::before {
  transform: scaleY(1);
}
.job.is-closing::before {
  transform: scaleY(0);
}
@media (prefers-reduced-motion: reduce) {
  .job::before {
    transition: none;
  }
}
`;
    document.head.appendChild(style);
  }

  class ExperienceAccordion {
    constructor(el) {
      this.el = el;
      this.summary = el.querySelector("summary");
      this.content = el.querySelector(".job-copy");
      this.animation = null;
      this.isClosing = false;
      this.isExpanding = false;

      if (!this.summary || !this.content) return;

      this.summary.addEventListener("click", (event) => this.onClick(event));
    }

    onClick(event) {
      if (reducedMotion.matches || typeof this.el.animate !== "function") {
        return;
      }

      event.preventDefault();
      this.el.style.overflow = "hidden";

      if (this.isClosing || !this.el.open) {
        this.open();
      } else if (this.isExpanding || this.el.open) {
        this.shrink();
      }
    }

    shrink() {
      this.isClosing = true;
      this.el.classList.remove("is-opening");
      this.el.classList.add("is-closing");

      const startHeight = `${this.el.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight}px`;

      if (this.animation) {
        this.animation.cancel();
      }

      this.animation = this.el.animate(
        { height: [startHeight, endHeight] },
        { duration, easing },
      );

      this.animation.onfinish = () => this.onAnimationFinish(false);
      this.animation.oncancel = () => {
        this.isClosing = false;
      };
    }

    open() {
      // Lock the currently collapsed height before setting [open]. This is the
      // key part of the reference implementation: content becomes measurable
      // without being allowed to paint at full height first.
      this.el.style.height = `${this.el.offsetHeight}px`;
      this.el.classList.remove("is-closing");
      this.el.classList.add("is-opening");
      this.el.open = true;

      window.requestAnimationFrame(() => this.expand());
    }

    expand() {
      this.isExpanding = true;

      const startHeight = `${this.el.offsetHeight}px`;
      const endHeight = `${
        this.summary.offsetHeight + this.content.offsetHeight
      }px`;

      if (this.animation) {
        this.animation.cancel();
      }

      this.animation = this.el.animate(
        { height: [startHeight, endHeight] },
        { duration, easing },
      );

      this.animation.onfinish = () => this.onAnimationFinish(true);
      this.animation.oncancel = () => {
        this.isExpanding = false;
      };
    }

    onAnimationFinish(open) {
      this.el.open = open;
      this.animation = null;
      this.isClosing = false;
      this.isExpanding = false;
      this.el.classList.remove("is-opening", "is-closing");
      this.el.style.height = "";
      this.el.style.overflow = "";
    }
  }

  jobs.forEach((job) => new ExperienceAccordion(job));
}

installExperienceAccordionMotion();
