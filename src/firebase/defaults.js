/**
 * Firestore boşken veya Firebase yapılandırılmadan çalışırken kullanılan içerik.
 * scripts/seed.mjs bu dosyayı Firestore'a birebir yükler.
 */

export const site = {
  phone: '+905000000000',
  phoneDisplay: '0500 000 00 00',
  email: 'info@stcevdeneve.com',
  addressLine1: 'Caferağa Mah. Nakliyeciler Sok. No: 12/A',
  addressLine2: 'Kadıköy / İstanbul',
  hoursWeekday: 'Pazartesi – Cumartesi · 08:00 – 19:00',
  hoursSunday: 'Pazar · Sadece randevulu',
  mapsQuery: 'Kadikoy Istanbul',
  mapsLink: 'https://maps.google.com/?q=Kadikoy%20Istanbul',
  reviewLink: 'https://maps.google.com/?q=STC%20Evden%20Eve%20Kadikoy',
  bookingUrl: '',
  footerNote: 'Sigortalı evden eve nakliyat, depolama ve ambalaj malzemeleri. İstanbul merkezli, 81 ile hizmet.',
  copyright: '© 2026 STC Evden Eve Nakliyat. Tüm hakları saklıdır.'
};

export const hero = {
  badge: 'Sigortalı taşımacılık · 14 yıllık tecrübe',
  titleLine1: 'Eşyanız yerinden',
  titleLine2: 'kalkmadan',
  titleAccent: 'planlanır.',
  body: 'STC Evden Eve; paketleme, asansörlü taşıma, depolama ve montaj süreçlerini tek ekiple yürütür. Adres ve kat bilgilerinizi girin, fiyatınızı saniyeler içinde görün.',
  primaryCta: 'Ücretsiz fiyat hesapla',
  secondaryCta: 'Keşif randevusu al',
  imageUrl: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=900&h=765&fit=crop',
  badgeCardTitle: 'Sigortalı & sözleşmeli',
  badgeCardBody: 'Her taşımada eşya güvencesi',
  stats: [
    { value: '8.400+', label: 'tamamlanan taşıma' },
    { value: '81 il', label: 'şehirler arası hizmet' },
    { value: '4.9/5', label: 'müşteri puanı' }
  ]
};

export const services = [
  { id: 'evden-eve', order: 1, icon: 'home', accent: 'brown', title: 'Evden eve nakliyat', body: 'Sökme, paketleme, taşıma ve kurulum dahil anahtar teslim hizmet.' },
  { id: 'asansorlu', order: 2, icon: 'lift', accent: 'orange', title: 'Asansörlü taşıma', body: 'Dar merdiven ve yüksek katlarda mobilya asansörü ile güvenli çıkış.' },
  { id: 'depolama', order: 3, icon: 'box', accent: 'brown', title: 'Eşya depolama', body: 'Nemsiz, kameralı depolarda günlük veya aylık saklama.' },
  { id: 'ofis', order: 4, icon: 'office', accent: 'orange', title: 'Ofis taşıma', body: 'Hafta sonu planlaması ile iş akışınızı durdurmadan taşıma.' }
];

/** Fiyat hesaplayıcının tüm katsayıları — konsoldan değiştirilebilir. */
export const pricing = {
  perM3: 340,
  baseLocal: 1800,
  baseIntercity: 3200,
  localKmLimit: 40,
  perKm: 46,
  roadFactor: 1.28,
  floorWithLift: 110,
  floorNoLift: 340,
  extraPaketPerM3: 175,
  extraVincFlat: 3400,
  extraDepoPerM3: 120,
  extraMontajFlat: 2200,
  rangeLow: 0.92,
  rangeHigh: 1.1,
  homeTypes: [
    { key: '1+0', label: '1+0', vol: 12 },
    { key: '1+1', label: '1+1', vol: 20 },
    { key: '2+1', label: '2+1', vol: 32 },
    { key: '3+1', label: '3+1', vol: 45 },
    { key: '4+1', label: '4+1', vol: 60 },
    { key: 'ofis', label: 'Ofis', vol: 38 }
  ],
  extras: [
    { key: 'paket', label: 'Paketleme hizmeti', note: 'Kırılabilir eşya + koli dahil' },
    { key: 'vinc', label: 'Mobilya asansörü', note: 'Dar merdiven / yüksek kat' },
    { key: 'depo', label: '1 ay depolama', note: 'Kameralı, nemsiz depo' },
    { key: 'montaj', label: 'Sökme + montaj', note: 'Mobilya ve beyaz eşya' }
  ]
};

/** Hesaplayıcıdaki şehir listesi (mesafe için koordinat gerekir). */
export const cities = [
  ['İstanbul',41.01,28.98],['Ankara',39.93,32.86],['İzmir',38.42,27.14],['Bursa',40.19,29.06],
  ['Antalya',36.89,30.71],['Adana',37.00,35.32],['Konya',37.87,32.48],['Gaziantep',37.07,37.38],
  ['Kocaeli',40.77,29.94],['Mersin',36.80,34.63],['Kayseri',38.73,35.49],['Eskişehir',39.78,30.52],
  ['Samsun',41.29,36.33],['Denizli',37.78,29.09],['Trabzon',41.00,39.72],['Muğla',37.22,28.36],
  ['Balıkesir',39.65,27.89],['Sakarya',40.76,30.38],['Tekirdağ',40.98,27.51],['Aydın',37.85,27.84],
  ['Diyarbakır',37.91,40.24],['Erzurum',39.90,41.27],['Malatya',38.35,38.31],['Şanlıurfa',37.16,38.79],
  ['Manisa',38.61,27.43],['Hatay',36.20,36.16],['Çanakkale',40.15,26.41],['Afyonkarahisar',38.76,30.54]
].map(([name, lat, lng]) => ({ name, lat, lng }));

/** Haritada işaretlenen, hizmet verilen iller. */
export const provinces = [
  { id: 'istanbul', ad: 'İstanbul', lat: 41.0082, lng: 28.9784, merkez: true, tasima: 3120, order: 1 },
  { id: 'kocaeli', ad: 'Kocaeli', lat: 40.7654, lng: 29.9408, tasima: 410, order: 2 },
  { id: 'sakarya', ad: 'Sakarya', lat: 40.7569, lng: 30.3781, tasima: 260, order: 3 },
  { id: 'bursa', ad: 'Bursa', lat: 40.1885, lng: 29.061, tasima: 480, order: 4 },
  { id: 'tekirdag', ad: 'Tekirdağ', lat: 40.9781, lng: 27.5117, tasima: 300, order: 5 },
  { id: 'balikesir', ad: 'Balıkesir', lat: 39.6484, lng: 27.8826, tasima: 190, order: 6 },
  { id: 'canakkale', ad: 'Çanakkale', lat: 40.1553, lng: 26.4142, tasima: 95, order: 7 },
  { id: 'ankara', ad: 'Ankara', lat: 39.9334, lng: 32.8597, tasima: 640, order: 8 },
  { id: 'eskisehir', ad: 'Eskişehir', lat: 39.7767, lng: 30.5206, tasima: 220, order: 9 },
  { id: 'konya', ad: 'Konya', lat: 37.8715, lng: 32.4846, tasima: 175, order: 10 },
  { id: 'izmir', ad: 'İzmir', lat: 38.4237, lng: 27.1428, tasima: 520, order: 11 },
  { id: 'manisa', ad: 'Manisa', lat: 38.6191, lng: 27.4289, tasima: 130, order: 12 },
  { id: 'aydin', ad: 'Aydın', lat: 37.856, lng: 27.8416, tasima: 145, order: 13 },
  { id: 'denizli', ad: 'Denizli', lat: 37.7765, lng: 29.0864, tasima: 120, order: 14 },
  { id: 'mugla', ad: 'Muğla', lat: 37.2153, lng: 28.3636, tasima: 210, order: 15 },
  { id: 'antalya', ad: 'Antalya', lat: 36.8969, lng: 30.7133, tasima: 390, order: 16 },
  { id: 'mersin', ad: 'Mersin', lat: 36.8121, lng: 34.6415, tasima: 160, order: 17 },
  { id: 'adana', ad: 'Adana', lat: 37.0, lng: 35.3213, tasima: 185, order: 18 },
  { id: 'hatay', ad: 'Hatay', lat: 36.2023, lng: 36.1613, tasima: 110, order: 19 },
  { id: 'gaziantep', ad: 'Gaziantep', lat: 37.0662, lng: 37.3833, tasima: 150, order: 20 },
  { id: 'sanliurfa', ad: 'Şanlıurfa', lat: 37.1591, lng: 38.7969, tasima: 90, order: 21 },
  { id: 'kayseri', ad: 'Kayseri', lat: 38.7312, lng: 35.4787, tasima: 165, order: 22 },
  { id: 'malatya', ad: 'Malatya', lat: 38.3552, lng: 38.3095, tasima: 70, order: 23 },
  { id: 'diyarbakir', ad: 'Diyarbakır', lat: 37.9144, lng: 40.2306, tasima: 85, order: 24 },
  { id: 'samsun', ad: 'Samsun', lat: 41.2867, lng: 36.33, tasima: 140, order: 25 },
  { id: 'trabzon', ad: 'Trabzon', lat: 41.0027, lng: 39.7168, tasima: 105, order: 26 },
  { id: 'erzurum', ad: 'Erzurum', lat: 39.9, lng: 41.27, tasima: 55, order: 27 },
  { id: 'van', ad: 'Van', lat: 38.4891, lng: 43.4089, tasima: 40, order: 28 }
];

export const products = [
  { id: 'standart-koli', order: 1, name: 'Standart koli', desc: '50×35×35 cm, çift oluklu', price: 65, imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=640&h=480&fit=crop' },
  { id: 'buyuk-koli', order: 2, name: 'Büyük koli', desc: '60×45×45 cm, ağır eşya', price: 95, imageUrl: 'https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=640&h=480&fit=crop' },
  { id: 'balonlu-naylon', order: 3, name: 'Balonlu naylon', desc: '50 cm × 20 m rulo', price: 220, imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=640&h=480&fit=crop' },
  { id: 'strec-film', order: 4, name: 'Streç film', desc: '50 cm × 300 m', price: 340, imageUrl: 'https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?w=640&h=480&fit=crop' },
  { id: 'elbise-kolisi', order: 5, name: 'Elbise kolisi', desc: 'Askılıklı, 100 cm', price: 260, imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=640&h=480&fit=crop' },
  { id: 'koli-bandi', order: 6, name: "Koli bandı (6'lı)", desc: '48 mm × 100 m', price: 180, imageUrl: 'https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=640&h=480&fit=crop&sat=-100' }
];

export const faqs = [
  { id: 'f1', order: 1, question: 'Fiyat hesaplayıcıdaki tutar kesin mi?', answer: 'Hayır, ön tahmindir. Mesafe, eşya hacmi ve kat bilgisine göre hesaplanır. Ücretsiz keşif sonrası sabit fiyatlı sözleşme sunulur.' },
  { id: 'f2', order: 2, question: 'Eşyalarım sigortalı mı taşınıyor?', answer: 'Evet. Tüm taşımalar nakliyat sigortası kapsamındadır; poliçe sözleşmenizle birlikte tarafınıza iletilir.' },
  { id: 'f3', order: 3, question: 'Asansörsüz binada ne oluyor?', answer: "Kat farkı ve merdiven durumuna göre mobilya asansörü öneriyoruz. Hesaplayıcıda 'Mobilya asansörü' seçeneğini işaretleyerek maliyeti görebilirsiniz." },
  { id: 'f4', order: 4, question: 'Kutuları nereden alabilirim?', answer: "Kadıköy'deki depomuzdan aynı gün teslim alabilir ya da İstanbul içi adrese gönderim talep edebilirsiniz." },
  { id: 'f5', order: 5, question: 'Şehirler arası taşıma kaç gün sürüyor?', answer: 'Mesafeye göre 1–3 gün. Aynı gün teslim gereken durumlarda özel araç planlaması yapılabilir.' },
  { id: 'f6', order: 6, question: 'Randevumu değiştirebilir miyim?', answer: 'Google Takvim üzerinden gelen onay e-postasındaki bağlantı ile 24 saat öncesine kadar ücretsiz değiştirebilirsiniz.' }
];

export const rating = { avg: 4.8, count: 412, bars: { 5: 361, 4: 34, 3: 9, 2: 4, 1: 4 } };

export const reviews = [
  { id: 'r1', order: 1, name: 'Elif Kaya', when: '2 hafta önce', stars: 5, avatarUrl: 'https://i.pravatar.cc/80?img=47', text: "Kadıköy'den Ataşehir'e taşındık. Ekip sabah 8'de geldi, akşam olmadan her şey kurulmuştu. Mutfağı kendileri paketledi, tek bir bardak bile kırılmadı." },
  { id: 'r2', order: 2, name: 'Mert Doğan', when: '1 ay önce', stars: 5, avatarUrl: 'https://i.pravatar.cc/80?img=12', text: 'Fiyat hesaplayıcıdan aldığım tutar ile kesin fiyat neredeyse aynıydı, sürpriz ek ücret çıkmadı. Asansörsüz 4. kattan mobilya asansörüyle indirdiler.' },
  { id: 'r3', order: 3, name: 'Zeynep Arslan', when: '1 ay önce', stars: 4, avatarUrl: 'https://i.pravatar.cc/80?img=32', text: 'İstanbul–İzmir taşımam iki günde tamamlandı. Araç bir saat geç geldi ama sürekli bilgilendirdiler, eşyalar eksiksiz teslim edildi.' },
  { id: 'r4', order: 4, name: 'Burak Şen', when: '2 ay önce', stars: 5, avatarUrl: 'https://i.pravatar.cc/80?img=53', text: 'Ofisimizi hafta sonu taşıdılar, pazartesi hiç aksama olmadı. Bilgisayarlar ve dolaplar numaralı etiketlerle geldi, kurulum çok hızlıydı.' },
  { id: 'r5', order: 5, name: 'Ayşe Yıldırım', when: '3 ay önce', stars: 5, avatarUrl: 'https://i.pravatar.cc/80?img=44', text: 'Bir ay depoda kaldı eşyalarım, teslim aldığımda hiç nem veya koku yoktu. Depodan koli de aldım, fiyatları piyasadan uygun.' },
  { id: 'r6', order: 6, name: 'Can Özkan', when: '4 ay önce', stars: 5, avatarUrl: 'https://i.pravatar.cc/80?img=14', text: 'Keşif için gelen arkadaş çok detaylı not aldı, taşıma günü hiçbir şey şaşırtmadı. Piyano taşımasını da sorunsuz yaptılar.' }
];
