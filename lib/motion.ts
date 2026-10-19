'use client';

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'expo.out', duration: 1.2 });
}

export { gsap, ScrollTrigger, SplitText };

export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  tablet: '(min-width: 700px)',
  fine: '(hover: hover) and (pointer: fine)',
};

export const EASE = {
  out: 'expo.out',
  inOut: 'power3.inOut',
  soft: 'power2.out',
};

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Runs GSAP setup inside a context scoped to `scope`, reverting everything on unmount.
 * Setup runs after webfonts load so line splits measure the real typeface.
 */
export function useGsap(scope: RefObject<HTMLElement | null>, setup: (ctx: gsap.Context) => void, deps: DependencyList = []) {
  useIsoLayoutEffect(() => {
    if (!scope.current) return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    const run = () => {
      if (cancelled || !scope.current) return;
      ctx = gsap.context((self) => setup(self), scope);
      ScrollTrigger.refresh();
    };
    if (document.fonts?.status === 'loaded') run();
    else document.fonts.ready.then(run);
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Masked line-by-line reveal for a heading. Lines rise out of their own clipping box.
 * Re-splits on resize (autoSplit) so line breaks always match the layout.
 */
export function revealLines(target: Element | string, opts: { trigger?: Element; start?: string; delay?: number; stagger?: number; immediate?: boolean } = {}) {
  return SplitText.create(target, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.3,
        stagger: opts.stagger ?? 0.09,
        delay: opts.delay ?? 0,
        ease: EASE.out,
        scrollTrigger: opts.immediate
          ? undefined
          : { trigger: opts.trigger ?? (self.elements[0] as Element), start: opts.start ?? 'top 85%', once: true },
      });
    },
  });
}

/** Image enters through a clipping mask from below while its content settles from a slight zoom. */
export function revealImage(frame: Element, opts: { start?: string; from?: string } = {}) {
  const img = frame.querySelector('img');
  const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: opts.start ?? 'top 88%', once: true } });
  tl.fromTo(frame, { clipPath: opts.from ?? 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' });
  // clearProps hands the img transform back to CSS so hover scaling keeps working.
  if (img) {
    gsap.set(img, { transition: 'none' });
    tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: EASE.out, clearProps: 'transform,transition' }, 0);
  }
  return tl;
}

/**
 * Vertical drift of an image inside a fixed frame (frame stays put; content moves).
 * Moves the <picture> (oversized by CSS) so the <img> stays free for reveal/hover scaling.
 */
export function parallax(frame: Element, amount = 10) {
  const inner = frame.querySelector('picture');
  if (!inner) return;
  gsap.fromTo(
    inner,
    { yPercent: -amount / 2 },
    { yPercent: amount / 2, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } },
  );
}
