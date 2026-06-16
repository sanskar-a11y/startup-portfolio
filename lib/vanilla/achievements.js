/**
 * achievements.js
 * ===============
 * Gamification / achievement system for the ITomDev portfolio.
 *
 * Six discoverable achievements:
 *   1. First Steps   – preloader completes
 *   2. Art Critic     – user scrolls to the gallery section
 *   3. Deep Dive      – user reads the about section
 *   4. Connector      – user reaches the contact section
 *   5. Explorer       – user opens the map panel
 *   6. Sound On       – user opens the audio panel
 *
 * Features:
 *  – Persists unlocked state in localStorage
 *  – Popup notification with bouncing checkbox animation (auto-hides 4 s)
 *  – Updates the achievements panel list (checked / unchecked)
 *  – Footer progress counter (e.g. '3/6 DISCOVERED')
 *
 * Usage:
 *   import { init, unlock, getProgress } from './achievements.js';
 *   init();
 *   unlock('first-steps');
 */

/* ── Achievement definitions ───────────────────────────────────────── */

const ACHIEVEMENTS = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Explore the corridor – your journey begins.',
    icon: '🚪',
    unlocked: false,
  },
  {
    id: 'art-critic',
    title: 'Art Critic',
    description: 'Discover the gallery of works.',
    icon: '🎨',
    unlocked: false,
  },
  {
    id: 'deep-dive',
    title: 'Deep Dive',
    description: 'Read the story behind the developer.',
    icon: '📖',
    unlocked: false,
  },
  {
    id: 'connector',
    title: 'Connector',
    description: 'Reach out through the contact section.',
    icon: '🤝',
    unlocked: false,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Open the map and survey the territory.',
    icon: '🗺️',
    unlocked: false,
  },
  {
    id: 'sound-on',
    title: 'Sound On',
    description: 'Enable the ambient soundtrack.',
    icon: '🔊',
    unlocked: false,
  },
];

/* ── Constants ─────────────────────────────────────────────────────── */

const STORAGE_KEY    = 'itomdev_achievements';
const POPUP_DURATION = 4000; // ms before auto-hide

/* ── DOM references ────────────────────────────────────────────────── */

let popupEl        = null; // .achievement-popup
let popupIcon      = null;
let popupTitle     = null;
let popupDesc      = null;
let popupCheckmark = null;
let panelList      = null; // .achievements__list inside panel
let footerCounter  = null; // .achievements__counter in footer

/* ── State ──────────────────────────────────────────────────────────── */

let popupTimer = null;
let popupCheckTimer = null;
let observers = [];
let panelOpenedHandler = null;
let preloaderCompleteHandler = null;

/* ── localStorage helpers ──────────────────────────────────────────── */

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) return;

    saved.forEach((id) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) achievement.unlocked = true;
    });
  } catch {
    // Corrupted data – start fresh
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveProgress() {
  const unlockedIds = ACHIEVEMENTS.filter((a) => a.unlocked).map((a) => a.id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedIds));
  } catch {
    // Storage full or unavailable – fail silently
  }
}

/* ── Popup notification ────────────────────────────────────────────── */

/**
 * Show the achievement-unlocked popup with a bouncing checkmark.
 * @param {object} achievement
 */
function showPopup(achievement) {
  if (!popupEl) return;

  // Clear any existing timer
  if (popupTimer) {
    clearTimeout(popupTimer);
    popupEl.classList.remove('show', 'animate-check');
  }
  if (popupCheckTimer) {
    clearTimeout(popupCheckTimer);
    popupCheckTimer = null;
  }

  // Populate content
  if (popupIcon)  popupIcon.textContent  = achievement.icon;
  if (popupTitle) popupTitle.textContent  = achievement.title;
  if (popupDesc)  popupDesc.textContent   = achievement.description;

  // Trigger entrance + checkmark bounce
  // Use a micro-delay so the browser registers the class removal above
  requestAnimationFrame(() => {
    popupEl.classList.add('show');

    // Start checkmark bounce after a short delay
    popupCheckTimer = setTimeout(() => {
      popupEl.classList.add('animate-check');
    }, 200);
  });

  // Auto-hide after POPUP_DURATION
  popupTimer = setTimeout(() => {
    popupEl.classList.remove('show', 'animate-check');
    popupTimer = null;
  }, POPUP_DURATION);
}

/* ── Panel list rendering ──────────────────────────────────────────── */

/**
 * Re-render the achievements list inside the panel.
 */
function renderPanelList() {
  if (!panelList) return;

  panelList.innerHTML = '';

  ACHIEVEMENTS.forEach((ach) => {
    const li = document.createElement('li');
    li.className = `achievements__item${ach.unlocked ? ' achievements__item--unlocked' : ''}`;
    li.innerHTML = `
      <span class="achievements__check">${ach.unlocked ? '✓' : ''}</span>
      <span class="achievements__icon">${ach.icon}</span>
      <div class="achievements__info">
        <strong class="achievements__title">${ach.title}</strong>
        <span class="achievements__desc">${ach.unlocked ? ach.description : '???'}</span>
      </div>
    `;
    panelList.appendChild(li);
  });
}

/* ── Footer counter ────────────────────────────────────────────────── */

function updateFooterCounter() {
  if (!footerCounter) return;
  const total    = ACHIEVEMENTS.length;
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  footerCounter.textContent = `${unlocked}/${total} DISCOVERED`;
}

/* ── Scroll-based triggers ─────────────────────────────────────────── */

/**
 * Observe sections and unlock achievements when they scroll into view.
 */
function initScrollTriggers() {
  const sectionMap = {
    gallery: 'art-critic',
    about:   'deep-dive',
    contact: 'connector',
  };

  Object.entries(sectionMap).forEach(([sectionId, achievementId]) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          unlock(achievementId);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    observers.push(observer);
  });
}

/**
 * Listen for panel-open events to trigger Explorer / Sound On.
 */
function initPanelTriggers() {
  panelOpenedHandler = (e) => {
    const panelId = e.detail?.panel;
    if (!panelId) return;

    if (panelId.includes('map'))   unlock('explorer');
    if (panelId.includes('audio')) unlock('sound-on');
  };
  document.addEventListener('panelOpened', panelOpenedHandler);
}

/* ── Public API ─────────────────────────────────────────────────────── */

/**
 * Unlock an achievement by its id.
 * If already unlocked, this is a no-op.
 * @param {string} id – achievement id (e.g. 'first-steps')
 */
export function unlock(id) {
  const achievement = ACHIEVEMENTS.find((a) => a.id === id);
  if (!achievement || achievement.unlocked) return;

  achievement.unlocked = true;
  saveProgress();

  showPopup(achievement);
  renderPanelList();
  updateFooterCounter();
}

/**
 * Get current progress summary.
 * @returns {{ unlocked: number, total: number, achievements: Array }}
 */
export function getProgress() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  return {
    unlocked,
    total: ACHIEVEMENTS.length,
    achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
  };
}

/**
 * Initialise the achievement system.
 * Call after the preloader completes.
 */
export function init() {
  // Resolve DOM references
  popupEl        = document.querySelector('.achievement-popup');
  popupIcon      = popupEl?.querySelector('.achievement-popup__icon');
  popupTitle     = popupEl?.querySelector('.achievement-popup__title');
  popupDesc      = popupEl?.querySelector('.achievement-popup__desc');
  popupCheckmark = popupEl?.querySelector('.achievement-popup__check');
  panelList      = document.querySelector('.achievements__list');
  footerCounter  = document.querySelector('.achievements__counter');

  // Load previous progress from localStorage
  loadProgress();

  // Render initial state
  renderPanelList();
  updateFooterCounter();

  // Set up triggers
  initScrollTriggers();
  initPanelTriggers();

  // Listen for preloader completion → unlock 'First Steps'
  // (This event may have already fired, so also check if preloader is done)
  preloaderCompleteHandler = () => {
    unlock('first-steps');
  };
  document.addEventListener('preloaderComplete', preloaderCompleteHandler);

  // If preloader is already hidden (e.g. module loaded late), unlock now
  const preloader = document.querySelector('.preloader');
  if (!preloader || preloader.classList.contains('hidden')) {
    unlock('first-steps');
  }
}

export function destroy() {
  if (panelOpenedHandler) {
    document.removeEventListener('panelOpened', panelOpenedHandler);
  }
  if (preloaderCompleteHandler) {
    document.removeEventListener('preloaderComplete', preloaderCompleteHandler);
  }
  
  observers.forEach(obs => obs.disconnect());
  observers = [];
  
  if (popupTimer) {
    clearTimeout(popupTimer);
    popupTimer = null;
  }
  if (popupCheckTimer) {
    clearTimeout(popupCheckTimer);
    popupCheckTimer = null;
  }
}
