import React from 'react';

// Recreates the SNACKIM logotype: "SNAↃ" in blue (with the mirrored C) and "KIM" in pink.
const Wordmark = ({ size = 28, variant = '', className = '', style }) => (
  <span className={`wordmark ${variant} ${className}`} style={{ fontSize: size, ...style }} aria-label="Snackim">
    <span className="wm-a" aria-hidden>SNA<span className="wm-flip">C</span></span>
    <span className="wm-b" aria-hidden>KIM</span>
  </span>
);

export default Wordmark;
