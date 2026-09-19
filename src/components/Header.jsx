import React, { useState } from 'react';
import { c } from '../styles';

const LINKS = [
  ['#hesapla', 'Fiyat Hesapla'],
  ['#randevu', 'Randevu'],
  ['#yorumlar', 'Yorumlar'],
  ['#harita', 'Hizmet Bölgeleri'],
  ['#kutu', 'Kutu & Malzeme'],
  ['#sss', 'S.S.S.'],
  ['#iletisim', 'İletişim']
];

export default function Header({ site, isMobile }) {
  const [open, setOpen] = useState(false);
  const isOpen = isMobile && open;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(14px)', background: 'rgba(239,236,230,0.82)',
      borderBottom: '1px solid rgba(160,105,72,0.16)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <a href="#anasayfa" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.svg" alt="STC Evden Eve" style={{ height: 60, width: 'auto', display: 'block' }} />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: c.ink }}>STC</span>
            <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.brown, marginTop: 4 }}>Evden Eve</span>
          </span>
        </a>

        <nav style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} style={{ padding: '8px 12px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: c.ink70 }}>{label}</a>
          ))}
          <a href={'tel:' + site.phone} style={{
            marginLeft: 6, padding: '9px 16px', borderRadius: 12, background: c.orange,
            color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 6px 16px rgba(232,122,0,0.28)'
          }}>{site.phoneDisplay}</a>
        </nav>

        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Menü"
          aria-expanded={isOpen}
          style={{
            display: isMobile ? 'flex' : 'none', marginLeft: 'auto',
            width: 44, height: 44, borderRadius: 13, border: '1px solid ' + c.lineStrong,
            background: c.field, cursor: 'pointer', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5
          }}>
          <Bar style={{ transform: isOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <Bar style={{ opacity: isOpen ? 0 : 1 }} />
          <Bar style={{ transform: isOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      <div style={{
        overflow: 'hidden', transition: 'max-height .28s ease',
        maxHeight: isOpen ? 460 : 0,
        borderTop: '1px solid ' + (isOpen ? 'rgba(160,105,72,0.16)' : 'transparent')
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 20px 18px', gap: 2 }}>
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
              style={{ padding: '13px 12px', borderRadius: 12, fontSize: 16, fontWeight: 550, color: c.ink }}>{label}</a>
          ))}
        </div>
      </div>
    </header>
  );
}

const Bar = ({ style }) => (
  <span style={{
    display: 'block', width: 18, height: 2, borderRadius: 2, background: c.ink70,
    transition: 'transform .22s, opacity .18s', ...style
  }} />
);
