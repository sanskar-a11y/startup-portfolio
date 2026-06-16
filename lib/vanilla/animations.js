/**
 * animations.js
 * =============
 * Scroll-triggered entrance animations & parallax for the ITomDev portfolio.
 *
 * Features:
 *  – IntersectionObserver adds .visible to sections / cards entering viewport
 *  – Staggered animation delays on gallery cards
 *  – Subtle parallax translateY on the hero background image
 *  – Counter (count-up) animation for stat numbers
 *  – Sequential skill-item entrance animation
 *  – Respects prefers-reduced-motion user preference
 *
 * Usage:
 *   import { init } from './animations.js';
 *   init();
 */

/* ── State & Configuration ─────────────────────────────────────────── */

/** If true, all animations are disabled (respects OS-level setting) */
let reducedMotion = false;
let observers = [];
let mmContext = null;
let isDestroyed = false;
let mqListener = null;
let mq = null;

/** Parallax multiplier – lower = subtler */
const PARALLAX_FACTOR = 0.35;

/** Duration for each counter animation in ms */
const COUNTER_DURATION_MS = 2000;

/* ── Reduced-motion check ──────────────────────────────────────────── */

function checkReducedMotion() {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion = mq.matches;

  mqListener = () => {
    reducedMotion = mq.matches;
  };
  mq.addEventListener('change', mqListener);
}

/* ── Section / element entrance animations ─────────────────────────── */

/**
 * Observe elements that should animate in on scroll.
 * Any element with the class .animate-on-scroll will receive .visible
 * once it enters the viewport.
 */
function initEntranceObserver() {
  const targets = document.querySelectorAll('.animate-on-scroll');
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve – we only animate in once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,     // trigger when 20% visible
      rootMargin: '0px 0px -50px 0px', // slight offset so animation fires a bit early
    }
  );

  targets.forEach((el) => observer.observe(el));
  observers.push(observer);
}

/* ── Staggered gallery cards ───────────────────────────────────────── */

/**
 * Give each .gallery__card an increasing transition-delay so they
 * cascade in sequentially.
 */
function initStaggeredGallery() {
  const cards = document.querySelectorAll('.gallery__card');
  if (cards.length === 0) return;

  const STAGGER_MS = 100; // delay between each card
  let staggerIndex = 0;
  let resetTimeout = null;

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      visibleEntries.forEach((entry) => {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, staggerIndex * STAGGER_MS);
        staggerIndex++;
        observer.unobserve(entry.target);
      });

      if (visibleEntries.length > 0) {
        clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
          staggerIndex = 0;
        }, 50);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
  );

  cards.forEach((card) => observer.observe(card));
  observers.push(observer);
}

/* ── Parallax hero background ──────────────────────────────────────── */

/**
 * Subtle translateY on the hero background that moves slower than scroll.
 * Uses requestAnimationFrame to stay in sync with painting.
 */
function initParallax() {
  const heroBg = document.querySelector('.hero__background');
  if (!heroBg) return;

  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  mmContext = gsap.matchMedia();

  mmContext.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.to(heroBg, {
      y: () => window.innerHeight * 1.5 * PARALLAX_FACTOR,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: () => window.innerHeight * 1.5,
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  });
}

/* ── Counter (count-up) animation for stats ────────────────────────── */

/**
 * Animates numeric elements from 0 to their target value.
 * Target value is read from data-count attribute or innerText.
 * e.g. <span class="stat__number" data-count="42">0</span>
 */
function initCounters() {
  const counters = document.querySelectorAll('.stat__number, [data-count]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5, rootMargin: '0px 0px -50px 0px' }
  );

  counters.forEach((el) => observer.observe(el));
  observers.push(observer);
}

/**
 * Animate a single counter element from 0 to its target.
 * @param {HTMLElement} el
 */
function animateCounter(el) {
  const target = parseInt(el.dataset.count || el.textContent, 10);
  if (isNaN(target)) return;

  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / COUNTER_DURATION_MS, 1);
    const easedProgress = easeOutCubic(progress);
    const current = Math.round(easedProgress * target);

    el.textContent = current;

    if (progress < 1 && !isDestroyed) {
      requestAnimationFrame(step);
    } else if (!isDestroyed) {
      el.textContent = target; // ensure exact final value
    }
  }

  if (!isDestroyed) requestAnimationFrame(step);
}

/** Cubic ease-out */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ── Sequential skill items ────────────────────────────────────────── */

/**
 * Animate .skill__item elements one after another when the skills
 * section scrolls into view.
 */
function initSkillItems() {
  const skillItems = document.querySelectorAll('.skill__item');
  if (skillItems.length === 0) return;

  const SKILL_STAGGER_MS = 75;
  let staggerIndex = 0;
  let resetTimeout = null;

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      visibleEntries.forEach((entry) => {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, staggerIndex * SKILL_STAGGER_MS);
        staggerIndex++;
        observer.unobserve(entry.target);
      });

      if (visibleEntries.length > 0) {
        clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
          staggerIndex = 0;
        }, 50);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
  );

  skillItems.forEach((item) => observer.observe(item));
  observers.push(observer);
}

/* ── Section transition observer ───────────────────────────────────── */

/**
 * Adds .in-view to each <section> as it scrolls into view.
 * Useful for per-section transition styling.
 */
function initSectionTransitions() {
  const sections = document.querySelectorAll('section');
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
  observers.push(observer);
}

/* ── Public API ─────────────────────────────────────────────────────── */

/**
 * Initialise all scroll-driven animations.
 * Should be called after the preloader completes.
 */
export function init() {
  isDestroyed = false;
  checkReducedMotion();

  if (reducedMotion) {
    // If user prefers reduced motion, make everything visible immediately
    document
      .querySelectorAll('.animate-on-scroll, .gallery__card, .skill__item')
      .forEach((el) => el.classList.add('visible'));

    // Still run counters (they're informational) but skip parallax
    initCounters();
    initSectionTransitions();
    return;
  }

  initEntranceObserver();
  initStaggeredGallery();
  initParallax();
  initCounters();
  initSkillItems();
  initSectionTransitions();
}

export function destroy() {
  isDestroyed = true;
  
  if (mq && mqListener) {
    mq.removeEventListener('change', mqListener);
  }
  
  observers.forEach(obs => obs.disconnect());
  observers = [];
  
  if (mmContext) {
    mmContext.revert();
    mmContext = null;
  }
}
