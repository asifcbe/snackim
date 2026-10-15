import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';
import { mediaUrl } from '../../utils/api';
import { BananaChip } from '../Chips';

// Big poster card for the uploaded ad film; opens the full-screen player.
const FilmSection = ({ ad, onPlay }) => {
  if (!ad?.url) return null;
  return (
    <section className="film section">
      <div className="container">
        <motion.button
          className="film-card"
          onClick={onPlay}
          initial={{ opacity: 0, scale: 0.92, y: 60 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          aria-label={`Play ${ad.title}`}
        >
          {ad.poster
            ? <img src={mediaUrl(ad.poster)} alt="" className="film-poster" />
            : <video src={`${mediaUrl(ad.url)}#t=1`} className="film-poster" muted playsInline preload="metadata" />}
          <div className="film-shade" />
          <div className="film-copy">
            <span className="eyebrow">Now playing</span>
            <h2>{ad.title}</h2>
            <p>{ad.subtitle}</p>
          </div>
          <span className="film-play"><FiPlay size={34} /></span>
          <BananaChip size={80} className="film-chip" />
        </motion.button>
      </div>
    </section>
  );
};

export default FilmSection;
