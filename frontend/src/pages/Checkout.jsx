import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import api, { rupee, errMsg } from '../utils/api';
import { quoteShipping, UNION_TERRITORIES } from '../utils/shipping';
import MockRazorpay from '../components/MockRazorpay';
import ProductVisual from '../components/ProductVisual';
import { shipLine } from '../utils/fresh';

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const s = document.createElement('script');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload = () => resolve(true);
  s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    address: '', city: '', state: '', pincode: '', notes: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [checkoutCoupons, setCheckoutCoupons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [submitting, setSubmitting] = useState(false);
  const [mockOrder, setMockOrder] = useState(null);

  useEffect(() => { if (items.length === 0 && !mockOrder) navigate('/shop'); }, [items, navigate, mockOrder]);
  useEffect(() => { api.get('/api/coupons/checkout').then(({ data }) => setCheckoutCoupons(data)).catch(() => {}); }, []);

  const discount = appliedCoupon?.discount || 0;
  const afterDiscount = Math.max(subtotal - discount, 0);
  const ship = quoteShipping(settings, form.state, afterDiscount, paymentMethod);
  const baseShipping = ship.shippingCharge;
  const codFee = ship.codCharge;
  const total = afterDiscount + baseShipping + codFee;
  const deliverableStates = (settings.stateRates || []).filter((r) => r.deliverable);

  // If the chosen state doesn't offer COD, fall back to online payment.
  useEffect(() => {
    if (paymentMethod === 'cod' && ship.ready && !ship.codAllowed) setPaymentMethod('razorpay');
  }, [form.state, ship.ready, ship.codAllowed]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const applyCoupon = async (code) => {
    if (!code) return;
    try {
      const { data } = await api.post('/api/coupons/validate', { code, subtotal });
      setAppliedCoupon(data);
      setCouponCode(data.code);
      toast.success(`${data.code} applied — you saved ${rupee(data.discount)} 🎉`);
    } catch (err) {
      toast.error(errMsg(err, 'Invalid coupon'));
    }
  };

  const itemsPayload = () => items.map((i) => ({ productId: i.productId, variantId: i.variantId || undefined, quantity: i.quantity }));

  const validateForm = () => {
    for (const f of ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode']) {
      if (!form[f]) { toast.error(`Please fill in ${f}`); return false; }
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, '').slice(-10))) { toast.error('Enter a valid 10-digit phone'); return false; }
    if (!ship.ready || !ship.deliverable) { toast.error('Please select your state'); return false; }
    if (!/^\d{6}$/.test(form.pincode)) { toast.error('Enter a valid 6-digit pincode'); return false; }
    return true;
  };

  const finish = (orderId) => { clearCart(); navigate(`/order-confirmation/${orderId}`); };

  const verify = async (response) => {
    try {
      const { data } = await api.post('/api/payment/verify', { ...response, customerInfo: form, items: itemsPayload(), couponCode: appliedCoupon?.code });
      finish(data.orderId);
    } catch (err) {
      toast.error(errMsg(err, 'Payment verification failed'));
    }
  };

  const handleRazorpay = async () => {
    const { data } = await api.post('/api/payment/create-order', { customerInfo: form, items: itemsPayload(), couponCode: appliedCoupon?.code });
    if (data.mock) { setMockOrder(data); return; }
    if (!(await loadRazorpayScript())) throw new Error('Could not load Razorpay');
    const rzp = new window.Razorpay({
      key: data.keyId, amount: data.amount, currency: data.currency, order_id: data.razorpayOrderId,
      name: settings.storeName || 'Snackim', description: 'Snackim order',
      handler: verify,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      theme: { color: '#D81159' }
    });
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (paymentMethod === 'cod') {
        const { data } = await api.post('/api/orders', { customerInfo: form, items: itemsPayload(), couponCode: appliedCoupon?.code, paymentMethod: 'cod' });
        finish(data.orderId);
      } else {
        await handleRazorpay();
      }
    } catch (err) {
      toast.error(errMsg(err, err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container checkout">
      <h1>Checkout</h1>
      <p className="muted" style={{ marginTop: -10 }}>🔥 {shipLine()}. Your packs come from the batch fried that morning.</p>
      <div className="checkout-grid">
        <form onSubmit={handleSubmit} id="checkout-form">
          <div className="card-soft">
            <h3>Where should we send the crunch?</h3>
            <div className="input-row input-row-2">
              <div className="form-group"><label className="form-label">Full name</label><input className="form-control" name="name" value={form.name} onChange={handleChange} autoComplete="name" /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-control" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" inputMode="tel" /></div>
            </div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" /></div>
            <div className="form-group"><label className="form-label">Address</label><input className="form-control" name="address" value={form.address} onChange={handleChange} autoComplete="street-address" /></div>
            <div className="input-row input-row-3">
              <div className="form-group"><label className="form-label">City</label><input className="form-control" name="city" value={form.city} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">State</label>
                <select className="form-control" name="state" value={form.state} onChange={handleChange}>
                  <option value="">Select state…</option>
                  <optgroup label="States">
                    {deliverableStates.filter((r) => !UNION_TERRITORIES.includes(r.state)).map((r) => <option key={r.state} value={r.state}>{r.state}</option>)}
                  </optgroup>
                  <optgroup label="Union Territories">
                    {deliverableStates.filter((r) => UNION_TERRITORIES.includes(r.state)).map((r) => <option key={r.state} value={r.state}>{r.state}</option>)}
                  </optgroup>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Pincode</label><input className="form-control" name="pincode" value={form.pincode} onChange={handleChange} inputMode="numeric" maxLength={6} /></div>
            </div>
            <div className="form-group"><label className="form-label">Notes (optional)</label><textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} placeholder="Gift message, delivery instructions…" /></div>
          </div>

          <div className="card-soft" style={{ marginTop: 20 }}>
            <h3>Payment</h3>
            <div className="pay-options">
              <label className={`pay-option ${paymentMethod === 'razorpay' ? 'active' : ''}`}>
                <input type="radio" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                <div><strong>Pay online</strong><span>UPI, cards, netbanking via Razorpay</span></div>
              </label>
              {settings.codEnabled !== false && (
                <label className={`pay-option ${paymentMethod === 'cod' ? 'active' : ''} ${ship.ready && !ship.codAllowed ? 'disabled' : ''}`}>
                  <input type="radio" checked={paymentMethod === 'cod'} disabled={ship.ready && !ship.codAllowed} onChange={() => setPaymentMethod('cod')} />
                  <div><strong>Cash on delivery</strong><span>{!ship.ready ? 'Select your state to see the COD fee' : ship.codAllowed ? `+${rupee(ship.codFee)} handling fee in ${form.state}` : `Not available in ${form.state}`}</span></div>
                </label>
              )}
            </div>
          </div>
        </form>

        <motion.aside className="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3>Your order</h3>
          <div className="summary-items">
            {items.map((i) => (
              <div key={i.key} className="summary-item">
                <div className="drawer-thumb"><ProductVisual product={{ ...i, images: i.image ? [i.image] : [] }} /><span className="summary-qty">{i.quantity}</span></div>
                <div><strong>{i.name}</strong><span className="muted">{i.variantLabel || i.flavor}</span></div>
                <strong>{rupee(i.price * i.quantity)}</strong>
              </div>
            ))}
          </div>

          {appliedCoupon ? (
            <div className="coupon-applied">
              <span>🎟️ <strong>{appliedCoupon.code}</strong> applied</span>
              <button type="button" onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}>Remove</button>
            </div>
          ) : (
            <>
              <div className="coupon-row">
                <input className="form-control" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
                <button type="button" className="btn btn-sm" onClick={() => applyCoupon(couponCode)}>Apply</button>
              </div>
              {checkoutCoupons.length > 0 && (
                <div className="coupon-chips">
                  {checkoutCoupons.map((c) => (
                    <button type="button" key={c.code} onClick={() => applyCoupon(c.code)} title={c.description} className={subtotal < c.minOrderAmount ? 'locked' : ''}>
                      <strong>{c.code}</strong><span>{subtotal < c.minOrderAmount ? `Add ${rupee(c.minOrderAmount - subtotal)} more to unlock` : c.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="summary-lines">
            <div><span>Subtotal</span><span>{rupee(subtotal)}</span></div>
            {discount > 0 && <div className="text-teal"><span>Discount</span><span>−{rupee(discount)}</span></div>}
            <div><span>Shipping{form.state ? ` · ${form.state}` : ''}</span><span>{!ship.ready ? 'Select state' : baseShipping ? rupee(baseShipping) : 'Free'}</span></div>
            {codFee > 0 && <div><span>COD fee</span><span>{rupee(codFee)}</span></div>}
            <div className="summary-total"><span>Total</span><span>{rupee(total)}</span></div>
          </div>
          <button type="submit" form="checkout-form" className="btn btn-pink btn-lg btn-block" disabled={submitting}>
            {submitting ? 'Hold tight…' : paymentMethod === 'cod' ? `Place order · ${rupee(total)}` : `Pay ${rupee(total)}`}
          </button>
        </motion.aside>
      </div>

      {mockOrder && (
        <MockRazorpay
          order={mockOrder}
          storeName={settings.storeName || 'Snackim'}
          prefill={{ email: form.email, contact: form.phone }}
          onSuccess={async (resp) => { await verify(resp); setMockOrder(null); }}
          onFailure={(msg) => toast.error(msg)}
          onDismiss={() => { setMockOrder(null); toast.info('Payment cancelled'); }}
        />
      )}
    </div>
  );
};

export default Checkout;
