const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== CAPTURING CAMERA GSAP GOLDEN MASTER ===');
  
  const results = await page.evaluate(async () => {
    const data = {
      roomEntry: {},
      roomExit: {}
    };
    
    // Helper to get all doors
    const doors = [];
    window.__SCENE__.traverse(c => {
       if (c.userData && c.userData.type === 'door' && c.userData.sectionId) {
           doors.push(c);
       }
    });

    for (const door of doors) {
      const roomId = door.userData.sectionId;
      console.log(`Auditing room: ${roomId}`);
      
      data.roomEntry[roomId] = {};
      data.roomExit[roomId] = {};
      
      // -- ENTRY AUDIT --
      const startEntry = {
        pos: { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z },
        rot: { x: window.__CAMERA_EXPOSED__().rotation.x, y: window.__CAMERA_EXPOSED__().rotation.y, z: window.__CAMERA_EXPOSED__().rotation.z }
      };
      
      window.requestDoorActivation(roomId, door);
      
      await new Promise(r => setTimeout(r, 500)); // midpoint
      
      const midEntry = {
        pos: { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z },
        rot: { x: window.__CAMERA_EXPOSED__().rotation.x, y: window.__CAMERA_EXPOSED__().rotation.y, z: window.__CAMERA_EXPOSED__().rotation.z }
      };
      
      await new Promise(r => setTimeout(r, 800)); // end (1300ms total to ensure completion of 1000ms tween)
      
      const endEntry = {
        pos: { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z },
        rot: { x: window.__CAMERA_EXPOSED__().rotation.x, y: window.__CAMERA_EXPOSED__().rotation.y, z: window.__CAMERA_EXPOSED__().rotation.z }
      };
      
      data.roomEntry[roomId] = { start: startEntry, mid: midEntry, end: endEntry };
      
      await new Promise(r => setTimeout(r, 500)); // wait for room transition
      
      // -- EXIT AUDIT --
      const startExit = {
        pos: { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z },
        rot: { x: window.__CAMERA_EXPOSED__().rotation.x, y: window.__CAMERA_EXPOSED__().rotation.y, z: window.__CAMERA_EXPOSED__().rotation.z }
      };
      
      window.requestRoomExit();
      
      await new Promise(r => setTimeout(r, 300)); // midpoint (fade takes 300ms, wait wait, room exit doesn't tween the camera back!)
      
      // wait for exit transition
      await new Promise(r => setTimeout(r, 500)); 
      
      const endExit = {
        pos: { x: window.__CAMERA_EXPOSED__().position.x, y: window.__CAMERA_EXPOSED__().position.y, z: window.__CAMERA_EXPOSED__().position.z },
        rot: { x: window.__CAMERA_EXPOSED__().rotation.x, y: window.__CAMERA_EXPOSED__().rotation.y, z: window.__CAMERA_EXPOSED__().rotation.z }
      };
      
      // Room exit is immediate teleport under a mask, not a 1000ms tween.
      data.roomExit[roomId] = { start: startExit, end: endExit };
      
      await new Promise(r => setTimeout(r, 500)); // wait before next door
    }
    
    return data;
  });

  fs.writeFileSync('camera-gsap-baseline.json', JSON.stringify(results, null, 2));
  console.log("Golden Master Baseline saved to camera-gsap-baseline.json");

  await browser.close();
})();
