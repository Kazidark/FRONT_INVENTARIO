import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import StatCard from './components/ui/StatCard';
import Modal from './components/ui/Modal';

/* =========================
   AUTH
========================= */
import { useAuth } from './context/AuthContext';
import LoginPage from './modules/auth/LoginPage';
import ForgotPasswordPage from './modules/auth/ForgotPasswordPage';
import ResetPasswordPage from './modules/auth/ResetPasswordPage';

/* =========================
   MÓDEMS
========================= */
import ModemForm from './modules/modems/ModemForm';
import ModemsTable from './modules/modems/ModemsTable';
import { getModems, updateModemEstado } from './api/modems.api';

/* =========================
   PCS / LAPTOPS
========================= */
import PCsLaptopsTable from './modules/pcs_laptops/PCsLaptopsTable';
import PCLaptopForm from './modules/pcs_laptops/PCLaptopForm';
import { getPCsLaptops, updatePcEstado } from './api/pcs_laptops.api';

/* =========================
   OTRAS VISTAS
========================= */
import MonitoresPage from './modules/monitores/MonitoresPage';
import CelularesPage from './modules/celulares/CelularesPage';
import ChipsPage from './modules/chips/ChipsPage';
import TabletsPage from './modules/tablets/TabletsPage';
import AsignacionesPage from './modules/asignaciones/AsignacionesPage';
import UsuariosPage from './modules/usuarios/UsuariosPage';
import ColaboradoresPage from './modules/colaboradores/ColaboradoresPage';


/* =====================================================
   APP (ROUTER PRINCIPAL)
===================================================== */
function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/" />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/*" element={user ? <MainLayout /> : <Navigate to="/login" />} />
    </Routes>
  );
}

/* =====================================================
   MAIN LAYOUT
===================================================== */
function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState('modems');

  /* =========================
     MÓDEMS
  ========================= */
  const [modems, setModems] = useState([]);
  const [searchModem, setSearchModem] = useState('');
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const fetchModems = async () => {
    const data = await getModems();
    setModems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (view === 'modems') {
      setSelected(null);
      fetchModems();
    }
  }, [view]);

  /* 🔍 FILTRO EXTENDIDO DE MÓDEMS */
  const modemsFiltrados = modems.filter(m => {
    const texto = searchModem.toLowerCase();

    return [
      m.imei_modem,
      m.estado_modem,
      m.estado_equipo,
      m.nombre_area || m.area,
      m.usuario
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(texto);
  });

  const toggleActivo = async () => {
    if (!selected) return;
    await updateModemEstado(selected.id_modem, selected.activo ? 0 : 1);
    fetchModems();
    setSelected(null);
  };

  /* =========================
     PCS / LAPTOPS
  ========================= */
  const [pcs, setPcs] = useState([]);
  const [searchSerie, setSearchSerie] = useState('');
  const [selectedPc, setSelectedPc] = useState(null);
  const [openPcForm, setOpenPcForm] = useState(false);

  const fetchPCs = async () => {
    const data = await getPCsLaptops();
    setPcs(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (view === 'pcs-laptops') {
      setSelectedPc(null);
      fetchPCs();
    }
  }, [view]);

  const pcsFiltrados = pcs.filter(p => {
  const texto = searchSerie.toLowerCase();

  return [
    p.serie,
    p.nombre_area || p.area,
    p.estado_equipo,
    p.anexo
  ]
    .filter(Boolean)          // evita null / undefined
    .join(' ')                // une todo en un solo string
    .toLowerCase()
    .includes(texto);
});


  const togglePcActivo = async () => {
    if (!selectedPc) return;
    await updatePcEstado(selectedPc.id_pc, { activo: selectedPc.activo ? 0 : 1 });
    fetchPCs();
    setSelectedPc(null);
  };

  return (
    <>
      <Sidebar collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} onSelect={setView} active={view} />

      <main style={{ ...styles.main, marginLeft: collapsed ? '70px' : '220px' }}>

        {/* ========================= MÓDEMS ========================= */}
        {view === 'modems' && (
          <>
            <h1 style={styles.pageTitle}>Inventario de Módems</h1>

            <input
              type="text"
              placeholder="🔍 Buscar por IMEI, estado, área..."
              value={searchModem}
              onChange={(e) => setSearchModem(e.target.value)}
              style={styles.searchInput}
            />

            <div style={styles.headerRow}>
              <StatCard label="Total de módems" value={modemsFiltrados.length} />
              <div style={styles.actions}>
                <button style={styles.btnPrimary} onClick={() => setOpenForm(true)}>➕ Agregar</button>
                <button style={styles.btnSecondary} disabled={!selected} onClick={() => setOpenForm(true)}>✏️ Editar</button>
                <button style={selected?.activo ? styles.btnDanger : styles.btnSuccess} disabled={!selected} onClick={toggleActivo}>
                  {selected?.activo ? '⛔ Desactivar' : '✅ Reactivar'}
                </button>
              </div>
            </div>

            <ModemsTable
              modems={modemsFiltrados}
              selected={selected}
              onSelect={setSelected}
            />

            <Modal open={openForm} onClose={() => setOpenForm(false)}>
              <ModemForm
                selectedModem={selected}
                onSaved={() => {
                  setOpenForm(false);
                  fetchModems();
                }}
              />
            </Modal>
          </>
        )}

        {/* ========================= PCS / LAPTOPS ========================= */}
        {view === 'pcs-laptops' && (
          <>
            <h1 style={styles.pageTitle}>Inventario de PCs / Laptops</h1>

            <input
              type="text"
              placeholder="🔍 Buscar por número de serie"
              value={searchSerie}
              onChange={(e) => setSearchSerie(e.target.value)}
              style={styles.searchInput}
            />

            <div style={styles.headerRow}>
              <StatCard label="Total de equipos" value={pcsFiltrados.length} />
              <div style={styles.actions}>
                <button style={styles.btnPrimary} onClick={() => setOpenPcForm(true)}>➕ Agregar</button>
                <button style={styles.btnSecondary} disabled={!selectedPc} onClick={() => setOpenPcForm(true)}>✏️ Editar</button>
                <button style={selectedPc?.activo ? styles.btnDanger : styles.btnSuccess} disabled={!selectedPc} onClick={togglePcActivo}>
                  {selectedPc?.activo ? '⛔ Desactivar' : '✅ Reactivar'}
                </button>
              </div>
            </div>

            <PCsLaptopsTable pcs={pcsFiltrados} selected={selectedPc} onSelect={setSelectedPc} />

            <Modal open={openPcForm} onClose={() => setOpenPcForm(false)}>
              <PCLaptopForm selected={selectedPc} onSaved={() => { setOpenPcForm(false); fetchPCs(); }} />
            </Modal>
          </>
        )}

        {view === 'monitores' && <MonitoresPage />}
        {view === 'chips' && <ChipsPage />}
        {view === 'celulares' && <CelularesPage />}
        {view === 'tablets' && <TabletsPage />}
        {view === 'asignaciones' && <AsignacionesPage />}
        {view === 'usuarios' && <UsuariosPage />}
        {view === 'colaboradores' && <ColaboradoresPage />}

      </main>
    </>
  );
}

/* =========================
   ESTILOS
========================= */
const styles = {
  main: {
    padding: '32px',
    background: 'linear-gradient(180deg, #f4f7fb 0%, #eef2f7 100%)',
    minHeight: '100vh'
  },
  pageTitle: { fontSize: 28, fontWeight: 600, marginBottom: 24 },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  actions: { display: 'flex', gap: 12 },
  btnPrimary: { background: '#2563eb', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none' },
  btnSecondary: { background: '#6b7280', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none' },
  btnDanger: { background: '#dc2626', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none' },
  btnSuccess: { background: '#16a34a', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none' },
  searchInput: {
    width: '320px',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    marginBottom: '18px',
    outline: 'none'
  }
};

export default App;
