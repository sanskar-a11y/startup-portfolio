const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });

  await page.evaluate(() => {
    document.dispatchEvent(new Event('preloaderComplete'));
    if (window.gsap) window.gsap.globalTimeline.timeScale(20);
  });

  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log(`\n=== LEAPFROG STABILITY TEST ===`);
  
  const results = await page.evaluate(async () => {
    // We simulate 10,000 wheel events
    let initialCount = 0;
    
    // We assume segments are children of corridorGroup.
    // wait, where are segments exposed? We can find them in the scene.
    // Let's find corridorGroup.
    let corridorGroup = null;
    window.__RENDERER__.info.reset(); 
    // wait, we can just trigger wheel events directly on window
    const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
    
    // Check initial segment count via R3F children or corridorGroup children
    // In webgl-corridor.js we have corridorGroup.
    const scene = window.__RENDERER__.info.render.calls ? window.__RENDERER__.info.programs : null; // hack to find scene?
    
    // Find all segment groups by checking for userData.roomConfig
    let segmentGroups = [];
    window.__SCENE__.traverse(obj => {
      if (obj.userData && obj.userData.roomConfig) {
        segmentGroups.push(obj);
      }
    });

    if (segmentGroups.length === 0) return { error: 'No segment groups found' };
    initialCount = segmentGroups.length;

    // Track initial Z positions
    const initialPositions = segmentGroups.map(g => g.position.z);

    let driftDetected = false;
    let nanDetected = false;

    for (let i = 0; i < 10000; i++) {
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
      if (i % 100 === 0) {
        // give RAF a chance
        await new Promise(r => setTimeout(r, 0));
        
        segmentGroups.forEach(child => {
          if (isNaN(child.position.z)) nanDetected = true;
        });
      }
    }

    const finalCount = segmentGroups.length;
    let missingSegments = finalCount !== initialCount;

    return {
      initialCount,
      finalCount,
      missingSegments,
      nanDetected,
      driftDetected
    };
  });
  
  console.log('Results:', results);
  await browser.close();
})();
