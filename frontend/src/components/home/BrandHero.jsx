import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiPlay, FiArrowRight } from 'react-icons/fi';
import SnackPack from '../SnackPack';
import { BananaChip, Steam } from '../Chips';
import { kitchenStatus } from '../../utils/fresh';

const words = (text) => text.split(' ');

const FLOATERS = [
  { size: 74, x: '2%', y: '4%', r: 20, d: 0, depth: 30 },
  { size: 46, x: '44%', y: '8%', r: -30, d: 0.6, depth: 50 },
  { size: 58, x: '88%', y: '18%', r: 40, d: 1.1, depth: 40 },
  { size: 38, x: '52%', y: '82%', r: 10, d: 0.3, depth: 60 },
  { size: 64, x: '92%', y: '72%', r: -16, d: 0.9, depth: 25 },
  { size: 30, x: '3%', y: '78%', r: 60, d: 1.4, depth: 70 }
];

const BrandHero = ({ title, subtitle, onWatch, active = true }) => {
  const [status, setStatus] = useState(kitchenStatus());
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { damping: 30, stiffness: 120 });
  const sy = useSpring(my, { damping: 30, stiffness: 120 });
  const packX = useTransform(sx, (v) => v * -18);
  const packY = useTransform(sy, (v) => v * -12);

  useEffect(() => {
    const t = setInterval(() => setStatus(kitchenStatus()), 60000);
    return () => clearInterval(t);
  }, []);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div className="bhero grain" onMouseMove={onMove}>
      {FLOATERS.map((f, i) => (
        <Floater key={i} f={f} sx={sx} sy={sy} />
      ))}

      <div className="container bhero-grid">
        <div className="bhero-copy">
          <motion.div className={`kitchen-chip tone-${status.tone}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="live-dot" />
            <span className="kitchen-chip-label">Kitchen right now</span>
            <span>{status.emoji} {status.label}</span>
          </motion.div>

          <h1 className="bhero-title" aria-label={title}>
            {words(title).map((w, i) => (
              <span className="word-mask" key={i}>
                <motion.span
                  className={i === words(title).length - 1 ? 'text-pink' : ''}
                  initial={{ y: '110%', rotate: 6 }}
                  animate={active ? { y: '0%', rotate: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >{w}</motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={active ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7, duration: 0.8 }}>
            {subtitle}
          </motion.p>

          <motion.div className="bhero-ctas" initial={{ opacity: 0, y: 20 }} animate={active ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.85, duration: 0.8 }}>
            <Link to="/shop?category=banana-chips" className="btn btn-pink btn-lg">Shop banana chips <FiArrowRight /></Link>
            {onWatch && (
              <button className="btn btn-white btn-lg" onClick={onWatch}><span className="play-dot"><FiPlay size={14} /></span> Watch the film</button>
            )}
          </motion.div>

          <motion.div className="bhero-proof" initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.1 }}>
            <div><strong>30</strong><span>years of the<br />same recipe</span></div>
            <div><strong>4:30</strong><span>AM, every day<br />the kadai starts</span></div>
            <div><strong>100%</strong><span>coconut oil,<br />no palm oil</span></div>
          </motion.div>
        </div>

        <motion.div className="bhero-art" style={{ x: packX, y: packY }}>
          <motion.div className="bhero-sun" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="bhero-pack p1" initial={{ y: 200, rotate: -20, opacity: 0 }} animate={active ? { y: 0, rotate: -12, opacity: 1 } : {}} transition={{ delay: 0.3, type: 'spring', damping: 14 }}>
            <SnackPack name="Pepper Punch" color="teal" chipColor="#E9C25A" category="banana-chips" />
          </motion.div>
          <motion.div className="bhero-pack p3" initial={{ y: 200, rotate: 20, opacity: 0 }} animate={active ? { y: 0, rotate: 12, opacity: 1 } : {}} transition={{ delay: 0.45, type: 'spring', damping: 14 }}>
            <SnackPack name="Peri Peri" color="pink" chipColor="#F0A24A" category="banana-chips" />
          </motion.div>
          <motion.div className="bhero-pack p2" initial={{ y: 240, opacity: 0 }} animate={active ? { y: 0, opacity: 1 } : {}} transition={{ delay: 0.15, type: 'spring', damping: 13 }}>
            <SnackPack name="Classic Banana Chips" color="yellow" chipColor="#F7D774" category="banana-chips" />
          </motion.div>
          <div className="bhero-bowl">
            <Steam width={70} className="bhero-steam" />
            <div className="bowl-chips">
              {[0, 1, 2, 3, 4].map((i) => (
                <BananaChip key={i} size={58} style={{ transform: `translate(${(i - 2) * 30}px, ${Math.abs(i - 2) * 6}px) rotate(${i * 37}deg)` }} />
              ))}
            </div>
            <div className="bowl" />
          </div>
          <motion.div className="sticker sticker-round" animate={{ rotate: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <span>since<br /><b>1995</b></span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const Floater = ({ f, sx, sy }) => {
  const x = useTransform(sx, (v) => v * f.depth);
  const y = useTransform(sy, (v) => v * f.depth);
  return (
    <motion.div className="floater" style={{ left: f.x, top: f.y, x, y }}>
      <motion.div animate={{ y: [0, -14, 0], rotate: [f.r, f.r + 15, f.r] }} transition={{ duration: 5 + f.d, repeat: Infinity, ease: 'easeInOut', delay: f.d }}>
        <BananaChip size={f.size} />
      </motion.div>
    </motion.div>
  );
};

export default BrandHero;
