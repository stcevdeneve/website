import React from 'react';
import { c, kicker, h2 } from '../styles';

export default function Contact({ site }) {
  const mapSrc = 'https://maps.google.com/maps?q=' + encodeURIComponent(site.mapsQuery) + '&z=14&output=embed';

  return (
    <section id="iletisim" style={{ background: c.bgAlt, borderTop: '1px solid ' + c.line }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,72px) 20px' }}>
        <div data-reveal>
          <h2 style={h2}>Dükkân &amp; kutu teslim noktası</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginTop: 26, alignItems: 'stretch' }}>
          <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(160,105,72,0.16)', minHeight: 340, background: '#DBD3C6' }} data-reveal>
            <iframe src={mapSrc} title="STC Evden Eve konum" loading="lazy"
              style={{ width: '100%', height: '100%', minHeight: 340, border: 0, display: 'block' }} />
          </div>

          <div style={{
            background: '#fff', border: '1px solid ' + c.line, borderRadius: 24,
            padding: 'clamp(22px,3vw,30px)', display: 'flex', flexDirection: 'column', gap: 18
          }} data-reveal>
            <Block title="Adres">
              {site.addressLine1}<br />{site.addressLine2}
            </Block>
            <Block title="Çalışma saatleri">
              {site.hoursWeekday}<br />{site.hoursSunday}
            </Block>
            <Block title="İletişim">
              <a href={'tel:' + site.phone}>{site.phoneDisplay}</a><br />
              <a href={'mailto:' + site.email}>{site.email}</a>
            </Block>
            <a href={site.mapsLink} target="_blank" rel="noopener noreferrer" style={{
              marginTop: 'auto', textAlign: 'center', padding: 13, borderRadius: 13,
              background: c.brown, color: '#fff', fontSize: 14.5, fontWeight: 600
            }}>Yol tarifi al</a>
          </div>
        </div>
      </div>
    </section>
  );
}

const Block = ({ title, children }) => (
  <div>
    <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.brown }}>{title}</div>
    <div style={{ fontSize: 15, lineHeight: 1.7, marginTop: 6, color: c.ink70 }}>{children}</div>
  </div>
);
