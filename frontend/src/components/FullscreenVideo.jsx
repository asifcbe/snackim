import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiX, FiVolume2, FiVolumeX, FiPlay, FiPause, FiMaximize } from 'react-icons/fi';
import Wordmark from './Wordmark';
import { mediaUrl } from '../utils/api';

// Full-screen video player used for the landing-page ad film and for video carousel slides.
// `ad` mode adds a skip countdown and an end-card CTA.
const FullscreenVideo = ({ src, poster, title, subtitle, onClose, ad = false, skipAfter = 5 }) => {
  const videoRef = useRef(null);
  const shellRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [ended, setEnded] = useState(false);
  const [showSoundHint, setShowSoundHint] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Try with sound first; browsers usually block that, so fall back to muted autoplay.
    v.muted = false;
    v.play().then(() => setPlaying(true)).catch(() => {
      v.muted = true;
      setMuted(true);
      setShowSoundHint(true);
      v.play().then(() => setPlaying(true)).catch(() => {});
    });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === ' ') { e.preventDefault(); toggle(); }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); setEnded(false); } else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    v.muted = !v.muted;
    setMuted(v.muted);
    setShowSoundHint(false);
  };

  const seek = (e) => {
    const v = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * (v.duration || 0);
  };

  const goNativeFullscreen = () => {
    const el = shellRef.current;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el?.requestFullscreen) el.requestFullscreen().catch(() => {});
    else videoRef.current?.webkitEnterFullscreen?.();
  };

  const skipIn = Math.max(0, Math.ceil(skipAfter - elapsed));

  return createPortal(
    <motion.div ref={shellRef} className="fsv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <motion.video
        ref={videoRef}
        className="fsv-video"
        src={mediaUrl(src)}
        poster={poster ? mediaUrl(poster) : undefined}
        playsInline
        onClick={toggle}
        onTimeUpdate={(e) => { const v = e.currentTarget; setElapsed(v.currentTime); setProgress(v.duration ? v.currentTime / v.duration : 0); }}
        onEnded={() => { setEnded(true); setPlaying(false); }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="fsv-top">
        <div className="fsv-brand">
          <Wordmark size={26} variant="on-dark" />
          {ad && <span className="badge badge-yellow">Presents</span>}
        </div>
        <div className="fsv-top-actions">
          {ad && !ended ? (
            skipIn > 0
              ? <span className="fsv-skip is-wait">Skip in {skipIn}</span>
              : <button className="fsv-skip" onClick={onClose}>Skip ad ⏭</button>
          ) : null}
          <button className="fsv-icon" onClick={onClose} aria-label="Close video"><FiX size={22} /></button>
        </div>
      </div>

      {showSoundHint && !ended && (
        <motion.button className="fsv-sound-hint" onClick={toggleMute} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <FiVolume2 /> Tap for sound
        </motion.button>
      )}

      {(title || subtitle) && !ended && (
        <motion.div className="fsv-caption" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </motion.div>
      )}

      {ended && (
        <motion.div className="fsv-end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Wordmark size="clamp(48px, 9vw, 110px)" variant="on-dark" />
          <p>GOOD SNACKS · BRIGHTER DAYS</p>
          <div className="fsv-end-actions">
            <Link to="/shop?category=banana-chips" className="btn btn-yellow btn-lg" onClick={onClose}>Shop the crunch</Link>
            <button className="btn btn-white btn-lg" onClick={toggle}>Watch again</button>
          </div>
        </motion.div>
      )}

      <div className="fsv-controls">
        <button className="fsv-icon" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <FiPause /> : <FiPlay />}</button>
        <div className="fsv-bar" onClick={seek}><span style={{ width: `${progress * 100}%` }} /></div>
        <button className="fsv-icon" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? <FiVolumeX /> : <FiVolume2 />}</button>
        <button className="fsv-icon" onClick={goNativeFullscreen} aria-label="Fullscreen"><FiMaximize /></button>
      </div>
    </motion.div>,
    document.body
  );
};

export default FullscreenVideo;
