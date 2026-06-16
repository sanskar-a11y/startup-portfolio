const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });

  await page.evaluate(() => {
    document.dispatchEvent(new Event('preloaderComplete'));
  });

  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log(`\n=== HOVER SPAM AUDIT ===`);

  // Initial timeline check
  const initialTweens = await page.evaluate(() => {
    return window.gsap ? window.gsap.globalTimeline.getChildren().length : 0;
  });
  console.log(`Initial GSAP Tweens: ${initialTweens}`);

  // Spam sweeps
  console.log('Running 500 rapid sweeps across the screen...');
  
  const w = await page.evaluate(() => window.innerWidth);
  const h = await page.evaluate(() => window.innerHeight);

  for (let i = 0; i < 500; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    await page.mouse.move(x, y);
  }

  // Cool down
  await page.mouse.move(w/2, h/2);
  await new Promise(r => setTimeout(r, 1000));

  // Final check
  const finalTweens = await page.evaluate(() => {
    return window.gsap ? window.gsap.globalTimeline.getChildren().length : 0;
  });
  
  console.log(`Final GSAP Tweens after cooldown: ${finalTweens}`);

  // Check if any hinges are stuck
  const stuckHinges = await page.evaluate(() => {
    const stuck = [];
    window.__SCENE__.traverse(obj => {
      if (obj.userData && obj.userData.hinge) {
        if (Math.abs(obj.userData.hinge.rotation.y) > 0.01) {
          stuck.push({
             name: obj.name,
             rotation: obj.userData.hinge.rotation.y
          });
        }
      }
    });
    return stuck;
  });

  console.log(`Stuck hinges: ${stuckHinges.length}`, stuckHinges);

  if (finalTweens <= initialTweens + 5 && stuckHinges.length === 0) { // allowing minor background tweens
    console.log('\n✅ AUDIT PASSED: No queue growth or stuck hovers.');
  } else {
    console.log('\n❌ AUDIT FAILED: Hover leak detected.');
  }

  await browser.close();
})();
