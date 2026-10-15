import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FiX, FiLock, FiCreditCard, FiSmartphone, FiHome } from 'react-icons/fi';
import api, { rupee, errMsg } from '../utils/api';

// Razorpay-style checkout sheet for dummy/test mode. It "charges" via the backend's
// /api/payment/mock-pay, which returns a properly signed payment so /verify works unchanged.
const MockRazorpay = ({ order, storeName, prefill, onSuccess, onDismiss, onFailure }) => {
  const [tab, setTab] = useState('upi');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('form'); // form | processing | done

  const pay = async (outcome = 'success') => {
    setBusy(true);
    setStage('processing');
    try {
      await new Promise((r) => setTimeout(r, 1400));
      const { data } = await api.post('/api/payment/mock-pay', { razorpay_order_id: order.razorpayOrderId, outcome });
      setStage('done');
      await new Promise((r) => setTimeout(r, 700));
      onSuccess(data);
    } catch (err) {
      setStage('form');
      setBusy(false);
      onFailure(errMsg(err, 'Payment failed'));
    }
  };

  return createPortal(
    <div className="rzp-backdrop">
      <motion.div className="rzp" initial={{ y: 40, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 22 }}>
        <div className="rzp-head">
          <div className="rzp-logo">S</div>
          <div>
            <strong>{storeName}</strong>
            <span>Order {order.razorpayOrderId.slice(-8)}</span>
          </div>
          <div className="rzp-amount">{rupee(order.amount / 100)}</div>
          {!busy && <button className="rzp-close" onClick={onDismiss} aria-label="Close"><FiX /></button>}
        </div>
        <div className="rzp-test">TEST MODE · dummy Razorpay, no real money moves</div>

        {stage === 'form' && (
          <div className="rzp-body">
            <div className="rzp-contact">{prefill.contact} · {prefill.email}</div>
            <div className="rzp-tabs">
              <button className={tab === 'upi' ? 'active' : ''} onClick={() => setTab('upi')}><FiSmartphone /> UPI</button>
              <button className={tab === 'card' ? 'active' : ''} onClick={() => setTab('card')}><FiCreditCard /> Card</button>
              <button className={tab === 'nb' ? 'active' : ''} onClick={() => setTab('nb')}><FiHome /> Netbanking</button>
            </div>
            {tab === 'upi' && <input className="form-control" defaultValue="success@razorpay" aria-label="UPI ID" />}
            {tab === 'card' && (
              <div className="rzp-card">
                <input className="form-control" defaultValue="4111 1111 1111 1111" aria-label="Card number" />
                <div className="input-row input-row-2">
                  <input className="form-control" defaultValue="12/30" aria-label="Expiry" />
                  <input className="form-control" defaultValue="123" aria-label="CVV" />
                </div>
              </div>
            )}
            {tab === 'nb' && (
              <select className="form-control" defaultValue="HDFC" aria-label="Bank">
                <option>HDFC</option><option>ICICI</option><option>SBI</option><option>Axis</option>
              </select>
            )}
            <button className="rzp-pay" onClick={() => pay('success')} disabled={busy}>Pay {rupee(order.amount / 100)}</button>
            <button className="rzp-fail" onClick={() => pay('fail')} disabled={busy}>Simulate a failed payment</button>
            <div className="rzp-secure"><FiLock /> Secured by Razorpay (simulated)</div>
          </div>
        )}
        {stage !== 'form' && (
          <div className="rzp-processing">
            {stage === 'processing' ? <div className="spinner" style={{ margin: '0 auto 16px' }} /> : <motion.div className="rzp-tick" initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>}
            <strong>{stage === 'processing' ? 'Processing payment…' : 'Payment successful'}</strong>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

export default MockRazorpay;
