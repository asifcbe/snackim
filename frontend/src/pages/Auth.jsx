import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../utils/api';
import Wordmark from '../components/Wordmark';
import SnackPack from '../components/SnackPack';

const Auth = ({ mode = 'login' }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const isLogin = mode === 'login';

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = isLogin ? await login(form.email, form.password) : await register(form.name, form.email, form.password, form.phone);
      toast.success(`Welcome${isLogin ? ' back' : ''}, ${u.name.split(' ')[0]}! 🍌`);
      navigate(u.isAdmin ? '/admin' : (location.state?.from || '/'));
    } catch (err) {
      toast.error(errMsg(err, 'Could not sign you in'));
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="auth">
      <div className="auth-art grain">
        <motion.div className="auth-pack" initial={{ y: 60, rotate: -12, opacity: 0 }} animate={{ y: 0, rotate: -8, opacity: 1 }} transition={{ type: 'spring', damping: 14 }}>
          <SnackPack name="Classic Banana Chips" color="yellow" chipColor="#F7D774" category="banana-chips" />
        </motion.div>
        <motion.div className="auth-pack p2" initial={{ y: 80, rotate: 12, opacity: 0 }} animate={{ y: 0, rotate: 9, opacity: 1 }} transition={{ type: 'spring', damping: 14, delay: 0.1 }}>
          <SnackPack name="Sea Salt Chips" color="sky" chipColor="#F5DC85" category="potato-chips" />
        </motion.div>
        <p className="auth-tag">SNACK GOOD · DO GOOD</p>
      </div>
      <div className="auth-form-wrap">
        <motion.form onSubmit={submit} className="auth-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Wordmark size={36} />
          <h1>{isLogin ? 'Welcome back' : 'Join the crunch club'}</h1>
          <p className="muted">{isLogin ? 'Log in to track orders and check out faster.' : 'Create an account. It takes about ten seconds.'}</p>
          {!isLogin && <div className="form-group"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={set('name')} required /></div>}
          <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" value={form.email} onChange={set('email')} required autoComplete="email" /></div>
          {!isLogin && <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={set('phone')} inputMode="tel" /></div>}
          <div className="form-group"><label className="form-label">Password</label><input className="form-control" type="password" value={form.password} onChange={set('password')} required minLength={6} autoComplete={isLogin ? 'current-password' : 'new-password'} /></div>
          <button className="btn btn-pink btn-lg btn-block" disabled={busy}>{busy ? '…' : isLogin ? 'Log in' : 'Create account'}</button>
          <p style={{ textAlign: 'center', marginTop: 18 }}>
            {isLogin ? <>New here? <Link to="/register" className="text-pink"><strong>Create an account</strong></Link></> : <>Already snacking with us? <Link to="/login" className="text-pink"><strong>Log in</strong></Link></>}
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Auth;
