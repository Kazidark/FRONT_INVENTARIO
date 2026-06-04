import { Tag } from 'primereact/tag';

const normalize = (v) =>
  String(v ?? '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const pickSeverity = (label) => {
  const t = normalize(label);
  if (!t || t === '-') return 'secondary';
  if (t === 'ACTIVO') return 'success';
  if (t === 'INACTIVO') return 'danger';
  if (t.includes('INOPERATIVO')) return 'danger';
  if (t.includes('OPERATIVO')) return 'success';
  if (t.includes('ROBADO') || t.includes('MALOGRADO')) return 'danger';
  if (t.includes('ASIGNADO') || t.includes('PATRIMONIAL')) return 'info';
  if (t.includes('STOCK') || t.includes('ALMACEN')) return 'warning';
  if (t.includes('NO UBICADO') || t.includes('USADO')) return 'secondary';
  return 'contrast';
};

/**
 * Badge de estado para grillas — colores alineados al manual SANNA 2023.
 */
const InventoryStatusBadge = ({ value, rounded = true, useTag = false }) => {
  const label = value == null || value === '' ? '—' : String(value);
  if (label === '—' || label === '-') {
    return <span className="inv-status-empty" aria-hidden>—</span>;
  }

  const severity = pickSeverity(label);

  if (useTag) {
    return <Tag value={label} severity={severity} rounded={rounded} />;
  }

  return (
    <span className={`inv-status-badge inv-status-badge--${severity}`} title={label}>
      {label}
    </span>
  );
};

export default InventoryStatusBadge;
