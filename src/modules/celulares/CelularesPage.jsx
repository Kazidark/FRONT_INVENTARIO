import { useEffect, useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';

import CelularForm from './CelularForm';
import CelularesTable from './CelularesTable';

import {
  getCelulares,
  updateCelularEstado
} from '../../api/celulares.api';

const CelularesPage = () => {
  const [celulares, setCelulares] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCelulares = async () => {
    setLoading(true);
    const data = await getCelulares();
    const list = Array.isArray(data) ? data : [];
    setCelulares(list);
    setFiltered(list);
    setLoading(false);
  };

  useEffect(() => {
    setSelected(null);
    fetchCelulares();
  }, []);

useEffect(() => {
  const textoBusqueda = search.toLowerCase();

  const f = celulares.filter(c => {
    return [
      c.imei_celular,
      c.marca,
      c.nombre_area || c.area,
      c.estado_equipo,
      c.activo ? 'activo' : 'inactivo'
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(textoBusqueda);
  });

  setFiltered(f);
}, [search, celulares]);


  const toggleActivo = async () => {
    if (!selected) return;

    const confirmar = window.confirm(
      `¿Deseas ${selected.activo ? 'desactivar' : 'activar'} este celular?`
    );
    if (!confirmar) return;

    await updateCelularEstado(
      selected.id_celular,
      selected.activo ? 0 : 1
    );

    alert('✅ Estado del celular actualizado correctamente');
    setSelected(null);
    fetchCelulares();
  };

  return (
    <>
      <h1 style={styles.pageTitle}>Inventario de Celulares</h1>

      {/* 🔍 BUSCADOR */}
      <input
        style={styles.search}
        placeholder="🔍 Buscar por IMEI"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={styles.headerRow}>
        <StatCard label="Total de celulares" value={filtered.length} />

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

      <section style={styles.tableSection}>
        {loading ? (
          <p>Cargando celulares...</p>
        ) : (
          <CelularesTable
            celulares={filtered}
            selected={selected}
            onSelect={setSelected}
          />
        )}
      </section>

      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <CelularForm
          selectedCelular={selected}
          onSaved={() => {
            alert('✅ Celular guardado correctamente');
            setOpenForm(false);
            setSelected(null);
            fetchCelulares();
          }}
        />
      </Modal>
    </>
  );
};

const styles = {
  pageTitle: { fontSize: '28px', fontWeight: '600', marginBottom: '12px' },
  search: {
    width: '320px',
    padding: '10px 16px',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    marginBottom: '20px',
    outline: 'none'
  },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginBottom: '24px' },
  actions: { display: 'flex', gap: '12px'},
  tableSection: { background: '#fff', borderRadius: '14px', padding: '20px' },
  btnPrimary: { background: '#2563eb', color: '#fff', padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' },
  btnSecondary: { background: '#6b7280', color: '#fff', padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500'},
  btnDanger: { background: '#dc2626', color: '#fff', padding: '10px 18px', borderRadius: '8px', border: 'none',cursor: 'pointer', fontWeight: '500' },
  btnSuccess: { background: '#16a34a', color: '#fff', padding: '10px 18px', borderRadius: '8px', border: 'none',cursor: 'pointer', fontWeight: '500' },
  btnDisabled: { background: '#e5e7eb', color: '#9ca3af', padding: '10px 18px', borderRadius: '8px', border: 'none',cursor: 'not-allowed', fontWeight: '500' }
};

export default CelularesPage;
