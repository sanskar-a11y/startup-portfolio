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

  console.log(`\n=== RAYCAST PARITY BASELINE ===`);
  
  const results = await page.evaluate(async () => {
    // 1. Count doors
    let doorCount = 0;
    let interactiveTargets = 0;
    let hoverTargets = 0;
    let clickTargets = 0;

    // In vanilla, interactiveObjects contains all clickable meshes
    // Since we don't have direct access to interactiveObjects from window,
    // we can traverse the scene and find them based on userData
    const interactiveObjects = [];
    window.__SCENE__.traverse(obj => {
      if (obj.userData && obj.userData.type === 'door') {
        interactiveObjects.push(obj);
        if (obj.userData.side) {
          // Main door mesh
          doorCount++;
          hoverTargets++;
        }
        clickTargets++;
      }
    });

    interactiveTargets = interactiveObjects.length;

    // 2. Perform a raycast against the first door
    // We can simulate a mouse move to the center of the screen where a door might be,
    // or just manually use THREE.Raycaster against the objects.
    
    // We'll manually raycast from the camera towards the first door mesh
    if (!window.THREE) return { error: 'window.THREE is not available' };
    const ray = new window.THREE.Raycaster();

    // Find the first door mesh
    const firstDoor = interactiveObjects.find(obj => obj.userData.side);
    if (!firstDoor) return { error: 'No door mesh found' };

    // Get world position of the door center
    const doorPos = new window.THREE.Vector3();
    firstDoor.getWorldPosition(doorPos);

    // Raycast from origin (0,2,5) towards door
    const origin = new window.THREE.Vector3(0, 2, 5);
    const direction = new window.THREE.Vector3().subVectors(doorPos, origin).normalize();
    
    ray.set(origin, direction);
    const intersects = ray.intersectObjects(interactiveObjects, true);

    const raycastHits = intersects.length;

    return {
      doorCount,
      interactiveTargets,
      hoverTargets,
      clickTargets,
      raycastHits
    };
  });
  
  console.log('Results:', results);
  await browser.close();
})();
