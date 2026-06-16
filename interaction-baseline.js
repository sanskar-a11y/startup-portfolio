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

  console.log(`\n=== INTERACTION BASELINE CAPTURE ===`);
  
  const results = await page.evaluate(async () => {
    if (!window.gsap) return { error: 'GSAP not found' };

    const interactiveObjects = [];
    window.__SCENE__.traverse(obj => {
      if (obj.userData && obj.userData.type === 'door') {
        interactiveObjects.push(obj);
      }
    });

    const doors = interactiveObjects.filter(obj => obj.userData.side);
    if (doors.length !== 7) return { error: `Expected 7 doors, found ${doors.length}` };

    const baseline = [];

    for (let i = 0; i < doors.length; i++) {
      const door = doors[i];
      const hinge = door.parent.userData.hinge || door.parent.parent.userData.hinge;
      const side = door.userData.side;
      const tilt = side === 'left' ? -Math.PI / 12 : Math.PI / 12;
      
      const metrics = {
        doorIndex: i,
        hoverDuration: 0,
        hingeRotation: 0,
        doorLiftDistance: 0,
        clickResponseTime: 0,
        roomOpenDuration: 0,
        roomCloseDuration: 0
      };
      
      // Measure Hover
      let start = performance.now();
      window.gsap.to(hinge.rotation, { y: tilt, duration: 0.3 });
      await new Promise(r => setTimeout(r, 350)); // let it finish
      metrics.hoverDuration = performance.now() - start;
      metrics.hingeRotation = hinge.rotation.y;
      
      // Simulate click
      const openRot = side === 'left' ? -Math.PI / 2 : Math.PI / 2;
      start = performance.now();
      window.gsap.to(hinge.rotation, { y: openRot, duration: 1.0, ease: 'power2.inOut' });
      await new Promise(r => setTimeout(r, 1050));
      metrics.roomOpenDuration = performance.now() - start;
      metrics.clickResponseTime = 1.0; // Simulated response duration based on gsap call
      
      // Restore
      start = performance.now();
      window.gsap.to(hinge.rotation, { y: 0, duration: 1.0, ease: 'power2.inOut' });
      await new Promise(r => setTimeout(r, 1050));
      metrics.roomCloseDuration = performance.now() - start;
      
      baseline.push(metrics);
    }
    
    return baseline;
  });
  
  if (results.error) {
    console.error('Error:', results.error);
  } else {
    console.log(JSON.stringify(results, null, 2));
    fs.writeFileSync('interaction-baseline.json', JSON.stringify(results, null, 2));
    console.log('Saved baseline to interaction-baseline.json');
  }
  
  await browser.close();
})();
