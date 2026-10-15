import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { rupee } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/api/orders/stats').then(({ data }) => setStats(data)).catch(() => {});
    api.get('/api/orders', { params: { limit: 6 } }).then(({ data }) => setRecent(data.orders)).catch(() => {});
    api.get('/api/products/admin/all').then(({ data }) => setProducts(data)).catch(() => {});
  }, []);

  const lowStock = products.filter((p) => (p.variants?.length ? p.variants.some((v) => v.stock < 20) : p.stock < 20));
  const tiles = [
    { label: 'Orders today', value: stats?.today ?? '–', color: 'yellow' },
    { label: 'Total orders', value: stats?.total ?? '–', color: 'sky' },
    { label: 'Revenue (paid)', value: stats ? rupee(stats.revenue) : '–', color: 'pink' },
    { label: 'Active products', value: products.filter((p) => p.isActive).length, color: 'teal' }
  ];

  return (
    <div>
      <div className="admin-header"><h1>Good morning, chef 👋</h1><Link to="/admin/landing" className="btn btn-yellow btn-sm">Upload a video</Link></div>
      <div className="stat-grid">
        {tiles.map((t) => <div key={t.label} className={`stat stat-${t.color}`}><span>{t.label}</span><strong>{t.value}</strong></div>)}
      </div>
      <div className="grid grid-2" style={{ marginTop: 22, alignItems: 'start' }}>
        <div className="admin-section">
          <div className="admin-section-title">Recent orders <Link to="/admin/orders" className="btn btn-ghost btn-sm">All</Link></div>
          {recent.length === 0 ? <p className="muted">No orders yet.</p> : (
            <div className="table-wrap"><table className="table"><tbody>
              {recent.map((o) => (
                <tr key={o._id}><td><strong>#{o.orderId}</strong><div className="muted" style={{ fontSize: '0.8rem' }}>{o.customerInfo.name}</div></td><td><span className="badge badge-soft">{o.orderStatus}</span></td><td style={{ textAlign: 'right' }}>{rupee(o.total)}</td></tr>
              ))}
            </tbody></table></div>
          )}
        </div>
        <div className="admin-section">
          <div className="admin-section-title">Running low</div>
          {lowStock.length === 0 ? <p className="muted">All stocked up. 🍌</p> : lowStock.map((p) => (
            <div key={p._id} className="low-row"><span>{p.name}</span><span className="badge badge-danger">{p.variants?.length ? p.variants.map((v) => `${v.value}: ${v.stock}`).join(' · ') : p.stock}</span></div>
          ))}
        </div>
      </div>
      {stats?.byStatus && (
        <div className="admin-section">
          <div className="admin-section-title">Orders by status</div>
          <div className="status-row">
            {['placed', 'confirmed', 'frying', 'packed', 'shipped', 'delivered', 'cancelled'].map((s) => (
              <div key={s}><strong>{stats.byStatus[s] || 0}</strong><span>{s}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
