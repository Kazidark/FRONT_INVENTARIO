import { useEffect, useState } from 'react';
import { createChip, updateChip, getChipById } from '../../../services/api/chips.api';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import {
  getAreas,
  getColaboradores,
  getEstadoChips,
  getOperadores,
  getTipoChip
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
  ticket: '',
  correo_electronico: '',
  observacion: '',
  numero_chip: '',
  iccid: '',
  tipo_chip: '',
  operador: '',
  estado_chip: '',
  area: '',
  usuario: ''
};

const ChipForm = ({ selectedChip, onSaved, onCancel }) => {
  const isEdit = Boolean(selectedChip);
  const [form, setForm] = useState(emptyForm);
  const [areas, setAreas] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [estadosChip, setEstadosChip] = useState([]);
  const [tiposChip, setTiposChip] = useState([]);
  const [loading, setLoading] = useState(false);

  const setValueForm = (data) => {
    setForm({
      numero_chip: data.numero_chip ?? '',
      iccid: data.iccid ?? '',
      tipo_chip: data.tipo_chip ?? '',
      operador: data.operador ?? '',
      estado_chip: data.estado_chip ?? '',
      area: data.area ?? '',
      usuario: data.usuario ?? '',
      ticket: data.ticket ?? '',
      correo_electronico: data.correo_electronico ?? '',
      observacion: data.observacion ?? ''
    });
  };

  /* =========================
     CARGA INICIAL + EDICIÓN
  ========================= */
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [areasData, colaboradoresData, operadoresData, estadosChipData, tiposChipData] = await Promise.all([
          getAreas(),
          getColaboradores(),
          getOperadores(),
          getEstadoChips(),
          getTipoChip()
        ]);
        setAreas(asArray(areasData));
        setColaboradores(asArray(colaboradoresData));
        setOperadores(asArray(operadoresData));
        setEstadosChip(asArray(estadosChipData));
        setTiposChip(asArray(tiposChipData));
      } catch (error) {
        console.error('Error loading catalogs:', error);
        setAreas([]);
        setColaboradores([]);
        setOperadores([]);
        setEstadosChip([]);
        setTiposChip([]);
      }
    };

    loadCatalogs();

    const mode = selectedChip ? 'EDITAR' : 'NUEVO';
    if (mode === 'EDITAR') {
      const chipById = async () => {
        try {
          setLoading(true);
          const dataChip = await getChipById(selectedChip.id_chip);
          setValueForm(dataChip);
        } catch {
          setValueForm(selectedChip);
        } finally {
          setLoading(false);
        }
      };
      chipById();
    } else {
      setForm(emptyForm);
    }
  }, [selectedChip]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const areaOptions = areas
    .map((a) => ({
      label: a.nombre_area ?? a.nombre ?? a.descripcion ?? '',
      value: a.id_area ?? a.id ?? a.nombre_area ?? a.nombre ?? ''
    }))
    .filter((item) => item.label);

  const colaboradorOptions = colaboradores
    .map((c) => ({
      label: c.nombre_completo ?? c.nombre ?? c.descripcion ?? '',
      value: c.id_colaborador ?? c.id ?? c.id_colaborador ?? c.nombre ?? ''
    }))
    .filter((item) => item.label);

  const operadoresOptions = operadores
    .map((o) => ({
      label: o.nombre_operador ?? o.nombre ?? '',
      value: o.id_operador ?? o.id ?? o.nombre_operador ?? o.nombre ?? ''
    }))
    .filter((item) => item.label);

  const estadoChipOptions = estadosChip
    .map((e) => ({
      label: e.nombreChips ?? e.nombre ?? e.descripcion ?? '',
      value: e.id_estadoChip ?? e.id ?? e.id_estadoChip ?? e.nombre ?? ''
    }))
    .filter((item) => item.label);

  const tipoChipOptions = tiposChip
    .map((t) => ({
      label: t.descripcion_tipo_chip ?? t.nombre ?? t.descripcion ?? '',
      value: t.id_tipo_chip ?? t.id ?? ''
    }))
    .filter((item) => item.label);

  /* =========================
     SUBMIT
  ========================= */
  const toInt = (v) => (v === '' || v == null ? null : Number(v));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      numero_chip: form.numero_chip,
      iccid: form.iccid,
      tipo_chip: toInt(form.tipo_chip),
      operador: toInt(form.operador),
      estado_chip: toInt(form.estado_chip),
      area: toInt(form.area),
      usuario: toInt(form.usuario),
      ticket: form.ticket,
      correo_electronico: form.correo_electronico,
      observacion: form.observacion,
    };


    try {
      isEdit
        ? await updateChip(selectedChip.id_chip, payload)
        : await createChip(payload);
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  const sideAreaLabel =areaOptions.find((opt) => String(opt.value) === String(form.area))?.label || '—';
  const sideUserLabel =colaboradorOptions.find((opt) => String(opt.value) === String(form.usuario))?.label ||'Sin colaborador';
  const estadoChipLabel = estadoChipOptions.find((opt) => String(opt.value) === String(form.estado_chip))?.label || '';
  const tipoChipLabel =tipoChipOptions.find((opt) => String(opt.value) === String(form.tipo_chip))?.label || '';
  const operadorLabel =operadoresOptions.find((opt) => String(opt.value) === String(form.operador))?.label || '';

  return (
    <div className="d-flex justify-content-center py-2">
      <FormShell className="modem-form-shell executive-form-shell">
        <DevicePreviewSidebar
          deviceType="Chip"
          centerIcon="pi pi-id-card"
          centerTitle={form.numero_chip || 'Chip'}
          centerSubtitle={operadorLabel || 'Sin operador'}
          cards={[
            { id: 'imei', label: 'Numero', value: form.numero_chip, icon: 'pi pi-hashtag' },
            { id: 'marca', label: 'ICCID', value: form.iccid, icon: 'pi pi-list' },
            { id: 'modelo', label: 'Operador', value: operadorLabel, icon: 'pi pi-send' },
            { id: 'estadoModem', label: 'Estado', value: estadoChipLabel, icon: 'pi pi-cog' },
            { id: 'estadoEquipo', label: 'Tipo', value: tipoChipLabel, icon: 'pi pi-mobile' },
            { id: 'area', label: 'Area', value: sideAreaLabel !== '—' ? sideAreaLabel : '', icon: 'pi pi-map-marker' },
            { id: 'usuario', label: 'Colaborador', value: sideUserLabel !== 'Sin colaborador' ? sideUserLabel : '', icon: 'pi pi-users' }
          ]}
        />

        <form onSubmit={handleSubmit} className="ui-form-main modem-form-main">
          <div className="ui-form-grid">
            <FormField label="Numero de chip" icon={<i className="pi pi-hashtag" />}>
              <FormInputWithIcon>
                <input
                  id="numero_chip"
                  name="numero_chip"
                  value={form.numero_chip}
                  onChange={handleChange}
                  disabled={isEdit}
                  required
                  maxLength={9}
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="ICCID" full icon={<i className="pi pi-barcode" />}>
              <FormInputWithIcon>
                <input
                  id="iccid"
                  name="iccid"
                  value={form.iccid}
                  onChange={handleChange}
                  required
                  maxLength={15}
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Operador" icon={<i className="pi pi-send" />}>
              <FormInputWithIcon>
              <Dropdown
              value={form.operador}
              onChange={(e) => setForm((prev) => ({ ...prev, operador: e.value ?? '' }))}
              options={operadoresOptions}
              optionLabel="label"
              optionValue="value"
              placeholder={operadoresOptions.length ? 'Seleccione' : 'Sin operadores'}
              className="w-100 ui-form-input-control"
              />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Estado del chip" icon={<i className="pi pi-cog" />}>
              <FormInputWithIcon>
                <Dropdown
                  id="estado_chip"
                  value={form.estado_chip}
                  onChange={(e) => setForm((prev) => ({ ...prev, estado_chip: e.value ?? '' }))}
                  options={estadoChipOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder={estadoChipOptions.length ? 'Seleccione' : 'Sin estados'}
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Area" icon={<i className="pi pi-building" />}>
              <FormInputWithIcon>
                <Dropdown
                  id="area"
                  value={form.area}
                  onChange={(e) => setForm((prev) => ({ ...prev, area: e.value ?? '' }))}
                  options={areaOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder={areaOptions.length ? 'Seleccione' : 'Sin áreas'}
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Colaborador" icon={<i className="pi pi-user" />}>
              <FormInputWithIcon>
              <Dropdown
              value={form.usuario}
              onChange={(e) => setForm((prev) => ({ ...prev, usuario: e.value ?? '' }))}
              options={colaboradorOptions}
              optionLabel="label"
              optionValue="value"
              placeholder={colaboradorOptions.length ? 'Seleccione' : 'Sin colaboradores'}
              className="w-100 ui-form-input-control"
              />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Tipo de chip" icon={<i className="pi pi-mobile" />}>
              <FormInputWithIcon>
                <Dropdown
                  id="tipo_chip"
                  value={form.tipo_chip}
                  onChange={(e) => setForm((prev) => ({ ...prev, tipo_chip: e.value ?? '' }))}
                  options={tipoChipOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder={tipoChipOptions.length ? 'Seleccione' : 'Sin tipos'}
                  className="w-100 ui-form-input-control"
                />
              </FormInputWithIcon>
            </FormField>
            <FormField label="Ticket" icon={<i className="pi pi-ticket" />}>
              <FormInputWithIcon>
              <InputText
              value={form.ticket}
              onChange={(e) => setForm((prev) => ({ ...prev, ticket: e.target.value ?? '' }))}
              placeholder="Ingrese el ticket"
              className="w-100 ui-form-input-control"
              ></InputText>
              </FormInputWithIcon>
            </FormField>
            <FormField label="Correo Electronico" icon={<i className="pi pi-envelope" />}>
              <FormInputWithIcon>
                <InputText
                value={form.correo_electronico}
                onChange={(e) => setForm((prev) => ({ ...prev, correo_electronico: e.target.value ?? '' }))}
                placeholder="Ingrese el correo electronico"
                className="w-100 ui-form-input-control"
                ></InputText>
              </FormInputWithIcon>
            </FormField>
            <FormField label="Observaciones" icon={<i className="pi pi-comment" />}>
              <FormInputWithIcon>
              <InputTextarea 
              value={form.observacion}
              onChange={(e) => setForm((prev) => ({ ...prev, observacion: e.target.value ?? '' }))}
              placeholder="Ingrese el correo electronico"
              className="w-100 ui-form-input-control"
              />
              </FormInputWithIcon>
            </FormField>
          </div>

          <FormActions>
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar chip'}
            </button>
          </FormActions>
        </form>
      </FormShell>
    </div>
  );
};

export default ChipForm;
