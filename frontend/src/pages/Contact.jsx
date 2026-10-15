import React from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../context/SettingsContext';
import Reveal from '../components/Reveal';

const Contact = () => {
  const s = useSettings();
  const cards = [
    { icon: <FiMail />, label: 'Email', value: s.storeEmail, href: `mailto:${s.storeEmail}`, color: 'yellow' },
    { icon: <FiPhone />, label: 'Call', value: s.storePhone, href: `tel:${(s.storePhone || '').replace(/\s/g, '')}`, color: 'sky' },
    { icon: <FaWhatsapp />, label: 'WhatsApp', value: 'Chat with the crew', href: s.socialLinks?.whatsapp || '#', color: 'pink' },
    { icon: <FiMapPin />, label: 'Kitchen', value: s.storeAddress, color: 'teal' }
  ];
  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <div className="page-hero"><span className="eyebrow">Say hi</span><h1>We reply faster than <br />you finish a pack.</h1></div>
      <div className="grid grid-4 contact-grid">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08}>
            <a href={c.href} className={`cat-tile cat-${c.color}`} style={{ minHeight: 180 }}>
              <span className="cat-emoji" style={{ fontSize: '2rem' }}>{c.icon}</span>
              <strong>{c.label}</strong>
              <span>{c.value}</span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default Contact;
