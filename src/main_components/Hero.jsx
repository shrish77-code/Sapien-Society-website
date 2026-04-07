import React from 'react';
import { motion } from 'motion/react';
import './Hero.css';
import ReflectiveCard from './ReflectiveCard';

const Hero = ({ onNavigate }) => {
  return (
    <div className="hero-wrapper" id="home">
      {/* Top Left Logo in black space — slides up from bottom */}
      <motion.div
        className="top-left-logo"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="logo-line"></div>
        <div className="logo-text">
          <span className="logo-solid">S<span className="font-special">A</span>P<span className="font-special">I</span>EN</span>
          <span className="logo-outline">S<span className="font-special">O</span>CIE<span className="font-special">T</span>Y</span>
        </div>
      </motion.div>

      <main className="hero-container">

        {/* Top Header Text — slides down from top */}
        <header className="hero-header">
          <div className="header-top">
            <div className="h-left">
            </div>
            <div className="h-right">
              <motion.span
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              >
                28.6139° N / 77.2090° E
              </motion.span>
              <motion.span
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
              >
                INDIA
              </motion.span>
            </div>
          </div>
          <div className="header-line"></div>
        </header>

        {/* The Unbreakable Top Angled Border */}
        <div className="geometric-line top-line"></div>

        {/* Main Title */}
        <div className="hero-title-section">
          <h1 className="main-title anim-drop-down" style={{ animationDelay: '0.5s' }}>
            <span className="font-special">S</span>A<span className="font-special">P</span>IEN<span className="outline-text"><span className="font-special">S</span>OCIE<span className="font-special">T</span>Y</span>
          </h1>
        </div>

        {/* 3-Column Content Grid */}
        <div className="hero-content-grid">

          <div className="grid-col left-col">
            <div className="ranked-list">
              <div className="ranked-item">
                <div className="sweep-line" style={{ animationDelay: '0.8s' }}></div>
                <span className="ranked-text-content" style={{ animationDelay: '0.8s' }}>
                  <span className="font-special">S</span>EL<span className="font-special">E</span>C<span className="font-special">T</span>ED.
                </span>
              </div>
              <div className="ranked-item">
                <div className="sweep-line" style={{ animationDelay: '1.0s' }}></div>
                <span className="ranked-text-content" style={{ animationDelay: '1.0s' }}>
                  <span className="font-special">R</span>A<span className="font-special">N</span>K<span className="font-special">E</span>D.
                </span>
              </div>
              <div className="ranked-item">
                <div className="sweep-line" style={{ animationDelay: '1.2s' }}></div>
                <span className="ranked-text-content" style={{ animationDelay: '1.2s' }}>
                  <span className="font-special">A</span>S<span className="font-special">C</span>E<span className="font-special">N</span>DE<span className="font-special">D</span>.
                </span>
              </div>
            </div>

            {/* Know More button — slides up from bottom */}
            <motion.div
              className="button-container"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="button-wrapper">
                <div className="btn-corner top-left"></div>
                <div className="btn-corner bottom-right"></div>
                <button className="know-more-btn" onClick={() => onNavigate && onNavigate('/society')}>
                  &gt;_KNOW_MORE
                </button>
              </div>
            </motion.div>
          </div>

          <div className="grid-col center-col">
            <div className="center-top-blank"></div>
            <div className="description-box">
              <p className="description-text">
                Sapien Society gathers the top fifty minds, where ambition meets precision and only the exceptional rise above the ordinary. In a world driven by noise, this community stands apart—focused, relentless, and defined by impact. Every member is chosen, every move intentional, every step aligned with a higher standard. This is not for everyone. This is where the few shape what comes next.
              </p>
              <div className="tick-mark bottom-left"></div>
              <div className="tick-mark bottom-center"></div>
              <div className="tick-mark bottom-right"></div>
            </div>
            <div className="icon-box">
              <div className="hexagon-icon">
                <div className="hex-inner"></div>
              </div>
            </div>
          </div>

          <div className="grid-col right-col">
            <motion.div 
              className="right-top-content" 
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4% 10%', boxSizing: 'border-box' }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 1, 0.5, 1] }}
            >
              <ReflectiveCard
                overlayColor="rgba(0, 0, 0, 0.4)"
                blurStrength={12}
                glassDistortion={30}
                metalness={1}
                roughness={0.75}
                displacementStrength={20}
                noiseScale={1}
                specularConstant={5}
                grayscale={0.15}
                color="#FF1919"
              />
            </motion.div>
          </div>
        </div>

        {/* The Unbreakable Bottom Angled Border */}
        <div className="geometric-line bottom-line"></div>

        {/* Bottom Bar */}
        <footer className="hero-footer">

        </footer>

      </main>
    </div>
  );
};

export default Hero;