const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Intercept requests to inject window hooks without modifying the source files
  await page.setRequestInterception(true);
  page.on('request', async request => {
    if (request.url().endsWith('/js/webgl-corridor.js')) {
      const filePath = path.join('d:/work/startup portfolio/js/webgl-corridor.js');
      let content = fs.readFileSync(filePath, 'utf8');
      content += `\nwindow.__RENDERER__ = renderer; window.__SCENE__ = scene; window.__INTERACTIVE__ = interactiveObjects;`;
      request.respond({
        status: 200,
        contentType: 'application/javascript',
        body: content
      });
    } else if (request.url().endsWith('/js/room-manager.js')) {
      const filePath = path.join('d:/work/startup portfolio/js/room-manager.js');
      let content = fs.readFileSync(filePath, 'utf8');
      content += `\nwindow.__ROOM_SCENES__ = roomScenes; window.__ACTIVE_ROOM_ID__ = () => activeRoomId; window.__ENTER_ROOM__ = enterRoom; window.__EXIT_ROOM__ = exitRoom;`;
      request.respond({
        status: 200,
        contentType: 'application/javascript',
        body: content
      });
    } else {
      request.continue();
    }
  });

  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

  // Speed up GSAP
  await page.evaluate(() => {
    if (window.gsap) window.gsap.globalTimeline.timeScale(20);
  });

  async function getMetrics() {
    return await page.evaluate(() => {
      let geoCount = 0;
      let texCount = 0;
      let renderCalls = 0;
      let renderTriangles = 0;

      if (window.__RENDERER__ && window.__RENDERER__.info) {
        geoCount = window.__RENDERER__.info.memory.geometries;
        texCount = window.__RENDERER__.info.memory.textures;
        renderCalls = window.__RENDERER__.info.render.calls;
        renderTriangles = window.__RENDERER__.info.render.triangles;
      }

      let activeRoomId = window.__ACTIVE_ROOM_ID__ ? window.__ACTIVE_ROOM_ID__() : null;
      let roomSceneCount = window.__ROOM_SCENES__ ? Object.keys(window.__ROOM_SCENES__).length : 0;
      let activeRoomSceneCount = activeRoomId && window.__ROOM_SCENES__[activeRoomId] ? 1 : 0;
      
      let meshCount = 0;
      let materialCount = new Set();
      
      // Count main corridor
      if (window.__SCENE__) {
        window.__SCENE__.traverse(obj => {
          if (obj.isMesh) {
            meshCount++;
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach(m => materialCount.add(m.uuid));
              } else {
                materialCount.add(obj.material.uuid);
              }
            }
          }
        });
      }

      // Count active room
      if (activeRoomSceneCount && window.__ROOM_SCENES__[activeRoomId]) {
        window.__ROOM_SCENES__[activeRoomId].traverse(obj => {
          if (obj.isMesh) {
            meshCount++;
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach(m => materialCount.add(m.uuid));
              } else {
                materialCount.add(obj.material.uuid);
              }
            }
          }
        });
      }

      let raycastTargets = window.__INTERACTIVE__ ? window.__INTERACTIVE__.length : 0;

      return {
        sceneCount: 1 + activeRoomSceneCount, // 1 for corridor + 1 if room active
        roomSceneDictLength: roomSceneCount,
        geoCount,
        texCount,
        meshCount,
        matCount: materialCount.size,
        raycastTargets,
        renderCalls,
        renderTriangles
      };
    });
  }

  const printMetrics = (label, m) => {
    console.log(`\n--- ${label} ---`);
    console.log(`Scene Count:          ${m.sceneCount} (Corridor: 1, Active Room: ${m.sceneCount - 1})`);
    console.log(`Room Registry Scenes: ${m.roomSceneDictLength} stored in memory dict`);
    console.log(`Geometry Count:       ${m.geoCount} (renderer.info.memory)`);
    console.log(`Texture Count:        ${m.texCount} (renderer.info.memory)`);
    console.log(`Mesh Count:           ${m.meshCount} (Active Scenes)`);
    console.log(`Material Count:       ${m.matCount} (Active Scenes)`);
    console.log(`Raycast Targets:      ${m.raycastTargets} (interactiveObjects)`);
    console.log(`Render Calls:         ${m.renderCalls}`);
    console.log(`Render Triangles:     ${m.renderTriangles}`);
  };

  console.log('STARTING FINAL CERTIFICATION AUDIT');
  
  // Wait for initial load
  await new Promise(r => setTimeout(r, 1000));
  let mBaseline = await getMetrics();
  printMetrics('BASELINE (CORRIDOR ONLY)', mBaseline);

  for (let i = 1; i <= 10; i++) {
    console.log(`\n================ CYCLE ${i} ================`);
    
    // Enter room (Programmatic)
    await page.evaluate(() => {
      if (window.__ENTER_ROOM__) window.__ENTER_ROOM__('about', { position: { x: -4, y: 0, z: -20 }, rotation: { y: Math.PI / 2 } });
    });
    await new Promise(r => setTimeout(r, 600)); // wait for transition
    
    let mRoom = await getMetrics();
    printMetrics(`INSIDE ROOM (Cycle ${i})`, mRoom);
    
    // Exit room (Programmatic)
    await page.evaluate(() => {
      if (window.__EXIT_ROOM__) window.__EXIT_ROOM__();
    });
    await new Promise(r => setTimeout(r, 600));
    
    let mExit = await getMetrics();
    printMetrics(`RETURN TO CORRIDOR (Cycle ${i})`, mExit);
  }

  await browser.close();
})();
