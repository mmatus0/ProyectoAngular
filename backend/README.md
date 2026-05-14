# EvalCoach — Backend Node.js

Backend REST API para EvalCoach. Se conecta a la base de datos MySQL del proyecto coaching.

## Requisitos

- Node.js v18+
- MySQL corriendo con la base de datos `coaching`

## Instalación

```bash
npm install
```

## Configuración

Edita el archivo `.env`:

```
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coaching
DB_USER=root
DB_PASSWORD=
JWT_SECRET=evalcoach_secret_2026
JWT_EXPIRES_IN=8h
```

## Ejecutar

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Endpoints

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/login | Login con email o usuario |
| POST | /api/logout | Cerrar sesión |
| GET | /api/me | Usuario autenticado |

### Usuarios (requieren token)
| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/usuarios?estado=1 | Listar usuarios |
| GET | /api/usuarios/form-data | Roles, empresas, membresías |
| GET | /api/usuarios/:id | Detalle de usuario |
| POST | /api/usuarios | Crear usuario |
| PUT | /api/usuarios/:id | Actualizar usuario |
| DELETE | /api/usuarios/:id | Desactivar usuario |
| POST | /api/usuarios/:id/activar | Activar usuario |
