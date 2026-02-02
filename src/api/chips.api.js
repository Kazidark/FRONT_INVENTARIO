import axios from 'axios';

const API_URL = 'http://localhost:3001/api/chips';

/* =========================
   LISTAR TODOS
========================= */
export const getChips = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

/* =========================
   CREAR
========================= */
export const createChip = async (data) => {
  await axios.post(API_URL, data);
};

/* =========================
   ACTUALIZAR
========================= */
export const updateChip = async (id, data) => {
  await axios.put(`${API_URL}/${id}`, data);
};

/* =========================
   DISPONIBLES (ASIGNACIONES)
========================= */
export const getChipsDisponibles = async () => {
  const res = await axios.get(`${API_URL}/disponibles`);
  return res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export const updateChipEstado = async (id) => {
  const res = await axios.put(
    `http://localhost:3001/api/chips/${id}/estado`
  );
  return res.data;
};

