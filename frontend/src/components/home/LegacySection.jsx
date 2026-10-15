import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, animate } from 'framer-motion';
import { mediaUrl } from '../../utils/api';
import Wordmark from '../Wordmark';

const Counter = ({ to = 30, duration = 2 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    const c = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{val}</span>;
};

// "30 years. Same kadai. New crew." — the family legacy, now run by the Gen Z.
const LegacySection = ({ title, text, image, milestones = [] }) => {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bigX = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);
  const [dragW, setDragW] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (el) setDragW(Math.max(el.scrollWidth - el.parentElement.offsetWidth, 0));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [milestones.length]);

  return (
    <section ref={ref} className="legacy grain" id="legacy">
      <motion.div className="legacy-bigtext" style={{ x: bigX }} aria-hidden>SINCE 1995 · SINCE 1995 ·</motion.div>

      <div className="container">
        <div className="legacy-grid">
          <div className="legacy-numbers">
            <div className="legacy-30"><Counter to={30} /><sup>yrs</sup></div>
            <div className="legacy-thennow">
              <motion.div className="tn-card tn-then" initial={{ rotate: -14, y: 40, opacity: 0 }} whileInView={{ rotate: -6, y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', damping: 14 }}>
                <span className="tn-label">Then · 1995</span>
                <div className="tn-art tn-art-then">
                  <span>🛺</span><span>🔥</span><span>🍌</span>
                </div>
                <p>One iron kadai. A bus-stand corner. Appa&rsquo;s recipe.</p>
              </motion.div>
              <motion.div className="tn-card tn-now" initial={{ rotate: 14, y: 40, opacity: 0 }} whileInView={{ rotate: 5, y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', damping: 14, delay: 0.15 }}>
                <span className="tn-label">Now · 2025</span>
                <div className="tn-art tn-art-now">
                  {image ? <img src={mediaUrl(image)} alt="Snackim today" /> : <Wordmark size={34} />}
                </div>
                <p>Same kadai and the same recipe. The new crew just ships across India.</p>
              </motion.div>
              <motion.div className="sticker sticker-genz" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, type: 'spring' }}>
                no cap,<br />same recipe ✌️
              </motion.div>
            </div>
          </div>

          <div className="legacy-copy">
            <span className="eyebrow">Our story</span>
            <h2>{title}</h2>
            <p className="legacy-text">{text}</p>
            <div className="legacy-tags">
              <span className="badge badge-yellow">Appa approved ✓</span>
              <span className="badge badge-sky">Gen Z operated</span>
              <span className="badge badge-pink">3rd generation</span>
            </div>
          </div>
        </div>

        {milestones.length > 0 && (
          <div className="milestones">
            <div className="milestones-hint">Drag to time-travel →</div>
            <div className="milestones-viewport">
              <motion.div ref={trackRef} className="milestones-track" drag="x" dragConstraints={{ left: -dragW, right: 0 }} dragElastic={0.08}>
                {milestones.map((m, i) => (
                  <motion.div
                    key={m._id || i}
                    className={`milestone ${i === milestones.length - 1 ? 'is-now' : ''}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                  >
                    <span className="milestone-year">{m.year}</span>
                    <span className="milestone-dot" />
                    <h4>{m.title}</h4>
                    <p>{m.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LegacySection;
