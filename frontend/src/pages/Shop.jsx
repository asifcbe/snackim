import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { BananaChip } from '../components/Chips';

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const [search, setSearch] = useState(params.get('q') || '');
  const [sort, setSort] = useState('popular');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/api/categories').then(({ data }) => setCategories(data)).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api.get('/api/products', { params: { category: category || undefined, search: search || undefined, sort, limit: 60 } })
        .then(({ data }) => setProducts(data.products))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }, search ? 250 : 0);
    return () => clearTimeout(t);
  }, [category, search, sort]);

  const current = categories.find((c) => c.slug === category);
  const setCategory = (slug) => {
    const next = new URLSearchParams(params);
    if (slug) next.set('category', slug); else next.delete('category');
    setParams(next);
  };

  return (
    <div className="shop">
      <section className={`shop-hero cat-${current?.color || 'yellow'} grain`}>
        <div className="container">
          <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>The snack shelf</motion.span>
          <motion.h1 key={category} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {current ? current.name : 'Shop all snacks'}
          </motion.h1>
          <p className="lead">{current?.tagline || 'Everything on this shelf came out of the kadai this week.'}</p>
        </div>
        <BananaChip size={140} className="shop-hero-chip" />
      </section>

      <div className="container">
        <div className="shop-bar">
          <div className="shop-cats no-scrollbar">
            <button className={`pill ${!category ? 'active' : ''}`} onClick={() => setCategory('')}>All</button>
            {categories.map((c) => (
              <button key={c._id} className={`pill ${category === c.slug ? 'active' : ''}`} onClick={() => setCategory(c.slug)}>
                {c.name}{c.slug === 'banana-chips' && ' 🍌'}
              </button>
            ))}
          </div>
          <div className="shop-tools">
            <label className="search">
              <FiSearch />
              <input placeholder="Search flavours…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </label>
            <select className="form-control shop-sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              <option value="popular">Most loved</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
            </select>
          </div>
        </div>

        {loading ? <div className="spinner" /> : products.length === 0 ? (
          <div className="empty"><div style={{ fontSize: 56 }}>🫙</div><p>No snacks match that. Try another flavour?</p></div>
        ) : (
          <div className="product-grid" style={{ paddingBottom: 100 }}>
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
