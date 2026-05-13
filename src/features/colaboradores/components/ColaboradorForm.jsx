import { useEffect, useState } from 'react';
import * as colaboradoresApi from '../../../services/api/colaboradores.api';
import FormShell from '../../../shared/components/ui/form/FormShell';
import FormHeader from '../../../shared/components/ui/form/FormHeader';
import FormField from '../../../shared/components/ui/form/FormField';
import FormActions from '../../../shared/components/ui/form/FormActions';
import FormInputWithIcon from '../../../shared/components/ui/form/FormInputWithIcon';
import { toast } from 'react-hot-toast';

const emptyForm = {
  nombre_completo: '',
  email: '',
  activo: true
};

const ColaboradorForm = ({ selected, onSaved }) => {
  const { createColaborador, updateColaborador } = colaboradoresApi;
  const isEdit = Boolean(selected);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      const activoFromApi = selected.activo;
      const normalizedActivo =
        activoFromApi === true ||
        activoFromApi === 1 ||
        activoFromApi === '1';

      setForm({
        nombre_completo: selected.nombre_completo || '',
        email: selected.email || '',
        activo: normalizedActivo
      });
    } else {
      setForm(emptyForm);
    }
  }, [selected]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'activo') {
      setForm({ ...form, activo: value === 'true' });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nombre_completo: form.nombre_completo?.trim(),
        email: form.email?.trim(),
        activo: form.activo ? 1 : 0
      };

      if (isEdit && typeof updateColaborador === 'function') {
        await updateColaborador(selected.id_colaborador, payload);
      } else {
        await createColaborador(payload);
      }

      toast.success('Colaborador guardado correctamente');
      onSaved();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo guardar el colaborador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center py-2">
      <FormShell>
        <FormHeader
          title={isEdit ? 'Editar colaborador' : 'Nuevo colaborador'}
          info={[
            { label: 'Estado', value: form.activo ? 'Activo' : 'Cesado' },
            { label: 'Correo', value: form.email || '—' }
          ]}
          gradient="linear-gradient(180deg,#36ad55,#115e59)"
        />

        <form onSubmit={handleSubmit} className="ui-form-main">
          <div className="ui-form-grid">
            <FormField label="Nombre" full icon="👤">
              <FormInputWithIcon>
                <input
                  name="nombre_completo"
                  value={form.nombre_completo}
                  onChange={handleChange}
                  required
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Correo" icon="📧">
              <FormInputWithIcon>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Cesado" icon="📌">
              <FormInputWithIcon>
                <select
                  name="activo"
                  value={String(form.activo)}
                  onChange={handleChange}
                  className="ui-form-input"
                >
                  <option value="true">No</option>
                  <option value="false">Si</option>
                </select>
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

export default ColaboradorForm;
