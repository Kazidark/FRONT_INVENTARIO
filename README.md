# Inventario Front

Guia rapida para levantar el frontend en desarrollo.

## Requisitos

- Node.js 18+ (recomendado)
- npm 9+ (incluido con Node)

## Instalacion

En la carpeta del proyecto:

```bash
npm install
```

## Estructura de carpetas

Estructura organizada por funcionalidades y capas compartidas:

```
src/
  app/
    App.jsx                 # router principal y layout base
  features/
    auth/
      pages/
    modems/
      components/
    pcs-laptops/
      components/
      pages/
    monitores/
      components/
      pages/
    tablets/
      components/
      pages/
    celulares/
      components/
      pages/
    chips/
      components/
      pages/
    asignaciones/
      components/
      pages/
    usuarios/
      components/
      pages/
    colaboradores/
      components/
      pages/
  services/
    api/                    # clientes y funciones de API
  shared/
    components/             # UI reutilizable + layout
    context/                # contextos globales
  styles/
    global.css
  main.jsx                  # entry de React
```

### Reglas rapidas

- Cada feature vive en `src/features/<feature>/` con `pages/` y `components/`.
- Las pantallas siempre en `pages/` y los componentes del dominio en `components/`.
- Todo lo reutilizable va en `src/shared`.
- Las peticiones HTTP se concentran en `src/services/api`.
- Estilos globales en `src/styles/global.css`.

## Levantar en desarrollo

```bash
npm run dev
```

Luego abrir la URL que imprime la consola (normalmente `http://localhost:5173`).

## Build de produccion

```bash
npm run build
```

## Preview de produccion

```bash
npm run preview
```

## Comandos utiles

- `npm run lint` valida el codigo con ESLint.

## Notas

Si el frontend consume una API, configurar la URL en las variables de entorno
que use el proyecto (por ejemplo `VITE_API_URL`) segun el archivo `.env`.
