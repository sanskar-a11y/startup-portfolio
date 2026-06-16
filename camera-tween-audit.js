const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== TWEEN COMPLETION AUDIT ===');
  
  const result = await page.evaluate(async () => {
    // Expose gsap ticker
    let peakCameraTweens = 0;
    const countTweens = () => {
      const tweens = window.gsap.globalTimeline.getChildren(true, true, false);
      let count = 0;
      for (const t of tweens) {
         if (t.targets && t.targets().length > 0) {
             const target = t.targets()[0];
             if (target === window.__CAMERA_EXPOSED__().position || target === window.__CAMERA_EXPOSED__().rotation) {
                 count++;
             }
         }
      }
      return count;
    };
    
    window.gsap.ticker.add(() => {
      const count = countTweens();
      if (count > peakCameraTweens) peakCameraTweens = count;
    });

    let targetObj = null;
    window.__SCENE__.traverse(c => {
       if (c.userData && c.userData.type === 'door' && c.userData.sectionId === 'about') {
           targetObj = c;
       }
    });

    const startPos = { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z };

    const intervals = [250, 500, 750]; // 25%, 50%, 75%
    
    for (let i = 0; i < 50; i++) {
        const interruptDelay = intervals[i % 3];
        
        window.requestDoorActivation('about', targetObj);
        await new Promise(r => setTimeout(r, interruptDelay));
        
        window.requestRoomExit();
        await new Promise(r => setTimeout(r, 1500)); // wait for full reversal
    }
    
    const endPos = { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z };

    return {
       peakCameraTweens, // Expect 2
       finalTweens: countTweens(), // Expect 0
       driftX: Math.abs(endPos.x - startPos.x),
       driftY: Math.abs(endPos.y - startPos.y),
       driftZ: Math.abs(endPos.z - startPos.z),
    };
  });
  
  console.log("Tween Completion Audit Results:", result);

  await browser.close();
})();
