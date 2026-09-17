import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, firebaseReady } from '../firebase/client';
import * as d from '../firebase/defaults';
import { loadContentDoc, saveContentDoc, loadCollection, saveCollection, checkIsAdmin, slugify } from '../firebase/adminData';
import { c, field, btnPrimary, btnGhost, mono } from '../styles';

const IL_LISTESI = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin','Aydın','Balıkesir',
  'Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli',
  'Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari',
  'Hatay','Isparta','Mersin','İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir',
  'Kocaeli','Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş','Nevşehir',
  'Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Tekirdağ','Tokat',
  'Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat','Zonguldak','Aksaray','Bayburt','Karaman',
  'Kırıkkale','Batman','Şırnak','Bartın','Ardahan','Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce'
];

const SITE_FIELDS = [
  ['phone', 'Telefon (ör. +905350850240)'],
  ['phoneDisplay', 'Telefon (görünen)'],
  ['email', 'E-posta'],
  ['addressLine1', 'Adres satırı 1'],
  ['addressLine2', 'Adres satırı 2'],
  ['hoursWeekday', 'Çalışma saatleri (hafta)'],
  ['hoursSunday', 'Çalışma saatleri (pazar)'],
  ['mapsQuery', 'Harita arama metni'],
  ['mapsLink', 'Google Maps linki'],
  ['reviewLink', 'Google yorum linki'],
  ['footerNote', 'Footer notu', true],
  ['copyright', 'Telif satırı']
];

const HERO_FIELDS = [
  ['badge', 'Rozet metni'],
  ['titleLine1', 'Başlık satır 1'],
  ['titleLine2', 'Başlık satır 2'],
  ['titleAccent', 'Başlık vurgu (turuncu kelime)'],
  ['body', 'Açıklama metni', true],
  ['primaryCta', 'Ana buton metni'],
  ['secondaryCta', 'İkinci buton metni'],
  ['imageUrl', 'Görsel URL'],
  ['badgeCardTitle', 'Küçük kart başlığı'],
  ['badgeCardBody', 'Küçük kart açıklaması']
];

const PRICING_FIELDS = [
  ['perM3', 'm³ başına ücret (₺)'],
  ['baseLocal', 'Şehir içi taban ücret (₺)'],
  ['baseIntercity', 'Şehirler arası taban ücret (₺)'],
  ['localKmLimit', 'Şehir içi sayılan km sınırı'],
  ['perKm', 'Km başına ücret (₺)'],
  ['roadFactor', 'Yol mesafe çarpanı (ör. 1.28)'],
  ['floorWithLift', 'Asansörlü kat başına ücret (₺)'],
  ['floorNoLift', 'Asansörsüz kat başına ücret (₺)'],
  ['extraPaketPerM3', 'Paketleme, m³ başına (₺)'],
  ['extraVincFlat', 'Mobilya asansörü, sabit (₺)'],
  ['extraDepoPerM3', 'Depolama, m³ başına (₺)'],
  ['extraMontajFlat', 'Sökme + montaj, sabit (₺)'],
  ['rangeLow', 'Aralık alt çarpanı (ör. 0.92)'],
  ['rangeHigh', 'Aralık üst çarpanı (ör. 1.1)']
];

const TABS = [
  ['genel', 'Genel'],
  ['fiyat', 'Fiyatlandırma'],
  ['harita', 'Türkiye Haritası'],
  ['hizmetler', 'Hizmetler'],
  ['urunler', 'Kutu & Malzeme'],
  ['sss', 'S.S.S.'],
  ['yorumlar', 'Yorumlar']
];

function Field({ label, value, onChange, textarea, type = 'text' }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12.5, fontWeight: 650, color: c.ink55 }}>{label}</span>
      {textarea ? (
        <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={3}
          style={{ ...field, resize: 'vertical', fontFamily: 'inherit' }} />
      ) : (
        <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} style={field} />
      )}
    </label>
  );
}

function SectionCard({ title, desc, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid ' + c.line, borderRadius: 20, padding: 22, marginBottom: 18 }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: desc ? 4 : 14 }}>{title}</div>
      {desc && <div style={{ fontSize: 13, color: c.ink55, marginBottom: 14 }}>{desc}</div>}
      {children}
    </div>
  );
}

function SaveBar({ onSave, saving, msg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
      <button onClick={onSave} disabled={saving} style={{ ...btnPrimary, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Kaydediliyor…' : 'Kaydet'}
      </button>
      {msg && <span style={{ fontSize: 13, color: msg.ok ? '#2E7D32' : '#B0413E' }}>{msg.text}</span>}
    </div>
  );
}

/** key: dizideki benzersiz alan (genelde 'id'). fields: [key,label,type] type: text|textarea|number|checkbox|select */
function ListEditor({ items, setItems, fields, newItem, itemLabel }) {
  const update = (idx, key, val) => setItems(items.map((it, i) => i === idx ? { ...it, [key]: val } : it));
  const remove = idx => setItems(items.filter((_, i) => i !== idx));
  const add = () => setItems([...items, newItem()]);

  return (
    <div>
      {items.map((it, idx) => (
        <div key={it.id || idx} style={{ border: '1px solid ' + c.line, borderRadius: 14, padding: 16, marginBottom: 12, background: c.field }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontFamily: mono, color: c.ink40 }}>{itemLabel ? itemLabel(it) : `#${idx + 1}`}</span>
            <button onClick={() => remove(idx)} style={{ ...btnGhost, padding: '6px 12px', fontSize: 12.5, borderColor: 'rgba(176,65,62,0.4)', color: '#B0413E' }}>Sil</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
            {fields.map(([key, label, type, options]) => {
              if (type === 'checkbox') {
                return (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: c.ink70 }}>
                    <input type="checkbox" checked={!!it[key]} onChange={e => update(idx, key, e.target.checked)} />
                    {label}
                  </label>
                );
              }
              if (type === 'select') {
                return (
                  <label key={key} style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 650, color: c.ink55 }}>{label}</span>
                    <select value={it[key] ?? ''} onChange={e => update(idx, key, e.target.value)} style={field}>
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </label>
                );
              }
              const isTextarea = type === 'textarea';
              return (
                <div key={key} style={isTextarea ? { gridColumn: '1 / -1' } : undefined}>
                  <Field label={label} value={it[key]} type={type === 'number' ? 'number' : 'text'} textarea={isTextarea}
                    onChange={v => update(idx, key, v)} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button onClick={add} style={{ ...btnGhost, fontSize: 13.5 }}>+ Yeni ekle</button>
    </div>
  );
}

function toNum(v, fallback = 0) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export default function Admin() {
  const [user, setUser] = useState(undefined); // undefined=yükleniyor, null=girmemiş
  const [isAdmin, setIsAdmin] = useState(null);
  const [tab, setTab] = useState('genel');

  useEffect(() => {
    if (!firebaseReady) { setUser(null); return; }
    return onAuthStateChanged(auth, async u => {
      setUser(u || null);
      if (u) setIsAdmin(await checkIsAdmin(u.uid));
      else setIsAdmin(null);
    });
  }, []);

  if (!firebaseReady) {
    return <Centered>Firebase yapılandırılmamış. Bu ortamda yönetim paneli kullanılamaz.</Centered>;
  }
  if (user === undefined) {
    return <Centered>Yükleniyor…</Centered>;
  }
  if (!user) {
    return (
      <Centered>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>STC Evden Eve — Yönetim Paneli</div>
        <button style={btnPrimary} onClick={() => signInWithPopup(auth, googleProvider)}>Google ile giriş yap</button>
      </Centered>
    );
  }
  if (isAdmin === null) {
    return <Centered>Kontrol ediliyor…</Centered>;
  }
  if (!isAdmin) {
    return (
      <Centered>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Bu hesap yönetici değil</div>
        <p style={{ fontSize: 14, color: c.ink55, maxWidth: 420, margin: '0 0 14px' }}>
          <b>{user.email}</b> hesabıyla giriş yaptın ama yönetici listesinde değilsin.
          Aşağıdaki kullanıcı kimliğini (UID) yöneticine ilet, seni ekleyecek.
        </p>
        <code style={{ display: 'block', background: c.field, border: '1px solid ' + c.line, borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16, wordBreak: 'break-all' }}>
          {user.uid}
        </code>
        <button style={btnGhost} onClick={() => signOut(auth)}>Çıkış yap</button>
      </Centered>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg }}>
      <div style={{ background: '#fff', borderBottom: '1px solid ' + c.line, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>STC Evden Eve — Yönetim Paneli</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 13, color: c.ink55 }}>{user.email}</span>
          <button onClick={() => signOut(auth)} style={{ ...btnGhost, padding: '8px 14px', fontSize: 13 }}>Çıkış yap</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '14px 24px 0', overflowX: 'auto', borderBottom: '1px solid ' + c.line, background: '#fff' }}>
        {TABS.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 650, whiteSpace: 'nowrap',
            color: tab === key ? c.brown : c.ink55,
            borderBottom: '2px solid ' + (tab === key ? c.brown : 'transparent')
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 80px' }}>
        {tab === 'genel' && <GenelTab />}
        {tab === 'fiyat' && <FiyatTab />}
        {tab === 'harita' && <HaritaTab />}
        {tab === 'hizmetler' && <HizmetlerTab />}
        {tab === 'urunler' && <UrunlerTab />}
        {tab === 'sss' && <SssTab />}
        {tab === 'yorumlar' && <YorumlarTab />}
      </div>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bg, padding: 20, textAlign: 'center' }}>
      <div>{children}</div>
    </div>
  );
}

function GenelTab() {
  const [site, setSite] = useState(null);
  const [hero, setHero] = useState(null);
  const [savingSite, setSavingSite] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [msgSite, setMsgSite] = useState(null);
  const [msgHero, setMsgHero] = useState(null);

  useEffect(() => {
    loadContentDoc('site', d.site).then(setSite);
    loadContentDoc('hero', d.hero).then(setHero);
  }, []);

  if (!site || !hero) return <p style={{ color: c.ink55 }}>Yükleniyor…</p>;

  const saveSite = async () => {
    setSavingSite(true); setMsgSite(null);
    try { await saveContentDoc('site', site); setMsgSite({ ok: true, text: 'Kaydedildi ✓' }); }
    catch (e) { setMsgSite({ ok: false, text: 'Hata: ' + e.message }); }
    finally { setSavingSite(false); }
  };
  const saveHero = async () => {
    setSavingHero(true); setMsgHero(null);
    try { await saveContentDoc('hero', hero); setMsgHero({ ok: true, text: 'Kaydedildi ✓' }); }
    catch (e) { setMsgHero({ ok: false, text: 'Hata: ' + e.message }); }
    finally { setSavingHero(false); }
  };

  return (
    <>
      <SectionCard title="İletişim & Site Bilgileri">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
          {SITE_FIELDS.map(([key, label, textarea]) => (
            <div key={key} style={textarea ? { gridColumn: '1 / -1' } : undefined}>
              <Field label={label} value={site[key]} textarea={textarea} onChange={v => setSite({ ...site, [key]: v })} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}><SaveBar onSave={saveSite} saving={savingSite} msg={msgSite} /></div>
      </SectionCard>

      <SectionCard title="Ana Sayfa (Hero) Metinleri">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
          {HERO_FIELDS.map(([key, label, textarea]) => (
            <div key={key} style={textarea ? { gridColumn: '1 / -1' } : undefined}>
              <Field label={label} value={hero[key]} textarea={textarea} onChange={v => setHero({ ...hero, [key]: v })} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, fontSize: 13, fontWeight: 650, color: c.ink55 }}>İstatistik kutuları</div>
        <ListEditor
          items={hero.stats || []}
          setItems={items => setHero({ ...hero, stats: items })}
          fields={[['value', 'Değer'], ['label', 'Etiket']]}
          newItem={() => ({ value: '', label: '' })}
          itemLabel={it => it.value || 'yeni'}
        />

        <div style={{ marginTop: 16 }}><SaveBar onSave={saveHero} saving={savingHero} msg={msgHero} /></div>
      </SectionCard>
    </>
  );
}

function FiyatTab() {
  const [pricing, setPricing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => { loadContentDoc('pricing', d.pricing).then(setPricing); }, []);
  if (!pricing) return <p style={{ color: c.ink55 }}>Yükleniyor…</p>;

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const clean = { ...pricing };
      PRICING_FIELDS.forEach(([key]) => { clean[key] = toNum(pricing[key]); });
      clean.homeTypes = (pricing.homeTypes || []).map(h => ({ ...h, vol: toNum(h.vol) }));
      await saveContentDoc('pricing', clean);
      setPricing(clean);
      setMsg({ ok: true, text: 'Kaydedildi ✓' });
    } catch (e) { setMsg({ ok: false, text: 'Hata: ' + e.message }); }
    finally { setSaving(false); }
  };

  return (
    <SectionCard title="Fiyat Hesaplama Katsayıları" desc="Bu değerler sitedeki 'Fiyat Hesapla' aracının sonucunu doğrudan etkiler.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
        {PRICING_FIELDS.map(([key, label]) => (
          <Field key={key} label={label} value={pricing[key]} type="number" onChange={v => setPricing({ ...pricing, [key]: v })} />
        ))}
      </div>

      <div style={{ marginTop: 20, fontSize: 13, fontWeight: 650, color: c.ink55 }}>Ev tipleri (m³ hacmi)</div>
      <ListEditor
        items={pricing.homeTypes || []}
        setItems={items => setPricing({ ...pricing, homeTypes: items })}
        fields={[['key', 'Anahtar (ör. 2+1)'], ['label', 'Etiket'], ['vol', 'Hacim (m³)', 'number']]}
        newItem={() => ({ key: '', label: '', vol: 20 })}
        itemLabel={it => it.label || 'yeni'}
      />

      <div style={{ marginTop: 20, fontSize: 13, fontWeight: 650, color: c.ink55 }}>Ek hizmetler</div>
      <ListEditor
        items={pricing.extras || []}
        setItems={items => setPricing({ ...pricing, extras: items })}
        fields={[['key', 'Anahtar'], ['label', 'Etiket'], ['note', 'Açıklama']]}
        newItem={() => ({ key: '', label: '', note: '' })}
        itemLabel={it => it.label || 'yeni'}
      />

      <div style={{ marginTop: 18 }}><SaveBar onSave={save} saving={saving} msg={msg} /></div>
    </SectionCard>
  );
}

function HaritaTab() {
  const [items, setItems] = useState(null);
  const [originalIds, setOriginalIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadCollection('provinces', d.provinces).then(({ items, originalIds }) => { setItems(items); setOriginalIds(originalIds); });
  }, []);
  if (!items) return <p style={{ color: c.ink55 }}>Yükleniyor…</p>;

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const clean = items.map((it, i) => ({
        ...it,
        id: it.id || slugify(it.ad),
        tasima: toNum(it.tasima),
        order: i + 1,
        lat: it.lat ?? 0,
        lng: it.lng ?? 0
      }));
      await saveCollection('provinces', clean, originalIds);
      setItems(clean); setOriginalIds(clean.map(i => i.id));
      setMsg({ ok: true, text: 'Kaydedildi ✓' });
    } catch (e) { setMsg({ ok: false, text: 'Hata: ' + e.message }); }
    finally { setSaving(false); }
  };

  return (
    <SectionCard title="Türkiye Haritası — Hizmet Verilen İller" desc="Haritada renkli görünen iller ve taşıma sayıları burada yönetilir.">
      <ListEditor
        items={items}
        setItems={setItems}
        fields={[
          ['ad', 'İl', 'select', IL_LISTESI],
          ['tasima', 'Taşıma sayısı', 'number'],
          ['merkez', 'Merkez şehir', 'checkbox']
        ]}
        newItem={() => ({ id: slugify('il-' + Date.now()), ad: 'İstanbul', tasima: 0, merkez: false, lat: 0, lng: 0 })}
        itemLabel={it => it.ad || 'yeni'}
      />
      <div style={{ marginTop: 18 }}><SaveBar onSave={save} saving={saving} msg={msg} /></div>
    </SectionCard>
  );
}

function HizmetlerTab() {
  const [items, setItems] = useState(null);
  const [originalIds, setOriginalIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadCollection('services', d.services).then(({ items, originalIds }) => { setItems(items); setOriginalIds(originalIds); });
  }, []);
  if (!items) return <p style={{ color: c.ink55 }}>Yükleniyor…</p>;

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const clean = items.map((it, i) => ({ ...it, id: it.id || slugify(it.title), order: i + 1 }));
      await saveCollection('services', clean, originalIds);
      setItems(clean); setOriginalIds(clean.map(i => i.id));
      setMsg({ ok: true, text: 'Kaydedildi ✓' });
    } catch (e) { setMsg({ ok: false, text: 'Hata: ' + e.message }); }
    finally { setSaving(false); }
  };

  return (
    <SectionCard title="Ana Sayfa Hizmet Kartları">
      <ListEditor
        items={items}
        setItems={setItems}
        fields={[
          ['title', 'Başlık'],
          ['body', 'Açıklama', 'textarea'],
          ['icon', 'İkon', 'select', ['home', 'lift', 'box', 'office']],
          ['accent', 'Renk', 'select', ['brown', 'orange']]
        ]}
        newItem={() => ({ id: slugify('hizmet-' + Date.now()), title: '', body: '', icon: 'box', accent: 'brown' })}
        itemLabel={it => it.title || 'yeni'}
      />
      <div style={{ marginTop: 18 }}><SaveBar onSave={save} saving={saving} msg={msg} /></div>
    </SectionCard>
  );
}

function UrunlerTab() {
  const [items, setItems] = useState(null);
  const [originalIds, setOriginalIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadCollection('products', d.products).then(({ items, originalIds }) => { setItems(items); setOriginalIds(originalIds); });
  }, []);
  if (!items) return <p style={{ color: c.ink55 }}>Yükleniyor…</p>;

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const clean = items.map((it, i) => ({ ...it, id: it.id || slugify(it.name), price: toNum(it.price), order: i + 1 }));
      await saveCollection('products', clean, originalIds);
      setItems(clean); setOriginalIds(clean.map(i => i.id));
      setMsg({ ok: true, text: 'Kaydedildi ✓' });
    } catch (e) { setMsg({ ok: false, text: 'Hata: ' + e.message }); }
    finally { setSaving(false); }
  };

  return (
    <SectionCard title="Kutu & Malzeme Ürünleri">
      <ListEditor
        items={items}
        setItems={setItems}
        fields={[
          ['name', 'Ürün adı'],
          ['desc', 'Açıklama'],
          ['price', 'Fiyat (₺)', 'number'],
          ['imageUrl', 'Görsel URL']
        ]}
        newItem={() => ({ id: slugify('urun-' + Date.now()), name: '', desc: '', price: 0, imageUrl: '' })}
        itemLabel={it => it.name || 'yeni'}
      />
      <div style={{ marginTop: 18 }}><SaveBar onSave={save} saving={saving} msg={msg} /></div>
    </SectionCard>
  );
}

function SssTab() {
  const [items, setItems] = useState(null);
  const [originalIds, setOriginalIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadCollection('faqs', d.faqs).then(({ items, originalIds }) => { setItems(items); setOriginalIds(originalIds); });
  }, []);
  if (!items) return <p style={{ color: c.ink55 }}>Yükleniyor…</p>;

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const clean = items.map((it, i) => ({ ...it, id: it.id || slugify(it.question), order: i + 1 }));
      await saveCollection('faqs', clean, originalIds);
      setItems(clean); setOriginalIds(clean.map(i => i.id));
      setMsg({ ok: true, text: 'Kaydedildi ✓' });
    } catch (e) { setMsg({ ok: false, text: 'Hata: ' + e.message }); }
    finally { setSaving(false); }
  };

  return (
    <SectionCard title="Sıkça Sorulan Sorular">
      <ListEditor
        items={items}
        setItems={setItems}
        fields={[['question', 'Soru', 'textarea'], ['answer', 'Cevap', 'textarea']]}
        newItem={() => ({ id: slugify('soru-' + Date.now()), question: '', answer: '' })}
        itemLabel={it => it.question || 'yeni'}
      />
      <div style={{ marginTop: 18 }}><SaveBar onSave={save} saving={saving} msg={msg} /></div>
    </SectionCard>
  );
}

function YorumlarTab() {
  const [items, setItems] = useState(null);
  const [originalIds, setOriginalIds] = useState([]);
  const [rating, setRating] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingRating, setSavingRating] = useState(false);
  const [msg, setMsg] = useState(null);
  const [msgRating, setMsgRating] = useState(null);

  useEffect(() => {
    loadCollection('reviews', d.reviews).then(({ items, originalIds }) => { setItems(items); setOriginalIds(originalIds); });
    loadContentDoc('rating', d.rating).then(setRating);
  }, []);
  if (!items || !rating) return <p style={{ color: c.ink55 }}>Yükleniyor…</p>;

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const clean = items.map((it, i) => ({ ...it, id: it.id || slugify(it.name), stars: toNum(it.stars, 5), order: i + 1 }));
      await saveCollection('reviews', clean, originalIds);
      setItems(clean); setOriginalIds(clean.map(i => i.id));
      setMsg({ ok: true, text: 'Kaydedildi ✓' });
    } catch (e) { setMsg({ ok: false, text: 'Hata: ' + e.message }); }
    finally { setSaving(false); }
  };

  const saveRating = async () => {
    setSavingRating(true); setMsgRating(null);
    try {
      const clean = {
        avg: toNum(rating.avg),
        count: toNum(rating.count),
        bars: {
          5: toNum(rating.bars?.[5]), 4: toNum(rating.bars?.[4]), 3: toNum(rating.bars?.[3]),
          2: toNum(rating.bars?.[2]), 1: toNum(rating.bars?.[1])
        }
      };
      await saveContentDoc('rating', clean);
      setRating(clean);
      setMsgRating({ ok: true, text: 'Kaydedildi ✓' });
    } catch (e) { setMsgRating({ ok: false, text: 'Hata: ' + e.message }); }
    finally { setSavingRating(false); }
  };

  return (
    <>
      <SectionCard title="Genel Puan" desc="Yorumlar bölümünün üstündeki büyük puan ve dağılım çubukları.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14 }}>
          <Field label="Ortalama puan (ör. 4.8)" value={rating.avg} type="number" onChange={v => setRating({ ...rating, avg: v })} />
          <Field label="Toplam yorum sayısı" value={rating.count} type="number" onChange={v => setRating({ ...rating, count: v })} />
          {[5, 4, 3, 2, 1].map(star => (
            <Field key={star} label={star + ' yıldız adedi'} value={rating.bars?.[star]} type="number"
              onChange={v => setRating({ ...rating, bars: { ...rating.bars, [star]: v } })} />
          ))}
        </div>
        <div style={{ marginTop: 16 }}><SaveBar onSave={saveRating} saving={savingRating} msg={msgRating} /></div>
      </SectionCard>

      <SectionCard title="Google Yorumları" desc="Places API bağlanana kadar yorumlar buradan elle güncellenir.">
        <ListEditor
          items={items}
          setItems={setItems}
          fields={[
            ['name', 'İsim'],
            ['when', 'Ne zaman (ör. 2 hafta önce)'],
            ['stars', 'Yıldız (1-5)', 'number'],
            ['avatarUrl', 'Avatar URL'],
            ['text', 'Yorum metni', 'textarea']
          ]}
          newItem={() => ({ id: slugify('yorum-' + Date.now()), name: '', when: 'yeni', stars: 5, avatarUrl: '', text: '' })}
          itemLabel={it => it.name || 'yeni'}
        />
        <div style={{ marginTop: 18 }}><SaveBar onSave={save} saving={saving} msg={msg} /></div>
      </SectionCard>
    </>
  );
}
