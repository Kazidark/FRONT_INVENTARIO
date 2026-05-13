import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../shared/components/layout/Sidebar';

/* =========================
   AUTH
========================= */
import { useAuth } from '../shared/context/AuthContext';
import LoginPage from '../features/auth/pages/LoginPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';

/* =========================
   MÓDEMS
========================= */
import ModemsTable from '../features/modems/ModemsTable';
import DashboardPage from '../features/dashboard/pages/DashboardPage';

/* =========================
   OTRAS VISTAS
========================= */
import MonitoresPage from '../features/monitores/pages/MonitoresPage';
import PCsLaptopsPage from '../features/pcs-laptops/pages/PCsLaptopsPage';
import CelularesPage from '../features/celulares/pages/CelularesPage';
import ChipsPage from '../features/chips/pages/ChipsPage';
import TabletsPage from '../features/tablets/pages/TabletsPage';
import AsignacionesPage from '../features/asignaciones/pages/AsignacionesPage';
import UsuariosPage from '../features/usuarios/pages/UsuariosPage';
import ColaboradoresPage from '../features/colaboradores/pages/ColaboradoresPage';

/* =====================================================
   APP (ROUTER PRINCIPAL)
===================================================== */
function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/reset-password/:token"
        element={<Navigate to="/reset-password" replace />}
      />
      <Route path="/*" element={user ? <MainLayout /> : <Navigate to="/login" />} />
    </Routes>
  );
}

/* =====================================================
   MAIN LAYOUT
===================================================== */
function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeView = location.pathname.split('/')[1] || 'dashboard';

  return (
    <div className="app-layout" data-collapsed={collapsed ? 'true' : 'false'}>
      <header className="app-topbar navbar bg-white border-bottom sticky-top">
        <div className="container-fluid">
          <div className="app-topbar-inner">
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <button
                type="button"
                className="app-topbar-icon-btn d-lg-none"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú"
                title="Menú"
              >
                <i className="pi pi-bars" />
              </button>

              <button
                type="button"
                className="app-topbar-icon-btn d-none d-lg-inline-flex"
                onClick={() => setCollapsed((v) => !v)}
                aria-label={collapsed ? 'Mostrar menú' : 'Ocultar menú'}
                title={collapsed ? 'Mostrar menú' : 'Ocultar menú'}
              >
                <i className={`pi ${collapsed ? 'pi-bars' : 'pi-angle-left'}`} />
              </button>

              <div className="app-brand-wrap">
                <span className="app-brand-logo" aria-hidden="true">
                  <i className="pi pi-home" />
                </span>
                <span className="app-brand">
                  <span className="app-brand-name">SANNA</span>
                  <span className="app-brand-sub">Inventario</span>
                </span>
              </div>
            </div>

            <div className="app-topbar-search d-none d-md-flex">
              <i className="pi pi-search app-topbar-search-icon" aria-hidden="true" />
              <input
                type="search"
                className="app-topbar-search-input"
                placeholder="Buscar productos, órdenes..."
                aria-label="Buscar productos, órdenes"
              />
              <span className="app-topbar-search-shortcut">⌘K</span>
            </div>

            <div className="ms-auto d-flex align-items-center gap-2 flex-shrink-0">
              <button type="button" className="app-topbar-icon-btn" aria-label="Calendario" title="Calendario">
                <i className="pi pi-calendar" />
              </button>
              <button type="button" className="app-topbar-icon-btn" aria-label="Notificaciones" title="Notificaciones">
                <i className="pi pi-bell" />
              </button>
              <button type="button" className="app-topbar-icon-btn" aria-label="Configuración" title="Configuración">
                <i className="pi pi-cog" />
              </button>

              <UserPill user={user} />
            </div>
          </div>
        </div>
      </header>

      <Sidebar
        collapsed={collapsed}
        toggle={() => setCollapsed(!collapsed)}
        onSelect={(nextView) => navigate(nextView === 'dashboard' ? '/dashboard' : `/${nextView}`)}
        active={activeView}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main className="app-content">
        <div className="container-fluid py-4">
          <div className="app-view">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/modems" element={<ModemsTable />} />
              <Route path="/pcs-laptops" element={<PCsLaptopsPage />} />
              <Route path="/monitores" element={<MonitoresPage />} />
              <Route path="/chips" element={<ChipsPage />} />
              <Route path="/celulares" element={<CelularesPage />} />
              <Route path="/tablets" element={<TabletsPage />} />
              <Route path="/asignaciones" element={<AsignacionesPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/colaboradores" element={<ColaboradoresPage />} />
              <Route path="/perfiles" element={<ColaboradoresPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

function getUserEmail(user) {
  if (!user) return '';
  return (
    user.login_email ||
    user.email ||
    user.user?.email ||
    user.usuario?.email ||
    ''
  );
}

function getInitials(text) {
  const s = String(text || '').trim();
  if (!s) return 'U';
  const base = s.includes('@') ? s.split('@')[0] : s;
  const parts = base.replace(/[._-]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  const a = (parts[0]?.[0] || 'U').toUpperCase();
  const b = (parts[1]?.[0] || parts[0]?.[1] || '').toUpperCase();
  return (a + b).slice(0, 2);
}

function UserPill({ user }) {
  const email = getUserEmail(user);
  const role = user?.rol || user?.user?.rol || '';
  const label = email || role || 'Usuario';

  return (
    <div className="app-user-pill" title={email || role || ''}>
      <div className="app-user-avatar" aria-hidden="true">
        {getInitials(label)}
        <span className="app-user-status-dot" />
      </div>
      <div className="app-user-meta">
        <div className="app-user-email">
          <i className="pi pi-envelope me-2" aria-hidden="true" />
          {email || '—'}
        </div>
        <div className="app-user-role">{role || 'Sesión activa'}</div>
      </div>
      <i className="pi pi-angle-down app-user-chevron" aria-hidden="true" />
    </div>
  );
}

export default App;
