import axios from 'axios';

const API = 'http://localhost:3001/api/asignaciones';

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
