/**
 * navigation.js
 * =============
 * Navigation & panel management for the ITomDev portfolio.
 *
 * Responsibilities:
 *  – Toggle slide-down panels: map, audio, achievements
 *  – Hamburger menu with full-screen overlay
 *  – Only one panel open at a time
 *  – Click-outside and Escape key close open panels
 *  – Back button visibility (visible when scrolled past hero)
 *  – Smooth transitions via CSS classes (.open, .exiting)
 *  – Mobile responsive behaviour
 *
 * Usage:
 *   import { init } from './navigation.js';
 *   init();
 */

/* ── DOM references ────────────────────────────────────────────────── */

let mapBtn          = null;
let audioBtn        = null;
let achievementsBtn = null;
let hamburgerBtn    = null;

let mapPanel          = null;
let audioPanel        = null;
let achievementsPanel = null;
let menuOverlay       = null;

let mapCloseBtn          = null;
let audioCloseBtn        = null;
let achievementsCloseBtn = null;
let menuCloseBtn         = null;

let backBtn = null;
let heroSection = null;

/* ── State ──────────────────────────────────────────────────────────── */

/** Reference to the currently open panel element (or null) */
let activePanel = null;

/** Whether the full-screen menu overlay is open */
let menuOpen = false;

let closePanelTimer = null;
let closeMenuTimer = null;

/* ── Panel helpers ─────────────────────────────────────────────────── */

/**
 * Open a slide-down panel.  Closes any other open panel first.
 * @param {HTMLElement} panel – the panel element to open
 */
function openPanel(panel) {
  if (!panel) return;

  // If another panel is already open, close it immediately
  if (activePanel && activePanel !== panel) {
    closePanelImmediate(activePanel);
  }

  // Close menu overlay if it's open
  if (menuOpen) closeMenu();

  panel.classList.remove('exiting');
  panel.classList.add('open');
  activePanel = panel;

  // Dispatch event for other modules (e.g. achievements)
  document.dispatchEvent(
    new CustomEvent('panelOpened', { detail: { panel: panel.id } })
  );
}

/**
 * Close a panel with the exit transition.
 * @param {HTMLElement} panel – the panel to close
 */
function closePanel(panel) {
  if (!panel || !panel.classList.contains('open')) return;

  panel.classList.add('exiting');

  if (closePanelTimer) {
    clearTimeout(closePanelTimer);
    closePanelTimer = null;
  }

  // Wait for the CSS transition to finish, then clean up
  const onEnd = () => {
    panel.classList.remove('open', 'exiting');
    panel.removeEventListener('transitionend', onEnd);
    if (activePanel === panel) activePanel = null;
    if (closePanelTimer) {
      clearTimeout(closePanelTimer);
      closePanelTimer = null;
    }
  };

  panel.addEventListener('transitionend', onEnd);

  // Safety: if transitionend doesn't fire within 600ms, force cleanup
  closePanelTimer = setTimeout(onEnd, 600);
}

/**
 * Close a panel instantly (no exit animation).
 * Used when swapping panels so only one is visible at a time.
 */
function closePanelImmediate(panel) {
  if (!panel) return;
  panel.classList.remove('open', 'exiting');
  if (activePanel === panel) activePanel = null;
}

/**
 * Close whatever panel is currently active (if any).
 */
function closeActivePanel() {
  if (activePanel) closePanel(activePanel);
}

/* ── Menu overlay ──────────────────────────────────────────────────── */

function openMenu() {
  if (!menuOverlay) return;
  closeActivePanel(); // close any slide-down panel first

  menuOverlay.classList.add('open');
  hamburgerBtn?.classList.add('active');
  menuOpen = true;
}

function closeMenu() {
  if (!menuOverlay) return;

  menuOverlay.classList.add('exiting');
  hamburgerBtn?.classList.remove('active');

  if (closeMenuTimer) {
    clearTimeout(closeMenuTimer);
    closeMenuTimer = null;
  }

  const onEnd = () => {
    menuOverlay.classList.remove('open', 'exiting');
    menuOverlay.removeEventListener('transitionend', onEnd);
    menuOpen = false;
    if (closeMenuTimer) {
      clearTimeout(closeMenuTimer);
      closeMenuTimer = null;
    }
  };

  menuOverlay.addEventListener('transitionend', onEnd);
  closeMenuTimer = setTimeout(onEnd, 600);
}

function toggleMenu() {
  menuOpen ? closeMenu() : openMenu();
}

/* ── Back button visibility ────────────────────────────────────────── */

/**
 * Back button visibility (Disabled for WebGL)
 */
function initBackButton() {
  // Back to top is disabled since we are in 3D
}

/* ── Event wiring ──────────────────────────────────────────────────── */

function bindPanelToggle(btn, panel, closeBtn) {
  if (btn && panel) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.classList.contains('open')) {
        closePanel(panel);
      } else {
        openPanel(panel);
      }
    });
  }

  if (closeBtn && panel) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel(panel);
    });
  }
}

/**
 * Close panels when clicking anywhere outside them.
 */
function handleClickOutside(e) {
  // Don't interfere if clicking a toggle button (handled above)
  const isToggleBtn = [mapBtn, audioBtn, achievementsBtn, hamburgerBtn].some(
    (btn) => btn && btn.contains(e.target)
  );
  if (isToggleBtn) return;

  // Close active slide-down panel if click is outside
  if (activePanel && !activePanel.contains(e.target)) {
    closePanel(activePanel);
  }

  // Close menu overlay if click is on the overlay background itself
  if (menuOpen && menuOverlay && !menuOverlay.querySelector('.menu__content')?.contains(e.target)) {
    closeMenu();
  }
}

/**
 * Escape key closes everything.
 */
function handleKeydown(e) {
  if (e.key === 'Escape') {
    closeActivePanel();
    if (menuOpen) closeMenu();
  }
}

/**
 * Wire up menu overlay links – clicking a nav link closes the overlay
 */
function initMenuLinks() {
  if (!menuOverlay) return;

  const links = menuOverlay.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      closeMenu();
    });
  });
}

/* ── Public API ─────────────────────────────────────────────────────── */

/**
 * Initialise navigation.
 * Call after DOMContentLoaded (and ideally after preloader completes).
 */
export function init() {
  // Toggle buttons
  mapBtn          = document.querySelector('.nav__btn--map');
  audioBtn        = document.querySelector('.nav__btn--audio');
  achievementsBtn = document.querySelector('.nav__btn--achievements');
  hamburgerBtn    = document.querySelector('.nav__btn--menu');

  // Panels
  mapPanel          = document.querySelector('.panel--map');
  audioPanel        = document.querySelector('.panel--audio');
  achievementsPanel = document.querySelector('.panel--achievements');
  menuOverlay       = document.querySelector('.menu-overlay');

  // Close buttons inside panels
  mapCloseBtn          = mapPanel?.querySelector('.panel__close');
  audioCloseBtn        = audioPanel?.querySelector('.panel__close');
  achievementsCloseBtn = achievementsPanel?.querySelector('.panel__close');
  menuCloseBtn         = menuOverlay?.querySelector('.menu__close');

  // Back-to-top button & hero section
  backBtn     = document.querySelector('.back-btn');
  heroSection = document.querySelector('.hero');

  // Bind panel toggles
  bindPanelToggle(mapBtn, mapPanel, mapCloseBtn);
  bindPanelToggle(audioBtn, audioPanel, audioCloseBtn);
  bindPanelToggle(achievementsBtn, achievementsPanel, achievementsCloseBtn);

let hamburgerClickHandler = (e) => {
      e.stopPropagation();
      toggleMenu();
    };
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', hamburgerClickHandler);
  }

  let menuCloseHandler = (e) => {
      e.stopPropagation();
      closeMenu();
    };
  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', menuCloseHandler);
  }

  // Click outside & keyboard
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);

  // Menu overlay links
  initMenuLinks();

  // Back button
  initBackButton();
}

export function destroy() {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
  
  if (closePanelTimer) {
    clearTimeout(closePanelTimer);
    closePanelTimer = null;
  }
  
  if (closeMenuTimer) {
    clearTimeout(closeMenuTimer);
    closeMenuTimer = null;
  }
}
