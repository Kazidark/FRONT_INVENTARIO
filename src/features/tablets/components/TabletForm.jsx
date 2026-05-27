import { useEffect, useState } from 'react';
import { createTablet, updateTablet } from '../../../services/api/tablets.api';
import {
  getAreas,
  getColaboradores,
  getEstadoEquipo,
  getAsignacion
} from '../../../services/api/transvesalMaestro/transversal';
import { getChipsDisponibles } from '../../../services/api/chips.api';
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
  marca: '',
  modelo: '',
  imei_tablet: '',
  estado_tablet: '',
  estado_equipo: '',
  id_area: '',
  ticket:'',
  usuario: '',
  ubicacion: '',
  observaciones: '',
  num_chips: ''
};

const TabletForm = ({ selectedTablet, onSaved }) => {
  const isEdit = Boolean(selectedTablet);
  const [form, setForm] = useState(emptyForm);
  const [areas, setAreas] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [estadosEquipo, setEstadosEquipo] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(false);

  const setValueForm = (data) => {
    setForm({
      marca: data.marca ?? '',
      modelo: data.modelo ?? '',
      imei_tablet: data.imei_tablet ?? '',
      estado_tablet: data.estado_tablet ?? '',
      estado_equipo: data.estado_equipo ?? '',
      id_area: data.id_area ?? '',
      ticket:data.ticket?? '--',
      usuario: data.usuario ?? '',
      ubicacion: data.ubicacion ?? '',
      observaciones: data.observaciones ?? '',
      num_chips: data.num_chips ?? data.id_chip ?? ''
    });
  };

  /* =========================
     CARGA INICIAL + EDICIÓN
  ========================= */
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [areasData, colabData, estadoData, asigData, chipsData] = await Promise.all([
          getAreas(),
          getColaboradores(),
          getEstadoEquipo(),
          getAsignacion(),
          getChipsDisponibles()
        ]);
        setAreas(asArray(areasData));
        setColaboradores(asArray(colabData));
        setEstadosEquipo(asArray(estadoData));
        setAsignaciones(asArray(asigData));
        setChips(asArray(chipsData));
      } catch (error) {
        console.error('Error loading catalogs:', error);
        setAreas([]);
        setColaboradores([]);
        setEstadosEquipo([]);
        setAsignaciones([]);
        setChips([]);
      }
    };

    loadCatalogs();

    if (selectedTablet) {
      setValueForm(selectedTablet);
    } else {
      setForm(emptyForm);
    }
  }, [selectedTablet]);

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
      marca: form.marca,
      modelo: form.modelo,
      imei_tablet: form.imei_tablet,
      estado_tablet: toInt(form.estado_tablet),
      estado_equipo: toInt(form.estado_equipo),
      id_area: toInt(form.id_area),
      ticket:form.ticket,
      usuario: toInt(form.usuario),
      ubicacion: form.ubicacion || null,
      observaciones: form.observaciones || null,
      num_chips: toInt(form.num_chips)
    };

    try {
      if (isEdit) {
        await updateTablet(selectedTablet.id_tablet, payload);
      } else {
        await createTablet(payload);
      }
      onSaved?.();
      if (!isEdit) setForm(emptyForm);
    } catch (error) {
      console.error('Error al guardar tablet:', error);
    } finally {
      setLoading(false);
    }
  };

  const estadoTabletLabel =
    estadosEquipo.find((o) => o.id_estado === Number(form.estado_tablet))?.descripcion || '';
  const estadoEquipoLabel =
    asignaciones.find((o) => o.id_asignado === Number(form.estado_equipo))?.descripcion || '';
  const areaLabel = areas.find((a) => a.id_area === Number(form.id_area))?.nombre_area || '';
  const colaboradorLabel =
    colaboradores.find((c) => c.id_colaborador === Number(form.usuario))?.nombre_completo || '';
  const chipLabel = chips.find((c) => c.id_chip === Number(form.num_chips))?.numero_chip || '';

  return (
    <div className="d-flex justify-content-center py-2">
      <FormShell className="modem-form-shell executive-form-shell">
        <DevicePreviewSidebar
          deviceType="Tablet"
          centerIcon="pi pi-mobile"
          centerTitle={form.marca || 'Tablet'}
          centerSubtitle={form.modelo || 'Esperando datos'}
          cards={[
            { id: 'imei', label: 'IMEI', value: form.imei_tablet, icon: 'pi pi-box' },
            { id: 'marca', label: 'Marca', value: form.marca, icon: 'pi pi-tag' },
            { id: 'modelo', label: 'Modelo', value: form.modelo, icon: 'pi pi-mobile' },
            { id: 'estadoModem', label: 'Estado', value: estadoTabletLabel, icon: 'pi pi-cog' },
            { id: 'estadoEquipo', label: 'Asignacion', value: estadoEquipoLabel, icon: 'pi pi-chart-bar' },
            { id: 'area', label: 'Area', value: areaLabel, icon: 'pi pi-map-marker' },
            { id: 'usuario', label: 'Colaborador', value: colaboradorLabel, icon: 'pi pi-users' }
          ]}
          chipLabel={chipLabel}
        />

        <form onSubmit={handleSubmit} className="ui-form-main modem-form-main">
          <div className="ui-form-grid">
            <FormField label="Marca" icon="🏷️">
              <FormInputWithIcon>
                <input
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Modelo" icon="📱">
              <FormInputWithIcon>
                <input
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>
            <FormField label="Ticket" icon="📱">
              <FormInputWithIcon>
                <input
                  name="ticket"
                  value={form.ticket}
                  onChange={handleChange}
                  className="ui-form-input"
                  maxLength={15}
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="IMEI" full icon="🔢">
              <FormInputWithIcon>
                <input
                  name="imei_tablet"
                  value={form.imei_tablet}
                  onChange={handleChange}
                  disabled={isEdit}
                  maxLength={15}
                  required
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estado tablet" icon="⚙️">
              <FormInputWithIcon>
                <Dropdown
                  value={form.estado_tablet !== '' && form.estado_tablet != null ? Number(form.estado_tablet) : null}
                  onChange={(e) => setForm((prev) => ({ ...prev, estado_tablet: e.value ?? '' }))}
                  options={estadosEquipo}
                  optionLabel="descripcion"
                  optionValue="id_estado"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estado equipo" icon="📌">
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
                <input
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Chip asignado" icon="📶">
              <FormInputWithIcon>
                <Dropdown
                  value={form.num_chips !== '' && form.num_chips != null ? Number(form.num_chips) : null}
                  onChange={(e) => setForm((prev) => ({ ...prev, num_chips: e.value ?? '' }))}
                  options={chips}
                  optionLabel="numero_chip"
                  optionValue="id_chip"
                  placeholder="Sin chip"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Observaciones" full icon="📝">
              <FormInputWithIcon>
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

export default TabletForm;
