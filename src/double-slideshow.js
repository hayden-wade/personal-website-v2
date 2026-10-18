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
    const duration = 1080;
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

    const go = (direction) => {
      if (busy || !direction) return;
      const upcoming = (active + direction + slides) % slides;
      if (upcoming === active) return;
      busy = true;
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

      Promise.allSettled(jobs.map((job) => job.finished))
        .then(() => {
          // CSS state is established before cancelling fill animations.
          clearAll(upcoming);
          jobs.forEach((job) => job.cancel());
        })
        .catch(() => {
          clearAll(upcoming);
          jobs.forEach((job) => job.cancel());
        });
    };

    // Encode metadata in the background frames; keeps authoring to one project list.
    // Any route with no dedicated page points to the general projects archive.
    previous.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    stage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
      else if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
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
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) go(dx < 0 ? 1 : -1);
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
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.35) go(dx < 0 ? 1 : -1);
    });
    stage.addEventListener("pointercancel", () => { mouseStart = null; });
    stage.addEventListener("wheel", (event) => {
      // Only horizontal trackpad motion changes slides; vertical wheel scrolls the page.
      if (Math.abs(event.deltaX) < 28 || Math.abs(event.deltaX) < Math.abs(event.deltaY) * 1.4) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheel < 1200) return;
      lastWheel = now;
      go(event.deltaX > 0 ? 1 : -1);
    }, { passive:false });

    preload(0);
    preload(1);
    preload(slides - 1);
    updateDetails(0);
  });
})();
