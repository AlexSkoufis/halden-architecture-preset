'use client';

import { useRef, useState } from 'react';
import { layers, layersCopy } from '@/lib/content';
import { fallbackSrc } from './Img';

const tag = (i: number) => `${layers[i].no} ${layers[i].name.toUpperCase()}`;
import { gsap, useGsap, revealLines, MQ } from '@/lib/motion';

// Each plane is a 400×400 square projected isometrically; planes stack upwards.
const GAP = 64;
const BASE = 430;
const iso = (i: number) => `matrix(0.866 0.5 -0.866 0.5 460 ${BASE - i * GAP})`;

// Seeded pseudo-random, rounded so server and client render identical attributes.
const r = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
};

const contourLines = Array.from({ length: 7 }, (_, k) => {
  const y0 = 40 + k * 52;
  return `M0 ${y0} C 90 ${y0 - 30 + k * 4}, 170 ${y0 + 40 - k * 3}, 260 ${y0 + 6} S 360 ${y0 - 26}, 400 ${y0 - 8}`;
});
const trees = Array.from({ length: 16 }, (_, k) => ({ cx: 30 + r(k + 1) * 340, cy: 30 + r(k + 7) * 340, r: 5 + r(k + 3) * 11 }));
const people = Array.from({ length: 22 }, (_, k) => ({ cx: 60 + r(k + 11) * 280, cy: 60 + r(k + 17) * 280 }));

function Plane({ i, children, label }: { i: number; children?: React.ReactNode; label: string }) {
  return (
    <g className="ly__plane" data-i={i}>
      <g transform={iso(i)}>
        <rect className="ly__base" x="0" y="0" width="400" height="400" />
        {children}
      </g>
      <line className="ly__lead draw" x1="114" y1={BASE - i * GAP + 200} x2="40" y2={BASE - i * GAP + 200} pathLength={1} />
      <text className="ly__tag" x="36" y={BASE - i * GAP + 204} textAnchor="end">
        {label}
      </text>
    </g>
  );
}

/**
 * 06 — Design process as layers. A pinned isometric stack is assembled plane by plane:
 * site → context → environment → people → intervention → place (the photograph).
 */
export default function Layers() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(layers.length - 1);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      revealLines('.ly__title', { start: 'top 80%' });
    });

    mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
      setActive(0);
      const planes = gsap.utils.toArray<SVGGElement>('.ly__plane', root.current);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          onUpdate: (self) => setActive(Math.min(layers.length - 1, Math.floor(self.progress * layers.length * 0.999))),
        },
      });
      planes.forEach((plane, i) => {
        const at = i * 1;
        tl.fromTo(plane, { autoAlpha: 0, y: -90 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, at);
        const draws = plane.querySelectorAll('.draw');
        if (draws.length) tl.fromTo(draws, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.02 }, at + 0.15);
        const dots = plane.querySelectorAll('.pop');
        if (dots.length) tl.from(dots, { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', duration: 0.3, stagger: 0.012 }, at + 0.2);
      });
      tl.fromTo('.ly__photo', { opacity: 0 }, { opacity: 1, duration: 0.6 }, (planes.length - 1) + 0.25)
        .to('.ly__plane:not(:last-child)', { opacity: 0.45, duration: 0.5 }, (planes.length - 1) + 0.3)
        .to({}, { duration: 0.6 });
      return () => setActive(layers.length - 1);
    });
  });

  return (
    <section ref={root} id="approach" className="ly" data-nav="light" aria-labelledby="ly-title">
      <div className="ly__stage wrap grid">
        <div className="ly__text">
          <p className="label">
            {layersCopy.label} <span className="label__index">(06)</span>
          </p>
          <h2 id="ly-title" className="ly__title display">
            {layersCopy.title} <br /><em className="serif">{layersCopy.em}</em>
          </h2>
          <ol className="ly__list">
            {layers.map((l, i) => (
              <li key={l.no} className={i === active ? 'is-active' : i < active ? 'is-done' : ''}>
                <span className="mono">{l.no}</span>
                <span className="ly__name">{l.name}</span>
                <span className="ly__note">{l.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <figure className="ly__diagram" aria-label={`Diagram: six layers stacked from ${layers[0].name} to ${layers[5].name}`}>
          <svg viewBox="-40 60 1000 780" role="img" aria-hidden="true">
            <defs>
              <clipPath id="ly-clip">
                <rect x="0" y="0" width="400" height="400" />
              </clipPath>
            </defs>

            <Plane i={0} label={tag(0)}>
              {Array.from({ length: 9 }, (_, k) => (
                <g key={k}>
                  <line className="ly__hair draw" x1={(k + 1) * 40} y1="0" x2={(k + 1) * 40} y2="400" pathLength={1} />
                  <line className="ly__hair draw" x1="0" y1={(k + 1) * 40} x2="400" y2={(k + 1) * 40} pathLength={1} />
                </g>
              ))}
            </Plane>

            <Plane i={1} label={tag(1)}>
              <g clipPath="url(#ly-clip)">
                {contourLines.map((d) => (
                  <path key={d} d={d} className="ly__stroke draw" pathLength={1} />
                ))}
              </g>
            </Plane>

            <Plane i={2} label={tag(2)}>
              <path className="ly__water draw" d="M0 300 C 80 260, 120 330, 200 280 S 330 190, 400 220" pathLength={1} />
              {trees.map((t, k) => (
                <circle key={k} className="ly__tree pop" cx={t.cx} cy={t.cy} r={t.r} />
              ))}
            </Plane>

            <Plane i={3} label={tag(3)}>
              <path className="ly__route draw" d="M20 380 L 140 250 L 260 260 L 380 60" pathLength={1} />
              <path className="ly__route draw" d="M20 60 L 150 170 L 300 330" pathLength={1} />
              {people.map((p, k) => (
                <circle key={k} className="ly__person pop" cx={p.cx} cy={p.cy} r="3.2" />
              ))}
            </Plane>

            <Plane i={4} label={tag(4)}>
              <rect className="ly__stroke draw" x="60" y="60" width="130" height="90" pathLength={1} />
              <rect className="ly__stroke draw" x="220" y="180" width="120" height="160" pathLength={1} />
              <rect className="ly__stroke draw" x="60" y="200" width="110" height="60" pathLength={1} />
              <line className="ly__stroke draw" x1="0" y1="170" x2="400" y2="170" pathLength={1} />
            </Plane>

            <Plane i={5} label={tag(5)}>
              <image
                className="ly__photo"
                href={fallbackSrc(layersCopy.topImage)}
                x="0"
                y="0"
                width="400"
                height="400"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#ly-clip)"
              />
            </Plane>
          </svg>
          <figcaption className="mono mute ly__cap">
            {layersCopy.caption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
