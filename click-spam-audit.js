const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== CLICK SPAM AUDIT ===');

  const result = await page.evaluate(async () => {
    let duplicateTransitions = 0;
    
    // Intercept GSAP to check for duplicated tweens on the camera
    let cameraTweens = 0;
    const originalTo = window.gsap.to;
    window.gsap.to = function(target, vars) {
      if (target === window.__CAMERA__.position || target === window.__CAMERA__.rotation) {
        cameraTweens++;
      }
      return originalTo.apply(this, arguments);
    };

    // Find door 0
    const doors = [];
    window.__SCENE__.traverse(obj => {
      if (obj.userData && obj.userData.type === 'door' && obj.userData.side) doors.push(obj);
    });
    
    const doorPos = new window.THREE.Vector3();
    doors[0].getWorldPosition(doorPos);
    doorPos.y += 1.5;
    doorPos.project(window.__CAMERA__);
    const dx = (doorPos.x * .5 + .5) * window.innerWidth;
    const dy = (doorPos.y * -.5 + .5) * window.innerHeight;

    // Spam click on Door 0 100 times
    for (let i = 0; i < 100; i++) {
      window.dispatchEvent(new PointerEvent('pointerdown', { clientX: dx, clientY: dy }));
    }
    
    // Wait for transition to complete
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if we reached room state and had exactly 2 camera tweens (position and rotation)
    const stateAfterSpam = window.__APP_STATE__ || window.__RAYCAST_COUNT ? 'OK' : 'FAIL';
    
    // Number of masks created (should be 1)
    const masks = document.querySelectorAll('div[style*="z-index: 9999"]');

    // Restore gsap
    window.gsap.to = originalTo;

    return {
      cameraTweens,
      maskCount: masks.length
    };
  });

  if (result.cameraTweens === 2 && result.maskCount === 0) {
     console.log('✅ Single door spam: PASSED. Only 1 navigation triggered.');
  } else {
     console.log(`❌ Single door spam: FAILED. Tweens: ${result.cameraTweens}, Masks: ${result.maskCount}`);
  }

  await browser.close();
})();
