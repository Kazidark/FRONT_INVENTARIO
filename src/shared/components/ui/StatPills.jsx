import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const useCountUp = (target, duration = 1000) => {
  const safeTarget = Number.isFinite(Number(target)) ? Math.max(0, Math.floor(Number(target))) : 0;
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      fromRef.current = safeTarget;
      setDisplay(safeTarget);
      return undefined;
    }

    const from = fromRef.current;
    if (from === safeTarget) {
      setDisplay(safeTarget);
      return undefined;
    }

    const start = performance.now();
    let rafId = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = Math.round(from + (safeTarget - from) * easeOutCubic(progress));
      setDisplay(next);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        fromRef.current = safeTarget;
        setDisplay(safeTarget);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [safeTarget, duration]);

  return display;
};

const CountUpNumber = ({ value, duration, className }) => {
  const display = useCountUp(value, duration);
  return (
    <span className={className} aria-hidden="true">
      {display.toLocaleString('es-PE')}
    </span>
  );
};

/**
 * Contadores del header — animación 0 → valor real en todos los módulos.
 */
const StatPills = ({ total = 0, activos = 0, duration = 1000 }) => {
  const safeTotal = Number.isFinite(Number(total)) ? Math.max(0, Math.floor(Number(total))) : 0;
  const safeActivos = Number.isFinite(Number(activos)) ? Math.max(0, Math.floor(Number(activos))) : 0;

  return (
    <div
      className="inv-stat-inline"
      aria-label={`${safeTotal} registros, ${safeActivos} activos`}
    >
      <span className="inv-stat-inline__item">
        <CountUpNumber value={safeTotal} duration={duration} className="inv-stat-inline__num" />
        <span className="inv-stat-inline__lbl">registros</span>
      </span>
      <span className="inv-stat-inline__dot" aria-hidden="true">
        ·
      </span>
      <span className="inv-stat-inline__item inv-stat-inline__item--accent">
        <CountUpNumber value={safeActivos} duration={duration} className="inv-stat-inline__num" />
        <span className="inv-stat-inline__lbl">activos</span>
      </span>
    </div>
  );
};

export default StatPills;
