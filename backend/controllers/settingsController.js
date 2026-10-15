const Settings = require('../models/Settings');
const { INDIAN_STATES } = require('../config/states');
const { ensureStateRates } = require('../config/shipping');

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    if (ensureStateRates(settings)) await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    const allowed = [
      'storeName', 'storeTagline', 'storeEmail', 'storePhone', 'storeAddress', 'codEnabled',
      'razorpayKeyId', 'metaDescription', 'freeShippingAbove', 'shippingCharge', 'codCharge',
      'announcement', 'socialLinks'
    ];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) settings[key] = req.body[key];
    });
    if (Array.isArray(req.body.stateRates)) {
      const money = (v) => Math.max(0, Math.round(Number(v) || 0));
      const byState = new Map(req.body.stateRates.map((r) => [r.state, r]));
      settings.stateRates = INDIAN_STATES.filter((st) => byState.has(st)).map((st) => {
        const r = byState.get(st);
        return { state: st, deliverable: r.deliverable !== false, shippingCharge: money(r.shippingCharge), codAvailable: r.codAvailable !== false, codCharge: money(r.codCharge) };
      });
    }
    ensureStateRates(settings);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSettings, updateSettings };
