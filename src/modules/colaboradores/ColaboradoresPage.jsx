import { useEffect, useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import ColaboradoresTable from './ColaboradoresTable';
import ColaboradorForm from './ColaboradorForm';
import {
  getColaboradores,
  updateColaboradorEstado
} from '../../api/colaboradores.api';

const ColaboradoresPage = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchColaboradores = async () => {
    setLoading(true);
    const data = await getColaboradores();
    const list = Array.isArray(data) ? data : [];
    setColaboradores(list);
    setFiltered(list);
    setLoading(false);
  };

  useEffect(() => {
    setSelected(null);
    fetchColaboradores();
  }, []);

  /* 🔍 BÚSQUEDA POR DOCUMENTO Y NOMBRE */
  useEffect(() => {
    const f = colaboradores.filter(c =>
      `${c.documento} ${c.nombre_completo}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, colaboradores]);

  const toggleActivo = async () => {
    if (!selected) return;

    const confirmar = window.confirm(
      `¿Deseas ${selected.activo ? 'desactivar' : 'activar'} este colaborador?`
    );
    if (!confirmar) return;

    await updateColaboradorEstado(
      selected.id_colaborador,
      selected.activo ? 0 : 1
    );

    alert('✅ Estado del colaborador actualizado');
    setSelected(null);
    fetchColaboradores();
  };

  return (
    <>
      <h1 style={styles.pageTitle}>Colaboradores</h1>

      {/* 🔍 BUSCADOR */}
      <input
        style={styles.search}
        placeholder="🔍 Buscar por documento o nombre"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={styles.headerRow}>
        <StatCard
          label="Total de colaboradores"
          value={filtered.length}
        />

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
            {selected?.activo ? '⛔ Cesar' : '✅ Reactivar'}
          </button>
        </div>
      </div>

      <section style={styles.tableSection}>
        {loading ? (
          <p>Cargando colaboradores...</p>
        ) : (
          <ColaboradoresTable
            colaboradores={filtered}
            selected={selected}
            onSelect={setSelected}
          />
        )}
      </section>

      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <ColaboradorForm
          selected={selected}
          onSaved={() => {
            setOpenForm(false);
            setSelected(null);
            fetchColaboradores();
          }}
        />
      </Modal>
    </>
  );
};

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
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer'
  },
  btnSecondary: {
    background: '#6b7280',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer'
  },
  btnDanger: {
    background: '#dc2626',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer'
  },
  btnSuccess: {
    background: '#16a34a',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer'
  },
  btnDisabled: {
    background: '#e5e7eb',
    color: '#9ca3af',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'not-allowed'
  }
};

export default ColaboradoresPage;
