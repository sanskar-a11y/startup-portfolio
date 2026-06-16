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

  console.log(`\n=== STATIC GEOMETRY AUDIT ===`);
  
  const results = await page.evaluate(() => {
    const info = window.__RENDERER__.info;
    let r3fObjectCount = 0;
    
    if (window.__SCENE__) {
      window.__SCENE__.traverse(() => r3fObjectCount++);
    }
    
    return {
      calls: info.render.calls,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      programs: info.programs ? info.programs.length : 0,
      r3fObjectCount
    };
  });
  
  console.log(results);
  await browser.close();
})();
