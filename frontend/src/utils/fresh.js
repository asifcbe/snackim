// Small helpers that describe "today's batch" — the kitchen fries every morning,
// so labels are derived from the current date/time rather than stored data.

export const todayLabel = (d = new Date()) =>
  d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export const batchCode = (d = new Date()) => {
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `SK-${y}${m}${day}-07`;
};

// What's happening in the kitchen right now — drives the live status chip.
export const kitchenStatus = (d = new Date()) => {
  const h = d.getHours() + d.getMinutes() / 60;
  if (h >= 4.5 && h < 6) return { emoji: '🍌', label: 'Bananas arriving from the farm', tone: 'teal' };
  if (h >= 6 && h < 9) return { emoji: '🔥', label: 'Kadai is on — frying now', tone: 'pink' };
  if (h >= 9 && h < 12) return { emoji: '📦', label: 'Sealing this morning’s batch', tone: 'yellow' };
  if (h >= 12 && h < 18) return { emoji: '🚚', label: 'Today’s batch is shipping', tone: 'teal' };
  return { emoji: '🌙', label: 'Prepping tomorrow’s first batch', tone: 'plum' };
};

export const shipLine = (d = new Date()) => {
  const h = d.getHours();
  return h < 14 ? 'Order before 2 PM, ships today' : 'Ships with tomorrow morning’s batch';
};
