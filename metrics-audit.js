const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.exposeFunction('reportMetrics', (state, metrics) => {
    console.log(`\n=== STATE: ${state} ===`);
    console.log(`FPS:           ${metrics.fps}`);
    console.log(`Heap (MB):     ${metrics.heap}`);
    console.log(`Geometries:    ${metrics.geometries}`);
    console.log(`Textures:      ${metrics.textures}`);
    console.log(`Draw Calls:    ${metrics.calls}`);
    console.log(`Triangles:     ${metrics.triangles}`);
    console.log(`Active Rooms:  ${metrics.activeRooms}`);
  });

  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

  // Force preloader completion immediately
  await page.evaluate(() => {
    document.dispatchEvent(new Event('preloaderComplete'));
    if (window.gsap) window.gsap.globalTimeline.timeScale(20);
  });

  // Wait for the app to boot and renderer to be exposed
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });

  // Setup metrics tracker in the browser context
  await page.evaluate(() => {
    window.metricsData = { fps: 60, maxCalls: 0, maxTriangles: 0, frames: 0, lastTime: performance.now() };

    const origRender = window.__RENDERER__.render.bind(window.__RENDERER__);
    window.__RENDERER__.render = function(scene, camera) {
      origRender(scene, camera);
      const calls = window.__RENDERER__.info.render.calls;
      const tris = window.__RENDERER__.info.render.triangles;
      if (calls > window.metricsData.maxCalls) window.metricsData.maxCalls = calls;
      if (tris > window.metricsData.maxTriangles) window.metricsData.maxTriangles = tris;
      window.metricsData.frames++;
      const now = performance.now();
      if (now - window.metricsData.lastTime >= 1000) {
        window.metricsData.fps = Math.round((window.metricsData.frames * 1000) / (now - window.metricsData.lastTime));
        window.metricsData.frames = 0;
        window.metricsData.lastTime = now;
      }
    };
  });

  async function logState(label) {
    const metrics = await page.evaluate(() => {
      const m = {
        fps: window.metricsData.fps,
        heap: performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(2) : 0,
        geometries: window.__RENDERER__.info.memory.geometries,
        textures: window.__RENDERER__.info.memory.textures,
        calls: window.metricsData.maxCalls,
        triangles: window.metricsData.maxTriangles,
        activeRooms: Object.keys(window.__ROOM_SCENES__).filter(id => window.__ROOM_SCENES__[id] !== null).length
      };
      window.metricsData.maxCalls = 0;
      window.metricsData.maxTriangles = 0;
      return m;
    });
    await page.evaluate((l, m) => window.reportMetrics(l, m), label, metrics);
  }

  await new Promise(r => setTimeout(r, 2000));
  await logState('BASELINE (CORRIDOR)');

  await page.evaluate(() => {
    window.__ENTER_ROOM__('about', { position: { x: -4, y: 0, z: -20 }, rotation: { y: Math.PI / 2 } });
    window.__FORCE_STATE__('IN_ROOM');
  });
  await new Promise(r => setTimeout(r, 1500));
  await logState('INSIDE ROOM (Cycle 1)');

  await page.evaluate(() => {
    window.__EXIT_ROOM__();
    window.__FORCE_STATE__('IN_CORRIDOR');
  });
  await new Promise(r => setTimeout(r, 1500));
  await logState('EXIT TO CORRIDOR (Cycle 1)');

  for(let i=2; i<=10; i++) {
    await page.evaluate(() => {
      window.__ENTER_ROOM__('projects', { position: { x: 4, y: 0, z: -120 }, rotation: { y: -Math.PI / 2 } });
      window.__FORCE_STATE__('IN_ROOM');
    });
    await new Promise(r => setTimeout(r, 200));
    await page.evaluate(() => {
      window.__EXIT_ROOM__();
      window.__FORCE_STATE__('IN_CORRIDOR');
    });
    await new Promise(r => setTimeout(r, 200));
  }
  
  await new Promise(r => setTimeout(r, 1000));
  await logState('AFTER 10 CYCLES (CORRIDOR)');

  await browser.close();
})();
