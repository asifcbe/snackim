import { rupee } from './api';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const slipHtml = (o, store = {}) => {
  const c = o.customerInfo || {};
  const date = new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  const rows = o.items.map((i, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${esc(i.name)}${i.variantLabel ? `<div class="sub">${esc(i.variantLabel.replace('Pack: ', ''))}</div>` : ''}${i.sku ? `<div class="sub">SKU: ${esc(i.sku)}</div>` : ''}</td>
      <td class="r">${i.quantity}</td>
      <td class="r">${rupee(i.price)}</td>
      <td class="r">${rupee(i.price * i.quantity)}</td>
    </tr>`).join('');

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Order #${esc(o.orderId)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #111; margin: 0; padding: 24px; font-size: 13px; }
  .slip { max-width: 720px; margin: 0 auto; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 12px; }
  .head h1 { margin: 0; font-size: 22px; }
  .muted, .sub { color: #555; }
  .sub { font-size: 11px; }
  .r { text-align: right; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
  .box { border: 1px solid #ccc; border-radius: 6px; padding: 10px 12px; }
  .box h3 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #555; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 8px 6px; border-bottom: 1px solid #ddd; vertical-align: top; text-align: left; }
  th { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #555; border-bottom: 2px solid #111; }
  .totals { margin-left: auto; width: 260px; margin-top: 10px; }
  .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
  .totals .grand { border-top: 2px solid #111; margin-top: 4px; padding-top: 8px; font-size: 16px; font-weight: 700; }
  .notes { margin-top: 16px; }
  .foot { margin-top: 28px; text-align: center; color: #555; font-size: 12px; }
  @page { margin: 12mm; }
  @media print { body { padding: 0; } }
</style></head>
<body><div class="slip">
  <div class="head">
    <div>
      <h1>${esc(store.storeName || 'Snackim')}</h1>
      ${store.storeAddress ? `<div class="muted">${esc(store.storeAddress)}</div>` : ''}
      <div class="muted">${[store.storePhone, store.storeEmail].filter(Boolean).map(esc).join(' · ')}</div>
    </div>
    <div class="r">
      <div style="font-size:18px;font-weight:700">Order #${esc(o.orderId)}</div>
      <div class="muted">${esc(date)}</div>
      <div class="muted">Status: ${esc(o.orderStatus)}</div>
    </div>
  </div>
  <div class="grid">
    <div class="box">
      <h3>Ship to</h3>
      <strong>${esc(c.name)}</strong><br>
      ${esc(c.address)}<br>
      ${esc(c.city)}, ${esc(c.state)} – ${esc(c.pincode)}<br>
      📞 ${esc(c.phone)}${c.email ? `<br>${esc(c.email)}` : ''}
    </div>
    <div class="box">
      <h3>Payment</h3>
      Method: <strong>${o.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}</strong><br>
      Status: <strong>${esc(o.paymentStatus)}</strong>
      ${o.razorpayPaymentId ? `<br><span class="sub">Txn: ${esc(o.razorpayPaymentId)}</span>` : ''}
      ${o.paymentMethod === 'cod' && o.paymentStatus !== 'paid' ? `<div style="margin-top:8px;font-size:15px;font-weight:700">Collect: ${rupee(o.total)}</div>` : ''}
    </div>
  </div>
  <table>
    <thead><tr><th>#</th><th>Item</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <div><span>Subtotal</span><span>${rupee(o.subtotal)}</span></div>
    ${o.discount > 0 ? `<div><span>Discount${o.couponCode ? ` (${esc(o.couponCode)})` : ''}</span><span>−${rupee(o.discount)}</span></div>` : ''}
    <div><span>Shipping</span><span>${o.shippingCharge ? rupee(o.shippingCharge) : 'Free'}</span></div>
    ${o.codCharge > 0 ? `<div><span>COD fee</span><span>${rupee(o.codCharge)}</span></div>` : ''}
    <div class="grand"><span>Total</span><span>${rupee(o.total)}</span></div>
  </div>
  ${c.notes ? `<div class="box notes"><h3>Customer notes</h3>${esc(c.notes)}</div>` : ''}
  <div class="foot">Thank you for ordering from ${esc(store.storeName || 'Snackim')}!</div>
</div></body></html>`;
};

export const printOrderSlip = (order, store) => {
  const w = window.open('', '_blank', 'width=820,height=900');
  if (!w) return false;
  w.document.open();
  w.document.write(slipHtml(order, store));
  w.document.close();
  w.focus();
  // Give the new document a tick to lay out before opening the print dialog.
  setTimeout(() => { w.print(); }, 250);
  return true;
};
