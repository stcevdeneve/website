import { calendarFetch, CALENDAR_ID, TIMEZONE } from '../_lib/google.js';
import { SLOTS, APPOINTMENT_DURATION_MIN, isValidDate, dayRangeIso, slotRangeIso, rangesOverlap } from '../_lib/slots.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const date = req.query.date;
  if (!isValidDate(date)) {
    res.status(400).json({ error: 'Geçersiz tarih' });
    return;
  }

  try {
    const { startIso, endIso } = dayRangeIso(date);
    const data = await calendarFetch('/freeBusy', {
      method: 'POST',
      body: JSON.stringify({
        timeMin: startIso,
        timeMax: endIso,
        timeZone: TIMEZONE,
        items: [{ id: CALENDAR_ID }]
      })
    });

    const busy = (data.calendars && data.calendars[CALENDAR_ID] && data.calendars[CALENDAR_ID].busy) || [];
    const busyRanges = busy.map(b => ({ start: new Date(b.start).getTime(), end: new Date(b.end).getTime() }));

    const dayStart = new Date(startIso).getTime();
    const dayEnd = new Date(endIso).getTime();
    const dayClosed = busyRanges.some(b => b.start <= dayStart + 5 * 60000 && b.end >= dayEnd - 5 * 60000);

    const slots = SLOTS.map(time => {
      const { startIso: sIso, endIso: eIso } = slotRangeIso(date, time);
      const s = new Date(sIso).getTime();
      const e = new Date(eIso).getTime();
      const taken = dayClosed || busyRanges.some(b => rangesOverlap(s, e, b.start, b.end));
      return { time, available: !taken };
    });

    res.status(200).json({ date, dayClosed, duration: APPOINTMENT_DURATION_MIN, slots });
  } catch (err) {
    res.status(502).json({ error: 'Takvim okunamadı', detail: String(err.message || err) });
  }
}
