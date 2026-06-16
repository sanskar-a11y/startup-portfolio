const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== GSAP CONTEXT AUDIT ===');

  const result = await page.evaluate(async () => {
    // We can count contexts in useGSAP by looking at gsap
    const initialContexts = window.gsap.globalTimeline.getChildren(true, true, true).length;
    
    // Cycle 100 times by finding the React root and triggering re-renders or simulating route changes
    for (let i = 0; i < 100; i++) {
       window.dispatchEvent(new Event('test-remount-trigger-if-any')); // Actually, let's hover on/off 100 times to test context spam
       const doorKey = "room_0";
       if (window.__DOOR_CALLBACKS__ && window.__DOOR_CALLBACKS__[doorKey]) {
          window.__DOOR_CALLBACKS__[doorKey].enter();
          window.__DOOR_CALLBACKS__[doorKey].exit();
       }
    }
    
    // Wait for GSAP to finish its 0.3s animations
    await new Promise(r => setTimeout(r, 500));
    
    const finalContexts = window.gsap.globalTimeline.getChildren(true, true, true).length;
    
    return {
      initialContexts,
      finalContexts,
      leaks: finalContexts - initialContexts
    };
  });

  if (result.leaks <= 0) {
    console.log(`✅ GSAP Context Audit: PASSED. Leaks: ${result.leaks}`);
  } else {
    console.log(`❌ GSAP Context Audit: FAILED. Leaks: ${result.leaks}`);
  }

  await browser.close();
})();
