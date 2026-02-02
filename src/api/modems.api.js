import axios from 'axios';

const API_URL = 'http://localhost:3001/api/modems';

/* =========================
   LISTAR TODOS
========================= */
export const getModems = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

/* =========================
   LISTAR DISPONIBLES
========================= */
export const getModemsDisponibles = async () => {
  const res = await axios.get(`${API_URL}/disponibles`);
  return res.data;
};

/* =========================
   CREAR
========================= */
export const createModem = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

/* =========================
   EDITAR DATOS (NO estado)
========================= */
export const updateModem = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export const updateModemEstado = async (id, activo) => {
  const res = await axios.patch(`${API_URL}/${id}/estado`, { activo });
  return res.data;
};
