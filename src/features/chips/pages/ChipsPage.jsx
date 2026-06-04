import { useCallback, useMemo, useState } from 'react';
import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import PageHero from '../../../shared/components/ui/PageHero';
import InventoryStatusBadge from '../../../shared/components/ui/InventoryStatusBadge';
import ChipTipoBadge from '../../../shared/components/ui/ChipTipoBadge';
import ChipForm from '../components/ChipForm';
import { getChips, updateChip } from '../../../services/api/chips.api';
import {
  StatPills,
  wrapFetchWithStats,
  InventoryPageShell
} from '../../../shared/utils/inventoryPageUtils';

const tipoChipBody = (row) => {
  const tipo = row?.nombre_tipo_chip;
  if (!tipo || tipo === '-') return '—';
  return <ChipTipoBadge value={tipo} />;
};
const buildColumns = () => [
  { field: 'numero_chip', header: 'Número', sortable: true, style: { minWidth: '10rem' } },
  { field: 'iccid', header: 'ICCID', sortable: true, style: { minWidth: '12rem' } },
  {
    field: 'nombre_tipo_chip',
    header: 'Tipo',
    sortable: true,
    style: { minWidth: '8rem' },
    body: tipoChipBody
  },
  { field: 'nombre_operador', header: 'Operador', sortable: true, style: { minWidth: '10rem' } },
  { field: 'nombre_area', header: 'Área', sortable: true, style: { minWidth: '10rem' } },
  { field: 'ticket', header: 'Ticket', sortable: true, style: { minWidth: '12rem' } },
  {
    field: 'nombre_colaborador',
    header: 'Colaborador',
    sortField: 'nombre_colaborador',
    sortable: true,
    style: { minWidth: '12rem' }
  },
  {
    field: 'nombre_estado_chip',
    header: 'Estado Chip',
    sortField: 'nombre_estado_chip',
    body: (row) => <InventoryStatusBadge value={row?.nombre_estado_chip} />,
    sortable: true,
    style: { minWidth: '9rem' }
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

const ChipsPage = () => {
  const [stats, setStats] = useState({ total: 0, activos: 0 });

  const fetchData = useCallback(
    () => wrapFetchWithStats(getChips, setStats)(),
    []
  );

  const columns = useMemo(() => buildColumns(), []);

  const activoToggle = async (row, activo) => updateChip(row.id_chip, { activo });

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

  return (
    <InventoryPageShell
      hero={
        <PageHero
          title="Inventario de Chips"
          subtitle="SIM corporativas: ICCID, operador, tipo de plan, área y colaborador. Plantilla, exportación e importación Excel."
          icon="pi-id-card"
        >
          <StatPills total={stats.total} activos={stats.activos} />
        </PageHero>
      }
    >
      <CrudDataTable
        title="Listado de chips"
        dataKey="id_chip"
        fetchData={fetchData}
        templateModule="chips"
        inportarExcel="chipsImport"
        toolbarButtonsVariant="bootstrap"
        columns={columns}
        globalFilterFields={[
          'numero_chip',
          'iccid',
          'nombre_tipo_chip',
          'nombre_operador',
          'nombre_area',
          'nombre_colaborador',
          'nombre_estado_chip',
          'ticket',
          'activo'
        ]}
        FormComponent={ChipForm}
        formSelectedProp="selectedChip"
        dialogWidth="64rem"
        dialogBreakpoints={{ '1200px': '92vw', '960px': '96vw' }}
        dialogHeaderNew="Nuevo chip"
        dialogHeaderEdit="Editar chip"
        dialogSubtitleNew="Alta manual de chip SIM"
        dialogSubtitleEdit="Actualice los datos del chip"
        dialogHeaderIcon="pi-id-card"
        activoToggle={activoToggle}
        bulkAction={bulkAction}
      />
    </InventoryPageShell>
  );
};

export default ChipsPage;
