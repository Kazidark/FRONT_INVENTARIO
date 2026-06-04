import { useCallback, useMemo, useState } from 'react';
import { AllgetUsers, updateUsuario } from '../../../services/api/usuarios.api';
import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import PageHero from '../../../shared/components/ui/PageHero';
import UsuarioForm from '../components/UsuarioForm';
import {
  StatPills,
  wrapFetchWithStats,
  InventoryPageShell
} from '../../../shared/utils/inventoryPageUtils';

const buildColumns = () => [
  { field: 'usuario', header: 'Usuario', sortable: true, style: { minWidth: '12rem' } },
  { field: 'email', header: 'Email', sortable: true, style: { minWidth: '14rem' } },
  { field: 'role', header: 'Rol', sortable: true, style: { minWidth: '10rem' } },
  {
    columnType: 'activo',
    header: 'Estado',
    sortable: true,
    sortField: 'isActive',
    centered: true,
    style: { minWidth: '8.5rem' }
  },
  {
    field: 'created_at',
    header: 'Fecha de creación',
    sortable: true,
    style: { minWidth: '12rem' }
  }
];

const activoToggle = async (row, activo) => updateUsuario(row.id_usuario, { isActive: activo });

const UsuariosPage = () => {
  const [stats, setStats] = useState({ total: 0, activos: 0 });

  const fetchData = useCallback(
    () => wrapFetchWithStats(AllgetUsers, setStats, 'isActive')(),
    []
  );

  const columns = useMemo(() => buildColumns(), []);

  return (
    <InventoryPageShell
      hero={
        <PageHero
          title="Usuarios del sistema"
          subtitle="Cuentas de acceso, roles y permisos."
          icon="pi-user"
        >
          <StatPills total={stats.total} activos={stats.activos} />
        </PageHero>
      }
    >
      <CrudDataTable
        title="Listado de usuarios"
        dataKey="id_usuario"
        fetchData={fetchData}
        exportModule="usuarios"
        toolbarButtonsVariant="bootstrap"
        columns={columns}
        globalFilterFields={['usuario', 'email', 'role', 'isActive', 'created_at']}
        FormComponent={UsuarioForm}
        formSelectedProp="selected"
        activoField="isActive"
        activoToggle={activoToggle}
        dialogHeaderNew="Nuevo usuario"
        dialogHeaderEdit="Editar usuario"
        dialogSubtitleNew="Cuenta y permisos de acceso"
        dialogSubtitleEdit="Actualización de usuario"
        dialogHeaderIcon="pi-user"
      />
    </InventoryPageShell>
  );
};

export default UsuariosPage;
