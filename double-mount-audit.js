const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Inject RAF and Listener mocks before page load to track them
  await page.evaluateOnNewDocument(() => {
    window.__RAF_COUNT__ = 0;
    const originalRaf = window.requestAnimationFrame;
    const activeRafs = new Set();
    window.requestAnimationFrame = function(cb) {
      const id = originalRaf(function(time) {
        activeRafs.delete(id);
        cb(time);
      });
      activeRafs.add(id);
      window.__RAF_COUNT__ = activeRafs.size;
      return id;
    };
    const originalCancel = window.cancelAnimationFrame;
    window.cancelAnimationFrame = function(id) {
      activeRafs.delete(id);
      window.__RAF_COUNT__ = activeRafs.size;
      originalCancel(id);
    };

    window.__LISTENERS__ = {
      wheel: 0, pointer: 0, touch: 0, resize: 0, keydown: 0
    };
    
    const originalAdd = EventTarget.prototype.addEventListener;
    const originalRemove = EventTarget.prototype.removeEventListener;
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (window.__LISTENERS__[type] !== undefined) window.__LISTENERS__[type]++;
      return originalAdd.call(this, type, listener, options);
    };
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
      if (window.__LISTENERS__[type] !== undefined) window.__LISTENERS__[type]--;
      return originalRemove.call(this, type, listener, options);
    };
  });

  await page.goto('http://localhost:8000');
  
  // Wait for initial load
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("=== BEFORE CYCLES ===");
  const beforeMetrics = await getMetrics(page);
  console.log(beforeMetrics);

  console.log("\nRunning 100 Mount/Unmount cycles...");
  
  const gsapLeaks = await page.evaluate(async () => {
    const gsapLengths = [];
    const mountToggleBtn = document.getElementById('mount-toggle');
    for (let i = 0; i < 50; i++) { // 100 cycles total
      if (window.__UNMOUNT__) window.__UNMOUNT__();
      await new Promise(r => setTimeout(r, 100));
      if (window.__MOUNT__) window.__MOUNT__();
      await new Promise(r => setTimeout(r, 100));
      if (window.gsap && window.gsap.globalTimeline) {
         gsapLengths.push(window.gsap.globalTimeline.getChildren(true, true, true).length);
      }
    }
    return gsapLengths;
  });
  console.log("GSAP Timeline lengths during cycles:", gsapLeaks);
  
  await new Promise(r => setTimeout(r, 1000));

  console.log("\n=== AFTER 100 CYCLES ===");
  const afterMetrics = await getMetrics(page);
  console.log(afterMetrics);

  await browser.close();
})();

async function getMetrics(page) {
  return await page.evaluate(() => {
    return {
      canvases: document.querySelectorAll("canvas").length,
      gsapTimelines: window.gsap ? window.gsap.globalTimeline.getChildren().length : 0,
      activeRAFs: window.__RAF_COUNT__,
      listeners: window.__LISTENERS__
    };
  });
}
