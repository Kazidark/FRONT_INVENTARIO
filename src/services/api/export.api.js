import { api } from '../config';

const DEFAULT_FILENAME = 'reporte-inventario.xlsx';

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

export const downloadModuleExcel = async (moduleKey, fallbackName = DEFAULT_FILENAME) => {
  const response = await api.get(`exports/${moduleKey}/excel`, {
    responseType: 'blob'
  });

  const disposition = response.headers?.['content-disposition'];
  const fileName = getFileNameFromDisposition(disposition) || fallbackName;
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
};
