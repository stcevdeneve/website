import React, { useMemo, useState } from 'react';
import { c, kicker, h2, lead, field, fmtTRY, mono } from '../styles';

const FLOORS = [0,1,2,3,4,5,6,7,8,9,10].map(v => ({
  value: v, label: v === 0 ? 'Giriş / müstakil' : v + '. kat'
}));

function haversineKm(a, b, roadFactor) {
  if (!a || !b) return 0;
  const R = 6371, rad = d => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * roadFactor);
}

export default function PriceCalculator({ pricing, cities }) {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [fromFloor, setFromFloor] = useState(3);
  const [toFloor, setToFloor] = useState(2);
  const [fromLift, setFromLift] = useState(true);
  const [toLift, setToLift] = useState(false);
  const [homeType, setHomeType] = useState('2+1');
  const [extras, setExtras] = useState({ paket: true });

  const ready = !!fromCity && !!toCity;

  const calc = useMemo(() => {
    const p = pricing;
    const vol = (p.homeTypes.find(h => h.key === homeType) || p.homeTypes[1]).vol;
    const km = haversineKm(
      cities.find(x => x.name === fromCity),
      cities.find(x => x.name === toCity),
      p.roadFactor
    );
    const isLocal = km < p.localKmLimit;
    const tasima = vol * p.perM3 + (isLocal ? p.baseLocal : p.baseIntercity);
    const mesafe = km * p.perKm;
    const kat =
      fromFloor * (fromLift ? p.floorWithLift : p.floorNoLift) +
      toFloor * (toLift ? p.floorWithLift : p.floorNoLift);
    let ek = 0;
    if (extras.paket) ek += vol * p.extraPaketPerM3;
    if (extras.vinc) ek += p.extraVincFlat;
    if (extras.depo) ek += vol * p.extraDepoPerM3;
    if (extras.montaj) ek += p.extraMontajFlat;
    return { vol, km, tasima, mesafe, kat, ek, isLocal, total: tasima + mesafe + kat + ek };
  }, [pricing, cities, fromCity, toCity, fromFloor, toFloor, fromLift, toLift, homeType, extras]);

  const toggleExtra = k => setExtras(e => ({ ...e, [k]: !e[k] }));

  return (
    <section id="hesapla" style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(28px,4vw,44px) 20px' }}>
      <div style={{ marginBottom: 26 }} data-reveal>
        <h2 style={h2}>Fiyat hesaplama</h2>
        <p style={lead}>Nereden nereye taşındığınızı, kat ve asansör bilgisini seçin; tahmini tutarınız anında hesaplansın.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid ' + c.line, borderRadius: 24, padding: 'clamp(20px,3vw,30px)' }} data-reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
            <Endpoint
              title="Nereden" titleColor={c.brown} cities={cities}
              city={fromCity} setCity={setFromCity}
              floor={fromFloor} setFloor={setFromFloor}
              lift={fromLift} setLift={setFromLift}
            />
            <Endpoint
              title="Nereye" titleColor={c.orange} cities={cities}
              city={toCity} setCity={setToCity}
              floor={toFloor} setFloor={setToFloor}
              lift={toLift} setLift={setToLift}
            />
          </div>

          <div style={{ height: 1, background: c.line, margin: '24px 0' }} />

          <Label>Ev tipi</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {pricing.homeTypes.map(h => {
              const on = homeType === h.key;
              return (
                <button key={h.key} onClick={() => setHomeType(h.key)} style={{
                  padding: '9px 15px', borderRadius: 999, fontSize: 14, fontWeight: 550, cursor: 'pointer',
                  border: '1px solid ' + (on ? c.ink : c.lineStrong),
                  background: on ? c.ink : c.field, color: on ? '#fff' : c.ink70
                }}>{h.label}</button>
              );
            })}
          </div>

          <Label style={{ marginTop: 22 }}>Ek hizmetler</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 10 }}>
            {pricing.extras.map(e => {
              const on = !!extras[e.key];
              return (
                <button key={e.key} onClick={() => toggleExtra(e.key)} style={{
                  textAlign: 'left', padding: '13px 15px', borderRadius: 14, cursor: 'pointer',
                  border: '1px solid ' + (on ? c.orange : 'rgba(160,105,72,0.22)'),
                  background: on ? 'rgba(232,122,0,0.10)' : c.field,
                  display: 'flex', flexDirection: 'column', gap: 3
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{e.label}</span>
                  <span style={{ fontSize: 12.5, color: '#7A6252' }}>{e.note}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ background: c.ink, borderRadius: 24, padding: 'clamp(22px,3vw,30px)', color: c.bg, position: 'sticky', top: 96 }} data-reveal>
          <div style={{ ...kicker, color: '#C9A487' }}>Tahmini tutar</div>
          {ready ? (
            <>
              <div style={{ marginTop: 14, fontSize: 'clamp(30px,4.4vw,42px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                {fmtTRY(calc.total * pricing.rangeLow)} – {fmtTRY(calc.total * pricing.rangeHigh)}
              </div>
              <div style={{ marginTop: 8, fontSize: 13.5, color: '#B9A493' }}>
                {fromCity} → {toCity} · ~{calc.km} km · {calc.vol} m³
              </div>
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 11 }}>
                <Row label="Taşıma & işçilik" value={fmtTRY(calc.tasima)} />
                <Row label={calc.isLocal ? 'Şehir içi araç' : 'Şehirler arası araç'} value={fmtTRY(calc.mesafe)} />
                <Row label="Kat / asansör farkı" value={calc.kat ? fmtTRY(calc.kat) : 'Dahil'} />
                <Row label="Ek hizmetler" value={calc.ek ? fmtTRY(calc.ek) : '—'} />
              </div>
            </>
          ) : (
            <div style={{ marginTop: 14, fontSize: 15, lineHeight: 1.6, color: '#C0AC9B' }}>
              Tahmini tutarı görmek için <b style={{ color: '#EFECE6' }}>nereden</b> ve <b style={{ color: '#EFECE6' }}>nereye</b> taşınacağınızı seçin.
            </div>
          )}
          <a href="#randevu" style={{
            display: 'block', textAlign: 'center', marginTop: 26, padding: 14, borderRadius: 14,
            background: c.orange, color: '#fff', fontSize: 15, fontWeight: 600
          }}>{ready ? 'Bu fiyatla randevu al' : 'Randevu al'}</a>
          <p style={{ margin: '14px 0 0', fontSize: 12.5, lineHeight: 1.55, color: '#9C8877' }}>
            Tutar; mesafe, hacim ve kat bilgisine göre üretilen ön tahmindir. Kesin fiyat randevunuz sonrası netleşir.
          </p>
        </div>
      </div>
    </section>
  );
}

const Label = ({ children, style }) => (
  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 500, color: c.ink70, margin: '0 0 10px', ...style }}>{children}</label>
);

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, fontSize: 14 }}>
    <span style={{ color: '#C0AC9B' }}>{label}</span>
    <span style={{ fontWeight: 600, color: '#EFECE6' }}>{value}</span>
  </div>
);

function Endpoint({ title, titleColor, cities, city, setCity, floor, setFloor, lift, setLift }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: titleColor, marginBottom: 12 }}>{title}</div>
      <Label style={{ marginBottom: 6 }}>Şehir</Label>
      <select value={city} onChange={e => setCity(e.target.value)} style={field}>
        <option value="">Şehir seçin</option>
        {cities.map(x => <option key={x.name} value={x.name}>{x.name}</option>)}
      </select>
      <Label style={{ margin: '14px 0 6px' }}>Kat</Label>
      <select value={floor} onChange={e => setFloor(Number(e.target.value))} style={field}>
        {FLOORS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, fontSize: 14, color: c.ink70, cursor: 'pointer' }}>
        <input type="checkbox" checked={lift} onChange={e => setLift(e.target.checked)} style={{ width: 17, height: 17, accentColor: c.orange }} />
        Binada asansör var
      </label>
    </div>
  );
}
