import { useEffect, useState } from 'react';
import { createUsuario, updateUsuario } from '../../../services/api/usuarios.api';
import FormShell from '../../../shared/components/ui/form/FormShell';
import FormHeader from '../../../shared/components/ui/form/FormHeader';
import FormField from '../../../shared/components/ui/form/FormField';
import FormActions from '../../../shared/components/ui/form/FormActions';
import FormInputWithIcon from '../../../shared/components/ui/form/FormInputWithIcon';

const emptyForm = {
  usuario: '',
  email: '',
  password: '',
  rol: 'Usuario'
};

const UsuarioForm = ({ selected, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        usuario: selected.usuario || '',
        email: selected.email || '',
        password: '',
        rol: selected.rol || 'Usuario'
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
      selected
        ? await updateUsuario(selected.id_usuario, form)
        : await createUsuario(form);
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center py-2">
      <FormShell>
        <FormHeader
          title={selected ? 'Editar usuario' : 'Nuevo usuario'}
          info={[
            { label: 'Rol', value: form.rol || '—' },
            { label: 'Correo', value: form.email || '—' }
          ]}
          gradient="linear-gradient(180deg,#36ad55,#115e59)"
        />

        <form onSubmit={handleSubmit} className="ui-form-main">
          <div className="ui-form-grid">
            <FormField label="Usuario">
              <FormInputWithIcon icon="👤">
                <input
                  name="usuario"
                  value={form.usuario}
                  onChange={handleChange}
                  required
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Correo electrónico">
              <FormInputWithIcon icon="📧">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Contraseña">
              <FormInputWithIcon icon="🔒">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={selected ? '••••••' : ''}
                  required={!selected}
                  className="ui-form-input"
                />
              </FormInputWithIcon>
            </FormField>

            <FormField label="Rol">
              <FormInputWithIcon icon="🛡️">
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  className="ui-form-input"
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Usuario">Usuario</option>
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

export default UsuarioForm;
