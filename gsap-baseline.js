const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== GSAP GOLDEN MASTER BASELINE ===');

  const baseline = await page.evaluate(async () => {
    const records = [];
    let maxConcurrent = 0;

    // Track max concurrent tweens by polling
    const pollInterval = setInterval(() => {
      if (window.gsap && window.gsap.globalTimeline) {
        const activeCount = window.gsap.globalTimeline.getChildren(true, true, true).length;
        if (activeCount > maxConcurrent) maxConcurrent = activeCount;
      }
    }, 10);

    // Intercept GSAP to record tweens
    const originalTo = window.gsap.to;
    window.gsap.to = function(target, vars) {
      let targetCount = 1;
      if (Array.isArray(target) || target instanceof NodeList) {
         targetCount = target.length;
      }
      
      records.push({
        action: window.__CURRENT_ACTION__ || 'unknown',
        targetType: target === window.__CAMERA__.position ? 'CameraPosition' :
                    target === window.__CAMERA__.rotation ? 'CameraRotation' :
                    (target && target.y !== undefined) ? 'Rotation/Position/Scale' : 'Other',
        duration: vars.duration || 0.5, // GSAP default
        delay: vars.delay || 0,
        easing: vars.ease || 'power1.out', // GSAP default
        overwrite: vars.overwrite ? true : false,
        targetCount
      });
      return originalTo.apply(this, arguments);
    };

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
    
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    // 1. Hover Enter
    window.__CURRENT_ACTION__ = 'Hover Enter';
    await new Promise(r => {
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: dx, clientY: dy }));
      setTimeout(r, 500);
    });

    // 2. Hover Exit
    window.__CURRENT_ACTION__ = 'Hover Exit';
    await new Promise(r => {
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx, clientY: cy }));
      setTimeout(r, 500);
    });

    // 3. Click Door -> Room Transition
    window.__CURRENT_ACTION__ = 'Door Click / Walkthrough';
    await new Promise(r => {
      window.dispatchEvent(new PointerEvent('pointerdown', { clientX: dx, clientY: dy }));
      setTimeout(r, 1200);
    });

    window.__CURRENT_ACTION__ = 'Room Overlay / Background Idle';
    await new Promise(r => setTimeout(r, 1000)); // wait in room

    // 4. Click Exit -> Corridor Transition
    window.__CURRENT_ACTION__ = 'Room Exit';
    const exitObjects = [];
    window.__SCENE__.traverse(obj => {
      if (obj.userData && obj.userData.isExit) exitObjects.push(obj);
    });
    if (exitObjects.length > 0) {
      const exitPos = new window.THREE.Vector3();
      exitObjects[0].getWorldPosition(exitPos);
      exitPos.project(window.__CAMERA__);
      const ex = (exitPos.x * .5 + .5) * window.innerWidth;
      const ey = (exitPos.y * -.5 + .5) * window.innerHeight;
      window.dispatchEvent(new PointerEvent('pointerdown', { clientX: ex, clientY: ey }));
    }
    await new Promise(r => setTimeout(r, 1000));

    // Cleanup
    clearInterval(pollInterval);
    window.gsap.to = originalTo;

    return {
      peakConcurrentTweens: maxConcurrent,
      records
    };
  });

  fs.writeFileSync('gsap-baseline.json', JSON.stringify(baseline, null, 2));
  console.log(JSON.stringify(baseline, null, 2));
  console.log('Saved baseline to gsap-baseline.json');

  await browser.close();
})();
