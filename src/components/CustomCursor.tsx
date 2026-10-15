import React, { useEffect, useRef, useState } from 'react';

type Mode = 'default' | 'hover' | 'view' | 'text' | 'hidden';

const INTERACTIVE = 'a, button, [role="button"], label, select, summary, [data-cursor]';
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]), textarea, [contenteditable="true"]';

/**
 * Two-part cursor: a precise dot plus a trailing ring that morphs over
 * interactive elements. `data-cursor="view"` shows a "VIEW" label;
 * `data-cursor="<text>"` shows custom text. Only active for fine pointers.
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('hidden');
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-custom-cursor');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const tick = () => {
      const k = reduced ? 1 : 0.18;
      ring.x += (target.x - ring.x) * k;
      ring.y += (target.y - ring.y) * k;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as Element | null;
      if (!el?.closest) return;
      if (el.closest(TEXT)) {
        setMode('text');
        return;
      }
      const hit = el.closest(INTERACTIVE) as HTMLElement | null;
      const cursorAttr = hit?.dataset.cursor;
      if (cursorAttr) {
        setMode('view');
        setLabel(cursorAttr === 'view' ? 'VIEW' : cursorAttr);
      } else {
        setMode(hit ? 'hover' : 'default');
      }
    };
    const onLeave = () => setMode('hidden');
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = { default: 36, hover: 60, view: 92, text: 0, hidden: 0 }[mode];
  const scale = pressed ? 0.8 : 1;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <div ref={ringRef} className="absolute left-0 top-0 will-change-transform">
        <div
          className={`flex items-center justify-center rounded-full -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color,opacity,scale] duration-300 ease-out ${
            mode === 'view'
              ? 'bg-[#F59E0B] border border-[#F59E0B]'
              : mode === 'hover'
                ? 'bg-[#F59E0B]/10 border border-[#F59E0B]'
                : 'border border-white/40'
          }`}
          style={{
            width: ringSize,
            height: ringSize,
            opacity: mode === 'hidden' || mode === 'text' ? 0 : 1,
            scale,
          }}
        >
          <span
            className={`font-syne text-[10px] font-extrabold tracking-[0.2em] text-black transition-opacity duration-200 ${
              mode === 'view' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {label}
          </span>
        </div>
      </div>
      <div ref={dotRef} className="absolute left-0 top-0 will-change-transform">
        <div
          className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
          style={{ opacity: mode === 'default' || mode === 'hover' ? 1 : 0 }}
        />
      </div>
    </div>
  );
};
