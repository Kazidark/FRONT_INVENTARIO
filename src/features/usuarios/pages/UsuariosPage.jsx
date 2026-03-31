import { useEffect, useState } from 'react';
import StatCard from '../../../shared/components/ui/StatCard';
import Modal from '../../../shared/components/ui/Modal';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { toast } from 'react-hot-toast';
import UsuariosTable from '../components/UsuariosTable';
import UsuarioForm from '../components/UsuarioForm';
import { getUsuarios, updateUsuarioEstado } from '../../../services/api/usuarios.api';
// import { useAuth } from '../../context/AuthContext';

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

      toast.success('Estado del usuario actualizado correctamente');
      setSelected(null);
      fetchUsuarios();
    } catch (error) {
      console.error('Error al cambiar estado de usuario', error);
      toast.error(
        error.response?.data?.message ||
          'No se pudo cambiar el estado del usuario'
      );
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1">Usuarios del sistema</h1>
          <div className="text-secondary small">Crea usuarios y administra su estado.</div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Button
            label="Agregar"
            icon="pi pi-plus"
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
          />
          <Button
            label="Editar"
            icon="pi pi-pencil"
            severity="secondary"
            disabled={!selected}
            onClick={() => setOpenForm(true)}
          />
          <Button
            label={selected?.activo ? 'Desactivar' : 'Reactivar'}
            icon={selected?.activo ? 'pi pi-ban' : 'pi pi-check'}
            severity={selected?.activo ? 'danger' : 'success'}
            disabled={!selected}
            onClick={toggleActivo}
          />
        </div>
      </div>

      <div className="row g-3 align-items-stretch mb-3">
        <div className="col-12 col-lg-6">
          <span className="p-input-icon-left w-100">
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por usuario…"
              className="w-100"
            />
          </span>
        </div>
        <div className="col-12 col-lg-3">
          <StatCard label="Total de usuarios" value={filteredUsuarios.length} icon="pi pi-user" tone="primary" />
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-3">
              <Skeleton height="2rem" className="mb-2" />
              <Skeleton height="2rem" className="mb-2" />
              <Skeleton height="2rem" className="mb-2" />
              <Skeleton height="2rem" className="mb-2" />
              <Skeleton height="2rem" />
            </div>
          ) : (
            <UsuariosTable
              usuarios={filteredUsuarios}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </div>
      </div>

      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={selected ? 'Editar usuario' : 'Nuevo usuario'}
      >
        <UsuarioForm
          selected={selected}
          onSaved={() => {
            toast.success('Usuario guardado correctamente');
            setOpenForm(false);
            setSelected(null);
            fetchUsuarios();
          }}
        />
      </Modal>
    </>
  );
};

export default UsuariosPage;
