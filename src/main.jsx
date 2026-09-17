import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Admin from './pages/Admin.jsx';

const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin';

createRoot(document.getElementById('root')).render(isAdminRoute ? <Admin /> : <App />);
