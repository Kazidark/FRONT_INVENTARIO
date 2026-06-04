import { useCallback, useEffect, useMemo, useState } from 'react';
import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import PageHero from '../../../shared/components/ui/PageHero';
import InventoryStatusBadge from '../../../shared/components/ui/InventoryStatusBadge';
import {
  getMonitores,
  updateMonitorEstado
} from '../../../services/api/monitores.api';
import {
  getAsignacion,
  getEstadoEquipo,
  getUbicacion
} from '../../../services/api/transvesalMaestro/transversal';
import MonitorForm from '../components/MonitorForm';
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
  const { estadoById, asignacionById, ubicacionById } = catalogs;

  return [
    { field: 'serie', header: 'Serie', sortable: true, style: { minWidth: '11rem' } },
    { field: 'marca', header: 'Marca', sortable: true, style: { minWidth: '9rem' } },
    { field: 'modelo', header: 'Modelo', sortable: true, style: { minWidth: '9rem' } },
    {
      field: 'estado_monitor_desc',
      header: 'Estado Monitor',
      sortField: 'estado_monitor_desc',
      body: (row) => (
        <InventoryStatusBadge
          value={resolveLabel(row, ['estado_monitor_desc'], ['estado_monitor'], estadoById)}
        />
      ),
      sortable: true,
      style: { minWidth: '10rem' }
    },
    {
      field: 'status_monitor_desc',
      header: 'Estado Equipo',
      sortField: 'status_monitor_desc',
      body: (row) => (
        <InventoryStatusBadge
          value={resolveLabel(row, ['status_monitor_desc'], ['status_monitor'], asignacionById)}
        />
      ),
      sortable: true,
      style: { minWidth: '10rem' }
    },
    {
      field: 'nombre_area',
      header: 'Área',
      body: (row) => row?.nombre_area || '—',
      sortable: true,
      style: { minWidth: '8rem' }
    },
    {
      field: 'ticket',
      header: 'Ticket',
      body: (row) => row?.ticket || '—',
      sortable: true,
      style: { minWidth: '8rem' }
    },
    {
      field: 'nombre_colaborador',
      header: 'Colaborador',
      sortField: 'nombre_colaborador',
      body: (row) => row?.nombre_colaborador || row?.usuario_desc || '—',
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
            ['nombre_ubicacion', 'ubicacion'],
            ['id_ubicacion'],
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
      field: 'anexo',
      header: 'Anexo',
      body: (row) => row?.anexo ?? '—',
      sortable: true,
      style: { minWidth: '8rem' }
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

const activoToggle = async (row, activo) => updateMonitorEstado(row.id_monitor, activo);

const bulkAction = {
  label: 'Desactivar',
  icon: 'pi pi-ban',
  severity: 'danger',
  confirmMessage: '¿Seguro que quieres desactivar los monitores seleccionados?',
  action: async (selectedRows) => {
    const activeRows = selectedRows.filter((row) => Boolean(row?.activo));
    await Promise.all(
      activeRows.map((row) => updateMonitorEstado(row.id_monitor, false))
    );
  }
};

const MonitoresPage = () => {
  const [catalogs, setCatalogs] = useState({
    estadoById: new Map(),
    asignacionById: new Map(),
    ubicacionById: new Map()
  });
  const [stats, setStats] = useState({ total: 0, activos: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [estados, asignaciones, ubicaciones] = await Promise.all([
          getEstadoEquipo(),
          getAsignacion(),
          getUbicacion()
        ]);
        setCatalogs({
          estadoById: buildLookup(asArray(estados), 'id_estado', 'descripcion'),
          asignacionById: buildLookup(asArray(asignaciones), 'id_asignado', 'descripcion'),
          ubicacionById: buildLookup(asArray(ubicaciones), 'id', 'descripcion')
        });
      } catch {
        setCatalogs({
          estadoById: new Map(),
          asignacionById: new Map(),
          ubicacionById: new Map()
        });
      }
    };
    load();
  }, []);

  const fetchData = useCallback(
    () => wrapFetchWithStats(getMonitores, setStats)(),
    []
  );

  const columns = useMemo(() => buildColumns(catalogs), [catalogs]);

  return (
    <InventoryPageShell
      hero={
        <PageHero
          title="Inventario de Monitores"
          subtitle="Control de pantallas: estado operativo, asignación, ubicación y colaborador. Importación Excel y edición por registro."
          icon="pi-desktop"
        >
          <StatPills total={stats.total} activos={stats.activos} />
        </PageHero>
      }
    >
      <CrudDataTable
        title="Listado de monitores"
        dataKey="id_monitor"
        fetchData={fetchData}
        exportModule="monitores"
        inportarExcel="monitoresImport"
        toolbarButtonsVariant="bootstrap"
        columns={columns}
        globalFilterFields={[
          'serie',
          'marca',
          'modelo',
          'estado_monitor_desc',
          'status_monitor_desc',
          'nombre_area',
          'nombre_colaborador',
          'nombre_ubicacion',
          'ubicacion',
          'observaciones',
          'anexo',
          'activo'
        ]}
        FormComponent={MonitorForm}
        formSelectedProp="selected"
        dialogHeaderNew="Nuevo monitor"
        dialogHeaderEdit="Editar monitor"
        dialogSubtitleNew="Alta manual de monitor"
        dialogSubtitleEdit="Actualice los datos del equipo"
        dialogHeaderIcon="pi-desktop"
        activoToggle={activoToggle}
        bulkAction={bulkAction}
      />
    </InventoryPageShell>
  );
};

export default MonitoresPage;
