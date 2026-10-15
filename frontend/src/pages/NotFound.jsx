import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BananaChip } from '../components/Chips';

const NotFound = () => (
  <div className="container" style={{ textAlign: 'center', padding: '100px 16px' }}>
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}><BananaChip size={120} /></motion.div>
    <h1>404: someone ate this page.</h1>
    <p className="lead" style={{ margin: '0 auto 24px' }}>But there&rsquo;s plenty more where that came from.</p>
    <Link to="/shop" className="btn btn-pink btn-lg">Go to the shop</Link>
  </div>
);

export default NotFound;
