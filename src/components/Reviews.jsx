import React from 'react';
import { c, kicker, h2, lead, mono } from '../styles';

const Star = ({ on, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5-5.8-3.05-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z"
      fill={on ? c.orange : '#E0D8CC'} />
  </svg>
);

export default function Reviews({ reviews, rating, site }) {
  const shown = reviews;
  const bars = [5, 4, 3, 2, 1];
  const total = rating.count || 1;

  if (!reviews || reviews.length === 0) {
    return (
      <section id="yorumlar" style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,72px) 20px' }}>
        <div data-reveal style={{
          background: '#fff', border: '1px solid ' + c.line, borderRadius: 28,
          padding: 'clamp(32px,6vw,64px) clamp(20px,4vw,48px)', textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(i => <Star key={i} on={false} size={30} />)}
          </div>
          <h2 style={{ ...h2, marginTop: 22 }}>İlk yorumu siz yazın</h2>
          <p style={{ ...lead, margin: '12px auto 0', textAlign: 'center' }}>
            Taşınma deneyiminizi Google'da paylaşın; sonraki müşterilerimize yol gösterin.
          </p>
          <a href={site.reviewLink} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block', marginTop: 26, padding: '14px 28px', borderRadius: 14,
            background: c.orange, color: '#fff', fontSize: 15, fontWeight: 600,
            boxShadow: '0 10px 24px rgba(232,122,0,0.28)'
          }}>Google'da yorum yaz</a>
        </div>
      </section>
    );
  }

  return (
    <section id="yorumlar" style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,72px) 20px' }}>
      <div data-reveal>
        <h2 style={h2}>Google yorumları</h2>
        <p style={{ ...lead, marginBottom: 26 }}>Müşterilerimizin Google İşletme Profilimizde bıraktığı yorumlar.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid ' + c.line, borderRadius: 24, padding: 'clamp(22px,3vw,30px)' }} data-reveal>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{ fontSize: 'clamp(44px,6vw,60px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {String(rating.avg).replace('.', ',')}
            </div>
            <div style={{ fontSize: 15, color: '#7A6252' }}>/ 5</div>
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 12 }}>
            {[1,2,3,4,5].map(i => <Star key={i} on={i <= Math.round(rating.avg)} size={20} />)}
          </div>
          <div style={{ fontSize: 14, color: c.ink55, marginTop: 12 }}>{rating.count} Google değerlendirmesi</div>

          <div style={{ height: 1, background: c.line, margin: '22px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {bars.map(st => {
              const n = (rating.bars && rating.bars[st]) || 0;
              return (
                <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12.5, color: '#7A6252', width: 10, fontFamily: mono }}>{st}</span>
                  <span style={{ flex: 1, height: 7, borderRadius: 99, background: c.bg, overflow: 'hidden', display: 'block' }}>
                    <span style={{ display: 'block', height: '100%', borderRadius: 99, background: c.orange, width: Math.round((n / total) * 100) + '%' }} />
                  </span>
                  <span style={{ fontSize: 12, color: '#8A7461', width: 34, textAlign: 'right', fontFamily: mono }}>{n}</span>
                </div>
              );
            })}
          </div>

          <a href={site.reviewLink} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', textAlign: 'center', marginTop: 24, padding: 13, borderRadius: 13,
            border: '1px solid rgba(160,105,72,0.3)', color: c.ink70, fontSize: 14.5, fontWeight: 600
          }}>Google'da yorum bırak</a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {shown.map((r, i) => (
            <div key={r.id || r.name} style={{ background: '#fff', border: '1px solid ' + c.line, borderRadius: 20, padding: 22 }} data-reveal data-reveal-delay={i * 70}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 42, height: 42, borderRadius: 999, overflow: 'hidden', flex: 'none', background: '#E3DCD1' }}>
                  <img src={r.avatarUrl} alt={r.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 650, letterSpacing: '-0.01em' }}>{r.name}</div>
                  <div style={{ fontSize: 12.5, color: '#8A7461', marginTop: 2 }}>{r.when} · Google</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 2, flex: 'none' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} on={s <= r.stars} />)}
                </div>
              </div>
              <p style={{ margin: '14px 0 0', fontSize: 14.5, lineHeight: 1.65, color: c.ink70, textWrap: 'pretty' }}>{r.text}</p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
