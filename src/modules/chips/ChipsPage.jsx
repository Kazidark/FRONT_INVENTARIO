import { useEffect, useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import ChipsTable from './ChipsTable';
import ChipForm from './ChipForm';
import { getChips, updateChipEstado } from '../../api/chips.api';

const ChipsPage = () => {
  const [chips, setChips] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  /* 🔍 FILTROS */
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState(''); // '', Voz, Datos

  const fetchChips = async () => {
    setLoading(true);
    const data = await getChips();
    setChips(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchChips();
  }, []);

  /* 🔍 FILTRO COMBINADO */
  const filteredChips = chips.filter(c => {
  const textoBusqueda = search.toLowerCase();

  const matchTexto = [
    c.numero_chip,
    c.operador,
    c.area,
    c.estado_chip
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(textoBusqueda);

  const matchTipo =
    tipo === '' || c.tipo_chip === tipo;

  return matchTexto && matchTipo;
});


  const toggleActivo = async () => {
    if (!selected) return;
    await updateChipEstado(selected.id_chip);
    setSelected(null);
    fetchChips();
  };

  return (
    <>
      <h1 style={styles.pageTitle}>Inventario de Chips</h1>

      {/* 🔍 FILTROS */}
      <div style={styles.filters}>
        <input
          style={styles.search}
          placeholder="🔍 Buscar por número de chip"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          style={styles.select}
          value={tipo}
          onChange={e => setTipo(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Voz">Voz</option>
          <option value="Datos">Datos</option>
        </select>
      </div>

      <div style={styles.headerRow}>
        <StatCard label="Total de chips" value={filteredChips.length} />

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
            style={selected?.activo ? styles.btnDanger : styles.btnSuccess}
            disabled={!selected}
            onClick={toggleActivo}
          >
            {selected?.activo ? '⛔ Desactivar' : '✅ Reactivar'}
          </button>
        </div>
      </div>

      <section style={styles.tableSection}>
        {loading ? 'Cargando...' : (
          <ChipsTable
            chips={filteredChips}
            selected={selected}
            onSelect={setSelected}
          />
        )}
      </section>

      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <ChipForm
          selectedChip={selected}
          onSaved={() => {
            setOpenForm(false);
            setSelected(null);
            fetchChips();
          }}
        />
      </Modal>
    </>
  );
};

const styles = {
  pageTitle: {
    fontSize: 28,
    marginBottom: 12
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: 18
  },
  search: {
    width: 260,
    padding: '10px 14px',
    borderRadius: 999,
    border: '1px solid #d1d5db'
  },
  select: {
    padding: '10px 14px',
    borderRadius: 999,
    border: '1px solid #d1d5db',
    background: '#fff'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  actions: {
    display: 'flex',
    gap: 12
  },
  tableSection: {
    background: '#fff',
    padding: 20,
    borderRadius: 14
  },
  btnPrimary: {
    background: '#2563eb',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: 8,
    border: 'none'
  },
  btnSecondary: {
    background: '#6b7280',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: 8,
    border: 'none'
  },
  btnDanger: {
    background: '#dc2626',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: 8,
    border: 'none'
  },
  btnSuccess: {
    background: '#16a34a',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: 8,
    border: 'none'
  }
};

export default ChipsPage;
