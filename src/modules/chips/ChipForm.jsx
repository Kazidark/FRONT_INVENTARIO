import { useEffect, useState } from 'react';
import { createChip, updateChip } from '../../api/chips.api';
import { getAreas } from '../../api/areas.api';
import { getColaboradores } from '../../api/colaboradores.api';

const emptyForm = {
  numero_chip: '',
  iccid: '',
  tipo_chip: 'Voz',
  operador: '',
  estado_chip: 'Activo',
  area: '',
  usuario: ''
};

const ChipForm = ({ selectedChip, onSaved, onCancel }) => {
  const isEdit = Boolean(selectedChip);
  const [form, setForm] = useState(emptyForm);
  const [areas, setAreas] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     CARGA INICIAL
  ========================= */
  useEffect(() => {
    getAreas().then(d => setAreas(Array.isArray(d) ? d : []));
    getColaboradores().then(d => setColaboradores(Array.isArray(d) ? d : []));
  }, []);

  /* =========================
     CARGA EDICIÓN
  ========================= */
  useEffect(() => {
    if (!selectedChip) {
      setForm(emptyForm);
      return;
    }

    setForm({
      numero_chip: selectedChip.numero_chip ?? '',
      iccid: selectedChip.iccid ?? '',
      tipo_chip: selectedChip.tipo_chip ?? 'Voz',
      operador: selectedChip.operador ?? '',
      estado_chip: selectedChip.estado_chip ?? 'Activo',
      area: selectedChip.area ?? '',
      usuario: selectedChip.usuario ?? ''
    });
  }, [selectedChip]);

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
        ? await updateChip(selectedChip.id_chip, form)
        : await createChip(form);
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
            {isEdit ? 'Editar chip' : 'Nuevo chip'}
          </h3>
          <p style={styles.sideText}>
            Gestión de líneas y operadores
          </p>
        </aside>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <Field label="Número de chip">
              <InputWithIcon icon="📶">
                <input
                  name="numero_chip"
                  value={form.numero_chip}
                  onChange={handleChange}
                  disabled={isEdit}
                  required
                  style={{
                    ...styles.input,
                    ...(isEdit ? styles.inputDisabled : {})
                  }}
                />
              </InputWithIcon>
            </Field>

            <Field label="ICCID">
              <InputWithIcon icon="🔢">
                <input
                  name="iccid"
                  value={form.iccid}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="Operador">
              <InputWithIcon icon="📡">
                <input
                  name="operador"
                  value={form.operador}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="Estado del chip">
              <InputWithIcon icon="⚙️">
                <select
                  name="estado_chip"
                  value={form.estado_chip}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Activo">Activo</option>
                  <option value="Baja">Baja</option>
                </select>
              </InputWithIcon>
            </Field>

            <Field label="Área">
              <InputWithIcon icon="🏢">
                <select
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Seleccione un área</option>
                  {areas.map(a => (
                    <option key={a.id_area} value={a.nombre_area}>
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

            <Field label="Tipo de chip">
              <InputWithIcon icon="📞">
                <select
                  name="tipo_chip"
                  value={form.tipo_chip}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Voz">Voz</option>
                  <option value="Datos">Datos</option>
                </select>
              </InputWithIcon>
            </Field>
          </div>

          {/* ACCIONES */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.btnSecondary}
              onClick={onCancel}
            >
              Cancelar
            </button>

            <button
              type="submit"
              style={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================
   AUX
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
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  inputWrapper: { position: 'relative', width: '100%', overflow: 'hidden' },
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
    background: '#fff',
    outline: 'none'
  },
  inputDisabled: { background: '#f3f4f6', cursor: 'not-allowed' },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10
  },
  btnPrimary: {
    background: '#2563eb',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 999,
    border: 'none',
    fontWeight: 600
  },
  btnSecondary: {
    background: '#6b7280',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 999,
    border: 'none'
  }
};

export default ChipForm;
