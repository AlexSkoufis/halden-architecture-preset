'use client';

import { useRef } from 'react';
import { nav, studio, footerCopy } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { scrollToTarget } from './SmoothScroll';

/** 12 — Closing plate. The wordmark rises out of the bottom edge and stays cropped by it. */
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        '.ft__mark span',
        { yPercent: 70 },
        { yPercent: 0, ease: 'none', stagger: 0.015, scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom bottom', scrub: 0.6 } },
      );
      gsap.from('.ft__cta-line > span', {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.08,
        scrollTrigger: { trigger: '.ft__cta', start: 'top 85%', once: true },
      });
      gsap.from('.ft__cols > *', {
        autoAlpha: 0,
        y: 20,
        stagger: 0.06,
        duration: 1,
        scrollTrigger: { trigger: '.ft__cols', start: 'top 92%', once: true },
      });
    });
  });

  return (
    <footer ref={root} id="contact" className="ft" data-nav="dark">
      <div className="wrap">
        <div className="ft__top">
          <p className="label">Contact <span className="label__index">(12)</span></p>
          <h2 className="ft__cta">
            <span className="ft__cta-line"><span>{footerCopy.line1}</span></span>
            <span className="ft__cta-line"><span>{footerCopy.line2} <em className="serif">{footerCopy.em}</em></span></span>
          </h2>
          <a className="ft__mail" href={`mailto:${studio.email}`} data-cursor="OPEN">
            <span>{studio.email}</span>
            <i className="arrow" aria-hidden="true" />
          </a>
        </div>

        <div className="ft__cols">
          <address className="ft__col">
            <p className="mono mute">Studio</p>
            {studio.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
          <div className="ft__col">
            <p className="mono mute">Contact</p>
            <a className="u-link" href={studio.phoneHref}>{studio.phone}</a>
            <a className="u-link" href={`mailto:${studio.email}`}>{studio.email}</a>
          </div>
          <div className="ft__col">
            <p className="mono mute">Follow</p>
            {studio.social.map((s) => (
              <a key={s.label} className="u-link" href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
          <nav className="ft__col" aria-label="Footer">
            <p className="mono mute">Index</p>
            {nav.filter((_, i) => [0, 1, 2, 5].includes(i)).map((n) => (
              <a
                key={n.href}
                className="u-link"
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(n.href);
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="ft__col ft__col--end mono">
            <span>{studio.coords}</span>
            <button type="button" className="u-link ft__top-btn" onClick={() => scrollToTarget(0)}>
              Back to top ↑
            </button>
          </div>
        </div>

        <div className="ft__base mono">
          <span>© {new Date().getFullYear()} {studio.fullName}</span>
          <span>{studio.descriptor}</span>
          <span>
            Designed by{' '}
            <a className="u-link" href={studio.credit.href} target="_blank" rel="noreferrer">
              {studio.credit.label}
            </a>
          </span>
        </div>
      </div>

      {/* Wordmark scales with its length so any studio name spans the viewport. */}
      <p className="ft__mark" aria-hidden="true" style={{ fontSize: `${Math.min(30, 98 / (studio.wordmark.length * 0.6)).toFixed(1)}vw` }}>
        {studio.wordmark.split('').map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </p>
    </footer>
  );
}
