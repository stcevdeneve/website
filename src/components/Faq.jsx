import React, { useState } from 'react';
import { c, kicker, h2 } from '../styles';

export default function Faq({ faqs }) {
  const [open, setOpen] = useState(0);

  return (
    <section id="sss" style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(40px,6vw,80px) 20px' }}>
      <div data-reveal>
        <span style={kicker}>07 — S.S.S.</span>
        <h2 style={{ ...h2, marginBottom: 26 }}>Sık sorulan sorular</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.id || f.question} style={{ background: '#fff', border: '1px solid ' + c.line, borderRadius: 18, overflow: 'hidden' }}
              data-reveal data-reveal-delay={i * 50}>
              <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} style={{
                width: '100%', textAlign: 'left', padding: '18px 20px', background: 'transparent',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 16, fontSize: 16, fontWeight: 600,
                color: c.ink, letterSpacing: '-0.01em'
              }}>
                {f.question}
                <span style={{
                  flex: 'none', width: 26, height: 26, borderRadius: 8,
                  background: 'rgba(160,105,72,0.12)', color: c.brown,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                }}>{isOpen ? '−' : '+'}</span>
              </button>

              {/* grid-template-rows 0fr → 1fr: yumuşak açılıp kapanma */}
              <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows .42s cubic-bezier(.22,.68,.28,1)' }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    padding: '0 20px 20px', fontSize: 15, lineHeight: 1.65, color: c.ink55,
                    maxWidth: '70ch', opacity: isOpen ? 1 : 0,
                    transition: 'opacity .32s ease ' + (isOpen ? '.1s' : '0s')
                  }}>{f.answer}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
