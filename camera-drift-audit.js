const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== CAMERA DRIFT AUDIT ===');
  
  const result = await page.evaluate(async () => {
    let targetObj = null;
    window.__SCENE__.traverse(c => {
       if (c.userData && c.userData.type === 'door' && c.userData.sectionId === 'about') {
           targetObj = c;
       }
    });

    const startPos = { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z };

    // Enter and exit 10 times
    for (let i = 0; i < 10; i++) {
        window.requestDoorActivation('about', targetObj);
        await new Promise(r => setTimeout(r, 1200));
        
        window.requestRoomExit();
        await new Promise(r => setTimeout(r, 1200));
    }
    
    const endPos = { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z };

    return {
       startPos,
       endPos,
       driftX: Math.abs(endPos.x - startPos.x),
       driftY: Math.abs(endPos.y - startPos.y),
       driftZ: Math.abs(endPos.z - startPos.z),
    };
  });
  
  console.log("Drift Audit Results:", result);

  await browser.close();
})();
