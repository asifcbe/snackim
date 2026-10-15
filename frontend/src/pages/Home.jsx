import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import api from '../utils/api';
import unboxing from '../assets/unboxing.jpg';
import HeroCarousel from '../components/home/HeroCarousel';
import BananaSpotlight from '../components/home/BananaSpotlight';
import ProcessTimeline from '../components/home/ProcessTimeline';
import LegacySection from '../components/home/LegacySection';
import FilmSection from '../components/home/FilmSection';
import Reviews from '../components/home/Reviews';
import FullscreenVideo from '../components/FullscreenVideo';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import Reveal from '../components/Reveal';
import Wordmark from '../components/Wordmark';
import { BananaChip } from '../components/Chips';

const AD_SEEN_KEY = 'snackimAdSeen';

const CAT_EMOJI = { 'banana-chips': '🍌', 'potato-chips': '🥔', 'tapioca-chips': '🌿', mixtures: '🌶️', 'sweet-bites': '🍯', 'combo-boxes': '🎁' };

const Home = () => {
  const [landing, setLanding] = useState(null);
  const [bestsellers, setBestsellers] = useState([]);
  const [banana, setBanana] = useState([]);
  const [categories, setCategories] = useState([]);
  const [video, setVideo] = useState(null); // { src, poster, title, subtitle, ad }

  useEffect(() => {
    api.get('/api/landing').then(({ data }) => {
      setLanding(data);
      const ad = data.adVideo;
      let seen = false;
      try { seen = sessionStorage.getItem(AD_SEEN_KEY) === '1'; } catch { /* storage blocked */ }
      if (ad?.enabled && ad?.url && ad?.autoplayOnLanding && !seen) {
        setTimeout(() => setVideo({ src: ad.url, poster: ad.poster, title: ad.title, subtitle: ad.subtitle, ad: true }), 700);
        try { sessionStorage.setItem(AD_SEEN_KEY, '1'); } catch { /* ignore */ }
      }
    }).catch(() => setLanding({}));
    api.get('/api/products', { params: { bestseller: true, limit: 4 } }).then(({ data }) => setBestsellers(data.products)).catch(() => {});
    api.get('/api/products', { params: { category: 'banana-chips', limit: 4 } }).then(({ data }) => setBanana(data.products)).catch(() => {});
    api.get('/api/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const playAd = () => {
    const ad = landing?.adVideo;
    if (ad?.url) setVideo({ src: ad.url, poster: ad.poster, title: ad.title, subtitle: ad.subtitle, ad: false });
  };

  return (
    <div className="home">
      <HeroCarousel
        landing={landing}
        onWatchAd={playAd}
        onOpenVideo={(s) => setVideo({ src: s.url, poster: s.poster, title: s.caption, subtitle: s.subcaption })}
      />

      <div className="fresh-strip">
        <Marquee
          speed={30}
          separator={<BananaChip size={26} />}
          items={['Fried this morning', 'Sealed while warm', 'Small batches only', 'Out the door the same day', 'Coconut oil, never palm', 'Hand-sliced Nendran']}
        />
      </div>

      <BananaSpotlight products={banana} />

      {bestsellers.length > 0 && (
        <section className="section bestsellers">
          <div className="container">
            <div className="section-head">
              <Reveal>
                <span className="eyebrow">Fan favourites</span>
                <h2>Bestsellers, <span className="text-teal">fresh outta the kadai</span></h2>
              </Reveal>
              <Link to="/shop" className="btn btn-ghost">Shop all <FiArrowRight /></Link>
            </div>
            <div className="product-grid">
              {bestsellers.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Mounted only once data exists so its scroll-linked hooks bind to the real section */}
      {landing?.processSteps?.length > 0 && (
        <ProcessTimeline title={landing.processTitle} subtitle={landing.processSubtitle} steps={landing.processSteps} />
      )}

      <FilmSection ad={landing?.adVideo} onPlay={playAd} />

      {landing && <LegacySection title={landing.legacyTitle} text={landing.legacyText} image={landing.legacyImage} milestones={landing.legacyMilestones || []} />}

      {categories.length > 0 && (
        <section className="section cats">
          <div className="container">
            <Reveal style={{ textAlign: 'center', marginBottom: 40 }}>
              <span className="eyebrow">Pick your crunch</span>
              <h2>What are we snacking on?</h2>
            </Reveal>
            <div className="cat-grid">
              {categories.map((c, i) => (
                <motion.div key={c._id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, type: 'spring', damping: 14 }}>
                  <Link to={`/shop?category=${c.slug}`} className={`cat-tile cat-${c.color || 'yellow'}`}>
                    <span className="cat-emoji">{CAT_EMOJI[c.slug] || '✨'}</span>
                    <strong>{c.name}</strong>
                    <span>{c.tagline}</span>
                    <FiArrowRight className="cat-arrow" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Reviews />

      <section className="section thanks">
        <div className="container thanks-grid">
          <Reveal className="thanks-img" x={-40} y={0}>
            <img src={unboxing} alt="The Snackim box with three packs, a thank-you card and a sticker" loading="lazy" />
          </Reveal>
          <Reveal className="thanks-copy" delay={0.1}>
            <h2>Thanks for <br />snacking <span className="text-teal">with us.</span></h2>
            <span className="dash" />
            <p className="eyebrow-text">GOOD PEOPLE · GREAT SNACKS · BRIGHTER DAYS</p>
            <p className="lead">Every box is packed by hand, on the same morning it ships, with a handwritten thank-you card inside. Gift one, or keep it for yourself.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/shop?category=combo-boxes" className="btn btn-pink btn-lg">Gift a box</Link>
              <Link to="/story" className="btn btn-white btn-lg">Our story</Link>
            </div>
          </Reveal>
        </div>
        <div className="thanks-wordmark" aria-hidden><Wordmark size="min(18vw, 240px)" /></div>
      </section>

      <AnimatePresence>
        {video && <FullscreenVideo key={video.src} {...video} onClose={() => setVideo(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Home;
