import CrudDataTable from '../../shared/components/ui/CrudDataTable';
import ModemForm from './components/ModemForm';
import { getModems, updateModemEstado } from '../../services/api/modems.api';

const activoBody = (row) => (
  <div className="text-center">
    <span className={`badge ${row?.activo ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
      {row?.activo ? 'Si' : 'No'}
    </span>
  </div>
);

const columns = [
  { field: 'marca', header: 'Marca', sortable: true, style: { minWidth: '9rem' } },
  { field: 'modelo', header: 'Modelo', sortable: true, style: { minWidth: '9rem' } },
  { field: 'imei_modem', header: 'IMEI', sortable: true, style: { minWidth: '11rem' } },
  { field: 'estado_modem_desc', header: 'Estado Modem', sortable: true, style: { minWidth: '9rem' } },
  { field: 'estado_equipo_desc', header: 'Estado Equipo', sortable: true, style: { minWidth: '9rem' } },
  { field: 'area_desc',header: 'Area',sortable: true},
  { field: 'ticket',header: 'Ticket',sortable: true},
  {field: 'usuario_desc', header: 'Usuario',sortable: true},
  { field: 'chip_desc', header: 'Chip',sortField: 'chip_desc',sortable: true},
  { header: 'Estado Activo ?', body: activoBody, sortable: true, sortField: 'activo', style: { minWidth: '7rem' }, centered: true }
];

const toggleAction = async (row) => updateModemEstado(row.id_modem, !row.activo);

const getToggleMeta = (row) => {
  const isActive = Boolean(row?.activo);
  return {
    icon: isActive ? 'pi pi-ban' : 'pi pi-check-circle',
    severity: isActive ? 'danger' : 'success',
    confirmMessage: `¿Seguro que quieres ${isActive ? 'desactivar' : 'reactivar'} el modem ${String(row?.imei_modem ?? '').trim()}?`
  };
};

const bulkAction = {
  label: 'Desactivar',
  icon: 'pi pi-ban',
  severity: 'danger',
  confirmMessage: '¿Seguro que quieres desactivar los modems seleccionados?',
  action: async (items) => {
    const ids = (items || []).map((m) => m?.id_modem).filter(Boolean);
    await Promise.all(ids.map((id) => updateModemEstado(id, false)));
  }
};

const globalFilterFields = [
  'marca',
  'modelo',
  'imei_modem',
  'estado_modem',
  'estado_equipo',
  'nombre_area',
  'area',
  'ticket',
  'usuario',
  'numero_chip',
  'activo'
];

const ModemsTable = () => {
  return (
    <CrudDataTable
      title="Tabla de Modems"
      dataKey="id_modem"
      fetchData={getModems}
      exportModule="modems"
      inportarExcel="modemsImport"
      toolbarButtonsVariant="bootstrap"
      columns={columns}
      globalFilterFields={globalFilterFields}
      FormComponent={ModemForm}
      formSelectedProp="selectedModem"
      dialogHeaderNew="Nuevo modem"
      dialogHeaderEdit="Editar modem"
      dialogSubtitleNew="Registro de módem"
      dialogSubtitleEdit="Actualización de módem"
      dialogHeaderIcon="pi-wifi"
      toggleAction={toggleAction}
      getToggleMeta={getToggleMeta}
      bulkAction={bulkAction}
    />
  );
};

export default ModemsTable;
