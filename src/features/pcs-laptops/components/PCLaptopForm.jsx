import { useEffect, useState } from 'react';
import { createPcLaptop, getPcById, updatePcLaptop } from '../../../services/api/pcs_laptops.api';
import {
  getAreas,
  getColaboradores,
  getEstadoEquipo,
  getAsignacion,
  getTipoEquipo,
  getUbicacion
} from '../../../services/api/transvesalMaestro/transversal';
import { Dropdown } from 'primereact/dropdown';
import FormShell from '../../../shared/components/ui/form/FormShell';
import FormField from '../../../shared/components/ui/form/FormField';
import FormActions from '../../../shared/components/ui/form/FormActions';
import FormInputWithIcon from '../../../shared/components/ui/form/FormInputWithIcon';
import DevicePreviewSidebar from '../../../shared/components/ui/form/DevicePreviewSidebar';
import '../../modems/components/ModemForm.css';
import '../../../shared/components/ui/form/executive-form-modal.css';

const asArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const emptyForm = {
  tipo_equipo: '',
  marca: '',
  modelo: '',
  serie: '',
  estado_pc: '',
  estado_equipo: '',
  id_area: '',
  usuario: '',
  ticket: '',
  ubicacion: '',
  observaciones: '',
  anexo: ''
};

const PCLaptopForm = ({ selected, onSaved, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [areas, setAreas] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [estadosEquipo, setEstadosEquipo] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [tiposEquipo, setTiposEquipo] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(selected);

  const setValueForm = (data) => {
    setForm({
      tipo_equipo: data.tipo_equipo ?? '',
      marca: data.marca ?? '',
      modelo: data.modelo ?? '',
      serie: data.serie ?? '',
      estado_pc: data.estado_pc ?? '',
      estado_equipo: data.estado_equipo ?? '',
      id_area: data.id_area ?? '',
      usuario: data.usuario ?? '',
      ticket: data.ticket ?? '',
      ubicacion: data.id_ubicacion ?? '',
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
        const [areasData, colabData, estadoData, asigData, tipoEquipoData, ubicacionData] =
          await Promise.all([
            getAreas(),
            getColaboradores(),
            getEstadoEquipo(),
            getAsignacion(),
            getTipoEquipo(),
            getUbicacion()
          ]);
        setAreas(asArray(areasData));
        setColaboradores(asArray(colabData));
        setEstadosEquipo(asArray(estadoData));
        setAsignaciones(asArray(asigData));
        setTiposEquipo(asArray(tipoEquipoData));
        setUbicaciones(asArray(ubicacionData));
      } catch (error) {
        console.error('Error loading catalogs:', error);
        setAreas([]);
        setColaboradores([]);
        setEstadosEquipo([]);
        setAsignaciones([]);
        setTiposEquipo([]);
        setUbicaciones([]);
      }
    };

    loadCatalogs();

    const mode = selected ? 'EDITAR' : 'NUEVO';
    if (mode === 'EDITAR') {
      const pcById = async () => {
        try {
          setLoading(true);
          const dataPc = await getPcById(selected.id_pc);
          setValueForm(dataPc);
        } catch {
          setValueForm(selected);
        } finally {
          setLoading(false);
        }
      };
      pcById();
    } else {
      setForm(emptyForm);
    }
  }, [selected]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     SUBMIT
  ========================= */
  const toInt = (v) => (v === '' || v == null ? null : Number(v));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      tipo_equipo: form.tipo_equipo,
      marca: form.marca,
      modelo: form.modelo,
      serie: form.serie,
      estado_pc: toInt(form.estado_pc),
      estado_equipo: toInt(form.estado_equipo),
      id_area: toInt(form.id_area),
      ticket: form.ticket?.trim() || null,
      usuario: toInt(form.usuario),
      ubicacion: toInt(form.ubicacion),
      observaciones: form.observaciones || null,
      anexo: toInt(form.anexo)
    };

    try {
      if (isEditMode) {
        await updatePcLaptop(selected.id_pc, payload);
      } else {
        await createPcLaptop(payload);
      }
      onSaved?.();
      if (!isEditMode) setForm(emptyForm);
    } catch (error) {
      console.error('Error al guardar equipo:', error);
    } finally {
      setLoading(false);
    }
  };

  const estadoPcLabel =
    estadosEquipo.find((o) => o.id_estado === Number(form.estado_pc))?.descripcion || '';
  const estadoEquipoLabel =
    asignaciones.find((o) => o.id_asignado === Number(form.estado_equipo))?.descripcion || '';
  const areaLabel = areas.find((a) => a.id_area === Number(form.id_area))?.nombre_area || '';
  const colaboradorLabel =
    colaboradores.find((c) => c.id_colaborador === Number(form.usuario))?.nombre_completo || '';

  return (
    <div className="d-flex justify-content-center py-2">
      <FormShell className="modem-form-shell executive-form-shell">
        <DevicePreviewSidebar
          deviceType={form.tipo_equipo || 'PC/Laptop'}
          centerIcon="pi pi-desktop"
          centerTitle={form.marca || 'Equipo'}
          centerSubtitle={form.modelo || 'Esperando datos'}
          cards={[
            { id: 'imei', label: 'HOST', value: form.serie, icon: 'pi pi-box' },
            { id: 'marca', label: 'Marca', value: form.marca, icon: 'pi pi-tag' },
            { id: 'modelo', label: 'Modelo', value: form.modelo, icon: 'pi pi-desktop' },
            { id: 'estadoModem', label: 'Estado PC', value: estadoPcLabel, icon: 'pi pi-cog' },
            { id: 'estadoEquipo', label: 'Asignacion', value: estadoEquipoLabel, icon: 'pi pi-chart-bar' },
            { id: 'area', label: 'Area', value: areaLabel, icon: 'pi pi-map-marker' },
            { id: 'usuario', label: 'Colaborador', value: colaboradorLabel, icon: 'pi pi-users' }
          ]}
        />

        <form onSubmit={handleSubmit} className="ui-form-main modem-form-main">
          <div className="ui-form-grid">
            <FormField label="Tipo de equipo" icon="💻">
              <FormInputWithIcon>
                <Dropdown
                  value={form.tipo_equipo || null}
                  onChange={(e) => setForm((prev) => ({ ...prev, tipo_equipo: e.value ?? '' }))}
                  options={tiposEquipo}
                  optionLabel="nombre_tipo_equipo"
                  optionValue="nombre_tipo_equipo"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Marca" icon="🏷️">
              <FormInputWithIcon>
                <input name="marca" value={form.marca} onChange={handleChange}  className="ui-form-input" />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Modelo" icon="📦">
              <FormInputWithIcon>
                <input name="modelo" value={form.modelo} onChange={handleChange}  className="ui-form-input" />
              </FormInputWithIcon>
            </FormField>
            <FormField label="Ticket" icon="📦">
              <FormInputWithIcon>
                <input name="ticket" value={form.ticket ?? ''} onChange={handleChange} className="ui-form-input" />
              </FormInputWithIcon>
            </FormField>

            <FormField label="HOST (serie)" full icon="🔢">
              <FormInputWithIcon>
                <input name="serie" value={form.serie} onChange={handleChange} disabled={isEditMode}
                  maxLength={60} className="ui-form-input" />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estado PC" icon="⚙️">
              <FormInputWithIcon>
                <Dropdown
                  value={form.estado_pc !== '' && form.estado_pc != null ? Number(form.estado_pc) : null}
                  onChange={(e) => setForm((prev) => ({ ...prev, estado_pc: e.value ?? '' }))}
                  options={estadosEquipo}
                  optionLabel="descripcion"
                  optionValue="id_estado"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estado equipo" icon="📍">
              <FormInputWithIcon>
                <Dropdown
                  value={form.estado_equipo !== '' && form.estado_equipo != null ? Number(form.estado_equipo) : null}
                  onChange={(e) => setForm((prev) => ({ ...prev, estado_equipo: e.value ?? '' }))}
                  options={asignaciones}
                  optionLabel="descripcion"
                  optionValue="id_asignado"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Área" icon="🏢">
              <FormInputWithIcon>
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

            <FormField label="Colaborador" icon="👤">
              <FormInputWithIcon>
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

            <FormField label="Ubicación" icon="📍">
              <FormInputWithIcon>
                <Dropdown
                  value={form.ubicacion !== '' && form.ubicacion != null ? Number(form.ubicacion) : null}
                  onChange={(e) => setForm((prev) => ({ ...prev, ubicacion: e.value ?? '' }))}
                  options={ubicaciones}
                  optionLabel="descripcion"
                  optionValue="id"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Anexo" icon="📎">
              <FormInputWithIcon>
                <input name="anexo" value={form.anexo} onChange={handleChange} className="ui-form-input" />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Observaciones" full icon="📝">
              <FormInputWithIcon>
                <textarea name="observaciones" value={form.observaciones ?? ''} onChange={handleChange} rows={3} maxLength={255} className="ui-form-input" style={{ resize: 'vertical' }} />
              </FormInputWithIcon>
            </FormField>
          </div>

          <FormActions>
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => onCancel?.()}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={loading}>
              {loading ? 'Guardando…' : isEditMode ? 'Editar' : 'Guardar'}
            </button>
          </FormActions>
        </form>
      </FormShell>
    </div>
  );
};

export default PCLaptopForm;
