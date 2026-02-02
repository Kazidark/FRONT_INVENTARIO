import React, { useEffect, useState } from 'react';
import { getColaboradores } from '../../api/colaboradores.api';
import { getAreas } from '../../api/areas.api';
import { getModemsDisponibles } from '../../api/modems.api';
import { getChipsDisponibles } from '../../api/chips.api';
import { crearAsignacion } from '../../api/asignaciones.api';


const emptyForm = {
  id_colaborador: '',
  id_area: '',
  id_modem: '',
  id_chip: ''
};

const AsignacionForm = ({ onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [colaboradores, setColaboradores] = useState([]);
  const [areas, setAreas] = useState([]);
  const [modems, setModems] = useState([]);
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getColaboradores().then(setColaboradores);
    getAreas().then(setAreas);
    getModemsDisponibles().then(setModems);
    getChipsDisponibles().then(setChips);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await crearAsignacion({
        id_colaborador: Number(form.id_colaborador),
        id_area: Number(form.id_area),
        id_modem: form.id_modem ? Number(form.id_modem) : null,
        id_chip: form.id_chip ? Number(form.id_chip) : null
      });

      onSaved();
    } catch (error) {
      console.error(error);
      alert('Error al asignar equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.shell}>
      {/* PANEL LATERAL */}
      <aside style={styles.side}>
        <h3 style={styles.sideTitle}>Nueva asignación</h3>

        <Info
          label="Colaborador"
          value={
            colaboradores.find(
              (c) => c.id_colaborador === Number(form.id_colaborador)
            )?.nombre_completo || '—'
          }
        />

        <Info
          label="Área"
          value={
            areas.find((a) => a.id_area === Number(form.id_area))
              ?.nombre_area || '—'
          }
        />
      </aside>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          <Field label="Colaborador">
            <select
              name="id_colaborador"
              value={form.id_colaborador}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              {colaboradores.map((c) => (
                <option key={c.id_colaborador} value={c.id_colaborador}>
                  {c.nombre_completo}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Área">
            <select
              name="id_area"
              value={form.id_area}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              {areas.map((a) => (
                <option key={a.id_area} value={a.id_area}>
                  {a.nombre_area}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Módem">
            <select
              name="id_modem"
              value={form.id_modem}
              onChange={handleChange}
            >
              <option value="">Sin asignar</option>
              {modems.map((m) => (
                <option key={m.id_modem} value={m.id_modem}>
                  {m.imei_modem}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Chip">
            <select
              name="id_chip"
              value={form.id_chip}
              onChange={handleChange}
            >
              <option value="">Sin asignar</option>
              {chips.map((c) => (
                <option key={c.id_chip} value={c.id_chip}>
                  {c.numero_chip}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <button type="submit" style={styles.submit} disabled={loading}>
          {loading ? 'Asignando…' : 'Guardar asignación'}
        </button>
      </form>
    </div>
  );
};

/* =========================
   COMPONENTES AUX
========================= */

const Field = ({ label, children }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    {React.cloneElement(children, { style: styles.control })}
  </div>
);

const Info = ({ label, value }) => (
  <div style={styles.info}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

/* =========================
   ESTILOS (CLON MODEMFORM)
========================= */

const styles = {
  shell: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    borderRadius: '26px',
    overflow: 'hidden',
    background: '#ffffff',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
  },

  side: {
    background: 'linear-gradient(180deg, #36ad55, #115e59)',
    color: '#ecfeff',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },

  sideTitle: {
    fontSize: '18px',
    fontWeight: '600'
  },

  info: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
    opacity: 0.95
  },

  form: {
    padding: '34px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '22px'
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151'
  },

  control: {
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    background: '#f9fafb',
    fontSize: '14px'
  },

  submit: {
    alignSelf: 'flex-end',
    padding: '14px 40px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default AsignacionForm;
