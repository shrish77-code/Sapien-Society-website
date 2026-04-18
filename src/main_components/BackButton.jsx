import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './BackButton.css';

const BLOCK_COUNT = 5;

const BackButton = () => {
  const [visible, setVisible] = useState(false);
  const [wipePhase, setWipePhase] = useState('idle'); // idle → cover → reveal → idle

  useEffect(() => {
    let heroVisible = false;
    let networkVisible = false;

    const update = () => {
      // Hide on Hero and NodeNetwork sections
      setVisible(!heroVisible && !networkVisible);
    };

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 }
    );

    const networkObserver = new IntersectionObserver(
      ([entry]) => {
        networkVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.3 }
    );

    // Retry a few times since content mounts after loader
    const tryObserve = () => {
      const hero = document.getElementById('home');
      const network = document.getElementById('node-network-anchor');
      if (hero) heroObserver.observe(hero);
      if (network) networkObserver.observe(network);
      return hero && network;
    };

    let attempts = 0;
    const interval = setInterval(() => {
      if (tryObserve() || attempts > 20) {
        clearInterval(interval);
      }
      attempts++;
    }, 500);

    return () => {
      clearInterval(interval);
      heroObserver.disconnect();
      networkObserver.disconnect();
    };
  }, []);

  const handleClick = useCallback(() => {
    if (wipePhase !== 'idle') return;

    setWipePhase('cover');

    // After cover completes, navigate to node network section
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('wipe-navigate', { detail: 'node-network-anchor' }));
      setWipePhase('reveal');
    }, 800);

    // After reveal completes, reset
    setTimeout(() => {
      setWipePhase('idle');
    }, 1600);
  }, [wipePhase]);

  return (
    <>
      {/* The Back Button */}
      <AnimatePresence>
        {visible && wipePhase === 'idle' && (
          <motion.div
            className="back-button-fixed"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <button
              className="back-button-btn"
              onClick={handleClick}
              id="back-to-network-btn"
              aria-label="Back to Network"
            >
              <div className="back-btn-corner back-btn-tl"></div>
              <div className="back-btn-corner back-btn-br"></div>
              <span className="back-btn-text">&gt;_BACK</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wipe transition overlay */}
      {(wipePhase === 'cover' || wipePhase === 'reveal') && (
        <div className="wipe-overlay" style={{ zIndex: 10000 }}>
          {Array.from({ length: BLOCK_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              className="wipe-block"
              initial={{
                scaleY: wipePhase === 'cover' ? 0 : 1,
              }}
              animate={{
                scaleY: wipePhase === 'cover' ? 1 : 0,
              }}
              transition={{
                duration: 0.45,
                delay: i * 0.07,
                ease: [0.76, 0, 0.24, 1],
              }}
              style={{
                originY: wipePhase === 'cover' ? 0 : 1,
                left: `${(i / BLOCK_COUNT) * 100}%`,
                width: `${100 / BLOCK_COUNT + 0.5}%`,
              }}
            />
          ))}

          <AnimatePresence>
            {wipePhase === 'cover' && (
              <motion.div
                className="wipe-label"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <span className="wipe-label-text">NAVIGATING</span>
                <span className="wipe-label-dots">...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default BackButton;
