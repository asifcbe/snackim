// Preview copy of backend/config/shipping.js — the backend re-prices every order.
export const rateFor = (settings, state) => (settings?.stateRates || []).find((r) => r.state === state) || null;

// amount = order value after discount
export const quoteShipping = (settings, state, amount, paymentMethod) => {
  const rate = rateFor(settings, state);
  const codAllowed = !!(settings?.codEnabled && rate?.codAvailable);
  if (!rate) return { ready: false, codAllowed: false, shippingCharge: 0, codCharge: 0 };
  const freeAbove = settings.freeShippingAbove || 0;
  return {
    ready: true,
    deliverable: rate.deliverable,
    codAllowed,
    codFee: rate.codCharge,
    shippingCharge: freeAbove && amount >= freeAbove ? 0 : rate.shippingCharge,
    codCharge: paymentMethod === 'cod' && codAllowed ? rate.codCharge : 0
  };
};

// Union territories, used to group the checkout dropdown (everything else is a state).
export const UNION_TERRITORIES = [
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];
