import React from 'react';
import OrderProgress from './OrderProgress';
import { rupee } from '../utils/api';

const OrderCard = ({ order }) => (
  <div className="order-card">
    <div className="order-card-head">
      <div>
        <span className="muted">Order</span>
        <h3>#{order.orderId}</h3>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-soft'}`}>{order.paymentMethod === 'cod' ? 'COD' : 'Online'} · {order.paymentStatus}</span>
        <div className="muted" style={{ fontSize: '0.85rem', marginTop: 4 }}>{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
      </div>
    </div>
    <OrderProgress status={order.orderStatus} />
    <div className="order-items">
      {order.items.map((i, idx) => (
        <div key={idx}><span>{i.name}{i.variantLabel ? ` · ${i.variantLabel.replace('Pack: ', '')}` : ''} × {i.quantity}</span><span>{rupee(i.price * i.quantity)}</span></div>
      ))}
      {order.discount > 0 && <div className="text-teal"><span>Discount {order.couponCode && `(${order.couponCode})`}</span><span>−{rupee(order.discount)}</span></div>}
      <div><span>Shipping</span><span>{order.shippingCharge ? rupee(order.shippingCharge) : 'Free'}</span></div>
      {order.codCharge > 0 && <div><span>COD fee</span><span>{rupee(order.codCharge)}</span></div>}
      <div className="order-total"><span>Total</span><span>{rupee(order.total)}</span></div>
    </div>
  </div>
);

export default OrderCard;
