import React, { useMemo, useState } from 'react';
import { c, kicker, h2, lead, field, mono } from '../styles';

const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const WEEKDAYS = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
const SLOTS = ['09:00','10:30','12:00','13:30','15:00','16:30','18:00','19:30'];

/**
 * Seçilen gün + saati Google Randevu Sayfası linkine parametre olarak ekler.
 * Google, ?date=YYYYMMDD ve ?time=HH:MM parametrelerini okuyup ilgili slotu açar.
 */
function bookingHref(baseUrl, date, slot) {
  const url = baseUrl || import.meta.env.VITE_GOOGLE_BOOKING_URL || '';
  if (!url || !date || !slot) return url || '#randevu';
  const [y, m, d] = date;
  const pad = n => String(n).padStart(2, '0');
  const qs = new URLSearchParams({ date: `${y}${pad(m)}${pad(d)}`, time: slot });
  return url + (url.includes('?') ? '&' : '?') + qs.toString();
}

export default function Appointment({ site }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState(null);   // [y, m, d]
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const grid = useMemo(() => {
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = base.getFullYear(), month = base.getMonth();
    const firstCol = (new Date(year, month, 1).getDay() + 6) % 7;
    const count = new Date(year, month + 1, 0).getDate();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cells = Array.from({ length: firstCol }, () => null);
    for (let d = 1; d <= count; d++) {
      const date = new Date(year, month, d);
      cells.push({ d, disabled: date < today || date.getDay() === 0, key: [year, month + 1, d] });
    }
    return { year, month, cells };
  }, [monthOffset]);

  const isSel = key => selected && key.join('-') === selected.join('-');
  const href = bookingHref(site.bookingUrl, selected, slot);
  const ready = selected && slot;

  return (
    <section id="randevu" style={{ background: c.bgAlt, borderTop: '1px solid ' + c.line, borderBottom: '1px solid ' + c.line }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,72px) 20px' }}>
        <div data-reveal>
          <span style={kicker}>02 — Randevu</span>
          <h2 style={h2}>Keşif randevusu</h2>
          <p style={{ ...lead, marginBottom: 26 }}>Takvimden uygun günü ve saati seçin. Onay maili Google Takvim üzerinden gönderilir.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid ' + c.line, borderRadius: 24, padding: 'clamp(20px,3vw,28px)' }} data-reveal>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <NavBtn onClick={() => setMonthOffset(o => Math.max(0, o - 1))}>‹</NavBtn>
              <div style={{ fontSize: 16, fontWeight: 650, letterSpacing: '-0.01em' }}>{MONTHS[grid.month]} {grid.year}</div>
              <NavBtn onClick={() => setMonthOffset(o => Math.min(6, o + 1))}>›</NavBtn>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 8 }}>
              {WEEKDAYS.map(w => (
                <div key={w} style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: '#9C8877' }}>{w}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
              {grid.cells.map((cell, i) => {
                if (!cell) return <span key={'e' + i} />;
                const on = isSel(cell.key);
                return (
                  <button key={cell.d} disabled={cell.disabled}
                    onClick={() => { setSelected(cell.key); setSlot(null); }}
                    style={{
                      aspectRatio: '1', borderRadius: 12,
                      border: '1px solid ' + (on ? c.orange : cell.disabled ? 'transparent' : 'rgba(160,105,72,0.20)'),
                      background: on ? c.orange : cell.disabled ? 'transparent' : c.field,
                      color: on ? '#fff' : cell.disabled ? '#C3B7A9' : c.ink,
                      fontSize: 14, fontWeight: on ? 700 : 500,
                      cursor: cell.disabled ? 'not-allowed' : 'pointer'
                    }}>{cell.d}</button>
                );
              })}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid ' + c.line, borderRadius: 24, padding: 'clamp(20px,3vw,28px)' }} data-reveal>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: c.ink70 }}>Uygun saatler</div>
            <div style={{ fontSize: 13, color: '#7A6252', marginTop: 4 }}>
              {selected ? `${selected[2]} ${MONTHS[selected[1] - 1]} ${selected[0]}` : 'Önce takvimden bir gün seçin'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(94px,1fr))', gap: 9, marginTop: 16 }}>
              {SLOTS.map(t => {
                const on = slot === t;
                return (
                  <button key={t} disabled={!selected} onClick={() => setSlot(t)} style={{
                    padding: '11px 6px', borderRadius: 12, fontSize: 14, fontWeight: 550,
                    cursor: selected ? 'pointer' : 'not-allowed',
                    border: '1px solid ' + (on ? c.ink : 'rgba(160,105,72,0.22)'),
                    background: on ? c.ink : c.field,
                    color: on ? '#fff' : selected ? c.ink : '#B6A897'
                  }}>{t}</button>
                );
              })}
            </div>

            <div style={{ height: 1, background: c.line, margin: '22px 0' }} />

            <div style={{ display: 'grid', gap: 10 }}>
              <input placeholder="Ad Soyad" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} style={{ ...field, padding: '12px 13px' }} />
              <input placeholder="Telefon" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} style={{ ...field, padding: '12px 13px' }} />
              <input placeholder="Taşınacak adres (ilçe / mahalle)" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} style={{ ...field, padding: '12px 13px' }} />
            </div>

            <a href={href} target="_blank" rel="noopener noreferrer"
              aria-disabled={!ready}
              style={{
                display: 'block', textAlign: 'center', marginTop: 16, padding: 14, borderRadius: 14,
                background: ready ? c.brown : 'rgba(160,105,72,0.35)', color: '#fff',
                fontSize: 15, fontWeight: 600,
                pointerEvents: ready ? 'auto' : 'none'
              }}>
              {ready ? 'Randevuyu onayla · ' + slot : 'Gün ve saat seçin'}
            </a>

            <p style={{ margin: '12px 0 0', fontSize: 12, lineHeight: 1.55, color: '#8A7461', fontFamily: mono }}>
              Seçilen gün ve saat Google Randevu Sayfası bağlantısına parametre olarak iletilir.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const NavBtn = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    width: 36, height: 36, borderRadius: 11, border: '1px solid rgba(160,105,72,0.25)',
    background: c.field, cursor: 'pointer', fontSize: 16, color: c.ink70
  }}>{children}</button>
);
