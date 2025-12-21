# 📸 Cómo Agregar un Logo a la Aplicación

## 📁 Ubicación del Logo

Coloca tu archivo de logo en esta carpeta:
```
src/assets/images/
```

## 📝 Pasos para Agregar el Logo

### Opción 1: Usar el logo como escudo de policía (ya configurado)

1. **Nombra tu logo como:** `escudo-policia.png`
2. **Colócalo en:** `src/assets/images/escudo-policia.png`
3. **Listo!** El logo aparecerá automáticamente en la pantalla de inicio

### Opción 2: Usar un logo con otro nombre

Si quieres usar un nombre diferente (ej: `logo.png`), necesitas actualizar el código:

1. **Coloca tu logo en:** `src/assets/images/logo.png` (o el nombre que prefieras)
2. **Abre el archivo:** `src/screens/HomeScreen.tsx`
3. **Busca la línea 67** y cámbiala:
   ```typescript
   // Cambiar esto:
   escudoPolicia = require('../../assets/images/escudo-policia.png');
   
   // Por esto (usando tu nombre de archivo):
   escudoPolicia = require('../../assets/images/logo.png');
   ```

## 📋 Formatos Soportados

- ✅ PNG (recomendado, soporta transparencia)
- ✅ JPG/JPEG
- ✅ SVG (para web)
- ✅ WEBP

## 📏 Tamaño Recomendado

- **Mínimo:** 200x200 píxeles
- **Recomendado:** 300x300 píxeles o más
- **Máximo:** 500x500 píxeles (para mejor rendimiento)

## 🎨 Ubicación del Logo en la Pantalla

El logo aparece:
- En la parte superior de la pantalla de inicio
- Centrado
- Tamaño: 120x120 píxeles (ajustable en el código)

## 🔧 Personalizar el Tamaño del Logo

Si quieres cambiar el tamaño del logo, edita `src/screens/HomeScreen.tsx`:

Busca la sección `escudoImage` (alrededor de la línea 469) y modifica:
```typescript
escudoImage: {
  width: 150,  // Cambia este valor
  height: 150, // Cambia este valor
  maxWidth: 200,
  maxHeight: 200,
},
```

## 📍 Ejemplo de Estructura de Archivos

```
src/
  assets/
    images/
      escudo-policia.png  ← Coloca tu logo aquí
      logo.png            ← O aquí si usas otro nombre
      README.md
```

## ✅ Verificación

Después de agregar el logo:
1. Guarda el archivo en `src/assets/images/`
2. Si usaste `escudo-policia.png`, aparecerá automáticamente
3. Si usaste otro nombre, actualiza el código como se indica arriba
4. Reinicia la aplicación para ver los cambios

