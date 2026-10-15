import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { BananaChip, Steam } from '../Chips';
import ProductVisual from '../ProductVisual';
import { rupee } from '../../utils/api';

const FEATURES = [
  { emoji: '🍌', title: 'Nendran bananas', text: 'The Kerala variety that fries up firm, golden and crisp.' },
  { emoji: '🥥', title: 'Pure coconut oil', text: 'Never palm oil, and fresh oil for every batch.' },
  { emoji: '✋', title: 'Hand-sliced', text: 'Sliced straight into the kadai, so no slice sits waiting.' },
  { emoji: '🧂', title: 'Turmeric salt water', text: 'Splashed in mid-fry for that golden colour.' }
];

const BananaSpotlight = ({ products = [] }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-60, 120]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const smallRotate = useTransform(scrollYProgress, [0, 1], [90, -90]);

  return (
    <section ref={ref} className="spotlight grain" id="banana-chips">
      <div className="container spotlight-grid">
        <div className="spotlight-art">
          <motion.div className="spotlight-ring" style={{ rotate }}>
            <svg viewBox="0 0 400 400" aria-hidden>
              <defs><path id="ringPath" d="M200,200 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0" /></defs>
              <text textLength="1060" lengthAdjust="spacing"><textPath href="#ringPath" textLength="1060" lengthAdjust="spacing">THE OG · KERALA BANANA CHIPS · FRIED IN COCONUT OIL · SINCE 1995 · </textPath></text>
            </svg>
          </motion.div>
          <motion.div className="spotlight-chip" style={{ rotate, y }}>
            <BananaChip size={300} />
          </motion.div>
          <Steam width={90} className="spotlight-steam" />
          <motion.div className="spotlight-mini m1" style={{ rotate: smallRotate }}><BananaChip size={70} /></motion.div>
          <motion.div className="spotlight-mini m2" style={{ rotate: smallRotate }}><BananaChip size={50} /></motion.div>
        </div>

        <div className="spotlight-copy">
          <motion.span className="eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>The main character</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            Kerala <span className="hl">Banana Chips</span> that snap.
          </motion.h2>
          <motion.p className="lead" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.8 }}>
            Thin, golden and crackly. Pick a packet up and you can hear the crunch through the bag.
          </motion.p>
          <div className="spotlight-features">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} className="sf" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }}>
                <span className="sf-emoji">{f.emoji}</span>
                <div><strong>{f.title}</strong><p>{f.text}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div className="container">
          <div className="spotlight-flavors">
            {products.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 60, rotate: i % 2 ? 4 : -4 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: 'spring', damping: 16 }}>
                <Link to={`/product/${p._id}`} className="flavor-card">
                  <div className="flavor-visual"><ProductVisual product={p} /></div>
                  <div>
                    <strong>{p.name.replace(' Banana Chips', '')}</strong>
                    <span>{p.flavor}</span>
                    <em>from {rupee(p.variants?.[0]?.price ?? p.price)}</em>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/shop?category=banana-chips" className="btn btn-yellow btn-lg">See all banana chips <FiArrowRight /></Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default BananaSpotlight;
