import { api } from '../config';

const unwrapArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

/* =========================
   LISTAR
========================= */
export const getMonitores = async () => {
  const res = await api.get('module-monitores/GetAllMonitores');
  return unwrapArray(res.data);
};

/* =========================
   OBTENER POR ID
========================= */
// export const getMonitorById = async (id) => {
//   const { data } = await api.get(`module-monitores/GetAllbyId/${id}`);
//   const result = data?.result ?? data;
//   return Array.isArray(result) ? result[0] : result;
// };

/* =========================
   CREAR
========================= */
export const createMonitor = async (data) => {
  const res = await api.post('module-monitores/create-monitor', data);
  return res.data?.result ?? res.data;
};

/* =========================
   ACTUALIZAR (PATCH)
========================= */
export const updateMonitor = async (id, data) => {
  const res = await api.patch(`module-monitores/monitor/${id}`, data);
  return res.data?.result ?? res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export const updateMonitorEstado = async (id, activo) => {
  return updateMonitor(id, { activo });
};
