import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ collapsed, toggle, onSelect, active }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.rol === 'Administrador';

  return (
    <aside
      style={{
        width: collapsed ? '70px' : '220px',
        transition: 'width 0.25s ease',
        background: '#0f172a',
        color: '#fff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        <button onClick={toggle} style={styles.toggle} title="Contraer / Expandir">
          ☰
        </button>
      </div>

      {/* ===== MENÚ ===== */}
      <nav style={styles.menu}>
        <MenuItem icon="📶" label="Chips" {...menuProps('chips')} />
        <MenuItem icon="📱" label="Celulares" {...menuProps('celulares')} />
        <MenuItem icon="📡" label="Módems" {...menuProps('modems')} />
        <MenuItem icon="💻" label="PC / Laptops" {...menuProps('pcs-laptops')} />
        <MenuItem icon="🖥️" label="Monitores" {...menuProps('monitores')} />
        <MenuItem icon="📟" label="Tablets" {...menuProps('tablets')} />
        <MenuItem icon="📎" label="Asignaciones" {...menuProps('asignaciones')} />

        {/* ===== SOLO ADMIN ===== */}
        {isAdmin && (
          <>
            <div style={styles.divider} />

            {/* 🔹 NUEVO: COLABORADORES */}
            <MenuItem
              icon="👥"
              label="Colaboradores"
              {...menuProps('colaboradores')}
            />

            <MenuItem icon="👤" label="Usuarios" {...menuProps('usuarios')} />
          </>
        )}
      </nav>

      {/* ===== FOOTER / LOGOUT ===== */}
      <div style={styles.footer}>
        <button
          onClick={logout}
          title="Cerrar sesión"
          style={{
            ...styles.logoutBtn,
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}
        >
          🚪 {!collapsed && 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  );

  function menuProps(view) {
    return {
      collapsed,
      active: active === view,
      onClick: () => onSelect(view)
    };
  }
};

/* =========================
   ITEM DE MENÚ
========================= */
const MenuItem = ({ icon, label, active, onClick, collapsed }) => (
  <div
    onClick={onClick}
    title={label}
    style={{
      ...styles.menuItem,
      background: active ? '#1e293b' : 'transparent',
      justifyContent: collapsed ? 'center' : 'flex-start'
    }}
  >
    {/* Indicador activo */}
    {active && <span style={styles.activeBar} />}

    <span style={styles.icon}>{icon}</span>
    {!collapsed && <span style={styles.label}>{label}</span>}
  </div>
);

/* =========================
   ESTILOS
========================= */
const styles = {
  header: {
    textAlign: 'center',
    padding: '18px 0',
    borderBottom: '1px solid #1e293b'
  },

  toggle: {
    background: 'transparent',
    border: 'none',
    color: '#e5e7eb',
    fontSize: '18px',
    cursor: 'pointer'
  },

  menu: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    paddingTop: '10px'
  },

  menuItem: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s ease',
    borderRadius: '6px'
  },

  icon: {
    fontSize: '18px',
    minWidth: 22,
    textAlign: 'center'
  },

  label: {
    whiteSpace: 'nowrap'
  },

  activeBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 3,
    background: '#38bdf8'
  },

  divider: {
    margin: '10px 16px',
    borderTop: '1px solid #334155'
  },

  footer: {
    padding: '12px',
    borderTop: '1px solid #1e293b'
  },

  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    background: '#1f2937',
    border: 'none',
    color: '#fca5a5',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s ease'
  }
};

export default Sidebar;
