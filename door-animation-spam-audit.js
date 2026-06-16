const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== DOOR ANIMATION SPAM AUDIT ===');
  
  const result1 = await page.evaluate(async () => {
    let peakTweens = 0;
    const interval = setInterval(() => {
      if (window.gsap && window.gsap.globalTimeline) {
         const count = window.gsap.globalTimeline.getChildren(true, true, true).length;
         if (count > peakTweens) peakTweens = count;
      }
    }, 10);
    
    let targetObj = null;
    window.__SCENE__.traverse(c => {
       if (c.userData && c.userData.type === 'door' && c.userData.sectionId === 'about') {
           targetObj = c;
       }
    });

    for (let i = 0; i < 50; i++) {
        window.requestDoorActivation('about', targetObj);
        await new Promise(r => setTimeout(r, 10));
        window.requestRoomExit();
        await new Promise(r => setTimeout(r, 10));
    }
    
    window.requestDoorActivation('about', targetObj);
    
    await new Promise(r => setTimeout(r, 1200));
    
    let finalRotation = targetObj ? targetObj.parent.rotation.y : -1;
    
    clearInterval(interval);
    
    return {
       peakTweens,
       finalRotation: parseFloat(finalRotation.toFixed(4)),
       expectedRotation: 1.5708
    };
  });
  
  console.log("Spam Audit Results:", result1);

  console.log('\n=== MID-ANIMATION EXIT AUDIT ===');
  
  const result2 = await page.evaluate(async () => {
    let peakTweens = 0;
    const interval = setInterval(() => {
      if (window.gsap && window.gsap.globalTimeline) {
         const count = window.gsap.globalTimeline.getChildren(true, true, true).length;
         if (count > peakTweens) peakTweens = count;
      }
    }, 10);
    
    window.requestRoomExit();
    await new Promise(r => setTimeout(r, 1200));
    
    let targetObj = null;
    window.__SCENE__.traverse(c => {
       if (c.userData && c.userData.type === 'door' && c.userData.sectionId === 'about') {
           targetObj = c;
       }
    });
    
    window.requestDoorActivation('about', targetObj);
    
    await new Promise(r => setTimeout(r, 500));
    
    window.requestRoomExit();
    
    await new Promise(r => setTimeout(r, 1200));
    
    let finalRotation = targetObj ? targetObj.parent.rotation.y : -1;
    
    clearInterval(interval);
    
    return {
       peakTweens,
       finalRotation: parseFloat(finalRotation.toFixed(4)),
       expectedRotation: 0
    };
  });
  
  console.log("Mid-Animation Exit Results:", result2);

  await browser.close();
})();
