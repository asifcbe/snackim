import React from 'react';
import { motion } from 'framer-motion';

export const ORDER_STEPS = [
  { key: 'placed', label: 'Placed', emoji: '🧾' },
  { key: 'confirmed', label: 'Confirmed', emoji: '✅' },
  { key: 'frying', label: 'In the kadai', emoji: '🔥' },
  { key: 'packed', label: 'Sealed', emoji: '📦' },
  { key: 'shipped', label: 'On the way', emoji: '🚚' },
  { key: 'delivered', label: 'Crunch time', emoji: '😋' }
];

const OrderProgress = ({ status }) => {
  if (status === 'cancelled') return <div className="badge badge-danger">Order cancelled</div>;
  const idx = Math.max(ORDER_STEPS.findIndex((s) => s.key === status), 0);
  return (
    <div className="oprog">
      <div className="oprog-bar"><motion.span initial={{ width: 0 }} animate={{ width: `${(idx / (ORDER_STEPS.length - 1)) * 100}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} /></div>
      {ORDER_STEPS.map((s, i) => (
        <div key={s.key} className={`oprog-step ${i <= idx ? 'done' : ''} ${i === idx ? 'current' : ''}`}>
          <span className="oprog-dot">{s.emoji}</span>
          <span className="oprog-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
};

export default OrderProgress;
