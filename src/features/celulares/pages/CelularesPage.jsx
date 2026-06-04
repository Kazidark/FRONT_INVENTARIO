import { useCallback, useEffect, useMemo, useState } from 'react';
import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import PageHero from '../../../shared/components/ui/PageHero';
import InventoryStatusBadge from '../../../shared/components/ui/InventoryStatusBadge';
import { getCelulares, updateCelularEstado } from '../../../services/api/celulares.api';
import {
  getAsignacion,
  getEstadoEquipo
} from '../../../services/api/transvesalMaestro/transversal';
import CelularForm from '../components/CelularForm';
import {
  asArray,
  buildLookup,
  resolveLabel,
  StatPills,
  wrapFetchWithStats,
  InventoryPageShell
} from '../../../shared/utils/inventoryPageUtils';

const buildColumns = (catalogs) => {
  const { estadoCelularById, estadoEquipoById } = catalogs;

  return [
    { field: 'marca', header: 'Marca', sortable: true, style: { minWidth: '9rem' } },
    { field: 'modelo', header: 'Modelo', sortable: true, style: { minWidth: '9rem' } },
    { field: 'imei_celular', header: 'IMEI', sortable: true, style: { minWidth: '11rem' } },
    {
      field: 'estado_celular_desc',
      header: 'Estado Celular',
      sortField: 'estado_celular_desc',
      body: (row) => (
        <InventoryStatusBadge
          value={resolveLabel(
            row,
            ['estado_celular_desc'],
            ['estado_celular'],
            estadoCelularById
          )}
        />
      ),
      sortable: true,
      style: { minWidth: '10rem' }
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
      style: { minWidth: '10rem' }
    },
    {
      field: 'nombre_area',
      header: 'Área',
      body: (row) => row?.nombre_area ?? '—',
      sortable: true,
      style: { minWidth: '10rem' }
    },
    {
      field: 'nombre_colaborador',
      header: 'Colaborador',
      sortField: 'nombre_colaborador',
      body: (row) => row?.nombre_colaborador ?? '—',
      sortable: true,
      style: { minWidth: '12rem' }
    },
    {
      field: 'correo_electronico',
      header: 'Correo',
      sortable: true,
      style: { minWidth: '14rem' },
      body: (row) => row?.correo_electronico?.trim() || '—'
    },
    {
      field: 'ticket',
      header: 'Ticket',
      sortable: true,
      style: { minWidth: '10rem' },
      body: (row) => row?.ticket?.trim() || '—'
    },
    {
      field: 'observacion',
      header: 'Observación',
      sortable: true,
      style: { minWidth: '10rem' },
      body: (row) => row?.observacion ?? '—'
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

const activoToggle = async (row, activo) => updateCelularEstado(row.id_celular, activo);

const CelularesPage = () => {
  const [catalogs, setCatalogs] = useState({
    estadoCelularById: new Map(),
    estadoEquipoById: new Map()
  });
  const [stats, setStats] = useState({ total: 0, activos: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [estados, asignaciones] = await Promise.all([
          getEstadoEquipo(),
          getAsignacion()
        ]);
        setCatalogs({
          estadoCelularById: buildLookup(asArray(estados), 'id_estado', 'descripcion'),
          estadoEquipoById: buildLookup(asArray(asignaciones), 'id_asignado', 'descripcion')
        });
      } catch {
        setCatalogs({
          estadoCelularById: new Map(),
          estadoEquipoById: new Map()
        });
      }
    };
    load();
  }, []);

  const fetchData = useCallback(
    () => wrapFetchWithStats(getCelulares, setStats)(),
    []
  );

  const columns = useMemo(() => buildColumns(catalogs), [catalogs]);

  return (
    <InventoryPageShell
      hero={
        <PageHero
          title="Inventario de Celulares"
          subtitle="Línea móvil corporativa: estados, área, colaborador y tickets. Exportación e importación desde Excel."
          icon="pi-mobile"
        >
          <StatPills total={stats.total} activos={stats.activos} />
        </PageHero>
      }
    >
      <CrudDataTable
        title="Listado de celulares"
        dataKey="id_celular"
        fetchData={fetchData}
        templateModule="celulares"
        inportarExcel="celularesImport"
        toolbarButtonsVariant="bootstrap"
        columns={columns}
        globalFilterFields={[
          'marca',
          'modelo',
          'imei_celular',
          'estado_celular_desc',
          'estado_equipo_desc',
          'nombre_area',
          'nombre_colaborador',
          'correo_electronico',
          'ticket',
          'observacion',
          'activo'
        ]}
        FormComponent={CelularForm}
        formSelectedProp="selectedCelular"
        dialogWidth="64rem"
        dialogBreakpoints={{ '1200px': '92vw', '960px': '96vw' }}
        dialogHeaderNew="Nuevo celular"
        dialogHeaderEdit="Editar celular"
        dialogSubtitleNew="Alta manual de celular"
        dialogSubtitleEdit="Actualice los datos del dispositivo"
        dialogHeaderIcon="pi-mobile"
        activoToggle={activoToggle}
      />
    </InventoryPageShell>
  );
};

export default CelularesPage;
