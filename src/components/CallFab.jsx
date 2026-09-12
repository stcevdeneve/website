import React from 'react';
import { c } from '../styles';

/** Mobilde sağ altta sabit duran telefon butonu. */
export default function CallFab({ site, isMobile }) {
  return (
    <a href={'tel:' + site.phone} aria-label="Hemen ara" style={{
      display: isMobile ? 'flex' : 'none',
      position: 'fixed', right: 18, bottom: 18, zIndex: 60,
      width: 58, height: 58, borderRadius: 999, background: c.orange, color: '#fff',
      alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 12px 30px rgba(232,122,0,0.40)'
    }}>
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6.6 2.5h-2A2.1 2.1 0 0 0 2.5 4.8a19.6 19.6 0 0 0 3 8.1 19.4 19.4 0 0 0 6 6 19.6 19.6 0 0 0 8.1 3 2.1 2.1 0 0 0 2.3-2.1v-2a1.9 1.9 0 0 0-1.6-1.9c-.9-.1-1.8-.4-2.6-.7a1.9 1.9 0 0 0-2 .4l-.9.9a15.6 15.6 0 0 1-5.7-5.7l.9-.9a1.9 1.9 0 0 0 .4-2c-.3-.8-.6-1.7-.7-2.6a1.9 1.9 0 0 0-1.9-1.6z" />
      </svg>
    </a>
  );
}
