# GEPN App - Aplicación Móvil React Native

Aplicación móvil para el Sistema de Gestión Policial (GEPN) desarrollada con React Native y TypeScript.

## 📋 Requisitos Previos

- Node.js >= 16
- npm o yarn
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS, solo en macOS)
- Go (para el backend)

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

o

```bash
yarn install
```

### 2. Instalar dependencias de iOS (solo macOS)

```bash
cd ios
pod install
cd ..
```

## 🔧 Configuración

### Configurar URL del Backend

Edita el archivo `src/services/apiService.ts` y cambia la constante `API_BASE_URL`:

```typescript
const API_BASE_URL = 'http://tu-servidor:8080';
```

Para desarrollo local en Android, usa `http://10.0.2.2:8080` en lugar de `localhost`.

### Agregar Imágenes al HomeScreen

El HomeScreen requiere las siguientes imágenes en `src/assets/images/`:

- `bandera-venezuela.png` - Bandera de Venezuela
- `policias-tacticos.png` - Imagen de policías tácticos
- `patrullas.png` - Imagen de patrullas policiales

Consulta `src/assets/images/INSTRUCCIONES.md` para más detalles.

**Nota**: Si las imágenes no están disponibles, la app funcionará normalmente pero sin mostrar las imágenes.

## 📱 Ejecutar la Aplicación

### Android

```bash
npm run android
```

o

```bash
yarn android
```

### iOS (solo macOS)

```bash
npm run ios
```

o

```bash
yarn ios
```

## 🏗️ Estructura del Proyecto

```
GEPNApp/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Pantalla inicial con botón de login
│   │   ├── LoginPolicialScreen.tsx # Login con credencial y PIN
│   │   └── DashboardScreen.tsx     # Dashboard con menú y botón de pánico
│   └── services/
│       ├── apiService.ts           # Servicios de API
│       └── locationService.ts      # Servicios de ubicación
├── android/                         # Configuración Android
├── ios/                            # Configuración iOS
├── App.tsx                         # Componente principal
└── package.json
```

## 📱 Pantallas

### HomeScreen
- Pantalla inicial de la aplicación
- Botón "Iniciar Sesión" que navega a la pantalla de login policial

### LoginPolicialScreen
- Ruta: `/policial` (oculta, accesible desde HomeScreen)
- Campos:
  - **Credencial**: Campo de texto para credencial del oficial
  - **PIN**: Campo numérico de 6 dígitos (oculto)
- Funcionalidades:
  - Validación de campos
  - Solicitud automática de permisos GPS al hacer login
  - Navegación al Dashboard tras login exitoso

### DashboardScreen
- Pantalla principal después del login
- **4 botones en grid**:
  - Detenidos
  - Minutas
  - Búsqueda
  - Más Buscados
- **Botón de Pánico**:
  - Color rojo (#FF3B30)
  - Ubicado en la parte inferior, centrado
  - Requiere mantener presionado durante 5 segundos
  - Al activarse, envía POST a `/api/panico/activar` con:
    ```json
    {
      "latitud": 0.0,
      "longitud": 0.0,
      "ubicacion": "Dirección"
    }
    ```

## 🔐 Permisos

### Android
Los permisos de ubicación están configurados en `android/app/src/main/AndroidManifest.xml`:
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`

### iOS
Los permisos están configurados en `ios/GEPNApp/Info.plist`:
- `NSLocationWhenInUseUsageDescription`
- `NSLocationAlwaysAndWhenInUseUsageDescription`

## 📦 Generar APK para Android

### APK de Debug

```bash
cd android
./gradlew assembleDebug
```

El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### APK de Release

```bash
cd android
./gradlew assembleRelease
```

El APK se generará en: `android/app/build/outputs/apk/release/app-release.apk`

**Nota**: Para producción, necesitarás configurar un keystore de firma. Consulta la [documentación oficial de React Native](https://reactnative.dev/docs/signed-apk-android).

## 🔌 API Endpoints

### Login Policial
```
POST /api/policial/login
Body: {
  "credencial": "string",
  "pin": "string"
}
Response: {
  "token": "string"
}
```

### Activar Pánico
```
POST /api/panico/activar
Headers: {
  "Authorization": "Bearer {token}"
}
Body: {
  "latitud": 0.0,
  "longitud": 0.0,
  "ubicacion": "string"
}
```

## 🛠️ Tecnologías Utilizadas

- **React Native** 0.72.6
- **TypeScript** 4.8.4
- **React Navigation** 6.x
- **Axios** - Cliente HTTP
- **AsyncStorage** - Almacenamiento local
- **@react-native-community/geolocation** - Servicios de ubicación

## 📝 Notas de Desarrollo

### Cambiar URL del Backend
Edita `src/services/apiService.ts` línea 5:
```typescript
const API_BASE_URL = 'http://tu-servidor:puerto';
```

### Desarrollo Local Android
Si estás ejecutando el backend en localhost, usa:
```typescript
const API_BASE_URL = 'http://10.0.2.2:8080';
```

### Desarrollo Local iOS
Para iOS, puedes usar:
```typescript
const API_BASE_URL = 'http://localhost:8080';
```

## 🐛 Solución de Problemas

### Error de permisos en Android
Asegúrate de que los permisos estén en `AndroidManifest.xml` y que la app solicite permisos en tiempo de ejecución.

### Error de conexión al backend
- Verifica que el backend esté corriendo
- Verifica la URL en `apiService.ts`
- Para Android, usa `10.0.2.2` en lugar de `localhost`
- Verifica que el dispositivo/emulador tenga conexión a internet

### Error de build en Android
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Error de build en iOS
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Desarrollo

Para más información sobre el backend, consulta la documentación del servidor Go.

