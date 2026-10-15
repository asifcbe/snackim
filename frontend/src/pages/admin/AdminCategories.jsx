import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api, { errMsg } from '../../utils/api';

const COLORS = ['yellow', 'sky', 'pink', 'plum', 'teal'];

const AdminCategories = () => {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(null);
  const load = () => api.get('/api/categories/admin/all').then(({ data }) => setCats(data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) await api.put(`/api/categories/${form._id}`, form); else await api.post('/api/categories', form);
      toast.success('Saved'); setForm(null); load();
    } catch (err) { toast.error(errMsg(err)); }
  };
  const remove = async (c) => {
    if (!window.confirm(`Delete ${c.name}?`)) return;
    try { await api.delete(`/api/categories/${c._id}`); load(); } catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <div>
      <div className="admin-header"><h1>Categories</h1><button className="btn btn-pink btn-sm" onClick={() => setForm({ name: '', tagline: '', color: 'yellow', order: cats.length + 1, isActive: true })}><FiPlus /> New</button></div>
      <div className="admin-section table-wrap">
        <table className="table">
          <thead><tr><th>Order</th><th>Name</th><th>Slug</th><th>Tagline</th><th>Colour</th><th></th></tr></thead>
          <tbody>{cats.map((c) => (
            <tr key={c._id} style={{ opacity: c.isActive ? 1 : 0.5 }}>
              <td>{c.order}</td><td><strong>{c.name}</strong></td><td className="muted">{c.slug}</td><td>{c.tagline}</td>
              <td><span className={`swatch sw-${c.color}`} style={{ display: 'inline-block' }} /></td>
              <td style={{ whiteSpace: 'nowrap' }}><button className="icon-btn" onClick={() => setForm({ ...c })} aria-label="Edit"><FiEdit2 /></button> <button className="icon-btn" onClick={() => remove(c)} aria-label="Delete"><FiTrash2 /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {form && (
        <div className="modal-backdrop" onClick={() => setForm(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ width: 'min(520px, 100%)' }}>
            <h2>{form._id ? 'Edit category' : 'New category'}</h2>
            <div className="form-group"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label className="form-label">Tagline</label><input className="form-control" value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Colour</label><div className="swatches">{COLORS.map((c) => <button type="button" key={c} className={`swatch sw-${c} ${form.color === c ? 'active' : ''}`} onClick={() => setForm({ ...form, color: c })} aria-label={c} />)}</div></div>
            <div className="input-row input-row-2">
              <div className="form-group"><label className="form-label">Order</label><input type="number" className="form-control" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} /></div>
              <label className="check" style={{ marginTop: 28 }}><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Visible</label>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(null)}>Cancel</button><button className="btn btn-pink btn-sm">Save</button></div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
