import axios from 'axios';
import { API_BASE_URL, api } from '../config';

const API_URL = `${API_BASE_URL}/modems`;

/* =========================
   LISTAR TODOS
========================= */
export const getModems = async () => {
  const res = await api.get('module-modems/GetAllModems');
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.result)) return res.data.result;
  return [];
};



/**
 **servicon quie llama   por  byID
**/
export const GetModemsById = async (id_modems) =>{
    try{
       const {data} =  await api.get(`module-modems/GetAllbyId/${id_modems}`);
       return data.result ?? [];
        
    }catch(error){
        console.error(error);
        return [];
    }
}

































/* =========================
   LISTAR DISPONIBLES
========================= */
export const getModemsDisponibles = async () => {
  const res = await axios.get(`${API_URL}/disponibles`);
  return res.data;
};

/* =========================
   CREAR
========================= */
export const createModem = async (data) => {
  const res = await api.post('module-modems/create-modem', data);
  return res.data;
};

/* =========================
   EDITAR DATOS (NO estado)
========================= */
export const updateModem = async (id, data) => {
  const res = await api.put(`module-modems/updateModems/${id}`, data);
  return res.data;
};

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export const updateModemEstado = async (id, activo) => {
  const res = await axios.patch(`${API_URL}/${id}/estado`, { activo });
  return res.data;
};
