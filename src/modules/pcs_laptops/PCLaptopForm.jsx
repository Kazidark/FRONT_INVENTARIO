import React, { useEffect, useState } from 'react';
import {
  createPcLaptop,
  updatePcLaptop
} from '../../api/pcs_laptops.api';
import { getAreas } from '../../api/areas.api';
import { getColaboradores } from '../../api/colaboradores.api';

/* =========================
   FORM BASE
========================= */
const emptyForm = {
  tipo_equipo: 'Laptop',
  marca: '',
  modelo: '',
  serie: '',
  estado_pc: 'Operativo',
  estado_equipo: 'Almacen TI',
  id_area: '',
  usuario: '',
  ubicacion: '',
  observaciones: '',
  anexo: ''
};

const PCLaptopForm = ({ selected, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [areas, setAreas] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     CARGA ÁREAS + COLABORADORES
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
      tipo_equipo: selected.tipo_equipo || 'Laptop',
      marca: selected.marca || '',
      modelo: selected.modelo || '',
      serie: selected.serie || '',
      estado_pc: selected.estado_pc || 'Operativo',
      estado_equipo: selected.estado_equipo || 'Almacen TI',
      id_area: selected.id_area ?? '',
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
        ? await updatePcLaptop(selected.id_pc, form)
        : await createPcLaptop(form);

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
            {selected ? 'Editar PC / Laptop' : 'Nuevo PC / Laptop'}
          </h3>
          <p style={styles.sideText}>Gestión de equipos TI</p>
        </aside>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <Field label="Tipo de equipo" icon="💻">
              <select
                name="tipo_equipo"
                value={form.tipo_equipo}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="PC">PC</option>
                <option value="Laptop">Laptop</option>
              </select>
            </Field>

            <Field label="Marca" icon="🏷️">
              <input
                name="marca"
                value={form.marca}
                onChange={handleChange}
                style={styles.input}
              />
            </Field>

            <Field label="Modelo" icon="📦">
              <input
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                style={styles.input}
              />
            </Field>

            <Field label="Serie" icon="🔢" full>
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
            </Field>

            <Field label="Estado PC" icon="⚙️">
              <select
                name="estado_pc"
                value={form.estado_pc}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Operativo</option>
                <option>Inoperativo</option>
              </select>
            </Field>

            <Field label="Estado equipo" icon="📍">
              <select
                name="estado_equipo"
                value={form.estado_equipo}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Almacen TI</option>
                <option>Asignado</option>
              </select>
            </Field>

            <Field label="Área" icon="🏢">
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
            </Field>

            {/* 👤 COLABORADOR */}
            <Field label="Colaborador" icon="👤">
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
            </Field>

            <Field label="Ubicación" icon="📍">
              <input
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                style={styles.input}
              />
            </Field>

            <Field label="Anexo" icon="📎">
              <input
                name="anexo"
                value={form.anexo}
                onChange={handleChange}
                style={styles.input}
              />
            </Field>

            <Field label="Observaciones" icon="📝" full>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                rows={2}
                style={{ ...styles.input, resize: 'none' }}
              />
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
   FIELD CON ÍCONO
========================= */
const Field = ({ label, icon, full, children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      gridColumn: full ? '1 / -1' : undefined
    }}
  >
    <label style={styles.label}>{label}</label>
    <div style={styles.inputWrapper}>
      <span style={styles.inputIcon}>{icon}</span>
      {children}
    </div>
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
  inputWrapper: { position: 'relative', width: '100%' },
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 16,
    opacity: 0.6
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

export default PCLaptopForm;
