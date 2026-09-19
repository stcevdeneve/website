export const SLOTS = ['07:00', '12:00'];
export const APPOINTMENT_DURATION_MIN = 60;

// Türkiye 2016'dan beri sabit UTC+3 kullanıyor (yaz saati uygulaması yok).
const TR_OFFSET = '+03:00';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export function isValidDate(date) {
  return typeof date === 'string' && DATE_RE.test(date);
}

export function isValidSlot(slot) {
  return typeof slot === 'string' && TIME_RE.test(slot) && SLOTS.includes(slot);
}

export function slotRangeIso(date, slot) {
  const start = `${date}T${slot}:00${TR_OFFSET}`;
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + APPOINTMENT_DURATION_MIN * 60000);
  return { startIso: startDate.toISOString(), endIso: endDate.toISOString() };
}

export function dayRangeIso(date) {
  const startDate = new Date(`${date}T00:00:00${TR_OFFSET}`);
  const endDate = new Date(startDate.getTime() + 24 * 3600000);
  return { startIso: startDate.toISOString(), endIso: endDate.toISOString() };
}

export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}
