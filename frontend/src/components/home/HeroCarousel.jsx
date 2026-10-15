import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiVolume2 } from 'react-icons/fi';
import BrandHero from './BrandHero';
import { mediaUrl } from '../../utils/api';

const IMAGE_DURATION = 7000;
const BRAND_DURATION = 9000;
const VIDEO_MAX = 30000;

// Slide 0 is always the animated brand hero; the rest are admin-uploaded image/video slides.
const HeroCarousel = ({ landing, onWatchAd, onOpenVideo }) => {
  const uploaded = landing?.carouselSlides || [];
  const slides = [{ _id: 'brand', kind: 'brand' }, ...uploaded.map((s) => ({ ...s, kind: s.mediaType }))];
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());
  const elapsedRef = useRef(0);
  const current = slides[index] || slides[0];

  const go = useCallback((next, d = 1) => {
    setDir(d);
    setIndex((next + slides.length) % slides.length);
    setProgress(0);
    elapsedRef.current = 0;
    startRef.current = Date.now();
  }, [slides.length]);

  const duration = current.kind === 'brand' ? BRAND_DURATION : current.kind === 'image' ? IMAGE_DURATION : VIDEO_MAX;

  // Timer-driven progress for brand/image slides; video slides report progress from the <video>.
  useEffect(() => {
    if (slides.length < 2 || current.kind === 'video') return undefined;
    let raf;
    const tick = () => {
      if (!paused) {
        const p = (elapsedRef.current + (Date.now() - startRef.current)) / duration;
        setProgress(Math.min(p, 1));
        if (p >= 1) { go(index + 1); return; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, paused, duration, current.kind, slides.length, go]);

  useEffect(() => {
    if (paused) elapsedRef.current += Date.now() - startRef.current;
    else startRef.current = Date.now();
  }, [paused]);

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? '8%' : '-8%', scale: 1.04 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? '-8%' : '8%', scale: 0.98 })
  };

  return (
    <section className="hero-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={current._id}
          className="hc-slide"
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          drag={slides.length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(e, info) => {
            if (info.offset.x < -80) go(index + 1, 1);
            else if (info.offset.x > 80) go(index - 1, -1);
          }}
        >
          {current.kind === 'brand' && (
            <BrandHero title={landing?.heroTitle || 'Crunch that hits different.'} subtitle={landing?.heroSubtitle} onWatch={landing?.adVideo?.url ? onWatchAd : null} />
          )}
          {current.kind !== 'brand' && (
            <MediaSlide
              slide={current}
              paused={paused}
              onProgress={setProgress}
              onEnded={() => go(index + 1)}
              onOpen={() => onOpenVideo(current)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <div className="hc-arrows">
            <button className="icon-btn" onClick={() => go(index - 1, -1)} aria-label="Previous slide"><FiChevronLeft size={22} /></button>
            <button className="icon-btn" onClick={() => go(index + 1, 1)} aria-label="Next slide"><FiChevronRight size={22} /></button>
          </div>
          <div className="hc-dots">
            {slides.map((s, i) => (
              <button key={s._id} className={`hc-dot ${i === index ? 'active' : ''}`} onClick={() => go(i, i > index ? 1 : -1)} aria-label={`Go to slide ${i + 1}`}>
                <span style={{ width: i < index ? '100%' : i === index ? `${progress * 100}%` : '0%' }} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

const MediaSlide = ({ slide, paused, onProgress, onEnded, onOpen }) => {
  const videoRef = useRef(null);
  const isVideo = slide.kind === 'video';

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause(); else v.play().catch(() => {});
  }, [paused]);

  return (
    <div className={`media-slide theme-${slide.theme || 'yellow'}`}>
      {isVideo ? (
        <video
          ref={videoRef}
          className="media-slide-bg"
          src={mediaUrl(slide.url)}
          poster={slide.poster ? mediaUrl(slide.poster) : undefined}
          autoPlay muted playsInline
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            const dur = Math.min(v.duration || 1, VIDEO_MAX / 1000);
            onProgress(Math.min(v.currentTime / dur, 1));
            if (v.currentTime >= VIDEO_MAX / 1000) onEnded();
          }}
          onEnded={onEnded}
        />
      ) : (
        <motion.img
          className="media-slide-bg"
          src={mediaUrl(slide.url)}
          alt={slide.caption || 'Snackim'}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: 'linear' }}
          draggable={false}
        />
      )}
      <div className="media-slide-shade" />
      <div className="container media-slide-copy">
        {slide.caption && (
          <motion.h2 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            {slide.caption}
          </motion.h2>
        )}
        {slide.subcaption && (
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>{slide.subcaption}</motion.p>
        )}
        <motion.div className="media-slide-ctas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          {slide.ctaText && <Link to={slide.ctaLink || '/shop'} className="btn btn-yellow btn-lg">{slide.ctaText}</Link>}
          {isVideo && (
            <button className="btn btn-white btn-lg" onClick={onOpen}><FiMaximize2 /> Watch full screen <FiVolume2 /></button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroCarousel;
