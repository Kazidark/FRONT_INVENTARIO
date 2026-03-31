import { useEffect, useState } from 'react';
import StatCard from '../../../shared/components/ui/StatCard';
import Modal from '../../../shared/components/ui/Modal';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';

import AsignacionesTable from '../components/AsignacionesTable';
import AsignacionForm from '../components/AsignacionForm';

import {
  getAsignaciones,
  cerrarAsignacion
} from '../../../services/api/asignaciones.api';

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
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1">Asignaciones de Equipos</h1>
          <div className="text-secondary small">Crea y cierra asignaciones de colaboradores.</div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Button
            label="Nueva asignación"
            icon="pi pi-plus"
            onClick={() => setOpenForm(true)}
          />
          <Button
            label="Cerrar asignación"
            icon="pi pi-ban"
            severity="danger"
            disabled={!selected || !selected.activo}
            onClick={handleCerrarAsignacion}
          />
        </div>
      </div>

      <div className="row g-3 align-items-stretch mb-3">
        <div className="col-12 col-lg-3">
          <StatCard
            label="Asignaciones activas"
            value={asignaciones.filter((a) => a.activo).length}
            icon="pi pi-link"
            tone="success"
          />
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
            <AsignacionesTable
              asignaciones={asignaciones}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </div>
      </div>

      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title="Nueva asignación"
      >
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

export default AsignacionesPage;
