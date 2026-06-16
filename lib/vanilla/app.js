/**
 * app.js
 * ======
 * Main orchestrator for the ITomDev portfolio.
 *
 * – Imports every feature module
 * – Starts the preloader immediately on DOMContentLoaded
 * – After preloaderComplete, initialises all other modules
 * – Manages smooth-scroll navigation, entrance hints, and body overflow
 *
 * Include in HTML with:
 *   <script type="module" src="js/app.js"></script>
 */

/* ── Imports ───────────────────────────────────────────────────────── */

import { init as initPreloader, destroy as destroyPreloader }    from './preloader.js';
import { init as initNavigation, destroy as destroyNavigation }   from './navigation.js';
import { init as initAnimations, destroy as destroyAnimations }   from './animations.js';
import { init as initAchievements, destroy as destroyAchievements } from './achievements.js';
import { init as initAudio }        from './audio.js';
import { init as initWebGLCorridor, dispose as disposeWebGLCorridor } from './webgl-corridor';

/* ── Smooth scroll for anchor links ────────────────────────────────── */

/**
 * Smooth scroll disabled in favor of WebGL virtual scrolling
 */
function initSmoothScroll() {
  // Navigation anchors are disabled since the experience is 3D now
}

/* ── Entrance / corridor hint ──────────────────────────────────────── */

/**
 * Shows the entrance hint element briefly, then fades it out once the
 * user scrolls or interacts.
 */
let entranceHintDismiss = null;
let entranceHintTimer = null;

function initEntranceHint() {
  const hint = document.querySelector('.entrance-hint');
  if (!hint) return;

  // Make the hint visible
  requestAnimationFrame(() => {
    hint.classList.add('visible');
  });

  entranceHintDismiss = function() {
    hint.classList.remove('visible');
    hint.classList.add('fading');

    window.removeEventListener('scroll', entranceHintDismiss);
    document.removeEventListener('click', entranceHintDismiss);
    document.removeEventListener('keydown', entranceHintDismiss);

    hint.addEventListener('transitionend', () => {
      hint.remove();
    }, { once: true });
  };

  window.addEventListener('scroll', entranceHintDismiss, { once: true, passive: true });
  document.addEventListener('click', entranceHintDismiss, { once: true });
  document.addEventListener('keydown', entranceHintDismiss, { once: true });

  entranceHintTimer = setTimeout(() => {
    if (hint.classList.contains('visible') && entranceHintDismiss) {
      entranceHintDismiss();
    }
  }, 6000);
}

/* ── Corridor hint animation ───────────────────────────────────────── */

/**
 * Handles the corridor hint arrow animation that pulses to invite the
 * user to scroll down.
 */
let corridorHintDismiss = null;
let corridorHintTimer = null;

function initCorridorHint() {
  const corridorHint = document.querySelector('.corridor-hint');
  if (!corridorHint) return;

  corridorHintTimer = setTimeout(() => {
    corridorHint.classList.add('visible');
  }, 500);

  corridorHintDismiss = function() {
    corridorHint.classList.remove('visible');
    corridorHint.classList.add('hidden');
    window.removeEventListener('wheel', corridorHintDismiss);
    window.removeEventListener('touchstart', corridorHintDismiss);
  };
  window.addEventListener('wheel', corridorHintDismiss, { passive: true });
  window.addEventListener('touchstart', corridorHintDismiss, { passive: true });
}

/* ── Body overflow management ──────────────────────────────────────── */

/**
 * The preloader module handles adding no-scroll.
 * For the WebGL architecture, we KEEP scrolling locked globally.
 */
function enableScrolling() {
  // Do NOT remove overflow hidden, virtual scrolling requires it locked
}

/* ── Post-preloader bootstrap ──────────────────────────────────────── */

let isBooted = false;

function onPreloaderComplete() {
  enableScrolling();

  // Initialise core modules
  initNavigation();
  initAnimations();
  initAchievements();
  initAudio();
  // initWebGLCorridor() is called in boot() already

  // Smooth scroll & hints
  initSmoothScroll();
  initEntranceHint();
  initCorridorHint();
}

/* ── Entry point ───────────────────────────────────────────────────── */

export function boot(config) {
  if (isBooted) return;
  isBooted = true;

  // Initialize the WebGL Corridor, passing R3F Context
  if (typeof initWebGLCorridor === 'function') {
    initWebGLCorridor(config);
  }

  // Bypass the legacy preloader entirely because LandingPage.tsx 
  // handles the entrance sequence natively in React.
  onPreloaderComplete();
}

export function destroy() {
  if (!isBooted) return;
  
  document.removeEventListener('preloaderComplete', onPreloaderComplete);
  
  // Clean up global hints
  if (entranceHintDismiss) {
    window.removeEventListener('scroll', entranceHintDismiss);
    document.removeEventListener('click', entranceHintDismiss);
    document.removeEventListener('keydown', entranceHintDismiss);
  }
  if (entranceHintTimer) clearTimeout(entranceHintTimer);
  
  if (corridorHintDismiss) {
    window.removeEventListener('wheel', corridorHintDismiss);
    window.removeEventListener('touchstart', corridorHintDismiss);
  }
  if (corridorHintTimer) clearTimeout(corridorHintTimer);
  
  // Dispose all sub-modules deeply
  if (typeof destroyPreloader === 'function') destroyPreloader();
  if (typeof destroyNavigation === 'function') destroyNavigation();
  if (typeof destroyAnimations === 'function') destroyAnimations();
  if (typeof destroyAchievements === 'function') destroyAchievements();
  if (typeof disposeWebGLCorridor === 'function') disposeWebGLCorridor();
  
  // Reset state
  isBooted = false;
  document.body.classList.remove('no-scroll');
}
