# Celsia API

API REST para la gestión de clientes y sus servicios, construida con **FastAPI**, **SQLAlchemy** y **PostgreSQL**.

## Descripción de la solución

La API expone operaciones CRUD sobre dos entidades relacionadas:

- **Clientes**: identificados por su número de identificación (único).
- **Servicios**: asociados a un cliente (energía, internet, etc.). La relación es `1 cliente → N servicios`.

Los cuerpos de las solicitudes y respuestas utilizan **camelCase** para los campos JSON (p. ej. `tipoIdentificacion`, `fechaNacimiento`, `correoElectronico`).

### Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Mensaje de bienvenida de la API |
| `GET` | `/health` | Verificación de salud de la API |
| `GET` | `/api/clientes` | Lista todos los clientes |
| `POST` | `/api/clientes` | Crea un cliente |
| `GET` | `/api/clientes/{identificacion}` | Obtiene un cliente por identificación |
| `PUT` | `/api/clientes/{identificacion}` | Actualiza un cliente |
| `DELETE` | `/api/clientes/{identificacion}` | Elimina un cliente y sus servicios asociados |
| `GET` | `/api/clientes/{identificacion}/servicios` | Lista los servicios de un cliente |
| `POST` | `/api/clientes/{identificacion}/servicios` | Asocia un servicio a un cliente |
| `GET` | `/api/clientes/{identificacion}/servicios/{servicio}` | Obtiene un servicio específico |
| `PUT` | `/api/clientes/{identificacion}/servicios/{servicio}` | Actualiza un servicio |
| `DELETE` | `/api/clientes/{identificacion}/servicios/{servicio}` | Elimina un servicio |

### Modelo de datos

**`clientes`**

| Columna | Tipo | Restricciones |
|---|---|---|
| `identificacion` | `VARCHAR(20)` | PK |
| `nombres` | `VARCHAR(80)` | NOT NULL |
| `apellidos` | `VARCHAR(80)` | NOT NULL |
| `tipo_identificacion` | `VARCHAR(2)` | NOT NULL |
| `fecha_nacimiento` | `DATE` | NOT NULL |
| `numero_celular` | `VARCHAR(20)` | NOT NULL |
| `correo_electronico` | `VARCHAR(80)` | NOT NULL |

**`servicios`**

| Columna | Tipo | Restricciones |
|---|---|---|
| `identificacion` | `VARCHAR(20)` | PK, FK → `clientes.identificacion` |
| `servicio` | `VARCHAR(80)` | PK |
| `fecha_inicio` | `DATE` | NOT NULL |
| `ultima_facturacion` | `DATE` | NOT NULL |
| `ultimo_pago` | `INTEGER` | NOT NULL, default `0` |

Las tablas se crean automáticamente al iniciar la aplicación.

### Ejemplos de uso

Crear un cliente:

```json
POST /api/clientes
{
  "identificacion": "123456789",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "tipoIdentificacion": "CC",
  "fechaNacimiento": "1990-05-15",
  "numeroCelular": "3001234567",
  "correoElectronico": "juan.perez@example.com"
}
```

Asociar un servicio:

```json
POST /api/clientes/123456789/servicios
{
  "servicio": "Internet",
  "fechaInicio": "2025-01-10",
  "ultimaFacturacion": "2026-08-01",
  "ultimoPago": 150000
}
```

## Configuración

Requisitos:

- [Docker](https://docs.docker.com/engine/install/) y [Docker Compose](https://docs.docker.com/compose/install/)
- Opcional para desarrollo local: [uv](https://docs.astral.sh/uv/) y Python ≥ 3.13

Variables de entorno:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://postgres:postgres@db:5432/celsia_db` |

### Desarrollo local

```bash
uv sync
uv run fastapi dev app/main.py
```

La documentación interactiva (Swagger UI) estará disponible en `http://localhost:8000/docs`.

## Despliegue

### Con Docker Compose (recomendado)

Levanta la base de datos PostgreSQL y la API:

```bash
docker compose up -d
```

- API: `http://localhost:8000`
- Documentación: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432` (db: `celsia_db`, usuario: `celsia_user`, contraseña: `celsia_password`)

Detener los servicios:

```bash
docker compose down
```

Para eliminar también los datos de la base de datos:

```bash
docker compose down -v
```
