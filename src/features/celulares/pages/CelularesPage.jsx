import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import { Tag } from 'primereact/tag';
import { getCelulares, updateCelularEstado } from '../../../services/api/celulares.api';
import CelularForm from '../components/CelularForm';

const columns = [
  { field: 'marca', header: 'Marca', sortable: true, style: { minWidth: '9rem' } },
  { field: 'modelo', header: 'Modelo', sortable: true, style: { minWidth: '9rem' } },
  { field: 'imei_celular', header: 'IMEI', sortable: true, style: { minWidth: '11rem' } },
  {
    field: 'estado_celular_desc',
    header: 'Estado Celular',
    sortable: true,
    style: { minWidth: '10rem' },
    body: (row) => {
      const desc = row.estado_celular_desc ?? '-';
      const isOp = desc.toLowerCase() === 'operativo';
      return <Tag value={desc} severity={isOp ? 'success' : 'danger'} rounded />;
    }
  },
  {
    field: 'estado_equipo_desc',
    header: 'Estado Equipo',
    sortable: true,
    style: { minWidth: '10rem' },
    body: (row) => row.estado_equipo_desc ?? '-'
  },
  {
    field: 'nombre_area',
    header: 'Área',
    sortable: true,
    style: { minWidth: '10rem' },
    body: (row) => row.nombre_area ?? '-'
  },
  {
    field: 'nombre_colaborador',
    header: 'Colaborador',
    sortable: true,
    style: { minWidth: '12rem' },
    body: (row) => row.nombre_colaborador ?? '-'
  },
  {
    field: 'numero_chip_desc',
    header: 'Chip',
    sortable: true,
    style: { minWidth: '8rem' },
    body: (row) => row.numero_chip_desc ?? '-'
  },
  {
    field: 'activo',
    header: 'Activo',
    sortable: true,
    style: { minWidth: '7rem' },
    body: (row) => (
      <Tag value={row.activo ? 'Sí' : 'No'} severity={row.activo ? 'info' : 'secondary'} rounded />
    )
  }
];

const toggleAction = async (row) => updateCelularEstado(row.id_celular, !row.activo);

const getToggleMeta = (row) => {
  const isActive = Boolean(row?.activo);
  return {
    icon: isActive ? 'pi pi-ban' : 'pi pi-check',
    severity: isActive ? 'danger' : 'success',
    confirmMessage: `¿Seguro que quieres ${isActive ? 'desactivar' : 'reactivar'} el celular ${String(row?.imei_celular ?? '').trim()}?`
  };
};

const CelularesPage = () => {
  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1">Inventario de Celulares</h1>
          <div className="text-secondary small">Búsqueda, exportación y acciones desde la tabla.</div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <CrudDataTable
            title="Tabla de Celulares"
            dataKey="id_celular"
            fetchData={getCelulares}
            exportModule="celulares"
            toolbarButtonsVariant="bootstrap"
            columns={columns}
            globalFilterFields={[
              'marca', 'modelo', 'imei_celular',
              'estado_celular_desc', 'estado_equipo_desc',
              'nombre_area', 'nombre_colaborador', 'numero_chip_desc'
            ]}
            FormComponent={CelularForm}
            formSelectedProp="selectedCelular"
            dialogWidth="64rem"
            dialogBreakpoints={{ '1200px': '92vw', '960px': '96vw' }}
            dialogHeaderNew="Nuevo celular"
            dialogHeaderEdit="Editar celular"
            toggleAction={toggleAction}
            getToggleMeta={getToggleMeta}
          />
        </div>
      </div>
    </>
  );
};

export default CelularesPage;
