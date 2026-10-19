'use client';

import { useRef } from 'react';
import { selected, gridCopy } from '@/lib/content';
import { gsap, useGsap, revealImage, parallax, revealLines, MQ } from '@/lib/motion';
import { Img } from './Img';

const LAYOUT = ['g--a', 'g--b', 'g--c', 'g--d'];
const SIZES = ['(min-width: 1024px) 64vw, 92vw', '(min-width: 1024px) 24vw, 60vw', '(min-width: 1024px) 64vw, 92vw', '(min-width: 1024px) 40vw, 80vw'];

/** 09 — Secondary portfolio as an asymmetric editorial spread; the large word drifts sideways with scroll. */
export default function ProjectGrid() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.utils.toArray<HTMLElement>('.g__frame', root.current).forEach((f) => {
        revealImage(f);
        parallax(f, 9);
      });
      gsap.utils.toArray<HTMLElement>('.g__meta', root.current).forEach((m) => {
        gsap.from(m, { autoAlpha: 0, y: 16, duration: 1.1, scrollTrigger: { trigger: m, start: 'top 95%', once: true } });
      });
      revealLines('.g__title', { start: 'top 85%' });
      gsap.fromTo(
        '.g__drift',
        { xPercent: 4 },
        { xPercent: -22, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
  });

  return (
    <section ref={root} className="g" data-nav="light" aria-labelledby="g-title">
      <div className="wrap">
        <header className="g__head grid">
          <p className="label">
            {gridCopy.label} <span className="label__index">(09)</span>
          </p>
          <h2 id="g-title" className="g__title display">
            {gridCopy.title[0]} <br />
            {gridCopy.title[1]}<em className="serif">{gridCopy.em}</em>
          </h2>
        </header>

        <div className="g__grid">
          {selected.map((p, i) => (
            <article key={p.name} className={`g__item ${LAYOUT[i]}`}>
              <a href="#projects" className="g__link" data-cursor="VIEW" aria-label={`${p.name}, ${p.location}, ${p.year}`}>
                <div className="frame g__frame">
                  <Img image={p.image} alt="" sizes={SIZES[i]} />
                </div>
                <div className="g__meta">
                  <span className="mono mute">{String(i + 6).padStart(2, '0')}</span>
                  <h3 className="g__name">{p.name}</h3>
                  <span className="g__loc">{p.location}</span>
                  <span className="g__typ mute">{p.typology}</span>
                  <span className="g__year mono">{p.year}</span>
                  <span className="g__view mono" aria-hidden="true">
                    View project <i className="arrow" />
                  </span>
                </div>
              </a>
            </article>
          ))}

          <p className="g__drift" aria-hidden="true">
            {gridCopy.drift}
          </p>

          <div className="g__note">
            <p className="g__text">{gridCopy.text}</p>
            <a className="arrow-link" href="#projects" data-cursor="EXPLORE">
              <span>{gridCopy.cta}</span>
              <i className="arrow" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
