import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/users`;

/* =========================
   LISTAR
========================= */
export const AllgetUsers = async () => {
  const res = await axios.get(`${API_URL}/Alluser`);
  return Array.isArray(res?.data) ? res.data : (res?.data?.result ?? []);
};

/* =========================
   CREAR
========================= */
export const createUsuario = async (data) => {
   console.log(data)
  const res = await axios.post(`${API_URL}/createUser`, data);
  return res.data;
};

/* =========================
   EDITAR
========================= */
export const updateUsuario = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

// /* =========================
//    ACTIVAR / DESACTIVAR
// ========================= */
// export const updateUsuarioEstado = async (id, activo) => {
//   const res = await axios.put(`${API_URL}/${id}/estado`, { activo });
//   return res.data;
// };
