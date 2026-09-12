import React, { useEffect, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { c } from '../styles';

const GEO_URL = 'https://cdn.jsdelivr.net/gh/alpers/Turkey-Maps-GeoJSON@master/tr-cities.json';

const norm = s => (s || '').toString().toLocaleLowerCase('tr')
  .replace(/i̇/g, 'i').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
  .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z]/g, '');

/**
 * İl sınırlarını gerçek GeoJSON'dan çizer. Hizmet verilen iller dolu renkte ve
 * üzerinde logo işareti taşır; diğerleri açık gri "talep üzerine".
 */
export default function TurkeyMap({ provinces, isMobile }) {
  const wrapRef = useRef(null);
  const [geo, setGeo] = useState(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [tip, setTip] = useState(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(GEO_URL).then(r => r.json())
      .then(j => { if (alive) setGeo(j); })
      .catch(e => console.warn('[map] geojson', e.message));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const byName = new Map((provinces || []).map(p => [norm(p.ad), p]));
  const ready = geo && size.w > 0 && size.h > 0;

  let paths = [];
  if (ready) {
    const inset = isMobile ? 3 : 14;
    const proj = geoMercator().fitExtent(
      [[inset, isMobile ? 4 : 22], [size.w - inset, size.h - (isMobile ? 22 : 40)]],
      geo
    );
    const path = geoPath(proj);
    paths = geo.features.map((f, i) => {
      const label = f.properties?.name || f.properties?.NAME_1 || '';
      const rec = byName.get(norm(label)) || null;
      return { i, label, rec, d: path(f), centroid: path.centroid(f) };
    });
  }

  const fillFor = p => {
    const on = hover === p.i;
    if (p.rec?.merkez) return on ? '#ff8f1f' : c.orange;
    if (p.rec) return on ? '#B8825C' : '#C99B7A';
    return on ? '#D8CEBF' : '#E3DCD1';
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#fff' }}>
      <svg viewBox={`0 0 ${size.w} ${size.h}`} style={{ display: 'block', width: '100%', height: '100%' }}
        aria-label="STC Evden Eve hizmet verilen iller haritası">
        <g>
          {paths.map(p => (
            <path key={p.i} d={p.d} fill={fillFor(p)} stroke={c.bg} strokeWidth={0.8}
              style={{ cursor: p.rec ? 'pointer' : 'default', transition: 'fill .15s' }}
              onMouseMove={ev => {
                const r = wrapRef.current.getBoundingClientRect();
                setHover(p.i);
                setTip({ x: ev.clientX - r.left, y: ev.clientY - r.top, p });
              }}
              onMouseLeave={() => { setHover(null); setTip(null); }}
              onTouchStart={ev => {
                const t = ev.touches[0];
                const r = wrapRef.current.getBoundingClientRect();
                setHover(p.i);
                setTip({ x: t.clientX - r.left, y: t.clientY - r.top, p });
              }}>
              <title>{p.label}</title>
            </path>
          ))}
        </g>

        <g style={{ pointerEvents: 'none' }}>
          {paths.filter(p => p.rec).map(p => {
            const r = p.rec.merkez ? 11 : 8;
            const [x, y] = p.centroid;
            if (!x || Number.isNaN(x)) return null;
            return (
              <g key={'m' + p.i} transform={`translate(${x},${y - (isMobile ? 0 : 5)})`}>
                {p.rec.merkez && (
                  <circle r={15} fill="none" stroke="#8A4A00" opacity={0.45}>
                    <animate attributeName="r" values="12;26" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle r={r} fill={c.ink} stroke={c.bg} strokeWidth={1.4} />
                <image href="/logo.svg" width={r * 1.15} height={r * 1.22}
                  x={-r * 0.575} y={-r * 0.61} style={{ filter: 'brightness(0) invert(1)' }} />
              </g>
            );
          })}
        </g>

        {!isMobile && (
          <g style={{ pointerEvents: 'none' }}>
            {paths.map(p => {
              const [x, y] = p.centroid;
              if (!x || Number.isNaN(x)) return null;
              const served = !!p.rec;
              return (
                <text key={'t' + p.i} x={x} y={y + (served ? (p.rec.merkez ? 24 : 20) : 4)}
                  textAnchor="middle" fontSize={served ? 12.5 : 10.5} fontWeight={600}
                  fill={served ? c.ink : '#8C7663'}
                  style={{ paintOrder: 'stroke', stroke: 'rgba(255,255,255,.75)', strokeWidth: 2.6, strokeLinejoin: 'round' }}>
                  {p.label}
                </text>
              );
            })}
          </g>
        )}
      </svg>

      {tip && (
        <div style={{
          position: 'absolute', left: tip.x, top: tip.y, pointerEvents: 'none',
          background: c.ink, color: c.bg, padding: '8px 11px', borderRadius: 10,
          fontSize: 12.5, lineHeight: 1.45, whiteSpace: 'nowrap',
          boxShadow: '0 10px 26px rgba(42,29,20,.28)', transform: 'translate(-50%,-124%)', zIndex: 3
        }}>
          <b style={{ color: '#fff', fontSize: 13.5 }}>{tip.p.label}</b><br />
          {tip.p.rec
            ? `${(tip.p.rec.tasima || 0).toLocaleString('tr-TR')} taşıma${tip.p.rec.merkez ? ' · merkez depo' : ''}`
            : 'Talep üzerine hizmet'}
        </div>
      )}

      {!ready && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#8A7461'
        }}>harita yükleniyor…</div>
      )}
    </div>
  );
}
