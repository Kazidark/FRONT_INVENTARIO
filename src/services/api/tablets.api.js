import { api } from '../config';

const unwrapArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

/* =========================
   LISTAR
========================= */
export const getTablets = async () => {
  const res = await api.get('module-tablet/GetAllTablets');
  return unwrapArray(res.data);
};

/* =========================
   OBTENER POR ID
========================= */
export const getTabletById = async (id) => {
  const { data } = await api.get(`module-tablet/GetAllbyId/${id}`);
  const result = data?.result ?? data;
  return Array.isArray(result) ? result[0] : result;
};

/* =========================
   CREAR
========================= */
export const createTablet = async (data) => {
  const res = await api.post('module-tablet/create-tablet', data);
  return res.data?.result ?? res.data;
};

/* =========================
   ACTUALIZAR (PATCH)
========================= */
export const updateTablet = async (id, data) => {
  const res = await api.patch(`module-tablet/tablet/${id}`, data);
  return res.data?.result ?? res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export const updateTabletEstado = async (id, activo) => {
  return updateTablet(id, { activo });
};
