    import axios from 'axios';

const API_URL = 'http://localhost:3001/api/monitores';

/* =========================
   LISTAR
========================= */
export const getMonitores = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

/* =========================
   CREAR
========================= */
export const createMonitor = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

/* =========================
   ACTUALIZAR
========================= */
export const updateMonitor = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export const updateMonitorEstado = async (id, activo) => {
  const res = await axios.patch(`${API_URL}/${id}/estado`, { activo });
  return res.data;
};
