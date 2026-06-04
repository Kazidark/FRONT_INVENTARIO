import { useCallback, useEffect, useMemo, useState } from 'react';
import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import PageHero from '../../../shared/components/ui/PageHero';
import InventoryStatusBadge from '../../../shared/components/ui/InventoryStatusBadge';
import TabletForm from '../components/TabletForm';
import { getTablets, updateTabletEstado } from '../../../services/api/tablets.api';
import {
  getAreas,
  getAsignacion,
  getEstadoEquipo,
  getUbicacion
} from '../../../services/api/transvesalMaestro/transversal';
import {
  asArray,
  buildLookup,
  resolveLabel,
  StatPills,
  ubicacionCell,
  wrapFetchWithStats,
  InventoryPageShell
} from '../../../shared/utils/inventoryPageUtils';

const buildColumns = (catalogs) => {
  const { estadoTabletById, estadoEquipoById, ubicacionById, areaById } = catalogs;

  return [
    { field: 'marca', header: 'Marca', sortable: true, style: { minWidth: '9rem' } },
    { field: 'modelo', header: 'Modelo', sortable: true, style: { minWidth: '10rem' } },
    { field: 'imei_tablet', header: 'IMEI', sortable: true, style: { minWidth: '12rem' } },
    {
      field: 'chip_desc',
      header: 'Chip',
      body: (row) => row?.chip_desc || row?.num_chips || '—',
      sortable: true,
      style: { minWidth: '10rem' }
    },
    {
      field: 'estado_tablet_desc',
      header: 'Estado Tablet',
      sortField: 'estado_tablet_desc',
      body: (row) => (
        <InventoryStatusBadge
          value={resolveLabel(
            row,
            ['estado_tablet_desc'],
            ['estado_tablet'],
            estadoTabletById
          )}
        />
      ),
      sortable: true,
      style: { minWidth: '11rem' }
    },
    {
      field: 'estado_equipo_desc',
      header: 'Estado Equipo',
      sortField: 'estado_equipo_desc',
      body: (row) => (
        <InventoryStatusBadge
          value={resolveLabel(
            row,
            ['estado_equipo_desc'],
            ['estado_equipo'],
            estadoEquipoById
          )}
        />
      ),
      sortable: true,
      style: { minWidth: '11rem' }
    },
    {
      field: 'area_desc',
      header: 'Área',
      sortField: 'area_desc',
      body: (row) =>
        resolveLabel(row, ['area_desc'], ['id_area'], areaById) || '—',
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
      body: (row) =>
        row?.usuario_desc || row?.nombre_colaborador || '—',
      sortable: true,
      style: { minWidth: '12rem' }
    },
    {
      field: 'nombre_ubicacion',
      header: 'Ubicación',
      sortField: 'nombre_ubicacion',
      body: (row) =>
        ubicacionCell(
          resolveLabel(
            row,
            ['nombre_ubicacion', 'ubicacion_desc'],
            ['id_ubicacion', 'ubicacion'],
            ubicacionById
          ) || '—'
        ),
      sortable: true,
      style: { minWidth: '11rem' }
    },
    {
      field: 'observaciones',
      header: 'Observaciones',
      body: (row) => row?.observaciones || '—',
      style: { minWidth: '12rem' }
    },
    {
      field: 'fecha_registro',
      header: 'Fecha registro',
      sortable: true,
      style: { minWidth: '11rem' }
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
};

const activoToggle = async (row, activo) => {
  await updateTabletEstado(row.id_tablet, activo ? 1 : 0);
};

const bulkAction = {
  label: 'Desactivar',
  icon: 'pi pi-ban',
  severity: 'danger',
  confirmMessage: '¿Seguro que quieres desactivar las tablets seleccionadas?',
  action: async (selectedRows) => {
    const activeRows = selectedRows.filter((row) => Boolean(row?.activo));
    await Promise.all(
      activeRows.map((row) => updateTabletEstado(row.id_tablet, 0))
    );
  }
};

const TabletsPage = () => {
  const [catalogs, setCatalogs] = useState({
    estadoTabletById: new Map(),
    estadoEquipoById: new Map(),
    ubicacionById: new Map(),
    areaById: new Map()
  });
  const [stats, setStats] = useState({ total: 0, activos: 0 });

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [estados, asignaciones, ubicaciones, areas] = await Promise.all([
          getEstadoEquipo(),
          getAsignacion(),
          getUbicacion(),
          getAreas()
        ]);
        setCatalogs({
          estadoTabletById: buildLookup(asArray(estados), 'id_estado', 'descripcion'),
          estadoEquipoById: buildLookup(
            asArray(asignaciones),
            'id_asignado',
            'descripcion'
          ),
          ubicacionById: buildLookup(asArray(ubicaciones), 'id', 'descripcion'),
          areaById: buildLookup(asArray(areas), 'id_area', 'nombre_area')
        });
      } catch {
        setCatalogs({
          estadoTabletById: new Map(),
          estadoEquipoById: new Map(),
          ubicacionById: new Map(),
          areaById: new Map()
        });
      }
    };
    loadCatalogs();
  }, []);

  const fetchData = useCallback(
    () => wrapFetchWithStats(getTablets, setStats)(),
    []
  );

  const columns = useMemo(() => buildColumns(catalogs), [catalogs]);

  return (
    <InventoryPageShell
      hero={
        <PageHero
          title="Inventario de Tablets"
          subtitle="Gestión de equipos móviles: estados operativos, asignación, ubicación y colaboradores. Importe desde Excel o edite registro por registro."
          icon="pi-tablet"
        >
          <StatPills total={stats.total} activos={stats.activos} />
        </PageHero>
      }
    >
      <CrudDataTable
        title="Listado de tablets"
        dataKey="id_tablet"
        fetchData={fetchData}
        templateModule="tablets"
        inportarExcel="tabletsImport"
        toolbarButtonsVariant="bootstrap"
        columns={columns}
        globalFilterFields={[
          'marca',
          'modelo',
          'imei_tablet',
          'chip_desc',
          'estado_tablet_desc',
          'estado_equipo_desc',
          'area_desc',
          'usuario_desc',
          'nombre_colaborador',
          'nombre_ubicacion',
          'ubicacion_desc',
          'observaciones',
          'activo'
        ]}
        FormComponent={TabletForm}
        formSelectedProp="selectedTablet"
        dialogHeaderNew="Nueva tablet"
        dialogHeaderEdit="Editar tablet"
        dialogSubtitleNew="Alta manual de tablet"
        dialogSubtitleEdit="Actualice los datos del equipo"
        dialogHeaderIcon="pi-tablet"
        activoToggle={activoToggle}
        bulkAction={bulkAction}
      />
    </InventoryPageShell>
  );
};

export default TabletsPage;
