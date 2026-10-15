const Product = require('../models/Product');
const { uploadToStorage, deleteFromStorage } = require('../config/storage');

const parseJsonFields = (body) => {
  ['tags', 'variants'].forEach((k) => {
    if (typeof body[k] === 'string') body[k] = JSON.parse(body[k]);
  });
  ['featured', 'bestseller', 'isActive'].forEach((k) => {
    if (body[k] !== undefined) body[k] = body[k] === 'true' || body[k] === true;
  });
  return body;
};

const getProducts = async (req, res) => {
  try {
    const { category, featured, bestseller, page = 1, limit = 24, search, sort } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (bestseller) filter.bestseller = bestseller === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { flavor: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const sortMap = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      newest: { createdAt: -1 },
      popular: { bestseller: -1, featured: -1, createdAt: -1 }
    };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortMap[sort] || sortMap.popular)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter)
    ]);

    res.json({ products, total, pages: Math.ceil(total / limitNum), page: pageNum });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCategoryCounts = async (req, res) => {
  try {
    const counts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json(counts.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {}));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const body = parseJsonFields({ ...req.body });
    let images = [];
    if (req.files && req.files.length) {
      const uploaded = await Promise.all(req.files.map((f) => uploadToStorage(f)));
      images = uploaded.map((u) => u.secure_url);
    }
    const product = await Product.create({ ...body, images });
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'SKU already exists' });
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const body = parseJsonFields({ ...req.body });

    let existingImages = product.images;
    if (body.existingImages) {
      existingImages = JSON.parse(body.existingImages);
      const removed = product.images.filter((img) => !existingImages.includes(img));
      removed.forEach((img) => deleteFromStorage(img));
    }
    delete body.existingImages;

    let newImages = [];
    if (req.files && req.files.length) {
      const uploaded = await Promise.all(req.files.map((f) => uploadToStorage(f)));
      newImages = uploaded.map((u) => u.secure_url);
    }

    Object.assign(product, body, { images: [...existingImages, ...newImages] });
    await product.save();
    res.json(product);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'SKU already exists' });
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.images.forEach((img) => deleteFromStorage(img));
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts, getCategoryCounts, getAllProductsAdmin, getProduct, createProduct, updateProduct, deleteProduct
};
