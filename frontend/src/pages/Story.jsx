import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import LegacySection from '../components/home/LegacySection';
import ProcessTimeline from '../components/home/ProcessTimeline';
import { BananaChip } from '../components/Chips';

const Story = () => {
  const [landing, setLanding] = useState(null);
  useEffect(() => { api.get('/api/landing').then(({ data }) => setLanding(data)).catch(() => setLanding({})); }, []);
  if (!landing) return <div className="spinner" />;
  return (
    <div>
      <section className="story-hero grain">
        <div className="container">
          <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Est. 1995 · Reloaded 2025</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            Grandpa&rsquo;s recipe.<br /><span className="text-pink">Our</span> playlist.
          </motion.h1>
          <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Snackim started as one iron kadai at a bus-stand corner. Thirty years later the third generation runs it, and we still start frying at 4:30 every morning.
          </motion.p>
        </div>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className={`story-chip s${i}`} animate={{ y: [0, -18, 0], rotate: [0, 20, 0] }} transition={{ duration: 5 + i, repeat: Infinity }}>
            <BananaChip size={60 + i * 30} />
          </motion.div>
        ))}
      </section>
      <LegacySection title={landing.legacyTitle} text={landing.legacyText} image={landing.legacyImage} milestones={landing.legacyMilestones || []} />
      <ProcessTimeline title={landing.processTitle} subtitle={landing.processSubtitle} steps={landing.processSteps || []} />
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>Taste 30 years in one bite.</h2>
          <Link to="/shop?category=banana-chips" className="btn btn-pink btn-lg">Shop banana chips</Link>
        </div>
      </section>
    </div>
  );
};

export default Story;
