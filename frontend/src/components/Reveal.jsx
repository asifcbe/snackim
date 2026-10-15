import React from 'react';
import { motion } from 'framer-motion';

// Fades/slides children in when they scroll into view.
const Reveal = ({ children, delay = 0, y = 40, x = 0, as = 'div', className, style, once = true, amount = 0.25 }) => {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
};

export default Reveal;
