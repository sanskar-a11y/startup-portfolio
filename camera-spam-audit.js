const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== CAMERA SPAM AUDIT ===');
  
  const result = await page.evaluate(async () => {
    // Expose gsap ticker
    let peakCameraTweens = 0;
    const countTweens = () => {
      const tweens = window.gsap.globalTimeline.getChildren(true, true, false);
      // count tweens affecting camera.position or camera.rotation
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
    let targetObj2 = null;
    window.__SCENE__.traverse(c => {
       if (c.userData && c.userData.type === 'door') {
           if (c.userData.sectionId === 'about') targetObj = c;
           if (c.userData.sectionId === 'projects') targetObj2 = c;
       }
    });

    // Spam click door A
    for (let i = 0; i < 20; i++) {
        window.requestDoorActivation('about', targetObj);
        await new Promise(r => setTimeout(r, 10));
    }
    
    // Spam click door B
    for (let i = 0; i < 20; i++) {
        window.requestDoorActivation('projects', targetObj2);
        await new Promise(r => setTimeout(r, 10));
    }

    await new Promise(r => setTimeout(r, 1500)); // wait for tweens to finish
    
    const finalTweens = countTweens();
    
    return {
       peakCameraTweens, // Expect 2 (one for position, one for rotation)
       finalTweens
    };
  });
  
  console.log("Spam Audit Results:", result);

  await browser.close();
})();
