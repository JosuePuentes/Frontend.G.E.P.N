# 🚀 Desplegar en Vercel

## Configuración Automática

El proyecto ya está configurado para Vercel. Solo necesitas:

1. **Conectar tu repositorio de GitHub a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio `Frontend.G.E.P.N`
   - Vercel detectará automáticamente la configuración

2. **Configuración en Vercel**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Configuración Manual (si es necesario)

Si Vercel no detecta automáticamente:

1. Ve a Settings → General
2. Configura:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Verificar el Build Localmente

Antes de desplegar, puedes probar el build localmente:

```bash
# Instalar dependencias
npm install

# Hacer build de producción
npm run build

# Verificar que se creó la carpeta dist/
ls dist/
```

Deberías ver:
- `index.html`
- `bundle.[hash].js`
- Otros archivos generados

## Solución de Problemas

### Error: "Build failed"

1. Verifica que todas las dependencias estén instaladas:
```bash
npm install
```

2. Prueba el build localmente:
```bash
npm run build
```

3. Revisa los logs de Vercel para ver el error específico

### La página se ve en blanco

1. Abre la consola del navegador (F12)
2. Verifica si hay errores de JavaScript
3. Verifica que el bundle.js se esté cargando correctamente
4. Revisa la pestaña Network para ver qué archivos se están cargando

### Error: "Cannot find module"

Asegúrate de que todas las dependencias estén en `package.json` y ejecuta:
```bash
npm install
```

## Actualizar el Despliegue

Cada vez que hagas push a la rama `main`, Vercel automáticamente:
1. Detectará los cambios
2. Ejecutará el build
3. Desplegará la nueva versión

## URLs

- **Producción**: `https://frontend-g-e-p-n-2eak.vercel.app`
- **Preview**: Se genera automáticamente para cada PR

## Notas

- El build puede tardar 2-5 minutos
- Vercel cachea los builds, así que los siguientes serán más rápidos
- Si hay errores, revisa los logs en el dashboard de Vercel

