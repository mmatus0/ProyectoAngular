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

### Autenticación y Seguridad
- Login con JWT almacenado en localStorage
- AuthGuard en todas las rutas privadas
- Persistencia de sesión al recargar
- Control de acceso por rol (Admin / Coach / Cliente)
- Sidebar diferenciado por rol

### Usuarios
- Listado Activos / Inactivos con búsqueda en tiempo real
- CRUD completo con modal y Reactive Forms validados
- Carga masiva desde `.xlsx` o `.csv`
- Exportar listado a Excel
- Descarga de plantilla de carga

### Instituciones
- Listado Activos / Inactivos con búsqueda
- CRUD completo con modal
- Carga masiva desde `.xlsx` o `.csv`
- Descarga de plantilla de carga

### Sesiones
- Listado con 3 tabs (Activas / Finalizadas / Inactivas)
- CRUD completo con formulario reactivo validado
- Cronómetro por sesión (start/stop)
- Catastro de actividades por sesión
- Finalización de sesión con persistencia

### Herramientas
- Asignación de herramientas a clientes (dual-list)
- Vista cliente: cuadrante interactivo por herramienta
- Activar / desactivar asignaciones

### Evaluaciones (Tests)
- Asignación de tests a clientes
- Toma de test con persistencia parcial (upsert)
- Finalización con modal de confirmación
- Resultados con 4 tipos de visualización
- Análisis textual personalizado por tipo de test

### Perfil
- Ver y editar datos personales y redes sociales

### FAQ
- Categorías con filtrado dinámico
- Acordeón de preguntas integrado con backend

---

## Integrantes

| Nombre |
|---|
| Benjamín Castillo Molina |
| Gonzalo Matus Muñoz |
| Constanza Venegas Osses |
