// Clears and reseeds Snackim catalogue, coupons and landing content with dummy data.
// Never touches User documents. Run from backend/: node scripts/seedDummyData.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const LandingContent = require('../models/LandingContent');
const Settings = require('../models/Settings');
const defaults = require('../config/landingDefaults');

const categories = [
  { name: 'Banana Chips', slug: 'banana-chips', tagline: 'The OG. Since 1995.', color: 'yellow', order: 1 },
  { name: 'Potato Chips', slug: 'potato-chips', tagline: 'Thin, loud, unstoppable.', color: 'sky', order: 2 },
  { name: 'Tapioca Chips', slug: 'tapioca-chips', tagline: 'Kappa, but make it crunchy.', color: 'teal', order: 3 },
  { name: 'Mixtures', slug: 'mixtures', tagline: 'Chaos in a pack.', color: 'pink', order: 4 },
  { name: 'Sweet Bites', slug: 'sweet-bites', tagline: 'Jaggery-coated happiness.', color: 'plum', order: 5 },
  { name: 'Combo Boxes', slug: 'combo-boxes', tagline: 'Gift it. Or don’t share.', color: 'pink', order: 6 }
];

const packs = (base, mrpMul = 1.2) => [
  { name: 'Pack', value: '150g', price: base, mrp: Math.round(base * mrpMul), stock: 120 },
  { name: 'Pack', value: '250g', price: Math.round(base * 1.6), mrp: Math.round(base * 1.6 * mrpMul), stock: 90 },
  { name: 'Pack', value: '500g', price: Math.round(base * 2.9), mrp: Math.round(base * 2.9 * mrpMul), stock: 60 }
];

const p = (o) => ({ isActive: true, stock: 150, weight: '150g', ...o, mrp: o.mrp || Math.round(o.price * 1.2) });

const products = [
  p({ name: 'Classic Kerala Banana Chips', sku: 'SK-BAN-CLS', category: 'banana-chips', flavor: 'Salted · Coconut Oil', tagline: 'The one that started it all', price: 99, packColor: 'yellow', chipColor: '#F7D774', featured: true, bestseller: true, spiceLevel: 0,
      description: 'Thin-sliced raw Nendran bananas fried in pure coconut oil with a splash of turmeric salt water. Golden, crackly, and exactly how Appa made it in 1995.',
      ingredients: 'Raw Nendran banana, coconut oil, turmeric, salt', variants: packs(99), tags: ['bestseller', 'classic', 'banana'] }),
  p({ name: 'Pepper Punch Banana Chips', sku: 'SK-BAN-PEP', category: 'banana-chips', flavor: 'Black Pepper', tagline: 'Malabar pepper, maximum crunch', price: 109, packColor: 'teal', chipColor: '#E9C25A', featured: true, bestseller: true, spiceLevel: 2,
      description: 'Our classic banana chips tossed in freshly cracked Malabar black pepper. Warm and peppery, and you won’t stop at one handful.',
      ingredients: 'Raw Nendran banana, coconut oil, black pepper, salt, turmeric', variants: packs(109), tags: ['spicy', 'banana'] }),
  p({ name: 'Peri Peri Banana Chips', sku: 'SK-BAN-PERI', category: 'banana-chips', flavor: 'Peri Peri', tagline: 'Gen Z’s favourite remix', price: 119, packColor: 'pink', chipColor: '#F0A24A', featured: true, bestseller: true, spiceLevel: 3,
      description: 'Banana chips with a smoky peri peri dust. The first new flavour the Gen Z crew launched, and it sold out in two days.',
      ingredients: 'Raw Nendran banana, coconut oil, peri peri seasoning, salt', variants: packs(119), tags: ['spicy', 'new', 'banana'] }),
  p({ name: 'Sweet Sharkara Varatti', sku: 'SK-BAN-SHK', category: 'banana-chips', flavor: 'Jaggery Coated', tagline: 'The Onam special, all year', price: 129, packColor: 'plum', chipColor: '#B5651D', featured: true, spiceLevel: 0,
      description: 'Thick-cut banana pieces fried and coated in molten jaggery with dry ginger, cardamom and cumin. Sadhya-approved.',
      ingredients: 'Raw Nendran banana, coconut oil, jaggery, dry ginger, cardamom, cumin', variants: packs(129), tags: ['sweet', 'traditional', 'banana'] }),
  p({ name: 'Ripe Banana Chips', sku: 'SK-BAN-RIPE', category: 'banana-chips', flavor: 'Naturally Sweet', tagline: 'Fruit candy energy', price: 119, packColor: 'sky', chipColor: '#E8A33C', bestseller: true, spiceLevel: 0,
      description: 'Made from semi-ripe Nendran bananas for a naturally sweet, caramel-like chip. No sugar added, and the colour is all from the fruit.',
      ingredients: 'Semi-ripe Nendran banana, coconut oil', variants: packs(119), tags: ['sweet', 'banana'] }),
  p({ name: 'Chilli Garlic Banana Chips', sku: 'SK-BAN-CHG', category: 'banana-chips', flavor: 'Chilli Garlic', tagline: 'Spicy & garlicky', price: 115, packColor: 'pink', chipColor: '#E58A3A', spiceLevel: 2,
      description: 'Classic banana chips tossed with roasted garlic and Kashmiri chilli. Bold, spicy and very hard to put down.',
      ingredients: 'Raw Nendran banana, coconut oil, garlic, Kashmiri chilli, salt', variants: packs(115), tags: ['spicy', 'banana'] }),
  p({ name: 'Honey Roasted Potato Chips', sku: 'SK-POT-HON', category: 'potato-chips', flavor: 'Honey Roasted', tagline: 'Sweet, salty, golden', price: 89, packColor: 'yellow', chipColor: '#F3D36B', featured: true, spiceLevel: 0,
      description: 'Kettle-style potato chips with a light honey glaze and a pinch of sea salt.',
      ingredients: 'Potato, sunflower oil, honey powder, sea salt', variants: packs(89), tags: ['potato'] }),
  p({ name: 'Sea Salt Potato Chips', sku: 'SK-POT-SEA', category: 'potato-chips', flavor: 'Sea Salt', tagline: 'Simple. Perfect.', price: 79, packColor: 'sky', chipColor: '#F5DC85', spiceLevel: 0,
      description: 'Thin potato chips with just sea salt. Nothing to hide behind, so every batch has to be crisp.',
      ingredients: 'Potato, sunflower oil, sea salt', variants: packs(79), tags: ['potato', 'classic'] }),
  p({ name: 'Spicy Tomato Potato Chips', sku: 'SK-POT-TOM', category: 'potato-chips', flavor: 'Spicy Tomato', tagline: 'Tangy with a kick', price: 89, packColor: 'yellow', chipColor: '#E1683C', spiceLevel: 2,
      description: 'Sun-dried tomato and chilli seasoning on thin-cut potato chips. Tangy, a bit spicy and very more-ish.',
      ingredients: 'Potato, sunflower oil, tomato powder, chilli, salt, sugar', variants: packs(89), tags: ['potato', 'spicy'] }),
  p({ name: 'Kappa Tapioca Chips', sku: 'SK-TAP-CLS', category: 'tapioca-chips', flavor: 'Salted', tagline: 'Kerala’s other obsession', price: 85, packColor: 'teal', chipColor: '#F2E3B3', spiceLevel: 0,
      description: 'Crispy tapioca (kappa) wafers fried in coconut oil. Light, airy, and perfect with chai.',
      ingredients: 'Tapioca, coconut oil, salt', variants: packs(85), tags: ['tapioca'] }),
  p({ name: 'Masala Tapioca Sticks', sku: 'SK-TAP-MAS', category: 'tapioca-chips', flavor: 'Chilli Masala', tagline: 'Thattukada vibes', price: 89, packColor: 'pink', chipColor: '#D9763A', spiceLevel: 3,
      description: 'Tapioca sticks with fiery chilli masala, like the ones from roadside tea stalls in Kerala.',
      ingredients: 'Tapioca, coconut oil, chilli powder, asafoetida, salt', variants: packs(89), tags: ['tapioca', 'spicy'] }),
  p({ name: 'Kerala Mixture', sku: 'SK-MIX-KER', category: 'mixtures', flavor: 'Spicy Mix', tagline: 'Everything, everywhere, all at once', price: 95, packColor: 'plum', chipColor: '#E7B04A', spiceLevel: 2,
      description: 'Sev, boondi, peanuts, curry leaves and banana chip bits all mixed together. Basically chaos in a pack.',
      ingredients: 'Gram flour, peanuts, banana chips, curry leaves, chilli, coconut oil, salt', variants: packs(95), tags: ['mixture', 'spicy'] }),
  p({ name: 'Jaggery Peanut Chikki Bites', sku: 'SK-SWT-CHK', category: 'sweet-bites', flavor: 'Jaggery Peanut', tagline: 'Crunchy sweet squares', price: 75, packColor: 'yellow', chipColor: '#B97A2E', spiceLevel: 0,
      description: 'Roasted peanuts set in organic jaggery and cut into bite-size squares.',
      ingredients: 'Peanuts, jaggery, cardamom', variants: packs(75), tags: ['sweet'] }),
  p({ name: 'The Snackim Box', sku: 'SK-CMB-BOX', category: 'combo-boxes', flavor: '3 Packs + Sticker', tagline: 'Our signature gift box', price: 299, mrp: 359, packColor: 'yellow', chipColor: '#F7D774', featured: true, bestseller: true, spiceLevel: 1,
      description: 'Honey Roasted, Sea Salt and Spicy Tomato in our yellow gift box, with a thank-you card and a Snackim sticker.',
      ingredients: 'See individual packs', stock: 80, tags: ['gift', 'combo'] }),
  p({ name: 'Banana Lovers Box', sku: 'SK-CMB-BAN', category: 'combo-boxes', flavor: '4 Banana Flavours', tagline: 'For the true OGs', price: 399, mrp: 479, packColor: 'pink', chipColor: '#F0A24A', featured: true, spiceLevel: 1,
      description: 'Classic, Pepper Punch, Peri Peri and Sharkara Varatti in one box. The best way to try all four.',
      ingredients: 'See individual packs', stock: 60, tags: ['gift', 'combo', 'banana'] })
];

const coupons = [
  { code: 'SNACKFIRST', description: '15% off your first crunch', discountType: 'percentage', discountValue: 15, maxDiscount: 150, minOrderAmount: 199, showOnCheckout: true },
  { code: 'CRUNCH50', description: '₹50 off orders above ₹399', discountType: 'fixed', discountValue: 50, minOrderAmount: 399, showOnCheckout: true },
  { code: 'GENZ30', description: '30 years, 30% off (max ₹200)', discountType: 'percentage', discountValue: 30, maxDiscount: 200, minOrderAmount: 499, showOnCheckout: true }
].map((c) => ({ ...c, isActive: true, expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45) }));

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding…');

  await Category.deleteMany({ slug: { $in: categories.map((c) => c.slug) } });
  await Category.insertMany(categories);

  await Product.deleteMany({ sku: { $in: products.map((x) => x.sku) } });
  await Product.insertMany(products);

  await Coupon.deleteMany({ code: { $in: coupons.map((c) => c.code) } });
  await Coupon.insertMany(coupons);

  await LandingContent.deleteMany({});
  await LandingContent.create({
    processSteps: defaults.processSteps,
    legacyMilestones: defaults.legacyMilestones,
    legacyText: defaults.legacyText,
    legacyImage: '/uploads/seed-unboxing.jpg',
    carouselSlides: [
      { mediaType: 'image', url: '/uploads/seed-unboxing.jpg', caption: 'The Snackim Box', subcaption: 'Three packs, a thank-you card and a sticker. Packed the morning it ships.', ctaText: 'Get the box', ctaLink: '/shop?category=combo-boxes', theme: 'yellow' }
    ]
  });

  if (!(await Settings.findOne())) await Settings.create({});

  console.log(`✅ Seeded ${categories.length} categories, ${products.length} products, ${coupons.length} coupons, landing content.`);
  await mongoose.disconnect();
})().catch((err) => { console.error(err); process.exit(1); });
