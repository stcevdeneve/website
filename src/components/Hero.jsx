import React from 'react';
import { c, btnPrimary, btnGhost } from '../styles';

export default function Hero({ hero }) {
  return (
    <section id="anasayfa" style={{
      maxWidth: 1200, margin: '0 auto',
      padding: 'clamp(32px,6vw,72px) 20px clamp(20px,3vw,32px)',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 'clamp(28px,4vw,56px)', alignItems: 'center'
    }}>
      <div data-reveal>
        <span style={{
          display: 'inline-flex', alignItems: 'flex-start', gap: 8, padding: '7px 13px',
          borderRadius: 16, background: 'rgba(232,122,0,0.12)', color: '#B85E00',
          fontSize: 12.5, fontWeight: 600, lineHeight: 1.5
        }}>
          <span style={{ flex: 'none', width: 6, height: 6, borderRadius: 99, background: c.orange, display: 'block', marginTop: 6 }} />
          {hero.badge}
        </span>

        <h1 style={{
          margin: '20px 0 0', fontSize: 'clamp(38px,6.2vw,68px)', lineHeight: 1.02,
          letterSpacing: '-0.035em', fontWeight: 700, color: c.ink, textWrap: 'balance'
        }}>
          {hero.titleLine1}<br />{hero.titleLine2}{' '}
          <span style={{ color: c.brown }}>{hero.titleAccent}</span>
        </h1>

        <p style={{ margin: '22px 0 0', maxWidth: '52ch', fontSize: 'clamp(16px,1.6vw,18.5px)', lineHeight: 1.65, color: '#5C4636', textWrap: 'pretty' }}>
          {hero.body}
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
          <a href="#hesapla" style={{ ...btnPrimary, color: '#fff' }}>{hero.primaryCta}</a>
          <a href="#randevu" style={btnGhost}>{hero.secondaryCta}</a>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 18,
          marginTop: 44, paddingTop: 28, borderTop: '1px solid rgba(160,105,72,0.18)'
        }}>
          {(hero.stats || []).map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 26, fontWeight: 700, color: c.ink, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#7A6252', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative' }} data-reveal>
        <div style={{ borderRadius: 26, overflow: 'hidden', background: '#E3DCD1', aspectRatio: '4 / 3.4', border: '1px solid rgba(160,105,72,0.18)' }}>
          <img src={hero.imageUrl} alt="STC Evden Eve nakliye ekibi" loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{
          position: 'absolute', left: -8, bottom: -18, background: '#fff',
          border: '1px solid rgba(160,105,72,0.16)', borderRadius: 18, padding: '16px 18px',
          boxShadow: '0 18px 40px rgba(42,29,20,0.12)', display: 'flex', alignItems: 'center', gap: 14
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(232,122,0,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: c.orange, fontWeight: 700 }}>✓</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{hero.badgeCardTitle}</div>
            <div style={{ fontSize: 12.5, color: '#7A6252', marginTop: 2 }}>{hero.badgeCardBody}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
