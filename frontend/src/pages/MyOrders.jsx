import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import OrderCard from '../components/OrderCard';

const MyOrders = () => {
  const [orders, setOrders] = useState(null);
  useEffect(() => { api.get('/api/orders/my').then(({ data }) => setOrders(data)).catch(() => setOrders([])); }, []);
  return (
    <div className="container narrow" style={{ paddingBottom: 80 }}>
      <div className="page-hero"><span className="eyebrow">Your snack history</span><h1>My orders</h1></div>
      {!orders ? <div className="spinner" /> : orders.length === 0 ? (
        <div className="empty"><div style={{ fontSize: 56 }}>🍌</div><p>No orders yet. Your first crunch is waiting.</p><Link to="/shop" className="btn btn-yellow">Shop now</Link></div>
      ) : orders.map((o) => <OrderCard key={o._id} order={o} />)}
    </div>
  );
};

export default MyOrders;
