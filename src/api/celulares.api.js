import axios from 'axios';

const API_URL = 'http://localhost:3001/api/celulares';

/* =========================
   LISTAR
========================= */
export const getCelulares = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

/* =========================
   CREAR
========================= */
export const createCelular = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

/* =========================
   ACTUALIZAR
========================= */
export const updateCelular = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
   🔥 AQUÍ ESTABA EL ERROR
========================= */
export const updateCelularEstado = async (id, activo) => {
  const res = await axios.put(`${API_URL}/${id}/estado`, {
    activo
  });
  return res.data;
};

/* =========================
   DISPONIBLES
========================= */
export const getCelularesDisponibles = async () => {
  const res = await axios.get(`${API_URL}/disponibles`);
  return res.data;
};
