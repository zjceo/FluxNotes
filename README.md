# 📝 FluxNotes

**FluxNotes** es una aplicación de notas moderna y multiplataforma construida con React Native (Expo) y un backend API REST con Node.js, Express y PostgreSQL.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.73.6-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~50.0.0-000020.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)

## 🚀 Características

- ✅ Crear, editar y eliminar notas
- 📱 Aplicación móvil nativa (Android/iOS)
- 🎨 Interfaz moderna con TailwindCSS (NativeWind)
- 🔄 Sincronización con backend PostgreSQL
- 📤 Exportar y compartir notas
- ⭐ Marcar notas como favoritas
- 🌙 Soporte para modo oscuro (próximamente)

## 📁 Estructura del Proyecto

```
FluxNotes/
├── app/              # Aplicación móvil React Native (Expo)
├── server/           # Backend API REST (Node.js + Express + PostgreSQL)
└── README.md         # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Frontend (App)

- **React Native** con **Expo**
- **TypeScript**
- **Expo Router** (navegación basada en archivos)
- **NativeWind** (TailwindCSS para React Native)
- **Zustand** (gestión de estado)
- **Axios** (cliente HTTP)

### Backend (Server)

- **Node.js** con **Express**
- **TypeScript**
- **PostgreSQL** (base de datos)
- **pg** (cliente PostgreSQL)
- **dotenv** (variables de entorno)

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18 o superior
- **npm** o **yarn**
- **PostgreSQL** 14 o superior
- **Expo CLI** (opcional, se puede usar `npx`)
- **Android Studio** (para desarrollo Android) o **Xcode** (para desarrollo iOS)

## 🚀 Inicio Rápido

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/zjceo/FluxNotes.git
cd FluxNotes
```

### 2️⃣ Configurar el Backend

```bash
cd server
npm install
```

Crea un archivo `.env` en la carpeta `server/` (ver [server/README.md](./server/README.md) para más detalles):

```env
DB_USER=tu_usuario
DB_HOST=localhost
DB_NAME=fluxnotes
DB_PASSWORD=tu_password
DB_PORT=5432
PORT=3000
```

Inicia el servidor:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### 3️⃣ Configurar la App

```bash
cd ../app
npm install
```

Crea un archivo `.env` en la carpeta `app/` (ver [app/README.md](./app/README.md) para más detalles):

```env
EXPO_PUBLIC_API_IP=192.168.1.X  # Tu IP local
EXPO_PUBLIC_API_PORT=3000
```

Inicia la aplicación:

```bash
npm start
```

Escanea el código QR con **Expo Go** (Android/iOS) o ejecuta en un emulador:

```bash
npm run android  # Para Android
npm run ios      # Para iOS
```

## 📚 Documentación Adicional

- **[App README](./app/README.md)** - Documentación detallada de la aplicación móvil
- **[Server README](./server/README.md)** - Documentación detallada del backend API

## 🗄️ Base de Datos

La base de datos PostgreSQL se inicializa automáticamente al iniciar el servidor por primera vez. El esquema incluye:

- **notes**: Tabla principal de notas con campos:
  - `id` (UUID)
  - `title` (VARCHAR)
  - `content` (TEXT)
  - `category` (VARCHAR)
  - `is_favorite` (BOOLEAN)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**zjceo**

- GitHub: [@zjceo](https://github.com/zjceo)
- Repositorio: [FluxNotes](https://github.com/zjceo/FluxNotes.git)

## 🙏 Agradecimientos

- Expo Team por su increíble framework
- Comunidad de React Native
- Todos los contribuidores de código abierto

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
