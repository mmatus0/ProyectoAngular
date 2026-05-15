# EvalCoach — Plataforma de Gestión de Evaluaciones

---

## Base de Datos

El proyecto usa la base de datos **`coachingnew`** (`.sql`) el cual se encuentra dentro de la carpeta `database`.

Para levantar con XAMPP debe crear una base de datos llamada `coachingnew` y luego importar el `.sql` en ella.
Luego, debe dejar runneada la base de datos y seguir los pasos:

---

## Levantar Backend

```bash
cd backend
npm install
```

Editar el archivo `.env` con los datos de conexión:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coachingnew
DB_USER=root
DB_PASSWORD=
JWT_SECRET=evalcoach_secret_2026
JWT_EXPIRES_IN=8h
```

Luego levanta el servidor:

```bash
npm run dev
```

> Debe aparecer: `Backend EvalCoach corriendo en http://localhost:3000`

---

## Levantar Frontend

```bash
cd frontend
npm install
ng serve -o
```

Abre automáticamente `http://localhost:4200`

> **Nota:** El backend debe estar corriendo antes de levantar el frontend.

---

## Docker

Para levantar con Docker, solo basta con tener ejecutado la app **Docker Desktop** y ejecutar el siguiente comando en la carpeta raíz del proyecto:

```bash
docker-compose up --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:3000/api |

---

## Credenciales de Prueba

| Campo | Valor |
|---|---|
| Usuario | `admin@evalcoach.cl` |
| Contraseña | `password` |
| Rol | Administrador (acceso completo) |

---

## Funcionalidades Implementadas

### Login
- Formulario reactivo con validaciones
- Acepta usuario o email
- JWT almacenado en localStorage
- Interceptor HTTP que agrega el token automáticamente
- Guard que protege rutas privadas


### Gestión de Usuarios (CRUD completo)

- Listado con tabs **Activos / Inactivos**
- Buscador en tiempo real (pipe personalizado)
- Badges de rol con colores
- **Crear usuario** — modal con Reactive Form (datos generales, datos personales, membresía)
- **Editar usuario** — mismo modal con datos precargados
- **Desactivar usuario** — modal de confirmación (estado_id = 2)
- **Activar usuario** — modal de confirmación (estado_id = 1)
- **Carga Masiva** — suba `.xlsx` o `.csv` y crea/actualiza usuarios
- **Exportar Excel** — descargue la tabla actual como `.xlsx`
- **Plantilla de carga** — descargue el archivo base para rellenar

---

## Integrantes

| Nombre |
|---|
| Benjamín Castillo Molina |
| Gonzalo Matus Muñoz |
| Constanza Venegas Osses |
