import React, { useId } from 'react';

// Illustrated chips used for decoration and inside the snack-pack illustration.

export const BananaChip = ({ size = 80, color = '#F7D774', style, className }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className} aria-hidden>
      <defs>
        <radialGradient id={`bg${id}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor="#D9A23A" />
        </radialGradient>
      </defs>
      <path d="M50 4c22 0 44 15 45 42 1 27-19 49-46 50C22 97 4 76 5 50 6 24 27 4 50 4z" fill={`url(#bg${id})`} stroke="#C48A2C" strokeWidth="3" />
      <circle cx="50" cy="50" r="17" fill="none" stroke="#C99A3E" strokeWidth="2" opacity="0.7" />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return <circle key={i} cx={50 + Math.cos(a) * 11} cy={50 + Math.sin(a) * 11} r="1.9" fill="#9C6B22" opacity="0.75" />;
      })}
      <circle cx="50" cy="50" r="3" fill="#9C6B22" opacity="0.6" />
      <circle cx="30" cy="70" r="1.6" fill="#FFF" opacity="0.8" />
      <circle cx="68" cy="28" r="1.4" fill="#FFF" opacity="0.8" />
      <circle cx="72" cy="66" r="1.2" fill="#A3741F" opacity="0.5" />
      <ellipse cx="34" cy="28" rx="10" ry="5" fill="#fff" opacity="0.35" transform="rotate(-30 34 28)" />
    </svg>
  );
};

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
