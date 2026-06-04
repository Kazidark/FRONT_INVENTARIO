import { useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import {
  downloadModemTemplate,
  downloadChipTemplate,
  downloadCelularTemplate,
  downloadLaptopTemplate,
  downloadTabletTemplate,
  downloadModuleExcel,
  importModuleExcel
} from '../../../services/api/export.api';
import './CrudDataTable.css';
import { useAuth } from '../../context/AuthContext';
import ActivoSwitchCell from './ActivoSwitchCell';

const IMPORT_TEMPLATE_MODULES = new Set(['modems', 'chips', 'celulares', 'laptos', 'tablets']);
/**
 * Tabla CRUD reutilizable (PrimeReact DataTable)
 *
 * Recibe por props:
 * - fetchData(): Promise<array>
 * - columns: [{ field?, header, body?, sortable?, sortField?, style?, exportable? }]
 * - dataKey: string
 * - globalFilterFields: string[]
 * - FormComponent: componente (opcional) para crear/editar
 * - getFormProps(item): props extra para el FormComponent (opcional)
 * - exportModule: modulo backend para exportar excel (opcional)
 * - activoToggle(row, activo): cambiar estado activo/inactivo (switch en columna Estado)
 * - activoField: nombre del campo booleano (default 'activo')
 * - bulkAction: { label, icon, severity, confirmMessage, action(selectedRows) }
 */
const CrudDataTable = ({
  title = 'Listado',
  dataKey,
  fetchData,
  columns,
  globalFilterFields,
  FormComponent,
  getFormProps,
  toolbarButtonsVariant = 'bootstrap', // 'primereact' | 'bootstrap'
  dialogWidth = '70rem',
  dialogBreakpoints = { '960px': '92vw', '641px': '96vw' },
  dialogHeaderNew = 'Nuevo',
  dialogHeaderEdit = 'Editar',
  dialogSubtitleNew = '',
  dialogSubtitleEdit = '',
  dialogHeaderIcon = 'pi-mobile',
  activoToggle,
  activoField = 'activo',
  bulkAction,
  showActionsColumn = true,
  showToolbarTitle = false,
  formSelectedProp = 'selectedChip',
  exportModule,
  inportarExcel,
  templateModule
}) => {
  const { user } = useAuth();
  const isAdmin = useMemo(() => {
    const roleValues = [user?.roles, user?.rol, user?.user?.rol, user?.usuario?.rol]
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => value !== null && value !== undefined);

    return roleValues.some((role) => {
      if (typeof role === 'number') return role === 1;
      if (typeof role === 'string') {
        const normalized = role.trim().toLowerCase();
        return normalized === '1' || normalized === 'admin' || normalized === 'administrador';
      }
      if (typeof role === 'object') {
        const nestedName = String(role?.name || role?.nombre || '').trim().toLowerCase();
        const nestedCode = role?.id ?? role?.code ?? role?.value;
        return nestedName === 'admin' || nestedName === 'administrador' || Number(nestedCode) === 1;
      }
      return false;
    });
  }, [user]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [togglingActivoId, setTogglingActivoId] = useState(null);

  const [confirmBulkVisible, setConfirmBulkVisible] = useState(false);

  const hasExcelTemplate = IMPORT_TEMPLATE_MODULES.has(templateModule);
  const showExcelExport = Boolean(exportModule) && !hasExcelTemplate;

  const toast = useRef(null);
  const dt = useRef(null);
  const didInitialFetchRef = useRef(false);

  const doFetch = async () => {
    setLoading(true);
    try {
      const data = await fetchData?.();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // React StrictMode (dev) ejecuta efectos 2 veces.
    if (didInitialFetchRef.current) return;
    didInitialFetchRef.current = true;
    void doFetch();
  }, []);

  const resolvedGlobalFields = useMemo(() => {
    if (Array.isArray(globalFilterFields) && globalFilterFields.length) return globalFilterFields;
    const byColumns = (columns || [])
      .map((c) => c.field)
      .filter(Boolean);
    return byColumns.length ? byColumns : [dataKey].filter(Boolean);
  }, [columns, dataKey, globalFilterFields]);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const exportData = async () => {
    if (!exportModule) {
      exportCSV();
      return;
    }

    setExporting(true);
    try {
      await downloadModuleExcel(exportModule, `${title}.xlsx`);
      toast.current?.show({
        severity: 'success',
        summary: 'Listo',
        detail:
          exportModule === 'modems' ||
          exportModule === 'chips' ||
          exportModule === 'celulares' ||
          exportModule === 'laptos' ||
          exportModule === 'tablets'
            ? 'Excel exportado con columnas listas para importar de nuevo.'
            : 'Archivo Excel exportado correctamente.',
        life: 2500
      });
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo exportar el Excel.',
        life: 3000
      });
    } finally {
      setExporting(false);
    }
  };

  const downloadTemplate = async () => {
    if (!hasExcelTemplate) {
      return;
    }
    setDownloadingTemplate(true);
    try {
      if (templateModule === 'chips') {
        await downloadChipTemplate();
      } else if (templateModule === 'celulares') {
        await downloadCelularTemplate();
      } else if (templateModule === 'laptos') {
        await downloadLaptopTemplate();
      } else if (templateModule === 'tablets') {
        await downloadTabletTemplate();
      } else {
        await downloadModemTemplate();
      }
      toast.current?.show({
        severity: 'success',
        summary: 'Plantilla',
        detail: 'Plantilla Excel descargada. Complétala e impórtala.',
        life: 3500
      });
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo descargar la plantilla.',
        life: 3000
      });
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const bsVariantFromSeverity = (severity) => {
    switch (severity) {
      case 'success':
        return 'success';
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'secondary':
        return 'secondary';
      case 'help':
      default:
        return 'primary';
    }
  };

  const ToolbarBtn = ({ label, icon, severity, onClick, disabled }) => {
    if (toolbarButtonsVariant === 'bootstrap') {
      const v = bsVariantFromSeverity(severity);
      return (
        <button
          type="button"
          className={`btn btn-${v} btn-sm d-inline-flex align-items-center crud-toolbar-btn`}
          onClick={onClick}
          disabled={disabled}
        >
          {icon ? <i className={`${icon} me-2`} /> : null}
          {label}
        </button>
      );
    }

    return (
      <Button
        label={label}
        icon={icon}
        severity={severity}
        onClick={onClick}
        disabled={disabled}
      />
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value }
    }));
  };

  const openNew = () => {
    setEditingRow(null);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const isRowActive = (row) => Boolean(row?.[activoField]);

  const editRow = (row) => {
    if (activoToggle && !isRowActive(row)) return;
    setEditingRow(row);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setDialogVisible(false);
  };

  const handleActivoChange = async (row, nextActive) => {
    if (!activoToggle || !dataKey) return;
    const rowId = row?.[dataKey];
    setTogglingActivoId(rowId);
    try {
      await activoToggle(row, nextActive);
      await doFetch();
      toast.current?.show({
        severity: 'success',
        summary: 'Listo',
        detail: nextActive ? 'Registro activado' : 'Registro desactivado',
        life: 2500
      });
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cambiar el estado',
        life: 3000
      });
    } finally {
      setTogglingActivoId(null);
    }
  };

  const runBulkAction = async () => {
    const items = Array.isArray(selectedRows) ? selectedRows : [];
    if (!items.length) {
      setConfirmBulkVisible(false);
      return;
    }

    try {
      await bulkAction?.action?.(items);
      await doFetch();
      toast.current?.show({
        severity: 'success',
        summary: 'Listo',
        detail: 'Acción realizada',
        life: 2500
      });
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo completar la acción masiva',
        life: 3000
      });
    } finally {
      setConfirmBulkVisible(false);
      setSelectedRows([]);
    }
  }; 
  /**
   * fuction que   sube  excel 
  */
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !inportarExcel) return;
    setImporting(true);
    try {
      const { data } = await importModuleExcel(inportarExcel, file);
      await doFetch();
      const payload =
        Array.isArray(data?.result) && data.result.length > 0 && data.result[0]
          ? data.result[0]
          : data;
      const detail =
        (typeof payload?.message === 'string' && payload.message) ||
        (typeof data?.message === 'string' && data.message) ||
        'Excel importado correctamente.';
      const s = payload?.summary ?? data?.summary;
      const parts = [];
      if (s?.inserted != null) parts.push(`${s.inserted} nuevo(s)`);
      if (s?.updated != null) parts.push(`${s.updated} actualizado(s)`);
      if (s?.unchanged != null) parts.push(`${s.unchanged} sin cambios`);
      if (s?.estadoEquipoMissing > 0) {
        parts.push(
          `${s.estadoEquipoMissing} sin estado equipo en catálogo (revise TBLM_asignacion)`,
        );
      }
      if (s?.chipsCreated > 0) {
        parts.push(`${s.chipsCreated} chip(s) creado(s) en inventario`);
      }
      if (s?.chipMissing > 0) {
        parts.push(`${s.chipMissing} módem(s) sin chip vinculado`);
      }
      if (s?.duplicateInFile > 0) {
        parts.push(`${s.duplicateInFile} duplicado(s) en archivo`);
      }
      if (s?.estadoTabletResolved != null) {
        parts.push(`${s.estadoTabletResolved} con estado tablet (ID)`);
      }
      if (s?.estadoEquipoResolved != null) {
        parts.push(`${s.estadoEquipoResolved} con estado equipo (ID)`);
      }
      if (s?.ubicacionResolved != null) {
        parts.push(`${s.ubicacionResolved} con ubicación (ID)`);
      }
      if (
        templateModule === 'tablets' &&
        s?.importVersion !== 'tablets-catalog-fk-v3' &&
        payload?.importVersion !== 'tablets-catalog-fk-v3'
      ) {
        parts.push(
          'Backend desactualizado: en Back-inventario ejecute npm run build y reinicie el servidor',
        );
      }
      if (s?.skippedWithoutSerie > 0) {
        parts.push(`${s.skippedWithoutSerie} sin serie válida`);
      }
      if (s?.skippedWithoutNumber > 0) {
        parts.push(`${s.skippedWithoutNumber} sin número válido (9 dígitos)`);
      }
      if (s?.skippedInvalidRequiredData > 0) {
        parts.push(`${s.skippedInvalidRequiredData} con catálogo inválido`);
      }
      const stats =
        parts.length > 0 ? ` (${parts.join(', ')})` : '';
      const warnings = s?.warnings;
      const warnDetail =
        Array.isArray(warnings) && warnings.length
          ? `${detail}${stats} Revise: ${warnings.slice(0, 3).join(' ')}`
          : `${detail}${stats}`;
      toast.current?.show({
        severity: 'success',
        summary: 'Listo',
        detail: warnDetail,
        life: 6000
      });
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      const detail = Array.isArray(apiMsg)
        ? apiMsg.join(' ')
        : typeof apiMsg === 'string'
          ? apiMsg
          : err?.message?.includes('timeout')
            ? 'La importación tardó demasiado. Reinicie el backend actualizado e intente de nuevo.'
            : 'No se pudo importar el Excel. Use Exportar o Plantilla del sistema y reinicie el backend.';
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail,
        life: 5000
      });
    } finally {
      setImporting(false);
      e.target.value = ''; // permite volver a subir el mismo archivo
    }
  };

  

  const dialogTitleText = editingRow ? dialogHeaderEdit : dialogHeaderNew;
  const dialogSubtitleText = editingRow ? dialogSubtitleEdit : dialogSubtitleNew;

  const dialogHeaderContent = useMemo(
    () => (
      <div className="crud-dialog-heading-wrap">
        <span className="crud-dialog-heading-icon" aria-hidden>
          <i className={`pi ${dialogHeaderIcon}`} />
        </span>
        <span className="crud-dialog-heading-text">
          <span className="crud-dialog-heading-title">{dialogTitleText}</span>
          {dialogSubtitleText ? (
            <span className="crud-dialog-heading-sub">{dialogSubtitleText}</span>
          ) : null}
        </span>
      </div>
    ),
    [dialogTitleText, dialogSubtitleText, dialogHeaderIcon]
  );

  const header = useMemo(
    () => (
      <div className="crud-table-header">
        <div className="crud-toolbar-row">
          {showToolbarTitle ? (
            <div className="crud-table-title-wrap">
              <div className="crud-table-title-row">
                <span className="crud-table-title-text">{title}</span>
                {!loading ? (
                  <span className="crud-record-count" aria-live="polite">
                    {rows.length} {rows.length === 1 ? 'registro' : 'registros'}
                  </span>
                ) : (
                  <span className="crud-record-count crud-record-count--loading">…</span>
                )}
              </div>
            </div>
          ) : null}

          <div className="crud-search-wrap">
            <label htmlFor="crud-global-search" className="visually-hidden">
              Buscar en {title}
            </label>
            <i className="pi pi-search crud-search-field-icon" aria-hidden="true" />
            <InputText
              id="crud-global-search"
              type="search"
              value={globalFilterValue}
              placeholder="Buscar…"
              onChange={onGlobalFilterChange}
              className="crud-search-input"
              aria-label={`Buscar en ${title}`}
            />
          </div>

          <div className="crud-toolbar-actions">
            {hasExcelTemplate && isAdmin ? (
              <ToolbarBtn
                label={downloadingTemplate ? 'Descargando...' : 'Plantilla'}
                icon="pi pi-file-excel"
                severity="secondary"
                onClick={downloadTemplate}
                disabled={downloadingTemplate}
              />
            ) : null}
            {showExcelExport && isAdmin ? (
              <ToolbarBtn
                label={exporting ? 'Exportando...' : 'Exportar'}
                icon="pi pi-download"
                severity="help"
                onClick={exportData}
                disabled={exporting}
              />
            ) : null}
            {inportarExcel && isAdmin ? (
              <>
                <ToolbarBtn
                  label={importing ? 'Importando...' : 'Importar Excel'}
                  icon="pi pi-upload"
                  severity="help"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="d-none"
                  aria-hidden
                  onChange={handleImportFile}
                />
              </>
            ) : null}
            
            {FormComponent ? 
             isAdmin ? <ToolbarBtn label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} /> : null : null}
            {bulkAction && isAdmin ? (
              <ToolbarBtn
                label={bulkAction.label}
                icon={bulkAction.icon}
                severity={bulkAction.severity}
                onClick={() => setConfirmBulkVisible(true)} disabled={!selectedRows?.length} />
            ) : null}
          </div>
        </div>
      </div>
    ),
    [
      FormComponent,
      bulkAction,
      globalFilterValue,
      title,
      showToolbarTitle,
      toolbarButtonsVariant,
      exporting,
      exportModule,
      showExcelExport,
      hasExcelTemplate,
      inportarExcel,
      importing,
      isAdmin,
      loading,
      rows.length,
      downloadingTemplate,
      templateModule,
      selectedRows?.length
    ]
  );

  const actionBodyTemplate = (row) => {
    if (!FormComponent) return null;
    const canEdit = !activoToggle || isRowActive(row);
    if (!canEdit) {
      return (
        <span className="crud-action-disabled-hint" title="Actívelo para editar">
          <i className="pi pi-lock" aria-hidden="true" />
          <span className="visually-hidden">No editable — inactivo</span>
        </span>
      );
    }
    return (
      <div className="d-inline-flex align-items-center justify-content-center gap-2 w-100">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="secondary"
          className="crud-action-icon-btn crud-action-icon-btn--edit"
          onClick={() => editRow(row)}
          title="Editar"
          aria-label="Editar"
        />
      </div>
    );
  };

  const activoSwitchBodyTemplate = (row) => {
    const rowId = row?.[dataKey];
    const active = isRowActive(row);
    return (
      <ActivoSwitchCell
        checked={active}
        disabled={!isAdmin || togglingActivoId === rowId}
        onChange={(next) => void handleActivoChange(row, next)}
      />
    );
  };

  const getAvatarUrl = (row) =>
    row?.avatar_url ||
    row?.avatarUrl ||
    row?.foto_url ||
    row?.fotoUrl ||
    row?.imagen_url ||
    row?.imagenUrl ||
    row?.foto_colaborador ||
    row?.fotoColaborador ||
    row?.colaborador_foto ||
    row?.url_foto ||
    row?.foto ||
    row?.imagen ||
    '';

  const resolveCollaboratorLabel = (column, row) => {
    if (typeof column.body === 'function') {
      const fromBody = column.body(row);
      if (typeof fromBody === 'string') {
        const text = fromBody.trim();
        if (text && text !== '—' && text !== '-') return text;
      }
    }

    const fromFields =
      row?.usuario_desc ??
      row?.nombre_colaborador ??
      row?.nombre_colaborador_desc ??
      row?.nombre_completo ??
      null;

    if (fromFields != null && String(fromFields).trim()) {
      return String(fromFields).trim();
    }

    const raw = row?.[column.field];
    const rawText = raw == null ? '' : String(raw).trim();
    if (rawText && !/^\d+$/.test(rawText)) {
      return rawText;
    }

    return null;
  };

  const getInitials = (name) => {
    const text = String(name || '').trim();
    if (!text || text === '-') return 'CO';
    const parts = text.split(/\s+/).filter(Boolean);
    if (!parts.length) return 'CO';
    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || parts[0]?.[1] || '';
    return `${first}${second}`.toUpperCase();
  };

  const collaboratorBodyTemplate = (column, row) => {
    const label = resolveCollaboratorLabel(column, row);
    const hasPerson = Boolean(label);
    const displayName = hasPerson ? label : '—';
    const avatarUrl = getAvatarUrl(row);

    const avatarNode = avatarUrl ? (
      <img src={avatarUrl} alt={displayName} className="crud-collab-avatar" />
    ) : hasPerson ? (
      <span className="crud-collab-avatar crud-collab-avatar--fallback">{getInitials(displayName)}</span>
    ) : (
      <span className="crud-collab-avatar crud-collab-avatar--empty" aria-hidden="true">
        <i className="pi pi-user" />
      </span>
    );

    return (
      <div className="crud-collab-cell">
        <span className="crud-collab-avatar-slot">{avatarNode}</span>
        <span className="crud-collab-name">{displayName}</span>
      </div>
    );
  };

  return (
    <div className="crud-table-shell">
      <Toast ref={toast} />

      <div className="crud-table-panel">
        {header}
        <div className="crud-data-table-wrap">
          <DataTable
            ref={dt}
            value={rows}
            dataKey={dataKey}
            selection={selectedRows}
            onSelectionChange={(e) => setSelectedRows(Array.isArray(e.value) ? e.value : [])}
            paginator
            rows={30}
            rowsPerPageOptions={[10, 30, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
            paginatorClassName="crud-paginator"
            size="small"
            scrollable
            scrollHeight="flex"
            stickyHeader
            emptyMessage="Sin registros"
            className="p-datatable-sm crud-data-table"
            loading={loading}
            filters={filters}
            globalFilterFields={resolvedGlobalFields}
            tableStyle={{ minWidth: '48rem' }}
            rowClassName={(row) => (activoToggle && !isRowActive(row) ? 'crud-row--inactive' : '')}
          >
          {bulkAction ? (
            <Column selectionMode="multiple" exportable={false} style={{ width: '3rem' }} />
          ) : null}

          {(columns || []).map((c, idx) => {
            const joined = `${c.field || ''} ${c.header || ''}`.toLowerCase();
            const isCollaboratorColumn =
              c.showAvatar ||
              joined.includes('colaborador') ||
              joined.includes('usuario');
            const isActivoColumn = c.columnType === 'activo' && activoToggle;
            const columnBody = isActivoColumn
              ? (row) => activoSwitchBodyTemplate(row)
              : isCollaboratorColumn
                ? (row) => collaboratorBodyTemplate(c, row)
                : typeof c.body === 'function'
                  ? (row) => c.body(row)
                  : undefined;
            return (
              <Column
                // eslint-disable-next-line react/no-array-index-key
                key={c.field || c.header || idx}
                field={c.field}
                header={c.header}
                body={columnBody}
                sortable={c.sortable}
                sortField={c.sortField}
                style={{
                  ...(c.style || {}),
                  ...(c.centered ? { textAlign: 'center' } : {}),
                  ...(isCollaboratorColumn ? { minWidth: '11rem' } : {}),
                  ...(isActivoColumn ? { minWidth: '8.5rem' } : {})
                }}
                headerStyle={c.centered ? { textAlign: 'center' } : undefined}
                exportable={c.exportable}
                className={
                  [
                    c.centered ? 'crud-cell-centered' : null,
                    isCollaboratorColumn ? 'crud-col-collaborator' : null,
                    isActivoColumn ? 'crud-col-activo' : null
                  ]
                    .filter(Boolean)
                    .join(' ') || undefined
                }
                headerClassName={c.centered ? 'crud-cell-centered' : undefined}
              />
            );
          })}

          {showActionsColumn && FormComponent ? (
          isAdmin ? (
            <Column
              header="Acciones"
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: '5rem', textAlign: 'center' }}
              headerStyle={{ textAlign: 'center' }}
              className="crud-actions-column"
              headerClassName="crud-actions-column"
            />
          ) : null) : null}
          </DataTable>
        </div>
      </div>

      {FormComponent ? (
        <Dialog
          visible={dialogVisible}
          style={{ width: dialogWidth }}
          breakpoints={dialogBreakpoints}
          header={dialogHeaderContent}
          headerClassName="crud-dialog-header"
          modal
          className="p-fluid crud-dialog"
          onHide={hideDialog}
        >
          <div className={classNames({ 'p-invalid': submitted })}>
            <FormComponent
              {...{ [formSelectedProp]: editingRow }}
              onSaved={async () => {
                setDialogVisible(false);
                setEditingRow(null);
                await doFetch();
                toast.current?.show({
                  severity: 'success',
                  summary: 'Listo',
                  detail: editingRow ? 'Actualizado' : 'Creado',
                  life: 2500
                });
              }}
              onCancel={hideDialog}
              {...(getFormProps ? getFormProps(editingRow) : {})}
            />
          </div>
        </Dialog>
      ) : null}

      {bulkAction ? (
        <Dialog
          visible={confirmBulkVisible}
          style={{ width: '32rem' }}
          breakpoints={{ '960px': '80vw', '641px': '92vw' }}
          header="Confirmar"
          modal
          footer={
            <>
              <Button label="No" icon="pi pi-times" outlined onClick={() => setConfirmBulkVisible(false)} />
              <Button label="Sí" icon="pi pi-check" severity="danger" onClick={runBulkAction} />
            </>
          }
          onHide={() => setConfirmBulkVisible(false)}
        >
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            <span>{bulkAction.confirmMessage || '¿Confirmas la acción masiva?'}</span>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
};

export default CrudDataTable;

