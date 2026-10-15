// Per-state shipping & COD. KEEP IN SYNC with frontend/src/utils/shipping.js (preview copy).
const { INDIAN_STATES } = require('./states');

// Fills in any state missing from settings.stateRates using the store-wide defaults.
// Returns true when something was added (caller saves).
const ensureStateRates = (settings) => {
  const have = new Set((settings.stateRates || []).map((r) => r.state));
  const missing = INDIAN_STATES.filter((s) => !have.has(s));
  missing.forEach((state) => settings.stateRates.push({
    state, deliverable: true, shippingCharge: settings.shippingCharge, codAvailable: true, codCharge: settings.codCharge
  }));
  if (missing.length) settings.stateRates.sort((a, b) => INDIAN_STATES.indexOf(a.state) - INDIAN_STATES.indexOf(b.state));
  return missing.length > 0;
};

// amount = order value after discount. Throws with a customer-facing message if the
// destination or payment method isn't allowed.
const quoteShipping = (settings, state, amount, paymentMethod) => {
  const rate = (settings?.stateRates || []).find((r) => r.state === state);
  if (!rate) throw new Error('Please select a valid state for delivery');
  if (!rate.deliverable) throw new Error(`Sorry, we don't deliver to ${state} yet`);
  const cod = paymentMethod === 'cod';
  if (cod && (!settings.codEnabled || !rate.codAvailable)) throw new Error(`Cash on delivery is not available in ${state}`);
  const freeAbove = settings.freeShippingAbove || 0;
  const shippingCharge = freeAbove && amount >= freeAbove ? 0 : rate.shippingCharge;
  const codCharge = cod ? rate.codCharge : 0;
  return { shippingCharge, codCharge };
};

module.exports = { ensureStateRates, quoteShipping };
