import axios from 'axios';
import { API_BASE_URL } from '../config';

const API = `${API_BASE_URL}/asignaciones`;

export const getAsignaciones = async () => {
  const { data } = await axios.get(API);
  return data;
};

export const crearAsignacion = async (payload) => {
  const { data } = await axios.post(API, payload);
  return data;
};

export const cerrarAsignacion = async (id) => {
  const { data } = await axios.put(`${API}/${id}/cerrar`);
  return data;
};
