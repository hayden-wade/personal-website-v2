/* Dual image layers move vertically in opposite directions, inspired by Codrops DoubleSlideshow (MIT). */
(function installDoubleSlideshow(){
  const sliders = document.querySelectorAll("[data-double-slideshow]");
  if (!sliders.length) return;

  sliders.forEach((root) => {
    const stage = root.querySelector("[data-ds-stage]");
    const backgrounds = Array.from(root.querySelectorAll(".ds-layer--bg .ds-frame"));
    const foregrounds = Array.from(root.querySelectorAll(".ds-layer--fg .ds-frame"));
    const titles = Array.from(root.querySelectorAll("[data-ds-title]"));
    const counter = root.querySelector("[data-ds-counter]");
    const category = root.querySelector("[data-ds-category]");
    const description = root.querySelector("[data-ds-description]");
    const link = root.querySelector("[data-ds-link]");
    const live = root.querySelector("[data-ds-live]");
    const markers = Array.from(root.querySelectorAll(".ds-progress i"));
    const previous = root.querySelector("[data-ds-prev]");
    const next = root.querySelector("[data-ds-next]");
    if (!stage || !backgrounds.length || backgrounds.length !== foregrounds.length || titles.length !== backgrounds.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const slides = backgrounds.length;
    const projects = titles.map((title) => title.textContent.trim());
    let active = 0;
    let busy = false;
    let startedAt = null;
    let mouseStart = null;
    let lastWheel = 0;
    const section = root.closest("#projects");
    if (section) section.style.setProperty("--ds-project-count", String(slides));
    let scrollFrame = 0;
    let desiredIndex = 0;
    let runningAnimations = [];
    let animationToken = 0;
    let chapterTop = 0;
    let chapterTravel = 1;
    const duration = 820;
    const ease = "cubic-bezier(.76,0,.24,1)";

    const preload = (index) => {
      const i = (index + slides) % slides;
      [backgrounds[i], foregrounds[i]].forEach((frame) => {
        const image = frame.querySelector("img");
        if (!image) return;
        image.loading = "eager";
        if (image.decode) image.decode().catch(() => {});
      });
    };

    const updateDetails = (index) => {
      const entry = backgrounds[index];
      if (!entry) return;
      const project = entry.dataset;
      counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides).padStart(2, "0")}`;
      category.textContent = project.category || "";
      description.textContent = project.description || "";
      link.href = project.url || "/projects/";
      link.firstChild.textContent = project.url ? "Explore project " : "All projects ";
      markers.forEach((marker, i) => marker.classList.toggle("is-current", i === index));
      live.textContent = `Project ${index + 1} of ${slides}: ${projects[index]}`;
    };

    const clearAll = (index) => {
      [backgrounds, foregrounds, titles].forEach((group) => group.forEach((item, i) => {
        item.classList.remove("is-current", "is-entering", "is-leaving");
        if (i === index) item.classList.add("is-current");
        item.style.removeProperty("transform");
        item.style.removeProperty("opacity");
        item.style.removeProperty("visibility");
        const inner = item.querySelector(".ds-frame-inner");
        if (inner) inner.style.removeProperty("transform");
      }));
      active = index;
      updateDetails(index);
      root.classList.remove("ds-transitioning");
      preload(index + 1);
      busy = false;
    };

    function transitionLayer(group, index, upcoming, direction, reversed) {
      const from = group[index];
      const to = group[upcoming];
      const fromInner = from.querySelector(".ds-frame-inner");
      const toInner = to.querySelector(".ds-frame-inner");
      from.classList.add("is-leaving");
      to.classList.add("is-entering");

      const exitY = reversed ? direction * 100 : -direction * 100;
      const enterY = -exitY;
      const innerShift = reversed ? direction * 24 : -direction * 24;
      const common = { duration, easing: ease, fill: "both" };
      const jobs = [
        from.animate([
          { transform: "translate3d(0,0,0)" },
          { transform: `translate3d(0,${exitY}%,0)` }
        ], common),
        to.animate([
          { transform: `translate3d(0,${enterY}%,0)` },
          { transform: "translate3d(0,0,0)" }
        ], common)
      ];
      if (fromInner && toInner) {
        jobs.push(fromInner.animate([
          { transform: "translate3d(0,0,0) scale(1) rotate(0deg)" },
          { transform: `translate3d(0,${-innerShift}%,0) scale(1.45) rotate(${direction * (reversed ? 10 : -10)}deg)` }
        ], common));
        jobs.push(toInner.animate([
          { transform: `translate3d(0,${innerShift}%,0) scale(1.45) rotate(${direction * (reversed ? -10 : 10)}deg)` },
          { transform: "translate3d(0,0,0) scale(1) rotate(0deg)" }
        ], common));
      }
      return jobs;
    }

    const go = (direction, targetIndex = null) => {
      if (!direction && targetIndex === null) return;
      const upcoming = targetIndex === null
        ? (active + direction + slides) % slides
        : Math.max(0, Math.min(slides - 1, targetIndex));
      // Scroll position is the source of truth. A fast swipe can jump several
      // chapters; cancel the old transition and animate directly to the new one.
      if (busy) {
        animationToken++;
        runningAnimations.forEach((job) => job.cancel());
        runningAnimations = [];
        clearAll(active);
      }
      if (upcoming === active) return;
      busy = true;
      const token = ++animationToken;
      root.classList.add("ds-transitioning");
      preload(upcoming);
      const currentTitle = titles[active];
      const upcomingTitle = titles[upcoming];

      if (reduced.matches || typeof currentTitle.animate !== "function") {
        clearAll(upcoming);
        return;
      }
      const jobs = [
        ...transitionLayer(backgrounds, active, upcoming, direction, false),
        ...transitionLayer(foregrounds, active, upcoming, direction, true)
      ];

      currentTitle.classList.add("is-leaving");
      upcomingTitle.classList.add("is-entering");
      jobs.push(currentTitle.animate([
        { opacity:1,transform:"translate3d(0,0,0) rotate(0deg)" },
        { opacity:0,transform:`translate3d(0,${-direction * 52}px,0) rotate(${-direction * 5}deg)` }
      ], {duration:duration * .88,easing:ease,fill:"both"}));
      jobs.push(upcomingTitle.animate([
        { opacity:0,transform:`translate3d(0,${direction * 64}px,0) rotate(${direction * 5}deg)` },
        { opacity:1,transform:"translate3d(0,0,0) rotate(0deg)" }
      ], {duration:duration,easing,fill:"both"}));

      runningAnimations = jobs;
      Promise.allSettled(jobs.map((job) => job.finished))
        .then(() => {
          if (token !== animationToken) return;
          runningAnimations = [];
          // CSS state is established before cancelling fill animations.
          clearAll(upcoming);
          jobs.forEach((job) => job.cancel());
        })
        .catch(() => {
          if (token !== animationToken) return;
          runningAnimations = [];
          clearAll(upcoming);
          jobs.forEach((job) => job.cancel());
        });
    };

    // Native vertical page scrolling drives both desktop and mobile chapters.
    // Each project occupies one viewport of scroll travel; no wheel hijacking.
    const measureChapter = () => {
      if (!section) return;
      // offsetTop can be relative to a transformed ancestor. Capture the
      // document-space start using scrollY while the element is in flow.
      const wasFixed = section.classList.contains("ds-is-active");
      if (wasFixed) section.classList.remove("ds-is-active");
      chapterTop = section.getBoundingClientRect().top + window.scrollY;
      chapterTravel = Math.max(1, section.offsetHeight - stage.offsetHeight);
      if (wasFixed) section.classList.add("ds-is-active");
    };
    const desktopScroll = window.matchMedia("(min-width: 701px)");
    let desktopShown = -1;

    // Desktop: one deterministic scene controlled by page scroll progress.
    // Never restart/cancel overlapping Web Animations while the scroll wheel
    // crosses slide boundaries; that caused the visible snapping and flicker.
    // Mobile retains its existing discrete transitions and viewport handling.
    const renderDesktop = (progress) => {
      const page = Math.max(0, Math.min(slides - 1, progress * (slides - 1)));
      const from = Math.min(slides - 2, Math.floor(page));
      const fraction = Math.max(0, Math.min(1, page - from));
      const linear = Math.max(0, Math.min(1, (fraction - .18) / .64));
      const eased = reduced.matches ? (fraction >= .5 ? 1 : 0)
        : linear * linear * (3 - 2 * linear);
      const to = from + 1;
      const moving = eased > 0 && eased < 1;

      const paintLayer = (frames, reverse) => {
        frames.forEach((frame, index) => {
          const leaving = moving && index === from;
          const entering = moving && index === to;
          const current = !moving && index === (eased === 1 ? to : from);
          const shown = leaving || entering || current;
          frame.classList.toggle("is-current", current);
          frame.classList.toggle("is-leaving", leaving);
          frame.classList.toggle("is-entering", entering);
          if (!shown) {
            frame.style.removeProperty("transform");
            frame.querySelector(".ds-frame-inner")?.style.removeProperty("transform");
            return;
          }

          const y = moving
            ? (index === from ? (reverse ? 100 : -100) * eased
              : (reverse ? -100 : 100) * (1 - eased))
            : 0;
          // Small inner counter-motion, not a second asynchronous animation.
          const depth = moving
            ? (index === from ? eased : 1 - eased)
            : 0;
          const parallax = (reverse ? -8 : 8) * (index === from ? depth : -depth);
          frame.style.transform = `translate3d(0,${y.toFixed(3)}%,0)`;
          const inner = frame.querySelector(".ds-frame-inner");
          if (inner) inner.style.transform =
            `translate3d(0,${parallax.toFixed(3)}%,0) scale(${(1 + depth * .075).toFixed(4)})`;
        });
      };

      paintLayer(backgrounds, false);
      paintLayer(foregrounds, true);
      titles.forEach((title, index) => {
        const visible = index === from || index === to;
        const opacity = index === from ? 1 - eased : index === to ? eased : 0;
        title.classList.toggle("is-current", visible && opacity > 0);
        title.classList.remove("is-entering", "is-leaving");
        title.style.opacity = visible ? String(opacity) : "";
        title.style.transform = visible
          ? `translate3d(0,${(index === from ? -46 * eased : 46 * (1 - eased)).toFixed(2)}px,0)`
          : "";
      });

      const shownIndex = eased < .5 ? from : to;
      if (shownIndex !== desktopShown) {
        desktopShown = shownIndex;
        active = shownIndex;
        updateDetails(shownIndex);
        preload(shownIndex + 1);
      }
    };

    const indexFromScroll = () => {
      if (!section) return;
      const position = window.scrollY - chapterTop;
      const activeChapter = position >= 0 && position < chapterTravel;
      section.classList.toggle("ds-is-active", activeChapter);
      section.classList.toggle("ds-is-past", position >= chapterTravel);
      const progress = Math.max(0, Math.min(1, position / chapterTravel));

      if (desktopScroll.matches) {
        renderDesktop(progress);
        return;
      }

      // Mobile keeps its scroll-triggered discrete slide choreography.
      const index = Math.min(slides - 1, Math.max(0, Math.round(progress * (slides - 1))));
      if (index !== desiredIndex) {
        desiredIndex = index;
        if (desiredIndex !== active) go(desiredIndex > active ? 1 : -1, desiredIndex);
      }
    };
    const scheduleScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        indexFromScroll();
      });
    };
    const scrollToIndex = (index) => {
      if (!section) return false;
      const target = Math.max(0, Math.min(slides - 1, index));
      const top = chapterTop;
      const travel = chapterTravel;
      window.scrollTo({
        top: top + travel * (target / (slides - 1)),
        behavior: reduced.matches ? "instant" : "smooth"
      });
      return true;
    };
    window.addEventListener("scroll", scheduleScroll, { passive:true });
    let lastWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      // Ignore Safari browser chrome changing the viewport height mid-scroll.
      if (Math.abs(window.innerWidth - lastWidth) < 2) return;
      lastWidth = window.innerWidth;
      measureChapter();
      scheduleScroll();
    });
    desktopScroll.addEventListener("change", () => {
      // Clear inline desktop scrub styles before restoring mobile animation.
      animationToken++;
      runningAnimations.forEach((job) => job.cancel());
      runningAnimations = [];
      clearAll(active);
      desktopShown = -1;
      measureChapter();
      scheduleScroll();
    });
    // Encode metadata in the background frames; keeps authoring to one project list.
    // Any route with no dedicated page points to the general projects archive.
    previous.addEventListener("click", () => { if (!scrollToIndex(active - 1)) go(-1); });
    next.addEventListener("click", () => { if (!scrollToIndex(active + 1)) go(1); });
    stage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); if (!scrollToIndex(active + 1)) go(1); }
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); if (!scrollToIndex(active - 1)) go(-1); }
    });
    stage.addEventListener("touchstart", (event) => {
      if (event.touches.length !== 1 || event.target.closest("button,a")) {
        startedAt = null;
        return;
      }
      startedAt = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive:true });
    stage.addEventListener("touchend", (event) => {
      if (!startedAt || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - startedAt.x;
      const dy = event.changedTouches[0].clientY - startedAt.y;
      startedAt = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) {
        const delta = dx < 0 ? 1 : -1;
        if (!scrollToIndex(active + delta)) go(delta);
      }
    }, { passive:true });
    stage.addEventListener("touchcancel", () => { startedAt = null; }, { passive:true });

    stage.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0 || event.target.closest("button,a")) return;
      mouseStart = {x:event.clientX,y:event.clientY};
    });
    stage.addEventListener("pointerup", (event) => {
      if (!mouseStart) return;
      const dx = event.clientX - mouseStart.x;
      const dy = event.clientY - mouseStart.y;
      mouseStart = null;
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        const delta = dx < 0 ? 1 : -1;
        if (!scrollToIndex(active + delta)) go(delta);
      }
    });
    stage.addEventListener("pointercancel", () => { mouseStart = null; });
    stage.addEventListener("wheel", (event) => {
      // Only horizontal trackpad motion changes slides; vertical wheel scrolls the page.
      if (Math.abs(event.deltaX) < 28 || Math.abs(event.deltaX) < Math.abs(event.deltaY) * 1.4) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheel < 1200) return;
      lastWheel = now;
      const delta = event.deltaX > 0 ? 1 : -1;
      if (!scrollToIndex(active + delta)) go(delta);
    }, { passive:false });

    preload(0);
    preload(1);
    preload(slides - 1);
    updateDetails(0);
    measureChapter();
    scheduleScroll();
  });
})();
