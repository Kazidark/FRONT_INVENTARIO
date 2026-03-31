

import api from '../../config/axios';


export const getAreas = async () => {
  try {
    const response = await api.get('/master-data/area');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  } catch (error) {
    throw new Error('Error al obtener las áreas');
  }
};

export const getEstadoEquipo = async () => {
  try {
    const response = await api.get('/master-data/estadoEquipo');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  } catch (error) {
    throw new Error('Error al obtener las áreas');
  }
};
export const getEstadoChips = async () => {
  try {
    const response = await api.get('/master-data/estadoChips');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  } catch (error) {
    throw new Error('Error al obtener los estados del chip');
  }
};
export const getColaboradores = async () => {
  try {
    const response = await api.get('/master-data/colaborador');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  } catch (error) {
    throw new Error('Error al obtener las áreas');
  }
};
export const getAsignacion = async () => {
  try {
    const response = await api.get('/master-data/asignacion');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  } catch (error) {
    throw new Error('Error al obtener las áreas');
  }
};

export const getOperadores = async () => {
  try {
    const response = await api.get('/master-data/operadores');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  } catch (error) {
    throw new Error('Error al obtener los operadores');
  }
};

export const getTipoChip = async () => {
  try {
    const response = await api.get('/master-data/tipoChip');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  } catch (error) {
    throw new Error('Error al obtener los tipos de chip');
  }
};

export const getTipoEquipo = async () => {
  try {
    const response = await api.get('/master-data/tipoEquipo');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  } catch (error) {
    throw new Error('Error al obtener los tipos de equipo');
  }
};