import { api } from '../config';

const unwrapArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

const flatChip = (chip) => ({
  ...chip,
  nombre_operador: chip.operadorRel?.nombre_operador ?? '-',
  nombre_area: chip.areaRel?.nombre_area ?? '-',
  nombre_colaborador: chip.colaboradorRel?.nombre_completo ?? '-',
  nombre_estado_chip: chip.estadoChipRel?.nombreChips ?? '-',
  nombre_tipo_chip: chip.tipoChipRel?.descripcion_tipo_chip ?? '-',
});

/* =========================
   LISTAR TODOS
========================= */
export const getChips = async () => {
  const res = await api.get('module-chips/GetAllChips');
  return unwrapArray(res.data).map(flatChip);
};

/* =========================
   OBTENER POR ID
========================= */
export const getChipById = async (id) => {
  const { data } = await api.get(`module-chips/${id}`);
  const result = data?.result ?? data;
  const chip = Array.isArray(result) ? result[0] : result;
  return chip;
};

/* =========================
   CREAR
========================= */
export const createChip = async (data) => {
  const res = await api.post('module-chips/createChip', data);
  return res.data?.result ?? res.data;
};

/* =========================
   ACTUALIZAR (PATCH)
========================= */
export const updateChip = async (id, data) => {
  const res = await api.patch(`module-chips/chip/${id}`, data);
  return res.data?.result ?? res.data;
};

/* =========================
   DISPONIBLES (ASIGNACIONES)
   - Intenta endpoint dedicado si existe.
   - Si no existe en el backend, cae a filtrar localmente desde GetAllChips.
========================= */
export const getChipsDisponibles = async () => {
  try {
    const res = await api.get('module-chips/ChipDisponibles');
    return unwrapArray(res.data);
  } catch {
    return [];
  }
};

/* =========================
   ACTIVAR / DESACTIVAR
   (en el backend es PATCH /module-chips/:id)
========================= */
// export const updateChipActivo = async (id, activo) => {
//   return updateChip(id, { activo });
// };

