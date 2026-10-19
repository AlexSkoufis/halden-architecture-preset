'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, MQ } from '@/lib/motion';
import { nav, studio, type ImageKey } from '@/lib/content';
import { Img } from './Img';
import { getLenis, scrollToTarget } from './SmoothScroll';

function useStudioTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: studio.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

/** Studio mark: a square with an offset rule (pure CSS, recolours with the nav). */
export function Symbol({ className = '' }: { className?: string }) {
  return <span className={`symbol ${className}`} aria-hidden="true" />;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [preview, setPreview] = useState<ImageKey>(nav[0].image);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const time = useStudioTime();

  // Nav colour follows whichever section sits beneath it; it contracts once the page moves.
  useEffect(() => {
    const triggers = gsap.utils.toArray<HTMLElement>('[data-nav]').map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: 'top 36px',
        end: 'bottom 36px',
        onToggle: (self) => self.isActive && setTheme(section.dataset.nav === 'light' ? 'light' : 'dark'),
      }),
    );
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Build the overlay timeline once; play/reverse on toggle.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const reduced = window.matchMedia(MQ.reduced).matches;
    const t = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        menu.hidden = true;
      },
    });
    if (reduced) {
      t.fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
    } else {
      t.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' })
        .from(menu.querySelectorAll('.menu__item-inner'), { yPercent: 110, duration: 1, stagger: 0.05, ease: 'expo.out' }, 0.35)
        .from(menu.querySelectorAll('.menu__rule'), { scaleX: 0, transformOrigin: 'left', duration: 1.1, stagger: 0.05, ease: 'expo.out' }, 0.3)
        .from(menu.querySelector('.menu__preview'), { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.inOut' }, 0.3)
        .from(menu.querySelectorAll('.menu__meta > *'), { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.04 }, 0.6);
    }
    tl.current = t;
    return () => {
      t.kill();
    };
  }, []);

  const close = useCallback((thenScrollTo?: string) => {
    setOpen(false);
    getLenis()?.start();
    document.documentElement.classList.remove('menu-open');
    tl.current?.timeScale(1.6).reverse();
    buttonRef.current?.focus({ preventScroll: true });
    if (thenScrollTo) window.setTimeout(() => scrollToTarget(thenScrollTo), 250);
  }, []);

  const openMenu = useCallback(() => {
    const menu = menuRef.current;
    if (!menu) return;
    menu.hidden = false;
    setOpen(true);
    getLenis()?.stop();
    document.documentElement.classList.add('menu-open');
    tl.current?.timeScale(1).play();
    window.setTimeout(() => menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }), 300);
  }, []);

  // Escape closes; Tab stays inside the dialog while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab' || !menuRef.current) return;
      const focusables = [buttonRef.current!, ...menuRef.current.querySelectorAll<HTMLElement>('a, button')];
      const i = focusables.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? focusables.length - 1 : i - 1) : (i + 1) % focusables.length;
      e.preventDefault();
      focusables[next].focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const onLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (open) close(href);
    else scrollToTarget(href);
  };

  return (
    <>
      <header className={`nav nav--${open ? 'dark' : theme}${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
        <a className="nav__logo" href="#top" onClick={(e) => onLink(e, '#top')} aria-label={`${studio.name} — back to top`}>
          <Symbol />
          <span>{studio.name}</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="u-link" onClick={(e) => onLink(e, item.href)} data-cursor="OPEN">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav__aux">
          <span className="nav__lang" aria-label="Language">
            <a href="#top" aria-current="true">EN</a>
            <span aria-hidden="true">/</span>
            {/* Second language placeholder */}
            <a href="#top" lang="pt" hrefLang="pt">PT</a>
          </span>
          <button
            ref={buttonRef}
            className="nav__menu"
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => (open ? close() : openMenu())}
            data-cursor={open ? 'CLOSE' : 'OPEN'}
          >
            <span className="nav__menu-label">{open ? 'Close' : 'Menu'}</span>
            <span className="nav__menu-icon" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
        <span className="nav__rule" aria-hidden="true" />
      </header>

      <div id="site-menu" ref={menuRef} className="menu" role="dialog" aria-modal="true" aria-label="Site menu" hidden>
        <div className="menu__grid">
          <nav className="menu__list" aria-label="Menu">
            {nav.map((item, i) => (
              <div className="menu__item" key={item.href}>
                <span className="menu__rule" aria-hidden="true" />
                <a
                  href={item.href}
                  onClick={(e) => onLink(e, item.href)}
                  onPointerEnter={() => setPreview(item.image)}
                  onFocus={() => setPreview(item.image)}
                  data-cursor="OPEN"
                >
                  <span className="menu__item-inner">
                    <span className="menu__no">{String(i + 1).padStart(2, '0')}</span>
                    <span className="menu__label">{item.label}</span>
                  </span>
                </a>
              </div>
            ))}
          </nav>
          <div className="menu__preview" aria-hidden="true">
            {nav.map((item) => (
              <Img
                key={item.href}
                image={item.image}
                alt=""
                sizes="(min-width: 1024px) 34vw, 1px"
                className={`menu__img${preview === item.image ? ' is-active' : ''}`}
              />
            ))}
            <span className="menu__coord mono">{studio.coords}</span>
          </div>
          <div className="menu__meta mono">
            <p>
              {studio.address.map((l) => (
                <span key={l}>{l}<br /></span>
              ))}
            </p>
            <p>
              <a className="u-link" href={`mailto:${studio.email}`}>{studio.email}</a>
              <br />
              <a className="u-link" href={studio.phoneHref}>{studio.phone}</a>
            </p>
            <p>
              {studio.social.map((s) => (
                <span key={s.label}>
                  <a className="u-link" href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
                  <br />
                </span>
              ))}
            </p>
            <p>
              Local time, {studio.city} — <time>{time}</time>
              <br />
              {studio.coords}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
