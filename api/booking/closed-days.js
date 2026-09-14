import { calendarFetch, CALENDAR_ID, TIMEZONE } from '../_lib/google.js';

// Türkiye 2016'dan beri sabit UTC+3 kullanıyor (yaz saati uygulaması yok).
const TR_OFFSET = '+03:00';

function pad(n) { return String(n).padStart(2, '0'); }

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const year = parseInt(req.query.year, 10);
  const month = parseInt(req.query.month, 10); // 1-12
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    res.status(400).json({ error: 'Geçersiz yıl/ay' });
    return;
  }

  try {
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthStartIso = new Date(`${year}-${pad(month)}-01T00:00:00${TR_OFFSET}`).toISOString();
    const monthEndIso = new Date(new Date(`${year}-${pad(month)}-${pad(daysInMonth)}T00:00:00${TR_OFFSET}`).getTime() + 24 * 3600000).toISOString();

    const data = await calendarFetch('/freeBusy', {
      method: 'POST',
      body: JSON.stringify({
        timeMin: monthStartIso,
        timeMax: monthEndIso,
        timeZone: TIMEZONE,
        items: [{ id: CALENDAR_ID }]
      })
    });

    const busy = (data.calendars && data.calendars[CALENDAR_ID] && data.calendars[CALENDAR_ID].busy) || [];
    const busyRanges = busy.map(b => ({ start: new Date(b.start).getTime(), end: new Date(b.end).getTime() }));

    const closedDates = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStart = new Date(`${year}-${pad(month)}-${pad(d)}T00:00:00${TR_OFFSET}`).getTime();
      const dayEnd = dayStart + 24 * 3600000;
      const closed = busyRanges.some(b => b.start <= dayStart + 5 * 60000 && b.end >= dayEnd - 5 * 60000);
      if (closed) closedDates.push(`${year}-${pad(month)}-${pad(d)}`);
    }

    res.status(200).json({ year, month, closedDates });
  } catch (err) {
    res.status(502).json({ error: 'Takvim okunamadı', detail: String(err.message || err) });
  }
}
