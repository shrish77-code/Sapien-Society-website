import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './WipeTransition.css';

const BLOCK_COUNT = 5;

// Map internal routes to section IDs
const ROUTE_MAP = {
  '/': 'home',
  '/society': 'society',
  '/achievements': 'society',
  '/rules': 'rules',
  '/contact': 'contact',
  '/top-50-minds': 'home',
  '/board-members': 'home',
};

const WipeTransition = ({ isActive, url, onComplete }) => {
  const [phase, setPhase] = useState('idle'); // idle → cover → reveal → idle

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    // Phase 1: blocks slide in to cover the screen
    setPhase('cover');

    // Phase 2: after blocks cover, navigate
    const coverTimer = setTimeout(() => {
      if (url) {
        if (url.startsWith('http')) {
          // External link — open in new tab
          window.open(url, '_blank');
        } else {
          // Internal link — scroll to section
          const sectionId = ROUTE_MAP[url];
          if (sectionId) {
            window.dispatchEvent(new CustomEvent('wipe-navigate', { detail: sectionId }));
          }
        }
      }
      setPhase('reveal');
    }, 800);

    // Phase 3: transition complete
    const completeTimer = setTimeout(() => {
      setPhase('idle');
      if (onComplete) onComplete();
    }, 1600);

    return () => {
      clearTimeout(coverTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, url, onComplete]);

  if (phase === 'idle') return null;

  return (
    <div className="wipe-overlay">
      {Array.from({ length: BLOCK_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          className="wipe-block"
          initial={{
            scaleY: phase === 'cover' ? 0 : 1,
          }}
          animate={{
            scaleY: phase === 'cover' ? 1 : 0,
          }}
          transition={{
            duration: 0.45,
            delay: i * 0.07,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            originY: phase === 'cover' ? 0 : 1,
            left: `${(i / BLOCK_COUNT) * 100}%`,
            width: `${100 / BLOCK_COUNT + 0.5}%`,
          }}
        />
      ))}

      {/* Label shown during transition */}
      <AnimatePresence>
        {phase === 'cover' && (
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
  );
};

export default WipeTransition;
