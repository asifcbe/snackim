import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api, { errMsg } from '../../utils/api';

const blank = () => ({ code: '', description: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxDiscount: '', usageLimit: '', expiryDate: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10), isActive: true, showOnCheckout: true });

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(null);
  const load = () => api.get('/api/coupons').then(({ data }) => setCoupons(data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const body = { ...form };
    ['maxDiscount', 'usageLimit'].forEach((k) => { if (body[k] === '' || body[k] === null) delete body[k]; });
    try {
      if (form._id) await api.put(`/api/coupons/${form._id}`, body); else await api.post('/api/coupons', body);
      toast.success('Coupon saved'); setForm(null); load();
    } catch (err) { toast.error(errMsg(err)); }
  };
  const remove = async (c) => { if (window.confirm(`Delete ${c.code}?`)) { await api.delete(`/api/coupons/${c._id}`); load(); } };

  return (
    <div>
      <div className="admin-header"><h1>Coupons</h1><button className="btn btn-pink btn-sm" onClick={() => setForm(blank())}><FiPlus /> New coupon</button></div>
      <div className="admin-section table-wrap">
        <table className="table">
          <thead><tr><th>Code</th><th>Discount</th><th>Min order</th><th>Used</th><th>Expires</th><th>Status</th><th></th></tr></thead>
          <tbody>{coupons.map((c) => (
            <tr key={c._id}>
              <td><strong>{c.code}</strong><div className="muted" style={{ fontSize: '0.78rem' }}>{c.description}</div></td>
              <td>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}{c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ''}</td>
              <td>₹{c.minOrderAmount}</td>
              <td>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
              <td>{new Date(c.expiryDate).toLocaleDateString('en-IN')}</td>
              <td>{c.isActive && new Date(c.expiryDate) > new Date() ? <span className="badge badge-success">Live</span> : <span className="badge badge-soft">Off</span>}{c.showOnCheckout && <span className="badge badge-yellow" style={{ marginLeft: 4 }}>Shown</span>}</td>
              <td style={{ whiteSpace: 'nowrap' }}><button className="icon-btn" onClick={() => setForm({ ...c, expiryDate: c.expiryDate.slice(0, 10), maxDiscount: c.maxDiscount ?? '', usageLimit: c.usageLimit ?? '' })} aria-label="Edit"><FiEdit2 /></button> <button className="icon-btn" onClick={() => remove(c)} aria-label="Delete"><FiTrash2 /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {form && (
        <div className="modal-backdrop" onClick={() => setForm(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ width: 'min(600px, 100%)' }}>
            <h2>{form._id ? 'Edit coupon' : 'New coupon'}</h2>
            <div className="input-row input-row-2">
              <div className="form-group"><label className="form-label">Code</label><input className="form-control" value={form.code} onChange={set('code')} required style={{ textTransform: 'uppercase' }} /></div>
              <div className="form-group"><label className="form-label">Expiry</label><input type="date" className="form-control" value={form.expiryDate} onChange={set('expiryDate')} required /></div>
            </div>
            <div className="form-group"><label className="form-label">Description</label><input className="form-control" value={form.description || ''} onChange={set('description')} /></div>
            <div className="input-row input-row-3">
              <div className="form-group"><label className="form-label">Type</label><select className="form-control" value={form.discountType} onChange={set('discountType')}><option value="percentage">Percentage</option><option value="fixed">Fixed ₹</option></select></div>
              <div className="form-group"><label className="form-label">Value</label><input type="number" className="form-control" value={form.discountValue} onChange={set('discountValue')} required /></div>
              <div className="form-group"><label className="form-label">Max discount</label><input type="number" className="form-control" value={form.maxDiscount} onChange={set('maxDiscount')} /></div>
            </div>
            <div className="input-row input-row-2">
              <div className="form-group"><label className="form-label">Min order ₹</label><input type="number" className="form-control" value={form.minOrderAmount} onChange={set('minOrderAmount')} /></div>
              <div className="form-group"><label className="form-label">Usage limit</label><input type="number" className="form-control" value={form.usageLimit} onChange={set('usageLimit')} /></div>
            </div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
              <label className="check"><input type="checkbox" checked={form.isActive} onChange={set('isActive')} /> Active</label>
              <label className="check"><input type="checkbox" checked={form.showOnCheckout} onChange={set('showOnCheckout')} /> Suggest at checkout</label>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(null)}>Cancel</button><button className="btn btn-pink btn-sm">Save</button></div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
