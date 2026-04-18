import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ManifestoScroll.css';

gsap.registerPlugin(ScrollTrigger);

// Japanese text: "SAPIEN SOCIETY — WHERE TOP MINDS MEET"
const MARQUEE_TEXT = 'サピエン・ソサエティ — トップマインドが集う場所';

// Repeat the text enough times to fill the screen seamlessly
const MarqueeRow = ({ direction = 'left', variant = 'base' }) => {
  const content = Array(12).fill(MARQUEE_TEXT).join('   ★   ');
  const className = `marquee-row marquee-${direction} ${variant === 'overlay' ? 'marquee-overlay-text' : 'marquee-base-text'}`;

  return (
    <div className="marquee-track">
      <div className={className}>
        <span>{content}</span>
        <span>{content}</span>
      </div>
    </div>
  );
};

const ManifestoScroll = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.base-line');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=225%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Phase 1: Small initial pause so the text is visible before wipe begins
      tl.to({}, { duration: 0.3 });

      // Phase 2: Wipe each line from gray to red, one after another
      lines.forEach((line) => {
        tl.to(line, {
          backgroundPositionX: "0%",
          duration: 1,
          ease: "none"
        });
      });

      // Phase 3: Brief hold after all lines are red
      tl.to({}, { duration: 0.5 });

      // Phase 4: Circle reveal — red background expands from center
      tl.to(".manifesto-overlay", {
        "--clip-size": "150%",
        duration: 2.5,
        ease: "power2.inOut"
      });

      // Phase 5: Hold the full red state before unpinning
      tl.to({}, { duration: 0.7 });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="manifesto-section" id="manifesto" ref={sectionRef}>

      {/* === BASE LAYER (black bg, red marquee text) === */}

      {/* Upper marquee pair */}
      <MarqueeRow direction="left" variant="base" />
      <MarqueeRow direction="right" variant="base" />

      {/* Main manifesto text */}
      <div className="manifesto-text-block">
        <h1 className="manifesto-text base-line">IF YOU KNOW.</h1>
        <h1 className="manifesto-text base-line indented-1">YOU'RE IN.</h1>
        <h1 className="manifesto-text base-line indented-2">
          IF NOT <span className="dash">—</span> MOVE ON.
        </h1>
      </div>

      {/* Lower marquee pair */}
      <MarqueeRow direction="right" variant="base" />
      <MarqueeRow direction="left" variant="base" />

      {/* === OVERLAY LAYER (red bg, black marquee text — revealed by circle clip) === */}
      <div className="manifesto-overlay">

        {/* Upper marquee pair (overlay) */}
        <MarqueeRow direction="left" variant="overlay" />
        <MarqueeRow direction="right" variant="overlay" />

        {/* Main manifesto text (overlay) */}
        <div className="manifesto-text-block">
          <h1 className="manifesto-text overlay-text">IF YOU KNOW.</h1>
          <h1 className="manifesto-text overlay-text indented-1">YOU'RE IN.</h1>
          <h1 className="manifesto-text overlay-text indented-2">
            IF NOT <span className="dash">—</span> MOVE ON.
          </h1>
        </div>

        {/* Lower marquee pair (overlay) */}
        <MarqueeRow direction="right" variant="overlay" />
        <MarqueeRow direction="left" variant="overlay" />

      </div>
    </section>
  );
};

export default ManifestoScroll;
