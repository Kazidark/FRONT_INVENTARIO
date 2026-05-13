import { useEffect, useState, useMemo } from 'react';
import { Chart } from 'primereact/chart';
import { Skeleton } from 'primereact/skeleton';

import { getModems } from '../../../services/api/modems.api';
import { getChips } from '../../../services/api/chips.api';
import { getCelulares } from '../../../services/api/celulares.api';
import { getPCsLaptops } from '../../../services/api/pcs_laptops.api';
import { getTablets } from '../../../services/api/tablets.api';
import { getMonitores } from '../../../services/api/monitores.api';
import { getColaboradores } from '../../../services/api/colaboradores.api';
import { getAsignaciones } from '../../../services/api/asignaciones.api';

const PALETTE = ['#6366f1', '#38bdf8', '#f59e0b', '#fb923c', '#a78bfa', '#f472b6', '#0ea5e9', '#c084fc'];

/** Rebanadas pie / dona: índigo, cielo, ámbar, coral, rosa, violeta (poco verde) */
const DASH_PIE_COLORS = ['#818cf8', '#38bdf8', '#fbbf24', '#fb923c', '#f472b6', '#a78bfa', '#22d3bf', '#fda4af'];

/** Barras por área: pasteles que combinan entre sí */
const DASH_AREA_BAR_COLORS = ['#93c5fd', '#a5b4fc', '#c4b5fd', '#fbcfe8', '#fde68a', '#7dd3fc', '#fdba74', '#bae6fd'];

const CHART_DURATION = 1500;
const CHART_EASE = 'easeOutCubic';

/** Barras verticales: crecen desde la base (eje Y = 0) */
const barGrowVertical = {
  animation: { duration: CHART_DURATION, easing: CHART_EASE },
  animations: {
    y: {
      type: 'number',
      properties: ['y', 'height', 'base'],
      from: (ctx) => {
        if (ctx.type === 'data' && ctx.chart?.scales?.y) {
          return ctx.chart.scales.y.getPixelForValue(0);
        }
      },
    },
  },
};

/** Barras horizontales (indexAxis y): se alargan desde 0 en X */
const barGrowHorizontal = {
  animation: { duration: CHART_DURATION, easing: CHART_EASE },
  animations: {
    x: {
      type: 'number',
      properties: ['x', 'width'],
      from: (ctx) => {
        if (ctx.type === 'data' && ctx.chart?.scales?.x) {
          return ctx.chart.scales.x.getPixelForValue(0);
        }
      },
    },
  },
};

/** Línea: puntos suben desde la base */
const lineGrowFromBase = {
  animation: { duration: CHART_DURATION, easing: CHART_EASE },
  animations: {
    y: {
      type: 'number',
      properties: ['y'],
      from: (ctx) => {
        if (ctx.type === 'data' && ctx.chart?.scales?.y) {
          return ctx.chart.scales.y.getPixelForValue(0);
        }
      },
    },
  },
};

/** Pie: giro + escala (no sobrescribir solo con duration o se pierde el arco) */
const pieMotion = {
  animation: {
    duration: CHART_DURATION,
    easing: CHART_EASE,
    animateRotate: true,
    animateScale: true,
  },
};

const MODULES = [
  { key: 'modems',        label: 'Módems',        icon: 'pi-wifi',       tone: 'success',   fetcher: getModems,        activeField: 'activo' },
  { key: 'chips',         label: 'Chips',         icon: 'pi-id-card',    tone: 'info',      fetcher: getChips,         activeField: 'activo' },
  { key: 'celulares',     label: 'Celulares',     icon: 'pi-mobile',     tone: 'warning',   fetcher: getCelulares,     activeField: 'activo' },
  { key: 'pcs',           label: 'PCs / Laptops', icon: 'pi-desktop',    tone: 'secondary', fetcher: getPCsLaptops,    activeField: 'activo' },
  { key: 'tablets',       label: 'Tablets',        icon: 'pi-tablet',    tone: 'primary',   fetcher: getTablets,       activeField: 'activo' },
  { key: 'monitores',     label: 'Monitores',     icon: 'pi-eye',        tone: 'danger',    fetcher: getMonitores,     activeField: 'activo' },
  { key: 'colaboradores', label: 'Colaboradores', icon: 'pi-users',      tone: 'primary',   fetcher: getColaboradores, activeField: 'activo' },
  { key: 'asignaciones',  label: 'Asignaciones',  icon: 'pi-link',       tone: 'success',   fetcher: getAsignaciones,  activeField: 'activo' },
];

const countByField = (items, field) => {
  const map = {};
  items.forEach((item) => {
    const val = item[field] || 'Sin asignar';
    map[val] = (map[val] || 0) + 1;
  });
  return map;
};

/** Cuenta animada de 0 → target (entero); al terminar se queda en target. */
function useCountUp(target, { duration = 1000, enabled = true } = {}) {
  const safe = typeof target === 'number' && Number.isFinite(target) ? Math.round(target) : 0;
  const [n, setN] = useState(() => (enabled ? 0 : safe));

  useEffect(() => {
    if (!enabled) {
      setN(safe);
      return;
    }
    let raf = 0;
    let cancelled = false;
    const t0 = performance.now();

    const tick = (now) => {
      if (cancelled) return;
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - t) ** 3;
      setN(Math.round(safe * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setN(safe);
      }
    };

    setN(0);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [safe, duration, enabled]);

  return n;
}

const ChartCard = ({ title, children, className = '' }) => (
  <div className={`card border-0 shadow-sm h-100 dashboard-chart-card ${className}`}>
    <div className="card-body py-2 px-2 pt-2 d-flex flex-column" style={{ minHeight: 0 }}>
      <h6
        className="fw-semibold text-secondary mb-1 text-truncate"
        style={{ fontSize: '.75rem', letterSpacing: 0.2 }}
        title={title}
      >
        {title}
      </h6>
      {children}
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="p-2">
    <Skeleton width="45%" height="0.75rem" className="mb-2" />
    <Skeleton height="180px" borderRadius="8px" />
  </div>
);

/** Barras decorativas animadas cuando no hay datos (misma sensación que gráficos que suben) */
function DashboardEmptyBars({ message, variant = 'trend' }) {
  const heights = variant === 'trend' ? [36, 54, 42, 62, 48, 38] : [34, 52, 44, 58, 50, 40];
  return (
    <div
      className={`dashboard-empty-bars dashboard-empty-bars--${variant} d-flex flex-column align-items-center justify-content-center w-100 h-100`}
    >
      <div className="dashboard-empty-bars__inner d-flex align-items-end justify-content-center gap-2 w-100 px-3">
        {heights.map((px, i) => (
          <div
            key={i}
            className="dashboard-empty-bars__col"
            style={{ height: px, ['--dash-i']: i }}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-secondary text-center small mb-0 mt-2 px-2">{message}</p>
    </div>
  );
}

/** KPI estilo “Analytics overview”: icono circular arriba, métrica grande, etiqueta, tendencia, barra de color */
const KpiStatCard = ({
  iconClass,
  label,
  value,
  displayValue,
  accentLine = '#3b82f6',
  accentIcon = '#2563eb',
  iconBg = '#eff6ff',
  delta,
  deltaUp = true,
  showDelta = false,
  elevated = false,
  animateValue = true,
}) => {
  const isNumeric = typeof value === 'number' && Number.isFinite(value);
  const targetInt = isNumeric ? Math.round(value) : 0;
  const count = useCountUp(targetInt, {
    duration: 1000,
    enabled: animateValue && displayValue == null && isNumeric,
  });

  const shown =
    displayValue ??
    (isNumeric ? count.toLocaleString('es-MX') : value);

  return (
    <div
      className={`dashboard-kpi-card--analytics h-100 border-0 overflow-hidden ${
        elevated ? 'dashboard-kpi-card--elevated' : ''
      }`}
    >
      <div
        className="d-flex flex-column align-items-center text-center px-3"
        style={{ paddingTop: '1.35rem', paddingBottom: '0.65rem', minHeight: 168 }}
      >
        <div
          className="d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: iconBg,
            color: accentIcon,
            fontSize: '1.35rem',
            boxShadow: `0 0 0 6px ${iconBg}66`,
          }}
          aria-hidden="true"
        >
          <i className={iconClass} />
        </div>
        <div
          className="fw-bold text-dark mt-3"
          style={{
            fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        >
          {shown}
        </div>
        <div
          className="text-secondary mt-2 px-1"
          style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.25 }}
        >
          {label}
        </div>
        {showDelta && delta != null && delta !== '' ? (
          <div
            className="mt-2 fw-semibold"
            style={{
              fontSize: '0.88rem',
              color: deltaUp ? '#16a34a' : '#dc2626',
              letterSpacing: '0.01em',
            }}
          >
            {deltaUp ? '▲' : '▼'} {delta}
          </div>
        ) : (
          <div className="mt-2" style={{ height: '1.25rem' }} aria-hidden />
        )}
      </div>
      <div style={{ height: 4, backgroundColor: accentLine }} aria-hidden="true" />
    </div>
  );
};

const DashboardPage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const results = await Promise.allSettled(
        MODULES.map(async (m) => {
          const items = await m.fetcher();
          return { key: m.key, items: Array.isArray(items) ? items : [] };
        })
      );
      if (cancelled) return;
      const map = {};
      results.forEach((r) => {
        if (r.status === 'fulfilled') map[r.value.key] = r.value.items;
        else map[r.value?.key] = [];
      });
      setData(map);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() =>
    MODULES.map((m) => {
      const items = data[m.key] || [];
      const total = items.length;
      const activos = items.filter((i) => Boolean(i[m.activeField])).length;
      const inactivos = total - activos;
      return { ...m, total, activos, inactivos, items };
    }), [data]
  );

  const equipmentModules = stats.filter((s) =>
    ['modems', 'chips', 'celulares', 'pcs', 'tablets', 'monitores'].includes(s.key)
  );

  /* ── Doughnut: Distribución general de equipos ── */
  const doughnutData = useMemo(() => ({
    labels: equipmentModules.map((s) => s.label),
    datasets: [{
      data: equipmentModules.map((s) => s.total),
      backgroundColor: equipmentModules.map((_, i) => DASH_PIE_COLORS[i % DASH_PIE_COLORS.length]),
      hoverOffset: 8,
      borderWidth: 2,
      borderColor: '#fff',
    }],
  }), [equipmentModules]);

  /* ── Polar: Activos vs Inactivos global ── */
  const globalActivos = equipmentModules.reduce((sum, s) => sum + s.activos, 0);
  const globalInactivos = equipmentModules.reduce((sum, s) => sum + s.inactivos, 0);

  const polarData = useMemo(() => ({
    labels: ['Activos', 'Inactivos'],
    datasets: [{
      data: [globalActivos, globalInactivos],
      backgroundColor: ['rgba(99, 102, 241, 0.65)', 'rgba(251, 146, 60, 0.65)'],
      borderColor: ['#6366f1', '#fb923c'],
      borderWidth: 2,
    }],
  }), [globalActivos, globalInactivos]);

  const pieOptions = useMemo(
    () => ({
      ...pieMotion,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 4, font: { size: 10 } } },
      },
    }),
    []
  );

  /* ── Horizontal Bar: Equipos por Área (combinando módulos con campo nombre_area/area) ── */
  const areaDistribution = useMemo(() => {
    const areaMap = {};
    equipmentModules.forEach((mod) => {
      mod.items.forEach((item) => {
        const area = item.nombre_area || item.area || item.area_desc || null;
        if (area && area !== '-') {
          areaMap[area] = (areaMap[area] || 0) + 1;
        }
      });
    });
    const sorted = Object.entries(areaMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return {
      labels: sorted.map(([k]) => k),
      datasets: [{
        label: 'Equipos',
        data: sorted.map(([, v]) => v),
        backgroundColor: sorted.map((_, i) => DASH_AREA_BAR_COLORS[i % DASH_AREA_BAR_COLORS.length]),
        borderRadius: 6,
        barPercentage: 0.6,
      }],
    };
  }, [equipmentModules]);

  /* ── Bar: Chips por operador ── */
  const chipsByOperador = useMemo(() => {
    const items = data.chips || [];
    const map = countByField(items, 'operador');
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return {
      labels: entries.map(([k]) => k),
      datasets: [{
        label: 'Chips',
        data: entries.map(([, v]) => v),
        backgroundColor: PALETTE,
        borderRadius: 6,
        barPercentage: 0.5,
      }],
    };
  }, [data.chips]);

  /* ── Doughnut: PCs por tipo_equipo ── */
  const pcsByTipo = useMemo(() => {
    const items = data.pcs || [];
    const map = countByField(items, 'tipo_equipo');
    const entries = Object.entries(map);
    return {
      labels: entries.map(([k]) => k),
      datasets: [{
        data: entries.map(([, v]) => v),
        backgroundColor: ['#6366f1', '#f59e0b', '#06b6d4', '#ec4899'],
        hoverOffset: 8,
        borderWidth: 2,
        borderColor: '#fff',
      }],
    };
  }, [data.pcs]);

  /* ── Line: Tendencia de asignaciones (por fecha) ── */
  const asignacionesTrend = useMemo(() => {
    const items = data.asignaciones || [];
    const monthMap = {};
    items.forEach((a) => {
      const dateStr = a.fecha_asignacion || a.fecha_inicio || a.createdAt;
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    });
    const sorted = Object.entries(monthMap).sort((a, b) => a[0].localeCompare(b[0]));
    return {
      labels: sorted.map(([k]) => k),
      datasets: [{
        label: 'Asignaciones',
        data: sorted.map(([, v]) => v),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 4,
        pointBackgroundColor: '#818cf8',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
      }],
    };
  }, [data.asignaciones]);

  const moduleBarData = useMemo(
    () => ({
      labels: equipmentModules.map((s) => s.label),
      datasets: [
        {
          label: 'Activos',
          data: equipmentModules.map((s) => s.activos),
          backgroundColor: '#6366f1',
          borderRadius: 6,
        },
        {
          label: 'Inactivos',
          data: equipmentModules.map((s) => s.inactivos),
          backgroundColor: '#fb923c',
          borderRadius: 6,
        },
      ],
    }),
    [equipmentModules]
  );

  const moduleBarChartOptions = useMemo(
    () => ({
      ...barGrowHorizontal,
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      layout: { padding: { left: 0, right: 8, top: 4, bottom: 4 } },
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 6, font: { size: 10 } } },
      },
      scales: {
        x: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } }, grid: { display: false } },
        y: { grid: { display: false }, ticks: { font: { size: 10 } } },
      },
    }),
    []
  );

  const lineOptions = useMemo(
    () => ({
      ...lineGrowFromBase,
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 4, right: 4, bottom: 0, left: 2 } },
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 }, maxRotation: 0 } },
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } },
      },
    }),
    []
  );

  const simpleBarOptions = useMemo(
    () => ({
      ...barGrowVertical,
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 9 } }, grid: { display: false } },
      },
    }),
    []
  );

  if (loading) {
    return (
      <section className="dashboard-fit">
        <div className="dashboard-fit__head">
          <h1 className="h5 fw-bold mb-0">Dashboard</h1>
          <p className="text-secondary small mb-0">Cargando datos del inventario…</p>
        </div>
        <div className="dashboard-fit__kpis">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="188px" borderRadius="18px" className="w-100" />
          ))}
        </div>
        <div className="dashboard-fit__charts">
          {[1, 2, 3, 4].map((i) => (
            <div key={`sk-${i}`} className="dashboard-fit__chart">
              <div className="card border-0 shadow-sm h-100 dashboard-chart-card">
                <SkeletonChart />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const totalEquipos = equipmentModules.reduce((s, m) => s + m.total, 0);
  const kpiCards = [
    {
      iconClass: 'pi pi-box',
      label: 'Total inventario',
      value: totalEquipos,
      delta: `+${Math.round((globalActivos / Math.max(totalEquipos, 1)) * 100)}%`,
      deltaUp: true,
      showDelta: true,
      accentLine: '#3b82f6',
      accentIcon: '#2563eb',
      iconBg: '#eff6ff',
    },
    {
      iconClass: 'pi pi-bolt',
      label: 'Equipos activos',
      value: globalActivos,
      delta: `+${Math.round((globalActivos / Math.max(globalActivos + globalInactivos, 1)) * 100)}%`,
      deltaUp: true,
      showDelta: true,
      elevated: true,
      accentLine: '#10b981',
      accentIcon: '#059669',
      iconBg: '#d1fae5',
    },
    {
      iconClass: 'pi pi-link',
      label: 'Asignaciones',
      value: data.asignaciones?.length || 0,
      showDelta: false,
      accentLine: '#8b5cf6',
      accentIcon: '#7c3aed',
      iconBg: '#ede9fe',
    },
    {
      iconClass: 'pi pi-chart-line',
      label: 'Stock inactivo',
      value: globalInactivos,
      showDelta: globalInactivos > 0,
      delta:
        globalInactivos > 0
          ? `${Math.round((globalInactivos / Math.max(totalEquipos, 1)) * 100)}% del total`
          : '',
      deltaUp: false,
      accentLine: '#f59e0b',
      accentIcon: '#d97706',
      iconBg: '#ffedd5',
    },
  ];

  return (
    <section className="dashboard-fit">
      <div className="dashboard-fit__head">
        <h1 className="h5 fw-bold mb-0">Dashboard</h1>
        <p className="text-secondary small mb-0">
          Resumen del inventario — <strong>{totalEquipos}</strong> equipos
        </p>
      </div>

      <div className="dashboard-fit__kpis">
        {kpiCards.map((card) => (
          <KpiStatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="dashboard-fit__charts">
        <div className="dashboard-fit__chart">
          <ChartCard title="Línea de tiempo de asignaciones">
            <div className="dashboard-chart-slot">
              {asignacionesTrend.labels.length > 0 ? (
                <Chart
                  key={asignacionesTrend.labels.join(',')}
                  type="line"
                  data={asignacionesTrend}
                  options={lineOptions}
                />
              ) : (
                <DashboardEmptyBars message="Sin datos de tendencia" variant="trend" />
              )}
            </div>
          </ChartCard>
        </div>

        <div className="dashboard-fit__chart">
          <ChartCard title="Resultados por módulo (Activos/Inactivos)">
            <div className="dashboard-chart-slot">
              <Chart
                key={equipmentModules.map((s) => `${s.key}-${s.activos}-${s.inactivos}`).join('|')}
                type="bar"
                data={moduleBarData}
                options={moduleBarChartOptions}
              />
            </div>
          </ChartCard>
        </div>

        <div className="dashboard-fit__chart">
          <ChartCard title="Entregas por área">
            <div className="dashboard-chart-slot">
              {areaDistribution.labels.length > 0 ? (
                <Chart
                  key={areaDistribution.labels.join(',')}
                  type="bar"
                  data={areaDistribution}
                  options={simpleBarOptions}
                />
              ) : (
                <DashboardEmptyBars message="Sin datos de áreas" variant="area" />
              )}
            </div>
          </ChartCard>
        </div>

        <div className="dashboard-fit__chart">
          <ChartCard title="Distribución general de inventario">
            <div className="dashboard-chart-slot">
              <Chart
                key={doughnutData.labels.join(',')}
                type="pie"
                data={doughnutData}
                options={pieOptions}
              />
            </div>
          </ChartCard>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
