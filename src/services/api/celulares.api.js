import { api } from '../config';

const unwrapArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

/* =========================
   LISTAR TODOS
========================= */
export const getCelulares = async () => {
  const res = await api.get('module-celulares/GetAllCelulares');
  return unwrapArray(res.data);
};

/* =========================
   OBTENER POR ID
========================= */
export const getCelularById = async (id) => {
  const { data } = await api.get(`module-celulares/GetAllbyId/${id}`);
  const result = data?.result ?? data;
  return Array.isArray(result) ? result[0] : result;
};

/* =========================
   CREAR
========================= */
export const createCelular = async (data) => {
  const res = await api.post('module-celulares/create-celular', data);
  return res.data?.result ?? res.data;
};

/* =========================
   ACTUALIZAR (PATCH)
========================= */
export const updateCelular = async (id, data) => {
  const res = await api.patch(`module-celulares/celular/${id}`, data);
  return res.data?.result ?? res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export const updateCelularEstado = async (id, activo) => {
  return updateCelular(id, { activo });
};
