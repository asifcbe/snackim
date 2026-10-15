import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api, { mediaUrl, rupee, errMsg } from '../../utils/api';
import ProductVisual from '../../components/ProductVisual';

const PACK_COLORS = ['yellow', 'sky', 'pink', 'plum', 'teal'];
const blank = {
  name: '', tagline: '', description: '', category: 'banana-chips', flavor: '', sku: '', price: '', mrp: '', stock: 100,
  ingredients: '', spiceLevel: 0, packColor: 'yellow', chipColor: '#F7D774', featured: false, bestseller: false, isActive: true,
  tags: '', variants: []
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [files, setFiles] = useState([]);
  const [existing, setExisting] = useState([]);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState('');

  const load = () => api.get('/api/products/admin/all').then(({ data }) => setProducts(data));
  useEffect(() => { load(); api.get('/api/categories/admin/all').then(({ data }) => setCategories(data)); }, []);

  const open = (p) => {
    setFiles([]);
    if (p) {
      setForm({ ...blank, ...p, tags: (p.tags || []).join(', '), variants: (p.variants || []).map((v) => ({ ...v })) });
      setExisting(p.images || []);
    } else { setForm({ ...blank }); setExisting([]); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const setVar = (i, k, v) => setForm({ ...form, variants: form.variants.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)) });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    const skip = ['_id', 'images', 'createdAt', 'updatedAt', '__v', 'variants', 'tags'];
    Object.entries(form).forEach(([k, v]) => { if (!skip.includes(k) && v !== undefined && v !== null && v !== '') fd.append(k, v); });
    fd.append('tags', JSON.stringify(form.tags.split(',').map((t) => t.trim()).filter(Boolean)));
    fd.append('variants', JSON.stringify(form.variants.filter((v) => v.value && v.price).map((v) => ({ ...v, name: v.name || 'Pack', price: Number(v.price), mrp: v.mrp ? Number(v.mrp) : undefined, stock: Number(v.stock || 0) }))));
    if (form._id) fd.append('existingImages', JSON.stringify(existing));
    files.forEach((f) => fd.append('images', f));
    try {
      if (form._id) await api.put(`/api/products/${form._id}`, fd); else await api.post('/api/products', fd);
      toast.success('Product saved'); setForm(null); load();
    } catch (err) { toast.error(errMsg(err)); } finally { setSaving(false); }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    await api.delete(`/api/products/${p._id}`); toast.success('Deleted'); load();
  };

  const shown = products.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="admin-header">
        <h1>Products</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="form-control" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 200 }} />
          <button className="btn btn-pink btn-sm" onClick={() => open(null)}><FiPlus /> New product</button>
        </div>
      </div>
      <div className="admin-section table-wrap">
        <table className="table">
          <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Flags</th><th></th></tr></thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p._id} style={{ opacity: p.isActive ? 1 : 0.5 }}>
                <td style={{ width: 60 }}><div className="admin-thumb"><ProductVisual product={p} /></div></td>
                <td><strong>{p.name}</strong><div className="muted" style={{ fontSize: '0.78rem' }}>{p.sku} · {p.flavor}</div></td>
                <td>{p.category}</td>
                <td>{p.variants?.length ? p.variants.map((v) => `${v.value} ${rupee(v.price)}`).join(' · ') : rupee(p.price)}</td>
                <td>{p.variants?.length ? p.variants.map((v) => v.stock).join(' / ') : p.stock}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{p.bestseller && <span className="badge badge-pink">Best</span>} {p.featured && <span className="badge badge-yellow">Feat</span>} {!p.isActive && <span className="badge badge-soft">Hidden</span>}</td>
                <td style={{ whiteSpace: 'nowrap' }}><button className="icon-btn" onClick={() => open(p)} aria-label="Edit"><FiEdit2 /></button> <button className="icon-btn" onClick={() => remove(p)} aria-label="Delete"><FiTrash2 /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="modal-backdrop" onClick={() => setForm(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h2>{form._id ? 'Edit product' : 'New product'}</h2>
            <div className="product-form-grid">
              <div>
                <div className="input-row input-row-2">
                  <div className="form-group"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={set('name')} required /></div>
                  <div className="form-group"><label className="form-label">SKU</label><input className="form-control" value={form.sku} onChange={set('sku')} required /></div>
                </div>
                <div className="input-row input-row-2">
                  <div className="form-group"><label className="form-label">Category</label>
                    <select className="form-control" value={form.category} onChange={set('category')}>{categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}</select>
                  </div>
                  <div className="form-group"><label className="form-label">Flavour</label><input className="form-control" value={form.flavor} onChange={set('flavor')} /></div>
                </div>
                <div className="form-group"><label className="form-label">Tagline</label><input className="form-control" value={form.tagline} onChange={set('tagline')} /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" value={form.description} onChange={set('description')} required /></div>
                <div className="form-group"><label className="form-label">Ingredients</label><input className="form-control" value={form.ingredients} onChange={set('ingredients')} /></div>
                <div className="input-row input-row-3">
                  <div className="form-group"><label className="form-label">Base price</label><input type="number" className="form-control" value={form.price} onChange={set('price')} required /></div>
                  <div className="form-group"><label className="form-label">MRP</label><input type="number" className="form-control" value={form.mrp || ''} onChange={set('mrp')} /></div>
                  <div className="form-group"><label className="form-label">Stock (no variants)</label><input type="number" className="form-control" value={form.stock} onChange={set('stock')} /></div>
                </div>
              </div>
              <div className="pf-preview">
                <ProductVisual product={{ ...form, images: [] }} />
                <div className="form-group"><label className="form-label">Pack colour</label>
                  <div className="swatches">{PACK_COLORS.map((c) => <button type="button" key={c} className={`swatch sw-${c} ${form.packColor === c ? 'active' : ''}`} onClick={() => setForm({ ...form, packColor: c })} aria-label={c} />)}</div>
                </div>
                <div className="form-group"><label className="form-label">Chip colour</label><input type="color" value={form.chipColor} onChange={set('chipColor')} /></div>
                <div className="form-group"><label className="form-label">Spice (0–3)</label><input type="range" min="0" max="3" value={form.spiceLevel} onChange={set('spiceLevel')} /></div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pack sizes (variants)</label>
              {form.variants.map((v, i) => (
                <div key={i} className="variant-row">
                  <input className="form-control" placeholder="150g" value={v.value} onChange={(e) => setVar(i, 'value', e.target.value)} />
                  <input className="form-control" type="number" placeholder="Price" value={v.price} onChange={(e) => setVar(i, 'price', e.target.value)} />
                  <input className="form-control" type="number" placeholder="MRP" value={v.mrp || ''} onChange={(e) => setVar(i, 'mrp', e.target.value)} />
                  <input className="form-control" type="number" placeholder="Stock" value={v.stock} onChange={(e) => setVar(i, 'stock', e.target.value)} />
                  <button type="button" className="icon-btn" onClick={() => setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) })} aria-label="Remove"><FiX /></button>
                </div>
              ))}
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm({ ...form, variants: [...form.variants, { name: 'Pack', value: '', price: '', mrp: '', stock: 50 }] })}><FiPlus /> Add pack size</button>
            </div>

            <div className="form-group">
              <label className="form-label">Photos (optional — the illustrated pack is used otherwise)</label>
              <div className="img-row">
                {existing.map((img) => (
                  <div key={img} className="img-chip"><img src={mediaUrl(img)} alt="" /><button type="button" onClick={() => setExisting(existing.filter((x) => x !== img))}><FiX /></button></div>
                ))}
              </div>
              <input type="file" accept="image/*" multiple className="form-control" onChange={(e) => setFiles([...e.target.files])} />
            </div>
            <div className="form-group"><label className="form-label">Tags (comma separated)</label><input className="form-control" value={form.tags} onChange={set('tags')} /></div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 18 }}>
              <label className="check"><input type="checkbox" checked={form.bestseller} onChange={set('bestseller')} /> Bestseller</label>
              <label className="check"><input type="checkbox" checked={form.featured} onChange={set('featured')} /> Featured</label>
              <label className="check"><input type="checkbox" checked={form.isActive} onChange={set('isActive')} /> Visible in store</label>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(null)}>Cancel</button>
              <button className="btn btn-pink btn-sm" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
