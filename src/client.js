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

// Give desktop wheel scrolling some weight without replacing native touch,
// keyboard, scrollbar, reduced-motion, or nested-control behaviour.
const momentumReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const momentumPointer = window.matchMedia("(pointer: fine)");
if (
  document.querySelector(".hero") &&
  momentumPointer.matches &&
  !momentumReduced.matches
) {
  let current = window.scrollY;
  let target = window.scrollY;
  let frame = 0;

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clamp = (value) => Math.min(maxScroll(), Math.max(0, value));

  const stopMomentum = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    current = window.scrollY;
    target = window.scrollY;
  };

  const renderMomentum = () => {
    target = clamp(target);
    const distance = target - current;
    current += distance * 0.105;

    if (Math.abs(distance) < 0.35) {
      current = target;
      window.scrollTo(0, target);
      frame = 0;
      return;
    }

    window.scrollTo(0, current);
    frame = requestAnimationFrame(renderMomentum);
  };

  window.addEventListener(
    "wheel",
    (event) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        document.body.classList.contains("lightbox-open") ||
        event.target.closest("input,textarea,select,[contenteditable='true']") ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;

      event.preventDefault();

      if (!frame) {
        current = window.scrollY;
        target = window.scrollY;
      }

      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 18
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1;
      const rawDelta = event.deltaY * unit;
      const limitedDelta =
        Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), 220);

      target = clamp(target + limitedDelta * 0.95);
      if (!frame) frame = requestAnimationFrame(renderMomentum);
    },
    { passive: false },
  );

  // Direct navigation should immediately take control back from the easing loop.
  window.addEventListener("pointerdown", stopMomentum, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ].includes(event.key)
    )
      stopMomentum();
  });
  window.addEventListener("resize", () => {
    target = clamp(target);
  });
  window.addEventListener("hashchange", stopMomentum);
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
