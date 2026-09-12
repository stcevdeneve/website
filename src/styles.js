// Marka paleti ve tekrar eden stil parçaları.
export const c = {
  bg: '#EFECE6',
  bgAlt: '#E6E1D8',
  ink: '#2A1D14',
  ink70: '#4A3728',
  ink55: '#6B5544',
  ink40: '#8A7461',
  brown: '#A06948',
  orange: '#E87A00',
  orangeDark: '#C96A00',
  line: 'rgba(160,105,72,0.14)',
  lineStrong: 'rgba(160,105,72,0.28)',
  field: '#FBFAF8',
  white: '#fff'
};

export const mono = "'Geist Mono', ui-monospace, monospace";

export const card = {
  background: c.white,
  border: '1px solid ' + c.line,
  borderRadius: 20,
  padding: 24
};

export const section = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: 'clamp(40px,6vw,72px) 20px'
};

export const kicker = {
  fontFamily: mono,
  fontSize: 12,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: c.brown
};

export const h2 = {
  margin: '10px 0 0',
  fontSize: 'clamp(28px,3.6vw,42px)',
  fontWeight: 700,
  letterSpacing: '-0.03em'
};

export const lead = {
  margin: '10px 0 0',
  maxWidth: '58ch',
  fontSize: 15.5,
  lineHeight: 1.6,
  color: c.ink55,
  textWrap: 'pretty'
};

export const field = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 12,
  border: '1px solid ' + c.lineStrong,
  background: c.field,
  fontSize: 14.5,
  color: c.ink,
  outline: 'none'
};

export const btnPrimary = {
  padding: '14px 24px',
  borderRadius: 14,
  background: c.brown,
  color: c.white,
  fontSize: 15,
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 10px 24px rgba(160,105,72,0.30)'
};

export const btnGhost = {
  padding: '14px 24px',
  borderRadius: 14,
  background: 'transparent',
  border: '1px solid rgba(160,105,72,0.35)',
  color: c.ink70,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer'
};

export const fmtTRY = (n, round = true) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
    .format(round ? Math.round(n / 10) * 10 : Math.round(n));
