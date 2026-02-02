import axios from './axios';

/* =========================
   LISTAR TODOS
========================= */
export const getColaboradores = async () => {
  const res = await axios.get('/colaboradores');
  return res.data;
};

/* =========================
   LISTAR SOLO ACTIVOS (NUEVO)
========================= */
export const getColaboradoresActivos = async () => {
  const res = await axios.get('/colaboradores/activos');
  return res.data;
};

/* =========================
   CREAR
========================= */
export const createColaborador = async (data) => {
  const res = await axios.post('/colaboradores', data);
  return res.data;
};

/* =========================
   ACTUALIZAR
========================= */
export const updateColaborador = async (id, data) => {
  const res = await axios.put(`/colaboradores/${id}`, data);
  return res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export const updateColaboradorEstado = async (id, activo) => {
  const res = await axios.put(`/colaboradores/${id}/estado`, { activo });
  return res.data;
};
