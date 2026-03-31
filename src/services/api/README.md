## API layer

Esta carpeta concentra todas las llamadas HTTP por recurso.

### Configuracion

La configuracion base vive en `src/services/config/`:

- `config.js` (URLs base)
- `axios.js` (instancia con `baseURL` y header `Authorization`)

### Donde estan las llamadas

- Auth: `auth.api.js`
- Inventario general: `modems.api.js`, `pcs_laptops.api.js`, `monitores.api.js`,
  `tablets.api.js`, `celulares.api.js`, `chips.api.js`
- Asignaciones: `asignaciones.api.js`
- Usuarios/Colaboradores/Areas: `usuarios.api.js`, `colaboradores.api.js`, `areas.api.js`

Cada archivo expone funciones por recurso (listado, crear, actualizar, estado).
