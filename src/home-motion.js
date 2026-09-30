// Original loader motion, rethemed for the V2 dark palette.
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

function createLoaderStyles() {
  if (document.getElementById("site-loader-styles")) return;
  const style = document.createElement("style");
  style.id = "site-loader-styles";
  style.textContent = `
.site-loader{position:fixed;inset:0;z-index:9999;color:var(--text,#e5e0d6);font-family:'DM Sans',Arial,Helvetica,sans-serif;pointer-events:all;overflow:hidden;background:transparent}
.site-loader__panel{position:absolute;left:0;right:0;height:calc(50% + 1px);background:#0b0e0c;z-index:0;transition:transform 900ms cubic-bezier(.76,0,.24,1);will-change:transform}
.site-loader__panel--top{top:0}.site-loader__panel--bottom{bottom:0}
.site-loader__ui{position:relative;z-index:1;width:100%;height:100%;transition:opacity 420ms cubic-bezier(.4,0,.2,1),transform 650ms cubic-bezier(.16,1,.3,1);opacity:0;background:radial-gradient(circle at 50% 48%,rgba(192,107,73,.08),transparent 28%),linear-gradient(180deg,rgba(255,255,255,.018),transparent 32%,rgba(0,0,0,.12))}
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
.site-loader__track:after{content:'';position:absolute;top:-1px;left:0;width:38px;height:3px;background:var(--accent,#c06b49);box-shadow:0 0 22px rgba(192,107,73,.28);opacity:0;transform:translateX(-42px)}
.site-loader--complete .site-loader__track:after{animation:site-loader-pulse 520ms cubic-bezier(.65,0,.35,1) forwards}
.site-loader__status{display:flex;align-items:center;justify-content:space-between;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted,#a7aaa3)}
.site-loader__count{font-variant-numeric:tabular-nums;color:var(--text,#e5e0d6)}
.site-loader--exit{pointer-events:none}
.site-loader--exit .site-loader__panel--top{transform:translateY(-101%)}
.site-loader--exit .site-loader__panel--bottom{transform:translateY(101%)}
.site-loader--exit .site-loader__ui{opacity:0;transform:scale(.992)}
@keyframes site-loader-pulse{0%{opacity:0;transform:translateX(-42px)}18%{opacity:1}82%{opacity:1}100%{opacity:0;transform:translateX(calc(min(620px,72vw) - 2px))}}
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
  loader.innerHTML = `<div class="site-loader__panel site-loader__panel--top"></div><div class="site-loader__panel site-loader__panel--bottom"></div><div class="site-loader__ui"><div class="site-loader__meta site-loader__meta--top"><span>Hayden Wade</span><span>Brisbane / AU</span></div><div class="site-loader__center"><div class="site-loader__name"><span class="site-loader__line" data-loader-line="Hayden"></span><span class="site-loader__line" data-loader-line="Wade"></span></div><div class="site-loader__track"><span class="site-loader__fill"></span></div><div class="site-loader__status"><span>Initialising</span><span class="site-loader__count">00</span></div></div><div class="site-loader__meta site-loader__meta--bottom"><span>Cybersecurity · Engineering · Old cars</span><span>Portfolio / 2026</span></div></div>`;
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
        loader.classList.add("site-loader--complete");
        window.setTimeout(() => {
          // Stage and start the hero while it is still covered so the two
          // sequences overlap rather than exposing a static hero for a frame.
          animateHeroIntro();
          requestAnimationFrame(() => loader.classList.add("site-loader--exit"));
          window.setTimeout(() => {
            document.body.style.overflow = previousOverflow;
          }, 760);
          window.setTimeout(() => {
            loader.remove();
            resolve(true);
          }, 980);
        }, 260);
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

// Keep native scrolling; restore the original title drift and gentle image parallax.
const homeHero = document.querySelector(".hero");
if (homeHero) {
  const heroTitle = homeHero.querySelector(".hero-title");
  const heroPhoto = homeHero.querySelector(".hero-image");
  const identity = document.querySelector(".home-nav .wordmark");
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const ratio = Math.min(
      1,
      Math.max(0, window.scrollY / homeHero.offsetHeight),
    );
    heroTitle.style.transform = reduced.matches
      ? ""
      : `translateX(${-ratio * 7}vw) scale(${1 - ratio * 0.2})`;
    heroTitle.style.opacity = reduced.matches ? "" : String(1 - ratio * 0.8);
    heroPhoto.style.transform = reduced.matches
      ? ""
      : `translate3d(0,${ratio * 14}px,0) scale(1.025)`;
    if (identity)
      identity.style.opacity = reduced.matches
        ? ""
        : String(Math.max(0, Math.min(1, (ratio - 0.45) * 2)));
  };
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
  window.addEventListener("resize", update);
  reduced.addEventListener("change", update);
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