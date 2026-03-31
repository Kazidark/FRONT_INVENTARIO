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

const PALETTE = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

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

const ChartCard = ({ title, children, className = '' }) => (
  <div className={`card border-0 shadow-sm h-100 ${className}`}>
    <div className="card-body">
      <h6 className="fw-semibold text-secondary mb-3" style={{ fontSize: '.85rem', letterSpacing: 0.3 }}>
        {title}
      </h6>
      {children}
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="p-3">
    <Skeleton width="40%" height="1rem" className="mb-3" />
    <Skeleton height="14rem" />
  </div>
);

const KpiSparkCard = ({
  title,
  value,
  delta,
  deltaUp = true,
  color = '#6366f1',
  points = []
}) => {
  const data = {
    labels: points.map((_, idx) => idx + 1),
    datasets: [
      {
        data: points,
        borderColor: color,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.45,
        fill: false,
        clip: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 4, right: 8, bottom: 4, left: 8 },
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false, grid: { display: false } },
      y: { display: false, grid: { display: false } },
    },
  };

  return (
    <div
      className="card h-100 border-0"
      style={{
        borderRadius: 10,
        background: '#ffffff',
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
      }}
    >
      <div className="card-body d-flex align-items-center justify-content-between py-3 px-3">
        <div>
          <div
            className="text-secondary fw-semibold"
            style={{ fontSize: '.9rem', letterSpacing: '.01em' }}
          >
            {title}
          </div>
          <div className="fw-bold mt-1" style={{ fontSize: '2rem', lineHeight: 1 }}>{value}</div>
          <div
            className={`fw-semibold mt-1 ${deltaUp ? 'text-success' : 'text-danger'}`}
            style={{ fontSize: '.9rem' }}
          >
            {delta}
            <span className="ms-1">{deltaUp ? '↑' : '↓'}</span>
          </div>
        </div>
        <div
          style={{
            width: 112,
            height: 48,
            minWidth: 112,
            overflow: 'hidden',
            borderRadius: 8,
          }}
        >
          <Chart type="line" data={data} options={options} />
        </div>
      </div>
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

  /* ── Bar: Total de inventario por módulo ── */
  const barData = useMemo(() => ({
    labels: equipmentModules.map((s) => s.label),
    datasets: [
      {
        label: 'Activos',
        data: equipmentModules.map((s) => s.activos),
        backgroundColor: '#10b981',
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: 'Inactivos',
        data: equipmentModules.map((s) => s.inactivos),
        backgroundColor: '#ef4444',
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  }), [equipmentModules]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  /* ── Doughnut: Distribución general de equipos ── */
  const doughnutData = useMemo(() => ({
    labels: equipmentModules.map((s) => s.label),
    datasets: [{
      data: equipmentModules.map((s) => s.total),
      backgroundColor: PALETTE.slice(0, equipmentModules.length),
      hoverOffset: 8,
      borderWidth: 2,
      borderColor: '#fff',
    }],
  }), [equipmentModules]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14, font: { size: 12 } } },
    },
  };

  /* ── Polar: Activos vs Inactivos global ── */
  const globalActivos = equipmentModules.reduce((sum, s) => sum + s.activos, 0);
  const globalInactivos = equipmentModules.reduce((sum, s) => sum + s.inactivos, 0);

  const polarData = useMemo(() => ({
    labels: ['Activos', 'Inactivos'],
    datasets: [{
      data: [globalActivos, globalInactivos],
      backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)'],
      borderColor: ['#10b981', '#ef4444'],
      borderWidth: 2,
    }],
  }), [globalActivos, globalInactivos]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } },
    },
  };

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
        backgroundColor: '#6366f1',
        borderRadius: 6,
        barPercentage: 0.6,
      }],
    };
  }, [equipmentModules]);

  const horizontalBarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

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
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
      }],
    };
  }, [data.asignaciones]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const simpleBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  if (loading) {
    return (
      <section>
        <div className="mb-4">
          <h1 className="h4 fw-bold mb-1">Dashboard</h1>
          <p className="text-secondary mb-0">Cargando datos del inventario...</p>
        </div>
        <div className="row g-3 mb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="col-12 col-sm-6 col-xl-3">
              <Skeleton height="5rem" borderRadius="0.75rem" />
            </div>
          ))}
        </div>
        <div className="row g-3">
          <div className="col-12 col-lg-8"><SkeletonChart /></div>
          <div className="col-12 col-lg-4"><SkeletonChart /></div>
        </div>
      </section>
    );
  }

  const totalEquipos = equipmentModules.reduce((s, m) => s + m.total, 0);
  const kpiCards = [
    {
      title: 'Inventario',
      value: totalEquipos,
      delta: `+${Math.round((globalActivos / Math.max(totalEquipos, 1)) * 100)}%`,
      deltaUp: true,
      color: '#7c83ff',
      points: [18, 22, 20, 27, 35, 32, 40, 44]
    },
    {
      title: 'Activos',
      value: globalActivos,
      delta: `+${Math.round((globalActivos / Math.max(globalActivos + globalInactivos, 1)) * 100)}%`,
      deltaUp: true,
      color: '#10b981',
      points: [30, 39, 36, 28, 34, 26, 41, 46]
    },
    {
      title: 'Asignaciones',
      value: data.asignaciones?.length || 0,
      delta: '+24%',
      deltaUp: false,
      color: '#ec4899',
      points: [45, 42, 38, 40, 35, 36, 31, 24]
    },
    {
      title: 'Stock',
      value: globalInactivos,
      delta: '+30%',
      deltaUp: true,
      color: '#f59e0b',
      points: [16, 24, 22, 29, 27, 33, 28, 31]
    }
  ];

  return (
    <section>
      <div className="mb-4">
        <h1 className="h4 fw-bold mb-1">Dashboard</h1>
        <p className="text-secondary mb-0">Resumen general del inventario &mdash; <strong>{totalEquipos}</strong> equipos registrados.</p>
      </div>

      {/* ─── KPI SPARK CARDS ─── */}
      <div
        className="mb-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.9rem',
        }}
      >
        {kpiCards.map((card) => (
          <div key={card.title}>
            <KpiSparkCard {...card} />
          </div>
        ))}
      </div>

      {/* ─── ROW 1: Bar + Doughnut ─── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          <ChartCard title="Inventario por módulo (Activos vs Inactivos)">
            <div style={{ height: 320 }}>
              <Chart type="bar" data={barData} options={barOptions} />
            </div>
          </ChartCard>
        </div>
        <div className="col-12 col-lg-4">
          <ChartCard title="Distribución general de equipos">
            <div style={{ height: 320 }}>
              <Chart type="doughnut" data={doughnutData} options={doughnutOptions} />
            </div>
          </ChartCard>
        </div>
      </div>

      {/* ─── ROW 2: Pie global + Equipos por Área ─── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-4">
          <ChartCard title="Estado global: Activos vs Inactivos">
            <div style={{ height: 300 }}>
              <Chart type="pie" data={polarData} options={pieOptions} />
            </div>
          </ChartCard>
        </div>
        <div className="col-12 col-lg-8">
          <ChartCard title="Top 10 — Equipos por Área">
            <div style={{ height: 300 }}>
              {areaDistribution.labels.length > 0
                ? <Chart type="bar" data={areaDistribution} options={horizontalBarOptions} />
                : <p className="text-secondary text-center mt-5">Sin datos de áreas disponibles</p>
              }
            </div>
          </ChartCard>
        </div>
      </div>

      {/* ─── ROW 3: Chips por operador + PCs por tipo ─── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <ChartCard title="Chips por Operador">
            <div style={{ height: 280 }}>
              {chipsByOperador.labels.length > 0
                ? <Chart type="bar" data={chipsByOperador} options={simpleBarOptions} />
                : <p className="text-secondary text-center mt-5">Sin datos de operadores</p>
              }
            </div>
          </ChartCard>
        </div>
        <div className="col-12 col-lg-6">
          <ChartCard title="PCs / Laptops por Tipo de equipo">
            <div style={{ height: 280 }}>
              {pcsByTipo.labels.length > 0
                ? <Chart type="doughnut" data={pcsByTipo} options={doughnutOptions} />
                : <p className="text-secondary text-center mt-5">Sin datos de tipos</p>
              }
            </div>
          </ChartCard>
        </div>
      </div>

      {/* ─── ROW 4: Tendencia asignaciones ─── */}
      {asignacionesTrend.labels.length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-12">
            <ChartCard title="Tendencia de Asignaciones por mes">
              <div style={{ height: 280 }}>
                <Chart type="line" data={asignacionesTrend} options={lineOptions} />
              </div>
            </ChartCard>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardPage;
