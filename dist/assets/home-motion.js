// Dark portfolio loader with a liquid-fill wordmark and louvre handoff into the hero.
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

function createLoaderStyles() {
  if (document.getElementById("site-loader-styles")) return;
  const style = document.createElement("style");
  style.id = "site-loader-styles";
  style.textContent = `
.site-loader{position:fixed;inset:0;z-index:9999;color:var(--text,#e5e0d6);font-family:'DM Sans',Arial,Helvetica,sans-serif;pointer-events:all;overflow:hidden;background:#0f1210}
.site-loader__louvres{position:absolute;inset:0;z-index:0;display:grid;grid-template-rows:repeat(40,minmax(0,1fr));overflow:hidden}
.site-loader__louvre{display:block;width:100%;height:100%;background:#0f1210;transform:scaleY(1.08);transform-origin:50% 50%;will-change:transform;transition:transform 1120ms cubic-bezier(.76,0,.24,1);transition-delay:var(--louvre-delay,0ms)}
.site-loader__ui{position:relative;z-index:1;width:100%;height:100%;transition:opacity 300ms cubic-bezier(.4,0,.2,1),transform 420ms cubic-bezier(.16,1,.3,1);opacity:0;background:radial-gradient(circle at 50% 47%,rgba(192,107,73,.075),transparent 30%),linear-gradient(180deg,rgba(255,255,255,.016),transparent 35%,rgba(0,0,0,.12))}
.site-loader--active .site-loader__ui{opacity:1}
.site-loader__meta{position:absolute;left:clamp(24px,4.4vw,88px);right:clamp(24px,4.4vw,88px);display:flex;justify-content:space-between;gap:24px;font-size:11px;line-height:1.4;letter-spacing:.13em;text-transform:uppercase;color:var(--muted,#a7aaa3)}
.site-loader__meta--top{top:28px}.site-loader__meta--bottom{bottom:27px}
.site-loader__center{position:absolute;left:50%;top:50%;width:min(760px,84vw);transform:translate(-50%,-50%);text-align:center}
.site-loader__wordmark{display:block;width:100%;height:auto;overflow:visible;opacity:0;transform:translateY(9px) scale(.992);filter:drop-shadow(0 18px 54px rgba(0,0,0,.28));transition:opacity 650ms cubic-bezier(.16,1,.3,1),transform 900ms cubic-bezier(.16,1,.3,1)}
.site-loader--active .site-loader__wordmark{opacity:1;transform:translateY(0) scale(1)}
.site-loader__outline{fill:rgba(229,224,214,.012);stroke:rgba(167,170,163,.46);stroke-width:1.05;vector-effect:non-scaling-stroke;transition:stroke 400ms ease}
.site-loader--complete .site-loader__outline{stroke:rgba(229,224,214,.28)}
.site-loader__status{width:min(640px,84%);margin:20px auto 0;display:flex;align-items:center;justify-content:space-between;padding-top:13px;border-top:1px solid var(--line,#3a3f39);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted,#a7aaa3)}
.site-loader__count{font-variant-numeric:tabular-nums;color:var(--accent,#c06b49);transition:color 260ms ease}
.site-loader--complete .site-loader__count{color:var(--text,#e5e0d6)}
.site-loader--exit{pointer-events:none;background:transparent}
.site-loader--exit .site-loader__louvre{transform:scaleY(0)}
.site-loader--exit .site-loader__ui{animation:site-loader-ui-release 1120ms cubic-bezier(.4,0,.2,1) both}
@keyframes site-loader-ui-release{0%,52%{opacity:1;transform:scale(1)}88%,100%{opacity:0;transform:scale(.994)}}
@media(max-width:700px){.site-loader__center{width:88vw}.site-loader__meta{font-size:9px;letter-spacing:.11em}.site-loader__meta--top{top:22px}.site-loader__meta--bottom{bottom:22px}.site-loader__meta--bottom span:first-child{max-width:190px}.site-loader__status{width:82%;margin-top:14px;padding-top:11px}.site-loader__outline{stroke-width:.85}}
@media(prefers-reduced-motion:reduce){.site-loader{display:none!important}}
`;
  document.head.appendChild(style);
}

function shouldShowSiteLoader() {
  // The early head script decides whether the intro is needed before first paint.
  // Reusing that decision prevents restored scroll/referrer state from exposing the hero.
  return !!document.querySelector(".hero") &&
    document.documentElement.classList.contains("site-loader-pending") &&
    !reduced.matches;
}

function liquidWordmarkMarkup() {
  const waveUses = [-160, 0, 160, 320, 480, 640, 800]
    .map((x) => `<use href="#loader-wave-segment" x="${x}"/>`)
    .join("");
  const mainWaveUses = [-160, 0, 160, 320, 480, 640, 800]
    .map((x) => `<use href="#loader-wave-main" x="${x}"/>`)
    .join("");

  return `<svg class="site-loader__wordmark" viewBox="0 0 760 280" role="presentation" focusable="false">
    <defs>
      <mask id="site-loader-text-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="760" height="280">
        <rect width="760" height="280" fill="black"/>
        <text x="380" y="116" text-anchor="middle" fill="white" font-family="Instrument Serif, Georgia, serif" font-size="112" font-weight="400" letter-spacing="-5">Hayden</text>
        <text x="378" y="224" text-anchor="middle" fill="white" font-family="Instrument Serif, Georgia, serif" font-size="112" font-weight="400" font-style="italic" letter-spacing="-5">Wade</text>
      </mask>
      <path id="loader-wave-segment" d="M0 25 Q40 5 80 25 T160 25 V330 H0 Z" fill="#c06b49"/>
      <path id="loader-wave-main" d="M0 31 Q40 11 80 31 T160 31 V330 H0 Z" fill="#e5e0d6"/>
    </defs>

    <text class="site-loader__outline" x="380" y="116" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-size="112" font-weight="400" letter-spacing="-5">Hayden</text>
    <text class="site-loader__outline" x="378" y="224" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-size="112" font-weight="400" font-style="italic" letter-spacing="-5">Wade</text>

    <g mask="url(#site-loader-text-mask)">
      <g class="site-loader__liquid" data-loader-liquid transform="translate(0 286)">
        <g opacity=".92">${waveUses}<animateTransform attributeName="transform" type="translate" from="-160 0" to="0 0" dur="3.2s" repeatCount="indefinite"/></g>
        <g>${mainWaveUses}<animateTransform attributeName="transform" type="translate" from="0 0" to="-160 0" dur="2.45s" repeatCount="indefinite"/></g>
      </g>
    </g>
  </svg>`;
}

function runSiteLoader() {
  const root = document.documentElement;
  if (!shouldShowSiteLoader()) {
    root.classList.remove("site-loader-pending");
    return Promise.resolve(false);
  }
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

  loader.innerHTML = `<div class="site-loader__louvres">${louvres}</div><div class="site-loader__ui"><div class="site-loader__center">${liquidWordmarkMarkup()}<div class="site-loader__status"><span>Initialising</span><span class="site-loader__count">00</span></div></div></div>`;
  document.body.prepend(loader);
  root.classList.remove("site-loader-pending");

  const liquid = loader.querySelector("[data-loader-liquid]");
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
  const minimum = 1900;
  const maximum = 3800;
  let displayed = 0;

  const setLiquidLevel = (percent) => {
    const y = 286 - (percent / 100) * 320;
    liquid?.setAttribute("transform", `translate(0 ${y.toFixed(2)})`);
  };

  return new Promise((resolve) => {
    const tick = (now) => {
      const elapsed = now - start;
      const timeTarget = Math.min(92, (elapsed / 1560) * 92);
      const target =
        (assetsReady && elapsed >= minimum) || elapsed >= maximum
          ? 100
          : timeTarget;

      displayed += Math.max(0.12, (target - displayed) * 0.12);
      displayed = Math.min(target, displayed);
      const rounded = Math.min(100, Math.floor(displayed));
      setLiquidLevel(displayed);
      count.textContent = String(rounded).padStart(2, "0");

      if (target === 100 && displayed >= 99.35) {
        displayed = 100;
        setLiquidLevel(100);
        count.textContent = "100";
        loader.classList.add("site-loader--complete");

        window.setTimeout(() => {
          // Start the hero while the completed liquid wordmark is still visible,
          // then open the same dark surface into the existing horizontal louvres.
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
        }, 180);
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
      ".home-section > h2,.about-grid > *, .experience-list .job,.home-projects .project-card,.home-photos .media,.photo-outro-meta,.photo-outro-cta,.photo-outro-foot,.contact h2",
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

function setupCinematicAbout() {
  const section = document.querySelector("[data-about-cinematic]");
  if (
    !section ||
    window.matchMedia("(max-width: 700px)").matches ||
    typeof window.gsap === "undefined" ||
    typeof window.ScrollTrigger === "undefined"
  )
    return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const stage = section.querySelector(".about-cinema-stage");
  const headline = section.querySelector(".about-cinema-headline");
  const titleLines = gsap.utils.toArray(
    section.querySelectorAll("[data-about-title-line]"),
  );
  const portrait = section.querySelector("[data-about-portrait]");
  const image = section.querySelector(".about-cinema-image");
  const copy = section.querySelector("[data-about-copy]");
  const strip = section.querySelector("[data-about-strip]");
  const interests = gsap.utils.toArray(
    section.querySelectorAll("[data-about-interest]"),
  );

  if (!stage || !headline || !titleLines.length || !portrait || !image) return;

  const mm = gsap.matchMedia();
  mm.add(
    "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.set(titleLines, { yPercent: 112, autoAlpha: 0 });
      gsap.set(portrait, {
        clipPath: "inset(18% 36% 22% 36%)",
        xPercent: 8,
      });
      gsap.set(image, { scale: 1.18, xPercent: -2.5, yPercent: 2 });
      gsap.set(copy, { y: 36, autoAlpha: 0 });
      gsap.set(strip, { y: 16, autoAlpha: 0 });

      const setInterest = (index) => {
        interests.forEach((item, itemIndex) =>
          item.classList.toggle("is-active", itemIndex === index),
        );
      };
      setInterest(0);

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "about-cinematic-scene",
          trigger: stage,
          start: "top top+=74",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(
          titleLines,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.2,
            stagger: 0.035,
            ease: "power3.out",
          },
          0,
        )
        .to(
          portrait,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            xPercent: 0,
            duration: 0.52,
            ease: "power2.inOut",
          },
          0.12,
        )
        .to(
          image,
          {
            scale: 1.04,
            xPercent: 0,
            yPercent: -1.5,
            duration: 0.62,
            ease: "power1.inOut",
          },
          0.1,
        )
        .to(
          headline,
          {
            xPercent: -3,
            yPercent: -2,
            duration: 0.55,
            ease: "power1.inOut",
          },
          0.24,
        )
        .to(
          copy,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.22,
            ease: "power2.out",
          },
          0.52,
        )
        .to(
          strip,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.18,
            ease: "power2.out",
          },
          0.68,
        )
        .to(
          image,
          {
            scale: 1,
            yPercent: -3,
            duration: 0.25,
            ease: "power1.inOut",
          },
          0.75,
        );

      timeline.eventCallback("onUpdate", () => {
        const progress = timeline.progress();
        const index =
          progress < 0.43 ? 0 : progress < 0.61 ? 1 : progress < 0.79 ? 2 : 3;
        setInterest(index);
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        interests.forEach((item) => item.classList.remove("is-active"));
      };
    },
  );

  requestAnimationFrame(() => ScrollTrigger.refresh());
}
setupCinematicAbout();

