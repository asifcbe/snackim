const router = require('express').Router();
const { optionalAuth } = require('../middleware/auth');
const { createRazorpayOrder, mockPay, verifyPayment } = require('../controllers/paymentController');

router.post('/create-order', optionalAuth, createRazorpayOrder);
router.post('/mock-pay', mockPay);
router.post('/verify', optionalAuth, verifyPayment);

module.exports = router;
