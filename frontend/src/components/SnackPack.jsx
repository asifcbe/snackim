import React, { useId } from 'react';
import { BananaChip, PotatoChip } from './Chips';

// Illustrated snack pouch in the style of the real Snackim packs — used whenever a product
// has no uploaded photo, so the catalogue always looks on-brand.
export const PACK_THEMES = {
  yellow: { bg: '#FFBC42', bg2: '#F2A81D', a: '#07708F', b: '#D81159', title: '#D81159', small: '#07708F' },
  sky: { bg: '#73D2DE', bg2: '#4FBFCD', a: '#07708F', b: '#D81159', title: '#D81159', small: '#07708F' },
  pink: { bg: '#D81159', bg2: '#B00D48', a: '#FFFFFF', b: '#FFBC42', title: '#FFBC42', small: '#FFE3A8' },
  plum: { bg: '#8F2D56', bg2: '#6E2042', a: '#FFFFFF', b: '#FFBC42', title: '#73D2DE', small: '#FFE3A8' },
  teal: { bg: '#218380', bg2: '#176662', a: '#FFFFFF', b: '#FFBC42', title: '#FFBC42', small: '#C9EEF3' }
};

const splitLines = (text, max = 11, maxLines = 3) => {
  const words = (text || '').toUpperCase().split(/\s+/).filter(Boolean);
  const lines = [];
  words.forEach((w) => {
    const last = lines[lines.length - 1];
    if (last && (last + ' ' + w).length <= max) lines[lines.length - 1] = `${last} ${w}`;
    else lines.push(w);
  });
  if (lines.length > maxLines) {
    const head = lines.slice(0, maxLines - 1);
    return [...head, lines.slice(maxLines - 1).join(' ')];
  }
  return lines;
};

const SnackPack = ({ name, color = 'yellow', chipColor, category, className = '', style }) => {
  const t = PACK_THEMES[color] || PACK_THEMES.yellow;
  const id = useId().replace(/:/g, '');
  const lines = splitLines(name);
  const Chip = category === 'banana-chips' || category === 'combo-boxes' ? BananaChip : PotatoChip;
  const crimp = (y) => Array.from({ length: 20 }).map((_, i) => `${10 + i * 9},${y} ${14.5 + i * 9},${y + 5}`).join(' ');

  return (
    <svg viewBox="0 0 200 260" className={`snack-pack ${className}`} style={style} role="img" aria-label={`${name} pack`}>
      <defs>
        <linearGradient id={`pk${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={t.bg} />
          <stop offset="1" stopColor={t.bg2} />
        </linearGradient>
        <linearGradient id={`sh${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`cl${id}`}><path d="M12 14 H188 Q194 130 188 246 H12 Q6 130 12 14Z" /></clipPath>
      </defs>
      <ellipse cx="100" cy="252" rx="78" ry="7" fill="#000" opacity="0.12" />
      <path d="M12 14 H188 Q194 130 188 246 H12 Q6 130 12 14Z" fill={`url(#pk${id})`} />
      <g clipPath={`url(#cl${id})`}>
        <rect x="0" y="0" width="200" height="260" fill={`url(#sh${id})`} />
        <polyline points={crimp(14)} fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="2" />
        <polyline points={crimp(236)} fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="2" />
        <g transform="translate(118 132) rotate(-12)">
          <Chip size={96} color={chipColor} />
        </g>
      </g>
      <text x="26" y="64" fontFamily="Rubik, sans-serif" fontWeight="900" fontSize="25" letterSpacing="-0.5" fill={t.a}>SNA</text>
      {/* mirrored C */}
      <text x="-99" y="64" transform="scale(-1 1)" fontFamily="Rubik, sans-serif" fontWeight="900" fontSize="25" fill={t.a}>C</text>
      <text x="100" y="64" fontFamily="Rubik, sans-serif" fontWeight="900" fontSize="25" fill={t.b}>KIM</text>
      <g fontFamily="'Baloo 2', sans-serif" fontWeight="800" fontStyle="italic" fontSize="19" fill={t.title}>
        {lines.map((l, i) => <text key={i} x="26" y={92 + i * 20}>{l}</text>)}
      </g>
      <rect x="26" y={100 + lines.length * 20 - 8} width="14" height="3.5" rx="2" fill={t.title} />
      <g fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="6.4" letterSpacing="1.4" fill={t.small}>
        <text x="26" y="214">REAL INGREDIENTS</text>
        <text x="26" y="223">BRIGHTER DAYS</text>
      </g>
      <g fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="5.5" letterSpacing="1.2" fill={t.small} textAnchor="end">
        <text x="176" y="30">SNACK</text><text x="176" y="37">GOOD</text><text x="176" y="44">DO</text><text x="176" y="51">GOOD</text>
      </g>
    </svg>
  );
};

export default SnackPack;
