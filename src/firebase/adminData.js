import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './client';

export async function loadContentDoc(id, fallback) {
  const snap = await getDoc(doc(db, 'content', id));
  return snap.exists() ? { ...fallback, ...snap.data() } : { ...fallback };
}

export async function saveContentDoc(id, data) {
  await setDoc(doc(db, 'content', id), data);
}

export async function loadCollection(name, fallback) {
  const snap = await getDocs(collection(db, name));
  if (snap.empty) return { items: fallback.map(x => ({ ...x })), originalIds: [] };
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return { items, originalIds: items.map(i => i.id) };
}

export async function saveCollection(name, items, originalIds) {
  const keepIds = new Set(items.map(i => i.id));
  const toDelete = originalIds.filter(id => !keepIds.has(id));
  await Promise.all([
    ...items.map(({ id, ...rest }) => setDoc(doc(db, name, id), rest)),
    ...toDelete.map(id => deleteDoc(doc(db, name, id)))
  ]);
}

export async function checkIsAdmin(uid) {
  const snap = await getDoc(doc(db, 'admins', uid));
  return snap.exists();
}

export function slugify(text) {
  const trMap = { ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', I: 'i', İ: 'i', ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u' };
  const base = String(text || '').replace(/[çÇğĞıIİöÖşŞüÜ]/g, ch => trMap[ch] || ch);
  const slug = base.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return (slug || 'kayit') + '-' + Math.random().toString(36).slice(2, 7);
}
