import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Loader.css';

const BLOCK_COUNT = 5;

const Loader = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [loadComplete, setLoadComplete] = useState(false);
  const [wipePhase, setWipePhase] = useState('idle'); // idle → cover → reveal → done
  const intervalRef = useRef(null);

  // Simulate loading progress
  useEffect(() => {
    let current = 0;

    intervalRef.current = setInterval(() => {
      const remaining = 100 - current;
      // To target ~4.5 seconds (4500ms) with 60ms intervals, we need ~75 steps.
      // Bigger jumps per interval to complete faster.
      const jump = Math.max(
        0.4,
        Math.random() * Math.min(remaining * 0.09, 2.5)
      );
      current = Math.min(100, current + jump);
      setProgress(Math.round(current));

      if (current >= 100) {
        clearInterval(intervalRef.current);
        setTimeout(() => setLoadComplete(true), 400);
      }
    }, 60);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleEnterClick = () => {
    setWipePhase('cover');

    setTimeout(() => {
      if (onEnter) onEnter();
      setWipePhase('reveal');
    }, 800);

    setTimeout(() => {
      setWipePhase('done');
    }, 1600);
  };

  if (wipePhase === 'done') return null;

  return (
    <>
      {wipePhase !== 'reveal' && wipePhase !== 'done' && (
        <div className={`loader-screen ${wipePhase === 'cover' ? 'hiding' : ''}`}>

          {/* CENTER AREA — animation swaps to button when done */}
          <div className="ldr-center">
            <AnimatePresence mode="wait">
              {!loadComplete ? (
                <motion.div
                  key="animation"
                  className="ldr-wrapper"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                >
                  <div className="ldr-animation">
                    {/* Love column */}
                    <div className="ldr-container">
                      <div className="ldr-carousel">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div className="ldr-love" key={`love-${i}`} />
                        ))}
                      </div>
                    </div>
                    {/* Death column */}
                    <div className="ldr-container">
                      <div className="ldr-carousel">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div className="ldr-death" key={`death-${i}`} />
                        ))}
                      </div>
                    </div>
                    {/* Robots column */}
                    <div className="ldr-container">
                      <div className="ldr-carousel">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div className="ldr-robots" key={`robot-${i}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="ldr-label">LOADING EXPERIENCE</span>
                </motion.div>
              ) : (
                <motion.div
                  key="enter"
                  className="ldr-enter-area"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                >
                  <button
                    className="ldr-enter-btn"
                    onClick={handleEnterClick}
                    id="loader-enter-btn"
                  >
                    ENTER THE EXPERIENCE
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PROGRESS BAR — full width at bottom, hidden once load complete */}
          <AnimatePresence>
            {!loadComplete && (
              <motion.div
                key="progress"
                className="ldr-progress-area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="ldr-progress-row">
                  <div className="ldr-progress-track">
                    <div
                      className="ldr-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className={`ldr-percentage ${progress >= 100 ? 'complete' : ''}`}>
                    {progress}%
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Wipe transition overlay */}
      {(wipePhase === 'cover' || wipePhase === 'reveal') && (
        <div className="wipe-overlay" style={{ zIndex: 10001 }}>
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
                <span className="wipe-label-text">INITIALIZING</span>
                <span className="wipe-label-dots">...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default Loader;
