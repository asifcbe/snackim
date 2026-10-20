import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiGrid } from 'react-icons/fi';
import Wordmark from './Wordmark';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/shop', label: 'Shop all' },
  { to: '/shop?category=banana-chips', label: 'Banana Chips', hot: true },
  { to: '/story', label: 'Our Story' },
  { to: '/track-order', label: 'Track Order' }
];

const Navbar = () => {
  const { itemCount, setIsOpen, bump } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to) => {
    const [path, query] = to.split('?');
    if (location.pathname !== path) return false;
    return query ? location.search === `?${query}` : !location.search.includes('category=');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenu(false); setUserMenu(false); }, [location.pathname, location.search]);
  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; }, [menu]);

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-inner">
        <button className="icon-btn nav-burger" onClick={() => setMenu(true)} aria-label="Open menu"><FiMenu size={20} /></button>
        <Link to="/" className="nav-logo" aria-label="Snackim home"><Wordmark size={30} /></Link>

        <nav className="nav-links">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`}>
              {l.label}{l.hot && <span className="nav-hot">OG</span>}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="nav-user">
            <button className="icon-btn" aria-label="Account" onClick={() => (user ? setUserMenu((v) => !v) : navigate('/login'))}><FiUser size={19} /></button>
            <AnimatePresence>
              {userMenu && user && (
                <motion.div className="nav-dropdown" initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}>
                  <div className="nav-dropdown-head">Hey {user.name?.split(' ')[0]} 👋</div>
                  {isAdmin && <Link to="/admin"><FiGrid /> Admin panel</Link>}
                  <Link to="/my-orders"><FiPackage /> My orders</Link>
                  <button onClick={() => { logout(); navigate('/'); }}><FiLogOut /> Log out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            key={bump}
            className="icon-btn nav-cart"
            aria-label="Open cart"
            onClick={() => setIsOpen(true)}
            animate={bump ? { rotate: [0, -14, 12, -8, 0], scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.6 }}
          >
            <FiShoppingBag size={19} />
            {itemCount > 0 && <span className="nav-count">{itemCount}</span>}
          </motion.button>
        </div>
      </div>

      {/* Portaled to body: .nav's backdrop-filter would otherwise trap this fixed overlay inside the navbar box. */}
      {createPortal(<AnimatePresence>
        {menu && (
          <motion.div className="mobile-menu" initial={{ clipPath: 'circle(0% at 30px 30px)' }} animate={{ clipPath: 'circle(150% at 30px 30px)' }} exit={{ clipPath: 'circle(0% at 30px 30px)' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mobile-menu-top">
              <Wordmark size={30} variant="on-dark" />
              <button className="icon-btn" onClick={() => setMenu(false)} aria-label="Close menu"><FiX size={20} /></button>
            </div>
            <nav>
              {[{ to: '/', label: 'Home' }, ...links, user ? { to: '/my-orders', label: 'My Orders' } : { to: '/login', label: 'Login' }].map((l, i) => (
                <motion.div key={l.to} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
                  <Link to={l.to}>{l.label}</Link>
                </motion.div>
              ))}
            </nav>
            <p className="mobile-menu-foot">Good snacks. Brighter days.</p>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </header>
  );
};

export default Navbar;
