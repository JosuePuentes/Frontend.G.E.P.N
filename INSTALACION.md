# Guía de Instalación Rápida - GEPN App

## Pasos Rápidos

### 1. Instalar Node.js y dependencias

Asegúrate de tener Node.js >= 16 instalado.

### 2. Instalar dependencias del proyecto

```bash
npm install
```

### 3. Configurar el backend

Edita `src/services/apiService.ts` y cambia la URL del backend:

```typescript
const API_BASE_URL = 'http://tu-servidor:8080';
```

**Para Android con emulador:**
```typescript
const API_BASE_URL = 'http://10.0.2.2:8080';
```

**Para Android con dispositivo físico:**
```typescript
const API_BASE_URL = 'http://IP-DE-TU-PC:8080';
```

### 4. Ejecutar el backend Go

En otra terminal, ejecuta:
```bash
go run main.go
```

### 5. Ejecutar la app

**Android:**
```bash
npm run android
```

**iOS (solo macOS):**
```bash
cd ios
pod install
cd ..
npm run ios
```

## Generar APK

### APK de Debug
```bash
cd android
./gradlew assembleDebug
```

El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### APK de Release
```bash
cd android
./gradlew assembleRelease
```

El APK estará en: `android/app/build/outputs/apk/release/app-release.apk`

## Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Error en Android: "SDK location not found"
Configura la variable de entorno `ANDROID_HOME` apuntando a tu Android SDK.

### Error en iOS: "Pod install failed"
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### La app no se conecta al backend
- Verifica que el backend esté corriendo
- Verifica la URL en `apiService.ts`
- Para Android, usa `10.0.2.2` en lugar de `localhost`
- Verifica que el dispositivo tenga conexión a internet

