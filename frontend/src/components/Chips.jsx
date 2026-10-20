import React from 'react';
import bananaChipSrc from '../assets/banana-chip.png';

// Illustrated chips used for decoration and inside the snack-pack illustration.

export { bananaChipSrc };

export const BananaChip = ({ size = 80, style, className = '' }) => (
  <img src={bananaChipSrc} width={size} height={size} alt="" aria-hidden draggable={false} className={`banana-chip ${className}`} style={style} />
);

export const PotatoChip = ({ size = 80, color = '#F5DC85', style, className }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className} aria-hidden>
    <path d="M14 46c2-20 22-36 44-34 20 2 33 18 31 38-2 22-22 38-44 35C24 82 12 66 14 46z" fill={color} stroke="#C99A3E" strokeWidth="3" />
    <path d="M26 40c8-8 20-12 30-10" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.45" fill="none" />
    {[[40, 55], [60, 40], [62, 64], [36, 70], [72, 52]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" fill="#A0601E" opacity="0.6" />)}
  </svg>
);

export const ChipForCategory = ({ category, ...props }) =>
  (category === 'banana-chips' || category === 'combo-boxes' || !category
    ? <BananaChip {...props} />
    : <PotatoChip {...props} />);

// Gentle steam wisps — rendered above chips that "just came out of the kadai".
export const Steam = ({ width = 60, style, className = '' }) => (
  <svg width={width} height={width * 1.1} viewBox="0 0 60 66" className={`steam ${className}`} style={style} aria-hidden>
    {[12, 30, 48].map((x, i) => (
      <path key={x} d={`M${x} 62c-8-10 8-16 0-26s8-16 0-26`} fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" style={{ animationDelay: `${i * 0.6}s` }} />
    ))}
  </svg>
);
