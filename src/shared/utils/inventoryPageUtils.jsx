export const asArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

export const buildLookup = (rows, idKey, labelKey) => {
  const map = new Map();
  for (const row of rows) {
    const id = Number(row[idKey]);
    const label = row[labelKey];
    if (Number.isFinite(id) && label) map.set(id, String(label));
  }
  return map;
};

export const resolveLabel = (row, descKeys, idKeys, lookup) => {
  for (const key of descKeys) {
    const v = row?.[key];
    if (v != null && v !== '') return String(v);
  }
  for (const key of idKeys) {
    const id = row?.[key];
    if (id != null && id !== '') {
      const fromCatalog = lookup?.get(Number(id));
      if (fromCatalog) return fromCatalog;
    }
  }
  return null;
};

export const ubicacionCell = (label) => {
  if (!label || label === '—' || label === '-') {
    return <span className="inv-status-empty">—</span>;
  }
  return <span>{label}</span>;
};

export const wrapFetchWithStats = (fetchFn, setStats, activeField = 'activo') => async () => {
  const rows = await fetchFn();
  const list = asArray(rows);
  setStats({
    total: list.length,
    activos: list.filter((r) => Boolean(r?.[activeField])).length
  });
  return list;
};

export { default as StatPills } from '../components/ui/StatPills';

export const InventoryPageShell = ({ hero, children }) => (
  <div className="inv-page app-view">
    <div className="inv-page__frame">
      {hero}
      <div className="inv-page__grid">{children}</div>
    </div>
  </div>
);
