import { useEffect } from 'react';

/**
 * Sayfada aşağı inildikçe elementleri alttan hafifçe yükselterek gösterir.
 * data-reveal taşıyan her element gözlemlenir.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const armed = new Set();
    const show = el => {
      armed.delete(el);
      io.unobserve(el);
      el.style.transitionDelay = (el.dataset.revealDelay || 0) + 'ms';
      el.style.opacity = '1';
      el.style.transform = 'none';
    };

    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) show(en.target);
        else if (en.boundingClientRect.bottom < 0) { en.target.dataset.revealDelay = 0; show(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    const scan = () => {
      document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach(el => {
        el.dataset.revealed = '1';
        armed.add(el);
        el.style.opacity = '0';
        el.style.transform = 'translateY(26px)';
        el.style.transition = 'opacity .62s cubic-bezier(.22,.68,.28,1), transform .68s cubic-bezier(.22,.68,.28,1)';
        io.observe(el);
      });
    };

    const sweep = () => armed.forEach(el => {
      if (el.getBoundingClientRect().bottom < 0) { el.dataset.revealDelay = 0; show(el); }
    });

    scan();
    const t1 = setTimeout(() => { scan(); sweep(); }, 500);
    const failsafe = setTimeout(() => armed.forEach(el => { el.dataset.revealDelay = 0; show(el); }), 2500);
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('hashchange', sweep);

    return () => {
      clearTimeout(t1); clearTimeout(failsafe); io.disconnect();
      window.removeEventListener('scroll', sweep);
      window.removeEventListener('hashchange', sweep);
    };
  }, []);
}
