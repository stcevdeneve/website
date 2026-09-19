import React, { useState } from 'react';
import { c, kicker, h2, lead, fmtTRY } from '../styles';

export default function Store({ products }) {
  const [qty, setQty] = useState({});
  const bump = (k, n) => setQty(q => ({ ...q, [k]: Math.max(0, (q[k] || 0) + n) }));
  const total = products.reduce((t, p) => t + p.price * (qty[p.id] || 0), 0);

  return (
    <section id="kutu" style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,72px) 20px' }}>
      <div data-reveal>
        <h2 style={h2}>Kutu &amp; ambalaj malzemeleri</h2>
        <p style={{ ...lead, marginBottom: 26 }}>Kendiniz paketlemek isterseniz depomuzdan teslim alabilir veya adresinize gönderebiliriz.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>
        {products.map((p, i) => (
          <div key={p.id} style={{ background: '#fff', border: '1px solid ' + c.line, borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column' }}
            data-reveal data-reveal-delay={i * 60}>
            <div style={{ borderRadius: 14, aspectRatio: '4 / 3', overflow: 'hidden', background: '#E3DCD1' }}>
              <img src={p.imageUrl} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ fontSize: 15.5, fontWeight: 650, marginTop: 14, letterSpacing: '-0.01em' }}>{p.name}</div>
            <div style={{ fontSize: 13, color: '#7A6252', marginTop: 4, lineHeight: 1.5 }}>{p.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 16 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: c.ink }}>{fmtTRY(p.price, false)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F4F1EB', borderRadius: 999, padding: 4 }}>
                <button onClick={() => bump(p.id, -1)} aria-label="Azalt" style={{
                  width: 28, height: 28, borderRadius: 999, border: 'none', background: '#fff',
                  cursor: 'pointer', fontSize: 15, color: c.ink70
                }}>−</button>
                <span style={{ minWidth: 18, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{qty[p.id] || 0}</span>
                <button onClick={() => bump(p.id, 1)} aria-label="Arttır" style={{
                  width: 28, height: 28, borderRadius: 999, border: 'none', background: c.orange,
                  color: '#fff', cursor: 'pointer', fontSize: 15
                }}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 18, background: '#fff', border: '1px solid ' + c.line, borderRadius: 20,
        padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 18, flexWrap: 'wrap'
      }} data-reveal>
        <div>
          <div style={{ fontSize: 13, color: '#7A6252' }}>Sepet toplamı</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>{fmtTRY(total, false)}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="#iletisim" style={{ padding: '13px 20px', borderRadius: 13, border: '1px solid rgba(160,105,72,0.3)', color: c.ink70, fontSize: 14.5, fontWeight: 600 }}>Depodan teslim al</a>
          <a href="#iletisim" style={{ padding: '13px 20px', borderRadius: 13, background: c.orange, color: '#fff', fontSize: 14.5, fontWeight: 600 }}>Siparişi tamamla</a>
        </div>
      </div>
    </section>
  );
}
