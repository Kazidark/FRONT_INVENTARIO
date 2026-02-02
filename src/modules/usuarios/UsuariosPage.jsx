import { useEffect, useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import UsuariosTable from './UsuariosTable';
import UsuarioForm from './UsuarioForm';
import { getUsuarios, updateUsuarioEstado } from '../../api/usuarios.api';
// import { useAuth } from '../../context/AuthContext';

/* =========================
   ESTILOS DE BOTONES
========================= */
const buttonStyles = {
  base: {
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  primary: {
    background: '#2563eb',
    color: '#fff'
  },
  secondary: {
    background: '#6b7280',
    color: '#fff'
  },
  danger: {
    background: '#dc2626',
    color: '#fff'
  },
  success: {
    background: '#16a34a',
    color: '#fff'
  },
  disabled: {
    background: '#e5e7eb',
    color: '#9ca3af',
    cursor: 'not-allowed'
  }
};

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

  /* =========================
     CARGA DE USUARIOS
  ========================= */
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      const list = Array.isArray(data) ? data : [];
      setUsuarios(list);
      setFilteredUsuarios(list);
    } catch (err) {
      console.error(err);
      setUsuarios([]);
      setFilteredUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelected(null);
    fetchUsuarios();
  }, []);

  /* =========================
     FILTRO POR NOMBRE
  ========================= */
  useEffect(() => {
    const filtered = usuarios.filter(u =>
      u.usuario?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  }, [search, usuarios]);

  /* =========================
     ACTIVAR / DESACTIVAR
  ========================= */
  const toggleActivo = async () => {
    if (!selected) return;

    const confirmar = window.confirm(
      `¿Deseas ${selected.activo ? 'desactivar' : 'activar'} este usuario?`
    );
    if (!confirmar) return;

    try {
      await updateUsuarioEstado(
        selected.id_usuario,
        selected.activo ? 0 : 1
      );

      alert('✅ Estado del usuario actualizado correctamente');
      setSelected(null);
      fetchUsuarios();
    } catch (error) {
      console.error('Error al cambiar estado de usuario', error);
      alert(
        error.response?.data?.message ||
          'No se pudo cambiar el estado del usuario'
      );
    }
  };

  return (
    <>
      {/* ===== TÍTULO ===== */}
      <h1 style={styles.pageTitle}>Usuarios del sistema</h1>

      {/* 🔍 BUSCADOR POR NOMBRE */}
      <input
        style={styles.search}
        placeholder="🔍 Buscar por nombre de usuario"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* ===== HEADER ===== */}
      <div style={styles.headerRow}>
        <StatCard
          label="Total de usuarios"
          value={filteredUsuarios.length}
        />

        <div style={styles.actions}>
          {/* ➕ AGREGAR */}
          <button
            style={{ ...buttonStyles.base, ...buttonStyles.primary }}
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
          >
            ➕ Agregar
          </button>

          {/* ✏️ EDITAR */}
          <button
            style={{
              ...buttonStyles.base,
              ...(selected
                ? buttonStyles.secondary
                : buttonStyles.disabled)
            }}
            disabled={!selected}
            onClick={() => setOpenForm(true)}
          >
            ✏️ Editar
          </button>

          {/* ⛔ / ✅ ACTIVAR */}
          <button
            style={{
              ...buttonStyles.base,
              ...(selected
                ? selected.activo
                  ? buttonStyles.danger
                  : buttonStyles.success
                : buttonStyles.disabled)
            }}
            disabled={!selected}
            onClick={toggleActivo}
          >
            {selected?.activo ? '⛔ Desactivar' : '✅ Reactivar'}
          </button>
        </div>
      </div>

      {/* ===== TABLA ===== */}
      <section style={styles.tableSection}>
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <UsuariosTable
            usuarios={filteredUsuarios}
            selected={selected}
            onSelect={setSelected}
          />
        )}
      </section>

      {/* ===== MODAL ===== */}
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <UsuarioForm
          selected={selected}
          onSaved={() => {
            alert('✅ Usuario guardado correctamente');
            setOpenForm(false);
            setSelected(null);
            fetchUsuarios();
          }}
        />
      </Modal>
    </>
  );
};

/* =========================
   ESTILOS GENERALES
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
  }
};

export default UsuariosPage;
