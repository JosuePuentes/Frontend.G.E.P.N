# 🏪 Guía: Publicar App en Google Play Store

Esta guía te ayudará a publicar tu app en la **Google Play Store**, la tienda oficial de apps de Android.

---

## 📋 Requisitos Previos

- ✅ APK o AAB generado y firmado
- ✅ Cuenta de Google
- ✅ $25 USD (pago único por cuenta de desarrollador)
- ✅ Iconos y capturas de pantalla de la app
- ✅ Descripción de la app en español

---

## 💰 PASO 1: Crear Cuenta de Desarrollador

### 1.1 Registrarse:

1. Ve a: https://play.google.com/console/signup
2. Inicia sesión con tu cuenta de Google
3. Acepta los términos y condiciones
4. Paga los $25 USD (una sola vez, válido para siempre)
5. Completa tu perfil:
   - Nombre del desarrollador
   - Dirección de correo electrónico
   - Dirección física (puede ser tu casa u oficina)
   - Número de teléfono

**Tiempo estimado**: 15-30 minutos

---

## 📱 PASO 2: Crear la Aplicación en Play Console

### 2.1 Crear nueva app:

1. Ve a: https://play.google.com/console/
2. Clic en "Crear app"
3. Completa el formulario:
   - **Nombre de la app**: G.E.P.N
   - **Idioma predeterminado**: Español (España) o Español (Latinoamérica)
   - **Tipo de aplicación**: App
   - **Gratuita o de pago**: Gratuita
4. Acepta las declaraciones
5. Clic en "Crear app"

---

## 🎨 PASO 3: Preparar Recursos Gráficos

Necesitarás crear estos recursos:

### 3.1 Icono de la App:
- **Tamaño**: 512 x 512 px
- **Formato**: PNG (32 bits)
- **Fondo**: Puede ser transparente o con color

### 3.2 Banner de Función:
- **Tamaño**: 1024 x 500 px
- **Formato**: PNG o JPEG

### 3.3 Capturas de Pantalla:
- **Mínimo**: 2 capturas
- **Recomendado**: 4-8 capturas
- **Tamaño**: 
  - Teléfono: 1080 x 1920 px o 1080 x 2400 px
  - Tablet (opcional): 1200 x 1920 px
- **Formato**: PNG o JPEG

**Herramientas recomendadas**:
- Canva: https://www.canva.com/
- Figma: https://www.figma.com/
- Android Studio (para capturas): Device Manager → Screenshot

---

## 📝 PASO 4: Completar Ficha de la Tienda

### 4.1 Descripción:

**Descripción corta** (80 caracteres máx):
```
Sistema de Gestión Policial de Denuncias (G.E.P.N) - Denuncia de forma segura
```

**Descripción completa** (4000 caracteres máx):
```
G.E.P.N - Gestión Electrónica de Policía Nacional

Sistema oficial para la gestión de denuncias ciudadanas en Venezuela.

🔒 CARACTERÍSTICAS PRINCIPALES:
• Registro de denuncias en línea
• Seguimiento de casos en tiempo real
• Historial completo de denuncias
• Interfaz fácil de usar
• Seguridad y confidencialidad garantizada

👥 ¿PARA QUIÉN ES ESTA APP?
Esta aplicación está diseñada para ciudadanos que deseen registrar denuncias de forma rápida, segura y eficiente.

📱 CÓMO FUNCIONA:
1. Regístrate con tu cédula
2. Completa el formulario de denuncia
3. Recibe un número de seguimiento
4. Consulta el estado de tu denuncia en cualquier momento

🛡️ SEGURIDAD:
Tus datos están protegidos con cifrado de nivel empresarial. Toda la información es confidencial y cumple con las normativas de protección de datos.

📞 SOPORTE:
¿Necesitas ayuda? Contáctanos en [tu-email@ejemplo.com]

Desarrollado por [Tu Organización]
```

### 4.2 Categoría:
- **Categoría**: Herramientas o Gobierno
- **Subcategoría**: (si aplica)

### 4.3 Información de contacto:
- **Correo electrónico**: tu-email@ejemplo.com
- **Sitio web**: https://tu-sitio-web.com (opcional)
- **Teléfono**: +58 XXX XXXXXXX (opcional)

### 4.4 Política de privacidad:
- **URL**: https://tu-sitio-web.com/privacidad

**Si no tienes sitio web**, puedes usar:
- GitHub Pages (gratis)
- Google Sites (gratis)
- Tu propio dominio

Ejemplo de política de privacidad en `PLANTILLA_POLITICA_PRIVACIDAD.md`

---

## 📦 PASO 5: Generar Android App Bundle (AAB)

Google Play prefiere AAB en lugar de APK. Es más eficiente y ocupa menos espacio.

### 5.1 Generar AAB:

**Windows**:
```powershell
cd android
.\gradlew bundleRelease
```

**Mac/Linux**:
```bash
cd android
./gradlew bundleRelease
```

**El AAB estará en**:
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📤 PASO 6: Subir la App

### 6.1 Ir a "Versiones":

1. En Play Console, ve a "Versiones" → "Producción"
2. Clic en "Crear nueva versión"

### 6.2 Subir el AAB:

1. Arrastra `app-release.aab` o clic en "Subir"
2. Espera a que se procese (1-5 minutos)
3. Se mostrará información de la versión

### 6.3 Completar detalles de la versión:

**Nombre de la versión**: 1.0

**Notas de la versión** (para cada idioma):
```
Primera versión de G.E.P.N

Características:
• Registro de usuarios
• Creación de denuncias
• Consulta de denuncias
• Interfaz intuitiva y fácil de usar
```

### 6.4 Guardar y revisar:

1. Clic en "Guardar"
2. Clic en "Revisar versión"

---

## ✅ PASO 7: Completar Requisitos de Contenido

Antes de publicar, debes completar:

### 7.1 Clasificación de contenido:

1. Ve a "Clasificación de contenido"
2. Completa el cuestionario:
   - ¿La app contiene violencia? **No** (o según tu caso)
   - ¿Contiene contenido sexual? **No**
   - ¿Contiene lenguaje obsceno? **No**
   - etc.
3. Guarda la clasificación

### 7.2 Público objetivo:

1. Ve a "Público objetivo"
2. Selecciona: **Mayores de 13 años** (o según tu caso)
3. ¿La app apela a niños? **No**

### 7.3 Declaraciones de la app:

1. Ve a "Declaraciones de la app"
2. Completa:
   - ¿Tiene anuncios? **No**
   - ¿Tiene compras dentro de la app? **No**
   - ¿Accede a ubicación? **Sí** (si tu app usa GPS)

### 7.4 Seguridad de datos:

1. Ve a "Seguridad de datos"
2. Declara qué datos recopilas:
   - **Datos personales**: Nombre, Cédula, Teléfono
   - **¿Se comparten datos?**: No (o según tu caso)
   - **¿Se pueden eliminar datos?**: Sí
   - **¿Se cifran los datos?**: Sí

---

## 🚀 PASO 8: Enviar para Revisión

### 8.1 Verificar que todo esté completo:

En el panel de Play Console, verifica que todos los íconos estén en verde ✅:
- [ ] Ficha de la tienda
- [ ] Clasificación de contenido
- [ ] Público objetivo
- [ ] Declaraciones de la app
- [ ] Seguridad de datos
- [ ] Versión en producción

### 8.2 Publicar:

1. Ve a "Panel de resumen"
2. Revisa toda la información
3. Clic en **"Enviar para revisión"**

### 8.3 Tiempo de revisión:

- **Normal**: 1-3 días
- **Primera app**: puede tardar hasta 7 días
- **Rechazo**: si algo falta, te enviarán un correo

---

## 📊 PASO 9: Después de la Publicación

### 9.1 Esperar aprobación:

Recibirás un correo cuando:
- ✅ La app sea aprobada
- ❌ La app sea rechazada (con razones)

### 9.2 Tu app estará disponible en:

```
https://play.google.com/store/apps/details?id=com.gepnapp
```

### 9.3 Compartir con usuarios:

- Comparte el enlace de Play Store
- Los usuarios pueden buscar "G.E.P.N" en Play Store
- Pueden instalar con un solo clic

---

## 🔄 PASO 10: Actualizar la App

Cuando necesites actualizar:

### 10.1 Aumentar versión:

Edita `android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 2        // Era 1, ahora 2 (aumenta en 1)
    versionName "1.1"    // Versión legible
}
```

### 10.2 Generar nuevo AAB:

```bash
cd android
./gradlew bundleRelease
```

### 10.3 Subir actualización:

1. Play Console → Versiones → Producción
2. Crear nueva versión
3. Subir nuevo AAB
4. Notas de la versión: ¿Qué cambió?
5. Enviar para revisión

---

## 💡 Consejos para la Aprobación

### ✅ Hacer:
- Usa un nombre descriptivo
- Proporciona capturas de pantalla reales
- Escribe una descripción clara
- Declara todos los permisos que usas
- Prueba bien la app antes de subir
- Responde rápido a comentarios de Google

### ❌ Evitar:
- Nombres engañosos
- Capturas de pantalla falsas o de otra app
- Copiar descripciones de otras apps
- Uso de marcas registradas sin permiso
- Apps que no funcionan o crashean
- Contenido inapropiado

---

## 🐛 Problemas Comunes

### Problema: "La app no se puede instalar desde Play Store"

**Solución**: 
- Verifica que el backend esté corriendo
- Asegúrate de que la URL del backend sea HTTPS
- Prueba en un dispositivo diferente

### Problema: "App rechazada por política de contenido"

**Solución**:
- Lee el correo de rechazo
- Corrige el problema
- Vuelve a enviar

### Problema: "Firma no válida"

**Solución**:
- Usa el mismo keystore para todas las actualizaciones
- No pierdas el keystore original

---

## 📞 Recursos Adicionales

- **Play Console**: https://play.google.com/console/
- **Políticas de Google Play**: https://play.google.com/about/developer-content-policy/
- **Ayuda de Google Play**: https://support.google.com/googleplay/android-developer/
- **Comunidad de desarrolladores**: https://www.reddit.com/r/androiddev/

---

## ✅ Checklist Final

Antes de publicar:

- [ ] Cuenta de desarrollador creada y pagada
- [ ] App creada en Play Console
- [ ] Icono 512x512 px preparado
- [ ] Mínimo 2 capturas de pantalla preparadas
- [ ] Descripción completa y corta escritas
- [ ] Política de privacidad creada y URL agregada
- [ ] AAB generado con firma de release
- [ ] Clasificación de contenido completada
- [ ] Público objetivo definido
- [ ] Seguridad de datos declarada
- [ ] App probada en dispositivo real
- [ ] Backend en producción funcionando con HTTPS
- [ ] Todos los requisitos en verde ✅

---

**¡Felicidades! 🎉 Ya sabes cómo publicar en Google Play Store.**

**Siguiente**: Ver `GUIA_PUBLICAR_APP_STORE.md` para iOS
