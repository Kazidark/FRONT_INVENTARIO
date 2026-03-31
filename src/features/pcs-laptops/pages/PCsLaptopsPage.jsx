import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import { Tag } from 'primereact/tag';
import { getPCsLaptops, updatePcEstado } from '../../../services/api/pcs_laptops.api';
import PCLaptopForm from '../components/PCLaptopForm';

const columns = [
  { field: 'tipo_equipo', header: 'Tipo', sortable: true, style: { minWidth: '8rem' } },
  { field: 'marca', header: 'Marca', sortable: true, style: { minWidth: '9rem' } },
  { field: 'modelo', header: 'Modelo', sortable: true, style: { minWidth: '9rem' } },
  { field: 'serie', header: 'Serie', sortable: true, style: { minWidth: '11rem' } },
  {
    field: 'estado_pc_desc',
    header: 'Estado PC',
    sortable: true,
    style: { minWidth: '9rem' },
    body: (row) => {
      const desc = row.estado_pc_desc ?? '-';
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
    field: 'ubicacion',
    header: 'Ubicación',
    sortable: true,
    style: { minWidth: '11rem' },
    body: (row) => row.ubicacion ?? '-'
  },
  {
    field: 'observaciones',
    header: 'Observaciones',
    style: { minWidth: '12rem' },
    body: (row) => row.observaciones ?? '-'
  },
  {
    field: 'anexo',
    header: 'Anexo',
    sortable: true,
    style: { minWidth: '8rem' },
    body: (row) => row.anexo ?? '-'
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

const toggleAction = async (row) => updatePcEstado(row.id_pc, { activo: !row.activo });

const getToggleMeta = (row) => {
  const isActive = Boolean(row?.activo);
  return {
    icon: isActive ? 'pi pi-ban' : 'pi pi-check',
    severity: isActive ? 'danger' : 'success',
    confirmMessage: `¿Seguro que quieres ${isActive ? 'desactivar' : 'reactivar'} el equipo ${String(row?.serie ?? '').trim()}?`
  };
};

const PCsLaptopsPage = () => {
  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1">Inventario de PCs / Laptops</h1>
          <div className="text-secondary small">Búsqueda, exportación y acciones desde la tabla.</div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <CrudDataTable
            title="Tabla de PCs y Laptops"
            dataKey="id_pc"
            fetchData={getPCsLaptops}
            exportModule="laptos"
            toolbarButtonsVariant="bootstrap"
            columns={columns}
            globalFilterFields={[
              'tipo_equipo', 'marca', 'modelo', 'serie',
              'estado_pc_desc', 'estado_equipo_desc',
              'nombre_area', 'nombre_colaborador',
              'ubicacion', 'observaciones', 'anexo'
            ]}
            FormComponent={PCLaptopForm}
            formSelectedProp="selected"
            dialogWidth="64rem"
            dialogBreakpoints={{ '1200px': '92vw', '960px': '96vw' }}
            dialogHeaderNew="Nuevo PC / Laptop"
            dialogHeaderEdit="Editar PC / Laptop"
            toggleAction={toggleAction}
            getToggleMeta={getToggleMeta}
          />
        </div>
      </div>
    </>
  );
};

export default PCsLaptopsPage;
