import React from 'react';
import PixelBlast from './PixelBlast';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      {/* PixelBlast Background */}
      <div className="contact-pixel-background">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#FF1919"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>

      {/* Main Content */}
      <div className="contact-content">
        <h2 className="contact-title">VENI.VIDI.VICI</h2>
        <a href="#" className="contact-button" aria-label="Join Us Google Form">
          <span>JOIN US</span>
        </a>
      </div>

      {/* Footer Text */}
      <div className="contact-footer">
        Designed and Developed by <span style={{ color: '#FF1919' }}>Shrish</span>
      </div>
    </section>
  );
};

export default Contact;
