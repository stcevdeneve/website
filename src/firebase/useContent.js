import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db, firebaseReady } from './client';

/**
 * Firestore'daki content/<id> dokümanını canlı dinler.
 * Firebase yapılandırılmadıysa veya doküman yoksa fallback döner.
 */
export function useDoc(id, fallback) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    if (!firebaseReady) return;
    const unsub = onSnapshot(
      doc(db, 'content', id),
      snap => { if (snap.exists()) setData({ ...fallback, ...snap.data() }); },
      err => console.warn('[firestore] content/' + id, err.message)
    );
    return unsub;
  }, [id]);
  return data;
}

/**
 * Bir koleksiyonu 'order' alanına göre sıralı dinler.
 * Koleksiyon boşsa fallback dizisi kullanılır.
 */
export function useCollection(name, fallback, orderField = 'order') {
  const [items, setItems] = useState(fallback);
  useEffect(() => {
    if (!firebaseReady) return;
    const unsub = onSnapshot(
      query(collection(db, name), orderBy(orderField)),
      snap => {
        const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (rows.length) setItems(rows);
      },
      err => console.warn('[firestore] ' + name, err.message)
    );
    return unsub;
  }, [name, orderField]);
  return items;
}
