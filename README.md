# STC Evden Eve — web sitesi

Vite + React tek sayfa uygulaması. Tüm içerik **Firebase Firestore**'dan okunur,
görseller **Firebase Storage**'da tutulur, randevu **Google Takvim Randevu Sayfası**'na devredilir.

```
npm install
cp .env.example .env      # değerleri doldur
npm run dev               # http://localhost:5173
npm run build             # dist/
```

Firebase yapılandırılmadan da çalışır: `src/firebase/defaults.js` içindeki içerik gösterilir.
Firestore'da doküman varsa onun alanları varsayılanların üzerine yazılır — yani kısmi veri de sorun değil.

---

## 1. Firebase kurulumu

1. https://console.firebase.google.com → **Proje ekle** (ör. `stc-evden-eve`).
2. **Build > Firestore Database** → Oluştur → *production mode* → bölge `eur3` (Avrupa).
3. **Build > Storage** → Oluştur (aynı bölge).
4. **Build > Authentication** → Sign-in method → **Google**'ı etkinleştir.
5. **Proje ayarları > Genel > Uygulamalarınız > Web (`</>`)** → uygulama ekle.
   Çıkan config değerlerini `.env` dosyasına yaz.

### Güvenlik kuralları
Depodaki iki dosyayı konsola yapıştır:

| Dosya | Konsol yolu |
|---|---|
| `firestore.rules` | Firestore Database > Kurallar |
| `storage.rules` | Storage > Kurallar |

Kural özeti: **içeriği herkes okur, yalnızca yöneticiler yazar.**
Yönetici tanımlamak için Firestore'da `admins` koleksiyonuna, doküman kimliği
kullanıcının **UID**'si olan boş bir doküman ekle (UID'yi Authentication > Kullanıcılar'da görürsün).

### Başlangıç verisini yükleme
```
# Proje ayarları > Hizmet hesapları > Yeni özel anahtar oluştur
# İnen dosyayı app/serviceAccountKey.json olarak kaydet (git'e girmez)
npm run seed
```

---

## 2. Firestore şeması

Site şu yolları okur. Konsoldan alan değiştirdiğiniz an sayfa **canlı** güncellenir
(`onSnapshot` kullanılıyor, sayfa yenilemeye gerek yok).

### `content/site` — tek doküman
| Alan | Tip | Açıklama |
|---|---|---|
| `phone` | string | Tıklanabilir numara, `+905...` biçiminde |
| `phoneDisplay` | string | Ekranda görünen numara |
| `email` | string | |
| `addressLine1`, `addressLine2` | string | Adresin iki satırı |
| `hoursWeekday`, `hoursSunday` | string | Çalışma saatleri |
| `mapsQuery` | string | Gömülü haritanın arama terimi (ör. `Kadikoy Istanbul`) |
| `mapsLink` | string | "Yol tarifi al" bağlantısı |
| `reviewLink` | string | "Google'da yorum bırak" bağlantısı |
| `bookingUrl` | string | **Google Randevu Sayfası linki** (boşsa `.env`'deki değer kullanılır) |
| `footerNote`, `copyright` | string | |

### `content/hero`
`badge`, `titleLine1`, `titleLine2`, `titleAccent`, `body`, `primaryCta`,
`secondaryCta`, `imageUrl`, `badgeCardTitle`, `badgeCardBody`,
`stats`: `[{ value, label }]` (üç adet).

### `content/pricing` — fiyat hesaplayıcının tüm katsayıları
| Alan | Anlamı |
|---|---|
| `perM3` | m³ başına taşıma/işçilik |
| `baseLocal` / `baseIntercity` | şehir içi / şehirler arası sabit taban |
| `localKmLimit` | bu km'nin altı "şehir içi" sayılır |
| `perKm` | km başına araç ücreti |
| `roadFactor` | kuş uçuşu mesafeyi karayoluna çeviren çarpan |
| `floorWithLift` / `floorNoLift` | kat başına ücret (asansörlü / asansörsüz) |
| `extraPaketPerM3`, `extraVincFlat`, `extraDepoPerM3`, `extraMontajFlat` | ek hizmet ücretleri |
| `rangeLow` / `rangeHigh` | gösterilen fiyat aralığının alt/üst çarpanı (0.92 – 1.1) |
| `homeTypes` | `[{ key, label, vol }]` — ev tipi ve m³ karşılığı |
| `extras` | `[{ key, label, note }]` — `key` değerleri yukarıdaki ücret alanlarına bağlı: `paket, vinc, depo, montaj` |

### `services` koleksiyonu
`order` (number), `title`, `body`, `icon` (`home` | `lift` | `box` | `office`), `accent` (`brown` | `orange`).

### `provinces` koleksiyonu — haritadaki iller
`ad` (il adı, Türkçe yazımıyla), `lat`, `lng`, `tasima` (taşıma sayısı), `merkez` (bool, merkez depo), `order`.
İl adı GeoJSON'daki isimle eşleştirilir; Türkçe karakter ve büyük/küçük harf farkı sorun değil.
**Yeni bir il eklediğinizde haritada sınırı dolgulanır ve üzerine logo işareti düşer.**

### `products` koleksiyonu — kutu & malzeme
`order`, `name`, `desc`, `price` (number, TL), `imageUrl`.

### `faqs` koleksiyonu
`order`, `question`, `answer`.

### `reviews` koleksiyonu + `content/rating`
`reviews`: `order`, `name`, `when`, `stars` (1-5), `text`, `avatarUrl`.
`content/rating`: `avg` (number), `count` (number), `bars` (`{ "5": 361, "4": 34, ... }`).

> Google yorumlarını **otomatik** çekmek için Places API'yi bir Cloud Function ile günlük
> çalıştırıp sonucu bu koleksiyona yazmak gerekir (Places API tarayıcıdan doğrudan çağrılamaz,
> anahtar sızar ve CORS engellenir). Fonksiyon yazılana kadar bu koleksiyon elle doldurulabilir.

---

## 3. Görseller — Firebase Storage

1. Storage > Dosya yükle → `site/` klasörü altına koy (kurallar bu yolu bekliyor).
2. Dosyaya tıkla → **Erişim jetonu ile indirme URL'si**ni kopyala.
3. URL'yi ilgili Firestore alanına yapıştır (`hero.imageUrl`, `products[].imageUrl`, `reviews[].avatarUrl`).

Şu an varsayılanlarda dış kaynaklı örnek fotoğraflar var; gerçek fotoğraflar yüklendikçe
URL'leri değiştirmek yeterli, kod dokunmuyor.

---

## 4. Google Takvim randevu bağlantısı

1. Google Takvim > **Randevu sayfası oluştur** (Appointment schedule) → süre, uygun saatler, tampon.
2. **Paylaş** → "Bağlantıyı kopyala" (`https://calendar.app.google/...`).
3. Bu linki `content/site.bookingUrl` alanına (veya `.env` içindeki `VITE_GOOGLE_BOOKING_URL`) yaz.

Sitedeki takvim görsel olarak bizim: kullanıcı gün ve saat seçer, "Randevuyu onayla"
butonu Google'a `?date=YYYYMMDD&time=HH:MM` parametreleriyle gider ve kayıt Google tarafında oluşur.
Sitedeki saat listesi `src/components/Appointment.jsx` içindeki `SLOTS` dizisidir —
Google'daki uygun saatlerle aynı tutulmalı.

---

## 5. Vercel'e yayınlama

### Arayüzden (önerilen)
1. Projeyi bir GitHub reposuna push et.
2. https://vercel.com/new → repoyu içe aktar.
3. **Root Directory**: `app` (repo kökünde değilse). Framework otomatik **Vite** algılanır.
4. **Environment Variables** → `.env.example`'daki tüm anahtarları ekle:

```
VITE_FB_API_KEY
VITE_FB_AUTH_DOMAIN
VITE_FB_PROJECT_ID
VITE_FB_STORAGE_BUCKET
VITE_FB_MESSAGING_SENDER_ID
VITE_FB_APP_ID
VITE_GOOGLE_BOOKING_URL
```

   Hepsini **Production, Preview ve Development** ortamlarının üçüne de işaretle.
5. Deploy. Sonraki her `git push` otomatik yayına çıkar.

### CLI ile
```
npm i -g vercel
vercel            # ilk kurulum, sorulara Enter
vercel env add VITE_FB_API_KEY production
# ... diğer anahtarlar
vercel --prod
```

### Notlar
- `VITE_` ile başlayan değişkenler tarayıcıya gömülür — bu normaldir, Firebase web
  anahtarı gizli değildir; güvenlik **Firestore/Storage kurallarıyla** sağlanır.
- Ortam değişkenini değiştirdikten sonra **yeniden deploy** gerekir (build sırasında gömülür).
- Firebase Console > Authentication > **Settings > Yetkili alan adları** listesine
  Vercel alan adını (`*.vercel.app` ve varsa kendi domaininiz) eklemeyi unutma.
- Kendi domaininizi Vercel > Settings > Domains altından ücretsiz bağlayabilirsiniz.

---

## 6. Dosya düzeni

```
app/
  index.html                 fontlar, meta, body reset
  vercel.json                Vite + SPA rewrite
  firestore.rules            "herkes okur, yönetici yazar"
  storage.rules              görseller için aynı mantık
  scripts/seed.mjs           başlangıç verisini Firestore'a yükler
  src/
    main.jsx  App.jsx        bölümlerin sırası App.jsx'te
    styles.js                palet + tekrar eden stiller + fmtTRY
    firebase/
      client.js              SDK init (env yoksa devre dışı)
      useContent.js          useDoc / useCollection — canlı dinleme + fallback
      defaults.js            Firestore boşken kullanılan tüm içerik
    hooks/
      useReveal.js           aşağı inildikçe alttan yükselme animasyonu
      useIsMobile.js         1060px altı = mobil (burger menü, sabit telefon butonu)
    components/
      Header.jsx  CallFab.jsx
      Hero.jsx  Services.jsx
      PriceCalculator.jsx    mesafe + kat + ek hizmet hesabı
      Appointment.jsx        takvim + Google'a devir
      Reviews.jsx
      Coverage.jsx  TurkeyMap.jsx   81 il sınırı, d3-geo ile
      Store.jsx  Contact.jsx  Faq.jsx  Footer.jsx
```

## 7. Devralan geliştirici için açık işler
- Places API → Cloud Function ile `reviews` + `content/rating` güncelleme (günlük cron).
- Randevu ve sipariş taleplerini Firestore'a kaydetme (bu turda kapsam dışı bırakıldı).
- `Appointment.jsx` içindeki `SLOTS` dizisini Google'daki uygun saatlerle senkron tutmak
  veya Calendar API'ye bağlamak.
- Gerçek telefon, e-posta, adres ve fotoğraflar hâlâ örnek değerlerde.
