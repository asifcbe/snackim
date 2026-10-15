const mongoose = require('mongoose');

// A variant is one purchasable pack size, e.g. { name: 'Pack', value: '200g' },
// carrying its own price/stock/sku so the order snapshots the exact pack bought.
const variantSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Pack' },
  value: { type: String, required: true },
  sku: { type: String, trim: true },
  price: { type: Number, required: true },
  mrp: { type: Number },
  stock: { type: Number, default: 0 }
});

const PALETTE = ['yellow', 'pink', 'plum', 'teal', 'sky'];

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String },
  description: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true, default: 'banana-chips' },
  flavor: { type: String },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  price: { type: Number, required: true },
  mrp: { type: Number },
  weight: { type: String, default: '150g' },
  stock: { type: Number, default: 0 },
  variants: [variantSchema],
  ingredients: { type: String },
  spiceLevel: { type: Number, min: 0, max: 3, default: 0 },
  // Used to draw the illustrated pack when no product photo is uploaded.
  packColor: { type: String, enum: PALETTE, default: 'yellow' },
  chipColor: { type: String, default: '#F6D365' },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }]
}, { timestamps: true });

productSchema.index({ name: 'text', flavor: 'text', sku: 'text' });

module.exports = mongoose.model('Product', productSchema);
module.exports.PALETTE = PALETTE;
