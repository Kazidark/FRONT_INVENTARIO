import { useEffect, useState } from 'react';
import { createTablet, updateTablet } from '../../api/tablets.api';
import { getAreas } from '../../api/areas.api';
import { getChipsDisponibles } from '../../api/chips.api';
import { getColaboradores } from '../../api/colaboradores.api';

const emptyForm = {
  marca: '',
  modelo: '',
  imei_tablet: '',
  estado_tablet: 'Operativo',
  estado_equipo: 'Vigente',
  id_area: '',
  usuario: '',
  ubicacion: '',
  observaciones: '',
  id_chip: ''
};

const TabletForm = ({ selectedTablet, onSaved }) => {
  const isEdit = Boolean(selectedTablet);
  const [form, setForm] = useState(emptyForm);
  const [areas, setAreas] = useState([]);
  const [chips, setChips] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     CARGA INICIAL
  ========================= */
  useEffect(() => {
    getAreas().then(d => setAreas(Array.isArray(d) ? d : []));
    getChipsDisponibles().then(d => setChips(Array.isArray(d) ? d : []));
    getColaboradores().then(d =>
      setColaboradores(Array.isArray(d) ? d : [])
    );
  }, []);

  /* =========================
     CARGA EDICIÓN
  ========================= */
  useEffect(() => {
    if (!selectedTablet) {
      setForm(emptyForm);
      return;
    }

    setForm({
      ...selectedTablet,
      id_chip: selectedTablet.id_chip || '',
      usuario: selectedTablet.usuario || ''
    });
  }, [selectedTablet]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      isEdit
        ? await updateTablet(selectedTablet.id_tablet, form)
        : await createTablet(form);
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
            {isEdit ? 'Editar tablet' : 'Nueva tablet'}
          </h3>
          <p style={styles.sideText}>Gestión de equipos tecnológicos</p>
        </aside>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <Field label="Marca">
              <InputWithIcon icon="🏷️">
                <input
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="Modelo">
              <InputWithIcon icon="📱">
                <input
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="IMEI" full>
              <InputWithIcon icon="🔢">
                <input
                  name="imei_tablet"
                  value={form.imei_tablet}
                  onChange={handleChange}
                  disabled={isEdit}
                  style={{
                    ...styles.input,
                    ...(isEdit ? styles.inputDisabled : {})
                  }}
                />
              </InputWithIcon>
            </Field>

            <Field label="Estado tablet">
              <InputWithIcon icon="⚙️">
                <select
                  name="estado_tablet"
                  value={form.estado_tablet}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Operativo</option>
                  <option>Inoperativo</option>
                </select>
              </InputWithIcon>
            </Field>

            <Field label="Estado equipo">
              <InputWithIcon icon="📍">
                <select
                  name="estado_equipo"
                  value={form.estado_equipo}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Vigente</option>
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


            <Field label="Chip asignado">
              <InputWithIcon icon="📶">
                <select
                  name="id_chip"
                  value={form.id_chip}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Sin chip</option>
                  {chips.map(ch => (
                    <option key={ch.id_chip} value={ch.id_chip}>
                      {ch.numero_chip}
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
            <button style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ===== COMPONENTES AUX ===== */
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

/* ===== ESTILOS (SIN CAMBIOS) ===== */
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
    background: '#fff',
    boxShadow: '0 20px 40px rgba(0,0,0,.12)'
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
    opacity: 0.7
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
  btnPrimary: {
    background: '#2563eb',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 999,
    border: 'none',
    fontWeight: 600
  }
};

export default TabletForm;
