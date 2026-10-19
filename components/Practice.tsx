'use client';

import { useRef, useState } from 'react';
import { pillars } from '@/lib/content';
import { gsap, ScrollTrigger, useGsap, revealImage, parallax, MQ } from '@/lib/motion';
import { Img } from './Img';

const TONES: Record<string, string> = { paper: '#f3f1ec', stone: '#e4e1d9', sand: '#ebe4d8' };

/**
 * 05 — Practice. Desktop: the numeral and title hold still on the left while panels
 * scroll past on the right; the ground colour shifts with each pillar.
 * Below 1024px the sticky collapses into a simple sequence.
 */
export default function Practice() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGsap(root, () => {
    const panels = gsap.utils.toArray<HTMLElement>('.pillar', root.current);
    panels.forEach((panel, i) => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (!self.isActive) return;
          setActive(i);
          gsap.to(root.current, { backgroundColor: TONES[pillars[i].tone], duration: 1.2, ease: 'power2.out', overwrite: true });
        },
      });
    });

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      panels.forEach((panel) => {
        const frame = panel.querySelector('.pillar__frame');
        if (frame) {
          revealImage(frame, { from: 'inset(0% 0% 0% 100%)' });
          parallax(frame, 12);
        }
        gsap.from(panel.querySelectorAll('.pillar__text > *'), {
          autoAlpha: 0,
          y: 30,
          stagger: 0.08,
          duration: 1.1,
          scrollTrigger: { trigger: panel.querySelector('.pillar__text'), start: 'top 85%', once: true },
        });
      });
      gsap.from('.practice__rail i', {
        scaleY: 0,
        transformOrigin: 'top',
        stagger: 0.1,
        duration: 1.2,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      });
    });
  });

  return (
    <section ref={root} id="practice" className="practice" data-nav="light" aria-labelledby="practice-title">
      <div className="wrap grid practice__grid">
        <div className="practice__aside">
          <div className="practice__sticky">
            <p className="label">
              Practice <span className="label__index">(05)</span>
            </p>
            <h2 id="practice-title" className="sr-only">
              Practice: {pillars.map((p) => p.title.toLowerCase()).join(', ')}
            </h2>
            <div className="practice__no" aria-hidden="true">
              <span className="roll roll--big">
                <span style={{ transform: `translateY(${-active * 0.9}em)` }}>
                  {pillars.map((p) => (
                    <b key={p.no}>{p.no}</b>
                  ))}
                </span>
              </span>
            </div>
            <div className="practice__titles" aria-hidden="true">
              {pillars.map((p, i) => (
                <span key={p.no} className={`practice__title ${i === active ? 'is-active' : i < active ? 'is-past' : 'is-future'}`}>
                  <span>{p.title}</span>
                </span>
              ))}
            </div>
            <ol className="practice__rail mono" aria-hidden="true">
              {pillars.map((p, i) => (
                <li key={p.no} className={i === active ? 'on' : ''}>
                  <i />
                  {p.no} {p.kicker}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="practice__panels">
          {pillars.map((p) => (
            <article key={p.no} className="pillar" aria-labelledby={`pillar-${p.no}`}>
              <header className="pillar__head">
                <span className="mono">{p.no}</span>
                <h3 id={`pillar-${p.no}`}>{p.title}</h3>
              </header>
              <figure className="pillar__figure">
                <div className="frame pillar__frame" data-cursor="VIEW">
                  <Img image={p.image} alt={p.caption} sizes="(min-width: 1024px) 50vw, 92vw" />
                </div>
                <figcaption className="mono mute">
                  <span>Fig. {p.no}</span> {p.caption}
                </figcaption>
              </figure>
              <div className="pillar__text">
                <p className="label">{p.kicker}</p>
                <p className="pillar__body">{p.body}</p>
                <ul className="pillar__meta mono">
                  {p.meta.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
