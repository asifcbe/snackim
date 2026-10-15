// Creates or resets the admin account from ADMIN_SEED_* in .env.
// The server only seeds the admin once, so run this after changing the admin email/password in .env:
//   npm run reset-admin
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  const email = (process.env.ADMIN_SEED_EMAIL || '').toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) throw new Error('Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env');
  await mongoose.connect(process.env.MONGO_URI);
  let user = await User.findOne({ email });
  if (!user) user = new User({ email, name: process.env.ADMIN_SEED_NAME || 'admin' });
  user.password = password; // hashed by the model's pre-save hook
  user.isAdmin = true;
  await user.save();
  console.log(`✅ Admin ready: ${email}`);
  await mongoose.disconnect();
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
