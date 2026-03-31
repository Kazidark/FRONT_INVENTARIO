import React, { useEffect, useState } from 'react';
import { createModem, GetModemsById, updateModem } from '../../../services/api/modems.api';
import {
  getAreas,
  getAsignacion,
  getColaboradores,
  getEstadoEquipo
} from '../../../services/api/transvesalMaestro/transversal';
import { getChipsDisponibles } from '../../../services/api/chips.api';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import FormShell from '../../../shared/components/ui/form/FormShell';
import FormField from '../../../shared/components/ui/form/FormField';
import FormActions from '../../../shared/components/ui/form/FormActions';
import FormInputWithIcon from '../../../shared/components/ui/form/FormInputWithIcon';
import DevicePreviewSidebar from '../../../shared/components/ui/form/DevicePreviewSidebar';
import './ModemForm.css';

const emptyForm = {
  marca: '',
  modelo: '',
  imei_modem: '',
  estado_modem: '',
  estado_equipo: '',
  id_area: '',
  usuario: '',
  id_chip: ''
};

const ModemForm = ({ selectedModem, onSaved, onCancel }) => {

  const [form, setForm] = useState(emptyForm);
  const [areas, setAreas] = useState([]);
  const [chips, setChips] = useState([]);
  const [asignacion, setAsignacion] = useState([]);
  const [estadoEquipoCatalog, setEstadoEquipoCatalog] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(selectedModem);


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

        setAreas(areasData);
        setColaboradores(Array.isArray(colaboradoresData) ? colaboradoresData : []);
        setAsignacion(Array.isArray(asignacionData) ? asignacionData : []);
        setChips(Array.isArray(chipsData) ? chipsData : []);
        setEstadoEquipoCatalog(Array.isArray(estadoEquipoData) ? estadoEquipoData : []);
      } catch (error) {
        console.error('Error loading catalogs:', error);
        setAreas([]);
        setAsignacion([]);
        setColaboradores([]);
        setChips([]);
        setEstadoEquipoCatalog([]);
      }
    };

    loadCatalogs();

     const mode = selectedModem ? 'EDITAR' : 'NUEVO';
     // console.log(`Modo abierto: ${mode}`);
     if (mode == 'EDITAR') {
       
       const modemById = async () => {
         const dataModeId = await GetModemsById(selectedModem.id_modem)
         // console.log(dataModeId[0]);
         setValurfrom(dataModeId[0]);
        }
        modemById();
       
    } else {
      setForm(emptyForm);
       
    }

  }, [selectedModem]);


   /**
    * seteo de  valores  del formualrio
   */
  const resolveEstadoModemId = (value, catalog) => {
    if (value == null || value === '') return '';
    const asNumber = Number(value);
    if (!Number.isNaN(asNumber)) return asNumber;

    const found = (catalog || []).find(
      (item) =>
        String(item.descripcion ?? '')
          .trim()
          .toLowerCase() === String(value).trim().toLowerCase(),
    );

    return found?.id_estado ?? '';
  };
  /**
   * sete valore de editar
  */
  const setValurfrom = (data) => {
    // console.log(data);
    setForm({
      marca: data.marca,
      modelo: data.modelo,
      imei_modem: data.imei_modem,
      estado_modem: resolveEstadoModemId(data.estado_modem, estadoEquipoCatalog),
      estado_equipo: data.estado_equipo,
      id_area: data.id_area ? String(data.id_area) : '',
      usuario: data.usuario,
      id_chip: data.id_chip
    });
  }



  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toOptions = (items, getLabel, getValue, firstOption) => {
    const options = Array.isArray(items)
      ? items
          .map((item) => ({
            label: getLabel(item),
            value: getValue(item)
          }))
          .filter((option) => option.label != null && option.label !== '')
      : [];

    return firstOption ? [firstOption, ...options] : options;
  };

  const estadoModemOptions = toOptions(
    estadoEquipoCatalog,
    (item) => item.descripcion,
    (item) => item.id_estado
  );

  useEffect(() => {
    if (!selectedModem) return;

    setForm((prev) => {
      if (prev.estado_modem == null || prev.estado_modem === '') return prev;
      if (!Number.isNaN(Number(prev.estado_modem))) return prev;

      const mappedId = resolveEstadoModemId(prev.estado_modem, estadoEquipoCatalog);
      if (mappedId === '') return prev;
      return { ...prev, estado_modem: mappedId };
    });
  }, [estadoEquipoCatalog, selectedModem]);

  const colaboradorOptions = toOptions(
    colaboradores,
    (c) => c.nombre_completo,
    (c) => c.id_colaborador,
    { label: '— Sin colaborador —', value: '' }
  );

  const asignacionOptions = toOptions(
    asignacion,
    (a) => a.descripcion,
    (a) => a.id_asignado,
    { label: 'Sin asignación', value: '' }
  );

  const chipOptions = toOptions(
    chips,
    (c) => c.numero_chip,
    (c) => c.id_chip,
    { label: 'Sin chip', value: '' }
  );

  const estadoModemLabel =
    estadoEquipoCatalog.find((item) => Number(item.id_estado) === Number(form.estado_modem))
      ?.descripcion || '—';
  const estadoEquipoLabel =
    asignacionOptions.find((item) => String(item.value) === String(form.estado_equipo))?.label ||
    'Sin asignacion';
  const areaLabel =
    areas.find((a) => Number(a.id_area) === Number(form.id_area))?.nombre_area || '—';
  const colaboradorLabel =
    colaboradorOptions.find((item) => String(item.value) === String(form.usuario))?.label ||
    'Sin colaborador';
  const chipLabel =
    chipOptions.find((item) => String(item.value) === String(form.id_chip))?.label || 'Sin chip';

  const previewCards = [
    { id: 'imei', label: 'IMEI', value: form.imei_modem, icon: 'pi pi-box' },
    { id: 'marca', label: 'Marca', value: form.marca, icon: 'pi pi-tag' },
    { id: 'modelo', label: 'Modelo', value: form.modelo, icon: 'pi pi-bolt' },
    {
      id: 'estadoModem',
      label: 'Estado modem',
      value: form.estado_modem ? estadoModemLabel : '',
      icon: 'pi pi-cog'
    },
    {
      id: 'estadoEquipo',
      label: 'Estado equipo',
      value: form.estado_equipo ? estadoEquipoLabel : '',
      icon: 'pi pi-chart-bar'
    },
    {
      id: 'area',
      label: 'Area',
      value: form.id_area ? areaLabel : '',
      icon: 'pi pi-map-marker'
    },
    {
      id: 'usuario',
      label: 'Colaborador',
      value: form.usuario ? colaboradorLabel : '',
      icon: 'pi pi-users'
    }
  ];

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      estado_modem:
        form.estado_modem !== '' && form.estado_modem != null
          ? Number(form.estado_modem)
          : null,
      estado_equipo:
        form.estado_equipo !== '' && form.estado_equipo != null
          ? Number(form.estado_equipo)
          : null,
      id_area: form.id_area ? Number(form.id_area) : null,
      usuario: form.usuario ? String(form.usuario) : null,
      id_chip: form.id_chip ? Number(form.id_chip) : null
    };

    try {
      if (isEditMode) {
        await updateModem(selectedModem.id_modem, payload);
      } else {
        await createModem(payload);
      }

      onSaved?.();
      if (!isEditMode) setForm(emptyForm);
    } catch (error) {
      console.error('Error al guardar módem:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center py-2 modem-form-page">
      <FormShell className="modem-form-shell">
        <DevicePreviewSidebar
          deviceType="Modem"
          centerIcon="pi pi-mobile"
          centerTitle={form.marca || 'Dispositivo'}
          centerSubtitle={form.modelo || 'Esperando datos'}
          cards={previewCards}
          chipLabel={String(form.id_chip || '').trim() !== '' ? chipLabel : ''}
        />

        <form onSubmit={handleSubmit} className="ui-form-main modem-form-main">
          <div className="ui-form-grid">
            <FormField label="Marca">
              <FormInputWithIcon icon={<i className="pi pi-tag" />}>
                <InputText
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                  
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Modelo">
              <FormInputWithIcon icon={<i className="pi pi-mobile" />}>
                <InputText
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="IMEI del módem" full>
              <FormInputWithIcon icon={<i className="pi pi-hashtag" />}>
                <InputText
                  name="imei_modem"
                  value={form.imei_modem}
                  onChange={handleChange}
                  disabled={!!selectedModem}
                  required
                   maxLength={15}
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estado del módem">
              <FormInputWithIcon icon={<i className="pi pi-cog" />}>
                <Dropdown
                  value={form.estado_modem}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      estado_modem: e.value ?? ''
                    }))
                  }
                  options={estadoModemOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estado del equipo">
              <FormInputWithIcon icon={<i className="pi pi-map-marker" />}>
                <Dropdown
                  value={form.estado_equipo}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      estado_equipo: e.value ?? ''
                    }))
                  }
                  options={asignacionOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Área">
              <FormInputWithIcon icon={<i className="pi pi-building" />}>
                <Dropdown
                  value={form.id_area ? Number(form.id_area) : null}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      id_area: e.value != null ? String(e.value) : ''
                    }))
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
              <FormInputWithIcon icon={<i className="pi pi-user" />}>
                <Dropdown
                  value={form.usuario}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      usuario: e.value ?? ''
                    }))
                  }
                  options={colaboradorOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Chip asignado">
              <FormInputWithIcon icon={<i className="pi pi-sim-card" />}>
                <Dropdown
                  value={form.id_chip === '' ? '' : Number(form.id_chip)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      id_chip: e.value != null && e.value !== '' ? String(e.value) : ''
                    }))
                  }
                  options={chipOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione"
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>
          </div>

          <FormActions>
            <Button
              type="submit"
              label={loading ? 'Guardando…' : isEditMode ? 'Editar' : 'Guardar'}
              loading={loading}
              icon="pi pi-check"
              className="modem-form-btn modem-form-btn-primary"
              disabled={loading}
            />
            <Button
              type="button"
              label="Cerrar"
              icon="pi pi-times"
              outlined
              className="modem-form-btn modem-form-btn-secondary"
              onClick={() => onCancel?.()}
              disabled={loading}
            />
          </FormActions>
        </form>
      </FormShell>
    </div>
  );
};

export default ModemForm;
