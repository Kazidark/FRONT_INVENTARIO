import { useEffect, useState } from 'react';
import StatCard from '../../../shared/components/ui/StatCard';
import Modal from '../../../shared/components/ui/Modal';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { toast } from 'react-hot-toast';
import ColaboradoresTable from '../components/ColaboradoresTable';
import ColaboradorForm from '../components/ColaboradorForm';
import {
  getColaboradores,
  updateColaboradorEstado
} from '../../../services/api/colaboradores.api';

const ColaboradoresPage = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchColaboradores = async () => {
    setLoading(true);
    const data = await getColaboradores();
    const list = Array.isArray(data) ? data : [];
    setColaboradores(list);
    setFiltered(list);
    setLoading(false);
  };

  useEffect(() => {
    setSelected(null);
    fetchColaboradores();
  }, []);

  /* 🔍 BÚSQUEDA POR DOCUMENTO Y NOMBRE */
  useEffect(() => {
    const f = colaboradores.filter(c =>
      `${c.documento} ${c.nombre_completo}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, colaboradores]);

  const toggleActivo = async () => {
    if (!selected) return;

    const confirmar = window.confirm(
      `¿Deseas ${selected.activo ? 'desactivar' : 'activar'} este colaborador?`
    );
    if (!confirmar) return;

    try {
      await updateColaboradorEstado(
        selected.id_colaborador,
        selected.activo ? 0 : 1
      );

      toast.success('Estado del colaborador actualizado');
      setSelected(null);
      fetchColaboradores();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar el estado del colaborador');
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1">Colaboradores</h1>
          <div className="text-secondary small">Búsqueda por documento o nombre completo.</div>
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
            label={selected?.activo ? 'Cesar' : 'Reactivar'}
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
              placeholder="Buscar…"
              className="w-100"
            />
          </span>
        </div>

        <div className="col-12 col-lg-3">
          <StatCard label="Total de colaboradores" value={filtered.length} icon="pi pi-users" tone="primary" />
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
            <ColaboradoresTable
              colaboradores={filtered}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </div>
      </div>

      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={selected ? 'Editar colaborador' : 'Nuevo colaborador'}
      >
        <ColaboradorForm
          selected={selected}
          onSaved={() => {
            setOpenForm(false);
            setSelected(null);
            fetchColaboradores();
          }}
        />
      </Modal>
    </>
  );
};

export default ColaboradoresPage;
