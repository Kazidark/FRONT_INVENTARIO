import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ collapsed, toggle, onSelect, active, mobileOpen = false, onMobileClose }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.roles === 1;

  const handleLogout = () => {
    logout();
    onMobileClose?.();
  };

  const DesktopSidebar = (
    <aside className="app-sidebar app-sidebar-fixed d-none d-lg-flex flex-column position-fixed start-0">
      <div className="px-3 pt-3 pb-2 d-flex align-items-center gap-2">
        <button
          type="button"
          className="app-sidebar-toggle-btn"
          onClick={toggle}
          title={collapsed ? 'Mostrar' : 'Ocultar'}
          aria-label={collapsed ? 'Mostrar' : 'Ocultar'}
        >
          <i className="pi pi-bars" />
        </button>

        {!collapsed && (
          <div className="app-sidebar-title">
            Menú
          </div>
        )}
      </div>

      <div className="app-sidebar-scroll flex-grow-1 px-2 pb-2">
        <div className="nav nav-pills flex-column gap-1">
          <MenuItem icon="pi-home" label="Inicio" {...menuProps('dashboard')} />
          <MenuItem icon="pi-wifi" label="Módems" {...menuProps('modems')} />
          <MenuItem icon="pi-sim-card" label="Chips" {...menuProps('chips')} />
          <MenuItem icon="pi-mobile" label="Celulares" {...menuProps('celulares')} />
          <MenuItem icon="pi-desktop" label="PC / Laptops" {...menuProps('pcs-laptops')} />
          <MenuItem icon="pi-window-maximize" label="Monitores" {...menuProps('monitores')} />
          <MenuItem icon="pi-tablet" label="Tablets" {...menuProps('tablets')} />
          <MenuItem icon="pi-link" label="Asignaciones" {...menuProps('asignaciones')} />

        </div>

        {isAdmin && (
          <>
            {!collapsed && <div className="app-nav-section mt-3">Administración</div>}
            <div className="nav nav-pills flex-column gap-1">
              <MenuItem icon="pi-users" label="Colaboradores" {...menuProps('colaboradores')} />
              <MenuItem icon="pi-user" label="Usuarios" {...menuProps('usuarios')} />
            </div>
          </>
        )}
      </div>

      <div className="p-3 app-sidebar-logout-wrap">
        <button
          type="button"
          className={`app-logout-btn w-100 d-flex align-items-center justify-content-${collapsed ? 'center' : 'start'} gap-2`}
          onClick={handleLogout}
        >
          <i className="pi pi-sign-out" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );

  const MobileSidebar = (
    <>
      <div
        className={`app-sidebar-backdrop d-lg-none ${mobileOpen ? 'show' : ''}`}
        onClick={() => onMobileClose?.()}
        role="button"
        tabIndex={-1}
        aria-label="Cerrar menú"
      />

      <aside className={`app-sidebar app-sidebar-mobile d-lg-none ${mobileOpen ? 'show' : ''}`}>
        <div className="px-3 pt-3 pb-2 d-flex align-items-center justify-content-between">
          <div className="app-sidebar-title">Menú</div>
          <button
            type="button"
            className="btn btn-sm btn-outline-success"
            onClick={() => onMobileClose?.()}
            aria-label="Cerrar"
          >
            <i className="pi pi-times" />
          </button>
        </div>

        <div className="app-sidebar-scroll px-2 py-2">
          <div className="nav nav-pills flex-column gap-1">
            <MenuItem icon="pi-home" label="Inicio" {...menuPropsMobile('dashboard')} />
            <MenuItem icon="pi-wifi" label="Módems" {...menuPropsMobile('modems')} />
            <MenuItem icon="pi-sim-card" label="Chips" {...menuPropsMobile('chips')} />
            <MenuItem icon="pi-mobile" label="Celulares" {...menuPropsMobile('celulares')} />
            <MenuItem icon="pi-desktop" label="PC / Laptops" {...menuPropsMobile('pcs-laptops')} />
            <MenuItem icon="pi-window-maximize" label="Monitores" {...menuPropsMobile('monitores')} />
            <MenuItem icon="pi-tablet" label="Tablets" {...menuPropsMobile('tablets')} />
            <MenuItem icon="pi-link" label="Asignaciones" {...menuPropsMobile('asignaciones')} />
          </div>

          {isAdmin && (
            <>
              <div className="app-nav-section mt-3">Administración</div>
              <div className="nav nav-pills flex-column gap-1">
                <MenuItem icon="pi-users" label="Colaboradores" {...menuPropsMobile('colaboradores')} />
                <MenuItem icon="pi-user" label="Usuarios" {...menuPropsMobile('usuarios')} />
              </div>
            </>
          )}
        </div>

        <div className="mt-auto p-3 app-sidebar-logout-wrap">
          <button
            type="button"
            className="app-logout-btn w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <i className="pi pi-sign-out" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileSidebar}
    </>
  );

  function menuProps(view) {
    return {
      collapsed,
      active: active === view,
      onClick: () => onSelect(view)
    };
  }

  function menuPropsMobile(view) {
    return {
      collapsed: false,
      active: active === view,
      onClick: () => {
        onSelect(view);
        onMobileClose?.();
      }
    };
  }
};

/* =========================
   ITEM DE MENÚ
========================= */
const MenuItem = ({ icon, label, active, onClick, collapsed }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`nav-link d-flex align-items-center gap-2 text-start ${active ? 'active' : ''}`}
    style={{
      justifyContent: collapsed ? 'center' : 'flex-start'
    }}
  >
    <span className="app-nav-icon" aria-hidden="true">
      <i className={`pi ${icon}`} />
    </span>
    {!collapsed && <span className="flex-grow-1">{label}</span>}
  </button>
);

export default Sidebar;
