import { useEffect, useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import TabletsTable from './TabletsTable';
import TabletForm from './TabletForm';
import { getTablets, updateTabletEstado } from '../../api/tablets.api';


const TabletsPage = () => {
  const [tablets, setTablets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTablets = async () => {
    setLoading(true);
    const data = await getTablets();
    const list = Array.isArray(data) ? data : [];
    setTablets(list);
    setFiltered(list);
    setLoading(false);
  };

  useEffect(() => {
    setSelected(null);
    fetchTablets();
  }, []);

  /* 🔍 BÚSQUEDA AMPLIADA */
  useEffect(() => {
    const text = search.toLowerCase();
    const f = tablets.filter(t =>
      [
        t.imei_tablet,
        t.estado_tablet,
        t.estado_equipo,
        t.nombre_area,
        t.usuario
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(text)
    );
    setFiltered(f);
  }, [search, tablets]);

  const toggleActivo = async () => {
    if (!selected) return;
    await updateTabletEstado(selected.id_tablet, selected.activo ? 0 : 1);
    setSelected(null);
    fetchTablets();
  };

  return (
    <>
      <h1 style={styles.pageTitle}>Inventario de Tablets</h1>

      {/* 🔍 BUSCADOR */}
      <input
        style={styles.search}
        placeholder="🔍 Buscar por IMEI, estado o área"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* ===== HEADER ===== */}
      <div style={styles.headerRow}>
        <StatCard label="Total de tablets" value={filtered.length} />

        <div style={styles.actions}>
          <button
            style={styles.btnPrimary}
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
          >
            ➕ Agregar
          </button>

          <button
            style={styles.btnSecondary}
            disabled={!selected}
            onClick={() => setOpenForm(true)}
          >
            ✏️ Editar
          </button>

          <button
            disabled={!selected}
            onClick={toggleActivo}
            style={
              selected
                ? selected.activo
                  ? styles.btnDanger
                  : styles.btnSuccess
                : styles.btnDisabled
            }
          >
            {selected?.activo ? '⛔ Desactivar' : '✅ Reactivar'}
          </button>
        </div>
      </div>

      {/* ===== TABLA ===== */}
      <section style={styles.tableSection}>
        {loading ? (
          <p>Cargando tablets...</p>
        ) : (
          <TabletsTable
            tablets={filtered}
            selected={selected}
            onSelect={setSelected}
          />
        )}
      </section>

      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <TabletForm
          selectedTablet={selected}
          onSaved={() => {
            setOpenForm(false);
            setSelected(null);
            fetchTablets();
          }}
        />
      </Modal>
    </>
  );
};

const styles = {
  pageTitle: { fontSize: 28, fontWeight: 600, marginBottom: 12 },
  search: {
    width: 320,
    padding: '10px 16px',
    borderRadius: 999,
    border: '1px solid #d1d5db',
    marginBottom: 20
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  actions: { display: 'flex', gap: 12 },
  tableSection: {
    background: '#fff',
    padding: 20,
    borderRadius: 14,
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
  },
  btnPrimary: { background: '#2563eb', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none' },
  btnSecondary: { background: '#6b7280', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none' },
  btnDanger: { background: '#dc2626', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none' },
  btnSuccess: { background: '#16a34a', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none' },
  btnDisabled: { background: '#e5e7eb', color: '#9ca3af', padding: '10px 18px', borderRadius: 8, border: 'none' }
};

export default TabletsPage;