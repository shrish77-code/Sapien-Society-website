import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Rules.css';

const RULES = [
  {
    id: 1,
    title: 'Standout',
    number: '01',
    image: '/Rules images/rule 1.webp',
    mobileImage: '/mobile rules images/rule 1.webp',
    description: 'Be the exception, not the norm. Every member of Sapien Society is chosen because they refuse to blend in. Your work, your thinking, your presence — it should all demand attention without asking for it.',
    details: [
      'Original thinking over imitation',
      'Bold moves over safe plays',
      'Visibility through value',
      'Lead by example, not volume',
    ],
  },
  {
    id: 2,
    title: 'Egalitarian',
    number: '02',
    image: '/Rules images/rule 2.webp',
    mobileImage: '/mobile rules images/rule 2.webp',
    description: 'No hierarchy of ego. Inside these walls, respect is the baseline — not earned through titles but through action. We rise together or not at all.',
    details: [
      'Every voice carries weight',
      'No gatekeeping knowledge',
      'Mutual respect is mandatory',
      'Collaboration over competition',
    ],
  },
  {
    id: 3,
    title: 'Peace',
    number: '03',
    image: '/Rules images/rule 3.webp',
    mobileImage: '/mobile rules images/rule 3.jpg',
    description: 'Chaos belongs outside. Within the Society, we operate with calm precision. Drama, politics, and toxicity have no seat at this table.',
    details: [
      'Resolve conflicts with maturity',
      'Zero tolerance for toxicity',
      'Constructive criticism only',
      'Protect the collective energy',
    ],
  },
  {
    id: 4,
    title: 'First Years Only',
    number: '04',
    image: '/Rules images/rule 4.webp',
    mobileImage: '/mobile rules images/rule 4.webp',
    description: 'Fresh perspective is our edge. Only first-year students are eligible. We believe in shaping minds at the beginning of their journey — before the system dilutes their fire.',
    details: [
      'First-year students exclusively',
      'Raw ambition over experience',
      'Build habits from day one',
      'The future starts early',
    ],
  },
];

const STATEMENT_TEXT = (
  <>
    We are <span style={{ color: '#FF1919' }}>Sapien Society</span>. Not just a group, not an isolated circle. We cultivate standout individuals, enforce equality, maintain peace and welcome only the freshest minds as one unified approach. A disciplined ecosystem designed to elevate, protect and integrate seamlessly with ambition<span style={{ color: '#FF1919' }}>.</span>
  </>
);

const Rules = () => {
  const [hoveredRule, setHoveredRule] = useState(null);
  const statementRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeRule = RULES.find((r) => r.id === hoveredRule);

  const handleMouseMove = useCallback((e) => {
    const rect = statementRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <section className="rules-section" id="rules">
      {/* Background image layer */}
      <AnimatePresence>
        {activeRule && (
          <motion.div
            className="rules-bg-container"
            key={activeRule.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rules-bg-image">
              <img src={isMobile && activeRule.mobileImage ? activeRule.mobileImage : activeRule.image} alt="" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content overlay */}
      <div className="rules-content">
        {/* Top statement — cursor-following red reveal */}
        <div
          className="rules-statement"
          ref={statementRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Base white text */}
          <p className="rules-statement-text">{STATEMENT_TEXT}</p>
          {/* Red clone revealed through a radial mask near cursor */}
          <p
            className="rules-statement-text rules-statement-red"
            aria-hidden="true"
            style={{
              maskImage: isHovering
                ? `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, black 40%, transparent 100%)`
                : 'radial-gradient(circle 0px at -9999px -9999px, black 0%, transparent 100%)',
              WebkitMaskImage: isHovering
                ? `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, black 40%, transparent 100%)`
                : 'radial-gradient(circle 0px at -9999px -9999px, black 0%, transparent 100%)',
            }}
          >
            {STATEMENT_TEXT}
          </p>
        </div>

        {/* Divider line */}
        <div className="rules-divider"></div>

        {/* Bottom section: cards + description */}
        <div className="rules-bottom">
          {/* Left side: label + cards */}
          <div className="rules-left">
            <div className="rules-label-row">
              <span className="rules-label" style={{ color: '#FF1919' }}>OUR RULES</span>
            </div>
            <div className="rules-cards">
              {RULES.map((rule, index) => (
                <motion.div
                  key={rule.id}
                  className={`rule-card ${hoveredRule === rule.id ? 'rule-card--active' : ''}`}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 1, 0.5, 1] }}
                  onMouseEnter={() => setHoveredRule(rule.id)}
                  onMouseLeave={() => setHoveredRule(null)}
                  onClick={() => setHoveredRule(hoveredRule === rule.id ? null : rule.id)}
                >
                  <div className="rule-card-inner">
                    <span className="rule-card-number">{rule.number}</span>
                    <h3 className="rule-card-title">{rule.title}</h3>

                    <AnimatePresence>
                      {hoveredRule === rule.id && (
                        <motion.div
                          className="rule-card-expanded"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ul className="rule-card-details">
                            {rule.details.map((detail, i) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Corner accents */}
                  <div className="rule-corner rule-corner--tl"></div>
                  <div className="rule-corner rule-corner--br"></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side: description */}
          <div className="rules-right">
            <div className="rules-right-header">
              <span className="rules-est">Est. 2025</span>
            </div>
            <div className="rules-right-body">
              <AnimatePresence mode="wait">
                {activeRule ? (
                  <motion.div
                    key={activeRule.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="rules-right-text rules-right-text--highlight">
                      {activeRule.description}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="rules-right-text">
                      Every society is already in motion. People, ambition, decisions.
                      Our job isn't to sit on top of it. It's to step inside.
                    </p>
                    <p className="rules-right-text">
                      We work alongside members, read the pulse, identify where
                      energy is being lost and where it needs to be amplified. We
                      don't operate in silos: discipline, vision and execution move
                      together, because that's how greatness becomes sustainable.
                    </p>
                    <p className="rules-right-text">
                      With in-house minds collaborating in real time, we reduce
                      friction, align decisions and turn complexity into structure. We
                      don't add noise. <strong style={{ color: '#FF1919' }}>We bring direction.</strong>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left hint */}
      <span className="rules-hover-hint" style={{ color: '#FF1919' }}>HOVER OVER THE RULES</span>
    </section>
  );
};

export default Rules;
