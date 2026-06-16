/**
 * audio.js
 * ========
 * Audio panel UI module for the ITomDev portfolio.
 *
 * Manages master and ambient volume sliders, syncs displayed percentage
 * values, and persists volume preferences in localStorage.
 *
 * No actual audio playback – this is purely the UI interaction layer.
 *
 * Usage:
 *   import { init } from './audio.js';
 *   init();
 */

/* ── Constants ─────────────────────────────────────────────────────── */

const STORAGE_KEY = 'itomdev_audio_prefs';

/** Default volumes (0 – 100) */
const DEFAULTS = {
  master:  80,
  ambient: 50,
};

/* ── DOM references ────────────────────────────────────────────────── */

let masterSlider  = null; // <input type="range"> for master volume
let masterValue   = null; // <span> showing the percentage number
let ambientSlider = null;
let ambientValue  = null;

/* ── localStorage helpers ──────────────────────────────────────────── */

/**
 * Load saved volume preferences, falling back to defaults.
 * @returns {{ master: number, ambient: number }}
 */
function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const saved = JSON.parse(raw);
    return {
      master:  typeof saved.master  === 'number' ? saved.master  : DEFAULTS.master,
      ambient: typeof saved.ambient === 'number' ? saved.ambient : DEFAULTS.ambient,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

/**
 * Persist current volume values.
 * @param {{ master: number, ambient: number }} prefs
 */
function savePreferences(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Fail silently
  }
}

/* ── Slider wiring ─────────────────────────────────────────────────── */

/**
 * Wire up a single slider + value display.
 *
 * @param {HTMLInputElement} slider   – range input
 * @param {HTMLElement}      display  – element to show percentage
 * @param {string}           key      – 'master' | 'ambient'
 * @param {number}           initial  – initial value (0-100)
 */
function wireSlider(slider, display, key, initial) {
  if (!slider) return;

  // Set initial value
  slider.value = initial;
  updateDisplay(display, initial);
  updateSliderTrack(slider);

  // Update UI on input (fires continuously while dragging)
  slider.addEventListener('input', () => {
    const val = parseInt(slider.value, 10);
    updateDisplay(display, val);
    updateSliderTrack(slider);
  });

  // Persist only on change (fires when dragging stops)
  slider.addEventListener('change', () => {
    const val = parseInt(slider.value, 10);
    const prefs = loadPreferences();
    prefs[key] = val;
    savePreferences(prefs);
  });
}

/**
 * Update the visible percentage text.
 * @param {HTMLElement} display
 * @param {number}      value – 0-100
 */
function updateDisplay(display, value) {
  if (!display) return;
  display.textContent = `${value}%`;
}

/**
 * Update the slider track fill via a CSS custom property.
 * This allows CSS to colour the "filled" portion of the range input.
 * @param {HTMLInputElement} slider
 */
function updateSliderTrack(slider) {
  if (!slider) return;
  const min = parseFloat(slider.min) || 0;
  const max = parseFloat(slider.max) || 100;
  const val = parseFloat(slider.value);
  const percent = ((val - min) / (max - min)) * 100;
  slider.style.setProperty('--slider-fill', `${percent}%`);
}

/* ── Public API ─────────────────────────────────────────────────────── */

/**
 * Initialise the audio panel sliders.
 * Call after the preloader completes.
 */
export function init() {
  // Resolve DOM elements
  masterSlider  = document.querySelector('.audio__slider--master');
  masterValue   = document.querySelector('.audio__value--master');
  ambientSlider = document.querySelector('.audio__slider--ambient');
  ambientValue  = document.querySelector('.audio__value--ambient');

  // Load preferences
  const prefs = loadPreferences();

  // Wire up sliders
  wireSlider(masterSlider, masterValue, 'master', prefs.master);
  wireSlider(ambientSlider, ambientValue, 'ambient', prefs.ambient);
}
