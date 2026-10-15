import React, { useMemo, useState } from 'react';

// Admin table for per-state delivery: deliverable?, shipping ₹, COD available?, COD fee ₹.
// Includes search and a bulk "apply to all shown" row so whole regions can be set at once.
const StateRatesEditor = ({ rates = [], onChange }) => {
  const [q, setQ] = useState('');
  const [bulk, setBulk] = useState({ shippingCharge: '', codCharge: '' });
  const shown = useMemo(() => rates.filter((r) => r.state.toLowerCase().includes(q.trim().toLowerCase())), [rates, q]);
  const shownSet = new Set(shown.map((r) => r.state));

  const update = (state, patch) => onChange(rates.map((r) => (r.state === state ? { ...r, ...patch } : r)));
  const applyBulk = (patch) => onChange(rates.map((r) => (shownSet.has(r.state) ? { ...r, ...patch } : r)));
  const num = (v) => (v === '' ? '' : Math.max(0, Number(v) || 0));

  return (
    <div className="rates">
      <div className="rates-tools">
        <input className="form-control" placeholder="Search state…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 220 }} />
        <span className="muted" style={{ fontSize: '0.82rem' }}>Apply to {q ? `${shown.length} shown` : `all ${rates.length}`}:</span>
        <input className="form-control" type="number" min="0" placeholder="Shipping ₹" value={bulk.shippingCharge} onChange={(e) => setBulk({ ...bulk, shippingCharge: num(e.target.value) })} style={{ width: 120 }} />
        <button type="button" className="btn btn-sm" disabled={bulk.shippingCharge === ''} onClick={() => applyBulk({ shippingCharge: bulk.shippingCharge })}>Set shipping</button>
        <input className="form-control" type="number" min="0" placeholder="COD fee ₹" value={bulk.codCharge} onChange={(e) => setBulk({ ...bulk, codCharge: num(e.target.value) })} style={{ width: 120 }} />
        <button type="button" className="btn btn-sm" disabled={bulk.codCharge === ''} onClick={() => applyBulk({ codCharge: bulk.codCharge })}>Set COD fee</button>
        <button type="button" className="btn btn-sm" onClick={() => applyBulk({ codAvailable: true })}>COD on</button>
        <button type="button" className="btn btn-sm" onClick={() => applyBulk({ codAvailable: false })}>COD off</button>
      </div>
      <div className="table-wrap rates-table">
        <table className="table">
          <thead><tr><th>State / UT</th><th>Deliver</th><th>Shipping ₹</th><th>COD</th><th>COD fee ₹</th></tr></thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.state} style={{ opacity: r.deliverable ? 1 : 0.5 }}>
                <td><strong>{r.state}</strong></td>
                <td><input type="checkbox" className="rates-check" checked={r.deliverable} onChange={(e) => update(r.state, { deliverable: e.target.checked })} aria-label={`Deliver to ${r.state}`} /></td>
                <td><input className="form-control rates-num" type="number" min="0" value={r.shippingCharge} disabled={!r.deliverable} onChange={(e) => update(r.state, { shippingCharge: num(e.target.value) })} aria-label={`${r.state} shipping`} /></td>
                <td><input type="checkbox" className="rates-check" checked={r.codAvailable} disabled={!r.deliverable} onChange={(e) => update(r.state, { codAvailable: e.target.checked })} aria-label={`COD in ${r.state}`} /></td>
                <td><input className="form-control rates-num" type="number" min="0" value={r.codCharge} disabled={!r.deliverable || !r.codAvailable} onChange={(e) => update(r.state, { codCharge: num(e.target.value) })} aria-label={`${r.state} COD fee`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StateRatesEditor;
