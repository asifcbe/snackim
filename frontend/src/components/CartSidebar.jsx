import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import ProductVisual from './ProductVisual';
import { rupee } from '../utils/api';
import { shipLine } from '../utils/fresh';

const CartSidebar = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQty, subtotal } = useCart();
  const { freeShippingAbove = 499 } = useSettings();
  const navigate = useNavigate();
  const remaining = Math.max(freeShippingAbove - subtotal, 0);
  const progress = Math.min(subtotal / freeShippingAbove, 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="drawer-backdrop" onClick={() => setIsOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside className="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 280 }}>
            <div className="drawer-head">
              <h3>Your stash</h3>
              <button className="icon-btn" onClick={() => setIsOpen(false)} aria-label="Close cart"><FiX size={20} /></button>
            </div>

            {items.length > 0 && (
              <div className="ship-meter">
                <p>{remaining > 0 ? <>Add <strong>{rupee(remaining)}</strong> more for <strong>free shipping</strong> 🚚</> : <>You unlocked <strong>free shipping</strong> 🎉</>}</p>
                <div className="ship-bar"><motion.span animate={{ width: `${progress * 100}%` }} transition={{ type: 'spring', damping: 20 }} /></div>
              </div>
            )}

            <div className="drawer-items">
              {items.length === 0 ? (
                <div className="empty">
                  <div style={{ fontSize: 56 }}>🍌</div>
                  <p>Your bag is empty. Let&rsquo;s fix that.</p>
                  <button className="btn btn-yellow" onClick={() => { setIsOpen(false); navigate('/shop'); }}>Start snacking</button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((i) => (
                    <motion.div key={i.key} className="drawer-item" layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}>
                      <div className="drawer-thumb"><ProductVisual product={{ ...i, images: i.image ? [i.image] : [] }} /></div>
                      <div className="drawer-info">
                        <strong>{i.name}</strong>
                        <span className="muted">{i.variantLabel || i.flavor}</span>
                        <div className="qty">
                          <button onClick={() => updateQty(i.key, i.quantity - 1)} aria-label="Decrease"><FiMinus /></button>
                          <span>{i.quantity}</span>
                          <button onClick={() => updateQty(i.key, i.quantity + 1)} aria-label="Increase"><FiPlus /></button>
                        </div>
                      </div>
                      <div className="drawer-right">
                        <strong>{rupee(i.price * i.quantity)}</strong>
                        <button className="drawer-remove" onClick={() => removeItem(i.key)} aria-label="Remove"><FiTrash2 /></button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="drawer-foot">
                <div className="drawer-total"><span>Subtotal</span><strong>{rupee(subtotal)}</strong></div>
                <p className="drawer-note">🔥 {shipLine()}</p>
                <button className="btn btn-pink btn-lg btn-block" onClick={() => { setIsOpen(false); navigate('/checkout'); }}>Checkout</button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
