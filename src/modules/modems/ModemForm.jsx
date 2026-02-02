import React, { useEffect, useState } from 'react';
import { createModem, updateModem } from '../../api/modems.api';
import { getAreas } from '../../api/areas.api';
import { getChipsDisponibles } from '../../api/chips.api';
import { getColaboradores } from '../../api/colaboradores.api';

const emptyForm = {
  marca: '',
  modelo: '',
  imei_modem: '',
  estado_modem: 'Operativo',
  estado_equipo: 'Almacen TI',
  id_area: '',
  usuario: '',
  id_chip: ''
};

const ModemForm = ({ selectedModem, onSaved }) => {
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
    getColaboradores().then(d => setColaboradores(Array.isArray(d) ? d : []));
  }, []);

  /* =========================
     CARGA EDICIÓN
  ========================= */
  useEffect(() => {
    if (!selectedModem) {
      setForm(emptyForm);
      return;
    }

    setForm({
      marca: selectedModem.marca || '',
      modelo: selectedModem.modelo || '',
      imei_modem: selectedModem.imei_modem || '',
      estado_modem: selectedModem.estado_modem || 'Operativo',
      estado_equipo: selectedModem.estado_equipo || 'Almacen TI',
      id_area: selectedModem.id_area || '',
      usuario: selectedModem.usuario || '',
      id_chip: selectedModem.id_chip || ''
    });
  }, [selectedModem]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      id_area: form.id_area ? Number(form.id_area) : null,
      id_chip: form.id_chip ? Number(form.id_chip) : null
    };

    try {
      selectedModem
        ? await updateModem(selectedModem.id_modem, payload)
        : await createModem(payload);

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
            {selectedModem ? 'Editar módem' : 'Nuevo módem'}
          </h3>

          <Info label="Estado módem" value={form.estado_modem} />
          <Info label="Estado equipo" value={form.estado_equipo} />
          <Info
            label="Área"
            value={
              areas.find(a => a.id_area === Number(form.id_area))
                ?.nombre_area || '—'
            }
          />
        </aside>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
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
              <InputWithIcon icon="📟">
                <input
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </InputWithIcon>
            </Field>

            <Field label="IMEI del módem" full>
              <InputWithIcon icon="🔢">
                <input
                  name="imei_modem"
                  value={form.imei_modem}
                  onChange={handleChange}
                  disabled={!!selectedModem}
                  required
                  style={{
                    ...styles.input,
                    ...(selectedModem ? styles.inputDisabled : {})
                  }}
                />
              </InputWithIcon>
            </Field>

            <Field label="Estado del módem">
              <InputWithIcon icon="⚙️">
                <select
                  name="estado_modem"
                  value={form.estado_modem}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Operativo</option>
                  <option>Inoperativo</option>
                </select>
              </InputWithIcon>
            </Field>

            <Field label="Estado del equipo">
              <InputWithIcon icon="📍">
                <select
                  name="estado_equipo"
                  value={form.estado_equipo}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Almacen TI</option>
                  <option>Asignado</option>
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
                  required
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

            {/* CHIP */}
            <Field label="Chip asignado">
              <InputWithIcon icon="📶">
                <select
                  name="id_chip"
                  value={form.id_chip}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Sin chip</option>
                  {chips.map(c => (
                    <option key={c.id_chip} value={c.id_chip}>
                      {c.numero_chip}
                    </option>
                  ))}
                </select>
              </InputWithIcon>
            </Field>
          </div>

          <div style={styles.actions}>
            <button style={styles.submit} disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar módem'}
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

const Info = ({ label, value }) => (
  <div style={styles.info}>
    <span>{label}</span>
    <strong>{value}</strong>
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
    background: 'linear-gradient(180deg,#36ad55,#115e59)',
    color: '#ecfeff',
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  sideTitle: { margin: 0, fontWeight: 600 },
  info: { fontSize: 13, display: 'flex', flexDirection: 'column', opacity: 0.9 },
  form: { padding: 28, display: 'flex', flexDirection: 'column', gap: 22 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  inputWrapper: { position: 'relative', width: '100%',overflow: 'hidden' },
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

export default ModemForm;
