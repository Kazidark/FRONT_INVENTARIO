import { useEffect, useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';

import PCsLaptopsTable from './PCsLaptopsTable';
import PCLaptopForm from './PCLaptopForm';

import {
  getPCsLaptops,
  updatePcEstado
} from '../../api/pcs_laptops.api';

const PCsLaptopsPage = () => {
  console.log('PCsLaptopsPage RENDERIZADO ✅');

  /* =========================
     STATES
  ========================= */
  const [pcsOriginal, setPcsOriginal] = useState([]); // fuente real
  const [pcs, setPcs] = useState([]);                 // filtrados
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH PCS
  ========================= */
  const fetchPCs = async () => {
    setLoading(true);
    try {
      const data = await getPCsLaptops();
      const list = Array.isArray(data) ? data : [];

      setPcsOriginal(list);
      setPcs(list); // inicialmente sin filtro
    } catch {
      setPcsOriginal([]);
      setPcs([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    setSelected(null);
    fetchPCs();
  }, []);

  /* =========================
     🔍 FILTRO POR SERIE (PRIMERO QUE SE EJECUTA)
  ========================= */
  useEffect(() => {
    const filtrados = pcsOriginal.filter(p =>
      p.serie?.toLowerCase().includes(search.toLowerCase())
    );
    setPcs(filtrados);
  }, [search, pcsOriginal]);

  /* =========================
     ACTIVAR / DESACTIVAR
  ========================= */
  const toggleActivo = async () => {
    if (!selected) return;

    await updatePcEstado(selected.id_pc, {
      activo: selected.activo ? 0 : 1
    });

    setSelected(null);
    fetchPCs();
  };

  return (
    <div style={styles.pageWrapper}>
      <h1 style={styles.pageTitle}>Inventario de PCs / Laptops</h1>

      <div style={styles.headerRow}>
        <StatCard label="Total de equipos" value={pcs.length} />

        <div style={styles.actions}>
          <button style={styles.btnPrimary} onClick={() => setOpenForm(true)}>
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

      {/* 🔍 BUSCADOR (SIEMPRE VISIBLE) */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Buscar por número de serie"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* TABLA */}
      <section style={styles.tableSection}>
        {loading ? (
          <p>Cargando equipos...</p>
        ) : (
          <PCsLaptopsTable
            pcs={pcs}
            selected={selected}
            onSelect={setSelected}
          />
        )}
      </section>

      {/* MODAL */}
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <PCLaptopForm
          selected={selected}
          onSaved={() => {
            setOpenForm(false);
            setSelected(null);
            fetchPCs();
          }}
        />
      </Modal>
    </div>
  );
};

/* =========================
   ESTILOS
========================= */
const styles = {
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column'
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 20
  },

  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 16
  },

  actions: {
    display: 'flex',
    gap: 12
  },

  searchContainer: {
    background: '#ffffff',
    padding: '14px',
    borderRadius: '14px',
    marginBottom: '16px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
    maxWidth: '480px'
  },

  searchInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '14px'
  },

  tableSection: {
    background: '#ffffff',
    borderRadius: 14,
    padding: 20,
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
  },

  btnPrimary: { background: '#2563eb', color: '#fff', padding: '10px 18px', borderRadius: 8 },
  btnSecondary: { background: '#6b7280', color: '#fff', padding: '10px 18px', borderRadius: 8 },
  btnDanger: { background: '#dc2626', color: '#fff', padding: '10px 18px', borderRadius: 8 },
  btnSuccess: { background: '#16a34a', color: '#fff', padding: '10px 18px', borderRadius: 8 },
  btnDisabled: { background: '#e5e7eb', color: '#9ca3af', padding: '10px 18px', borderRadius: 8 }
};

export default PCsLaptopsPage;
