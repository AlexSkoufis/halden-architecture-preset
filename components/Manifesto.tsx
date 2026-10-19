'use client';

import { useRef } from 'react';
import { manifesto } from '@/lib/content';
import { gsap, useGsap, revealLines, MQ } from '@/lib/motion';

/** 02 — Introduction as an editorial manifesto. The hero's grid rule continues down into it. */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      revealLines('.manifesto__statement', { start: 'top 80%', stagger: 0.08 });
      gsap.from('.manifesto__rule', {
        scaleY: 0,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true },
      });
      gsap.from('.manifesto__aside > *', {
        autoAlpha: 0,
        y: 24,
        stagger: 0.08,
        duration: 1.1,
        scrollTrigger: { trigger: '.manifesto__aside', start: 'top 85%', once: true },
      });
      gsap.from('.pioneer__row', {
        autoAlpha: 0,
        x: -16,
        stagger: 0.07,
        duration: 1,
        scrollTrigger: { trigger: '.pioneer', start: 'top 88%', once: true },
      });
      gsap.from('.pioneer__row .hair', {
        scaleX: 0,
        transformOrigin: 'left',
        stagger: 0.07,
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.pioneer', start: 'top 88%', once: true },
      });
    });
  });

  return (
    <section ref={root} className="manifesto" id="studio-intro" data-nav="light" aria-labelledby="manifesto-title">
      <span className="manifesto__rule" aria-hidden="true" />
      <div className="wrap grid">
        <p className="label manifesto__label">
          <span>{manifesto.label[0]}</span> / <span>{manifesto.label[1]}</span>
          <span className="label__index">(02)</span>
        </p>

        <h2 id="manifesto-title" className="manifesto__statement display">
          {manifesto.statement.text} <em className="serif">{manifesto.statement.em}</em>
        </h2>

        <div className="manifesto__aside">
          <p className="lede">{manifesto.lede}</p>
          <p>{manifesto.body}</p>
          <ul className="disciplines mono" aria-label="Disciplines">
            {manifesto.disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>

        <div className="manifesto__foot">
          <dl className="facts mono">
            {manifesto.facts.map((f) => (
              <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>
            ))}
          </dl>

          <div className="pioneer">
            <p className="label">{manifesto.listTitle}</p>
            <ol>
              {manifesto.list.map((p, i) => (
                <li className="pioneer__row" key={p.label}>
                  <span className="hair" aria-hidden="true" />
                  <span className="mono mute">{String(i + 1).padStart(2, '0')}</span>
                  <span>{p.label}</span>
                  <span className="mono mute">{p.meta}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
