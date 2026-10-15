import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const STEP_ICONS = {
  farm: '🌾', banana: '🍌', peel: '✋', slice: '🔪', fry: '🔥', salt: '🧂', taste: '😋', pack: '📦', ship: '🚚', heart: '💛'
};

// "From the farm to your crunch" — a scroll-driven story. The section background moves from
// pre-dawn plum to sunrise yellow as the reader scrolls, and a sticky clock tracks the morning.
const ProcessTimeline = ({ title, subtitle, steps = [] }) => {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const fill = useSpring(useTransform(scrollYProgress, [0.05, 0.92], [0, 1]), { damping: 30, stiffness: 140 });
  const bg = useTransform(scrollYProgress, [0, 0.25, 0.55, 0.82], ['#2A1630', '#5E1D39', '#C2364F', '#FFBC42']);
  const headColor = useTransform(scrollYProgress, [0, 0.72, 0.82], ['#FFFFFF', '#FFFFFF', '#12333F']);
  const sunY = useTransform(scrollYProgress, [0, 1], ['70%', '-10%']);
  const sunScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.2]);
  const starsOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  if (!steps.length) return null;
  const cur = steps[active] || steps[0];

  return (
    <motion.section ref={ref} className="process" style={{ backgroundColor: bg }} id="how-its-made">
      <div className="process-sky" aria-hidden>
        <motion.div className="process-stars" style={{ opacity: starsOpacity }} />
        <motion.div className="process-sun" style={{ top: sunY, scale: sunScale }} />
      </div>

      <div className="container">
        <motion.div className="process-head" style={{ color: headColor }}>
          <span className="eyebrow">How it&rsquo;s made</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </motion.div>
      </div>

      <div className="process-clock" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={active} className="process-clock-inner" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.3 }}>
            <span className="process-clock-time">🕓 {cur.time}</span>
            <span className="process-clock-label">{cur.title}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container process-track-wrap">
        <div className="process-line" aria-hidden><motion.span style={{ scaleY: fill }} /></div>
        <ol className="process-steps">
          {steps.map((s, i) => (
            <motion.li
              key={s._id || i}
              className={`process-step ${i % 2 ? 'right' : 'left'} ${active === i ? 'is-active' : ''}`}
              onViewportEnter={() => setActive(i)}
              viewport={{ amount: 0.6 }}
            >
              <motion.div
                className="process-node"
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: 'spring', damping: 12 }}
              >
                <motion.span animate={active === i ? { rotate: [0, -12, 12, 0], scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.7 }}>
                  {STEP_ICONS[s.icon] || '🍌'}
                </motion.span>
              </motion.div>
              <motion.div
                className="process-card"
                initial={{ opacity: 0, x: i % 2 ? 60 : -60, rotate: i % 2 ? 3 : -3 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="process-card-top">
                  <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="badge badge-yellow">{s.time}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </motion.div>
            </motion.li>
          ))}
        </ol>
        <Reveal />
      </div>
    </motion.section>
  );
};

const Reveal = () => (
  <motion.div className="process-end" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
    <span>☀️</span>
    <p>…and the kadai is usually cleaned before most people have finished breakfast.</p>
  </motion.div>
);

export default ProcessTimeline;
