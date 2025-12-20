# Estructura del Proyecto React Native - GEPN App

## 📍 Ubicación del Proyecto

**Ruta del proyecto frontend:**
```
C:\Users\puent\OneDrive\Desktop\RealFrontend.G.E.P.N
```

Este es el proyecto React Native (frontend móvil).

## 📁 Estructura de Archivos

```
RealFrontend.G.E.P.N/
├── App.tsx                    # ✅ Componente principal con navegación
├── index.js                   # ✅ Punto de entrada (registra la app)
├── app.json                   # ✅ Configuración del nombre de la app
├── package.json              # ✅ Dependencias y scripts
├── tsconfig.json             # ✅ Configuración TypeScript
├── babel.config.js           # ✅ Configuración Babel
├── metro.config.js           # ✅ Configuración Metro Bundler
│
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx          # ✅ Pantalla inicial
│   │   ├── LoginPolicialScreen.tsx # ✅ Pantalla de login
│   │   └── DashboardScreen.tsx     # ✅ Dashboard principal
│   │
│   ├── services/
│   │   ├── apiService.ts           # ✅ Servicios de API
│   │   └── locationService.ts     # ✅ Servicios de ubicación
│   │
│   ├── assets/
│   │   └── images/                 # 📁 Carpeta para imágenes
│   │
│   └── types/
│       └── navigation.ts          # ✅ Tipos de navegación
│
├── android/                   # ✅ Configuración Android
└── ios/                       # ✅ Configuración iOS
```

## ✅ Archivos Principales Verificados

### 1. `index.js` - Punto de Entrada
```javascript
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```
✅ **Correcto** - Registra el componente App correctamente

### 2. `App.tsx` - Componente Principal
```typescript
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import LoginPolicialScreen from './src/screens/LoginPolicialScreen';
import DashboardScreen from './src/screens/DashboardScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="LoginPolicial" component={LoginPolicialScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
```
✅ **Correcto** - Configuración completa con navegación

### 3. `app.json` - Configuración
```json
{
  "name": "GEPNApp",
  "displayName": "GEPN App"
}
```
✅ **Correcto** - Nombre de la app configurado

## 🚀 Cómo Ejecutar el Proyecto

### Paso 1: Navegar al directorio del proyecto
```bash
cd "C:\Users\puent\OneDrive\Desktop\RealFrontend.G.E.P.N"
```

### Paso 2: Instalar dependencias (si no lo has hecho)
```bash
npm install
```

### Paso 3: Iniciar Metro Bundler
```bash
npm start
```

### Paso 4: Ejecutar en Android (en otra terminal)
```bash
npm run android
```

### Paso 5: Ejecutar en iOS (solo macOS, en otra terminal)
```bash
npm run ios
```

## 🔍 Verificación Rápida

Para verificar que todo está correcto:

1. **Verificar que index.js existe y está correcto:**
   ```bash
   cat index.js
   ```

2. **Verificar que App.tsx existe y está correcto:**
   ```bash
   cat App.tsx
   ```

3. **Verificar dependencias instaladas:**
   ```bash
   npm list --depth=0
   ```

4. **Verificar que no hay errores de TypeScript:**
   ```bash
   npx tsc --noEmit
   ```

## ⚠️ Problemas Comunes

### 1. "Unable to resolve module"
**Solución:**
```bash
npm start -- --reset-cache
```

### 2. "Metro bundler has encountered an error"
**Solución:**
```bash
watchman watch-del-all
npm start -- --reset-cache
```

### 3. La app no se abre
**Verificar:**
- Metro Bundler está corriendo (`npm start`)
- Emulador/dispositivo está conectado (`adb devices`)
- No hay errores en la consola de Metro

### 4. Errores de compilación
**Solución:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

## 📝 Notas Importantes

1. **Este es el proyecto FRONTEND (React Native)**
   - Ubicación: `C:\Users\puent\OneDrive\Desktop\RealFrontend.G.E.P.N`
   - Es diferente del backend (que probablemente está en otra carpeta)

2. **El proyecto está completo y funcional:**
   - ✅ Navegación configurada
   - ✅ Pantallas creadas
   - ✅ Servicios de API configurados
   - ✅ Permisos GPS configurados

3. **Las imágenes son opcionales:**
   - La app funciona sin imágenes
   - Para agregar imágenes, colócalas en `src/assets/images/`

## 🔗 Enlaces Útiles

- Repositorio GitHub: https://github.com/JosuePuentes/Frontend.G.E.P.N
- Documentación React Native: https://reactnative.dev/docs/getting-started

