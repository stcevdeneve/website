import React from 'react';
import { c, card } from '../styles';

const ICONS = {
  home: <><path d="M3 11.2 12 4l9 7.2" /><path d="M5.4 9.6V20h13.2V9.6" /><path d="M9.6 20v-5.6h4.8V20" /></>,
  lift: <><path d="M5 21V5.5A1.5 1.5 0 0 1 6.5 4h5A1.5 1.5 0 0 1 13 5.5V21" /><path d="M3.4 21h11.2" /><path d="M17.6 21V9.4" /><path d="M17.6 9.4 20.6 6.4" /><path d="M17.6 9.4 14.6 6.4" /><path d="M16 14.2h3.2" /></>,
  box: <><path d="M3.2 7.6 12 3.4l8.8 4.2v8.8L12 20.6 3.2 16.4z" /><path d="M3.2 7.6 12 11.8l8.8-4.2" /><path d="M12 11.8v8.8" /></>,
  office: <><path d="M3.4 20.6h17.2" /><path d="M5.6 20.6V4.6h8.2v16" /><path d="M13.8 9.6h4.6v11" /><path d="M8.2 8.2h3" /><path d="M8.2 12.2h3" /><path d="M8.2 16.2h3" /></>
};

export default function Services({ services, isMobile }) {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(28px,4vw,44px) 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(230px,1fr))', gap: isMobile ? 10 : 16 }}>
        {services.map((s, i) => {
          const orange = s.accent === 'orange';
          return (
            <div key={s.id || s.title} style={isMobile ? { ...card, padding: 16, display: 'flex', alignItems: 'center', gap: 14 } : card} data-reveal data-reveal-delay={i * 70}>
              <div style={{
                width: 44, height: 44, borderRadius: 13, flex: 'none',
                background: orange ? 'rgba(232,122,0,0.16)' : 'rgba(160,105,72,0.12)',
                color: orange ? c.orangeDark : c.brown,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {ICONS[s.icon] || ICONS.box}
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: isMobile ? '0 0 3px' : '18px 0 6px', fontSize: 16.5, fontWeight: 650, letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: c.ink55 }}>{s.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
