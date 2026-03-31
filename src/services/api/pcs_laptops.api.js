import { api } from '../config';

const unwrapArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

/* =========================
   LISTAR PCs / LAPTOPS
========================= */
export const getPCsLaptops = async () => {
  const res = await api.get('module-pc/GetAllPc');
  return unwrapArray(res.data);
};

/* =========================
   OBTENER POR ID
========================= */
export const getPcById = async (id) => {
  const { data } = await api.get(`module-pc/GetAllbyId/${id}`);
  const result = data?.result ?? data;
  return Array.isArray(result) ? result[0] : result;
};

/* =========================
   CREAR PC / LAPTOP
========================= */
export const createPcLaptop = async (data) => {
  const res = await api.post('module-pc/create-pc', data);
  return res.data?.result ?? res.data;
};

/* =========================
   ACTUALIZAR (PATCH)
========================= */
export const updatePcLaptop = async (id, data) => {
  const res = await api.patch(`module-pc/pc/${id}`, data);
  return res.data?.result ?? res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export const updatePcEstado = async (id, payload) => {
  return updatePcLaptop(id, payload);
};
