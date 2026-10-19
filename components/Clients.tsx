'use client';

import { useRef } from 'react';
import { clients, clientsCopy } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';

/** 10 — Clients as typographic wordmarks on a hairline grid (swap in logo files if needed). */
export default function Clients() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.cl__grid', start: 'top 85%', once: true } });
      tl.from('.cl__grid', { '--h': 0, '--v': 0, duration: 1.6, ease: 'expo.inOut' })
        .from('.cl__cell', { autoAlpha: 0, y: 16, duration: 1, stagger: { each: 0.04, grid: 'auto', from: 'start' } }, 0.3);
    });
  });

  return (
    <section ref={root} className="cl" data-nav="light" aria-labelledby="cl-title">
      <div className="wrap grid">
        <header className="cl__head">
          <p className="label">
            {clientsCopy.label} <span className="label__index">(10)</span>
          </p>
          <h2 id="cl-title" className="cl__statement">
            {clientsCopy.statement}
          </h2>
        </header>
        <ul className="cl__grid" aria-label="Selected clients">
          {clients.map((c) => (
            <li key={c.name} className="cl__cell">
              <span className={`cl__mark cl__mark--${c.style}`}>{c.name}</span>
            </li>
          ))}
          <li className="cl__cell cl__cell--more mono">
            <span>+ private clients</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
