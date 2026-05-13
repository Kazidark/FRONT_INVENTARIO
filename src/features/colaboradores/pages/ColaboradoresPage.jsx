import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import { getColaboradores } from '../../../services/api/colaboradores.api';
import ColaboradorForm from '../components/ColaboradorForm';

const cesadoBody = (row) => {
  const cesado = !Boolean(row?.activo);
  return (
    <span className={`badge ${cesado ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
      {cesado ? 'Si' : 'No'}
    </span>
  );
};

const columns = [
  {
    field: 'nombre_completo',
    header: 'Nombre completo',
    sortable: true,
    style: { minWidth: '16rem' }
  },
  {
    field: 'email',
    header: 'Correo',
    body: (row) => row?.email || '-',
    sortable: true,
    style: { minWidth: '14rem' }
  },
  {
    header: 'Cesado',
    body: cesadoBody,
    sortable: true,
    sortField: 'activo',
    style: { minWidth: '8rem' },
    centered: true
  }
];

const ColaboradoresPage = () => {
  return (
    <CrudDataTable
      title="Tabla de Colaboradores"
      dataKey="id_colaborador"
      fetchData={getColaboradores}
      columns={columns}
      globalFilterFields={['nombre_completo', 'email', 'activo']}
      toolbarButtonsVariant="bootstrap"
      dialogHeaderNew="Nuevo Colaborador"
      dialogHeaderEdit="Editar Colaborador"
      dialogSubtitleNew="Datos del colaborador"
      dialogSubtitleEdit="Actualización de colaborador"
      dialogHeaderIcon="pi-users"
      FormComponent={ColaboradorForm}
      showActionsColumn={false}
      formSelectedProp="selected"
    />
  );
};

export default ColaboradoresPage;
