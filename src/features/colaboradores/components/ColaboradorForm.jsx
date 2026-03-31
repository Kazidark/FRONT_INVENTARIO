import { useEffect, useState } from 'react';
import { createColaborador, updateColaborador } from '../../../services/api/colaboradores.api';
import FormShell from '../../../shared/components/ui/form/FormShell';
import FormHeader from '../../../shared/components/ui/form/FormHeader';
import FormField from '../../../shared/components/ui/form/FormField';
import FormActions from '../../../shared/components/ui/form/FormActions';
import FormInputWithIcon from '../../../shared/components/ui/form/FormInputWithIcon';
import { toast } from 'react-hot-toast';

const emptyForm = {
  nombre_completo: '',
  documento: '',
  email: ''
};

const ColaboradorForm = ({ selected, onSaved }) => {
  const isEdit = Boolean(selected);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        nombre_completo: selected.nombre_completo || '',
        documento: selected.documento || '',
        email: selected.email || ''
      });
    } else {
      setForm(emptyForm);
    }
  }, [selected]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      isEdit
        ? await updateColaborador(selected.id_colaborador, form)
        : await createColaborador(form);

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
            { label: 'Documento', value: form.documento || '—' },
            { label: 'Correo', value: form.email || '—' }
          ]}
          gradient="linear-gradient(180deg,#36ad55,#115e59)"
        />

        <form onSubmit={handleSubmit} className="ui-form-main">
          <div className="ui-form-grid">
            <FormField label="Nombre completo" full>
              <FormInputWithIcon icon="👤">
                <input
                  name="nombre_completo"
                  value={form.nombre_completo}
                  onChange={handleChange}
                  required
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Documento">
              <FormInputWithIcon icon="🪪">
                <input
                  name="documento"
                  value={form.documento}
                  onChange={handleChange}
                  required
                  disabled={isEdit}
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Email">
              <FormInputWithIcon icon="📧">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="ui-form-input"
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

export default ColaboradorForm;
