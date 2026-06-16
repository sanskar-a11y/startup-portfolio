const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== DOOR CLICK GSAP BASELINE ===');

  const baseline = await page.evaluate(async () => {
    const results = [];
    
    for (let i = 0; i < 7; i++) {
      let maxConcurrent = 0;
      let duration = 0;
      let ease = '';
      let hingeStart = 0;
      let hingeEnd = 0;
      
      const pollInterval = setInterval(() => {
        if (window.gsap && window.gsap.globalTimeline) {
          const activeCount = window.gsap.globalTimeline.getChildren(true, true, true).length;
          if (activeCount > maxConcurrent) maxConcurrent = activeCount;
        }
      }, 10);
      
      // Intercept GSAP to capture the specific hinge tween
      const originalTo = window.gsap.to;
      window.gsap.to = function(target, vars) {
        if (target && target.y !== undefined && typeof target.x === 'number' && typeof target.z === 'number') {
          // It's a rotation vector
          if (vars.duration === 1.0 || vars.duration === 1) { // We know it's 1.0s
            duration = vars.duration;
            ease = vars.ease || 'power1.out';
            hingeStart = target.y;
            hingeEnd = vars.y;
          }
        }
        return originalTo.apply(this, arguments);
      };

      const doors = [];
      window.__SCENE__.traverse(obj => {
        if (obj.userData && obj.userData.type === 'door' && obj.userData.side) doors.push(obj);
      });
      
      // Sort to ensure deterministic order (e.g. door 0 to 6)
      doors.sort((a, b) => {
         const zA = a.parent.parent.position.z;
         const zB = b.parent.parent.position.z;
         return zB - zA;
      });
      
      const door = doors[i];
      const doorPos = new window.THREE.Vector3();
      door.getWorldPosition(doorPos);
      doorPos.y += 1.5;
      doorPos.project(window.__CAMERA__);
      const dx = (doorPos.x * .5 + .5) * window.innerWidth;
      const dy = (doorPos.y * -.5 + .5) * window.innerHeight;
      
      // Click
      window.dispatchEvent(new PointerEvent('pointerdown', { clientX: dx, clientY: dy }));
      
      await new Promise(r => setTimeout(r, 1200)); // wait for door to open fully
      
      clearInterval(pollInterval);
      window.gsap.to = originalTo;
      
      results.push({
        doorIndex: i,
        sectionId: door.userData.sectionId,
        hingeStartRotation: parseFloat(hingeStart.toFixed(4)),
        hingeEndRotation: parseFloat(hingeEnd.toFixed(4)),
        duration,
        ease,
        peakConcurrentTweens: maxConcurrent
      });
      
      // Click exit to go back to corridor
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
      
      await new Promise(r => setTimeout(r, 1200)); // wait for room close
    }

    return results;
  });

  fs.writeFileSync('door-click-gsap-baseline.json', JSON.stringify(baseline, null, 2));
  console.log(JSON.stringify(baseline, null, 2));

  await browser.close();
})();
