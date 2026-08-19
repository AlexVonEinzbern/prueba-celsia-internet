# Celsia Internet — Webapp

Frontend de la prueba técnica para Celsia Internet S.A.S. Aplicación interna
para gestionar clientes y los servicios que tienen contratados.

## Stack

- Vite + React 19 + TypeScript (React Compiler habilitado)
- React Hook Form + Zod (validación de formularios)
- CSS puro (sin frameworks de UI)
- pnpm como gestor de paquetes

## Secciones

- **Clientes**: CRUD completo de clientes.
- **Servicios**: contratación, consulta, actualización y eliminación de los
  servicios de un cliente seleccionado.
- **Consulta**: búsqueda de un cliente por número de identificación con sus
  datos y servicios contratados.

## Configuración

```bash
cp .env.example .env
```

`VITE_API_URL` define el origen de la API REST (por defecto
`http://127.0.0.1:8000`).

> La API no expone cabeceras CORS. Por eso el navegador nunca llama a la API
> directamente: las peticiones van a rutas relativas `/api/...` del mismo
> origen y un proxy las reenvía al backend (Vite en desarrollo, nginx en
> producción).

## Desarrollo

```bash
pnpm install
pnpm dev
```

Scripts: `pnpm dev` (servidor de desarrollo), `pnpm build` (typecheck + build),
`pnpm lint` (Oxlint), `pnpm preview`.

## Docker

```bash
docker compose up --build
```

La aplicación queda disponible en `http://localhost:8080`. nginx sirve el
build estático y actúa como proxy inverso de `/api` hacia la API publicada en
el host (`host.docker.internal:8000`), por lo que la API debe estar corriendo
en la máquina anfitriona.

## Arquitectura

```
src/
├── app/            # App y navegación por estado (sin router)
├── components/
│   ├── layout/     # Header, Sidebar, PageContainer
│   └── ui/         # Button, Input, Select, Modal, Table, Alert, Spinner
├── features/
│   ├── clientes/   # components, hooks, schemas (Zod), services, types
│   ├── servicios/
│   └── consulta/
├── lib/
│   ├── api/        # cliente fetch centralizado + errores HTTP normalizados
│   └── utils/      # fechas y formateadores
├── constants/      # tipos de identificación y catálogo de servicios
└── pages/          # ClientesPage, ServiciosPage, ConsultaPage
```

Responsabilidades: los **services** son los únicos que hablan HTTP (a través
del cliente de `lib/api`); los **hooks** coordinan estado, carga y errores;
los **componentes** solo renderizan y manejan interacción.

### Manejo de errores de la API

`lib/api/errors.ts` traduce las respuestas de la API a mensajes de usuario:

- Registro duplicado (la API responde 400, o 409) → **"El registro ya existe"**.
- 404 → detalle devuelto por la API.
- 422 → mensajes de validación de FastAPI resumidos por campo.
- 5xx → error genérico de servidor; fallo de red → error de conexión.
