# 📱 Guía Completa: Generar APK para Android

Esta guía te ayudará a generar un archivo APK que puedes distribuir e instalar en celulares Android.

---

## 🎯 ¿Qué vamos a hacer?

1. Crear una **firma digital** para tu app (keystore)
2. Configurar Android para usar esa firma
3. Generar el **APK firmado**
4. Distribuir el APK a los usuarios

---

## 📋 PASO 1: Crear el Keystore (Firma Digital)

El keystore es como tu "firma" para la aplicación. **¡GUÁRDALO MUY BIEN!** Si lo pierdes, no podrás actualizar tu app.

### En Windows (PowerShell):

```powershell
cd android\app

keytool -genkeypair -v -storetype PKCS12 -keystore gepn-release-key.keystore -alias gepn-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### En Mac/Linux:

```bash
cd android/app

keytool -genkeypair -v -storetype PKCS12 -keystore gepn-release-key.keystore -alias gepn-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Te preguntará:

```
Enter keystore password: [Escribe una contraseña segura - ¡GUÁRDALA!]
Re-enter new password: [Repite la contraseña]
What is your first and last name?: [Tu nombre o nombre de la empresa]
What is the name of your organizational unit?: [Tu departamento u "App Development"]
What is the name of your organization?: [Nombre de tu organización/empresa]
What is the name of your City or Locality?: [Tu ciudad]
What is the name of your State or Province?: [Tu estado]
What is the two-letter country code for this unit?: [VE para Venezuela]
Is CN=..., correct? [Type yes]
```

**⚠️ IMPORTANTE**: 
- Guarda la contraseña en un lugar seguro
- Haz backup del archivo `gepn-release-key.keystore`
- Si pierdes esto, NO podrás actualizar tu app en el futuro

---

## 📋 PASO 2: Configurar las Credenciales

Crea o edita el archivo `android/gradle.properties`:

### En Windows:

```powershell
cd android
notepad gradle.properties
```

### En Mac/Linux:

```bash
cd android
nano gradle.properties
```

**Agrega estas líneas al final del archivo**:

```properties
MYAPP_UPLOAD_STORE_FILE=gepn-release-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=gepn-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=tu_contraseña_aqui
MYAPP_UPLOAD_KEY_PASSWORD=tu_contraseña_aqui
```

**Reemplaza `tu_contraseña_aqui` con la contraseña que creaste en el Paso 1.**

**⚠️ SEGURIDAD**: 
- NO subas `gradle.properties` a Git (ya está en `.gitignore`)
- Este archivo contiene tu contraseña, mantenlo privado

---

## 📋 PASO 3: Actualizar la URL del Backend

Antes de generar el APK, asegúrate de que tu app esté apuntando al backend de producción.

Edita `src/services/apiService.ts`:

```typescript
// Cambia esto:
const API_BASE_URL = 'http://10.0.2.2:8080';

// Por la URL real de tu backend:
const API_BASE_URL = 'https://tu-dominio.com';
```

**IMPORTANTE**: 
- Usa la URL HTTPS de tu backend (no localhost)
- Guarda el archivo después de editar

---

## 📋 PASO 4: Generar el APK

### Opción A: APK Firmado para Distribución (RECOMENDADO)

Este APK se puede instalar en cualquier teléfono Android:

#### Windows:

```powershell
cd android
.\gradlew assembleRelease
```

#### Mac/Linux:

```bash
cd android
./gradlew assembleRelease
```

**El APK estará en**: 
```
android/app/build/outputs/apk/release/app-release.apk
```

### Opción B: APK de Debug (Solo para pruebas)

```bash
cd android
./gradlew assembleDebug
```

**El APK estará en**: 
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📋 PASO 5: Probar el APK

### En un Emulador:

```bash
# Instalar en emulador
adb install android/app/build/outputs/apk/release/app-release.apk
```

### En un Dispositivo Físico:

1. Conecta tu teléfono por USB
2. Habilita "Depuración USB" en el teléfono
3. Ejecuta:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Enviar el APK por Internet:

1. **Sube el APK a Google Drive / Dropbox**:
   - Ve a `android/app/build/outputs/apk/release/`
   - Sube `app-release.apk` a la nube
   - Comparte el enlace

2. **El usuario descarga el APK en su teléfono**

3. **Instalar en Android**:
   - Toca el archivo APK descargado
   - Si sale advertencia "Instalar apps desconocidas", actívalo
   - Toca "Instalar"
   - ¡Listo!

---

## 🎨 PASO 6: Personalizar el Nombre e Icono de la App

### Cambiar el Nombre:

Edita `android/app/src/main/res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">G.E.P.N</string>
</resources>
```

### Cambiar el Icono:

1. Ve a https://icon.kitchen/
2. Sube tu logo/imagen
3. Descarga los iconos
4. Reemplaza los archivos en:
   - `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
   - `android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
   - `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
   - `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
   - `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

---

## 📦 PASO 7: Aumentar Versión (Para Actualizaciones)

Cada vez que actualices tu app, aumenta la versión en `android/app/build.gradle`:

```gradle
defaultConfig {
    applicationId "com.gepnapp"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 2        // Aumenta este número en 1 (era 1, ahora 2)
    versionName "1.1"    // Versión legible para humanos
}
```

---

## 🐛 Solución de Problemas

### Error: "keytool: command not found"

**Solución**: Java no está instalado o no está en el PATH.

- Instala Java JDK: https://www.oracle.com/java/technologies/downloads/
- O usa el que viene con Android Studio

### Error: "SDK location not found"

**Solución**: Configura la variable de entorno ANDROID_HOME:

**Windows**:
```
Variable: ANDROID_HOME
Valor: C:\Users\TuUsuario\AppData\Local\Android\Sdk
```

**Mac/Linux**:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # Mac
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
```

### Error: "Keystore file not found"

**Solución**: 
- Verifica que `gepn-release-key.keystore` esté en `android/app/`
- Verifica que el nombre en `gradle.properties` coincida

### Error: "Failed to install APK"

**Solución**:
```bash
# Desinstalar versión anterior
adb uninstall com.gepnapp

# Instalar nueva versión
adb install android/app/build/outputs/apk/release/app-release.apk
```

### El APK no se instala en el teléfono

**Solución**:
1. Ve a Configuración → Seguridad
2. Activa "Instalar apps desconocidas"
3. Permite instalación desde el navegador o gestor de archivos

---

## ✅ Checklist Final

Antes de distribuir tu APK:

- [ ] Keystore creado y guardado de forma segura
- [ ] `gradle.properties` configurado con las credenciales
- [ ] URL del backend actualizada a producción (HTTPS)
- [ ] APK generado con `assembleRelease`
- [ ] APK probado en al menos un dispositivo
- [ ] Nombre e icono de la app personalizados
- [ ] Versión actualizada en `build.gradle`
- [ ] APK guardado en lugar seguro con nombre descriptivo

---

## 📲 Distribuir a los Usuarios

### Método 1: Descarga Directa (Más Fácil)

1. Sube el APK a:
   - Google Drive
   - Dropbox
   - Tu propio sitio web
   
2. Comparte el enlace

3. Instrucciones para usuarios:
   ```
   1. Descarga el archivo app-release.apk
   2. Abre el archivo descargado
   3. Si sale advertencia, activa "Instalar apps desconocidas"
   4. Toca "Instalar"
   5. ¡Listo!
   ```

### Método 2: Google Play Store (Más Profesional)

Ver `GUIA_PUBLICAR_GOOGLE_PLAY.md` para publicar en la tienda oficial.

---

## 🎓 Próximos Pasos

1. ✅ **Ya sabes generar APK para Android**
2. 📱 **Siguiente**: Ver `GUIA_PUBLICAR_GOOGLE_PLAY.md` para publicar en Play Store
3. 🍎 **También**: Ver `GUIA_PUBLICAR_APP_STORE.md` para iOS

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa la sección "Solución de Problemas"
2. Verifica que todos los pasos estén completos
3. Consulta `SOLUCION_PROBLEMAS.md`

---

**¡Felicidades! 🎉 Ya puedes generar APKs de tu aplicación.**
