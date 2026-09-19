import React from 'react';
import { c } from '../styles';

export default function Footer({ site }) {
  return (
    <footer style={{ background: c.ink, color: '#C0AC9B' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 28 }}>
        <div>
          <img src="/logo.svg" alt="STC Evden Eve" style={{ height: 84, width: 'auto', display: 'block' }} />
          <p style={{ margin: '16px 0 0', fontSize: 14, lineHeight: 1.65, maxWidth: '34ch' }}>{site.footerNote}</p>
        </div>

        <div>
          <Head>Hizmetler</Head>
          <Col>
            <a href="#hesapla" style={link}>Fiyat hesaplama</a>
            <a href="#randevu" style={link}>Randevu al</a>
            <a href="#harita" style={link}>Hizmet bölgeleri</a>
            <a href="#yorumlar" style={link}>Google yorumları</a>
            <a href="#kutu" style={link}>Kutu &amp; ambalaj</a>
          </Col>
        </div>

        <div>
          <Head>İletişim</Head>
          <Col>
            <a href={'tel:' + site.phone} style={link}>{site.phoneDisplay}</a>
            <a href={'mailto:' + site.email} style={link}>{site.email}</a>
            <span>{site.addressLine2}</span>
          </Col>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 20px 34px', borderTop: '1px solid rgba(239,236,230,0.12)', fontSize: 12.5, color: '#8A7461' }}>
        {site.copyright}
      </div>
    </footer>
  );
}

const link = { color: '#C0AC9B' };
const Head = ({ children }) => (
  <div style={{ fontSize: 13, fontWeight: 600, color: c.bg, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{children}</div>
);
const Col = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14, fontSize: 14 }}>{children}</div>
);
