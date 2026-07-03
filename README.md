# EvalCoach — Plataforma de Gestión de Evaluaciones

---

## Despliegue en producción (Pacheco)

El proyecto está desplegado y operativo en:
**http://pacheco.chillan.ubiobio.cl:8073/login**

> Use cualquiera de las credenciales de la sección "Credenciales de Prueba" más abajo (ambas cuentas son Administrador).

---

## Cómo levantar el proyecto — SOLO con Docker

Esta entrega exige que el proyecto se levante completo (frontend + backend + base de datos) únicamente con Docker Compose, sin necesidad de `npm install`, `ng serve` ni XAMPP.

### Requisitos

- Tener **Docker Desktop** instalado y en ejecución.

### Pasos

1. Clonar el repositorio y ubicarse en la carpeta raíz del proyecto (`ProyectoAngular/`).

2. Crear el archivo `.env` en la raíz, usando `.env.example` como plantilla:

```bash
   cp .env.example .env
```

   Completar `DB_ROOT_PASSWORD`, `DB_USER` y `DB_PASSWORD` con los valores que se quieran usar localmente.

3. Crear el archivo `backend/.env`, usando `backend/.env.example` como plantilla:

```bash
   cp backend/.env.example backend/.env
```

   Para desarrollo local, dejar `DB_HOST=db` (nombre del servicio de MariaDB dentro de la red de Docker — **no** `localhost`, ya que el backend corre dentro de un contenedor). Completar `DB_PASSWORD` con el mismo valor usado en el `.env` de la raíz, y definir `JWT_SECRET`.

   El valor de `CORS_ORIGIN` ya viene con ambos orígenes necesarios (local y Pacheco):
```env
   CORS_ORIGIN=http://localhost:4200,http://pacheco.chillan.ubiobio.cl:8073
```

4. Levantar todo el stack:

```bash
   docker-compose up --build -d
```

   Esto construye y levanta 3 contenedores:

   | Contenedor | Descripción | Puerto expuesto |
   |---|---|---|
   | `evalcoach_db` | MariaDB 10.11, con la base `coachingnew` importada automáticamente desde `database/coachingnew.sql` | interno |
   | `evalcoach_backend` | API Node.js/Express | **8074** |
   | `evalcoach_frontend` | Angular compilado + Nginx | **8073** |

5. Abrir en el navegador: **http://localhost:8073**

   > La app en Docker corre en el puerto **8073**, no en 4200. El backend responde en el puerto **8074**, no en 3000 — esto aplica tanto en local como en Pacheco, ya que ambos entornos usan exactamente el mismo `docker-compose.yml`.

### Apagar / reiniciar

```bash
docker-compose down                 # detener y eliminar contenedores
docker-compose up --build -d        # reconstruir y levantar de nuevo
```

### Verificar que todo esté arriba

```bash
docker ps                           # deben verse los 3 contenedores "Up"
docker logs evalcoach_backend       # debe mostrar "Conectado a MySQL correctamente."
```

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
- Login con JWT, token y sesión centralizados en `AuthService` (signal `token`, método `getAuthHeaders()` consumido por todos los servicios)
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
- Solo pueden asignarse a usuarios con rol **Cliente**

### Herramientas
- Asignación de herramientas a clientes (dual-list)
- Vista cliente: cuadrante interactivo por herramienta
- Activar / desactivar asignaciones
- Solo pueden asignarse a usuarios con rol **Cliente**

### Evaluaciones (Tests)
- Asignación de tests a clientes
- Toma de test con persistencia parcial (upsert)
- Finalización con modal de confirmación
- Resultados con 4 tipos de visualización
- Análisis textual personalizado por tipo de test
- Solo pueden asignarse a usuarios con rol **Cliente**

### Biblioteca
- Documentos digitales (PDF) y contenido audiovisual (URL), asignados a un cliente específico
- Vista "Mi Biblioteca" para clientes, con visor de PDF integrado

### Dashboard
- Métricas en tiempo real diferenciadas por rol (Admin/Coach vs. Cliente)

### Perfil
- Ver y editar datos personales y redes sociales

### FAQ
- Categorías con filtrado dinámico
- Acordeón de preguntas integrado con backend

## Alcance Final de Proyecto

---

## Alcance Final del Proyecto

Respecto a la propuesta inicial, se fue ajustando el alcance durante el desarrollo, priorizando estabilidad en los módulos implementados por sobre la cobertura total de la propuesta inicial:

- **Generación de informes en PDF** (exportar resultados de un cliente junto con información complementaria) fue evaluada y descartada del alcance final debido a su complejidad y tiempo disponible que requería para desarrollarla. Se determinó que su implementación podría comprometer la estabilidad del resto del sistema y se priorizó, en su lugar, desarrollar los módulos de **Dashboard** y **Biblioteca** (documentos digitales y audiovisuales) junto a correcciones generales de lo ya implementado.

- **Gestión de evaluaciones** se implementó como **asignación** de un catálogo fijo de 10 tests psicométricos/organizacionales predefinidos (heredados y migrados del sistema original) a clientes específicos, en vez de una herramienta de creación de tests desde cero. Esto refleja el uso real del sistema por parte del cliente: los instrumentos de evaluación son fijos y validados en vez de crearse nuevos dinámicamente.

El resto de las funcionalidades comprometidas en la propuesta (gestión de usuarios, evaluaciones, sesiones, herramientas, documentos, búsqueda/filtrado y control de acceso por rol) se encuentran implementadas y operativas en su totalidad sin datos harcodeados.

---

## Integrantes

| Nombre |
|---|
| Benjamín Castillo Molina |
| Gonzalo Matus Muñoz |
| Constanza Venegas Osses |