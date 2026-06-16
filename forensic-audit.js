const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Inject hooks to capture Three.js internals without modifying source code
  await page.evaluateOnNewDocument(() => {
    window.__FORENSICS__ = {
      renderers: [],
      lastScene: null,
      raycastTargetCount: 0,
      activeScenesCount: 0 // Cannot reliably track total scenes without tracking Scene constructor, let's do that
    };

    let sceneCount = 0;
    // We must wait for THREE to be defined, but evaluateOnNewDocument runs before scripts.
    // We will hook into THREE once it's available.
    Object.defineProperty(window, 'THREE', {
      configurable: true,
      enumerable: true,
      get: function() {
        return this._THREE;
      },
      set: function(val) {
        this._THREE = val;
        
        // Hook Scene
        const originalScene = val.Scene;
        val.Scene = function() {
          sceneCount++;
          const scene = new originalScene();
          return scene;
        };
        val.Scene.prototype = originalScene.prototype;
        
        window.__FORENSICS__.getSceneCount = () => sceneCount;

        // Hook WebGLRenderer
        const originalRender = val.WebGLRenderer.prototype.render;
        val.WebGLRenderer.prototype.render = function(scene, camera) {
          if (!window.__FORENSICS__.renderers.includes(this)) {
            window.__FORENSICS__.renderers.push(this);
          }
          window.__FORENSICS__.lastScene = scene;
          return originalRender.apply(this, arguments);
        };

        // Hook Raycaster
        const originalIntersect = val.Raycaster.prototype.intersectObjects;
        val.Raycaster.prototype.intersectObjects = function(objects, recursive) {
          window.__FORENSICS__.raycastTargetCount = objects.length;
          return originalIntersect.apply(this, arguments);
        };
      }
    });
  });

  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

  // Accelerate GSAP timeline dramatically to run 1000 cycles quickly
  await page.evaluate(() => {
    if (window.gsap) {
      window.gsap.globalTimeline.timeScale(20); // 20x faster
    }
  });

  async function getMetrics() {
    return await page.evaluate(() => {
      const memory = performance.memory || { usedJSHeapSize: 0 };
      const domNodes = document.querySelectorAll('*').length;
      
      const renderer = window.__FORENSICS__.renderers[0];
      let geometries = 0;
      let textures = 0;
      
      if (renderer && renderer.info) {
        geometries = renderer.info.memory.geometries;
        textures = renderer.info.memory.textures;
      }

      // Count meshes and materials in the current scene
      let meshes = 0;
      let materials = new Set();
      if (window.__FORENSICS__.lastScene) {
        window.__FORENSICS__.lastScene.traverse(obj => {
          if (obj.isMesh) {
            meshes++;
            if (obj.material) materials.add(obj.material.uuid);
          }
        });
      }

      return {
        heapMB: (memory.usedJSHeapSize / 1048576).toFixed(2),
        domNodes,
        scenesCreated: window.__FORENSICS__.getSceneCount ? window.__FORENSICS__.getSceneCount() : 0,
        geometries,
        textures,
        activeMeshes: meshes,
        activeMaterials: materials.size,
        raycastTargets: window.__FORENSICS__.raycastTargetCount
      };
    });
  }

  console.log('Starting 1000 Room-Entry / Room-Exit Forensic Audit...');
  console.log('Cycles | Heap (MB) | DOM | Scenes | Geo | Tex | Meshes | Mats | Raycast');
  console.log('-------------------------------------------------------------------------');

  let initialMetrics = await getMetrics();
  console.log(`0      | ${initialMetrics.heapMB.padEnd(9)} | ${String(initialMetrics.domNodes).padEnd(3)} | ${String(initialMetrics.scenesCreated).padEnd(6)} | ${String(initialMetrics.geometries).padEnd(3)} | ${String(initialMetrics.textures).padEnd(3)} | ${String(initialMetrics.activeMeshes).padEnd(6)} | ${String(initialMetrics.activeMaterials).padEnd(4)} | ${initialMetrics.raycastTargets}`);

  for (let i = 1; i <= 1000; i++) {
    // Click Door (simulate Raycast hit by clicking center)
    await page.mouse.click(page.viewport().width / 2, page.viewport().height / 2);
    
    // Wait for accelerated GSAP transition (1000ms / 20 = 50ms + 300ms fade)
    await new Promise(r => setTimeout(r, 400));
    
    // Click Exit Door
    await page.mouse.click(page.viewport().width / 2, page.viewport().height / 2);
    
    // Wait for accelerated fade
    await new Promise(r => setTimeout(r, 350));

    if (i === 100 || i === 500 || i === 1000) {
      // Force GC if available
      try { await page.evaluate(() => window.gc && window.gc()); } catch(e){}
      
      let m = await getMetrics();
      console.log(`${String(i).padEnd(6)} | ${m.heapMB.padEnd(9)} | ${String(m.domNodes).padEnd(3)} | ${String(m.scenesCreated).padEnd(6)} | ${String(m.geometries).padEnd(3)} | ${String(m.textures).padEnd(3)} | ${String(m.activeMeshes).padEnd(6)} | ${String(m.activeMaterials).padEnd(4)} | ${m.raycastTargets}`);
    }
  }

  console.log('Forensic Audit Complete.');
  await browser.close();
})();
