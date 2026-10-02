(() => {
  const canvas = document.querySelector("[data-animated-grid-bg]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const config = {
    bgColor: "#171a18",
    gridColor: "rgba(255,255,255,0.055)",
    gridColorBold: "rgba(255,255,255,0.10)",
    crossColorSmall: "rgba(255,255,255,0.05)",
    crossColorLarge: "rgba(255,255,255,0.36)",
    gridSize: 50,
    boldEvery: 3,
    crossSizeSmall: 5,
    crossSizeLarge: 8,
    crossThickness: 1,
    scrollSpeed: 0.06,
    twinkleMin: 0.1,
    twinkleMax: 1.0,
    twinkleSpeed: 0.0008,
  };

  let W = 0;
  let H = 0;
  let dpr = 1;
  let offset = 0;
  let crosses = [];
  let raf = 0;

  function parseRGBA(str) {
    const match = str.match(/rgba?\(([^)]+)\)/);
    if (!match) return { r: 255, g: 255, b: 255, a: 1 };
    const parts = match[1].split(",").map((part) => parseFloat(part.trim()));
    return {
      r: parts[0] || 0,
      g: parts[1] || 0,
      b: parts[2] || 0,
      a: parts[3] ?? 1,
    };
  }

  const cSmall = parseRGBA(config.crossColorSmall);
  const cLarge = parseRGBA(config.crossColorLarge);

  function rebuildCrosses() {
    const step = config.gridSize * config.boldEvery;
    const cols = Math.ceil(W / step) + 2;
    const rows = Math.ceil(H / step) + 2;
    crosses = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        crosses.push({
          baseX: c * step,
          baseY: r * step,
          phase: Math.random() * Math.PI * 2,
          speed: config.twinkleSpeed * (0.5 + Math.random()),
          isLarge: (r + c) % 2 === 0,
        });
      }
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildCrosses();
  }

  function drawGrid() {
    const size = config.gridSize;
    const step = size * config.boldEvery;
    const ox = -(offset % step);
    const oy = -((offset * 0.7) % step);

    ctx.strokeStyle = config.gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = ox; x < W; x += size) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, H);
    }

    for (let y = oy; y < H; y += size) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(W, y + 0.5);
    }

    ctx.stroke();

    ctx.strokeStyle = config.gridColorBold;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = ox; x < W; x += step) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, H);
    }

    for (let y = oy; y < H; y += step) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(W, y + 0.5);
    }

    ctx.stroke();

    const t = performance.now();

    for (const cross of crosses) {
      const x = cross.baseX + ox;
      const y = cross.baseY + oy;
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;

      const phase = Math.sin(t * cross.speed + cross.phase);
      const norm = (phase + 1) / 2;
      const twinkle =
        config.twinkleMin +
        (config.twinkleMax - config.twinkleMin) * Math.pow(norm, 2);

      const color = cross.isLarge ? cLarge : cSmall;
      const size = cross.isLarge
        ? config.crossSizeLarge
        : config.crossSizeSmall;

      ctx.strokeStyle =
        "rgba(" +
        color.r +
        "," +
        color.g +
        "," +
        color.b +
        "," +
        color.a * twinkle +
        ")";
      ctx.lineWidth = config.crossThickness;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, y - size);
      ctx.lineTo(x + 0.5, y + size);
      ctx.moveTo(x - size, y + 0.5);
      ctx.lineTo(x + size, y + 0.5);
      ctx.stroke();
    }
  }

  function frame() {
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, W, H);
    drawGrid();
    offset += config.scrollSpeed;
    raf = requestAnimationFrame(frame);
  }

  function start() {
    cancelAnimationFrame(raf);
    resize();
    frame();
    canvas.dataset.gridReady = "true";
  }

  window.addEventListener("resize", resize, { passive: true });
  start();
})();
