import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api, { errMsg } from '../utils/api';
import OrderCard from '../components/OrderCard';

const TrackOrder = () => {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true); setError(''); setOrders(null);
    try {
      if (/^\d{10}$/.test(q.replace(/\D/g, '')) && !/^SK/i.test(q)) {
        const { data } = await api.get(`/api/orders/track-phone/${q.replace(/\D/g, '')}`);
        setOrders(data);
      } else {
        const { data } = await api.get(`/api/orders/track/${q.toUpperCase()}`);
        setOrders([data]);
      }
    } catch (err) {
      setError(errMsg(err, 'Order not found'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container narrow">
      <div className="page-hero" style={{ textAlign: 'center' }}>
        <span className="eyebrow">Where&rsquo;s my crunch?</span>
        <h1>Track your order</h1>
        <form onSubmit={search} className="track-form">
          <input className="form-control" placeholder="Order ID (SK…) or phone number" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn btn-pink" disabled={loading}>{loading ? '…' : 'Track'}</button>
        </form>
        {error && <p className="text-pink" style={{ marginTop: 14 }}>{error}</p>}
      </div>
      {orders && orders.map((o, i) => (
        <motion.div key={o._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}><OrderCard order={o} /></motion.div>
      ))}
    </div>
  );
};

export default TrackOrder;
