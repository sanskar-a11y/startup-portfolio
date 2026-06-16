/**
 * preloader.js
 * ============
 * Controls the 3-Layer Boot Sequence:
 * 1. Paper Tear: Counts to 100%, then tears the crumpled paper apart.
 * 2. House Landing: Reveals the house, waits for click, then opens the doors.
 * 3. 3D Corridor: Starts the WebGL experience.
 */

let paperPreloader = null;
let counterEl = null;
let paperCenter = null;
let houseLanding = null;

let lastTime = null;
let currentProgress = 0;
let isDestroyed = false;
let rafId = null;
let pageLoaded = typeof document !== 'undefined' && document.readyState === 'complete';
let hasFinished = false;

let loadHandler = () => { pageLoaded = true; };
if (typeof window !== 'undefined') window.addEventListener('load', loadHandler);

function easeOutQuad(t) { return t * (2 - t); }

function tick(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  if (pageLoaded) {
    currentProgress += delta / 500;
  } else {
    currentProgress = Math.min(currentProgress + delta * (0.9 / 3000), 0.9);
  }

  const rawProgress = Math.min(currentProgress, 1);
  const eased = easeOutQuad(rawProgress);
  const percent = Math.round(eased * 100);

  if (counterEl) counterEl.textContent = `${percent}%`;

  if (rawProgress < 1 && !isDestroyed) {
    rafId = requestAnimationFrame(tick);
  } else if (!isDestroyed) {
    onLoadingComplete();
  }
}

function onLoadingComplete() {
  if (hasFinished) return;
  hasFinished = true;

  // 1. Tear the paper!
  if (paperPreloader) {
    paperPreloader.classList.add('torn');
    
    // Hide center element (percentage and circles)
    if (paperCenter) {
      paperCenter.style.opacity = '0';
    }

    // Make house landing visible behind the tear
    if (houseLanding) {
      houseLanding.style.visibility = 'visible';
    }

    // Wait for the paper tear transition to end, then bind click to house
    setTimeout(() => {
      paperPreloader.style.display = 'none'; // remove paper completely
      activateHouseLanding();
    }, 1500); // 1.5s matches CSS transition duration
  } else {
    // Fallback if no DOM
    document.dispatchEvent(new CustomEvent('preloaderComplete'));
  }
}

function activateHouseLanding() {
  if (!houseLanding) return;
  houseLanding.classList.add('ready');
  houseLanding.addEventListener('click', triggerEntrance);
}

function triggerEntrance() {
  houseLanding.removeEventListener('click', triggerEntrance);
  
  const overlay = document.getElementById('house-overlay');
  if (overlay) overlay.style.opacity = '0';

  // 1. Open the doors
  houseLanding.classList.add('doors-open');

  // 2. Zoom into the doorway
  setTimeout(() => {
    houseLanding.classList.add('zooming');
  }, 400);

  // 3. Split the image in half
  setTimeout(() => {
    houseLanding.classList.add('opened');
  }, 1400);

  // 4. Finish and reveal 3D scene
  setTimeout(() => {
    houseLanding.style.display = 'none';
    document.body.classList.remove('no-scroll');
    document.dispatchEvent(new CustomEvent('preloaderComplete'));
  }, 2400);
}

export function init() {
  paperPreloader = document.getElementById('paper-preloader');
  counterEl = document.getElementById('preloader-percentage');
  paperCenter = document.getElementById('paper-center');
  houseLanding = document.getElementById('house-landing');

  if (!paperPreloader) {
    document.dispatchEvent(new CustomEvent('preloaderComplete'));
    return;
  }

  document.body.classList.add('no-scroll');
  isDestroyed = false;
  rafId = requestAnimationFrame(tick);
}

export function destroy() {
  isDestroyed = true;
  if (rafId) cancelAnimationFrame(rafId);
  if (loadHandler) window.removeEventListener('load', loadHandler);
}
