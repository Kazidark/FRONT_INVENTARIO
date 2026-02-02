import axios from 'axios';

const API_URL = 'http://localhost:3001/api/pcs-laptops';

/* =========================
   LISTAR PCs / LAPTOPS
========================= */
export const getPCsLaptops = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

/* =========================
   CREAR PC / LAPTOP
========================= */
export const createPcLaptop = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

/* =========================
   ACTUALIZAR PC / LAPTOP (EDICIÓN COMPLETA)
========================= */
export const updatePcLaptop = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
   (SOLO CAMBIA "activo")
========================= */
export const updatePcEstado = async (id, payload) => {
  const res = await axios.put(`${API_URL}/${id}/estado`, payload);
  return res.data;
};
