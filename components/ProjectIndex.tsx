'use client';

import { useRef, useState } from 'react';
import { featured, index } from '@/lib/content';
import { gsap, useGsap, revealLines, MQ } from '@/lib/motion';
import { Img } from './Img';

/**
 * 03 — Project index. Large editorial rows; on fine pointers a preview plate trails
 * the cursor and wipes between projects. Keyboard focus pins the plate beside the row.
 * On touch screens each row carries its own image instead.
 */
export default function ProjectIndex() {
  const root = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const move = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      revealLines('.pi__title', { start: 'top 85%' });
      gsap.from('.pi__row', {
        '--rule': 0,
        duration: 1.6,
        stagger: 0.08,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.pi__list', start: 'top 85%', once: true },
      });
      // Rows (not cells: cells own CSS hover transitions) rise in sequence.
      gsap.from('.pi__row', {
        y: 40,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.07,
        scrollTrigger: { trigger: '.pi__list', start: 'top 80%', once: true },
      });
    });
    mm.add(`${MQ.fine} and ${MQ.desktop}`, () => {
      const p = plate.current!;
      move.current = {
        x: gsap.quickTo(p, 'x', { duration: 0.7, ease: 'power3.out' }),
        y: gsap.quickTo(p, 'y', { duration: 0.7, ease: 'power3.out' }),
      };
      return () => {
        move.current = null;
      };
    });
  });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !move.current) return;
    move.current.x(e.clientX);
    move.current.y(e.clientY);
  };

  // Keyboard: park the plate at the right edge of the focused row.
  const onFocus = (i: number, e: React.FocusEvent<HTMLAnchorElement>) => {
    setHovered(i);
    if (!plate.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    gsap.set(plate.current, { x: r.right - r.width * 0.28, y: r.top + r.height / 2 });
  };

  return (
    <section ref={root} id="projects" className="pi" data-nav="light" aria-labelledby="pi-title" onPointerMove={onMove}>
      <div className="wrap">
        <header className="pi__head grid">
          <p className="label">
            {index.label} <span className="label__index">(03)</span>
          </p>
          <h2 id="pi-title" className="pi__title display">
            {index.title} <em className="serif">{index.em}</em>
          </h2>
          <p className="pi__count mono" aria-hidden="true">
            {String(featured.length).padStart(2, '0')} projects
            <br />
            {index.span}
          </p>
        </header>

        <div className="pi__cols mono" aria-hidden="true">
          <span>No.</span>
          <span>Project</span>
          <span>Typology</span>
          <span>Location</span>
        </div>

        <ol className={`pi__list${hovered !== null ? ' is-hovering' : ''}`} onPointerLeave={() => setHovered(null)}>
          {featured.map((p, i) => (
            <li key={p.slug} className={`pi__item${hovered === i ? ' is-hover' : ''}`}>
              <a
                href="#projects"
                className="pi__row"
                data-cursor="EXPLORE"
                onPointerEnter={() => setHovered(i)}
                onFocus={(e) => onFocus(i, e)}
                onBlur={() => setHovered(null)}
              >
                <span className="pi__cell pi__no mono">
                  {String(i + 1).padStart(2, '0')}
                  <i>.</i>
                </span>
                <span className="pi__cell pi__name">{p.name}</span>
                <span className="pi__cell pi__typ">{p.typology}</span>
                <span className="pi__cell pi__loc">{p.region}</span>
                <span className="pi__cell pi__go" aria-hidden="true">
                  <i className="arrow" />
                </span>
                <span className="pi__thumb" aria-hidden="true">
                  <Img image={p.image} alt="" sizes="(max-width: 1023px) 92vw, 1px" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div ref={plate} className={`pi__plate${hovered !== null ? ' is-on' : ''}`} aria-hidden="true">
        <div className="pi__plate-inner">
          {featured.map((p, i) => (
            <div key={p.slug} className={`pi__plate-img${hovered === i ? ' is-active' : ''}${hovered !== null && i < hovered ? ' is-past' : ''}`}>
              <Img image={p.image} alt="" sizes="28vw" />
            </div>
          ))}
          <span className="pi__plate-cap mono">
            {hovered !== null && (
              <>
                {String(hovered + 1).padStart(2, '0')} — {featured[hovered].coords ?? featured[hovered].region}
              </>
            )}
          </span>
        </div>
      </div>
    </section>
  );
}
