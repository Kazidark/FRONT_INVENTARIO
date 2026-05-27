import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import { Tag } from 'primereact/tag';
import ChipForm from '../components/ChipForm';
import { getChips, updateChip } from '../../../services/api/chips.api';

const ChipsPage = () => {
  const toggleAction = async (row) => updateChip(row.id_chip, { activo: !row.activo });

  const getToggleMeta = (row) => {
    const isActive = Boolean(row?.activo);
    return {
      icon: isActive ? 'pi pi-ban' : 'pi pi-check',
      severity: isActive ? 'danger' : 'success',
      confirmMessage: `¿Seguro que quieres ${isActive ? 'desactivar' : 'reactivar'} el chip ${String(row?.numero_chip ?? '').trim()}?`
    };
  };

  const bulkAction = {
    label: 'Desactivar',
    icon: 'pi pi-ban',
    severity: 'danger',
    confirmMessage: '¿Seguro que quieres desactivar los chips seleccionados?',
    action: async (items) => {
      const ids = (items || []).map((c) => c?.id_chip).filter(Boolean);
      await Promise.all(ids.map((id) => updateChip(id, { activo: false })));
    }
  };

  const columns = [
    { field: 'numero_chip', header: 'Número', sortable: true, style: { minWidth: '10rem' } },
    { field: 'iccid', header: 'ICCID', sortable: true, style: { minWidth: '12rem' } },
    { field: 'nombre_tipo_chip', header: 'Tipo', sortable: true, style: { minWidth: '8rem' },
      body: (row) => <Tag value={row.nombre_tipo_chip} severity={row.nombre_tipo_chip === 'Datos' ? 'info' : 'warning'} rounded /> },
    { field: 'nombre_operador', header: 'Operador', sortable: true, style: { minWidth: '10rem' } },
    { field: 'nombre_area', header: 'Área', sortable: true, style: { minWidth: '10rem' } },
    { field: 'ticket', header: 'Ticket', sortable: true, style: { minWidth: '12rem' } },
    { field: 'nombre_colaborador', header: 'Colaborador', sortable: true, style: { minWidth: '12rem' } },
   
    { field: 'nombre_estado_chip', header: 'Estado Chip', sortable: true, style: { minWidth: '9rem' },
      body: (row) => {
        const isActivo = row.nombre_estado_chip?.toLowerCase() === 'activo';
        return <Tag value={row.nombre_estado_chip} severity={isActivo ? 'success' : 'danger'} rounded />;
      } },
    { field: 'activo', header: 'Activo', sortable: true, style: { minWidth: '7rem' },
      body: (row) => <Tag value={row.activo ? 'Sí' : 'No'} severity={row.activo ? 'info' : 'secondary'} rounded /> },
      
  ];

  const globalFilterFields = [
    'numero_chip', 'iccid', 'nombre_tipo_chip', 'nombre_operador',
    'nombre_area', 'nombre_colaborador', 'nombre_estado_chip'
  ];

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1">Inventario de Chips</h1>
          <div className="text-secondary small">Búsqueda, exportación y acciones desde la tabla.</div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <CrudDataTable
            title="Tablas de Chips"
            dataKey="id_chip"
            fetchData={getChips}
            exportModule="chips"
            inportarExcel="chipsImport"
            toolbarButtonsVariant="bootstrap"
            columns={columns}
            globalFilterFields={globalFilterFields}
            FormComponent={ChipForm}
            formSelectedProp="selectedChip"
            dialogWidth="64rem"
            dialogBreakpoints={{ '1200px': '92vw', '960px': '96vw' }}
            dialogHeaderNew="Nuevo chip"
            dialogHeaderEdit="Editar chip"
            dialogSubtitleNew="Registro de chip SIM"
            dialogSubtitleEdit="Actualización de chip SIM"
            dialogHeaderIcon="pi-id-card"
            toggleAction={toggleAction}
            getToggleMeta={getToggleMeta}
            bulkAction={bulkAction}
          />
        </div>
      </div>
    </>
  );
};

export default ChipsPage;
