import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/usuarios`;

/* =========================
   LISTAR
========================= */
export const getUsuarios = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

/* =========================
   CREAR
========================= */
export const createUsuario = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

/* =========================
   EDITAR
========================= */
export const updateUsuario = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export const updateUsuarioEstado = async (id, activo) => {
  const res = await axios.put(`${API_URL}/${id}/estado`, { activo });
  return res.data;
};
