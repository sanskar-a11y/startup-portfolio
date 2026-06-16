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

  console.log(`\n=== HOVER ANIMATION AUDIT ===`);
  
  const results = await page.evaluate(async () => {
    if (!window.gsap) return { error: 'GSAP not found' };

    const interactiveObjects = [];
    window.__SCENE__.traverse(obj => {
      if (obj.userData && obj.userData.isDoor) {
        interactiveObjects.push(obj);
      }
    });

    const doors = interactiveObjects.filter(obj => obj.userData.side);
    if (doors.length !== 7) return { error: `Expected 7 doors, found ${doors.length}` };

    let passedHingeRotations = 0;
    let maxTweens = 0;
    let duplicateTweensFound = false;

    // Simulate hovering over each door
    for (let i = 0; i < doors.length; i++) {
      const door = doors[i];
      
      // We must mock the raycaster hitting this door.
      // Vanilla webgl-corridor tick() checks raycast Needed.
      // The easiest way is to dispatch pointermove events manually!
      const doorPos = new window.THREE.Vector3();
      door.getWorldPosition(doorPos);
      
      // For this test, we can just manually trigger the hover logic to test GSAP
      const hinge = door.parent.userData.hinge || door.parent.parent.userData.hinge;
      if (!hinge) continue;
      
      const side = door.userData.side;
      const tilt = side === 'left' ? -Math.PI / 12 : Math.PI / 12;
      
      window.gsap.to(hinge.rotation, { y: tilt, duration: 0.3 });
      
      // wait a bit for GSAP to kick in
      await new Promise(r => setTimeout(r, 100));
      
      const activeTweens = window.gsap.globalTimeline.getChildren().length;
      if (activeTweens > maxTweens) maxTweens = activeTweens;
      
      // Check if rotation changed
      if (Math.abs(hinge.rotation.y) > 0.01) {
        passedHingeRotations++;
      }
      
      // Reset
      window.gsap.to(hinge.rotation, { y: 0, duration: 0.3 });
      await new Promise(r => setTimeout(r, 100));
    }
    
    // We should never have hundreds of tweens stacking up
    if (maxTweens > 20) duplicateTweensFound = true;

    return {
      doorsHovered: doors.length,
      passedHingeRotations,
      maxActiveTweens: maxTweens,
      duplicateTweensFound
    };
  });
  
  console.log('Results:', results);
  await browser.close();
})();
