"use client";

import React from 'react';
import { Overlay } from '../components/ui/Overlay';
import MountToggle from '../components/experience/MountToggle';
import { motion } from 'framer-motion';
import { FrontDoor } from '../components/ui/FrontDoor';

const displayBlock: React.CSSProperties = { display: 'block' };
const displayNone: React.CSSProperties = { display: 'none' };
const visuallyHiddenStyle: React.CSSProperties = { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 };
const noscriptStyle: React.CSSProperties = { padding: '2rem', textAlign: 'center', fontFamily: "'Inter', sans-serif", color: '#1a1a1a', background: '#fafafa' };
const ulStyle: React.CSSProperties = { listStyle: 'none', padding: 0 };

export default function Home() {

  return (
    <>
      <Overlay />
      <MountToggle />


      {/* SEO FALLBACK CONTENT */}
      <div className="sr-only-seo" hidden aria-hidden="true">
        <header>
          <h1>Tomasz &quot;ITom&quot; Szmajda – Creative Frontend Developer Portfolio</h1>
          <p>Interactive 3D developer portfolio showcasing WebGL experiments, React projects, and GSAP animations in a hand-drawn gallery experience.</p>
        </header>

        <nav aria-label="Primary navigation (SEO)">
          <ul>
            <li><a href="#hero">Home – The Corridor</a></li>
            <li><a href="#gallery">Gallery – Selected Works</a></li>
            <li><a href="#about">About Me – The Studio</a></li>
            <li><a href="#contact">Contact – Let&apos;s Connect</a></li>
          </ul>
        </nav>

        <div>
          <section>
            <h2>Selected Works &amp; Case Studies</h2>
            <article>
              <h3>MoneTune</h3>
              <p>Full-stack financial dashboard with complex data visualization, real-time updates, and intuitive budget tracking. Built with React and secure backend architecture.</p>
              <p>Technologies: React, Full-Stack, Data Visualization</p>
            </article>
            <article>
              <h3>TimberKitty</h3>
              <p>Highly interactive, animated web experience with game-like micro-interactions. Cross-browser compatible with flawlessly smooth GSAP animations.</p>
              <p>Technologies: GSAP, Interactive, CSS Grid</p>
            </article>
            <article>
              <h3>Young Multi</h3>
              <p>Cutting-edge WebGL site with scroll-based 3D storytelling. Custom shaders, GLTF compression, and texture atlasing for fluid mobile performance.</p>
              <p>Technologies: Three.js, WebGL, 3D</p>
            </article>
          </section>

          <section>
            <h2>About Tomasz &quot;ITom&quot; Szmajda</h2>
            <p>Dedicated Frontend Developer with a profound specialization in interactive web experiences. Core skills include JavaScript (ES6+), TypeScript, React.js, Next.js, Three.js, React Three Fiber, GSAP, Framer Motion, Node.js, and Figma.</p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>Looking to hire a passionate developer or seeking a specialist for a 3D WebGL vision? Get in touch.</p>
            <ul>
              <li><a href="https://www.linkedin.com/in/tomasz-szmajda-259337305/">LinkedIn</a></li>
              <li><a href="https://github.com/ITomPoland">GitHub</a></li>
              <li><a href="https://www.instagram.com/itom.dev/">Instagram</a></li>
            </ul>
          </section>
        </div>

        <footer>
          <p>Designed &amp; built with love by ITom &middot; 2026</p>
        </footer>
      </div>


      <FrontDoor>
      {/* MAIN APP WRAPPER */}
      <div className="app" id="app">
        {/* WebGL Background Canvas */}
        <canvas id="webgl-canvas" aria-hidden="true"></canvas>

        {/* NAVIGATION UI */}
        <nav className="navigation-ui" id="navigation-ui" aria-label="Site controls" style={displayBlock}>
          {/* Back Button */}
          <button className="nav-btn back-btn" id="back-btn" aria-label="Go back" style={displayNone}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Controls */}
          <div className="nav-controls" id="nav-controls">
            {/* Hamburger Menu Button */}
            <button className="nav-btn hamburger-btn" id="hamburger-btn" aria-label="Open navigation menu" aria-expanded="false" aria-controls="menu-overlay">
              <div className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </nav>

        {/* MENU OVERLAY */}
        <div className="menu-overlay" id="menu-overlay" style={displayNone} role="dialog" aria-modal="true" aria-label="Navigation menu" aria-hidden="true">
          <div className="menu-overlay__content">
            <nav className="menu-overlay__nav" aria-label="Main navigation">
              <a href="#hero" className="menu-overlay__link" data-section="hero">The Corridor</a>
              <a href="#gallery" className="menu-overlay__link" data-section="gallery">Gallery</a>
              <a href="#about" className="menu-overlay__link" data-section="about">About Me</a>
              <a href="#contact" className="menu-overlay__link" data-section="contact">Contact</a>
            </nav>
            <div className="menu-overlay__socials">
              <a href="https://www.linkedin.com/in/tomasz-szmajda-259337305/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/ITomPoland" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
                <span>GitHub</span>
              </a>
              <a href="https://www.instagram.com/itom.dev/" target="_blank" rel="noopener noreferrer" aria-label="Instagram profile">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <main 
          className="main-content" 
          id="main-content" 
          style={displayBlock}
        >
          {/* HERO / CORRIDOR SECTION */}
          <section className="hero-section" id="hero" aria-label="Welcome – The Corridor">


            <motion.div 
              className="hero__scroll-hint" 
              id="scroll-hint" 
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <span className="hero__scroll-text">Scroll to explore</span>
            </motion.div>
          </section>

          {/* GALLERY / PROJECTS SECTION */}
          <section className="gallery-section" id="gallery" aria-label="Gallery – Selected Works">
            <header className="gallery__header">
              <h2 className="gallery__title">The Gallery</h2>
              <p className="gallery__subtitle">Selected Works &amp; Case Studies</p>
              <hr className="gallery__divider" aria-hidden="true" />
            </header>

            <ul className="gallery__grid">
              {/* Project 1 */}
              <li>
                <article className="gallery__card studio-paper-card" data-animate>
                  <div className="gallery__card-image">
                    <img src="/images/project-monetune.webp" alt="MoneTune – Financial dashboard interface showing charts and budget controls" loading="lazy" width="600" height="400" />
                  </div>
                  <h3 className="gallery__card-title">MoneTune</h3>
                  <p className="gallery__card-description">Full-stack financial dashboard with complex data visualization, real-time updates, and intuitive budget tracking. Built with React and secure backend architecture.</p>
                  <ul className="gallery__card-tags" aria-label="Technologies used">
                    <li className="gallery__card-tag">React</li>
                    <li className="gallery__card-tag">Full-Stack</li>
                    <li className="gallery__card-tag">Data Viz</li>
                  </ul>
                  <button className="gallery__card-link studio-action-button" aria-label="View MoneTune project details">
                    View Project
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </article>
              </li>

              {/* Project 2 */}
              <li>
                <article className="gallery__card studio-paper-card" data-animate>
                  <div className="gallery__card-image">
                    <img src="/images/project-timberkitty.webp" alt="TimberKitty – Animated web experience with playful micro-interactions" loading="lazy" width="600" height="400" />
                  </div>
                  <h3 className="gallery__card-title">TimberKitty</h3>
                  <p className="gallery__card-description">Highly interactive, animated web experience with game-like micro-interactions. Cross-browser compatible with flawlessly smooth GSAP animations.</p>
                  <ul className="gallery__card-tags" aria-label="Technologies used">
                    <li className="gallery__card-tag">GSAP</li>
                    <li className="gallery__card-tag">Interactive</li>
                    <li className="gallery__card-tag">CSS Grid</li>
                  </ul>
                  <button className="gallery__card-link studio-action-button" aria-label="View TimberKitty project details">
                    View Project
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </article>
              </li>

              {/* Project 3 */}
              <li>
                <article className="gallery__card studio-paper-card" data-animate>
                  <div className="gallery__card-image">
                    <img src="/images/project-youngmulti.webp" alt="Young Multi – WebGL 3D experience with scroll-driven storytelling" loading="lazy" width="600" height="400" />
                  </div>
                  <h3 className="gallery__card-title">Young Multi</h3>
                  <p className="gallery__card-description">Cutting-edge WebGL site with scroll-based 3D storytelling. Custom shaders, GLTF compression, and texture atlasing for fluid mobile performance.</p>
                  <ul className="gallery__card-tags" aria-label="Technologies used">
                    <li className="gallery__card-tag">Three.js</li>
                    <li className="gallery__card-tag">WebGL</li>
                    <li className="gallery__card-tag">3D</li>
                  </ul>
                  <button className="gallery__card-link studio-action-button" aria-label="View Young Multi project details">
                    View Project
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </article>
              </li>
            </ul>
          </section>

          {/* ABOUT / STUDIO SECTION */}
          <section className="about-section" id="about" aria-label="About – The Studio">
            <div className="about__container">
              <header className="about__header">
                <h2 className="about__title">The Studio</h2>
                <p className="about__subtitle">About Tomasz &quot;ITom&quot; Szmajda</p>
                <hr className="about__divider" aria-hidden="true" />
              </header>

              <div className="about__card studio-paper-card" data-animate>
                <p className="about__intro">
                  My name is <strong>Tomasz Szmajda</strong> (ITom), and I am a dedicated Frontend Developer with a profound specialization in interactive web experiences. My journey in software engineering began with a fascination for how logic and aesthetics intertwine.
                </p>

                <hr className="about__divider-line" aria-hidden="true" />

                <h3 className="about__skills-title">Core Technical Skills</h3>
                <ul className="about__skills-list">
                  <li><strong>Core:</strong> JavaScript (ES6+), TypeScript, HTML5, CSS/SCSS, Tailwind CSS</li>
                  <li><strong>Frameworks:</strong> React.js, Next.js, state management, complex UI</li>
                  <li><strong>3D/WebGL:</strong> Three.js, React Three Fiber, custom shaders, 60fps optimization</li>
                  <li><strong>Animation:</strong> GSAP, Framer Motion, physics-based UI animations</li>
                  <li><strong>Backend:</strong> Node.js, Express, Firebase, Supabase, Vercel</li>
                  <li><strong>Design:</strong> Figma, Adobe Photoshop, Blender for 3D assets</li>
                </ul>

                <hr className="about__divider-line" aria-hidden="true" />

                <div className="about__media studio-media-container">
                  <div className="thumbnail-placeholder" role="group" aria-label="Portfolio reel video placeholder">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Portfolio Reel</span>
                  </div>
                </div>

                <a href="https://github.com/ITomPoland" target="_blank" rel="noopener noreferrer" className="about__cta studio-action-button">
                  View GitHub Profile
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section className="contact-section" id="contact" aria-label="Contact – Let's Connect">
            <div className="contact__container">
              <header className="contact__header">
                <h2 className="contact__title">Let&apos;s Connect</h2>
                <p className="contact__subtitle">Build Something Extraordinary Together</p>
                <hr className="contact__divider" aria-hidden="true" />
              </header>

              <div className="contact__card studio-paper-card" data-animate>
                <p className="contact__intro">Are you looking to hire a passionate developer or seeking a specialist for a 3D WebGL vision? I&apos;m always open to new opportunities.</p>

                <form className="contact__form" id="contact-form" action="#" method="POST" noValidate>
                  <div className="contact__form-group">
                    <label className="contact__label" htmlFor="contact-name">Your Name</label>
                    <input className="contact__input" type="text" id="contact-name" name="name" placeholder="John Doe" required autoComplete="name" />
                  </div>
                  <div className="contact__form-group">
                    <label className="contact__label" htmlFor="contact-email">Email</label>
                    <input className="contact__input" type="email" id="contact-email" name="email" placeholder="john@example.com" required autoComplete="email" />
                  </div>
                  <div className="contact__form-group">
                    <label className="contact__label" htmlFor="contact-message">Message</label>
                    <textarea className="contact__textarea" id="contact-message" name="message" placeholder="Tell me about your project..." rows={5} required></textarea>
                  </div>
                  <button type="submit" className="contact__submit studio-action-button">
                    Send Message
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>

                <div className="contact__socials" role="group" aria-label="Social media links">
                  <a href="https://www.linkedin.com/in/tomasz-szmajda-259337305/" target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="LinkedIn profile">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a href="https://github.com/ITomPoland" target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="GitHub profile">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/itom.dev/" target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="Instagram profile">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                </div>
              </div>

              <footer className="contact__footer">
                <p>Designed &amp; built with <span aria-label="love">❤️</span> by ITom &middot; <time dateTime="2026">2026</time></p>
              </footer>
            </div>
          </section>
        </main>
      </div>
      </FrontDoor>

      {/* Noscript Fallback */}
      <noscript>
        <div style={noscriptStyle}>
          <h2>JavaScript Required</h2>
          <p>This portfolio uses JavaScript for interactive 3D experiences, animations, and navigation. Please enable JavaScript in your browser to explore the full portfolio.</p>
          <p>You can still reach me at:</p>
          <ul style={ulStyle}>
            <li><a href="https://www.linkedin.com/in/tomasz-szmajda-259337305/">LinkedIn</a></li>
            <li><a href="https://github.com/ITomPoland">GitHub</a></li>
            <li><a href="https://www.instagram.com/itom.dev/">Instagram</a></li>
          </ul>
        </div>
      </noscript>
    </>
  );
}
