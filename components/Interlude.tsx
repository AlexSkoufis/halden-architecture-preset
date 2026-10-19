'use client';

import { useRef } from 'react';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';
import { interlude } from '@/lib/content';

/** 08 — A breathing space. The frame opens from an inset plate to full bleed while the image drifts. */
export default function Interlude() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        '.il__frame',
        { clipPath: 'inset(14% 9% 14% 9%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top 5%', scrub: true } },
      );
      gsap.fromTo(
        '.il__frame picture',
        { yPercent: -7, scale: 1.12 },
        { yPercent: 7, scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
      gsap.from('.il__words span > span', {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.1,
        scrollTrigger: { trigger: '.il__words', start: 'top 85%', once: true },
      });
    });
  });

  return (
    <section ref={root} className="il" data-nav="dark" aria-label={interlude.caption}>
      <div className="il__frame" data-cursor="VIEW">
        <Img image={interlude.image} alt={interlude.alt} sizes="100vw" />
      </div>
      <p className="il__words" aria-label={interlude.words.join(' ')}>
        {interlude.words.map((w) => (
          <span key={w} aria-hidden="true"><span>{w}</span></span>
        ))}
      </p>
      <p className="il__cap mono">{interlude.caption}</p>
    </section>
  );
}
