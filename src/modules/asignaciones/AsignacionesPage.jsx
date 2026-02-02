import { useEffect, useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';

import AsignacionesTable from './AsignacionesTable';
import AsignacionForm from './AsignacionForm';

import {
  getAsignaciones,
  cerrarAsignacion
} from '../../api/asignaciones.api';

const AsignacionesPage = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================
     CARGAR ASIGNACIONES
  ========================= */
  const fetchAsignaciones = async () => {
    setLoading(true);
    try {
      const data = await getAsignaciones();
      setAsignaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al listar asignaciones', error);
      setAsignaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  /* =========================
     CERRAR ASIGNACIÓN
  ========================= */
  const handleCerrarAsignacion = async () => {
    if (!selected || !selected.activo) return;

    try {
      await cerrarAsignacion(selected.id_asignacion);
      setSelected(null);
      fetchAsignaciones();
    } catch (error) {
      console.error('Error al cerrar asignación', error);
    }
  };

  return (
    <>
      {/* =========================
          TÍTULO
      ========================= */}
      <h1 style={styles.pageTitle}>Asignaciones de Equipos</h1>

      {/* =========================
          HEADER
      ========================= */}
      <div style={styles.headerRow}>
        <StatCard
          label="Asignaciones activas"
          value={asignaciones.filter((a) => a.activo).length}
        />

        <div style={styles.actions}>
          <button
            style={styles.btnPrimary}
            onClick={() => setOpenForm(true)}
          >
            ➕ Nueva asignación
          </button>

          <button
            style={styles.btnDanger}
            disabled={!selected || !selected.activo}
            onClick={handleCerrarAsignacion}
          >
            ⛔ Cerrar asignación
          </button>
        </div>
      </div>

      {/* =========================
          TABLA
      ========================= */}
      <section style={styles.tableSection}>
        {loading ? (
          <p>Cargando asignaciones...</p>
        ) : (
          <AsignacionesTable
            asignaciones={asignaciones}
            selected={selected}
            onSelect={setSelected}
          />
        )}
      </section>

      {/* =========================
          MODAL FORM
      ========================= */}
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <AsignacionForm
          onSaved={() => {
            setOpenForm(false);
            fetchAsignaciones();
          }}
          onCancel={() => setOpenForm(false)}
        />
      </Modal>
    </>
  );
};

/* =========================
   ESTILOS (MISMO PATRÓN MÓDEMS)
========================= */
const styles = {
  pageTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1f2937'
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

  btnDanger: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    opacity: 1
  }
};

export default AsignacionesPage;
