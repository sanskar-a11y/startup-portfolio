const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log("=== LAUNCHING BRUTAL DYNAMIC AUDIT ===");
  const browser = await puppeteer.launch({ headless: 'new', protocolTimeout: 0 });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));

  // Track metrics
  const getMetrics = async () => {
     return await page.evaluate(() => {
        return {
           nodes: document.querySelectorAll('*').length,
           geometries: window.__RENDERER__?.info.memory.geometries || 0,
           textures: window.__RENDERER__?.info.memory.textures || 0,
           programs: window.__RENDERER__?.info.programs?.length || 0,
           tweens: window.gsap?.globalTimeline.getChildren(true, true, false).length || 0
        };
     });
  };

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  const initialMetrics = await getMetrics();
  console.log("Initial Metrics:", initialMetrics);

  console.log("--- Executing 500 Room Entries/Exits ---");
  await page.evaluate(async () => {
    const door = Object.values(window.__DOOR_CALLBACKS__)[0];
    const roomId = Object.keys(window.__DOOR_CALLBACKS__)[0];
    
    let targetObj = null;
    window.__SCENE__.traverse(c => {
       if (c.userData && c.userData.type === 'door' && c.userData.sectionId === roomId) {
           targetObj = c;
       }
    });

    for(let i=0; i<500; i++) {
       window.requestDoorActivation(roomId, targetObj);
       await new Promise(r => setTimeout(r, 200)); // Don't wait full, we want to stress it
       window.requestRoomExit();
       await new Promise(r => setTimeout(r, 200));
    }
  });

  const postEntryExit = await getMetrics();
  console.log("Post Entry/Exit Metrics:", postEntryExit);
  
  console.log("--- Executing 500 Hover Transitions ---");
  await page.evaluate(async () => {
    const roomId = Object.keys(window.__DOOR_CALLBACKS__)[0];
    const callbacks = window.__DOOR_CALLBACKS__[roomId];
    for(let i=0; i<500; i++) {
        callbacks.enter();
        await new Promise(r => setTimeout(r, 20));
        callbacks.exit();
        await new Promise(r => setTimeout(r, 20));
    }
  });
  
  const postHover = await getMetrics();
  console.log("Post Hover Metrics:", postHover);

  console.log("--- Executing 500 Camera Interruptions ---");
  await page.evaluate(async () => {
    const roomId = Object.keys(window.__DOOR_CALLBACKS__)[0];
    let targetObj = null;
    window.__SCENE__.traverse(c => {
       if (c.userData && c.userData.type === 'door' && c.userData.sectionId === roomId) {
           targetObj = c;
       }
    });

    for(let i=0; i<500; i++) {
       window.requestDoorActivation(roomId, targetObj);
       await new Promise(r => setTimeout(r, 50)); // interrupt immediately
       window.requestRoomExit();
       await new Promise(r => setTimeout(r, 50));
    }
  });
  
  const postInterrupts = await getMetrics();
  console.log("Post Interrupt Metrics:", postInterrupts);

  console.log("--- Executing 100 Reload Cycles ---");
  for(let i=0; i<100; i++) {
     await page.reload({ waitUntil: 'load' });
     await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
     await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  }
  
  const postReload = await getMetrics();
  console.log("Post Reload Metrics:", postReload);

  await browser.close();
  
  console.log("\n=== AUDIT COMPLETE ===");
})();
