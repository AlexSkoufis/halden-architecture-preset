'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, MQ } from '@/lib/motion';

/**
 * Small dot that grows into a labelled disc over elements carrying `data-cursor="LABEL"`.
 * Only mounts for fine pointers; touch and reduced-motion users keep the system cursor.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const mq = window.matchMedia(`${MQ.fine} and ${MQ.motion}`);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    document.documentElement.classList.add('has-cursor');
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x(e.clientX);
      y(e.clientY);
      if (!visible) {
        visible = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.classList.add('is-visible');
      }
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest<HTMLElement>('[data-cursor]');
      setLabel(t?.dataset.cursor ?? '');
      el.classList.toggle('is-dark', !!(e.target as Element).closest('[data-cursor-dark]'));
    };
    const leave = () => {
      visible = false;
      el.classList.remove('is-visible');
    };
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className={`cursor${label ? ' has-label' : ''}`} aria-hidden="true">
      <span className="cursor__disc" />
      <span className="cursor__label">{label}</span>
    </div>
  );
}
