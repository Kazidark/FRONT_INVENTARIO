import { api } from '../config';

const DEFAULT_FILENAME = 'reporte-inventario.xlsx';
const IMPORT_ENDPOINTS = {
  modemsImport: 'excel/upload-model',
  celularesImport: 'excel/upload-celulares',
  chipsImport: 'excel/upload-chips',
  pcsLaptopsImport: 'excel/upload-pcs-laptops',
  monitoresImport: 'excel/upload-monitores',
  tabletsImport: 'excel/upload-tablets'
};

const TEMPLATE_ENDPOINTS = {
  modems: 'excel/modems/plantilla',
  chips: 'excel/chips/plantilla',
  celulares: 'excel/celulares/plantilla',
  laptos: 'excel/laptos/plantilla',
  tablets: 'excel/tablets/plantilla'
};

const getFileNameFromDisposition = (headerValue) => {
  if (!headerValue) return null;
  const utfMatch = headerValue.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1].replace(/["']/g, ''));
  }

  const basicMatch = headerValue.match(/filename="?([^"]+)"?/i);
  if (basicMatch?.[1]) return basicMatch[1];
  return null;
};

const triggerBlobDownload = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
};

export const downloadModemTemplate = async () => {
  const response = await api.get(TEMPLATE_ENDPOINTS.modems, { responseType: 'blob' });
  const disposition = response.headers?.['content-disposition'];
  const fileName = getFileNameFromDisposition(disposition) || 'modem-plantilla.xlsx';
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  triggerBlobDownload(blob, fileName);
};

export const downloadChipTemplate = async () => {
  const response = await api.get(TEMPLATE_ENDPOINTS.chips, { responseType: 'blob' });
  const disposition = response.headers?.['content-disposition'];
  const fileName = getFileNameFromDisposition(disposition) || 'chip-plantilla.xlsx';
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  triggerBlobDownload(blob, fileName);
};

export const downloadCelularTemplate = async () => {
  const response = await api.get(TEMPLATE_ENDPOINTS.celulares, { responseType: 'blob' });
  const disposition = response.headers?.['content-disposition'];
  const fileName = getFileNameFromDisposition(disposition) || 'celular-plantilla.xlsx';
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  triggerBlobDownload(blob, fileName);
};

export const downloadLaptopTemplate = async () => {
  const response = await api.get(TEMPLATE_ENDPOINTS.laptos, { responseType: 'blob' });
  const disposition = response.headers?.['content-disposition'];
  const fileName = getFileNameFromDisposition(disposition) || 'laptop-plantilla.xlsx';
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  triggerBlobDownload(blob, fileName);
};

export const downloadTabletTemplate = async () => {
  const response = await api.get(TEMPLATE_ENDPOINTS.tablets, { responseType: 'blob' });
  const disposition = response.headers?.['content-disposition'];
  const fileName = getFileNameFromDisposition(disposition) || 'tablet-plantilla.xlsx';
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  triggerBlobDownload(blob, fileName);
};

export const downloadModuleExcel = async (moduleKey, fallbackName = DEFAULT_FILENAME) => {
  const response = await api.get(`exports/${moduleKey}/excel`, {
    responseType: 'blob'
  });

  const disposition = response.headers?.['content-disposition'];
  const fileName = getFileNameFromDisposition(disposition) || fallbackName;
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  triggerBlobDownload(blob, fileName);
};

export const importModuleExcel = async (moduleKey, file) => {
  const endpoint = IMPORT_ENDPOINTS[moduleKey];
  if (!endpoint) {
    throw new Error(`No existe endpoint de importación para "${moduleKey}"`);
  }

  const formData = new FormData();
  formData.append('file', file);

  return api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 300000
  });
};
