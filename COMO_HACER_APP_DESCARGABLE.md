# 📱 Cómo Hacer tu App Descargable - Guía Completa

Esta guía resume TODO lo que necesitas saber para convertir tu app React Native en una app descargable para celulares.

---

## 🎯 Resumen: ¿Qué vamos a lograr?

Al final de esta guía, tendrás:

1. ✅ **APK para Android** - Archivo instalable en cualquier Android
2. ✅ **App en Google Play Store** - App oficial en la tienda de Android
3. ✅ **App en Apple App Store** - App oficial en la tienda de iOS
4. ✅ **Backend en producción** - Servidor funcionando 24/7 con HTTPS

---

## 📋 Índice de Guías

### Para el Frontend (TÚ):
1. **[GUIA_GENERAR_APK_ANDROID.md](GUIA_GENERAR_APK_ANDROID.md)** - Generar APK para Android
2. **[GUIA_PUBLICAR_GOOGLE_PLAY.md](GUIA_PUBLICAR_GOOGLE_PLAY.md)** - Publicar en Google Play Store
3. **[GUIA_PUBLICAR_APP_STORE.md](GUIA_PUBLICAR_APP_STORE.md)** - Publicar en Apple App Store

### Para el Backend (Tu otra IA):
4. **[INSTRUCCIONES_BACKEND_PRODUCCION.md](INSTRUCCIONES_BACKEND_PRODUCCION.md)** - Desplegar backend en producción

---

## 🚀 Proceso Completo Paso a Paso

### FASE 1: PREPARAR EL BACKEND ⚙️

**Dale este archivo a tu otra IA**: `INSTRUCCIONES_BACKEND_PRODUCCION.md`

**¿Qué debe hacer el backend?**
1. Desplegar el backend en un servidor público (Heroku, Railway, DigitalOcean, etc.)
2. Configurar HTTPS (obligatorio para iOS, recomendado para Android)
3. Configurar CORS para aceptar peticiones de apps móviles
4. Implementar todos los endpoints necesarios
5. Configurar base de datos MySQL
6. Proporcionarte la URL del backend

**Resultado esperado**: Una URL como `https://tu-backend.com`

**⏱️ Tiempo estimado**: 2-4 horas

---

### FASE 2: ACTUALIZAR EL FRONTEND 📱

Una vez que el backend esté listo:

#### 2.1 Actualizar la URL del Backend

Edita `src/services/apiService.ts`:

```typescript
// Línea 5 - Cambia esto:
const API_BASE_URL = 'http://10.0.2.2:8080';

// Por la URL de producción:
const API_BASE_URL = 'https://tu-backend.com';
```

#### 2.2 Probar que funcione

```bash
# Iniciar la app
npm run android
# o
npm run ios
```

Prueba:
- Registrar un usuario
- Hacer login
- Crear una denuncia
- Ver historial de denuncias

**⏱️ Tiempo estimado**: 30 minutos

---

### FASE 3: GENERAR APK PARA ANDROID 🤖

Sigue la guía: **[GUIA_GENERAR_APK_ANDROID.md](GUIA_GENERAR_APK_ANDROID.md)**

**Pasos principales**:

1. **Crear keystore** (firma digital):
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore gepn-release-key.keystore -alias gepn-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configurar credenciales** en `android/gradle.properties`:
   ```properties
   MYAPP_UPLOAD_STORE_FILE=gepn-release-key.keystore
   MYAPP_UPLOAD_KEY_ALIAS=gepn-key-alias
   MYAPP_UPLOAD_STORE_PASSWORD=tu_contraseña
   MYAPP_UPLOAD_KEY_PASSWORD=tu_contraseña
   ```

3. **Generar APK**:
   
   **Opción A - Usando el script (Fácil)**:
   
   **Windows**:
   ```bash
   generar-apk.bat
   ```
   
   **Mac/Linux**:
   ```bash
   chmod +x generar-apk.sh
   ./generar-apk.sh
   ```
   
   **Opción B - Manual**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **El APK estará en**:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

5. **Distribuir el APK**:
   - Sube a Google Drive / Dropbox
   - Comparte el enlace
   - Los usuarios lo descargan e instalan

**⏱️ Tiempo estimado**: 1-2 horas

---

### FASE 4: PUBLICAR EN GOOGLE PLAY STORE 🏪

Sigue la guía: **[GUIA_PUBLICAR_GOOGLE_PLAY.md](GUIA_PUBLICAR_GOOGLE_PLAY.md)**

**Pasos principales**:

1. **Crear cuenta de desarrollador**:
   - Ve a https://play.google.com/console/signup
   - Paga $25 USD (una sola vez)
   
2. **Generar AAB** (formato preferido de Google):
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   
3. **Crear app en Play Console**:
   - Nombre: G.E.P.N
   - Idioma: Español
   - Tipo: App gratuita

4. **Preparar recursos**:
   - Icono 512x512 px
   - Mínimo 2 capturas de pantalla
   - Descripción de la app

5. **Subir AAB y completar información**:
   - Clasificación de contenido
   - Público objetivo
   - Seguridad de datos
   - Política de privacidad

6. **Enviar para revisión**:
   - Tiempo de espera: 1-3 días

**💰 Costo**: $25 USD (una sola vez)

**⏱️ Tiempo estimado**: 3-4 horas + 1-3 días de revisión

---

### FASE 5: PUBLICAR EN APPLE APP STORE 🍎

Sigue la guía: **[GUIA_PUBLICAR_APP_STORE.md](GUIA_PUBLICAR_APP_STORE.md)**

**⚠️ REQUISITOS**:
- Mac con macOS (obligatorio)
- Xcode instalado
- Apple Developer Program ($99/año)

**Pasos principales**:

1. **Inscribirse en Apple Developer Program**:
   - Ve a https://developer.apple.com/programs/
   - Paga $99 USD/año

2. **Configurar proyecto en Xcode**:
   ```bash
   cd ios
   pod install
   open GEPNApp.xcworkspace
   ```

3. **Configurar firma y Bundle ID**:
   - Bundle ID único: `com.tuempresa.gepnapp`
   - Equipo de developer
   - Certificados automáticos

4. **Crear Archive**:
   - Product → Archive
   - Upload a App Store Connect

5. **Configurar en App Store Connect**:
   - Crear app
   - Subir capturas (1290 x 2796 px mínimo)
   - Descripción y keywords
   - Información de privacidad
   - Cuenta demo para Apple

6. **Enviar para revisión**:
   - Tiempo de espera: 1-7 días

**💰 Costo**: $99 USD/año

**⏱️ Tiempo estimado**: 4-6 horas + 1-7 días de revisión

**⚠️ Si no tienes Mac**: Considera rentar acceso remoto a un Mac o usar servicios como EAS Build

---

## 📊 Tabla Comparativa: Android vs iOS

| Aspecto | Android | iOS |
|---------|---------|-----|
| **Archivo** | APK / AAB | IPA / Archive |
| **Cuenta Developer** | $25 (una vez) | $99/año |
| **Requisitos** | Windows/Mac/Linux | Solo Mac |
| **Tiempo de revisión** | 1-3 días | 1-7 días |
| **Facilidad** | ⭐⭐⭐⭐ Fácil | ⭐⭐⭐ Moderado |
| **HTTPS** | Recomendado | **Obligatorio** |
| **Distribución directa** | ✅ Sí (APK) | ❌ No (solo TestFlight) |

---

## ✅ Checklist Completo

### Backend:
- [ ] Backend desplegado en servidor público
- [ ] HTTPS configurado y funcionando
- [ ] CORS configurado correctamente
- [ ] Todos los endpoints funcionando
- [ ] Base de datos configurada
- [ ] URL proporcionada al frontend

### Frontend:
- [ ] URL del backend actualizada en el código
- [ ] App probada con backend de producción
- [ ] Nombre e icono de la app personalizados
- [ ] Permisos configurados correctamente

### Android:
- [ ] Keystore creado y guardado
- [ ] gradle.properties configurado
- [ ] APK generado y probado
- [ ] (Opcional) Cuenta de Google Play creada
- [ ] (Opcional) AAB subido a Play Store
- [ ] (Opcional) App publicada en Play Store

### iOS:
- [ ] Mac disponible
- [ ] Xcode instalado
- [ ] Cuenta de Apple Developer pagada
- [ ] Bundle ID configurado
- [ ] Archive creado y subido
- [ ] (Opcional) App configurada en App Store Connect
- [ ] (Opcional) App publicada en App Store

---

## 🎓 Opciones de Distribución

### Opción 1: Distribución Directa (APK) - GRATIS
**Pros**:
- ✅ Gratis
- ✅ Rápido (minutos)
- ✅ No necesita aprobación

**Contras**:
- ❌ Solo Android
- ❌ Usuarios deben permitir "orígenes desconocidos"
- ❌ Menos confianza

**Ideal para**: Pruebas, distribución interna, betas

### Opción 2: Google Play Store - $25 (una vez)
**Pros**:
- ✅ Profesional
- ✅ Actualizaciones automáticas
- ✅ Más confianza de usuarios
- ✅ Estadísticas y analytics

**Contras**:
- ❌ Cuesta $25
- ❌ Revisión de 1-3 días
- ❌ Debe cumplir políticas

**Ideal para**: Apps públicas, producción

### Opción 3: Apple App Store - $99/año
**Pros**:
- ✅ Muy profesional
- ✅ Acceso a usuarios iOS
- ✅ Actualizaciones automáticas
- ✅ TestFlight para betas

**Contras**:
- ❌ Cuesta $99/año
- ❌ Requiere Mac
- ❌ Revisión estricta (1-7 días)
- ❌ HTTPS obligatorio

**Ideal para**: Apps profesionales, audiencia iOS

---

## 💰 Costos Totales

### Mínimo (Solo APK):
- **Total**: $0 USD
- Distribución directa de APK

### Recomendado (Android profesional):
- Cuenta Google Play: $25 USD (una vez)
- **Total**: $25 USD

### Completo (Android + iOS):
- Cuenta Google Play: $25 USD (una vez)
- Apple Developer: $99 USD/año
- **Total Año 1**: $124 USD
- **Total Año 2+**: $99 USD/año

### Servicios adicionales opcionales:
- Dominio (.com): $10-15 USD/año
- Hosting backend: $5-50 USD/mes
- Certificado SSL: Gratis (Let's Encrypt)

---

## 🐛 Problemas Comunes

### Problema: "El APK no se instala en mi teléfono"

**Solución**:
1. Ve a Configuración → Seguridad
2. Activa "Instalar apps desconocidas"
3. Permite instalación desde Chrome/Gestor de archivos

### Problema: "La app no se conecta al backend"

**Solución**:
- Verifica que el backend esté corriendo
- Verifica que la URL sea HTTPS
- Verifica que CORS esté configurado
- Prueba la URL en el navegador

### Problema: "Apple rechazó mi app por usar HTTP"

**Solución**:
- Debes usar HTTPS en producción (no negociable)
- Configura certificado SSL en tu backend

### Problema: "No tengo Mac para iOS"

**Soluciones**:
- Pedir prestado Mac de amigo/familiar
- Rentar acceso remoto (MacStadium, MacinCloud)
- Usar servicio de build (EAS Build)
- Solo publicar en Android por ahora

---

## 📞 Archivos de Referencia

- **Backend**: `INSTRUCCIONES_BACKEND_PRODUCCION.md`
- **Android APK**: `GUIA_GENERAR_APK_ANDROID.md`
- **Google Play**: `GUIA_PUBLICAR_GOOGLE_PLAY.md`
- **Apple App Store**: `GUIA_PUBLICAR_APP_STORE.md`
- **Scripts**: `generar-apk.bat` (Windows) / `generar-apk.sh` (Mac/Linux)

---

## 🎯 Próximos Pasos

### Paso 1: Backend (PRIORIDAD)
Entrégale `INSTRUCCIONES_BACKEND_PRODUCCION.md` a tu otra IA y espera a que te dé la URL del backend en producción.

### Paso 2: Actualizar Frontend
Una vez que tengas la URL, actualiza `src/services/apiService.ts` con la URL de producción.

### Paso 3: Elegir Distribución

**Opción A - Rápida (APK)**:
1. Genera APK siguiendo `GUIA_GENERAR_APK_ANDROID.md`
2. Comparte el APK

**Opción B - Profesional (Tiendas)**:
1. Genera AAB para Google Play
2. Sigue `GUIA_PUBLICAR_GOOGLE_PLAY.md`
3. Si quieres iOS, sigue `GUIA_PUBLICAR_APP_STORE.md`

---

## ✨ Resumen Final

**Para hacer tu app descargable necesitas**:

1. ✅ Backend funcionando con HTTPS (tu otra IA se encarga)
2. ✅ Generar APK firmado (sigue `GUIA_GENERAR_APK_ANDROID.md`)
3. ✅ (Opcional) Publicar en tiendas (sigue las guías respectivas)

**Tiempo total estimado**:
- Solo APK: **2-4 horas**
- Con Google Play: **1 día** + revisión
- Con ambas tiendas: **2-3 días** + revisión

**Costo mínimo**: **GRATIS** (solo APK)

**Costo recomendado**: **$25 USD** (Google Play)

**Costo completo**: **$124 USD** primer año (ambas tiendas)

---

**¡Felicidades! 🎉 Ahora tienes todo lo necesario para hacer tu app descargable.**

**¿Dudas?** Consulta las guías específicas o `SOLUCION_PROBLEMAS.md`

