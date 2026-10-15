const mongoose = require('mongoose');

// One row per state/UT. shippingCharge/codCharge here override the store-wide defaults below,
// which are only used to pre-fill states that don't have a row yet.
const stateRateSchema = new mongoose.Schema({
  state: { type: String, required: true },
  deliverable: { type: Boolean, default: true },
  shippingCharge: { type: Number, default: 0, min: 0 },
  codAvailable: { type: Boolean, default: true },
  codCharge: { type: Number, default: 0, min: 0 }
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'Snackim' },
  storeTagline: { type: String, default: 'Good Snacks. Brighter Days.' },
  storeEmail: { type: String, default: 'hello@snackim.example.com' },
  storePhone: { type: String, default: '+91 98765 43210' },
  storeAddress: { type: String, default: 'Snackim Kitchen, Coimbatore, Tamil Nadu' },
  codEnabled: { type: Boolean, default: true },
  razorpayKeyId: { type: String, default: 'rzp_test_dummySnackim01' },
  socialLinks: {
    instagram: String,
    facebook: String,
    whatsapp: String,
    youtube: String
  },
  metaDescription: { type: String, default: 'Snackim — Kerala banana chips & crunchy snacks, a 30-year-old family recipe run by the Gen Z.' },
  stateRates: [stateRateSchema],
  freeShippingAbove: { type: Number, default: 499 },
  shippingCharge: { type: Number, default: 49 },
  codCharge: { type: Number, default: 40 },
  announcement: { type: String, default: 'Free shipping on orders above ₹499 · Use SNACKFIRST for 15% off' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
