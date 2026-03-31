import { useEffect, useState } from 'react';
import { createMonitor, updateMonitor } from '../../../services/api/monitores.api';
import {
  getAreas,
  getColaboradores,
  getEstadoEquipo,
  getAsignacion
} from '../../../services/api/transvesalMaestro/transversal';
import { Dropdown } from 'primereact/dropdown';
import FormShell from '../../../shared/components/ui/form/FormShell';
import FormField from '../../../shared/components/ui/form/FormField';
import FormActions from '../../../shared/components/ui/form/FormActions';
import FormInputWithIcon from '../../../shared/components/ui/form/FormInputWithIcon';
import DevicePreviewSidebar from '../../../shared/components/ui/form/DevicePreviewSidebar';
import '../../modems/components/ModemForm.css';

const asArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const emptyForm = {
  serie: '',
  marca: '',
  modelo: '',
  estado_monitor: '',
  status_monitor: '',
  id_area: '',
  usuario: '',
  ubicacion: '',
  observaciones: '',
  anexo: ''
};

const MonitoresForm = ({ selected, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [areas, setAreas] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [estadosEquipo, setEstadosEquipo] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(selected);

  const setValueForm = (data) => {
    setForm({
      serie: data.serie ?? '',
      marca: data.marca ?? '',
      modelo: data.modelo ?? '',
      estado_monitor: data.estado_monitor ?? '',
      status_monitor: data.status_monitor ?? '',
      id_area: data.id_area ?? '',
      usuario: data.usuario ?? '',
      ubicacion: data.ubicacion ?? '',
      observaciones: data.observaciones ?? '',
      anexo: data.anexo ?? ''
    });
  };

  /* =========================
     CARGA INICIAL + EDICIÓN
  ========================= */
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [areasData, colabData, estadoData, asigData] = await Promise.all([
          getAreas(),
          getColaboradores(),
          getEstadoEquipo(),
          getAsignacion()
        ]);
        setAreas(asArray(areasData));
        setColaboradores(asArray(colabData));
        setEstadosEquipo(asArray(estadoData));
        setAsignaciones(asArray(asigData));
      } catch (error) {
        console.error('Error loading catalogs:', error);
        setAreas([]);
        setColaboradores([]);
        setEstadosEquipo([]);
        setAsignaciones([]);
      }
    };

    loadCatalogs();

    if (selected) {
      setValueForm(selected);
    } else {
      setForm(emptyForm);
    }
  }, [selected]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     SUBMIT
  ========================= */
  const toInt = (v) => (v === '' || v == null ? null : Number(v));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      serie: form.serie,
      marca: form.marca,
      modelo: form.modelo,
      estado_monitor: toInt(form.estado_monitor),
      status_monitor: toInt(form.status_monitor),
      id_area: toInt(form.id_area),
      usuario: toInt(form.usuario),
      ubicacion: form.ubicacion || null,
      observaciones: form.observaciones || null,
      anexo: form.anexo || null
    };

    try {
      if (isEditMode) {
        await updateMonitor(selected.id_monitor, payload);
      } else {
        await createMonitor(payload);
      }
      onSaved?.();
      if (!isEditMode) setForm(emptyForm);
    } catch (error) {
      console.error('Error al guardar monitor:', error);
    } finally {
      setLoading(false);
    }
  };

  const estadoMonitorLabel =
    estadosEquipo.find((o) => o.id_estado === Number(form.estado_monitor))?.descripcion || '';
  const statusMonitorLabel =
    asignaciones.find((o) => o.id_asignado === Number(form.status_monitor))?.descripcion || '';
  const areaLabel = areas.find((a) => a.id_area === Number(form.id_area))?.nombre_area || '';
  const colaboradorLabel =
    colaboradores.find((c) => c.id_colaborador === Number(form.usuario))?.nombre_completo || '';

  return (
    <div className="d-flex justify-content-center py-2">
      <FormShell className="modem-form-shell">
        <DevicePreviewSidebar
          deviceType="Monitor"
          centerIcon="pi pi-desktop"
          centerTitle={form.marca || 'Monitor'}
          centerSubtitle={form.modelo || 'Esperando datos'}
          cards={[
            { id: 'imei', label: 'Serie', value: form.serie, icon: 'pi pi-box' },
            { id: 'marca', label: 'Marca', value: form.marca, icon: 'pi pi-tag' },
            { id: 'modelo', label: 'Modelo', value: form.modelo, icon: 'pi pi-desktop' },
            { id: 'estadoModem', label: 'Estado', value: estadoMonitorLabel, icon: 'pi pi-cog' },
            { id: 'estadoEquipo', label: 'Estatus', value: statusMonitorLabel, icon: 'pi pi-chart-bar' },
            { id: 'area', label: 'Area', value: areaLabel, icon: 'pi pi-map-marker' },
            { id: 'usuario', label: 'Colaborador', value: colaboradorLabel, icon: 'pi pi-users' }
          ]}
        />

        <form onSubmit={handleSubmit} className="ui-form-main modem-form-main">
          <div className="ui-form-grid">
            <FormField label="Serie" full>
              <FormInputWithIcon icon="🔢">
                <input
                  name="serie"
                  value={form.serie}
                  onChange={handleChange}
                  disabled={isEditMode}
                  
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Marca">
              <FormInputWithIcon icon="🏷️">
                <input
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                  
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Modelo">
              <FormInputWithIcon icon="📺">
                <input
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estado del Monitor">
              <FormInputWithIcon icon="⚙️">
                <Dropdown
                  value={form.estado_monitor !== '' && form.estado_monitor != null ? Number(form.estado_monitor) : null}
                  onChange={(e) => setForm((prev) => ({ ...prev, estado_monitor: e.value ?? '' }))}
                  options={estadosEquipo}
                  optionLabel="descripcion"
                  optionValue="id_estado"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estatus">
              <FormInputWithIcon icon="📌">
                <Dropdown
                  value={form.status_monitor !== '' && form.status_monitor != null ? Number(form.status_monitor) : null}
                  onChange={(e) => setForm((prev) => ({ ...prev, status_monitor: e.value ?? '' }))}
                  options={asignaciones}
                  optionLabel="descripcion"
                  optionValue="id_asignado"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Área">
              <FormInputWithIcon icon="🏢">
                <Dropdown
                  value={form.id_area !== '' && form.id_area != null ? Number(form.id_area) : null}
                  onChange={(e) => setForm((prev) => ({ ...prev, id_area: e.value ?? '' }))}
                  options={areas}
                  optionLabel="nombre_area"
                  optionValue="id_area"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Colaborador">
              <FormInputWithIcon icon="👤">
                <Dropdown
                  value={form.usuario !== '' && form.usuario != null ? Number(form.usuario) : null}
                  onChange={(e) => setForm((prev) => ({ ...prev, usuario: e.value ?? '' }))}
                  options={colaboradores}
                  optionLabel="nombre_completo"
                  optionValue="id_colaborador"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Ubicación">
              <FormInputWithIcon icon="📍">
                <input
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Anexo" full>
              <FormInputWithIcon icon="☎️">
                <input
                  name="anexo"
                  value={form.anexo}
                  onChange={handleChange}
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Observaciones" full>
              <FormInputWithIcon icon="📝">
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  rows={2}
                  className="ui-form-input"
                  style={{ resize: 'none' }}
                />
              </FormInputWithIcon>
            </FormField>
          </div>

          <FormActions>
            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
          </FormActions>
        </form>
      </FormShell>
    </div>
  );
};

export default MonitoresForm;
