# 🌐 Ejecutar la Aplicación en Navegador Web

La aplicación ahora también funciona en navegadores web, además de Android e iOS.

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias, incluyendo `react-native-web` y `webpack`.

## 🌐 Ejecutar en Navegador

### Desarrollo

```bash
npm run web
```

Esto iniciará un servidor de desarrollo en `http://localhost:3000` y abrirá automáticamente tu navegador.

### Producción

```bash
npm run web:build
```

Esto creará una versión optimizada en la carpeta `dist/` que puedes servir con cualquier servidor web estático.

## 📱 Ejecutar en Móvil

### Android

```bash
npm run android
```

### iOS (solo macOS)

```bash
npm run ios
```

## 🔧 Características Web

- ✅ Funciona en todos los navegadores modernos
- ✅ Diseño responsive (se adapta a diferentes tamaños de pantalla)
- ✅ Geolocalización usando la API del navegador
- ✅ Mismo código que la versión móvil

## ⚠️ Limitaciones en Web

Algunas funcionalidades pueden comportarse diferente en web:

1. **Geolocalización**: Usa la API del navegador en lugar de la librería nativa
2. **Permisos**: Se solicitan a través del navegador
3. **Almacenamiento**: Usa `localStorage` en lugar de `AsyncStorage` (automático con react-native-web)

## 🐛 Solución de Problemas

### Error: "Cannot find module 'webpack'"

```bash
npm install
```

### Error: "Port 3000 is already in use"

Cambia el puerto en `webpack.config.js`:

```javascript
devServer: {
  port: 3001, // Cambia el puerto
}
```

### La app no carga en el navegador

1. Verifica que no haya errores en la consola del navegador
2. Verifica que el servidor esté corriendo
3. Intenta limpiar la caché del navegador

### Geolocalización no funciona

Asegúrate de que:
1. El navegador soporte geolocalización
2. Hayas dado permisos de ubicación al sitio
3. Estés usando HTTPS (requerido en producción)

## 📝 Notas

- La aplicación se ejecuta en `http://localhost:3000` por defecto
- Los cambios se recargan automáticamente (hot reload)
- Puedes usar las herramientas de desarrollo del navegador para depurar

