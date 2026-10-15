import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api, { rupee, errMsg } from '../../utils/api';
import OrderCard from '../../components/OrderCard';

const STATUSES = ['placed', 'confirmed', 'frying', 'packed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [data, setData] = useState({ orders: [], pages: 1 });
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);

  const load = () => api.get('/api/orders', { params: { status: status || undefined, search: search || undefined, page } }).then(({ data: d }) => setData(d));
  useEffect(() => { load(); }, [status, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = async (o, body) => {
    try { await api.put(`/api/orders/${o._id}/status`, body); toast.success('Updated'); load(); if (open?._id === o._id) setOpen({ ...open, ...body }); } catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Orders</h1>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }} style={{ display: 'flex', gap: 8 }}>
          <input className="form-control" placeholder="Order ID / name / phone" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-sm">Search</button>
        </form>
      </div>
      <div className="shop-cats" style={{ marginBottom: 16 }}>
        {['', ...STATUSES].map((s) => <button key={s} className={`pill ${status === s ? 'active' : ''}`} onClick={() => { setStatus(s); setPage(1); }}>{s || 'All'}</button>)}
      </div>
      <div className="admin-section table-wrap">
        <table className="table">
          <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {data.orders.map((o) => (
              <tr key={o._id}>
                <td><button className="link-btn" onClick={() => setOpen(o)}>#{o.orderId}</button></td>
                <td>{o.customerInfo.name}<div className="muted" style={{ fontSize: '0.78rem' }}>{o.customerInfo.phone} · {o.customerInfo.city}</div></td>
                <td><strong>{rupee(o.total)}</strong></td>
                <td>
                  <select className="form-control mini-select" value={o.paymentStatus} onChange={(e) => update(o, { paymentStatus: e.target.value })}>
                    {['pending', 'paid', 'failed', 'refunded'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <div className="muted" style={{ fontSize: '0.72rem' }}>{o.paymentMethod.toUpperCase()}</div>
                </td>
                <td>
                  <select className="form-control mini-select" value={o.orderStatus} onChange={(e) => update(o, { orderStatus: e.target.value })}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="muted" style={{ fontSize: '0.82rem' }}>{new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.orders.length === 0 && <p className="muted" style={{ padding: 20 }}>No orders found.</p>}
      </div>
      {data.pages > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {Array.from({ length: data.pages }).map((_, i) => <button key={i} className={`pill ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>)}
        </div>
      )}
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <OrderCard order={open} />
            <div className="card-soft">
              <strong>Ship to</strong>
              <p style={{ margin: '6px 0 0' }}>{open.customerInfo.name}, {open.customerInfo.address}, {open.customerInfo.city}, {open.customerInfo.state} – {open.customerInfo.pincode}<br />{open.customerInfo.phone} · {open.customerInfo.email}</p>
              {open.customerInfo.notes && <p className="muted" style={{ marginTop: 8 }}>📝 {open.customerInfo.notes}</p>}
              {open.razorpayPaymentId && <p className="muted" style={{ fontSize: '0.8rem' }}>Payment: {open.razorpayPaymentId}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
