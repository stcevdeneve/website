import React, { useEffect, useMemo, useState } from 'react';
import { c, kicker, h2, lead, field, mono } from '../styles';

const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const SLOT_LABELS = { '07:00': 'Öğleden önce', '12:00': 'Öğleden sonra' };
const WEEKDAYS = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];

function toDateStr(key) {
  const [y, m, d] = key;
  const pad = n => String(n).padStart(2, '0');
  return `${y}-${pad(m)}-${pad(d)}`;
}

export default function Appointment({ site }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState(null);   // [y, m, d]
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const [availability, setAvailability] = useState(null); // { dayClosed, slots: [{time, available}] }
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  const [closedDates, setClosedDates] = useState(new Set());

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/booking/closed-days?year=${grid.year}&month=${grid.month + 1}`)
      .then(r => r.json())
      .then(data => { if (!cancelled) setClosedDates(new Set(data.closedDates || [])); })
      .catch(() => { if (!cancelled) setClosedDates(new Set()); });
    return () => { cancelled = true; };
  }, [grid.year, grid.month]);

  useEffect(() => {
    if (!selected) { setAvailability(null); return; }
    let cancelled = false;
    setLoadingAvailability(true);
    setAvailabilityError(null);
    setSlot(null);
    fetch(`/api/booking/availability?date=${toDateStr(selected)}`)
      .then(r => r.json())
      .then(data => { if (!cancelled) setAvailability(data); })
      .catch(() => { if (!cancelled) setAvailabilityError('Uygunluk bilgisi alınamadı, tekrar deneyin.'); })
      .finally(() => { if (!cancelled) setLoadingAvailability(false); });
    return () => { cancelled = true; };
  }, [selected]);

  const isSel = key => selected && key.join('-') === selected.join('-');
  const ready = selected && slot && !submitting;

  async function handleSubmit() {
    if (!ready) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: toDateStr(selected), slot, ...form })
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Randevu oluşturulamadı, tekrar deneyin.');
        if (res.status === 409) {
          setAvailability(a => a && { ...a, slots: a.slots.map(s => s.time === slot ? { ...s, available: false } : s) });
          setSlot(null);
        }
        return;
      }
      setSuccess({ date: toDateStr(selected), slot });
    } catch {
      setSubmitError('Bağlantı hatası, tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section id="randevu" style={{ background: c.bgAlt, borderTop: '1px solid ' + c.line, borderBottom: '1px solid ' + c.line }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(28px,4vw,44px) 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
          <h2 style={h2}>Randevunuz alındı</h2>
          <p style={{ ...lead, marginTop: 10 }}>
            {selected[2]} {MONTHS[selected[1] - 1]} {selected[0]} · {SLOT_LABELS[success.slot] || success.slot} için randevunuz oluşturuldu. Ekibimiz onay için sizinle iletişime geçecek.
          </p>
          <button onClick={() => { setSuccess(null); setSelected(null); setSlot(null); setForm({ name: '', phone: '', address: '' }); }}
            style={{ marginTop: 20, padding: '12px 22px', borderRadius: 14, border: 'none', background: c.brown, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Yeni randevu oluştur
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="randevu" style={{ background: c.bgAlt, borderTop: '1px solid ' + c.line, borderBottom: '1px solid ' + c.line }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(28px,4vw,44px) 20px' }}>
        <div data-reveal>
          <h2 style={h2}>Keşif randevusu</h2>
          <p style={{ ...lead, marginBottom: 26 }}>Takvimden uygun günü ve saati seçin. Randevunuz anında oluşturulur.</p>
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
                const closed = closedDates.has(toDateStr(cell.key));
                const disabled = cell.disabled || closed;
                return (
                  <button key={cell.d} disabled={disabled}
                    onClick={() => { setSelected(cell.key); setSlot(null); }}
                    title={closed ? 'Bu gün kapalı' : undefined}
                    style={{
                      aspectRatio: '1', borderRadius: 12,
                      border: '1px solid ' + (on ? c.orange : disabled ? 'transparent' : 'rgba(160,105,72,0.20)'),
                      background: on ? c.orange : disabled ? 'transparent' : c.field,
                      color: on ? '#fff' : disabled ? '#C3B7A9' : c.ink,
                      fontSize: 14, fontWeight: on ? 700 : 500,
                      textDecoration: closed ? 'line-through' : 'none',
                      cursor: disabled ? 'not-allowed' : 'pointer'
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

            {loadingAvailability && (
              <p style={{ fontSize: 13, color: '#9C8877', marginTop: 14 }}>Uygunluk kontrol ediliyor…</p>
            )}
            {availabilityError && (
              <p style={{ fontSize: 13, color: '#B0413E', marginTop: 14 }}>{availabilityError}</p>
            )}
            {availability && availability.dayClosed && (
              <p style={{ fontSize: 13, color: '#B0413E', marginTop: 14 }}>Bu gün için randevu alınamıyor, lütfen başka bir gün seçin.</p>
            )}

            {selected && !loadingAvailability && !availabilityError && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 9, marginTop: 16 }}>
                {(availability ? availability.slots : []).map(({ time, available }) => {
                  const on = slot === time;
                  const disabled = !available;
                  return (
                    <button key={time} disabled={disabled} onClick={() => setSlot(time)} style={{
                      padding: '11px 6px', borderRadius: 12, fontSize: 14, fontWeight: 550,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      border: '1px solid ' + (on ? c.ink : 'rgba(160,105,72,0.22)'),
                      background: on ? c.ink : disabled ? 'rgba(160,105,72,0.06)' : c.field,
                      color: on ? '#fff' : disabled ? '#C3B7A9' : c.ink,
                      textDecoration: disabled ? 'line-through' : 'none'
                    }}>{SLOT_LABELS[time] || time}</button>
                  );
                })}
              </div>
            )}

            <div style={{ height: 1, background: c.line, margin: '22px 0' }} />

            <div style={{ display: 'grid', gap: 10 }}>
              <input placeholder="Ad Soyad" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} style={{ ...field, padding: '12px 13px' }} />
              <input placeholder="Telefon" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} style={{ ...field, padding: '12px 13px' }} />
              <input placeholder="Taşınacak adres (ilçe / mahalle)" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} style={{ ...field, padding: '12px 13px' }} />
            </div>

            {submitError && (
              <p style={{ margin: '12px 0 0', fontSize: 13, color: '#B0413E' }}>{submitError}</p>
            )}

            <button onClick={handleSubmit} disabled={!ready || !form.name || !form.phone}
              style={{
                display: 'block', width: '100%', textAlign: 'center', marginTop: 16, padding: 14, borderRadius: 14,
                border: 'none', background: (ready && form.name && form.phone) ? c.brown : 'rgba(160,105,72,0.35)', color: '#fff',
                fontSize: 15, fontWeight: 600,
                cursor: (ready && form.name && form.phone) ? 'pointer' : 'not-allowed'
              }}>
              {submitting ? 'Gönderiliyor…' : ready ? 'Randevuyu onayla · ' + (SLOT_LABELS[slot] || slot) : 'Gün ve saat seçin'}
            </button>

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
