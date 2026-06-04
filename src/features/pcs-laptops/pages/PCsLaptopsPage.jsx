import { useCallback, useEffect, useMemo, useState } from 'react';
import CrudDataTable from '../../../shared/components/ui/CrudDataTable';
import PageHero from '../../../shared/components/ui/PageHero';
import InventoryStatusBadge from '../../../shared/components/ui/InventoryStatusBadge';
import { getPCsLaptops, updatePcEstado } from '../../../services/api/pcs_laptops.api';
import {
  getAsignacion,
  getEstadoEquipo,
  getUbicacion
} from '../../../services/api/transvesalMaestro/transversal';
import PCLaptopForm from '../components/PCLaptopForm';
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
  const { estadoPcById, estadoEquipoById, ubicacionById } = catalogs;

  return [
    { field: 'tipo_equipo', header: 'Tipo', sortable: true, style: { minWidth: '8rem' } },
    { field: 'marca', header: 'Marca', sortable: true, style: { minWidth: '9rem' } },
    { field: 'modelo', header: 'Modelo', sortable: true, style: { minWidth: '9rem' } },
    { field: 'serie', header: 'HOST', sortable: true, style: { minWidth: '11rem' } },
    {
      field: 'estado_pc_desc',
      header: 'Estado PC',
      sortField: 'estado_pc_desc',
      body: (row) => (
        <InventoryStatusBadge
          value={resolveLabel(row, ['estado_pc_desc'], ['estado_pc'], estadoPcById)}
        />
      ),
      sortable: true,
      style: { minWidth: '9rem' }
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
      field: 'ticket',
      header: 'Ticket',
      body: (row) => row?.ticket ?? '—',
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
      style: { minWidth: '12rem' },
      body: (row) => row?.observaciones ?? '—'
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

const activoToggle = async (row, activo) => updatePcEstado(row.id_pc, { activo });

const PCsLaptopsPage = () => {
  const [catalogs, setCatalogs] = useState({
    estadoPcById: new Map(),
    estadoEquipoById: new Map(),
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
          estadoPcById: buildLookup(asArray(estados), 'id_estado', 'descripcion'),
          estadoEquipoById: buildLookup(asArray(asignaciones), 'id_asignado', 'descripcion'),
          ubicacionById: buildLookup(asArray(ubicaciones), 'id', 'descripcion')
        });
      } catch {
        setCatalogs({
          estadoPcById: new Map(),
          estadoEquipoById: new Map(),
          ubicacionById: new Map()
        });
      }
    };
    load();
  }, []);

  const fetchData = useCallback(
    () => wrapFetchWithStats(getPCsLaptops, setStats)(),
    []
  );

  const columns = useMemo(() => buildColumns(catalogs), [catalogs]);

  return (
    <InventoryPageShell
      hero={
        <PageHero
          title="Inventario de PCs y Laptops"
          subtitle="Equipos de cómputo: estado operativo, asignación patrimonial, ubicación y responsable. Plantilla Excel e importación masiva."
          icon="pi-server"
        >
          <StatPills total={stats.total} activos={stats.activos} />
        </PageHero>
      }
    >
      <CrudDataTable
        title="Listado de PCs y laptops"
        dataKey="id_pc"
        fetchData={fetchData}
        templateModule="laptos"
        inportarExcel="pcsLaptopsImport"
        toolbarButtonsVariant="bootstrap"
        columns={columns}
        globalFilterFields={[
          'tipo_equipo',
          'marca',
          'modelo',
          'serie',
          'estado_pc_desc',
          'estado_equipo_desc',
          'nombre_area',
          'nombre_colaborador',
          'nombre_ubicacion',
          'ubicacion',
          'observaciones',
          'anexo',
          'activo'
        ]}
        FormComponent={PCLaptopForm}
        formSelectedProp="selected"
        dialogWidth="64rem"
        dialogBreakpoints={{ '1200px': '92vw', '960px': '96vw' }}
        dialogHeaderNew="Nuevo PC / Laptop"
        dialogHeaderEdit="Editar PC / Laptop"
        dialogSubtitleNew="Alta manual de equipo"
        dialogSubtitleEdit="Actualice los datos del equipo"
        dialogHeaderIcon="pi-desktop"
        activoToggle={activoToggle}
      />
    </InventoryPageShell>
  );
};

export default PCsLaptopsPage;
