# 🚀 Cómo Ejecutar la Aplicación React Native

## ⚠️ IMPORTANTE: React Native NO se ejecuta en un navegador web

React Native es para aplicaciones móviles (Android/iOS), **NO** para navegadores web. No puedes abrir una URL en el navegador para ver la app.

## 📱 Opciones para Ejecutar la App

### Opción 1: Emulador Android (Recomendado para Windows)

#### Paso 1: Instalar Android Studio
1. Descarga Android Studio: https://developer.android.com/studio
2. Instálalo y configura el Android SDK
3. Abre Android Studio → Configure → SDK Manager
4. Instala Android SDK Platform y Android Virtual Device (AVD)

#### Paso 2: Crear un Emulador
1. En Android Studio: Tools → Device Manager
2. Clic en "Create Device"
3. Selecciona un dispositivo (ej: Pixel 5)
4. Selecciona una imagen del sistema (ej: Android 13)
5. Clic en "Finish"

#### Paso 3: Instalar Dependencias del Proyecto
```bash
cd "C:\Users\puent\OneDrive\Desktop\RealFrontend.G.E.P.N"
npm install
```

#### Paso 4: Iniciar el Emulador
1. Abre Android Studio
2. Ve a Device Manager
3. Inicia el emulador que creaste

#### Paso 5: Ejecutar la App
```bash
# Terminal 1: Iniciar Metro Bundler
npm start

# Terminal 2: Ejecutar en Android
npm run android
```

### Opción 2: Dispositivo Android Físico

#### Paso 1: Habilitar Modo Desarrollador
1. Ve a Configuración → Acerca del teléfono
2. Toca "Número de compilación" 7 veces
3. Activa "Opciones de desarrollador"
4. Activa "Depuración USB"

#### Paso 2: Conectar el Dispositivo
1. Conecta tu teléfono por USB
2. Verifica que esté conectado:
```bash
adb devices
```

#### Paso 3: Ejecutar la App
```bash
npm start
npm run android
```

### Opción 3: Expo Go (Más Fácil - Alternativa)

Si quieres una forma más fácil de probar, puedes usar Expo:

```bash
# Instalar Expo CLI
npm install -g expo-cli

# En el proyecto, instalar Expo
npm install expo

# Ejecutar
npx expo start
```

Luego escanea el código QR con la app Expo Go en tu teléfono.

## 🔧 Verificar que Todo Esté Correcto

### 1. Verificar Node.js
```bash
node --version
# Debe ser >= 16
```

### 2. Verificar que las Dependencias Estén Instaladas
```bash
npm install
```

### 3. Verificar Android SDK
```bash
# Verificar que ANDROID_HOME esté configurado
echo $ANDROID_HOME  # Linux/Mac
echo %ANDROID_HOME%  # Windows
```

### 4. Verificar que el Emulador/Dispositivo Esté Conectado
```bash
adb devices
# Debe mostrar tu dispositivo o emulador
```

## 🐛 Solución de Problemas

### Error: "Unable to resolve module"
```bash
npm start -- --reset-cache
```

### Error: "SDK location not found"
Configura la variable de entorno `ANDROID_HOME`:
- Windows: `C:\Users\TuUsuario\AppData\Local\Android\Sdk`
- Agrega a Variables de Entorno del Sistema

### Error: "No devices found"
```bash
# Verificar dispositivos
adb devices

# Si no aparece, reinicia adb
adb kill-server
adb start-server
```

### La app no se abre en el emulador
1. Verifica que Metro Bundler esté corriendo (`npm start`)
2. Verifica que el emulador esté encendido
3. Intenta cerrar y abrir la app manualmente en el emulador

### Error de compilación
```bash
cd android
./gradlew clean
cd ..
npm run android
```

## 📝 Notas Importantes

1. **NO puedes abrir la app en un navegador web** - React Native es solo para móviles
2. **Necesitas un emulador o dispositivo físico** para ver la app
3. **Metro Bundler debe estar corriendo** antes de ejecutar la app
4. **La primera vez puede tardar** en compilar (5-10 minutos)

## 🎯 Pasos Rápidos (Resumen)

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar Metro Bundler (Terminal 1)
npm start

# 3. Ejecutar en Android (Terminal 2)
npm run android
```

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica que Android Studio esté instalado
2. Verifica que un emulador esté corriendo o un dispositivo esté conectado
3. Revisa los errores en la consola de Metro Bundler
4. Revisa `SOLUCION_PROBLEMAS.md` para más ayuda

