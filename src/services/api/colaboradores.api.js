import axios from '../config/axios';

/* =========================
   LISTAR TODOS
========================= */
export const getColaboradores = async () => {
  const res = await axios.get('/colaborador/all-colaboradores');
  const payload = res.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
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
  const res = await axios.post('/colaborador/create-colaborador', data);
  return res.data;
};

// /* =========================
//    ACTUALIZAR
// ========================= */
export const updateColaborador = async (id, data) => {
  const res = await axios.put(`/colaboradores/${id}`, data);
  return res.data;
};

// /* =========================
//    ACTIVAR / DESACTIVAR
// ========================= */
export const updateColaboradorEstado = async (id, activo) => {
  const res = await axios.put(`/colaboradores/${id}/estado`, { activo });
  return res.data;
};
