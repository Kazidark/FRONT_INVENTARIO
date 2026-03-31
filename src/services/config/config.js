// Base única para TODA la API (incluye /api).
// En tu caso: VITE_API_URL=http://localhost:3000/api
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

// Mantengo esto por compatibilidad (hay archivos que importan AUTH_BASE_URL),
// pero en este proyecto se usa la MISMA base para auth y el resto.
// Si quieres, luego lo eliminamos completamente.
export const AUTH_BASE_URL = API_BASE_URL;
