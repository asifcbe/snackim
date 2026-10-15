import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api, { errMsg } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';
import StateRatesEditor from './StateRatesEditor';

const AdminSettings = () => {
  const { reloadSettings } = useSettings();
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/api/settings').then(({ data }) => setS({ ...data, socialLinks: data.socialLinks || {} })); }, []);
  if (!s) return <div className="spinner" />;

  const set = (k) => (e) => setS({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const setSocial = (k) => (e) => setS({ ...s, socialLinks: { ...s.socialLinks, [k]: e.target.value } });
  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/api/settings', {
        ...s,
        freeShippingAbove: Number(s.freeShippingAbove), shippingCharge: Number(s.shippingCharge), codCharge: Number(s.codCharge)
      });
      setS({ ...data, socialLinks: data.socialLinks || {} }); reloadSettings(); toast.success('Settings saved');
    } catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <form onSubmit={save}>
      <div className="admin-header"><h1>Settings</h1><button className="btn btn-pink btn-sm">Save settings</button></div>
      <div className="admin-section">
        <div className="admin-section-title">Store</div>
        <div className="input-row input-row-2">
          <div className="form-group"><label className="form-label">Store name</label><input className="form-control" value={s.storeName} onChange={set('storeName')} /></div>
          <div className="form-group"><label className="form-label">Tagline</label><input className="form-control" value={s.storeTagline} onChange={set('storeTagline')} /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-control" value={s.storeEmail} onChange={set('storeEmail')} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={s.storePhone} onChange={set('storePhone')} /></div>
        </div>
        <div className="form-group"><label className="form-label">Address</label><input className="form-control" value={s.storeAddress || ''} onChange={set('storeAddress')} /></div>
        <div className="form-group"><label className="form-label">Announcement bar</label><input className="form-control" value={s.announcement || ''} onChange={set('announcement')} /></div>
      </div>
      <div className="admin-section">
        <div className="admin-section-title">Shipping &amp; payments</div>
        <div className="input-row input-row-2">
          <div className="form-group"><label className="form-label">Free shipping above ₹ (0 = never free)</label><input type="number" min="0" className="form-control" value={s.freeShippingAbove} onChange={set('freeShippingAbove')} /></div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label className="check"><input type="checkbox" checked={s.codEnabled} onChange={set('codEnabled')} /> Cash on delivery enabled (master switch)</label>
          </div>
        </div>
        <p className="muted" style={{ fontSize: '0.86rem', margin: '0 0 6px' }}>Free shipping waives the state&rsquo;s shipping charge only. The COD fee still applies.</p>
        <p className="muted" style={{ marginTop: 14, fontSize: '0.88rem' }}>Razorpay runs in <strong>dummy mode</strong> while <code>RAZORPAY_MOCK=true</code> in <code>backend/.env</code>. Add real keys there and set it to <code>false</code> to accept real payments.</p>
      </div>
      <div className="admin-section">
        <div className="admin-section-title">Shipping &amp; COD by state <button className="btn btn-sm" type="submit">Save rates</button></div>
        <p className="muted" style={{ fontSize: '0.86rem', marginTop: -6 }}>Customers pick their state at checkout and are charged that state&rsquo;s rates. Untick <em>Deliver</em> to stop orders to a state, or untick <em>COD</em> to offer online payment only there.</p>
        <StateRatesEditor rates={s.stateRates || []} onChange={(stateRates) => setS({ ...s, stateRates })} />
      </div>
      <div className="admin-section">
        <div className="admin-section-title">Social</div>
        <div className="input-row input-row-2">
          {['instagram', 'youtube', 'facebook', 'whatsapp'].map((k) => (
            <div className="form-group" key={k}><label className="form-label" style={{ textTransform: 'capitalize' }}>{k}</label><input className="form-control" value={s.socialLinks[k] || ''} onChange={setSocial(k)} placeholder="https://" /></div>
          ))}
        </div>
      </div>
    </form>
  );
};

export default AdminSettings;
