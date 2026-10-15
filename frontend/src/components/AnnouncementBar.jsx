import React from 'react';
import Marquee from './Marquee';
import { useSettings } from '../context/SettingsContext';

const AnnouncementBar = () => {
  const { announcement } = useSettings();
  const items = [
    announcement || 'Free shipping on orders above ₹499',
    'Small batches, fried every morning',
    'Pure coconut oil, changed every batch',
    'Sealed warm, shipped the same day',
    'Nendran bananas straight from Kerala farms'
  ];
  return (
    <div className="announce">
      <Marquee items={items} speed={38} separator="🍌" />
    </div>
  );
};

export default AnnouncementBar;
