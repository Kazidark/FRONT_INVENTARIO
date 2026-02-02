import { useEffect, useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import MonitoresTable from './MonitoresTable';
import MonitorForm from './MonitorForm';
import {
  getMonitores,
  updateMonitorEstado
} from '../../api/monitores.api';

const MonitoresPage = () => {
  const [monitores, setMonitores] = useState([]);
  const [filteredMonitores, setFilteredMonitores] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================
     CARGA DE MONITORES
  ========================= */
  const fetchMonitores = async () => {
    setLoading(true);
    try {
      const data = await getMonitores();
      const list = Array.isArray(data) ? data : [];
      setMonitores(list);
      setFilteredMonitores(list);
    } catch (error) {
      console.error('Error al cargar monitores', error);
      setMonitores([]);
      setFilteredMonitores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelected(null);
    fetchMonitores();
  }, []);

  /* =========================
     FILTRO POR SERIAL
  ========================= */
  useEffect(() => {
  const texto = search.toLowerCase();

  const filtered = monitores.filter(m =>
    [
      m.serie,
      m.estado_equipo,
      m.status_monitor,   // por si cambia el nombre
      m.nombre_area || m.area,
      m.anexo
    ]
      .filter(Boolean)                // elimina null / undefined
      .join(' ')
      .toLowerCase()
      .includes(texto)
  );

  setFilteredMonitores(filtered);
}, [search, monitores]);


  /* =========================
     ACTIVAR / DESACTIVAR
  ========================= */
  const toggleActivo = async () => {
    if (!selected) return;

    const confirmar = window.confirm(
      `¿Deseas ${selected.activo ? 'desactivar' : 'activar'} este monitor?`
    );
    if (!confirmar) return;

    try {
      await updateMonitorEstado(
        selected.id_monitor,
        selected.activo ? 0 : 1
      );

      alert('✅ Estado del monitor actualizado correctamente');
      setSelected(null);
      fetchMonitores();
    } catch (error) {
      console.error('Error al cambiar estado del monitor', error);
      alert(
        error.response?.data?.message ||
          'No se pudo cambiar el estado del monitor'
      );
    }
  };

  return (
    <>
      {/* ===== TÍTULO ===== */}
      <h1 style={styles.pageTitle}>Inventario de Monitores</h1>

      {/* 🔍 BUSCADOR POR SERIAL */}
      <input
        style={styles.search}
        placeholder="🔍 Buscar por número de serie"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* ===== HEADER ===== */}
      <div style={styles.headerRow}>
        <StatCard
          label="Total de monitores"
          value={filteredMonitores.length}
        />

        <div style={styles.actions}>
          {/* ➕ AGREGAR */}
          <button
            style={styles.btnPrimary}
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
          >
            ➕ Agregar
          </button>

          {/* ✏️ EDITAR */}
          <button
            style={styles.btnSecondary}
            disabled={!selected}
            onClick={() => setOpenForm(true)}
          >
            ✏️ Editar
          </button>

          {/* ⛔ / ✅ ACTIVAR */}
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
          <p>Cargando monitores...</p>
        ) : (
          <MonitoresTable
            monitores={filteredMonitores}
            selected={selected}
            onSelect={setSelected}
          />
        )}
      </section>

      {/* ===== MODAL ===== */}
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <MonitorForm
          selected={selected}
          onSaved={() => {
            alert('✅ Monitor guardado correctamente');
            setOpenForm(false);
            setSelected(null);
            fetchMonitores();
          }}
        />
      </Modal>
    </>
  );
};

/* =========================
   ESTILOS
========================= */
const styles = {
  pageTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1f2937'
  },
  search: {
    width: '320px',
    padding: '10px 16px',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    marginBottom: '20px',
    outline: 'none'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  actions: {
    display: 'flex',
    gap: '12px'
  },
  tableSection: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
  },
  btnPrimary: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  btnSecondary: {
    background: '#6b7280',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  btnDanger: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  btnSuccess: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  btnDisabled: {
    background: '#e5e7eb',
    color: '#9ca3af',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontWeight: '500'
  }
};

export default MonitoresPage;
