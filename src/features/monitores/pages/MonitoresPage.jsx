import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import {
  getMonitores,
  updateMonitorEstado
} from '../../../services/api/monitores.api';
import MonitorForm from '../components/MonitorForm';

const activoBody = (row) => (
  <span className={`badge ${row?.activo ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
    {row?.activo ? 'Si' : 'No'}
  </span>
);

const columns = [
  { field: 'serie', header: 'Serie', sortable: true, style: { minWidth: '11rem' } },
  { field: 'marca', header: 'Marca', sortable: true, style: { minWidth: '9rem' } },
  { field: 'modelo', header: 'Modelo', sortable: true, style: { minWidth: '9rem' } },
  {
    field: 'estado_monitor_desc',
    header: 'Estado Monitor',
    body: (row) => row?.estado_monitor_desc || '-',
    sortable: true,
    style: { minWidth: '10rem' }
  },
  {
    field: 'status_monitor_desc',
    header: 'Status Monitor',
    body: (row) => row?.status_monitor_desc || '-',
    sortable: true,
    style: { minWidth: '10rem' }
  },
  {
    field: 'nombre_area',
    header: 'Area',
    body: (row) => row?.nombre_area || '-',
    sortable: true,
    style: { minWidth: '8rem' }
  },
  {
    field: 'nombre_colaborador',
    header: 'Colaborador',
    body: (row) => row?.nombre_colaborador || '-',
    sortable: true,
    style: { minWidth: '12rem' }
  },
  {
    field: 'ubicacion',
    header: 'Ubicacion',
    body: (row) => row?.ubicacion || '-',
    sortable: true,
    style: { minWidth: '11rem' }
  },
  {
    field: 'observaciones',
    header: 'Observaciones',
    body: (row) => row?.observaciones || '-',
    style: { minWidth: '12rem' }
  },
  {
    field: 'anexo',
    header: 'Anexo',
    body: (row) => row?.anexo || '-',
    sortable: true,
    style: { minWidth: '8rem' }
  },
  { header: 'Activo', body: activoBody, sortable: true, sortField: 'activo', style: { minWidth: '7rem' } }
];

const toggleAction = async (row) => updateMonitorEstado(row.id_monitor, !row.activo);

const getToggleMeta = (row) => {
  const isActive = Boolean(row?.activo);
  return {
    icon: isActive ? 'pi pi-ban' : 'pi pi-check',
    severity: isActive ? 'danger' : 'success',
    confirmMessage: `¿Seguro que quieres ${isActive ? 'desactivar' : 'reactivar'} el monitor ${String(row?.serie ?? '').trim()}?`
  };
};

const bulkAction = {
  label: 'Desactivar',
  icon: 'pi pi-ban',
  severity: 'danger',
  confirmMessage: '¿Seguro que quieres desactivar los monitores seleccionados?',
  action: async (selectedRows) => {
    const activeRows = selectedRows.filter((row) => Boolean(row?.activo));
    await Promise.all(
      activeRows.map((row) => updateMonitorEstado(row.id_monitor, false))
    );
  }
};

const MonitoresPage = () => {
  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1">Inventario de Monitores</h1>
          <div className="text-secondary small">Listado de monitores desde backend con tabla reutilizable.</div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <CrudDataTable
            title="Tabla de Monitores"
            dataKey="id_monitor"
            fetchData={getMonitores}
            exportModule="monitores"
            toolbarButtonsVariant="bootstrap"
            columns={columns}
            globalFilterFields={[
              'serie',
              'marca',
              'modelo',
              'estado_monitor_desc',
              'status_monitor_desc',
              'nombre_area',
              'nombre_colaborador',
              'ubicacion',
              'observaciones',
              'anexo',
              'activo'
            ]}
            FormComponent={MonitorForm}
            formSelectedProp="selected"
            dialogHeaderNew="Nuevo monitor"
            dialogHeaderEdit="Editar monitor"
            toggleAction={toggleAction}
            getToggleMeta={getToggleMeta}
            bulkAction={bulkAction}
          />
        </div>
      </div>
    </>
  );
};

export default MonitoresPage;
