import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import TabletForm from '../components/TabletForm';
import { getTablets, updateTabletEstado } from '../../../services/api/tablets.api';

const activoBody = (row) => (
  <span className={`badge ${row?.activo ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
    {row?.activo ? 'Si' : 'No'}
  </span>
);

const columns = [
  { field: 'marca', header: 'Marca', sortable: true, style: { minWidth: '9rem' } },
  { field: 'modelo', header: 'Modelo', sortable: true, style: { minWidth: '10rem' } },
  { field: 'imei_tablet', header: 'IMEI', sortable: true, style: { minWidth: '12rem' } },
  {
    field: 'chip_desc',
    header: 'Chip',
    body: (row) => row?.chip_desc || row?.num_chips || '-',
    sortable: true,
    style: { minWidth: '10rem' }
  },
  {
    field: 'estado_tablet',
    header: 'Estado Tablet',
    body: (row) => row?.estado_tablet_desc || row?.estado_tablet || '-',
    sortable: true,
    style: { minWidth: '11rem' }
  },
  {
    field: 'estado_equipo',
    header: 'Estado Equipo',
    body: (row) => row?.estado_equipo_desc || row?.estado_equipo || '-',
    sortable: true,
    style: { minWidth: '11rem' }
  },
  {
    field: 'area_desc',
    header: 'Area',
    body: (row) => row?.area_desc || row?.id_area || '-',
    sortable: true,
    style: { minWidth: '9rem' }
  },
  {
    field: 'usuario',
    header: 'Colaborador',
    body: (row) => row?.usuario_desc || row?.usuario || '-',
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
  { field: 'fecha_registro', header: 'Fecha Registro', sortable: true, style: { minWidth: '12rem' } },
  { header: 'Activo', body: activoBody, sortable: true, sortField: 'activo', style: { minWidth: '7rem' } }
];

const toggleAction = async (row) => {
  await updateTabletEstado(row.id_tablet, row.activo ? 0 : 1);
};

const getToggleMeta = (row) => {
  const isActive = Boolean(row?.activo);
  return {
    icon: isActive ? 'pi pi-ban' : 'pi pi-check',
    severity: isActive ? 'danger' : 'success',
    confirmMessage: `¿Seguro que quieres ${isActive ? 'desactivar' : 'reactivar'} la tablet ${String(row?.imei_tablet ?? '').trim()}?`
  };
};

const bulkAction = {
  label: 'Desactivar',
  icon: 'pi pi-ban',
  severity: 'danger',
  confirmMessage: '¿Seguro que quieres desactivar las tablets seleccionadas?',
  action: async (selectedRows) => {
    const activeRows = selectedRows.filter((row) => Boolean(row?.activo));
    await Promise.all(
      activeRows.map((row) => updateTabletEstado(row.id_tablet, 0))
    );
  }
};

const TabletsPage = () => {

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1">Inventario de Tablets</h1>
          <div className="text-secondary small">
            Listado de tablets con endpoint GET y tabla reutilizable.
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <CrudDataTable
            title="Tabla de Tablets"
            dataKey="id_tablet"
            fetchData={getTablets}
            exportModule="tablets"
            inportarExcel="tabletsImport"
            toolbarButtonsVariant="bootstrap"
            columns={columns}
            globalFilterFields={[
              'marca',
              'modelo',
              'imei_tablet',
              'chip_desc',
              'num_chips',
              'estado_tablet',
              'estado_tablet_desc',
              'estado_equipo',
              'estado_equipo_desc',
              'area_desc',
              'id_area',
              'usuario_desc',
              'usuario',
              'ubicacion',
              'observaciones',
              'fecha_registro',
              'activo'
            ]}
            FormComponent={TabletForm}
            formSelectedProp="selectedTablet"
            dialogHeaderNew="Nueva tablet"
            dialogHeaderEdit="Editar tablet"
            dialogSubtitleNew="Registro de tablet"
            dialogSubtitleEdit="Actualización de tablet"
            dialogHeaderIcon="pi-tablet"
            toggleAction={toggleAction}
            getToggleMeta={getToggleMeta}
            bulkAction={bulkAction}
          />
        </div>
      </div>
    </>
  );
};

export default TabletsPage;
