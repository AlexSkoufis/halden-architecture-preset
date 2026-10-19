'use client';

import { useRef } from 'react';
import { morph } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';

// Deterministic contour field: nested, slightly irregular rings around two summits.
function contours() {
  const out: { d: string; key: string }[] = [];
  const summits = [
    { cx: 690, cy: 380, rings: 13, seed: 1.3 },
    { cx: 1180, cy: 620, rings: 8, seed: 4.1 },
  ];
  for (const s of summits) {
    for (let k = 0; k < s.rings; k++) {
      const base = 26 + k * 46;
      const pts: string[] = [];
      for (let a = 0; a <= 96; a++) {
        const t = (a / 96) * Math.PI * 2;
        const r =
          base +
          Math.sin(t * 2 + s.seed + k * 0.21) * (6 + k * 3.2) +
          Math.sin(t * 3 - s.seed * 0.7 + k * 0.13) * (4 + k * 1.8) +
          Math.cos(t * 5 + k * 0.4) * (1.5 + k * 0.6);
        pts.push(`${(s.cx + Math.cos(t) * r * 1.35).toFixed(1)},${(s.cy + Math.sin(t) * r).toFixed(1)}`);
      }
      out.push({ d: `M${pts.join('L')}Z`, key: `${s.seed}-${k}` });
    }
  }
  return out;
}
const RINGS = contours();

// Approximate advance widths (em) of light Inter Tight capitals. Each letter slot takes the
// wider of its two letters, so shared letters sit exactly on top of each other.
const W: Record<string, number> = {
  A: 0.66, B: 0.6, C: 0.7, D: 0.7, E: 0.56, F: 0.53, G: 0.74, H: 0.7, I: 0.25, J: 0.45, K: 0.6, L: 0.5, M: 0.82,
  N: 0.72, O: 0.78, P: 0.58, Q: 0.78, R: 0.6, S: 0.58, T: 0.58, U: 0.7, V: 0.64, W: 0.92, X: 0.62, Y: 0.6, Z: 0.6,
};
const FROM = [...morph.from.toUpperCase()];
const TO = [...morph.to.toUpperCase()];
const SLOTS = FROM.map((l, i) => Math.max(W[l] ?? 0.65, W[TO[i]] ?? 0.65) * 0.94 + 0.02);
const TOTAL = SLOTS.reduce((a, b) => a + b, 0);
// Fit the word to ~84% of the viewport width, capped by height.
const FONT_SIZE = `min(${(84 / TOTAL).toFixed(2)}vw, 44svh)`;

/**
 * 04 — Signature word morph. A pinned dark stage: contour lines draw in, the outlined
 * `morph.from` word is wiped into the solid `morph.to` word, then the quote resolves
 * word by word. Configure both words in lib/content.ts (same number of letters).
 */
export default function WordMorph() {
  const root = useRef<HTMLElement>(null);
  const words = morph.quote.split(' ');

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const rings = gsap.utils.toArray<SVGPathElement>('.sp__ring', root.current);
      rings.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
      });
      tl.to(rings, { strokeDashoffset: 0, duration: 1.2, stagger: { each: 0.05, from: 'start' } }, 0)
        .fromTo('.sp__field', { scale: 1.18, rotate: -3 }, { scale: 1, rotate: 0, duration: 3.2 }, 0)
        .from('.sp__grid line', { scaleY: 0, transformOrigin: '50% 0%', duration: 0.8, stagger: 0.04 }, 0)
        .from('.sp__word--space', { autoAlpha: 0, yPercent: 8, duration: 0.4 }, 0.1)
        .fromTo('.sp__word--place', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power1.inOut' }, 0.55)
        .fromTo('.sp__scan', { xPercent: 0 }, { xPercent: 100, duration: 1.3, ease: 'power1.inOut' }, 0.55)
        .to('.sp__scan', { autoAlpha: 0, duration: 0.15 }, 1.8)
        .to('.sp__word--space', { autoAlpha: 0, duration: 0.3 }, 1.8)
        .to('.sp__def--space', { autoAlpha: 0.25, duration: 0.4 }, 1.1)
        .from('.sp__def--place', { autoAlpha: 0, y: 12, duration: 0.4 }, 1.4)
        .to('.sp__ring--place', { stroke: '#c98a6d', strokeWidth: 1.6, duration: 0.5 }, 1.6)
        .from('.sp__word-q', { opacity: 0.14, duration: 0.2, stagger: 0.04 }, 1.9)
        .from('.sp__cite', { autoAlpha: 0, y: 10, duration: 0.3 }, 1.9 + words.length * 0.04);

      // Keep the scan readout in step with the wipe.
      const readout = root.current!.querySelector('.sp__readout');
      tl.eventCallback('onUpdate', () => {
        const t = gsap.utils.clamp(0, 1, (tl.time() - 0.55) / 1.3);
        if (readout) readout.textContent = `x ${t.toFixed(2)}`;
      });
    });
  });

  return (
    <section ref={root} id="space-place" className="sp" data-nav="dark" aria-labelledby="sp-title">
      <div className="sp__stage">
        <svg className="sp__field" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="sp__grid">
            {Array.from({ length: 11 }, (_, i) => (
              <line key={i} x1={i * 160} y1="0" x2={i * 160} y2="1000" />
            ))}
          </g>
          {RINGS.map((r, i) => (
            <path key={r.key} d={r.d} className={`sp__ring${i === 6 ? ' sp__ring--place' : ''}`} />
          ))}
        </svg>

        <p className="label sp__label">
          {morph.label} <span className="label__index">(04)</span>
        </p>

        <h2 id="sp-title" className="sp__words" aria-label={morph.label} style={{ fontSize: FONT_SIZE }}>
          <span className="sp__word sp__word--space" aria-hidden="true">
            {FROM.map((l, i) => (
              <span key={i} className="sp__slot" style={{ width: `${SLOTS[i]}em` }}>{l}</span>
            ))}
          </span>
          <span className="sp__word sp__word--place" aria-hidden="true">
            {TO.map((l, i) => (
              <span key={i} className="sp__slot" style={{ width: `${SLOTS[i]}em` }}>{l}</span>
            ))}
          </span>
          <span className="sp__scan" aria-hidden="true">
            <span className="sp__readout mono">x 0.00</span>
          </span>
        </h2>

        <div className="sp__defs mono" aria-hidden="true">
          {morph.defs.map((d, i) => (
            <p key={d.word} className={`sp__def ${i === 0 ? 'sp__def--space' : 'sp__def--place'}`}>
              <b>{d.word}</b> {d.ipa} n. — {d.text}
            </p>
          ))}
        </div>

        <figure className="sp__quote">
          <blockquote>
            <p>
              {words.map((w, i) => (
                <span key={i} className="sp__word-q">
                  {w}{' '}
                </span>
              ))}
            </p>
          </blockquote>
          <figcaption className="sp__cite mono">
            — {morph.author}, {morph.role}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
