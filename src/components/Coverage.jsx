import React from 'react';
import { c, kicker, h2, lead, mono } from '../styles';
import TurkeyMap from './TurkeyMap';

export default function Coverage({ provinces, isMobile }) {
  const total = provinces.reduce((t, p) => t + (p.tasima || 0), 0);

  return (
    <section id="harita" style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,72px) 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 24 }} data-reveal>
        <div>
          <span style={kicker}>04 — Kapsama</span>
          <h2 style={h2}>Gittiğimiz iller</h2>
          <p style={lead}>Her işaret, ekibimizin taşıma tamamladığı bir ili gösterir. Turuncu işaret merkez depomuzdur.</p>
        </div>
        {isMobile && (
          <div style={{ fontFamily: mono, fontSize: 12, color: '#8A7461', maxWidth: '34ch', lineHeight: 1.6 }}>
            İl adını ve taşıma sayısını görmek için haritada bir ile dokunun.
          </div>
        )}
      </div>

      <div style={{
        borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(160,105,72,0.16)',
        background: '#fff', height: 'clamp(230px,52vw,620px)'
      }} data-reveal>
        <TurkeyMap provinces={provinces} isMobile={isMobile} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginTop: 14, fontFamily: mono, fontSize: 11.5, color: '#7A6252' }}>
        <Legend color={c.orange}>Merkez depo</Legend>
        <Legend color="#C99B7A">Hizmet verilen il</Legend>
        <Legend color="#E3DCD1">Talep üzerine</Legend>
        <span>{provinces.length} il · {total.toLocaleString('tr-TR')} taşıma</span>
      </div>
    </section>
  );
}

const Legend = ({ color, children }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <i style={{ width: 12, height: 12, borderRadius: 4, background: color, display: 'block' }} />
    {children}
  </span>
);
