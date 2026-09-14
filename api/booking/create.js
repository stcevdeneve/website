import { calendarFetch, CALENDAR_ID, TIMEZONE } from '../_lib/google.js';
import { isValidDate, isValidSlot, slotRangeIso, rangesOverlap } from '../_lib/slots.js';

function clean(str, max) {
  return String(str || '').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const date = body.date;
  const slot = body.slot;
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const address = clean(body.address, 300);

  if (!isValidDate(date) || !isValidSlot(slot)) {
    res.status(400).json({ error: 'Geçersiz tarih veya saat' });
    return;
  }
  if (!name || !phone) {
    res.status(400).json({ error: 'Ad Soyad ve Telefon zorunludur' });
    return;
  }

  try {
    const { startIso, endIso } = slotRangeIso(date, slot);

    const freeBusyData = await calendarFetch('/freeBusy', {
      method: 'POST',
      body: JSON.stringify({
        timeMin: startIso,
        timeMax: endIso,
        timeZone: TIMEZONE,
        items: [{ id: CALENDAR_ID }]
      })
    });
    const busy = (freeBusyData.calendars && freeBusyData.calendars[CALENDAR_ID] && freeBusyData.calendars[CALENDAR_ID].busy) || [];
    const s = new Date(startIso).getTime();
    const e = new Date(endIso).getTime();
    const taken = busy.some(b => rangesOverlap(s, e, new Date(b.start).getTime(), new Date(b.end).getTime()));

    if (taken) {
      res.status(409).json({ error: 'Bu saat az önce doldu, lütfen başka bir saat seçin' });
      return;
    }

    const event = await calendarFetch(`/calendars/${encodeURIComponent(CALENDAR_ID)}/events`, {
      method: 'POST',
      body: JSON.stringify({
        summary: `Randevu: ${name}`,
        description: `Telefon: ${phone}\nAdres: ${address}\n\nSTC Evden Eve sitesi üzerinden oluşturuldu.`,
        start: { dateTime: startIso, timeZone: TIMEZONE },
        end: { dateTime: endIso, timeZone: TIMEZONE }
      })
    });

    res.status(200).json({ success: true, eventId: event.id });
  } catch (err) {
    res.status(502).json({ error: 'Randevu oluşturulamadı', detail: String(err.message || err) });
  }
}
