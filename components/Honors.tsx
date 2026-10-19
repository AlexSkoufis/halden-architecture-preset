'use client';

import { useRef } from 'react';
import { honors, honorsCopy } from '@/lib/content';
import { gsap, useGsap, revealLines, MQ } from '@/lib/motion';

/** 07 — Recognition as an archive table. Rules draw in row by row; rows respond to hover and focus. */
export default function Honors() {
  const root = useRef<HTMLElement>(null);
  const years = honors.map((h) => Number(h.year));
  const first = Math.min(...years);
  const last = Math.max(...years);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      revealLines('.hn__title', { start: 'top 82%' });
      gsap.utils.toArray<HTMLElement>('.hn__row', root.current).forEach((row) => {
        gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 92%', once: true } })
          .from(row, { '--rule': 0, duration: 1.4, ease: 'expo.inOut' })
          .from(row.querySelectorAll('td, th'), { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.04 }, 0.2);
      });
      gsap.from('.hn__stat b', {
        textContent: 0,
        duration: 1.6,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: { trigger: '.hn__stat', start: 'top 85%', once: true },
      });
    });
  });

  return (
    <section ref={root} id="recognition" className="hn" data-nav="light" aria-labelledby="hn-title">
      <div className="wrap grid">
        <header className="hn__head">
          <p className="label">
            Recognition <span className="label__index">(07)</span>
          </p>
          <h2 id="hn-title" className="hn__title display">
            {honorsCopy.title} <br />
            <em className="serif">{honorsCopy.em}</em>
          </h2>
          <p className="hn__stat mono">
            <b>{honors.length}</b> entries
            <br />
            {first} — {last}
          </p>
          <p className="hn__intro">{honorsCopy.intro}</p>
        </header>

        <div className="hn__tablewrap">
          <table className="hn__table">
            <caption className="sr-only">{honorsCopy.title} {honorsCopy.em}, {last} to {first}</caption>
            <thead className="mono">
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Event</th>
                <th scope="col">Location</th>
                <th scope="col">Type</th>
              </tr>
            </thead>
            <tbody>
              {honors.map((h, i) => {
                const showYear = i === 0 || honors[i - 1].year !== h.year;
                return (
                  <tr key={h.event} className={`hn__row${showYear ? ' is-first' : ''}`}>
                    <td className="hn__year mono">
                      <span aria-hidden={!showYear}>{showYear ? h.year : ''}</span>
                      {!showYear && <span className="sr-only">{h.year}</span>}
                    </td>
                    <th scope="row" className="hn__event">
                      <span className="hn__name">{h.event}</span>
                      <span className="hn__detail">{h.detail}</span>
                    </th>
                    <td className="hn__loc">{h.location}</td>
                    <td className="hn__type mono">
                      <span>{h.type}</span>
                      <i className="arrow" aria-hidden="true" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
