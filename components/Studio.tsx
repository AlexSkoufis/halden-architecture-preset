'use client';

import { useRef } from 'react';
import { studioCopy } from '@/lib/content';
import { gsap, useGsap, revealImage, parallax, revealLines, MQ } from '@/lib/motion';
import { Img } from './Img';

/** 11 — Studio statement. Large city type drifts against a single studio photograph. */
export default function Studio() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      revealLines('.st__city', { start: 'top 85%', stagger: 0.12 });
      revealLines('.st__disc', { start: 'top 88%', stagger: 0.06 });
      const frame = root.current!.querySelector('.st__photo .frame');
      if (frame) {
        revealImage(frame);
        parallax(frame, 10);
      }
      gsap.from('.st__member', {
        autoAlpha: 0,
        y: 16,
        stagger: 0.08,
        duration: 1,
        scrollTrigger: { trigger: '.st__members', start: 'top 90%', once: true },
      });
      gsap.fromTo('.st__city', { xPercent: 0 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  return (
    <section ref={root} id="studio" className="st" data-nav="light" aria-labelledby="st-title">
      <div className="wrap grid">
        <p className="label st__label">
          {studioCopy.label} <span className="label__index">(11)</span>
        </p>
        <h2 id="st-title" className="st__city display">
          {studioCopy.city[0]} <br />
          {studioCopy.city[1]}
        </h2>
        <p className="st__disc">
          {studioCopy.disc[0]} <br />
          {studioCopy.disc[1]} <br />
          <em className="serif">{studioCopy.discEm}</em>
        </p>

        <figure className="st__photo">
          <div className="frame" data-cursor="VIEW">
            <Img image={studioCopy.image} alt={studioCopy.imageAlt} sizes="(min-width: 1024px) 50vw, 92vw" />
          </div>
        </figure>

        <div className="st__body">
          <p className="lede">{studioCopy.lede}</p>
          <ul className="st__members">
            {studioCopy.team.map((t) => (
              <li key={t.name} className="st__member">
                <b>{t.name}</b>
                <span className="mono mute">{t.role}</span>
              </li>
            ))}
          </ul>
          <dl className="facts mono">
            {studioCopy.facts.map((f) => (
              <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>
            ))}
          </dl>
          <a className="arrow-link arrow-link--lg" href="#studio" data-cursor="OPEN">
            <span>{studioCopy.cta}</span>
            <i className="arrow" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
