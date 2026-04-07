import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Society.css';

gsap.registerPlugin(ScrollTrigger);

const societyCards = [
  {
    id: '01',
    title: 'OPPORTUNITIES',
    desc: 'Discover exclusive access to global campaigns, groundbreaking ventures, and high-impact initiatives curated for our members.',
  },
  {
    id: '02',
    title: 'TOP MINDS',
    desc: 'An elite echelon of visionaries and industry leaders bridging the gap between thought and revolutionary action.',
  },
  {
    id: '03',
    title: 'LEARNING & RESOURCES',
    desc: 'A dynamic repository of collective wisdom where members exchange bleeding-edge insights and collaborative tools.',
  },
  {
    id: '04',
    title: 'ACHIEVEMENTS',
    desc: 'Celebrating the defining milestones, breakthroughs, and profound victories of our global community.',
  },
  {
    id: '05',
    title: 'GENERAL',
    desc: 'The central nexus for fluid dialogue, organic networking, and the unrestricted exploration of conceptual ideas.',
  },
];

const Society = () => {
  const wrapperRef = useRef(null);
  const cardsRef = useRef([]);
  const bgTextRef = useRef(null);
  const theTextRef = useRef(null);

  useEffect(() => {
    // Add a small delay robust refresh for lenient layout shifts
    const updateScroll = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    const ctx = gsap.context(() => {
      // Set initial states for cards smoothly centered but off-screen bottom
      gsap.set(cardsRef.current, {
        xPercent: -50,
        yPercent: 120, // Offscreen down
        top: '50%',
        left: '50%',
        rotation: 0,
      });

      // Define a timeline connected to scroll the wrapper using GSAP pin
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: '+=600%', // 600% of viewport scrolling to allow exit animation
          scrub: 1, // Smooth scrubbing
          pin: true, // Use GSAP to pin instead of CSS sticky
          duration: 1.5,
        },
      });

      // Initial background text entrance animation
      gsap.fromTo(
        theTextRef.current,
        { yPercent: -100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        bgTextRef.current,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 80%',
          },
        }
      );

      // Animate each card stacking
      cardsRef.current.forEach((card, index) => {
        // Calculate dynamic rotation to give that nice "messy stack" feel
        const rotationMult = index % 2 === 0 ? 1 : -1;
        const targetRotation = (index * 2) * rotationMult;

        // Add card to timeline
        tl.to(
          card,
          {
            yPercent: -50, // Move to center
            rotation: targetRotation, // slight tilt
            ease: 'power2.out',
            duration: 1,
          },
          index * 0.8 // stagger the start delays
        );

        // Turn society heading red when the last card comes up
        if (index === cardsRef.current.length - 1) {
          tl.to(
            bgTextRef.current,
            {
              color: '#e63946',
              ease: 'power2.out',
              duration: 1,
            },
            index * 0.8
          );
        }
      });

      // After all cards have gracefully arrived, split them in half to reveal the Society text
      const splitTime = (cardsRef.current.length - 1) * 0.8 + 1.5;

      cardsRef.current.forEach((card, index) => {
        const moveLeft = index % 2 === 0;
        tl.to(
          card,
          {
            x: moveLeft ? '-120vw' : '120vw',
            rotation: moveLeft ? -20 : 20,
            opacity: 0,
            ease: 'power2.inOut',
            duration: 1.5,
          },
          splitTime
        );
      });

      // Make the background text slightly more prominent as cards fly off
      tl.to(
        bgTextRef.current,
        {
          scale: 1.05,
          duration: 1.5,
          ease: 'power1.inOut'
        },
        splitTime
      );

    }, wrapperRef);

    return () => {
      clearTimeout(updateScroll);
      ctx.revert();
    };
  }, []);

  return (
    <section id="society" className="society-wrapper" ref={wrapperRef}>
      <div className="society-container">

        <div className="society-bg-text-container">
          <div className="society-bg-text" ref={theTextRef}>THE</div>
          <div className="society-bg-text" ref={bgTextRef}>SOCIETY</div>
        </div>

        {/* Stackable Cards */}
        <div className="society-cards-container">
          {societyCards.map((card, index) => (
            <div
              key={card.id}
              className="society-card"
              ref={el => cardsRef.current[index] = el}
              style={{ zIndex: index + 1 }}
            >
              <div className="society-card-header">
                <h2 className="society-card-title">
                  {/* optionally highlight some part: splits can be done manually but this is clean */}
                  {card.title === 'LEARNING & RESOURCES' ? (
                    <>
                      LEARNING <br /><span className="highlight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>&</span> RESOURCES GROUP
                    </>
                  ) : card.title === 'CAMPAIGN & FILM' ? (
                    <>
                      CAMPAIGN <br /><span className="highlight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>&</span> FILM GROUP
                    </>
                  ) : (
                    <>{card.title} GROUP</>
                  )}
                </h2>
                <p className="society-card-desc">{card.desc}</p>
              </div>
              <div className="society-card-footer">
                <div
                  className="society-card-number"
                  style={{ color: '#e63946', fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {card.id}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Society;
