import { useEffect, useState } from 'react';
import { createColaborador, updateColaborador } from '../../api/colaboradores.api';


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

      alert('✅ Colaborador guardado correctamente');
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.centerWrapper}>
      <div style={styles.shell}>
        <aside style={styles.side}>
          <h3>{isEdit ? 'Editar colaborador' : 'Nuevo colaborador'}</h3>
        </aside>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <Field label="Nombre completo">
              <input
                name="nombre_completo"
                value={form.nombre_completo}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </Field>

            <Field label="Documento">
              <input
                name="documento"
                value={form.documento}
                onChange={handleChange}
                required
                disabled={isEdit}
                style={{
                  ...styles.input,
                  ...(isEdit ? styles.inputDisabled : {})
                }}
              />
            </Field>

            <Field label="Email">
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
              />
            </Field>
          </div>

          <div style={styles.actions}>
            <button type="submit" style={styles.submit} disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    {children}
  </div>
);

const styles = {
  centerWrapper: { display: 'flex', justifyContent: 'center', padding: 20 },
  shell: {
    width: '720px',
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    background: '#fff'
  },
  side: {
    background: 'linear-gradient(180deg,#2563eb,#1e40af)',
    color: '#fff',
    padding: 28
  },
  form: { padding: 28 },
  grid: { display: 'grid', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600 },
  input: {
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid #d1d5db'
  },
  inputDisabled: {
    background: '#f3f4f6',
    cursor: 'not-allowed'
  },
  actions: { display: 'flex', justifyContent: 'flex-end' },
  submit: {
    background: '#2563eb',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 999,
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default ColaboradorForm;
