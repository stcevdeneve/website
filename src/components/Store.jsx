import React, { useState } from 'react';
import { c, h2, lead, field, fmtTRY } from '../styles';

const stockOf = p => (p.stock == null || p.stock === '' ? Infinity : Math.max(0, Number(p.stock) || 0));

function deliveryLabel(fee, freeOver) {
  if (!fee) return 'Ücretsiz';
  const base = fmtTRY(fee, false);
  return freeOver > 0 ? `${base} · ${fmtTRY(freeOver, false)} üzeri ücretsiz` : base;
}

export default function Store({ products, site, isMobile }) {
  const [qty, setQty] = useState({});
  const [delivery, setDelivery] = useState('pickup'); // pickup | home
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const bump = (p, n) => setQty(q => ({ ...q, [p.id]: Math.min(stockOf(p), Math.max(0, (q[p.id] || 0) + n)) }));
  const setExact = (p, v) => setQty(q => ({ ...q, [p.id]: Math.min(stockOf(p), Math.max(0, parseInt(v, 10) || 0)) }));

  const lines = products.filter(p => (qty[p.id] || 0) > 0).map(p => ({ p, n: qty[p.id] }));
  const subtotal = lines.reduce((t, { p, n }) => t + Number(p.price) * n, 0);
  const fee = Number(site.storeDeliveryFee) || 0;
  const freeOver = Number(site.storeFreeDeliveryOver) || 0;
  const deliveryCost = delivery === 'home' && subtotal > 0 && !(freeOver > 0 && subtotal >= freeOver) ? fee : 0;
  const total = subtotal + deliveryCost;
  const canOrder = lines.length > 0 && (delivery === 'pickup' || address.trim());

  function orderLink() {
    const list = lines.map(({ p, n }) => `• ${n} adet ${p.name} (${fmtTRY(Number(p.price) * n, false)})`).join('\n');
    const msg = [
      'Merhaba, kutu & malzeme siparişi vermek istiyorum:',
      '',
      list,
      '',
      `Ürün toplamı: ${fmtTRY(subtotal, false)}`,
      delivery === 'home'
        ? `Teslimat: Adresime getirin (${deliveryCost ? fmtTRY(deliveryCost, false) : 'ücretsiz'})\nAdres: ${address.trim()}`
        : 'Teslimat: Depodan teslim alacağım',
      `Genel toplam: ${fmtTRY(total, false)}`,
      name.trim() ? `\nAd Soyad: ${name.trim()}` : ''
    ].join('\n').trim();
    return `https://wa.me/${String(site.whatsapp || site.phone).replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <section id="kutu" style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(28px,4vw,44px) 20px' }}>
      <div data-reveal>
        <h2 style={h2}>Kutu &amp; ambalaj malzemeleri</h2>
        <p style={{ ...lead, marginBottom: 26 }}>Kendiniz paketlemek isterseniz depomuzdan teslim alabilir veya adresinize gönderebiliriz.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(230px,1fr))', gap: isMobile ? 10 : 16 }}>
        {products.map((p, i) => {
          const stock = stockOf(p);
          const n = qty[p.id] || 0;
          const out = stock === 0;
          const low = stock !== Infinity && stock > 0 && stock <= 10;
          const atMax = n >= stock;

          return (
            <div key={p.id} data-reveal data-reveal-delay={i * 60} style={{
              background: '#fff', border: '1px solid ' + c.line, borderRadius: isMobile ? 18 : 20, padding: isMobile ? 12 : 18,
              display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 12 : 0, opacity: out ? 0.6 : 1
            }}>
              <div style={isMobile
                ? { width: 92, height: 92, flex: 'none', borderRadius: 12, overflow: 'hidden', background: '#E3DCD1' }
                : { borderRadius: 14, aspectRatio: '4 / 3', overflow: 'hidden', background: '#E3DCD1' }}>
                <img src={p.imageUrl} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 15.5, fontWeight: 650, marginTop: isMobile ? 0 : 14, letterSpacing: '-0.01em' }}>{p.name}</div>
                <div style={{ fontSize: 13, color: '#7A6252', marginTop: 3, lineHeight: 1.45 }}>{p.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 'auto', paddingTop: isMobile ? 8 : 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: c.ink }}>{fmtTRY(Number(p.price), false)}</div>
                    {out && <span style={{ fontSize: 12, fontWeight: 600, color: '#B0413E' }}>Tükendi</span>}
                    {low && <span style={{ fontSize: 12, fontWeight: 600, color: c.orangeDark }}>Son {stock} adet</span>}
                  </div>
                  {!out && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F4F1EB', borderRadius: 999, padding: 4 }}>
                      <button onClick={() => bump(p, -1)} disabled={n === 0} aria-label="Azalt" style={{
                        width: 28, height: 28, borderRadius: 999, border: 'none', background: '#fff',
                        cursor: n === 0 ? 'default' : 'pointer', fontSize: 15, color: c.ink70, opacity: n === 0 ? 0.5 : 1
                      }}>−</button>
                      <input value={n} inputMode="numeric" onChange={e => setExact(p, e.target.value)} aria-label={p.name + ' adet'}
                        style={{ width: 34, textAlign: 'center', border: 'none', background: 'transparent', fontSize: 14, fontWeight: 600, color: c.ink, padding: 0 }} />
                      <button onClick={() => bump(p, 1)} disabled={atMax} aria-label="Arttır" style={{
                        width: 28, height: 28, borderRadius: 999, border: 'none', background: atMax ? '#D9CFC3' : c.orange,
                        color: '#fff', cursor: atMax ? 'default' : 'pointer', fontSize: 15
                      }}>+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18, background: '#fff', border: '1px solid ' + c.line, borderRadius: 20, padding: 'clamp(16px,3vw,24px)' }} data-reveal>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: c.ink70, marginBottom: 10 }}>Teslimat</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
          {[
            ['pickup', 'Depodan teslim al', 'Ücretsiz · ' + site.addressLine2],
            ['home', 'Adresime getirin', deliveryLabel(fee, freeOver)]
          ].map(([key, title, note]) => {
            const on = delivery === key;
            return (
              <button key={key} onClick={() => setDelivery(key)} style={{
                textAlign: 'left', padding: '13px 15px', borderRadius: 14, cursor: 'pointer',
                border: '1px solid ' + (on ? c.orange : 'rgba(160,105,72,0.22)'),
                background: on ? 'rgba(232,122,0,0.10)' : c.field, display: 'flex', flexDirection: 'column', gap: 3
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{title}</span>
                <span style={{ fontSize: 12.5, color: '#7A6252' }}>{note}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginTop: 12 }}>
          <input placeholder="Ad Soyad (isteğe bağlı)" value={name} onChange={e => setName(e.target.value)} style={{ ...field, padding: '12px 13px' }} />
          {delivery === 'home' && (
            <input placeholder="Teslimat adresi" value={address} onChange={e => setAddress(e.target.value)} style={{ ...field, padding: '12px 13px' }} />
          )}
        </div>

        <div style={{ height: 1, background: c.line, margin: '18px 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 13, color: '#7A6252' }}>
              {lines.length
                ? `Ürünler ${fmtTRY(subtotal, false)}` + (delivery === 'home' ? ` · Teslimat ${deliveryCost ? fmtTRY(deliveryCost, false) : 'ücretsiz'}` : '')
                : 'Sepet toplamı'}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>{fmtTRY(total, false)}</div>
          </div>
          <a href={canOrder ? orderLink() : undefined} target="_blank" rel="noopener noreferrer"
            aria-disabled={!canOrder}
            onClick={e => { if (!canOrder) e.preventDefault(); }}
            style={{
              padding: '14px 22px', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 600,
              background: canOrder ? '#1FA855' : 'rgba(160,105,72,0.35)', cursor: canOrder ? 'pointer' : 'not-allowed',
              flex: isMobile ? '1 1 100%' : 'none', textAlign: 'center'
            }}>
            {!lines.length ? 'Ürün seçin' : delivery === 'home' && !address.trim() ? 'Adresinizi yazın' : "WhatsApp'tan sipariş ver"}
          </a>
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 12.5, color: '#8A7461', lineHeight: 1.55 }}>
          Sipariş WhatsApp mesajı olarak bize ulaşır; ödeme teslimatta yapılır.
        </p>
      </div>
    </section>
  );
}
