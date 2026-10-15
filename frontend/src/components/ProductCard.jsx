import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ProductVisual from './ProductVisual';
import { useCart } from '../context/CartContext';
import { rupee } from '../utils/api';

const BG = { yellow: 'var(--yellow-soft)', sky: 'var(--sky-soft)', pink: '#FBD3E1', plum: '#EBD3DE', teal: '#CDE9E7' };

const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const variant = product.variants?.[0];
  const price = variant?.price ?? product.price;
  const mrp = variant?.mrp ?? product.mrp;
  const off = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const stock = variant ? variant.stock : product.stock;

  const quickAdd = (e) => {
    e.preventDefault();
    if (stock <= 0) return;
    addItem(product, 1, variant || null, { open: false });
    toast.success(`${product.name}${variant ? ` (${variant.value})` : ''} added 🍌`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product._id}`} className="pcard" style={{ '--pcard-bg': BG[product.packColor] || BG.yellow }}>
        <div className="pcard-stage">
          <div className="pcard-badges">
            {product.bestseller && <span className="badge badge-pink">Bestseller</span>}
            {off > 0 && <span className="badge badge-yellow">{off}% off</span>}
          </div>
          <div className="pcard-visual"><ProductVisual product={product} /></div>
          <span className="pcard-batch"><span className="live-dot" /> Today&rsquo;s batch</span>
        </div>
        <div className="pcard-body">
          <div className="pcard-flavor">{product.flavor || product.category?.replace('-', ' ')}</div>
          <h3 className="pcard-name">{product.name}</h3>
          <div className="pcard-foot">
            <div className="pcard-price">
              <strong>{rupee(price)}</strong>
              {mrp > price && <s>{rupee(mrp)}</s>}
              {variant && <span className="pcard-size">/ {variant.value}</span>}
            </div>
            <button className="pcard-add" onClick={quickAdd} disabled={stock <= 0} aria-label={`Add ${product.name} to cart`}>
              {stock <= 0 ? 'Sold out' : <FiPlus size={20} />}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
