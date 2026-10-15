import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMinus, FiPlus, FiArrowLeft, FiTruck, FiShield } from 'react-icons/fi';
import api, { rupee } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductVisual from '../components/ProductVisual';
import ProductCard from '../components/ProductCard';
import { BananaChip, Steam } from '../components/Chips';
import { batchCode, todayLabel, shipLine } from '../utils/fresh';

const BG = { yellow: 'var(--yellow)', sky: 'var(--sky)', pink: 'var(--pink)', plum: 'var(--plum)', teal: 'var(--teal)' };

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setProduct(null); setQty(1); setImgIdx(0);
    api.get(`/api/products/${id}`).then(({ data }) => {
      setProduct(data);
      setVariant(data.variants?.[0] || null);
      api.get('/api/products', { params: { category: data.category, limit: 5 } })
        .then(({ data: r }) => setRelated(r.products.filter((p) => p._id !== data._id).slice(0, 4)));
    }).catch(() => setError('This snack wandered off.'));
    window.scrollTo(0, 0);
  }, [id]);

  if (error) return <div className="empty"><p>{error}</p><Link to="/shop" className="btn btn-yellow">Back to shop</Link></div>;
  if (!product) return <div className="spinner" />;

  const price = variant?.price ?? product.price;
  const mrp = variant?.mrp ?? product.mrp;
  const stock = variant ? variant.stock : product.stock;
  const images = product.images?.length ? product.images : [null];

  return (
    <div className="pdp">
      <div className="container">
        <Link to={`/shop?category=${product.category}`} className="pdp-back"><FiArrowLeft /> Back to {product.category.replace('-', ' ')}</Link>
        <div className="pdp-grid">
          <div className="pdp-gallery">
            <motion.div className="pdp-stage grain" style={{ background: BG[product.packColor] || BG.yellow }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <BananaChip size={110} className="pdp-chip c1" />
              <BananaChip size={70} className="pdp-chip c2" />
              <Steam width={64} className="pdp-steam" />
              <AnimatePresence mode="wait">
                <motion.div key={imgIdx} className="pdp-visual" initial={{ opacity: 0, y: 40, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ type: 'spring', damping: 16 }}>
                  <ProductVisual product={product} index={imgIdx} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            {images.length > 1 && (
              <div className="pdp-thumbs">
                {images.map((_, i) => (
                  <button key={i} className={i === imgIdx ? 'active' : ''} onClick={() => setImgIdx(i)}><ProductVisual product={product} index={i} /></button>
                ))}
              </div>
            )}
          </div>

          <motion.div className="pdp-info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="pdp-badges">
              {product.bestseller && <span className="badge badge-pink">Bestseller</span>}
              <span className="badge badge-soft">{product.flavor}</span>
              {product.spiceLevel > 0 && <span className="badge badge-soft">{'🌶️'.repeat(product.spiceLevel)}</span>}
            </div>
            <h1>{product.name}</h1>
            {product.tagline && <p className="pdp-tagline">{product.tagline}</p>}

            <div className="pdp-price">
              <strong>{rupee(price)}</strong>
              {mrp > price && <><s>{rupee(mrp)}</s><span className="badge badge-yellow">{Math.round(((mrp - price) / mrp) * 100)}% off</span></>}
            </div>

            {product.variants?.length > 0 && (
              <div className="pdp-variants">
                <span className="form-label">Pack size</span>
                <div className="pdp-variant-row">
                  {product.variants.map((v) => (
                    <button key={v._id} className={`variant ${variant?._id === v._id ? 'active' : ''}`} onClick={() => setVariant(v)} disabled={v.stock <= 0}>
                      <strong>{v.value}</strong><span>{rupee(v.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pdp-buy">
              <div className="qty qty-lg">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><FiMinus /></button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(stock, q + 1))} aria-label="Increase"><FiPlus /></button>
              </div>
              <button className="btn btn-pink btn-lg" style={{ flex: 1 }} disabled={stock <= 0} onClick={() => addItem(product, qty, variant)}>
                {stock <= 0 ? 'Sold out — next batch soon' : `Add to bag · ${rupee(price * qty)}`}
              </button>
            </div>

            <div className="batch-card">
              <div className="batch-row"><span className="live-dot" style={{ color: 'var(--teal)' }} /><strong>Today&rsquo;s batch</strong><span className="muted">{batchCode()}</span></div>
              <div className="batch-grid">
                <div><span>Packed on</span><strong>{todayLabel()}</strong></div>
                <div><span>Fried in</span><strong>Coconut oil</strong></div>
                <div><span>Dispatch</span><strong>{shipLine().replace('Order before 2 PM, ', '')}</strong></div>
              </div>
            </div>

            <p className="pdp-desc">{product.description}</p>
            {product.ingredients && (
              <details className="pdp-details" open>
                <summary>Ingredients</summary>
                <p>{product.ingredients}</p>
              </details>
            )}
            <div className="pdp-perks">
              <span><FiTruck /> Free shipping over ₹499</span>
              <span><FiShield /> Nitrogen-sealed for crunch</span>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="section" style={{ paddingTop: 60 }}>
            <h2 style={{ fontSize: '2.2rem' }}>Goes great with</h2>
            <div className="product-grid">{related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}</div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
