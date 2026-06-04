import { useCallback, useMemo, useState } from 'react';
import CrudDataTable from '../../shared/components/ui/CrudDataTable';
import PageHero from '../../shared/components/ui/PageHero';
import InventoryStatusBadge from '../../shared/components/ui/InventoryStatusBadge';
import ModemForm from './components/ModemForm';
import { getModems, updateModemEstado } from '../../services/api/modems.api';
import {
  StatPills,
  wrapFetchWithStats,
  InventoryPageShell
} from '../../shared/utils/inventoryPageUtils';

const buildColumns = () => [
  { field: 'marca', header: 'Marca', sortable: true, style: { minWidth: '9rem' } },
  { field: 'modelo', header: 'Modelo', sortable: true, style: { minWidth: '9rem' } },
  { field: 'imei_modem', header: 'IMEI', sortable: true, style: { minWidth: '11rem' } },
  {
    field: 'estado_modem_desc',
    header: 'Estado Módem',
    sortField: 'estado_modem_desc',
    body: (row) => <InventoryStatusBadge value={row?.estado_modem_desc} />,
    sortable: true,
    style: { minWidth: '10rem' }
  },
  {
    field: 'estado_equipo_desc',
    header: 'Estado Equipo',
    sortField: 'estado_equipo_desc',
    body: (row) => <InventoryStatusBadge value={row?.estado_equipo_desc} />,
    sortable: true,
    style: { minWidth: '10rem' }
  },
  {
    field: 'area_desc',
    header: 'Área',
    body: (row) => row?.area_desc || row?.nombre_area || '—',
    sortable: true,
    style: { minWidth: '9rem' }
  },
  {
    field: 'ticket',
    header: 'Ticket',
    body: (row) => row?.ticket || '—',
    sortable: true,
    style: { minWidth: '9rem' }
  },
  {
    field: 'usuario_desc',
    header: 'Colaborador',
    sortField: 'usuario_desc',
    sortable: true,
    style: { minWidth: '12rem' }
  },
  {
    field: 'chip_desc',
    header: 'Chip',
    sortField: 'chip_desc',
    sortable: true,
    style: { minWidth: '9rem' },
    body: (row) => row?.chip_desc ?? row?.numero_chip ?? '—'
  },
  {
    columnType: 'activo',
    header: 'Estado',
    sortField: 'activo',
    sortable: true,
    centered: true,
    style: { minWidth: '8.5rem' }
  }
];

const activoToggle = async (row, activo) => updateModemEstado(row.id_modem, activo);

const bulkAction = {
  label: 'Desactivar',
  icon: 'pi pi-ban',
  severity: 'danger',
  confirmMessage: '¿Seguro que quieres desactivar los módems seleccionados?',
  action: async (items) => {
    const ids = (items || []).map((m) => m?.id_modem).filter(Boolean);
    await Promise.all(ids.map((id) => updateModemEstado(id, false)));
  }
};

const globalFilterFields = [
  'marca',
  'modelo',
  'imei_modem',
  'estado_modem_desc',
  'estado_equipo_desc',
  'area_desc',
  'nombre_area',
  'ticket',
  'usuario_desc',
  'chip_desc',
  'numero_chip',
  'activo'
];

const ModemsTable = () => {
  const [stats, setStats] = useState({ total: 0, activos: 0 });

  const fetchData = useCallback(
    () => wrapFetchWithStats(getModems, setStats)(),
    []
  );

  const columns = useMemo(() => buildColumns(), []);

  return (
    <InventoryPageShell
      hero={
        <PageHero
          title="Inventario de Módems"
          subtitle="Equipos de conectividad: estados, asignación, chip vinculado e importación Excel."
          icon="pi-wifi"
        >
          <StatPills total={stats.total} activos={stats.activos} />
        </PageHero>
      }
    >
      <CrudDataTable
        title="Listado de módems"
        dataKey="id_modem"
        fetchData={fetchData}
        templateModule="modems"
        inportarExcel="modemsImport"
        toolbarButtonsVariant="bootstrap"
        columns={columns}
        globalFilterFields={globalFilterFields}
        FormComponent={ModemForm}
        formSelectedProp="selectedModem"
        dialogHeaderNew="Nuevo módem"
        dialogHeaderEdit="Editar módem"
        dialogSubtitleNew="Registro de módem"
        dialogSubtitleEdit="Actualización de módem"
        dialogHeaderIcon="pi-wifi"
        activoToggle={activoToggle}
        bulkAction={bulkAction}
      />
    </InventoryPageShell>
  );
};

export default ModemsTable;
