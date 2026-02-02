import axios from 'axios';

const API_URL = 'http://localhost:3001/api/tablets';

export const getTablets = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createTablet = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateTablet = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const updateTabletEstado = async (id, activo) => {
  const res = await axios.patch(`${API_URL}/${id}/estado`, { activo });
  return res.data;
};
