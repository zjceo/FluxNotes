# 🚀 FluxNotes - Backend API

API REST para FluxNotes construida con **Node.js**, **Express**, **TypeScript** y **PostgreSQL**.

## 🎯 Características

- ✅ API REST completa para gestión de notas
- 🗄️ Base de datos PostgreSQL
- 🔒 Configuración segura con variables de entorno
- 📊 Endpoint de health check con estado de BD
- 🚀 Hot reload en desarrollo con `ts-node-dev`
- 📝 TypeScript para type safety
- 🌐 CORS habilitado para desarrollo

## 🛠️ Stack Tecnológico

- **Node.js** 18+
- **Express** 4.18.2
- **TypeScript** 5.1.6
- **PostgreSQL** 14+
- **pg** 8.11.3 (cliente PostgreSQL)
- **dotenv** 16.3.1 (variables de entorno)
- **cors** 2.8.5

## 📋 Requisitos Previos

- **Node.js** 18 o superior
- **npm** o **yarn**
- **PostgreSQL** 14 o superior instalado y corriendo

## 🚀 Instalación

### 1️⃣ Instalar Dependencias

```bash
cd server
npm install
```

### 2️⃣ Configurar PostgreSQL

Crea una base de datos para FluxNotes:

```sql
-- Conéctate a PostgreSQL
psql -U postgres

-- Crea la base de datos
CREATE DATABASE fluxnotes;

-- Sal de psql
\q
```

### 3️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz de la carpeta `server/`:

```env
# Configuración de PostgreSQL
DB_USER=postgres
DB_HOST=localhost
DB_NAME=fluxnotes
DB_PASSWORD=tu_password_seguro
DB_PORT=5432

# Puerto del servidor
PORT=3000
```

> **⚠️ IMPORTANTE**:
>
> - **NUNCA** subas el archivo `.env` a git
> - Usa contraseñas seguras en producción
> - El archivo `.env` ya está en `.gitignore`

### 4️⃣ Iniciar el Servidor

#### Modo Desarrollo (con hot reload)

```bash
npm run dev
```

#### Modo Producción

```bash
# Compilar TypeScript a JavaScript
npm run build

# Ejecutar el servidor compilado
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
server/
├── src/
│   ├── db.ts          # Configuración de PostgreSQL y conexión
│   ├── index.ts       # Servidor Express y health check
│   ├── routes.ts      # Rutas de la API
│   └── schema.sql     # Esquema de base de datos
├── dist/              # Código compilado (generado)
├── .env               # Variables de entorno (NO subir a git)
├── .env.example       # Ejemplo de variables de entorno
├── package.json       # Dependencias y scripts
├── tsconfig.json      # Configuración de TypeScript
└── README.md          # Este archivo
```

## 🌐 Endpoints de la API

### Health Check

```http
GET /
```

Retorna una página HTML con el estado de la conexión a la base de datos.

**Respuesta exitosa:**

- Estado de conexión a PostgreSQL
- Versión de PostgreSQL
- Información de la base de datos
- Lista de endpoints disponibles

### Notas

#### Obtener todas las notas

```http
GET /api/notes
```

**Respuesta:**

```json
[
  {
    "id": "uuid",
    "title": "Mi nota",
    "content": "Contenido de la nota",
    "category": "Personal",
    "is_favorite": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Obtener una nota por ID

```http
GET /api/notes/:id
```

**Parámetros:**

- `id` (UUID) - ID de la nota

#### Crear una nota

```http
POST /api/notes
```

**Body:**

```json
{
  "title": "Nueva nota",
  "content": "Contenido de la nota",
  "category": "Trabajo",
  "is_favorite": false
}
```

#### Actualizar una nota

```http
PUT /api/notes/:id
```

**Parámetros:**

- `id` (UUID) - ID de la nota

**Body:**

```json
{
  "title": "Título actualizado",
  "content": "Contenido actualizado",
  "category": "Personal",
  "is_favorite": true
}
```

#### Eliminar una nota

```http
DELETE /api/notes/:id
```

**Parámetros:**

- `id` (UUID) - ID de la nota

## 🗄️ Esquema de Base de Datos

La tabla `notes` se crea automáticamente al iniciar el servidor:

```sql
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

## 🔐 Seguridad

### Variables de Entorno

El archivo `db.ts` usa variables de entorno para la configuración:

```typescript
const dbConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "fluxnotes",
  password: process.env.DB_PASSWORD || "", // ⚠️ NO usar default en producción
  port: parseInt(process.env.DB_PORT || "5432"),
};
```

### Mejores Prácticas

1. **Nunca** hardcodees credenciales en el código
2. Usa el archivo `.env` para desarrollo local
3. En producción, usa variables de entorno del sistema o servicios como:
   - AWS Secrets Manager
   - Azure Key Vault
   - Heroku Config Vars
   - Vercel Environment Variables

## 🐛 Solución de Problemas

### Error: "password authentication failed"

- Verifica que el usuario y contraseña en `.env` sean correctos
- Asegúrate de que PostgreSQL esté corriendo: `pg_ctl status`

### Error: "database does not exist"

```bash
# Crea la base de datos
psql -U postgres -c "CREATE DATABASE fluxnotes;"
```

### Error: "port 3000 already in use"

```bash
# Cambia el puerto en .env
PORT=3001
```

O mata el proceso que usa el puerto 3000:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: "Cannot find module"

```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Despliegue

### Heroku

```bash
# Instala Heroku CLI
npm install -g heroku

# Login
heroku login

# Crea la app
heroku create fluxnotes-api

# Añade PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configura variables de entorno
heroku config:set DB_USER=your_user
heroku config:set DB_PASSWORD=your_password
# ... etc

# Despliega
git push heroku main
```

### Railway / Render

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno en el dashboard
3. Añade un servicio PostgreSQL
4. Despliega automáticamente

## 📊 Monitoreo

El endpoint raíz (`/`) proporciona un dashboard visual con:

- ✅ Estado de conexión a PostgreSQL
- 📊 Versión de PostgreSQL
- 🕐 Hora del servidor
- 📡 Lista de endpoints disponibles
- ❌ Mensajes de error detallados

Visita `http://localhost:3000` en tu navegador para ver el dashboard.

## 🤝 Contribuir

1. Crea una rama para tu feature
2. Sigue las convenciones de TypeScript
3. Prueba todos los endpoints antes de hacer PR
4. Documenta cambios en la API

## 📚 Recursos

- [Express Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📄 Licencia

MIT

---

Desarrollado con ❤️ usando Node.js, Express y PostgreSQL
