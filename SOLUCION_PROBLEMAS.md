# Solución de Problemas - GEPN App

## La aplicación no se abre / No inicia

### 1. Verificar que las dependencias estén instaladas

```bash
npm install
```

o

```bash
yarn install
```

### 2. Limpiar caché y reinstalar

```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install

# Para Android, limpiar build
cd android
./gradlew clean
cd ..
```

### 3. Verificar que Metro esté corriendo

En una terminal, ejecuta:

```bash
npm start
```

Luego en otra terminal:

```bash
npm run android
```

### 4. Verificar errores en la consola

Revisa la consola de Metro Bundler y la consola de Android Studio / Xcode para ver errores específicos.

### 5. Problemas comunes con imágenes

Si las imágenes no están disponibles, la app debería funcionar sin ellas. Si hay errores relacionados con imágenes:

1. Asegúrate de que las imágenes estén en `src/assets/images/`
2. O comenta las líneas de `require` en `HomeScreen.tsx` (ya están comentadas por defecto)

### 6. Verificar configuración de Android

Asegúrate de que:
- Android Studio esté instalado
- Android SDK esté configurado
- Un emulador esté corriendo o un dispositivo esté conectado

```bash
adb devices
```

### 7. Verificar configuración de iOS (solo macOS)

```bash
cd ios
pod install
cd ..
```

### 8. Rebuild completo

```bash
# Android
cd android
./gradlew clean
./gradlew assembleDebug
cd ..

# Luego ejecutar
npm run android
```

## Errores específicos

### Error: "Unable to resolve module"

```bash
npm start -- --reset-cache
```

### Error: "Metro bundler has encountered an error"

```bash
watchman watch-del-all
npm start -- --reset-cache
```

### Error relacionado con imágenes

Las imágenes están configuradas como opcionales. Si no están disponibles, simplemente no se mostrarán. Para agregarlas:

1. Coloca las imágenes en `src/assets/images/`
2. Descomenta las líneas de `require` en `HomeScreen.tsx`

## Verificar que la app compile

```bash
# Verificar TypeScript
npx tsc --noEmit

# Verificar linting
npm run lint
```

