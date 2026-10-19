'use client';

import { useRef, useState } from 'react';
import { featured, hero, studio } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';
import { scrollToTarget } from './SmoothScroll';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 01 — Selected work. A sticky stage the height of several viewports: scrolling
 * uncovers each project over the last (clip-path), so the portfolio is "walked into"
 * rather than paged. Reduced motion: a single viewport with PREV / NEXT switching.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [scrollMode, setScrollMode] = useState(false);
  const activeRef = useRef(0);
  const n = featured.length;

  useGsap(root, () => {
    const el = root.current!;
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      setScrollMode(true);
      const slides = gsap.utils.toArray<HTMLElement>('.hero__slide', el);
      const imgs = slides.map((s) => s.querySelector('img'));

      // Entrance: the photograph settles, rules extend, the first title rises.
      // (CSS transitions on the title lines are paused so they don't fight the tween.)
      gsap.set('.hero__title.is-active .hero__line > span', { transition: 'none' });
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from(imgs[0], { scale: 1.14, duration: 2.4 })
        .from('.hero__rule', { scaleY: 0, transformOrigin: 'top', duration: 1.6, stagger: 0.08, ease: 'expo.inOut' }, 0)
        .from('.hero__chrome', { autoAlpha: 0, y: 14, duration: 1, stagger: 0.06 }, 0.7)
        .fromTo('.hero__title.is-active .hero__line > span', { yPercent: 105 }, { yPercent: 0, duration: 1.4, stagger: 0.08, clearProps: 'transform,transition' }, 0.35);

      // Scroll sequence: one "step" per project plus a short tail that frames the image down.
      gsap.set(slides.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const idx = Math.min(n - 1, Math.round(self.progress * (n - 1 + 0.6)));
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
          },
        },
      });
      for (let i = 1; i < n; i++) {
        const at = i - 1;
        tl.to(slides[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, at)
          .fromTo(imgs[i], { scale: 1.2, yPercent: 6 }, { scale: 1.04, yPercent: 0, duration: 1, ease: 'power2.out' }, at)
          .to(imgs[i - 1], { yPercent: -10, scale: 1.1, duration: 1 }, at);
      }
      tl.to('.hero__progress-fill', { scaleX: 1, duration: n - 1 }, 0)
        // Tail: photography contracts into a framed plate as the editorial page begins.
        .to('.hero__media', { clipPath: 'inset(0% 3.2% 7% 3.2%)', duration: 0.6, ease: 'power2.inOut' }, n - 1)
        .to('.hero__chrome, .hero__titles', { autoAlpha: 0, y: -30, duration: 0.4 }, n - 1 + 0.15);

      return () => setScrollMode(false);
    });
  });

  const go = (i: number) => {
    const target = (i + n) % n;
    if (!scrollMode || !root.current) {
      setActive(target);
      return;
    }
    // Map project index to its scroll position inside the sticky stage.
    const el = root.current;
    const span = el.offsetHeight - window.innerHeight;
    const y = el.offsetTop + (span * target) / (n - 1 + 0.6);
    scrollToTarget(y + 2);
  };

  const state = (i: number) => (i === active ? 'is-active' : i < active ? 'is-past' : 'is-future');
  const next = featured[(active + 1) % n];
  const prev = featured[(active - 1 + n) % n];
  const current = featured[active];

  return (
    <section
      id="top"
      ref={root}
      className={`hero${scrollMode ? ' hero--scroll' : ' hero--static'}`}
      style={{ '--count': n } as React.CSSProperties}
      data-nav="dark"
      aria-roledescription="carousel"
      aria-label="Selected work"
    >
      <h1 className="sr-only">{studio.fullName} — {studio.descriptor}, {studio.city}</h1>
      <div className="hero__sticky">
        <div className="hero__media" data-cursor="VIEW">
          {featured.map((p, i) => (
            <div key={p.slug} className={`hero__slide ${state(i)}`} aria-hidden={i !== active}>
              <Img image={p.image} alt={`${p.name}, ${p.region}`} sizes="100vw" priority={i === 0} />
            </div>
          ))}
          <span className="hero__scrim" aria-hidden="true" />
        </div>

        <div className="hero__rules" aria-hidden="true">
          <span className="hero__rule" />
          <span className="hero__rule" />
          <span className="hero__rule" />
        </div>

        <div className="hero__counter hero__chrome mono" aria-live="polite">
          <span className="sr-only">Project {active + 1} of {n}: {current.name}</span>
          <span className="roll" aria-hidden="true">
            <span style={{ transform: `translateY(${-active * 1.5}em)` }}>
              {featured.map((_, i) => (
                <b key={i}>{pad(i + 1)}</b>
              ))}
            </span>
          </span>
          <span aria-hidden="true">/ {pad(n)}</span>
        </div>

        <div className="hero__coords hero__chrome mono" aria-hidden="true">
          {featured.map((p, i) => (
            <span key={p.slug} className={state(i)}>{p.coords ?? p.region}</span>
          ))}
        </div>

        <div className="hero__titles">
          {featured.map((p, i) => (
            <h2 key={p.slug} className={`hero__title ${state(i)}`} aria-hidden={i !== active}>
              {p.title.map((line, j) => (
                <span className="hero__line" key={line} style={{ '--d': `${j * 0.07}s` } as React.CSSProperties}>
                  <span>{line}</span>
                </span>
              ))}
            </h2>
          ))}
        </div>

        <div className="hero__meta hero__chrome">
          {featured.map((p, i) => (
            <dl key={p.slug} className={`hero__dl ${state(i)}`} aria-hidden={i !== active}>
              <div><dt className="sr-only">Typology</dt><dd>{p.typology}</dd></div>
              <div><dt className="sr-only">Location</dt><dd>{p.region}</dd></div>
              <div><dt className="sr-only">Programme</dt><dd className="mute">{p.category}</dd></div>
            </dl>
          ))}
          <a className="arrow-link hero__cta" href="#projects" data-cursor="VIEW">
            <span>{hero.cta}</span>
            <i className="arrow" aria-hidden="true" />
          </a>
        </div>

        <div className="hero__nav hero__chrome mono">
          <button type="button" className="hero__btn" onClick={() => go(active - 1)} aria-label={`Previous project: ${prev.name}`}>
            Prev
            <span className="hero__peek hero__peek--prev" aria-hidden="true">
              <Img image={prev.image} alt="" sizes="200px" />
              <em>{prev.name}</em>
            </span>
          </button>
          <span className="hero__progress" aria-hidden="true">
            <span className="hero__progress-fill" style={scrollMode ? undefined : { transform: `scaleX(${active / (n - 1)})` }} />
            {featured.map((p, i) => (
              <i key={p.slug} className={i <= active ? 'on' : ''} style={{ left: `${(i / (n - 1)) * 100}%` }} />
            ))}
          </span>
          <button type="button" className="hero__btn" onClick={() => go(active + 1)} aria-label={`Next project: ${next.name}`}>
            Next
            <span className="hero__peek" aria-hidden="true">
              <Img image={next.image} alt="" sizes="200px" />
              <em>{next.name}</em>
            </span>
          </button>
        </div>

        <p className="hero__hint hero__chrome mono" aria-hidden="true">
          <span className="hero__hint-line" /> {hero.hint}
        </p>
      </div>
    </section>
  );
}
