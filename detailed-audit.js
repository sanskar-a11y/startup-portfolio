const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // We want to track exact render calls, geometries, textures, and programs
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    document.dispatchEvent(new Event('preloaderComplete'));
    if (window.gsap) window.gsap.globalTimeline.timeScale(20);
  });

  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });

  // Setup tracker
  await page.evaluate(() => {
    window.auditData = {
      fpsTracker: 0,
      renderCalls: [],
      renderTris: [],
      captureFrame: false
    };

    const origRender = window.__RENDERER__.render.bind(window.__RENDERER__);
    window.__RENDERER__.render = function(scene, camera) {
      origRender(scene, camera);
      const calls = window.__RENDERER__.info.render.calls;
      const tris = window.__RENDERER__.info.render.triangles;
      
      if (window.auditData.captureFrame) {
        window.auditData.renderCalls.push(calls);
        window.auditData.renderTris.push(tris);
      }
      
      window.auditData.fpsTracker++;
    };
  });

  // Wait 2 seconds for boot
  await new Promise(r => setTimeout(r, 2000));
  
  // Investigation 1: FPS check over 1 sec
  const fpsStart = await page.evaluate(() => {
    const start = window.auditData.fpsTracker;
    return start;
  });
  await new Promise(r => setTimeout(r, 1000));
  const fpsEnd = await page.evaluate(() => window.auditData.fpsTracker);
  const actualFps = fpsEnd - fpsStart;
  
  console.log(`\n=== INVESTIGATION 1: FPS VERIFICATION ===`);
  console.log(`Measured Render Calls over 1000ms: ${actualFps}`);

  // Investigation 4: WebGL Resource Audit
  const resources = await page.evaluate(() => {
    return {
      geometries: window.__RENDERER__.info.memory.geometries,
      textures: window.__RENDERER__.info.memory.textures,
      programs: window.__RENDERER__.info.programs ? window.__RENDERER__.info.programs.length : 0
    };
  });

  console.log(`\n=== INVESTIGATION 4: WEBGL RESOURCE AUDIT ===`);
  console.log(`Geometries: ${resources.geometries}`);
  console.log(`Textures:   ${resources.textures}`);
  console.log(`Programs:   ${resources.programs}`);

  // Investigation 3: Verified Room Metrics (50 Samples)
  console.log(`\n=== INVESTIGATION 3: ROOM METRICS (50 SAMPLES) ===`);
  
  const roomSamples = [];
  
  for (let i = 0; i < 50; i++) {
    // Enter room
    await page.evaluate(() => {
      window.__ENTER_ROOM__('projects', { position: { x: 4, y: 0, z: -120 }, rotation: { y: -Math.PI / 2 } });
      window.__FORCE_STATE__('IN_ROOM');
      // Reset tracking arrays for this sample
      window.auditData.renderCalls = [];
      window.auditData.renderTris = [];
      // Start capturing frames strictly while inside
      window.auditData.captureFrame = true;
    });
    
    // Wait for room to be stable (wait 50ms to grab a few frames)
    await new Promise(r => setTimeout(r, 50));
    
    // Stop capturing
    const data = await page.evaluate(() => {
      window.auditData.captureFrame = false;
      return {
        calls: window.auditData.renderCalls,
        tris: window.auditData.renderTris
      };
    });
    
    // Calculate average for this specific visit
    if (data.calls.length > 0) {
      const avgCalls = Math.round(data.calls.reduce((a, b) => a + b, 0) / data.calls.length);
      const avgTris = Math.round(data.tris.reduce((a, b) => a + b, 0) / data.tris.length);
      roomSamples.push({ calls: avgCalls, tris: avgTris });
    }
    
    // Exit room
    await page.evaluate(() => {
      window.__EXIT_ROOM__();
      window.__FORCE_STATE__('IN_CORRIDOR');
    });
    
    // Wait before next cycle
    await new Promise(r => setTimeout(r, 50));
  }
  
  const allCalls = roomSamples.map(s => s.calls);
  const allTris = roomSamples.map(s => s.tris);
  
  console.log(`50 Room Samples Collected.`);
  console.log(`Draw Calls - Avg: ${Math.round(allCalls.reduce((a,b)=>a+b,0)/50)} | Min: ${Math.min(...allCalls)} | Max: ${Math.max(...allCalls)}`);
  console.log(`Triangles  - Avg: ${Math.round(allTris.reduce((a,b)=>a+b,0)/50)} | Min: ${Math.min(...allTris)} | Max: ${Math.max(...allTris)}`);

  await browser.close();
})();
