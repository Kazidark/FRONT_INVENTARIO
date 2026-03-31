import React, { useEffect, useState } from 'react';
import { getColaboradores } from '../../../services/api/colaboradores.api';
import { getAreas } from '../../../services/api/areas.api';
import { getModemsDisponibles } from '../../../services/api/modems.api';
import { getChipsDisponibles } from '../../../services/api/chips.api';
import { crearAsignacion } from '../../../services/api/asignaciones.api';
import FormShell from '../../../shared/components/ui/form/FormShell';
import FormHeader from '../../../shared/components/ui/form/FormHeader';
import FormField from '../../../shared/components/ui/form/FormField';
import FormActions from '../../../shared/components/ui/form/FormActions';
import FormInputWithIcon from '../../../shared/components/ui/form/FormInputWithIcon';
import { toast } from 'react-hot-toast';


const emptyForm = {
  id_colaborador: '',
  id_area: '',
  id_modem: '',
  id_chip: ''
};

const AsignacionForm = ({ onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [colaboradores, setColaboradores] = useState([]);
  const [areas, setAreas] = useState([]);
  const [modems, setModems] = useState([]);
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getColaboradores().then(setColaboradores);
    getAreas().then(setAreas);
    getModemsDisponibles().then(setModems);
    getChipsDisponibles().then(setChips);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await crearAsignacion({
        id_colaborador: Number(form.id_colaborador),
        id_area: Number(form.id_area),
        id_modem: form.id_modem ? Number(form.id_modem) : null,
        id_chip: form.id_chip ? Number(form.id_chip) : null
      });

      toast.success('Asignacion guardada correctamente');
      onSaved();
    } catch (error) {
      console.error(error);
      toast.error('Error al asignar equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center py-2">
      <FormShell>
        <FormHeader
          title="Nueva asignación"
          info={[
            {
              label: 'Colaborador',
              value: colaboradores.find((c) => c.id_colaborador === Number(form.id_colaborador))?.nombre_completo || '—'
            },
            {
              label: 'Área',
              value: areas.find((a) => a.id_area === Number(form.id_area))?.nombre_area || '—'
            }
          ]}
          gradient="linear-gradient(180deg,#36ad55,#115e59)"
        />

        <form onSubmit={handleSubmit} className="ui-form-main">
          <div className="ui-form-grid">
            <FormField label="Colaborador">
              <FormInputWithIcon icon="👤">
                <select
                  name="id_colaborador"
                  value={form.id_colaborador}
                  onChange={handleChange}
                  required
                  className="ui-form-input"
                >
                  <option value="">Seleccione</option>
                  {colaboradores.map((c) => (
                    <option key={c.id_colaborador} value={c.id_colaborador}>
                      {c.nombre_completo}
                    </option>
                  ))}
                </select>
              </FormInputWithIcon>
            </FormField>

            <FormField label="Área">
              <FormInputWithIcon icon="🏢">
                <select
                  name="id_area"
                  value={form.id_area}
                  onChange={handleChange}
                  required
                  className="ui-form-input"
                >
                  <option value="">Seleccione</option>
                  {areas.map((a) => (
                    <option key={a.id_area} value={a.id_area}>
                      {a.nombre_area}
                    </option>
                  ))}
                </select>
              </FormInputWithIcon>
            </FormField>

            <FormField label="Módem">
              <FormInputWithIcon icon="📡">
                <select
                  name="id_modem"
                  value={form.id_modem}
                  onChange={handleChange}
                  className="ui-form-input"
                >
                  <option value="">Sin asignar</option>
                  {modems.map((m) => (
                    <option key={m.id_modem} value={m.id_modem}>
                      {m.imei_modem}
                    </option>
                  ))}
                </select>
              </FormInputWithIcon>
            </FormField>

            <FormField label="Chip">
              <FormInputWithIcon icon="📶">
                <select
                  name="id_chip"
                  value={form.id_chip}
                  onChange={handleChange}
                  className="ui-form-input"
                >
                  <option value="">Sin asignar</option>
                  {chips.map((c) => (
                    <option key={c.id_chip} value={c.id_chip}>
                      {c.numero_chip}
                    </option>
                  ))}
                </select>
              </FormInputWithIcon>
            </FormField>
          </div>

          <FormActions>
            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={loading}>
              {loading ? 'Asignando…' : 'Guardar asignación'}
            </button>
          </FormActions>
        </form>
      </FormShell>
    </div>
  );
};

export default AsignacionForm;
