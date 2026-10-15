import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiTag, FiShoppingBag, FiPercent, FiFilm, FiSettings, FiLogOut, FiExternalLink, FiMenu } from 'react-icons/fi';
import Wordmark from '../../components/Wordmark';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid />, end: true },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
  { to: '/admin/products', label: 'Products', icon: <FiBox /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiTag /> },
  { to: '/admin/coupons', label: 'Coupons', icon: <FiPercent /> },
  { to: '/admin/landing', label: 'Landing & Videos', icon: <FiFilm /> },
  { to: '/admin/settings', label: 'Settings', icon: <FiSettings /> }
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <div className="admin-shell">
      <aside className={`admin-side ${open ? 'open' : ''}`}>
        <div className="admin-side-top">
          <Link to="/admin"><Wordmark size={26} variant="on-dark" /></Link>
          <button className="admin-burger" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu"><FiMenu /></button>
        </div>
        <span className="admin-side-tag">Kitchen control</span>
        <nav onClick={() => setOpen(false)}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>{l.icon}{l.label}</NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <Link to="/" target="_blank"><FiExternalLink /> View store</Link>
          <button onClick={() => { logout(); navigate('/'); }}><FiLogOut /> Log out</button>
          <small>{user?.email}</small>
        </div>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
};

export default AdminLayout;
