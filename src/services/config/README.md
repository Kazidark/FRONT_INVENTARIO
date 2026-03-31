## Configuracion de servicios

Esta carpeta contiene la configuracion y la instancia de Axios.

### Variables de entorno (Vite)

- `VITE_API_URL` (default: `http://localhost:3001/api`)
- `VITE_AUTH_API_URL` (default: `http://localhost:3000/api`)

La configuracion base vive en:

- `config.js` (URLs base)
- `axios.js` (instancia con `baseURL` y header `Authorization`)

Las llamadas HTTP por recurso estan en `src/services/api/`.
