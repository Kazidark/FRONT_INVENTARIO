import { useEffect, useState } from 'react';
import { createMonitor, updateMonitor } from '../../api/monitores.api';
import { getAreas } from '../../api/areas.api';
import { getColaboradores } from '../../api/colaboradores.api';

const emptyForm = {
  serie: '',
  marca: '',
  modelo: '',
  estado_monitor: 'Operativo',
  status_monitor: 'Vigente',
  id_area: '',
  usuario: '',
  ubicacion: '',
  observaciones: '',
  anexo: ''
};

const MonitoresForm = ({ selected, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [areas, setAreas] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     CARGA INICIAL
  ========================= */
  useEffect(() => {
    getAreas().then(d => setAreas(Array.isArray(d) ? d : []));
    getColaboradores().then(d =>
      setColaboradores(Array.isArray(d) ? d : [])
    );
  }, []);

  /* =========================
     CARGA EDICIÓN
  ========================= */
  useEffect(() => {
    if (!selected) {
      setForm(emptyForm);
      return;
    }

    setForm({
      serie: selected.serie || '',
      marca: selected.marca || '',
      modelo: selected.modelo || '',
      estado_monitor: selected.estado_monitor || 'Operativo',
      status_monitor: selected.status_monitor || 'Vigente',
      id_area: selected.id_area || '',
      usuario: selected.usuario || '',
      ubicacion: selected.ubicacion || '',
      observaciones: selected.observaciones || '',
      anexo: selected.anexo || ''
    });
  }, [selected]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      selected
        ? await updateMonitor(selected.id_monitor, form)
        : await createMonitor(form);
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.centerWrapper}>
      <div style={styles.shell}>
        {/* PANEL IZQUIERDO */}
        <aside style={styles.side}>
          <h3 style={styles.sideTitle}>
            {selected ? 'Editar Monitor' : 'Nuevo Monitor'}
          </h3>
          <p style={styles.sideText}>
            Gestión de monitores del sistema
          </p>
        </aside>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <Field label="Serie" full>
              <InputWithIcon icon="🔢">
                <input
                  name="serie"
                  value={form.serie}
                  onChange={handleChange}
                  disabled={!!selected}
                  required
                  style={{
                    ...styles.input,
                    ...(selected ? styles.inputDisabled : {})
                  }}
                />
              </InputWithIcon>
            </Field>

            <Field label="Marca">
              <InputWithIcon icon="🏷️">
                <input
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="Modelo">
              <InputWithIcon icon="📺">
                <input
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="Estado del Monitor">
              <InputWithIcon icon="⚙️">
                <select
                  name="estado_monitor"
                  value={form.estado_monitor}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Operativo</option>
                  <option>Inoperativo</option>
                </select>
              </InputWithIcon>
            </Field>

            <Field label="Estatus">
              <InputWithIcon icon="📌">
                <select
                  name="status_monitor"
                  value={form.status_monitor}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Vigente</option>
                  <option>Vencido</option>
                  <option>Donado</option>
                </select>
              </InputWithIcon>
            </Field>

            <Field label="Área">
              <InputWithIcon icon="🏢">
                <select
                  name="id_area"
                  value={form.id_area}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Seleccione</option>
                  {areas.map(a => (
                    <option key={a.id_area} value={a.id_area}>
                      {a.nombre_area}
                    </option>
                  ))}
                </select>
              </InputWithIcon>
            </Field>

            {/* 👤 COLABORADOR */}
            <Field label="Colaborador">
              <InputWithIcon icon="👤">
                <select
                  name="usuario"
                  value={form.usuario}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">— Sin colaborador —</option>
                  {colaboradores.map(c => (
                    <option
                      key={c.id_colaborador}
                      value={c.nombre_completo}
                    >
                      {c.nombre_completo}
                    </option>
                  ))}
                </select>
              </InputWithIcon>
            </Field>

            <Field label="Ubicación">
              <InputWithIcon icon="📍">
                <input
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="Anexo" full>
              <InputWithIcon icon="☎️">
                <input
                  name="anexo"
                  value={form.anexo}
                  onChange={handleChange}
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="Observaciones" full>
              <InputWithIcon icon="📝">
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  rows={2}
                  style={{ ...styles.input, resize: 'none' }}
                />
              </InputWithIcon>
            </Field>
          </div>

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
const Field = ({ label, full, children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      gridColumn: full ? '1 / -1' : undefined
    }}
  >
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
   ESTILOS (SIN CAMBIOS)
========================= */
const styles = {
  centerWrapper: { display: 'flex', justifyContent: 'center', padding: '40px 0' },
  shell: {
    width: '55vw',
    maxWidth: 980,
    minWidth: 760,
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
  sideTitle: { margin: 0, fontWeight: 600 },
  sideText: { marginTop: 10, fontSize: 13, opacity: 0.85 },
  form: { padding: 28, display: 'flex', flexDirection: 'column', gap: 22 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  inputWrapper: { position: 'relative', width: '100%', overflow: 'hidden' },
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 16,
    opacity: 0.6,
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 14px 10px 42px',
    borderRadius: 16,
    border: '1px solid #d1d5db',
    fontSize: 14,
    background: '#fff',
    outline: 'none'
  },
  inputDisabled: { background: '#f3f4f6', cursor: 'not-allowed' },
  actions: { display: 'flex', justifyContent: 'flex-end' },
  submit: {
    padding: '14px 40px',
    borderRadius: 999,
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600
  }
};

export default MonitoresForm;
