import React from 'react';

const Marquee = ({ items, speed = 32, reverse = false, className = '', separator = '✦', renderItem }) => {
  const row = (hidden) => (
    <div className="marquee-track" aria-hidden={hidden}>
      {items.map((it, i) => (
        <span key={i} className="marquee-item">
          {renderItem ? renderItem(it, i) : it}
          {separator && <span className="marquee-sep">{separator}</span>}
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${reverse ? 'marquee-reverse' : ''} ${className}`} style={{ '--marquee-speed': `${speed}s` }}>
      {row(false)}{row(true)}
    </div>
  );
};

export default Marquee;
