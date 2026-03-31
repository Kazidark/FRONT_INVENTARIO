import { useEffect, useState } from 'react';
import { createCelular, getCelularById, updateCelular } from '../../../services/api/celulares.api';
import {
  getAreas,
  getAsignacion,
  getColaboradores,
  getEstadoEquipo
} from '../../../services/api/transvesalMaestro/transversal';
import { getChipsDisponibles } from '../../../services/api/chips.api';
import { Dropdown } from 'primereact/dropdown';
import FormShell from '../../../shared/components/ui/form/FormShell';
import FormField from '../../../shared/components/ui/form/FormField';
import FormActions from '../../../shared/components/ui/form/FormActions';
import FormInputWithIcon from '../../../shared/components/ui/form/FormInputWithIcon';
import DevicePreviewSidebar from '../../../shared/components/ui/form/DevicePreviewSidebar';
import '../../modems/components/ModemForm.css';

const emptyForm = {
  marca: '',
  modelo: '',
  imei_celular: '',
  estado_celular: '',
  estado_equipo: '',
  id_area: '',
  usuario: '',
  numero_chip: ''
};

const CelularForm = ({ selectedCelular, onSaved, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [areas, setAreas] = useState([]);
  const [chips, setChips] = useState([]);
  const [asignacion, setAsignacion] = useState([]);
  const [estadoEquipoCatalog, setEstadoEquipoCatalog] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(selectedCelular);

  const setValueForm = (data) => {
    setForm({
      marca: data.marca ?? '',
      modelo: data.modelo ?? '',
      imei_celular: data.imei_celular ?? '',
      estado_celular: data.estado_celular ?? '',
      estado_equipo: data.estado_equipo ?? '',
      id_area: data.id_area ?? '',
      usuario: data.usuario ?? '',
      numero_chip: data.numero_chip ?? ''
    });
  };

  /* =========================
     CARGA INICIAL + EDICIÓN
  ========================= */
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [areasData, colaboradoresData, asignacionData, chipsData, estadoEquipoData] = await Promise.all([
          getAreas(),
          getColaboradores(),
          getAsignacion(),
          getChipsDisponibles(),
          getEstadoEquipo()
        ]);

        setAreas(Array.isArray(areasData) ? areasData : []);
        setColaboradores(Array.isArray(colaboradoresData) ? colaboradoresData : []);
        setAsignacion(Array.isArray(asignacionData) ? asignacionData : []);
        setChips(Array.isArray(chipsData) ? chipsData : []);
        setEstadoEquipoCatalog(Array.isArray(estadoEquipoData) ? estadoEquipoData : []);
      } catch (error) {
        console.error('Error loading catalogs:', error);
        setAreas([]);
        setColaboradores([]);
        setAsignacion([]);
        setChips([]);
        setEstadoEquipoCatalog([]);
      }
    };

    loadCatalogs();

    const mode = selectedCelular ? 'EDITAR' : 'NUEVO';
    if (mode === 'EDITAR') {
      const celularById = async () => {
        try {
          setLoading(true);
          const dataCelular = await getCelularById(selectedCelular.id_celular);
          setValueForm(dataCelular);
        } catch {
          setValueForm(selectedCelular);
        } finally {
          setLoading(false);
        }
      };
      celularById();
    } else {
      setForm(emptyForm);
    }
  }, [selectedCelular]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toInt = (v) => (v === '' || v == null ? null : Number(v));

    const payload = {
      marca: form.marca,
      modelo: form.modelo,
      imei_celular: form.imei_celular,
      estado_celular: toInt(form.estado_celular),
      estado_equipo: toInt(form.estado_equipo),
      id_area: toInt(form.id_area),
      usuario: toInt(form.usuario),
      numero_chip: toInt(form.numero_chip),
    };

    try {
      if (isEditMode) {
        await updateCelular(selectedCelular.id_celular, payload);
      } else {
        await createCelular(payload);
      }
      onSaved?.();
      if (!isEditMode) setForm(emptyForm);
    } catch (error) {
      console.error('Error al guardar celular:', error);
    } finally {
      setLoading(false);
    }
  };

  const estadoCelularLabel =
    estadoEquipoCatalog.find((item) => item.id_estado === Number(form.estado_celular))?.descripcion || '';
  const estadoEquipoLabel =
    asignacion.find((item) => item.id_asignado === Number(form.estado_equipo))?.descripcion || '';
  const areaLabel = areas.find((a) => a.id_area === Number(form.id_area))?.nombre_area || '';
  const colaboradorLabel =
    colaboradores.find((c) => c.id_colaborador === Number(form.usuario))?.nombre_completo || '';
  const chipLabel = chips.find((c) => c.id_chip === Number(form.numero_chip))?.numero_chip || '';

  return (
    <div className="d-flex justify-content-center py-2">
      <FormShell className="modem-form-shell">
        <DevicePreviewSidebar
          deviceType="Celular"
          centerIcon="pi pi-mobile"
          centerTitle={form.marca || 'Celular'}
          centerSubtitle={form.modelo || 'Esperando datos'}
          cards={[
            { id: 'imei', label: 'IMEI', value: form.imei_celular, icon: 'pi pi-box' },
            { id: 'marca', label: 'Marca', value: form.marca, icon: 'pi pi-tag' },
            { id: 'modelo', label: 'Modelo', value: form.modelo, icon: 'pi pi-bolt' },
            { id: 'estadoModem', label: 'Estado', value: estadoCelularLabel, icon: 'pi pi-cog' },
            { id: 'estadoEquipo', label: 'Asignacion', value: estadoEquipoLabel, icon: 'pi pi-chart-bar' },
            { id: 'area', label: 'Area', value: areaLabel, icon: 'pi pi-map-marker' },
            { id: 'usuario', label: 'Colaborador', value: colaboradorLabel, icon: 'pi pi-users' }
          ]}
          chipLabel={chipLabel}
        />

        <form onSubmit={handleSubmit} className="ui-form-main modem-form-main">
          <div className="ui-form-grid">
            <FormField label="IMEI" full>
              <FormInputWithIcon icon="🔢">
                <input
                  name="imei_celular"
                  value={form.imei_celular}
                  onChange={handleChange}
                  disabled={isEditMode}
                  maxLength={15}
                  required
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
              <FormInputWithIcon icon="📱">
                <input
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estado celular">
              <FormInputWithIcon icon="⚙️">
                <Dropdown
                  value={form.estado_celular !== '' && form.estado_celular != null ? Number(form.estado_celular) : null}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, estado_celular: e.value ?? '' }))
                  }
                  options={estadoEquipoCatalog}
                  optionLabel="descripcion"
                  optionValue="id_estado"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estado equipo">
              <FormInputWithIcon icon="📍">
                <Dropdown
                  value={form.estado_equipo !== '' && form.estado_equipo != null ? Number(form.estado_equipo) : null}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, estado_equipo: e.value ?? '' }))
                  }
                  options={asignacion}
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
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, id_area: e.value ?? '' }))
                  }
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
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, usuario: e.value ?? '' }))
                  }
                  options={colaboradores}
                  optionLabel="nombre_completo"
                  optionValue="id_colaborador"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Chip asignado">
              <FormInputWithIcon icon="📶">
                <Dropdown
                  value={form.numero_chip !== '' && form.numero_chip != null ? Number(form.numero_chip) : null}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, numero_chip: e.value ?? '' }))
                  }
                  options={chips}
                  optionLabel="numero_chip"
                  optionValue="id_chip"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
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

export default CelularForm;
