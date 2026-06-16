const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== MID-NAVIGATION EXIT AUDIT ===');
  
  const result = await page.evaluate(async () => {
    let targetObj = null;
    window.__SCENE__.traverse(c => {
       if (c.userData && c.userData.type === 'door' && c.userData.sectionId === 'about') {
           targetObj = c;
       }
    });

    const startPos = { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z };

    // Trigger entry
    window.requestDoorActivation('about', targetObj);
    
    // Wait 500ms
    await new Promise(r => setTimeout(r, 500));
    
    const midPos = { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z };
    
    // Interrupt!
    window.requestRoomExit();
    
    // Check teleportation (wait 50ms, if it teleported, it would be instantly at 0,2,5)
    await new Promise(r => setTimeout(r, 50));
    const smoothPos = { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z };
    
    // Wait for reversal to finish
    await new Promise(r => setTimeout(r, 1000));
    const endPos = { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z };

    return {
       startPos,
       midPos,
       smoothPos,
       endPos,
       didTeleport: Math.abs(smoothPos.x - startPos.x) < 0.01 && Math.abs(smoothPos.z - startPos.z) < 0.01,
       didReverse: Math.abs(endPos.x - startPos.x) < 0.01 && Math.abs(endPos.z - startPos.z) < 0.01
    };
  });
  
  console.log("Mid-Navigation Audit Results:", result);

  await browser.close();
})();
