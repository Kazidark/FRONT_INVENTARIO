import { AllgetUsers } from '../../../services/api/usuarios.api';
import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import UsuarioForm from '../components/UsuarioForm';

const columns = [
  { field: 'usuario', header: 'Usuario', sortable: true, style: { minWidth: '12rem' } },
  { field: 'email', header: 'Email', sortable: true, style: { minWidth: '14rem' } },
  { field: 'role', header: 'Rol', sortable: true, style: { minWidth: '10rem' } },
  {
    field: 'isActive',
    header: 'Activo',
    sortable: true,
    style: { minWidth: '7rem' },
    body: (row) => (row?.isActive ? 'Si' : 'No')
  },
  {
    field: 'created_at',
    header: 'Fecha de creacion',
    sortable: true,
    style: { minWidth: '12rem' }
  }
];

const UsuariosPage = () => {

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 className="h4 fw-bold mb-1">Perfiles de Usuarios</h1>
          <div className="text-secondary small">Listado de usuarios y perfiles desde backend.</div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <CrudDataTable
            title="Tabla de Usuarios"
            dataKey="id_usuario"
            fetchData={AllgetUsers}
            exportModule="usuarios"
            toolbarButtonsVariant="bootstrap"
            columns={columns}
            globalFilterFields={[
              'usuario',
              'email',
              'role',
              'isActive',
              'created_at',
            ]}
            FormComponent={UsuarioForm}
            formSelectedProp="selected"
            dialogHeaderNew="Nuevo usuario"
            dialogHeaderEdit="Editar usuario"
            dialogSubtitleNew="Cuenta y permisos de acceso"
            dialogSubtitleEdit="Actualización de usuario"
            dialogHeaderIcon="pi-user"
          />
        </div>
      </div>

    </>
  );
};

export default UsuariosPage;
