import { useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import { downloadModuleExcel } from '../../../services/api/export.api';
import './CrudDataTable.css';

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
 * - toggleAction(row): acción por fila (opcional)
 * - getToggleMeta(row): { icon, severity, confirmMessage } (opcional)
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
  toggleAction,
  getToggleMeta,
  bulkAction,
  formSelectedProp = 'selectedChip',
  exportModule
}) => {
  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRows, setSelectedRows] = useState([]);
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [confirmRowVisible, setConfirmRowVisible] = useState(false);
  const [confirmBulkVisible, setConfirmBulkVisible] = useState(false);

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
        detail: 'Archivo Excel exportado correctamente.',
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

  const editRow = (row) => {
    setEditingRow(row);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setDialogVisible(false);
  };

  const confirmToggleRow = (row) => {
    setEditingRow(row);
    setConfirmRowVisible(true);
  };

  const runToggleRow = async () => {
    const target = editingRow;
    if (!target) {
      setConfirmRowVisible(false);
      return;
    }

    try {
      await toggleAction?.(target);
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
        detail: 'No se pudo completar la acción',
        life: 3000
      });
    } finally {
      setConfirmRowVisible(false);
      setEditingRow(null);
      setSelectedRows([]);
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

  const header = useMemo(
    () => (
      <div className="d-flex align-items-center justify-content-between gap-3 flex-nowrap crud-table-header">
        <div className="d-flex align-items-center gap-2 flex-shrink-0 crud-table-title-wrap">
          <span className="d-inline-flex align-items-center justify-content-center lh-1 crud-table-title-icon" aria-hidden="true">
            <i className="pi pi-table" />
          </span>
          <div className="fw-semibold crud-table-title-text">{title}</div>
        </div>

        <div className="d-flex align-items-center justify-content-end gap-2 flex-nowrap w-100">
          <div className="input-group input-group-sm crud-search-group">
            <span className="input-group-text bg-white crud-search-icon-wrap">
              <i className="pi pi-search" />
            </span>
            <InputText
              type="search"
              value={globalFilterValue}
              placeholder="Buscar..."
              onChange={onGlobalFilterChange}
              className="form-control crud-search-input"
            />
          </div>

          <div className="d-flex gap-2 flex-nowrap crud-toolbar-actions">
            <ToolbarBtn
              label={exporting ? 'Exportando...' : 'Exportar'}
              icon="pi pi-download"
              severity="help"
              onClick={exportData}
              disabled={exporting}
            />
            {FormComponent ? <ToolbarBtn label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} /> : null}
            {/* {bulkAction ? (
              <ToolbarBtn
                label={bulkAction.label}
                icon={bulkAction.icon}
                severity={bulkAction.severity}
                onClick={() => setConfirmBulkVisible(true)}
                disabled={!selectedRows?.length}
              />
            ) : null} */}
          </div>
        </div>
      </div>
    ),
    [FormComponent, bulkAction, globalFilterValue, title, toolbarButtonsVariant, exporting, exportModule]
  );

  const actionBodyTemplate = (row) => {
    if (!FormComponent && !toggleAction) return null;
    const meta = getToggleMeta?.(row) || {};
    return (
      <div className="d-inline-flex align-items-center justify-content-center gap-2 w-100">
        {FormComponent ? (
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
        ) : null}
        {toggleAction ? (
          <Button
            icon={meta.icon || 'pi pi-check'}
            rounded
            text
            severity="secondary"
            className={`crud-action-icon-btn ${
              meta.severity === 'danger' ? 'crud-action-icon-btn--danger' : 'crud-action-icon-btn--success'
            }`}
            onClick={() => confirmToggleRow(row)}
            title={meta.severity === 'danger' ? 'Desactivar' : 'Activar'}
            aria-label={meta.severity === 'danger' ? 'Desactivar' : 'Activar'}
          />
        ) : null}
      </div>
    );
  };

  const rowConfirmMeta = editingRow ? (getToggleMeta?.(editingRow) || {}) : {};

  const getAvatarUrl = (row) =>
    row?.avatar_url ||
    row?.avatarUrl ||
    row?.foto_url ||
    row?.fotoUrl ||
    row?.imagen_url ||
    row?.imagenUrl ||
    row?.foto ||
    row?.imagen ||
    '';

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
    let label = row?.[column.field];
    if ((label == null || label === '') && typeof column.body === 'function') {
      const fallback = column.body(row);
      if (typeof fallback === 'string' || typeof fallback === 'number') {
        label = fallback;
      }
    }

    const displayName = String(label || '-');
    const avatarUrl = getAvatarUrl(row);

    return (
      <div className="crud-collab-cell">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="crud-collab-avatar" />
        ) : (
          <span className="crud-collab-avatar crud-collab-avatar--fallback">{getInitials(displayName)}</span>
        )}
        <span className="crud-collab-name">{displayName}</span>
      </div>
    );
  };

  return (
    <div className="crud-table-shell">
      <Toast ref={toast} />

      <div className="card shadow-sm border-0 crud-header-card">
        <div className="card-body pb-2">{header}</div>
      <div className="card p-2 my-6 border-0 crud-grid-card"> 
        <div className="card-body pt-0">
        <DataTable
          ref={dt}
          value={rows}
          dataKey={dataKey}
          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(Array.isArray(e.value) ? e.value : [])}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
          stripedRows
          size="small"
          emptyMessage="No hay registros para mostrar"
          className="p-datatable-sm crud-data-table"
          loading={loading}
          filters={filters}
          globalFilterFields={resolvedGlobalFields}
        >
          {bulkAction ? (
            <Column selectionMode="multiple" exportable={false} style={{ width: '3rem' }} />
          ) : null}

          {(columns || []).map((c, idx) => {
            const joined = `${c.field || ''} ${c.header || ''}`.toLowerCase();
            const isCollaboratorColumn = joined.includes('colaborador') || joined.includes('usuario');
            return (
              <Column
                // eslint-disable-next-line react/no-array-index-key
                key={c.field || c.header || idx}
                field={c.field}
                header={c.header}
                body={isCollaboratorColumn ? ((row) => collaboratorBodyTemplate(c, row)) : c.body}
                sortable={c.sortable}
                sortField={c.sortField}
                style={{
                  ...(c.style || {}),
                  ...(c.centered ? { textAlign: 'center' } : {})
                }}
                headerStyle={c.centered ? { textAlign: 'center' } : undefined}
                exportable={c.exportable}
                className={c.centered ? 'crud-cell-centered' : undefined}
                headerClassName={c.centered ? 'crud-cell-centered' : undefined}
              />
            );
          })}

          {FormComponent || toggleAction ? (
            <Column
              header="Acciones"
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: '9rem', textAlign: 'center' }}
              headerStyle={{ textAlign: 'center' }}
              className="crud-actions-column"
              headerClassName="crud-actions-column"
            />
          ) : null}
        </DataTable>
        </div>
        </div>
      </div>

      {FormComponent ? (
        <Dialog
          visible={dialogVisible}
          style={{ width: dialogWidth }}
          breakpoints={dialogBreakpoints}
          header={editingRow ? dialogHeaderEdit : dialogHeaderNew}
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

      {toggleAction ? (
        <Dialog
          visible={confirmRowVisible}
          style={{ width: '32rem' }}
          breakpoints={{ '960px': '80vw', '641px': '92vw' }}
          header="Confirmar"
          modal
          footer={
            <>
              <Button label="No" icon="pi pi-times" outlined onClick={() => setConfirmRowVisible(false)} />
              <Button label="Sí" icon="pi pi-check" severity="danger" onClick={runToggleRow} />
            </>
          }
          onHide={() => setConfirmRowVisible(false)}
        >
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            <span>{rowConfirmMeta.confirmMessage || '¿Confirmas la acción?'}</span>
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

