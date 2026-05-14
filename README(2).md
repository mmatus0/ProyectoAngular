# EvalCoach — Plataforma de Gestión de Evaluaciones

Plataforma web desarrollada con **Angular 17** (frontend) y **Node.js + Express** (backend), conectada a una base de datos **MySQL** existente.

---

## Estructura del Proyecto

```
ProyectoAngular/
├── frontend/     → Angular 17 (standalone, signals, reactive forms)
├── backend/      → Node.js + Express + JWT + MySQL
└── README.md
```

---

## Requisitos Previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | v18+ |
| npm | v9+ |
| Angular CLI | v17+ |
| MySQL | v8+ |

Instalar Angular CLI globalmente si no lo tienes:
```bash
npm install -g @angular/cli
```

---

## Base de Datos

El proyecto usa la base de datos **`coaching`** (MySQL).  
Importa el archivo SQL antes de levantar el backend:

```bash
mysql -u root -p coaching < coaching.sql
```

O importa el `.sql` desde **phpMyAdmin**.

---

## Levantar el Backend

```bash
cd backend
npm install
```

Edita el archivo `.env` con tus datos de conexión:

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

Debe aparecer:
```
Backend EvalCoach corriendo en http://localhost:3000
```

Verifica que conecta correctamente abriendo en el navegador:
```
http://localhost:3000/api/health
```

Debe responder: `{ "ok": true, "mensaje": "Backend EvalCoach corriendo." }`

---

## Levantar el Frontend

```bash
cd frontend
npm install
ng serve -o
```

Abre automáticamente `http://localhost:4200`

> **Nota:** El backend debe estar corriendo antes de levantar el frontend.

---

## Credenciales de Prueba

### Administrador
| Campo | Valor |
|---|---|
| Usuario | `admin` |
| Contraseña | `password` |
| Rol | Administrador (acceso completo) |

### Cliente
| Campo | Valor |
|---|---|
| Usuario | `mmatus0` |
| Email | `matusgonzalo1544@gmail.com` |
| Contraseña | *(la registrada en la BD)* |
| Rol | Cliente (solo ve Mi Área) |

> El login acepta tanto **nombre de usuario** como **correo electrónico**.

---

## Funcionalidades Implementadas (Entrega 1 — 30%)

### Login
- Formulario reactivo con validaciones
- Acepta usuario o email
- JWT almacenado en localStorage
- Interceptor HTTP que agrega el token automáticamente
- Guard que protege rutas privadas

### Sidebar con Perfilamiento por Rol
| Rol | Secciones visibles |
|---|---|
| Administrador | NAVEGACIÓN completa |
| Coach | NAVEGACIÓN completa |
| Cliente | MI ÁREA (Mis Tests, Mis Herramientas, Mis Sesiones, Mi Perfil) |

### Gestión de Usuarios (CRUD completo)
- Listado con tabs **Activos / Inactivos**
- Buscador en tiempo real (pipe personalizado)
- Badges de rol con colores
- **Crear usuario** — modal con Reactive Form (datos generales, datos personales, membresía)
- **Editar usuario** — mismo modal con datos precargados
- **Desactivar usuario** — modal de confirmación (estado_id = 2)
- **Activar usuario** — modal de confirmación (estado_id = 1)
- **Carga Masiva** — sube `.xlsx` o `.csv` y crea/actualiza usuarios
- **Exportar Excel** — descarga la tabla actual como `.xlsx`
- **Plantilla de carga** — descarga el archivo base para rellenar

---

## Arquitectura Angular

```
frontend/src/app/
├── core/
│   ├── models/          → Interfaces TypeScript por entidad
│   ├── services/        → Un servicio por módulo (HttpClient)
│   ├── guards/          → auth.guard.ts
│   └── interceptors/    → token.interceptor.ts (JWT automático)
├── shared/
│   ├── components/
│   │   ├── sidebar/     → Menú lateral con perfilamiento
│   │   └── topbar/      → Barra superior con nombre y logout
│   └── pipes/
│       └── filtro.pipe.ts
├── layout/
│   └── main-layout      → Shell: sidebar + topbar + router-outlet
└── features/
    ├── auth/login/      → Login con JWT
    ├── dashboard/       → Panel de bienvenida
    ├── usuarios/        → CRUD completo
    └── (otros módulos como stubs)
```

---

## Arquitectura Backend

```
backend/src/
├── config/
│   └── db.js              → Pool de conexión MySQL
├── middlewares/
│   └── auth.middleware.js → Verificación JWT
├── controllers/
│   ├── auth.controller.js    → login, logout, me
│   └── usuario.controller.js → CRUD + carga masiva
├── routes/
│   ├── auth.routes.js
│   └── usuario.routes.js
└── app.js                 → Entry point, CORS, rutas
```

---

## Endpoints API

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/login` | Login (devuelve JWT) |
| POST | `/api/logout` | Logout |
| GET | `/api/me` | Usuario autenticado |

### Usuarios *(requieren token)*
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios?estado=1` | Listar activos o inactivos |
| GET | `/api/usuarios/form-data` | Roles, empresas, membresías |
| GET | `/api/usuarios/:id` | Detalle de usuario |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Desactivar usuario |
| POST | `/api/usuarios/:id/activar` | Activar usuario |
| POST | `/api/usuarios/carga-masiva` | Importar desde xlsx/csv |

---
## Tecnologías

**Frontend**
- Angular 17 (standalone, signals)
- Bootstrap 5.3
- Bootstrap Icons
- xlsx (exportar Excel)

**Backend**
- Node.js + Express
- jsonwebtoken (JWT)
- bcryptjs (hash de contraseñas)
- mysql2 (conexión BD)
- multer + xlsx (carga masiva)
- cors, dotenv

**Base de Datos**
- MySQL 8

---

## Integrantes

| Nombre |
|---|---|
| Benjamín Castillo Molina
| Gonzalo Matus Muñoz 
| Constanza Venegas Osses 


