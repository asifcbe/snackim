import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import OrderCard from '../components/OrderCard';
import { BananaChip } from '../components/Chips';

const Confetti = () => (
  <div className="confetti" aria-hidden>
    {Array.from({ length: 22 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: -80, x: 0, opacity: 1, rotate: 0 }}
        animate={{ y: 520 + Math.random() * 200, x: (Math.random() - 0.5) * 500, rotate: Math.random() * 720, opacity: 0 }}
        transition={{ duration: 2.4 + Math.random(), delay: Math.random() * 0.4, ease: 'easeOut' }}
        style={{ left: `${5 + Math.random() * 90}%` }}
      >
        <BananaChip size={22 + Math.random() * 24} />
      </motion.div>
    ))}
  </div>
);

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { api.get(`/api/orders/track/${orderId}`).then(({ data }) => setOrder(data)).catch(() => {}); }, [orderId]);

  return (
    <div className="container confirm">
      <Confetti />
      <motion.div className="confirm-hero" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 12 }}>
        <div className="confirm-emoji">🎉</div>
        <h1>Order placed!</h1>
        <p className="lead" style={{ margin: '0 auto' }}>Your chips get fried in the next morning batch and sealed while they&rsquo;re still warm. We&rsquo;ll keep you posted at every step.</p>
      </motion.div>
      {order ? <OrderCard order={order} /> : <div className="spinner" />}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 30 }}>
        <Link to="/track-order" className="btn btn-yellow">Track order</Link>
        <Link to="/shop" className="btn btn-white">Keep snacking</Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
