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
        // Codrops' original slideshow locks navigation until the current
        // transition completes. Desktop must never cancel an in-flight scene.
        if (desktopScroll.matches) return false;
        // Preserve mobile's existing fast-scroll recovery behaviour.
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
    let desktopProgrammaticScroll = false;
    let desktopWheelAccum = 0;
    let desktopLastWheel = -Infinity;
    let desktopGestureConsumed = false;
    let desktopLastNavigation = -Infinity;
    const desktopWheelThreshold = 28;
    const desktopGestureIdle = 230;

    // Match the original Codrops DoubleSlideshow: one input causes one
    // full-duration, eased slide animation. Never seek the animation by
    // scroll progress (which leaves scenes halfway between projects).
    // Unlike the fullscreen Codrops demo, this page has sections before and
    // after the slideshow, so the first/last inputs release page scrolling.
    const desktopStep = () => chapterTravel / slides;
    const desktopPosition = (index) => chapterTop + desktopStep() * index;

    const navigateDesktop = (direction) => {
      if (!section || !desktopScroll.matches || busy || !direction) return false;
      const target = active + Math.sign(direction);
      desktopLastNavigation = performance.now();

      if (target < 0) {
        // Back to the previous page section on the next upward gesture.
        window.scrollTo({
          top: Math.max(0, chapterTop - Math.max(120, window.innerHeight * .65)),
          behavior: "instant"
        });
        return true;
      }
      if (target >= slides) {
        // Release to Photography instead of wrapping to project number one.
        window.scrollTo({top: chapterTop + chapterTravel + 2, behavior:"instant"});
        return true;
      }

      desktopProgrammaticScroll = true;
      go(Math.sign(direction), target);
      window.scrollTo({top: desktopPosition(target), behavior:"instant"});
      // Let the scroll event update the pin class, but not the slide state:
      // 'go' commits the scene only when every layer finishes animating.
      requestAnimationFrame(() => {
        desktopProgrammaticScroll = false;
      });
      return true;
    };

    const onDesktopWheel = (event) => {
      if (!desktopScroll.matches || !section || event.ctrlKey) return;
      const localY = window.scrollY - chapterTop;
      if (localY < -2 || localY >= chapterTravel - 1) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const dx = event.deltaX * unit;
      const dy = event.deltaY * unit;
      // Vertical wheel and trackpad gestures are equivalent, but don't
      // respond to browser pinch-zoom gestures (Ctrl+wheel).
      const delta = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
      if (!Number.isFinite(delta) || delta === 0) return;
      event.preventDefault();

      const now = performance.now();
      if (now - desktopLastWheel > desktopGestureIdle) {
        desktopWheelAccum = 0;
        desktopGestureConsumed = false;
      }
      desktopLastWheel = now;
      if (busy || desktopGestureConsumed || now - desktopLastNavigation < duration + 150) return;
      desktopWheelAccum += delta;
      if (Math.abs(desktopWheelAccum) < desktopWheelThreshold) return;
      desktopGestureConsumed = true;
      const direction = Math.sign(desktopWheelAccum);
      desktopWheelAccum = 0;
      navigateDesktop(direction);
    };

    // Passive scroll listeners cannot reliably prevent the natural scroll.
    // This non-passive, section-gated listener absorbs wheel inertia ONLY
    // inside the slideshow; elsewhere the page keeps normal scrolling.
    window.addEventListener("wheel", onDesktopWheel, {passive:false});

    const indexFromScroll = () => {
      if (!section) return;
      const position = window.scrollY - chapterTop;
      const activeChapter = position >= 0 && position < chapterTravel;
      section.classList.toggle("ds-is-active", activeChapter);
      section.classList.toggle("ds-is-past", position >= chapterTravel);
      const progress = Math.max(0, Math.min(1, position / chapterTravel));

      if (desktopScroll.matches) {
        // Scrollbar dragging, browser restoration and in-page links should
        // always show a *complete* scene, never a half-transition.
        if (!busy && !desktopProgrammaticScroll) {
          const nearest = Math.min(slides - 1,
            Math.max(0, Math.round(position / desktopStep())));
          if (nearest !== active) clearAll(nearest);
        }
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
      if (desktopScroll.matches) return navigateDesktop(index - active);
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
      desktopProgrammaticScroll = false;
      desktopGestureConsumed = false;
      desktopWheelAccum = 0;
      desktopLastNavigation = -Infinity;
      measureChapter();
      scheduleScroll();
    });
    // Encode metadata in the background frames; keeps authoring to one project list.
    // Any route with no dedicated page points to the general projects archive.
    previous.addEventListener("click", () => { if (!scrollToIndex(active - 1) && !desktopScroll.matches) go(-1); });
    next.addEventListener("click", () => { if (!scrollToIndex(active + 1) && !desktopScroll.matches) go(1); });
    stage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); if (!scrollToIndex(active + 1) && !desktopScroll.matches) go(1); }
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); if (!scrollToIndex(active - 1) && !desktopScroll.matches) go(-1); }
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
        if (!scrollToIndex(active + delta) && !desktopScroll.matches) go(delta);
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
        if (!scrollToIndex(active + delta) && !desktopScroll.matches) go(delta);
      }
    });
    stage.addEventListener("pointercancel", () => { mouseStart = null; });
    stage.addEventListener("wheel", (event) => {
      // Desktop uses the section-gated global wheel input; prevent
      // duplicate navigation from the stage's horizontal handler.
      if (desktopScroll.matches) return;
      // Only horizontal trackpad motion changes slides on mobile; vertical wheel scrolls the page.
      if (Math.abs(event.deltaX) < 28 || Math.abs(event.deltaX) < Math.abs(event.deltaY) * 1.4) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheel < 1200) return;
      lastWheel = now;
      const delta = event.deltaX > 0 ? 1 : -1;
      if (!scrollToIndex(active + delta) && !desktopScroll.matches) go(delta);
    }, { passive:false });

    preload(0);
    preload(1);
    preload(slides - 1);
    updateDetails(0);
    measureChapter();
    scheduleScroll();
  });
})();
