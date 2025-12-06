# 📱 FluxNotes - Aplicación Móvil

Aplicación móvil multiplataforma de FluxNotes construida con **React Native**, **Expo** y **TypeScript**.

## 🎯 Características

- ✨ Interfaz moderna y fluida con **NativeWind** (TailwindCSS)
- 📝 Gestión completa de notas (CRUD)
- ⭐ Sistema de favoritos
- 📂 Organización por categorías
- 📤 Exportar y compartir notas
- 🔄 Sincronización con backend API
- 📱 Navegación con **Expo Router** (file-based routing)
- 🎨 Componentes reutilizables y modulares

## 🛠️ Stack Tecnológico

- **React Native** 0.73.6
- **Expo** ~50.0.0
- **TypeScript** 5.1.3
- **Expo Router** ~3.4.0 (navegación)
- **NativeWind** 4.2.1 (TailwindCSS)
- **Zustand** 4.4.0 (gestión de estado)
- **Axios** 1.6.0 (cliente HTTP)
- **React Native Gesture Handler** ~2.14.0
- **React Native Reanimated** ~3.6.2

## 📋 Requisitos Previos

- **Node.js** 18 o superior
- **npm** o **yarn**
- **Expo CLI** (opcional, se puede usar `npx expo`)
- **Android Studio** (para Android) o **Xcode** (para iOS)
- Un dispositivo físico con **Expo Go** instalado, o un emulador

## 🚀 Instalación

### 1️⃣ Instalar Dependencias

```bash
cd app
npm install
```

### 2️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz de la carpeta `app/`:

```env
# IP de tu computadora en la red local (no uses localhost)
# Encuentra tu IP con: ipconfig (Windows) o ifconfig (Mac/Linux)
EXPO_PUBLIC_API_IP=192.168.1.100

# Puerto del servidor backend
EXPO_PUBLIC_API_PORT=3000
```

> **⚠️ Importante**: Usa tu IP local real, no `localhost` ni `127.0.0.1`, ya que la app móvil necesita acceder al servidor desde la red.

### 3️⃣ Iniciar el Servidor de Desarrollo

```bash
npm start
```

Esto abrirá **Expo DevTools** en tu navegador.

### 4️⃣ Ejecutar en Dispositivo/Emulador

#### Opción A: Dispositivo Físico (Recomendado)

1. Instala **Expo Go** desde:

   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)

2. Escanea el código QR desde la terminal o Expo DevTools

#### Opción B: Emulador Android

```bash
npm run android
```

#### Opción C: Simulador iOS (solo macOS)

```bash
npm run ios
```

## 📁 Estructura del Proyecto

```
app/
├── app/                      # Rutas de la aplicación (Expo Router)
│   ├── (drawer)/            # Layout con drawer navigation
│   │   ├── _layout.tsx      # Configuración del drawer
│   │   ├── index.tsx        # Pantalla principal (Home)
│   │   └── favorites.tsx    # Pantalla de favoritos
│   └── _layout.tsx          # Layout raíz
├── src/
│   ├── components/          # Componentes reutilizables
│   │   └── NoteCard.tsx     # Tarjeta de nota
│   ├── services/            # Servicios y lógica de negocio
│   │   └── api.ts           # Cliente API (Axios)
│   ├── store/               # Estado global (Zustand)
│   │   └── useNotesStore.ts # Store de notas
│   └── types/               # Tipos TypeScript
│       └── index.ts         # Definiciones de tipos
├── assets/                  # Imágenes, fuentes, etc.
├── .env                     # Variables de entorno (NO subir a git)
├── .env.example             # Ejemplo de variables de entorno
├── app.json                 # Configuración de Expo
├── babel.config.js          # Configuración de Babel
├── tailwind.config.js       # Configuración de TailwindCSS
├── tsconfig.json            # Configuración de TypeScript
└── package.json             # Dependencias y scripts
```

## 🔧 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en web (experimental)
npm run web
```

## 🌐 Configuración de API

La aplicación se conecta al backend mediante las variables de entorno:

```typescript
// src/services/api.ts
const API_URL = `http://${process.env.EXPO_PUBLIC_API_IP}:${process.env.EXPO_PUBLIC_API_PORT}/api`;
```

Asegúrate de que:

1. El servidor backend esté corriendo en `http://localhost:3000`
2. Tu dispositivo/emulador esté en la misma red que tu computadora
3. El firewall permita conexiones al puerto 3000

## 🎨 Personalización de Estilos

Este proyecto usa **NativeWind** (TailwindCSS para React Native). Puedes personalizar los estilos en:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tus colores personalizados
      },
    },
  },
  plugins: [],
};
```

## 🐛 Solución de Problemas

### Error: "Network request failed"

- Verifica que el servidor backend esté corriendo
- Asegúrate de usar tu IP local real en `.env`, no `localhost`
- Verifica que el firewall permita conexiones al puerto 3000

### Error: "Unable to resolve module"

```bash
# Limpia la caché y reinstala
rm -rf node_modules
npm install
npx expo start --clear
```

### Error de compilación Android

```bash
cd android
./gradlew clean
cd ..
npm run android
```

## 📱 Navegación

La aplicación usa **Expo Router** con navegación basada en archivos:

- `/` - Pantalla principal (lista de notas)
- `/favorites` - Notas favoritas

El drawer lateral permite navegar entre secciones.

## 🔐 Seguridad

- **NO** subas el archivo `.env` a git (ya está en `.gitignore`)
- Usa `.env.example` como plantilla para otros desarrolladores
- En producción, usa variables de entorno seguras

## 📦 Build de Producción

Para crear un build de producción:

```bash
# Android APK
npx eas build --platform android

# iOS IPA
npx eas build --platform ios
```

> Requiere configurar **EAS Build** de Expo. Ver [documentación oficial](https://docs.expo.dev/build/introduction/).

## 🤝 Contribuir

1. Crea una rama para tu feature
2. Sigue las convenciones de código (TypeScript + ESLint)
3. Prueba en Android e iOS antes de hacer PR
4. Documenta cambios importantes

## 📚 Recursos

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)

## 📄 Licencia

MIT

---

Desarrollado con ❤️ usando React Native y Expo
