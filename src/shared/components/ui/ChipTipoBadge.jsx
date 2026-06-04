const normalize = (v) =>
  String(v ?? '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const pickVariant = (label) => {
  const t = normalize(label);
  if (!t || t === '-') return 'neutral';
  if (t.includes('DATO')) return 'datos';
  if (t.includes('VOZ') || t === 'OZ') return 'voz';
  return 'neutral';
};

/**
 * Badge para tipo de chip (VOZ / DATOS) con fondo de color.
 */
const ChipTipoBadge = ({ value }) => {
  const label = value == null || value === '' ? '—' : String(value);
  if (label === '—' || label === '-') {
    return <span className="inv-status-empty" aria-hidden>—</span>;
  }

  const variant = pickVariant(label);

  return (
    <span className={`inv-chip-tipo-badge inv-chip-tipo-badge--${variant}`} title={label}>
      {label}
    </span>
  );
};

export default ChipTipoBadge;
