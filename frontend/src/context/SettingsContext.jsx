import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const reload = () => api.get('/api/settings').then(({ data }) => setSettings(data)).catch(() => {});
  useEffect(() => { reload(); }, []);
  return <SettingsContext.Provider value={{ ...settings, reloadSettings: reload }}>{children}</SettingsContext.Provider>;
};
