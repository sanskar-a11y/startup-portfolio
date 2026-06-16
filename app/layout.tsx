import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const viewport: Viewport = {
  themeColor: "#fafafa",
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: 'Tomasz "ITom" Szmajda | Creative Frontend Developer – WebGL, React & 3D Portfolio',
  description: 'Interactive 3D developer portfolio of Tomasz Szmajda (ITom). Explore WebGL, React projects, and GSAP animations. Hire a creative frontend developer.',
  keywords: 'frontend developer, WebGL, Three.js, React, GSAP, interactive portfolio, 3D web developer, creative developer, ITom, Tomasz Szmajda',
  authors: [{ name: 'Tomasz Szmajda' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://itomdev.com/',
  },
  openGraph: {
    type: 'website',
    siteName: 'ITomDev',
    title: 'Tomasz "ITom" Szmajda | Creative Frontend Developer',
    description: 'Interactive 3D developer portfolio. Explore WebGL experiments, React projects & GSAP animations in a hand-drawn gallery.',
    url: 'https://itomdev.com/',
    images: [
      {
        url: 'https://itomdev.com/images/og-cover.png',
        width: 1200,
        height: 630,
        alt: 'ITom Developer Portfolio – Hand-drawn creative coding showcase',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tomasz "ITom" Szmajda | Creative Frontend Developer',
    description: 'Interactive 3D developer portfolio. Explore WebGL experiments, React projects & GSAP animations.',
    images: ['https://itomdev.com/images/og-cover.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&family=Caveat:wght@400;700&family=Gloria+Hallelujah&family=Inter:wght@400;500;600&family=Patrick+Hand&display=swap" rel="stylesheet" />
        
        <link rel="stylesheet" href="/css/variables.css" />
        <link rel="stylesheet" href="/css/reset.css" />
        <link rel="stylesheet" href="/css/preloader.css" />
        <link rel="stylesheet" href="/css/navigation.css" />
        <link rel="stylesheet" href="/css/audio-settings.css" />
        <link rel="stylesheet" href="/css/hero.css" />
        <link rel="stylesheet" href="/css/gallery.css" />
        <link rel="stylesheet" href="/css/about.css" />
        <link rel="stylesheet" href="/css/contact.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        
        {/* JSON-LD Structured Data: Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Tomasz Szmajda",
              "alternateName": "ITom",
              "url": "https://itomdev.com/",
              "image": "https://itomdev.com/images/og-cover.png",
              "jobTitle": "Creative Frontend Developer",
              "description": "Frontend Developer specializing in interactive 3D web experiences using WebGL, Three.js, React, and GSAP.",
              "knowsAbout": ["WebGL", "Three.js", "React", "GSAP", "Frontend Development", "3D Web Experiences", "TypeScript", "Next.js"],
              "sameAs": [
                "https://www.linkedin.com/in/tomasz-szmajda-259337305/",
                "https://github.com/ITomPoland",
                "https://www.instagram.com/itom.dev/"
              ]
            })
          }}
        />
        {/* JSON-LD Structured Data: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ITomDev Portfolio",
              "url": "https://itomdev.com/",
              "description": "Interactive 3D developer portfolio of Tomasz Szmajda (ITom) featuring WebGL experiments, React projects, and GSAP animations.",
              "author": {
                "@type": "Person",
                "name": "Tomasz Szmajda"
              },
              "inLanguage": "en"
            })
          }}
        />
      </head>
      <body>
        {/* Application bootstrapper has been replaced by React lifecycle */}
        {children}
      </body>
    </html>
  );
}
