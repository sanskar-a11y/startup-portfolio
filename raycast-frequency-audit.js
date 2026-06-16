const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });

  await page.evaluate(() => {
    document.dispatchEvent(new Event('preloaderComplete'));
  });

  // Wait for React to finish rendering and VanillaBridge to mount
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log(`\n=== RAYCAST FREQUENCY AUDIT ===`);

  // Reset count
  await page.evaluate(() => {
    window.__RAYCAST_COUNT = 0;
  });

  // 1. Idle test
  await new Promise(r => setTimeout(r, 1000));
  const idleCount = await page.evaluate(() => window.__RAYCAST_COUNT);
  console.log(`Idle: ${idleCount} raycasts / sec`);

  // Reset
  await page.evaluate(() => { window.__RAYCAST_COUNT = 0; });

  // 2. Moving test
  for (let i = 0; i < 10; i++) {
    await page.mouse.move(100 + i * 10, 100 + i * 10);
    await new Promise(r => setTimeout(r, 100)); // 100ms per move
  }
  const moveCount = await page.evaluate(() => window.__RAYCAST_COUNT);
  console.log(`Moving: ${moveCount} raycasts / sec`);

  // Reset
  await page.evaluate(() => { window.__RAYCAST_COUNT = 0; });

  // 3. Hovering test (finding door and hovering on it repeatedly)
  const doorPos = await page.evaluate(() => {
    // Find the first door
    const interactiveObjects = [];
    window.__SCENE__.traverse(obj => {
      if (obj.userData && obj.userData.type === 'door') {
        interactiveObjects.push(obj);
      }
    });
    const firstDoor = interactiveObjects.find(obj => obj.userData.side);
    if (!firstDoor) return null;
    
    // Project to screen space
    const vector = new window.THREE.Vector3();
    firstDoor.getWorldPosition(vector);
    
    // Convert to screen space
    // Simple mock coordinates if camera is known, or just a general middle of the screen
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  });

  if (doorPos) {
    for (let i = 0; i < 10; i++) {
      await page.mouse.move(doorPos.x + i % 2, doorPos.y + i % 2);
      await new Promise(r => setTimeout(r, 100)); // 100ms per move
    }
  }

  const hoverCount = await page.evaluate(() => window.__RAYCAST_COUNT);
  console.log(`Door Hover: ${hoverCount} raycasts / sec`);

  await browser.close();
})();
