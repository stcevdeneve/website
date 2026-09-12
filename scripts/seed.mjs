/**
 * Başlangıç verisini Firestore'a yükler.
 *
 *   1) Firebase Console > Proje ayarları > Hizmet hesapları > Yeni özel anahtar
 *   2) İnen dosyayı app/serviceAccountKey.json olarak kaydet (git'e girmez)
 *   3) npm run seed
 *
 * Var olan dokümanlar üzerine yazar (merge: false), yani dosyadaki hâline döner.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import admin from 'firebase-admin';
import * as d from '../src/firebase/defaults.js';

const require = createRequire(import.meta.url);
let key;
try {
  key = require('../serviceAccountKey.json');
} catch {
  console.error('serviceAccountKey.json bulunamadı. Yukarıdaki adımları izleyin.');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const putDoc = (path, data) => db.doc(path).set(data);
const putAll = (col, rows) =>
  Promise.all(rows.map(({ id, ...rest }) => db.doc(col + '/' + id).set(rest)));

await putDoc('content/site', d.site);
await putDoc('content/hero', d.hero);
await putDoc('content/pricing', d.pricing);
await putDoc('content/rating', d.rating);
await putDoc('content/cities', { list: d.cities });
await putAll('services', d.services);
await putAll('provinces', d.provinces);
await putAll('products', d.products);
await putAll('faqs', d.faqs);
await putAll('reviews', d.reviews);

console.log('Yüklendi: content/{site,hero,pricing,rating,cities} + services, provinces, products, faqs, reviews');
process.exit(0);
