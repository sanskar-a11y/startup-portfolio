const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== OVERLAY DOM STABILITY AUDIT ===');
  
  const result = await page.evaluate(async () => {
    // Initial nodes
    const initialNodes = document.querySelectorAll('*').length;
    const initialOverlays = document.querySelectorAll('div[style*="z-index: 9999"]').length;
    
    // Simulate navigation
    let targetObj = null;
    window.__SCENE__.traverse(c => {
       if (c.userData && c.userData.type === 'door' && c.userData.sectionId === 'about') {
           targetObj = c;
       }
    });

    // Enter room
    window.requestDoorActivation('about', targetObj);
    await new Promise(r => setTimeout(r, 2000)); // wait for full entry

    // Exit room
    window.requestRoomExit();
    await new Promise(r => setTimeout(r, 2000)); // wait for full exit
    
    // Enter room again
    window.requestDoorActivation('about', targetObj);
    await new Promise(r => setTimeout(r, 2000)); 
    
    const finalNodes = document.querySelectorAll('*').length;
    const finalOverlays = document.querySelectorAll('div[style*="z-index: 9999"]').length;
    
    return {
       initialNodes,
       finalNodes,
       initialOverlays,
       finalOverlays,
       nodeDiff: finalNodes - initialNodes
    };
  });
  
  console.log("DOM Stability Audit Results:", result);

  await browser.close();
})();
