import { useCallback, useMemo, useState } from 'react';
import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import PageHero from '../../../shared/components/ui/PageHero';
import { getColaboradores, updateColaboradorEstado } from '../../../services/api/colaboradores.api';
import ColaboradorForm from '../components/ColaboradorForm';
import {
  StatPills,
  wrapFetchWithStats,
  InventoryPageShell
} from '../../../shared/utils/inventoryPageUtils';

const buildColumns = () => [
  {
    field: 'nombre_completo',
    header: 'Nombre completo',
    showAvatar: true,
    sortable: true,
    style: { minWidth: '16rem' }
  },
  {
    field: 'email',
    header: 'Correo',
    body: (row) => row?.email || '—',
    sortable: true,
    style: { minWidth: '14rem' }
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

const activoToggle = async (row, activo) =>
  updateColaboradorEstado(row.id_colaborador, activo);

const ColaboradoresPage = () => {
  const [stats, setStats] = useState({ total: 0, activos: 0 });

  const fetchData = useCallback(
    () => wrapFetchWithStats(getColaboradores, setStats)(),
    []
  );

  const columns = useMemo(() => buildColumns(), []);

  return (
    <InventoryPageShell
      hero={
        <PageHero
          title="Colaboradores"
          subtitle="Personal vinculado a equipos y asignaciones."
          icon="pi-users"
        >
          <StatPills total={stats.total} activos={stats.activos} />
        </PageHero>
      }
    >
      <CrudDataTable
        title="Listado de colaboradores"
        dataKey="id_colaborador"
        fetchData={fetchData}
        columns={columns}
        globalFilterFields={['nombre_completo', 'email', 'activo']}
        toolbarButtonsVariant="bootstrap"
        dialogHeaderNew="Nuevo colaborador"
        dialogHeaderEdit="Editar colaborador"
        dialogSubtitleNew="Datos del colaborador"
        dialogSubtitleEdit="Actualización de colaborador"
        dialogHeaderIcon="pi-users"
        FormComponent={ColaboradorForm}
        showActionsColumn={false}
        formSelectedProp="selected"
        activoToggle={activoToggle}
      />
    </InventoryPageShell>
  );
};

export default ColaboradoresPage;
