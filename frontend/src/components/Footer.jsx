import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiYoutube, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Wordmark from './Wordmark';
import { BananaChip } from './Chips';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const s = useSettings();
  const social = s.socialLinks || {};
  return (
    <footer className="footer grain">
      <div className="footer-chips" aria-hidden>
        <BananaChip size={90} style={{ left: '6%', top: -40, transform: 'rotate(18deg)' }} />
        <BananaChip size={60} style={{ right: '12%', top: -24, transform: 'rotate(-30deg)' }} />
      </div>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Wordmark size={54} variant="on-dark" />
            <p className="footer-tag">GOOD SNACKS <br />BRIGHTER DAYS</p>
            <span className="dash" />
            <p className="footer-blurb">A family recipe from 1995, now run by the grandkids. Fried every morning in small batches, in pure coconut oil.</p>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Snack</h4>
              <Link to="/shop?category=banana-chips">Banana Chips</Link>
              <Link to="/shop?category=potato-chips">Potato Chips</Link>
              <Link to="/shop?category=tapioca-chips">Tapioca Chips</Link>
              <Link to="/shop?category=combo-boxes">Gift Boxes</Link>
            </div>
            <div>
              <h4>Help</h4>
              <Link to="/track-order">Track order</Link>
              <Link to="/policy/shipping">Shipping</Link>
              <Link to="/policy/refunds">Refunds</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div>
              <h4>Snackim</h4>
              <Link to="/story">Our story</Link>
              <Link to="/policy/privacy">Privacy</Link>
              <Link to="/policy/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {s.storeName || 'Snackim'}. Made with coconut oil &amp; good vibes.</span>
          <div className="footer-social">
            <a href={social.instagram || '#'} aria-label="Instagram"><FiInstagram /></a>
            <a href={social.youtube || '#'} aria-label="YouTube"><FiYoutube /></a>
            <a href={social.facebook || '#'} aria-label="Facebook"><FiFacebook /></a>
            <a href={social.whatsapp || '#'} aria-label="WhatsApp"><FaWhatsapp /></a>
          </div>
        </div>
      </div>
      <div className="footer-giant" aria-hidden><Wordmark size="min(22vw, 300px)" variant="mono" /></div>
    </footer>
  );
};

export default Footer;
