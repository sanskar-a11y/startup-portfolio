const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });

  await page.evaluate(() => {
    document.dispatchEvent(new Event('preloaderComplete'));
  });

  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log(`\n=== HOVER BASELINE CAPTURE ===`);

  const results = await page.evaluate(async () => {
    const interactiveObjects = [];
    window.__SCENE__.traverse(obj => {
      if (obj.userData && obj.userData.type === 'door' && obj.userData.side) {
        interactiveObjects.push(obj);
      }
    });

    const metrics = [];

    for (let i = 0; i < interactiveObjects.length; i++) {
      const door = interactiveObjects[i];
      const hinge = door.parent.userData.hinge || door.parent.parent.userData.hinge;
      
      const doorPos = new window.THREE.Vector3();
      door.getWorldPosition(doorPos);
      doorPos.project(window.__RENDERER__.xr.isPresenting ? window.__RENDERER__.xr.getCamera(window.__CAMERA__) : window.__CAMERA__);

      const x = (doorPos.x * .5 + .5) * window.innerWidth;
      const y = (doorPos.y * -.5 + .5) * window.innerHeight;

      // Ensure cursor is away
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 0, clientY: 0 }));
      await new Promise(r => setTimeout(r, 100));

      const startTime = performance.now();
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: y }));
      
      // Wait for hover GSAP to finish (duration 0.3s)
      await new Promise(r => setTimeout(r, 400));
      const enterTime = performance.now() - startTime;
      
      const hingeRotation = hinge ? hinge.rotation.y : 0;
      const doorLiftAmount = door.position.y;

      const exitStartTime = performance.now();
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 0, clientY: 0 }));
      
      // Wait for exit GSAP
      await new Promise(r => setTimeout(r, 400));
      const exitTime = performance.now() - exitStartTime;

      metrics.push({
        doorIndex: i,
        hoverEnterTime: enterTime,
        hoverExitTime: exitTime,
        hingeRotation: hingeRotation,
        doorLiftAmount: doorLiftAmount,
        hoverCooldown: 300 // Vanilla is hardcoded to 0.3s
      });
    }
    return metrics;
  });

  fs.writeFileSync('hover-baseline.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  console.log('Saved baseline to hover-baseline.json');

  await browser.close();
})();
