const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    const devOrigin = process.env.NODE_ENV !== 'production'
      && /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin || '');
    if (!origin || allowedOrigins.includes(origin) || devOrigin) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
// Videos are served with range support by express.static, so <video> can seek/stream.
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '7d' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/landing', require('./routes/landing'));
app.use('/api/payment', require('./routes/payment'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Snackim API is running' }));

// Multer / generic error handler so upload errors come back as JSON instead of HTML.
app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ message: err.message });
  next();
});

const seedAdmin = async () => {
  const User = require('./models/User');
  const email = process.env.ADMIN_SEED_EMAIL || 'admin@snackim.example.com';
  const exists = await User.findOne({ email });
  if (!exists) {
    await User.create({
      name: process.env.ADMIN_SEED_NAME || 'snackimadmin',
      email,
      password: process.env.ADMIN_SEED_PASSWORD || 'changeme123',
      isAdmin: true
    });
    console.log('✅ Admin account created:', email);
  }
};

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/snackim')
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await seedAdmin();
  })
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Snackim server running on port ${PORT}`));
