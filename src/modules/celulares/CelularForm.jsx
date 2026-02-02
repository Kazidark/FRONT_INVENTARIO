import { useEffect, useState } from 'react';
import { createCelular, updateCelular } from '../../api/celulares.api';
import { getAreas } from '../../api/areas.api';
import { getChipsDisponibles } from '../../api/chips.api';
import { getColaboradoresActivos } from '../../api/colaboradores.api';

const ID_CHIP_SIN_CHIP = 3031;

const emptyForm = {
  marca: '',
  modelo: '',
  imei_celular: '',
  estado_celular: 'Operativo',
  estado_equipo: 'Almacen TI',
  id_area: '',
  usuario: '',
  id_chip: ID_CHIP_SIN_CHIP
};

const CelularForm = ({ selectedCelular, onSaved }) => {
  const isEdit = Boolean(selectedCelular);
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

    getChipsDisponibles()
      .then(d => {
        const list = Array.isArray(d) ? d : [];
        setChips([
          { id_chip: ID_CHIP_SIN_CHIP, numero_chip: 'SIN CHIP' },
          ...list
        ]);
      })
      .catch(() => {
        setChips([{ id_chip: ID_CHIP_SIN_CHIP, numero_chip: 'SIN CHIP' }]);
      });

    getColaboradoresActivos()
      .then(d => setColaboradores(Array.isArray(d) ? d : []))
      .catch(() => setColaboradores([]));
  }, []);

  /* =========================
     EDICIÓN
  ========================= */
  useEffect(() => {
    if (!selectedCelular) {
      setForm(emptyForm);
      return;
    }

    setForm({
      marca: selectedCelular.marca || '',
      modelo: selectedCelular.modelo || '',
      imei_celular: selectedCelular.imei_celular || '',
      estado_celular: selectedCelular.estado_celular || 'Operativo',
      estado_equipo: selectedCelular.estado_equipo || 'Almacen TI',
      id_area: selectedCelular.id_area || '',
      usuario: selectedCelular.usuario || '',
      id_chip: selectedCelular.id_chip ?? ID_CHIP_SIN_CHIP
    });
  }, [selectedCelular]);

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
      id_chip: Number(form.id_chip)
    };

    try {
      isEdit
        ? await updateCelular(selectedCelular.id_celular, payload)
        : await createCelular(payload);

      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.centerWrapper}>
      <div style={styles.shell}>
        <aside style={styles.side}>
          <h3 style={styles.sideTitle}>
            {isEdit ? 'Editar Celular' : 'Nuevo Celular'}
          </h3>
          <p style={styles.sideText}>Gestión de dispositivos móviles</p>
        </aside>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <Field label="IMEI" full>
              <InputWithIcon icon="🔢">
                <input
                  name="imei_celular"
                  value={form.imei_celular}
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

            <Field label="Marca">
              <InputWithIcon icon="🏷️">
                <input name="marca" value={form.marca} onChange={handleChange} style={styles.input} />
              </InputWithIcon>
            </Field>

            <Field label="Modelo">
              <InputWithIcon icon="📱">
                <input name="modelo" value={form.modelo} onChange={handleChange} style={styles.input} />
              </InputWithIcon>
            </Field>
            <Field label="Estado celular">
              <InputWithIcon icon="⚙️">
                <select
                  name="estado_celular"
                  value={form.estado_celular}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Operativo">Operativo</option>
                  <option value="Inoperativo">Inoperativo</option>
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
                  <option value="Almacen TI">Almacén TI</option>
                  <option value="Asignado">Asignado</option>
                </select>
              </InputWithIcon>
            </Field>


            <Field label="Área">
              <InputWithIcon icon="🏢">
                <select name="id_area" value={form.id_area} onChange={handleChange} style={styles.input}>
                  <option value="">Seleccione</option>
                  {areas.map(a => (
                    <option key={a.id_area} value={a.id_area}>
                      {a.nombre_area}
                    </option>
                  ))}
                </select>
              </InputWithIcon>
            </Field>

            <Field label="Chip asignado">
              <InputWithIcon icon="📶">
                <select name="id_chip" value={form.id_chip} onChange={handleChange} style={styles.input}>
                  {chips.map(ch => (
                    <option key={ch.id_chip} value={ch.id_chip}>
                      {ch.numero_chip}
                    </option>
                  ))}
                </select>
              </InputWithIcon>
            </Field>

            <Field label="Colaborador">
              <InputWithIcon icon="👤">
                <select
                  name="usuario"
                  value={form.usuario}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Sin colaborador</option>
                  {colaboradores.map(c => (
                    <option key={c.id_colaborador} value={c.nombre_completo}>
                      {c.nombre_completo}
                    </option>
                  ))}
                </select>
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
   AUX
========================= */
const Field = ({ label, full, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: full ? '1 / -1' : undefined }}>
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
    background: '#fff',
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
  },
 side: { background: 'linear-gradient(180deg,#2563eb,#1e40af)', color: '#fff', padding: 28 },
  sideTitle: { margin: 0, fontWeight: 600 },
  sideText: { marginTop: 10, fontSize: 13, opacity: 0.85 },
  form: { padding: 28, display: 'flex', flexDirection: 'column', gap: 22 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  inputWrapper: { position: 'relative', width: '100%', overflow: 'hidden' },
  inputIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.7 },
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

export default CelularForm;
