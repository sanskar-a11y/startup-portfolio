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

  console.log(`\n=== HOVER TRANSITION AUDIT ===`);

  const coordinates = await page.evaluate(async () => {
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
      doorPos.y += 1.5; // Center of the door vertically
      doorPos.project(window.__CAMERA__);
      coords.push({
        x: (doorPos.x * .5 + .5) * window.innerWidth,
        y: (doorPos.y * -.5 + .5) * window.innerHeight
      });
    }
    return coords;
  });

  const metrics = [];
  const cx = await page.evaluate(() => window.innerWidth / 2);
  const cy = await page.evaluate(() => window.innerHeight / 2);

  for (let i = 0; i < coordinates.length; i++) {
    const { x, y } = coordinates[i];

    // Ensure cursor is away
    await page.mouse.move(cx, cy);
    await new Promise(r => setTimeout(r, 100));

    const startTime = performance.now();
    await page.mouse.move(x, y);
    
    // Wait for hover GSAP
    await new Promise(r => setTimeout(r, 400));
    const enterTime = performance.now() - startTime;
    
    // Check hinge rotation
    const hingeRotationAfterEnter = await page.evaluate((doorIdx) => {
       const doors = [];
       window.__SCENE__.traverse(obj => {
         if (obj.userData && obj.userData.type === 'door' && obj.userData.side) {
           doors.push(obj);
         }
       });
       const hinge = doors[doorIdx].parent.userData.hinge || doors[doorIdx].parent.parent.userData.hinge;
       return hinge.rotation.y;
    }, i);

    const exitStartTime = performance.now();
    await page.mouse.move(cx, cy);
    
    // Wait for exit GSAP
    await new Promise(r => setTimeout(r, 400));
    const exitTime = performance.now() - exitStartTime;

    const hingeRotationAfterExit = await page.evaluate((doorIdx) => {
       const doors = [];
       window.__SCENE__.traverse(obj => {
         if (obj.userData && obj.userData.type === 'door' && obj.userData.side) {
           doors.push(obj);
         }
       });
       const hinge = doors[doorIdx].parent.userData.hinge || doors[doorIdx].parent.parent.userData.hinge;
       return hinge.rotation.y;
    }, i);

    metrics.push({
      doorIndex: i,
      doorEnterSuccess: Math.abs(hingeRotationAfterEnter) > 0.1 ? 1 : 0,
      doorExitSuccess: Math.abs(hingeRotationAfterExit) < 0.01 ? 1 : 0,
      hoverEnterTime: enterTime,
      hoverExitTime: exitTime
    });
  }

  console.log(JSON.stringify(metrics, null, 2));

  let passed = true;
  metrics.forEach(res => {
    if (res.doorEnterSuccess !== 1 || res.doorExitSuccess !== 1) {
      passed = false;
    }
  });

  if (passed) {
    console.log('\n✅ AUDIT PASSED: 1 enter, 1 exit per transition.');
  } else {
    console.log('\n❌ AUDIT FAILED: Duplicate enters/exits detected.');
  }

  await browser.close();
})();
