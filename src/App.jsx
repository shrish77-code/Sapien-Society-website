import React, { useEffect, useState, useCallback } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Hero from './main_components/Hero';
import NodeNetwork from './main_components/NodeNetwork';
import ManifestoScroll from './main_components/ManifestoScroll';
import Rules from './main_components/Rules';
import Society from './main_components/Society';
import Contact from './main_components/Contact';
import WipeTransition from './main_components/WipeTransition';
import Loader from './main_components/Loader';
import BackButton from './main_components/BackButton';

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [transition, setTransition] = useState({ active: false, url: null });

  useEffect(() => {
    // Only init Lenis after loader is dismissed
    if (!contentReady) return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Sync Lenis with GSAP ScrollTrigger if available
    if (typeof window !== 'undefined' && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
    }

    const handleWipeNav = (e) => {
      const sectionId = e.detail;
      const el = document.getElementById(sectionId);
      if (el) {
        lenis.scrollTo(el, { immediate: true });
      }
    };
    window.addEventListener('wipe-navigate', handleWipeNav);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('wipe-navigate', handleWipeNav);
      lenis.destroy();
    };
  }, [contentReady]);

  const triggerTransition = useCallback((url) => {
    setTransition({ active: true, url });
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setTransition({ active: false, url: null });
  }, []);

  const handleLoaderEnter = useCallback(() => {
    // Called during the wipe "cover" phase — mount main content so it's ready
    setContentReady(true);
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Loader screen */}
      {showLoader && (
        <Loader
          onEnter={() => {
            handleLoaderEnter();
            // After wipe reveal finishes, fully remove loader
            setTimeout(() => setShowLoader(false), 900);
          }}
        />
      )}

      {/* Main site content — only rendered after loader enter */}
      {contentReady && (
        <>
          <Hero onNavigate={triggerTransition} />
          <div id="node-network-anchor">
            <NodeNetwork onNavigate={triggerTransition} />
          </div>
          <ManifestoScroll />
          <Rules />
          <Society />
          <Contact />
          <BackButton />
          <WipeTransition
            isActive={transition.active}
            url={transition.url}
            onComplete={handleTransitionComplete}
          />
        </>
      )}
    </>
  );
}

export default App;