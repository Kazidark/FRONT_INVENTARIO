import { useEffect, useState } from 'react';
import { createUsuario, updateUsuario } from '../../api/usuarios.api';

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
    <div style={styles.centerWrapper}>
      <div style={styles.shell}>
        {/* ===== PANEL IZQUIERDO ===== */}
        <aside style={styles.side}>
          <h3 style={styles.sideTitle}>
            {selected ? 'Editar usuario' : 'Nuevo usuario'}
          </h3>
          <p style={styles.sideText}>
            Gestión de accesos al sistema
          </p>
        </aside>

        {/* ===== FORMULARIO ===== */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <Field label="Usuario">
              <InputWithIcon icon="👤">
                <input
                  name="usuario"
                  value={form.usuario}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="Correo electrónico">
              <InputWithIcon icon="📧">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="Contraseña">
              <InputWithIcon icon="🔒">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={selected ? '••••••' : ''}
                  required={!selected}
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="Rol">
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Administrador">Administrador</option>
                <option value="Usuario">Usuario</option>
              </select>
            </Field>
          </div>

          {/* ===== ACCIONES ===== */}
          <div style={styles.actions}>
            <button style={styles.submit} disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================
   COMPONENTES AUX
========================= */
const Field = ({ label, children }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    {children}
  </div>
);

const InputWithIcon = ({ icon, children }) => (
  <div style={styles.inputWrapper}>
    <span style={styles.inputIcon}>{icon}</span>
    {children}
  </div>
);

/* =========================
   ESTILOS UNIFICADOS
========================= */
const styles = {
  centerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 0'
  },

  shell: {
    width: '55vw',
    maxWidth: 900,
    minWidth: 720,
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    borderRadius: 24,
    overflow: 'hidden',
    background: '#ffffff',
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
  },

  side: {
    background: 'linear-gradient(180deg,#2563eb,#1e40af)',
    color: '#fff',
    padding: 28
  },

  sideTitle: {
    margin: 0,
    fontWeight: 600
  },

  sideText: {
    marginTop: 10,
    fontSize: 13,
    opacity: 0.85
  },

  form: {
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 22
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151'
  },

  inputWrapper: {
    position: 'relative',
    width: '100%'
  },

  inputIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14,
    opacity: 0.7
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 14px 10px 42px',
    borderRadius: 16,
    border: '1px solid #d1d5db',
    fontSize: 14,
    outline: 'none',
    background: '#fff'
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },

  submit: {
    padding: '14px 40px',
    borderRadius: 999,
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default UsuarioForm;