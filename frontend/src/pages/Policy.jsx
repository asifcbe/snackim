import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

// Placeholder policy copy — review with the business before going live.
const POLICIES = {
  shipping: {
    title: 'Shipping & Delivery',
    body: [
      'Orders are packed in our kitchen in Coimbatore and dispatched within 24 hours on working days.',
      'Delivery usually takes 2–5 working days depending on your pincode. Metro cities are typically faster.',
      'Shipping is free on orders above ₹499. Below that, a flat shipping charge is shown at checkout.',
      'You will receive tracking updates by email and SMS once your order ships.'
    ]
  },
  refunds: {
    title: 'Refunds & Cancellations',
    body: [
      'Because our snacks are food products, we cannot accept returns of opened packs.',
      'If a pack arrives damaged, crushed or with a manufacturing issue, email us a photo within 48 hours of delivery and we will replace it or refund you in full.',
      'Orders can be cancelled before they are packed. Contact us with your order ID as soon as possible.',
      'Refunds for prepaid orders are processed to the original payment method within 5–7 working days.'
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We collect only the information needed to process and deliver your order: name, contact details and address.',
      'Payments are processed by Razorpay. We never see or store your card details.',
      'We do not sell your data. We may email you order updates, and newsletters only if you opt in.'
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    body: [
      'Prices are in INR and include applicable taxes unless stated otherwise.',
      'Product images are illustrative. Each batch is handmade, so colour and size can vary slightly.',
      'Coupons cannot be combined unless stated and may be withdrawn at any time.'
    ]
  }
};

const Policy = () => {
  const { slug } = useParams();
  const s = useSettings();
  const p = POLICIES[slug];
  if (!p) return <Navigate to="/" replace />;
  return (
    <div className="container narrow" style={{ paddingBottom: 100 }}>
      <div className="page-hero"><span className="eyebrow">The fine print</span><h1>{p.title}</h1></div>
      <div className="card-soft prose">
        {p.body.map((t, i) => <p key={i}>{t}</p>)}
        <p className="muted">Questions? Write to {s.storeEmail || 'hello@snackim.example.com'}.</p>
      </div>
    </div>
  );
};

export default Policy;
