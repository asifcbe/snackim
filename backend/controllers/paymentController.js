const crypto = require('crypto');
const Razorpay = require('razorpay');
const { buildOrderPayload, persistOrder } = require('./orderController');
const Order = require('../models/Order');

// Dummy-Razorpay mode: when RAZORPAY_MOCK=true (default while keys are dummies) the backend
// plays the part of the gateway. The frontend shows a Razorpay-style sheet, calls /mock-pay to
// "charge" the card, and receives a payment id + HMAC signature signed with the same secret —
// so /verify runs the exact signature check it would run against real Razorpay.
const isMock = () => process.env.RAZORPAY_MOCK === 'true'
  || /dummy/i.test(process.env.RAZORPAY_KEY_ID || '');

const randomId = (prefix) => `${prefix}_${crypto.randomBytes(7).toString('hex')}`;

const sign = (orderId, paymentId) => crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(`${orderId}|${paymentId}`)
  .digest('hex');

// In-memory record of mock orders → amount, so mock verify can check the amount like Razorpay would.
const mockOrders = new Map();

const getRazorpayInstance = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { customerInfo, items, couponCode } = req.body;
    const payload = await buildOrderPayload({ customerInfo, items, couponCode, paymentMethod: 'razorpay' });
    const amountPaise = Math.round(payload.total * 100);

    if (isMock()) {
      const id = randomId('order_mock');
      mockOrders.set(id, { amount: amountPaise, paid: 0 });
      return res.json({ razorpayOrderId: id, amount: amountPaise, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID, mock: true });
    }

    const razorpayOrder = await getRazorpayInstance().orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `sk_${Date.now()}`
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      mock: false
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Simulated gateway charge — only available in mock mode.
const mockPay = async (req, res) => {
  if (!isMock()) return res.status(404).json({ message: 'Not available' });
  const { razorpay_order_id, outcome } = req.body;
  const order = mockOrders.get(razorpay_order_id);
  if (!order) return res.status(400).json({ message: 'Unknown mock order' });
  if (outcome === 'fail') return res.status(402).json({ message: 'Payment declined by bank (simulated)' });
  order.paid = order.amount;
  const paymentId = randomId('pay_mock');
  res.json({
    razorpay_order_id,
    razorpay_payment_id: paymentId,
    razorpay_signature: sign(razorpay_order_id, paymentId)
  });
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      customerInfo, items, couponCode
    } = req.body;

    if (sign(razorpay_order_id, razorpay_payment_id) !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed: invalid signature' });
    }

    const existing = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existing) return res.status(200).json(existing);

    const payload = await buildOrderPayload({ customerInfo, items, couponCode, paymentMethod: 'razorpay' });
    const expectedAmount = Math.round(payload.total * 100);

    const amountPaid = isMock()
      ? (mockOrders.get(razorpay_order_id)?.paid || 0)
      : (await getRazorpayInstance().orders.fetch(razorpay_order_id)).amount_paid;
    if (amountPaid < expectedAmount) {
      return res.status(400).json({ message: 'Payment amount mismatch' });
    }

    const order = await persistOrder(payload, {
      user: req.user,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });
    mockOrders.delete(razorpay_order_id);

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createRazorpayOrder, mockPay, verifyPayment };
