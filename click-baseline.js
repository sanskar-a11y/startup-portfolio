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

  console.log(`\n=== CLICK GOLDEN MASTER BASELINE ===`);

  const metrics = await page.evaluate(async () => {
    const interactiveObjects = [];
    window.__SCENE__.traverse(obj => {
      if (obj.userData && obj.userData.type === 'door' && obj.userData.side) {
        interactiveObjects.push(obj);
      }
    });

    const coords = [];
    for (let i = 0; i < interactiveObjects.length; i++) {
      const door = interactiveObjects[i];
      const doorPos = new window.THREE.Vector3();
      door.getWorldPosition(doorPos);
      doorPos.y += 1.5; // Center of the door
      doorPos.project(window.__CAMERA__);
      coords.push({
        x: (doorPos.x * .5 + .5) * window.innerWidth,
        y: (doorPos.y * -.5 + .5) * window.innerHeight
      });
    }

    const results = [];
    for (let i = 0; i < coords.length; i++) {
      const { x, y } = coords[i];

      const startTime = performance.now();
      window.dispatchEvent(new PointerEvent('pointerdown', { clientX: x, clientY: y }));
      const clickTime = performance.now() - startTime;

      // Wait for Room Open sequence (800ms + 300ms)
      await new Promise(r => setTimeout(r, 800));
      const roomOpenStart = performance.now() - startTime;
      
      await new Promise(r => setTimeout(r, 300));
      const roomOpenEnd = performance.now() - startTime;
      
      // Wait for Room Close sequence (simulate exit click)
      await new Promise(r => setTimeout(r, 500)); // wait inside room
      
      const exitStartTime = performance.now();
      // Emulate click on exit (the exit button is always rendered at fixed position, or we can just send an intersect directly)
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
      
      await new Promise(r => setTimeout(r, 50));
      const roomCloseStart = performance.now() - exitStartTime;
      
      await new Promise(r => setTimeout(r, 300));
      const roomCloseEnd = performance.now() - exitStartTime;

      // Ensure we are back in corridor before next loop
      await new Promise(r => setTimeout(r, 500));

      results.push({
        doorIndex: i,
        doorClickTime: clickTime,
        roomOpenStart: roomOpenStart,
        roomOpenEnd: roomOpenEnd,
        roomCloseStart: roomCloseStart,
        roomCloseEnd: roomCloseEnd,
        navigationTriggerTime: 1.0 // camera movement duration
      });
    }
    return results;
  });

  fs.writeFileSync('click-baseline.json', JSON.stringify(metrics, null, 2));
  console.log(JSON.stringify(metrics, null, 2));
  console.log('Saved baseline to click-baseline.json');

  await browser.close();
})();
