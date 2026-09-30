// Dark portfolio loader with a louvre-style handoff into the hero.
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

function createLoaderStyles() {
  if (document.getElementById("site-loader-styles")) return;
  const style = document.createElement("style");
  style.id = "site-loader-styles";
  style.textContent = `
.site-loader{position:fixed;inset:0;z-index:9999;color:var(--text,#e5e0d6);font-family:'DM Sans',Arial,Helvetica,sans-serif;pointer-events:all;overflow:hidden;background:#0b0e0c}
.site-loader__louvres{position:absolute;inset:0;z-index:0;display:grid;grid-template-rows:repeat(40,minmax(0,1fr));overflow:hidden}
.site-loader__louvre{display:block;width:100%;height:100%;background:#0b0e0c;transform:scaleY(1.08);transform-origin:50% 50%;will-change:transform;transition:transform 1120ms cubic-bezier(.76,0,.24,1);transition-delay:var(--louvre-delay,0ms)}
.site-loader__ui{position:relative;z-index:1;width:100%;height:100%;transition:opacity 300ms cubic-bezier(.4,0,.2,1),transform 420ms cubic-bezier(.16,1,.3,1);opacity:0;background:radial-gradient(circle at 50% 48%,rgba(192,107,73,.08),transparent 28%),linear-gradient(180deg,rgba(255,255,255,.018),transparent 32%,rgba(0,0,0,.12))}
.site-loader--active .site-loader__ui{opacity:1}
.site-loader__meta{position:absolute;left:clamp(24px,4.4vw,88px);right:clamp(24px,4.4vw,88px);display:flex;justify-content:space-between;gap:24px;font-size:11px;line-height:1.4;letter-spacing:.13em;text-transform:uppercase;color:var(--muted,#a7aaa3)}
.site-loader__meta--top{top:28px}.site-loader__meta--bottom{bottom:27px}
.site-loader__center{position:absolute;left:50%;top:50%;width:min(620px,72vw);transform:translate(-50%,-50%);text-align:center}
.site-loader__name{font-family:'Instrument Serif',Georgia,'Times New Roman',serif;font-size:clamp(54px,6.6vw,104px);font-weight:400;line-height:.84;letter-spacing:-.045em;color:var(--text,#e5e0d6);text-shadow:0 16px 70px rgba(0,0,0,.28)}
.site-loader__line{display:block;overflow:hidden;padding:.07em 0 .13em}
.site-loader__line:last-child{font-style:italic}
.site-loader__char{display:inline-block;opacity:0;transform:translateY(108%);will-change:transform,opacity;transition-property:transform,opacity;transition-duration:1050ms;transition-timing-function:cubic-bezier(.16,1,.3,1)}
.site-loader--active .site-loader__char{opacity:1;transform:translateY(0)}
.site-loader__track{position:relative;height:1px;background:var(--line,#3a3f39);margin:34px auto 16px;overflow:visible}
.site-loader__fill{position:absolute;inset:0;background:var(--text,#e5e0d6);transform:scaleX(0);transform-origin:center;will-change:transform;box-shadow:0 0 18px rgba(229,224,214,.12)}
.site-loader__status{display:flex;align-items:center;justify-content:space-between;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted,#a7aaa3)}
.site-loader__count{font-variant-numeric:tabular-nums;color:var(--text,#e5e0d6)}
.site-loader--exit{pointer-events:none;background:transparent}
.site-loader--exit .site-loader__louvre{transform:scaleY(0)}
.site-loader--exit .site-loader__ui{animation:site-loader-ui-release 1120ms cubic-bezier(.4,0,.2,1) both}
@keyframes site-loader-ui-release{0%,52%{opacity:1;transform:scale(1)}88%,100%{opacity:0;transform:scale(.994)}}
@media(max-width:700px){.site-loader__center{width:78vw}.site-loader__name{font-size:clamp(48px,16vw,76px)}.site-loader__meta{font-size:9px;letter-spacing:.11em}.site-loader__meta--top{top:22px}.site-loader__meta--bottom{bottom:22px}.site-loader__meta--bottom span:first-child{max-width:190px}.site-loader__track{margin-top:28px}}
@media(prefers-reduced-motion:reduce){.site-loader{display:none!important}}
`;
  document.head.appendChild(style);
}

function shouldShowSiteLoader() {
  const hero = document.querySelector(".hero");
  if (!hero || reduced.matches || location.hash || window.scrollY > 80)
    return false;
  const navigation = performance.getEntriesByType?.("navigation")?.[0];
  if (navigation?.type === "reload") return true;
  if (!document.referrer) return true;
  try {
    return new URL(document.referrer).origin !== location.origin;
  } catch {
    return true;
  }
}

function runSiteLoader() {
  if (!shouldShowSiteLoader()) return Promise.resolve(false);
  createLoaderStyles();
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const loader = document.createElement("div");
  loader.className = "site-loader";
  loader.setAttribute("aria-hidden", "true");

  const louvreCount = 40;
  const louvres = Array.from({ length: louvreCount }, (_, index) => {
    const centre = (louvreCount - 1) / 2;
    const delay = Math.round(Math.abs(index - centre) * 4);
    return `<span class="site-loader__louvre" style="--louvre-delay:${delay}ms"></span>`;
  }).join("");

  loader.innerHTML = `<div class="site-loader__louvres">${louvres}</div><div class="site-loader__ui"><div class="site-loader__meta site-loader__meta--top"><span>Hayden Wade</span><span>Brisbane / AU</span></div><div class="site-loader__center"><div class="site-loader__name"><span class="site-loader__line" data-loader-line="Hayden"></span><span class="site-loader__line" data-loader-line="Wade"></span></div><div class="site-loader__track"><span class="site-loader__fill"></span></div><div class="site-loader__status"><span>Initialising</span><span class="site-loader__count">00</span></div></div><div class="site-loader__meta site-loader__meta--bottom"><span>Cybersecurity · Engineering · Old cars</span><span>Portfolio / 2026</span></div></div>`;
  document.body.prepend(loader);

  let charIndex = 0;
  for (const line of loader.querySelectorAll("[data-loader-line]")) {
    const text = line.dataset.loaderLine || "";
    for (const character of text) {
      const span = document.createElement("span");
      span.className = "site-loader__char";
      span.textContent = character === " " ? "\u00a0" : character;
      span.style.transitionDelay = `${140 + charIndex * 48}ms`;
      line.appendChild(span);
      charIndex++;
    }
  }

  const fill = loader.querySelector(".site-loader__fill");
  const count = loader.querySelector(".site-loader__count");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => loader.classList.add("site-loader--active")),
  );

  const heroImage = document.querySelector(".hero-image");
  let assetsReady = document.readyState === "complete";
  const pageReady =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise((resolve) =>
          window.addEventListener("load", resolve, { once: true }),
        );
  const imageReady = heroImage?.decode
    ? heroImage.decode().catch(() => {})
    : Promise.resolve();
  Promise.all([pageReady, imageReady]).then(() => {
    assetsReady = true;
  });

  const start = performance.now();
  const minimum = 1780;
  const maximum = 3600;
  let displayed = 0;

  return new Promise((resolve) => {
    const tick = (now) => {
      const elapsed = now - start;
      const timeTarget = Math.min(92, (elapsed / 1450) * 92);
      const target =
        (assetsReady && elapsed >= minimum) || elapsed >= maximum
          ? 100
          : timeTarget;

      displayed += Math.max(0.12, (target - displayed) * 0.12);
      displayed = Math.min(target, displayed);
      const rounded = Math.min(100, Math.floor(displayed));
      fill.style.transform = `scaleX(${displayed / 100})`;
      count.textContent = String(rounded).padStart(2, "0");

      if (target === 100 && displayed >= 99.35) {
        fill.style.transform = "scaleX(1)";
        count.textContent = "100";

        window.setTimeout(() => {
          // Keep the finished loader composition visible while the same dark
          // surface immediately opens into horizontal louvres around it.
          animateHeroIntro();
          requestAnimationFrame(() =>
            loader.classList.add("site-loader--exit"),
          );

          window.setTimeout(() => {
            document.body.style.overflow = previousOverflow;
          }, 1180);

          window.setTimeout(() => {
            loader.remove();
            resolve(true);
          }, 1340);
        }, 120);
        return;
      }

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

let heroIntroStarted = false;
function animateHeroIntro() {
  const hero = document.querySelector(".hero");
  const title = hero?.querySelector(".hero-title");
  if (
    heroIntroStarted ||
    !hero ||
    !title ||
    reduced.matches ||
    window.scrollY > 80 ||
    typeof title.animate !== "function"
  )
    return;

  heroIntroStarted = true;
  const lines = [...title.children];
  const label = lines.map((line) => line.textContent.trim()).join(" ");
  title.setAttribute("aria-label", label);

  let characterIndex = 0;
  for (const line of lines) {
    const text = line.textContent;
    line.textContent = "";
    line.style.overflow = "hidden";
    for (const character of text) {
      const span = document.createElement("span");
      span.textContent = character === " " ? "\u00a0" : character;
      span.setAttribute("aria-hidden", "true");
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      line.appendChild(span);
      const animation = span.animate(
        [
          { opacity: 0, transform: "translateY(82%)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 1050,
          delay: 170 + characterIndex * 45,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both",
        },
      );
      animation.onfinish = () => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
        span.style.willChange = "auto";
        animation.cancel();
      };
      characterIndex++;
    }
  }

  const fadeUp = (element, delay, distance = 12) => {
    if (!element) return;
    const animation = element.animate(
      [
        { opacity: 0, transform: `translateY(${distance}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 900,
        delay,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "both",
      },
    );
    animation.onfinish = () => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
      animation.cancel();
    };
  };

  const photo = hero.querySelector(".hero-image");
  if (photo && typeof photo.animate === "function") {
    const photoAnimation = photo.animate(
      [
        { opacity: 0.18, filter: "brightness(.74)" },
        { opacity: 1, filter: "brightness(1)" },
      ],
      {
        duration: 1250,
        delay: 40,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "both",
      },
    );
    photoAnimation.onfinish = () => {
      photo.style.opacity = "1";
      photo.style.filter = "";
      photoAnimation.cancel();
    };
  }

  fadeUp(hero.querySelector(".hero-top"), 300, 8);
  fadeUp(hero.querySelector(".hero-role"), 1250, 14);
  [...hero.querySelectorAll(".hero-bottom > *")].forEach((element, index) =>
    fadeUp(element, 1500 + index * 120, 10),
  );
}

runSiteLoader().then((shown) => {
  if (!shown) animateHeroIntro();
});

// Turn the oversized hero identity into the centred navigation wordmark as the
// hero leaves the viewport. The handoff is fully reversible with scroll.
const homeHero = document.querySelector(".hero");
if (homeHero) {
  const heroTitle = homeHero.querySelector(".hero-title");
  const heroPhoto = homeHero.querySelector(".hero-image");
  const homeNav = document.querySelector(".home-nav");
  const identity = homeNav?.querySelector(".wordmark");
  const desktopHandoff = window.matchMedia("(min-width: 701px)");
  let scheduled = false;
  let titlePageCenter = 0;
  let dockScale = 0.095;

  const clamp01 = (value) => Math.min(1, Math.max(0, value));
  const smoothstep = (start, end, value) => {
    const t = clamp01((value - start) / (end - start));
    return t * t * (3 - 2 * t);
  };

  const ensureHandoffStyles = () => {
    if (!homeNav || document.getElementById("hero-nav-handoff-styles")) return;
    const style = document.createElement("style");
    style.id = "hero-nav-handoff-styles";
    style.textContent = `
@media (min-width:701px) and (prefers-reduced-motion:no-preference){
  .home-nav{position:fixed!important;top:0;left:0;right:0;width:100%;max-width:none;margin:0;height:74px;z-index:20;background:rgba(23,26,24,var(--home-nav-bg,0));border-bottom:1px solid rgba(58,63,57,var(--home-nav-line,0));padding-inline:0;}
  .home-nav .wordmark{position:absolute;left:50%;top:50%;z-index:2;margin:0;opacity:var(--home-nav-wordmark,0);transform:translate(-50%,-50%);transform-origin:50% 50%;transition:color .2s;}
  .home-nav nav{width:min(1264px,calc(100vw - (2 * var(--gutter))));height:74px;margin-inline:auto;display:grid;grid-template-columns:auto auto minmax(180px,1fr) auto auto;align-items:center;column-gap:clamp(24px,3vw,54px);}
  .home-nav nav a{height:74px;display:flex;align-items:center;opacity:var(--home-nav-links,0);will-change:transform,opacity;}
  .home-nav nav a:nth-child(1){grid-column:1;transform:translateX(calc(-1 * var(--home-nav-shift,24px)));}
  .home-nav nav a:nth-child(2){grid-column:2;transform:translateX(calc(-1 * var(--home-nav-shift,24px)));}
  .home-nav nav a:nth-child(3){grid-column:4;transform:translateX(var(--home-nav-shift,24px));}
  .home-nav nav a:nth-child(4){grid-column:5;transform:translateX(var(--home-nav-shift,24px));}
  .home-nav nav a:nth-child(5){display:none;}
}
`;
    document.head.appendChild(style);
  };

  const measureTitle = () => {
    if (!heroTitle) return;
    const previousTransform = heroTitle.style.transform;
    const previousOpacity = heroTitle.style.opacity;
    heroTitle.style.transform = "none";
    heroTitle.style.opacity = "1";
    const rect = heroTitle.getBoundingClientRect();
    titlePageCenter = rect.top + window.scrollY + rect.height / 2;
    const fontSize = parseFloat(getComputedStyle(heroTitle).fontSize);
    if (Number.isFinite(fontSize) && fontSize > 0) dockScale = 27 / fontSize;
    heroTitle.style.transform = previousTransform;
    heroTitle.style.opacity = previousOpacity;
  };

  const update = () => {
    scheduled = false;
    const heroHeight = Math.max(1, homeHero.offsetHeight);
    const ratio = clamp01(window.scrollY / heroHeight);

    heroPhoto.style.transform = reduced.matches
      ? ""
      : `translate3d(0,${ratio * 14}px,0) scale(1.025)`;

    if (
      desktopHandoff.matches &&
      !reduced.matches &&
      heroTitle &&
      homeNav &&
      identity
    ) {
      if (!titlePageCenter) measureTitle();

      const travel = smoothstep(0.08, 0.9, ratio);
      const navReveal = smoothstep(0.54, 0.8, ratio);
      const wordmarkReveal = smoothstep(0.75, 0.91, ratio);
      const barReveal = smoothstep(0.64, 0.89, ratio);
      const startViewportCenter = titlePageCenter;
      const targetViewportCenter = 37;
      const desiredCenter =
        startViewportCenter +
        (targetViewportCenter - startViewportCenter) * travel;
      const naturalCenter = titlePageCenter - window.scrollY;
      const translateY = desiredCenter - naturalCenter;
      const scale = 1 + (dockScale - 1) * travel;

      heroTitle.style.transformOrigin = "50% 50%";
      heroTitle.style.transform = `translate3d(0,${translateY}px,0) scale(${scale})`;
      heroTitle.style.opacity = "1";
      heroTitle.style.letterSpacing = `${-0.065 + 0.01 * travel}em`;

      homeNav.style.setProperty("--home-nav-bg", String(barReveal * 0.985));
      homeNav.style.setProperty("--home-nav-line", String(barReveal));
      homeNav.style.setProperty("--home-nav-links", String(navReveal));
      homeNav.style.setProperty(
        "--home-nav-shift",
        `${24 * (1 - navReveal)}px`,
      );
      homeNav.style.setProperty("--home-nav-wordmark", String(wordmarkReveal));
      homeNav.style.pointerEvents = navReveal > 0.35 ? "auto" : "none";
    } else {
      heroTitle.style.transform = reduced.matches
        ? ""
        : `translateX(${-ratio * 7}vw) scale(${1 - ratio * 0.2})`;
      heroTitle.style.opacity = reduced.matches ? "" : String(1 - ratio * 0.8);
      heroTitle.style.letterSpacing = "";
      if (homeNav) {
        homeNav.style.pointerEvents = "";
        for (const property of [
          "--home-nav-bg",
          "--home-nav-line",
          "--home-nav-links",
          "--home-nav-shift",
          "--home-nav-wordmark",
        ])
          homeNav.style.removeProperty(property);
      }
      if (identity)
        identity.style.opacity = reduced.matches
          ? ""
          : String(Math.max(0, Math.min(1, (ratio - 0.45) * 2)));
    }
  };

  ensureHandoffStyles();
  measureTitle();

  window.addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", () => {
    titlePageCenter = 0;
    update();
  });
  reduced.addEventListener("change", update);
  desktopHandoff.addEventListener("change", () => {
    titlePageCenter = 0;
    update();
  });
  update();

  if (!reduced.matches && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(
      ".home-section > h2,.about-grid > *, .experience-list .job,.home-projects .project-card,.home-photos .media,.contact h2",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );

    document.documentElement.classList.add("motion-ready");
    targets.forEach((el) => {
      el.classList.add("home-reveal");
      observer.observe(el);
    });

    reduced.addEventListener("change", () => {
      if (reduced.matches) {
        targets.forEach((el) => el.classList.add("visible"));
        observer.disconnect();
      }
    });
  }
}

// Animate native details while retaining keyboard and no-JavaScript operation.
for (const detail of document.querySelectorAll(".job")) {
  const summary = detail.querySelector("summary");
  let animation = null;
  let expanding = false;

  summary.addEventListener("click", (event) => {
    if (reduced.matches || !detail.animate) return;
    event.preventDefault();

    const from = detail.getBoundingClientRect().height;
    const open = animation ? !expanding : !detail.open;
    animation?.cancel();
    detail.style.height = "";
    detail.style.overflow = "hidden";
    detail.open = true;

    const to = open
      ? detail.getBoundingClientRect().height
      : summary.getBoundingClientRect().height + 2;
    expanding = open;
    animation = detail.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration: 450, easing: "cubic-bezier(.22,1,.36,1)" },
    );
    animation.onfinish = () => {
      detail.open = open;
      detail.style.overflow = "";
      animation = null;
    };
  });
}
