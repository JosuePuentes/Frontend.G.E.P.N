# 🍎 Guía: Publicar App en Apple App Store

Esta guía te ayudará a publicar tu app en la **Apple App Store**, la tienda oficial de apps de iOS.

---

## ⚠️ REQUISITOS IMPORTANTES

Antes de empezar, necesitas:

1. ✅ **Mac con macOS** (obligatorio - no se puede hacer desde Windows/Linux)
2. ✅ **Xcode** instalado (última versión)
3. ✅ **Cuenta de Apple** (Apple ID)
4. ✅ **Apple Developer Program** ($99 USD/año)
5. ✅ **Backend con HTTPS** (Apple obliga a usar HTTPS)

**IMPORTANTE**: Si no tienes Mac, considera:
- Usar un Mac de un amigo/familiar
- Rentar acceso remoto a un Mac (MacStadium, MacinCloud)
- Usar un servicio de build en la nube (EAS Build de Expo)

---

## 💰 PASO 1: Inscribirse en Apple Developer Program

### 1.1 Crear Apple ID:

1. Ve a: https://appleid.apple.com/
2. Crea tu Apple ID (si no tienes uno)
3. Verifica tu correo electrónico

### 1.2 Unirse al Developer Program:

1. Ve a: https://developer.apple.com/programs/
2. Clic en "Enroll"
3. Inicia sesión con tu Apple ID
4. Selecciona tipo de cuenta:
   - **Individual**: Para ti como persona
   - **Organization**: Para una empresa (requiere documentos legales)
5. Completa el formulario
6. Paga $99 USD (renovación anual)
7. Espera aprobación (1-2 días)

**Tiempo estimado**: 1-3 días

---

## 🔧 PASO 2: Configurar Xcode

### 2.1 Instalar Xcode:

1. Abre **App Store** en tu Mac
2. Busca "Xcode"
3. Descarga e instala (puede tardar 1-2 horas, es muy grande ~12GB)
4. Abre Xcode y acepta los términos

### 2.2 Configurar cuenta:

1. Abre **Xcode**
2. Ve a **Xcode** → **Settings** (o Preferences)
3. Clic en **Accounts**
4. Clic en **+** → **Add Apple ID**
5. Inicia sesión con tu Apple Developer Account
6. Verifica que tu equipo aparezca

---

## 📱 PASO 3: Configurar el Proyecto iOS

### 3.1 Abrir proyecto en Xcode:

```bash
cd ios
open GEPNApp.xcworkspace
```

**⚠️ IMPORTANTE**: Abre el archivo `.xcworkspace`, NO el `.xcodeproj`

### 3.2 Configurar Bundle Identifier:

1. En Xcode, selecciona el proyecto (icono azul arriba)
2. Selecciona **GEPNApp** target
3. Ve a la pestaña **General**
4. En **Identity**:
   - **Display Name**: G.E.P.N
   - **Bundle Identifier**: `com.tuempresa.gepnapp`
     - Debe ser único en todo App Store
     - Formato: `com.tuempresa.nombreapp`
     - Solo letras minúsculas, números y puntos

### 3.3 Configurar equipo:

1. En **Signing & Capabilities**
2. **Team**: Selecciona tu equipo de developer
3. **Signing Certificate**: Automático
4. Marca **Automatically manage signing**

### 3.4 Configurar versión:

1. En **General**
2. **Version**: 1.0
3. **Build**: 1

---

## 🔐 PASO 4: Configurar Permisos y Capacidades

### 4.1 Editar Info.plist:

Ya debe estar configurado, pero verifica en `ios/GEPNApp/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Necesitamos tu ubicación para registrar denuncias con precisión</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Necesitamos tu ubicación para servicios de emergencia</string>
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para subir evidencias</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Necesitamos acceso a tus fotos para adjuntar evidencias</string>
```

### 4.2 Configurar App Transport Security:

⚠️ **IMPORTANTE**: iOS requiere HTTPS. Si tu backend está en HTTP (no recomendado), necesitas:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

**Pero Apple puede rechazar tu app por esto. DEBES usar HTTPS en producción.**

---

## 🎨 PASO 5: Preparar Recursos Gráficos

### 5.1 Icono de la App:

Necesitas un icono en varios tamaños. Usa: https://appicon.co/

**Tamaños necesarios**:
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 167x167 (iPad)
- 152x152 (iPad)
- 120x120 (iPhone)
- 87x87 (iPhone)
- 80x80 (iPad/iPhone)
- 60x60 (iPhone)
- 58x58 (iPhone)
- 40x40 (iPhone/iPad)
- 29x29 (iPhone/iPad)
- 20x20 (iPhone/iPad)

1. Genera todos los tamaños en https://appicon.co/
2. Descarga el ZIP
3. Arrastra los archivos a `ios/GEPNApp/Images.xcassets/AppIcon.appiconset/`

### 5.2 Capturas de Pantalla:

**Tamaños requeridos**:
- iPhone 6.7" (1290 x 2796): iPhone 15 Pro Max
- iPhone 6.5" (1242 x 2688): iPhone 11 Pro Max
- iPhone 5.5" (1242 x 2208): iPhone 8 Plus

**Mínimo**: 3 capturas por tamaño
**Recomendado**: 6-10 capturas

**Cómo tomar capturas**:
1. Abre el simulador de iOS en Xcode
2. Ejecuta tu app: `npm run ios`
3. Navega a cada pantalla
4. **Cmd + S** para tomar captura
5. Las capturas se guardan en el escritorio

---

## 📦 PASO 6: Crear el Archive

### 6.1 Limpiar y preparar:

```bash
cd ios
pod install
cd ..
```

### 6.2 Abrir en Xcode:

```bash
cd ios
open GEPNApp.xcworkspace
```

### 6.3 Crear Archive:

1. En Xcode, selecciona el dispositivo: **Any iOS Device (arm64)**
2. Ve a **Product** → **Clean Build Folder** (Cmd + Shift + K)
3. Ve a **Product** → **Archive**
4. Espera (puede tardar 5-15 minutos)

Si hay errores:
- Verifica que las dependencias estén instaladas
- Verifica que el equipo esté seleccionado
- Verifica que el certificado sea válido

### 6.4 Subir a App Store Connect:

1. Cuando termine, se abre **Organizer**
2. Selecciona tu archive
3. Clic en **Distribute App**
4. Selecciona **App Store Connect**
5. Clic en **Upload**
6. Selecciona las opciones:
   - ✅ Upload symbols
   - ✅ Manage version
7. Clic en **Next**
8. Revisa y clic en **Upload**
9. Espera (5-10 minutos)

---

## 🌐 PASO 7: Configurar App Store Connect

### 7.1 Crear app en App Store Connect:

1. Ve a: https://appstoreconnect.apple.com/
2. Inicia sesión con tu Apple ID
3. Ve a **My Apps**
4. Clic en **+** → **New App**
5. Completa:
   - **Platform**: iOS
   - **Name**: G.E.P.N
   - **Primary Language**: Spanish
   - **Bundle ID**: Selecciona el que creaste
   - **SKU**: gepnapp001 (identificador único interno)
   - **User Access**: Full Access

### 7.2 Completar información:

#### **App Information**:
- **Name**: G.E.P.N
- **Subtitle**: Sistema de Denuncias Ciudadanas
- **Category**: 
  - Primary: Utilities o Government
  - Secondary: Productivity
- **Content Rights**: (si aplica)

#### **Pricing and Availability**:
- **Price**: Free (Gratis)
- **Availability**: All countries (o selecciona países)

---

## 📝 PASO 8: Crear la Primera Versión

### 8.1 Ir a la versión:

1. En App Store Connect
2. Clic en tu app
3. Ve a **1.0 Prepare for Submission**

### 8.2 Agregar capturas de pantalla:

1. Arrastra las capturas para cada tamaño de iPhone
2. Puedes usar las mismas capturas para iPad si quieres

### 8.3 Descripción:

**Promotional Text** (170 caracteres):
```
Denuncia de forma rápida y segura. Sistema oficial de gestión de denuncias ciudadanas.
```

**Description** (4000 caracteres máx):
```
G.E.P.N - Gestión Electrónica de Policía Nacional

Sistema oficial para la gestión de denuncias ciudadanas en Venezuela.

🔒 CARACTERÍSTICAS PRINCIPALES:
• Registro de denuncias en línea
• Seguimiento de casos en tiempo real
• Historial completo de denuncias
• Interfaz fácil de usar
• Seguridad y confidencialidad garantizada
• Notificaciones de actualización de estado

👥 ¿PARA QUIÉN ES ESTA APP?
Esta aplicación está diseñada para ciudadanos venezolanos que deseen registrar denuncias de forma rápida, segura y eficiente ante las autoridades competentes.

📱 CÓMO FUNCIONA:
1. Regístrate con tu cédula de identidad
2. Completa el formulario de denuncia con todos los detalles
3. Recibe un número de seguimiento único
4. Consulta el estado de tu denuncia en cualquier momento
5. Recibe notificaciones sobre actualizaciones

🛡️ SEGURIDAD Y PRIVACIDAD:
• Tus datos personales están protegidos con cifrado de nivel empresarial
• Toda la información es confidencial
• Cumplimos con las normativas de protección de datos
• No compartimos tu información con terceros

📞 SOPORTE Y AYUDA:
¿Necesitas ayuda? Contáctanos:
• Email: soporte@gepn.gob.ve
• Teléfono: 0800-GEPN-XXX

Desarrollado por [Tu Organización]
© 2026 Todos los derechos reservados
```

**Keywords** (100 caracteres):
```
denuncia,policia,seguridad,venezuela,gobierno,reporte,ciudadano
```

### 8.4 What's New (Notas de la versión):

```
Versión 1.0 - Lanzamiento Inicial

¡Bienvenido a G.E.P.N!

Esta es la primera versión de nuestra aplicación que incluye:
• Registro de usuarios con cédula
• Creación de denuncias
• Consulta de historial de denuncias
• Interfaz intuitiva y fácil de usar
• Sistema de notificaciones

Gracias por usar G.E.P.N
```

### 8.5 App Privacy (Privacidad):

1. Clic en **Set Up App Privacy**
2. Declara qué datos recopilas:
   - **Contact Info**: Email, Phone Number, Name
   - **Identifiers**: User ID
   - **User Content**: User-generated content
3. Para cada uno:
   - **Purpose**: Analytics, App Functionality
   - **Linked to User**: Yes
   - **Used for Tracking**: No

### 8.6 App Review Information:

Información para que Apple pruebe tu app:

- **First Name**: Tu nombre
- **Last Name**: Tu apellido
- **Phone Number**: Tu teléfono
- **Email**: Tu email
- **Sign-in required**: Yes
- **Demo Account**:
  - **Username**: V-12345678 (una cuenta de prueba)
  - **Password**: test123
  - **Notes**: Cuenta de prueba para revisión

⚠️ **MUY IMPORTANTE**: Crea una cuenta de prueba que funcione para que Apple pueda probar tu app.

### 8.7 Seleccionar Build:

1. En **Build**, clic en el **+**
2. Selecciona el build que subiste
3. Si no aparece, espera 10-30 minutos y recarga

### 8.8 Export Compliance:

- **Does your app use encryption?**: 
  - Si solo usas HTTPS: **No** (HTTPS está exento)
  - Si usas cifrado adicional: **Yes** (necesitarás más info)

---

## 🚀 PASO 9: Enviar para Revisión

### 9.1 Verificar que todo esté completo:

- [ ] Icono de 1024x1024
- [ ] Capturas de pantalla (mínimo 3 por tamaño)
- [ ] Descripción completa
- [ ] Keywords
- [ ] Categoría seleccionada
- [ ] Información de privacidad
- [ ] Información de revisión (cuenta demo)
- [ ] Build seleccionado
- [ ] Export compliance completado

### 9.2 Enviar:

1. Clic en **Add for Review** (Añadir para revisión)
2. Responde las preguntas:
   - **Advertising Identifier**: No (si no usas publicidad)
   - **Content Rights**: I have necessary rights
3. Clic en **Submit for Review** (Enviar para revisión)

### 9.3 Tiempo de revisión:

- **Normal**: 1-3 días
- **Primera app**: puede tardar hasta 7 días
- **Festivos**: puede tardar más

---

## 📧 PASO 10: Después del Envío

### 10.1 Estados posibles:

- **Waiting for Review**: En cola de revisión
- **In Review**: Siendo revisada
- **Pending Developer Release**: Aprobada, esperando tu confirmación para publicar
- **Ready for Sale**: ¡Publicada y disponible!
- **Rejected**: Rechazada (recibirás correo con razones)

### 10.2 Si es aprobada:

1. Recibirás un correo
2. Tu app estará en:
   ```
   https://apps.apple.com/app/idXXXXXXXXXX
   ```
3. Los usuarios pueden buscar "G.E.P.N" en App Store

### 10.3 Si es rechazada:

1. Lee el correo con las razones
2. Ve a **Resolution Center** en App Store Connect
3. Corrige los problemas
4. Responde al equipo de revisión
5. Vuelve a enviar

---

## 🔄 PASO 11: Actualizar la App

### 11.1 Aumentar versión:

Edita `ios/GEPNApp/Info.plist`:

```xml
<key>CFBundleShortVersionString</key>
<string>1.1</string>
<key>CFBundleVersion</key>
<string>2</string>
```

O en Xcode:
- **Version**: 1.1
- **Build**: 2

### 11.2 Crear nuevo Archive:

1. Limpia el proyecto
2. Crea nuevo Archive
3. Sube a App Store Connect

### 11.3 En App Store Connect:

1. Ve a tu app
2. Clic en **+ Version** o **Platform Version**
3. Ingresa la nueva versión: 1.1
4. Actualiza "What's New"
5. Selecciona el nuevo build
6. Enviar para revisión

---

## 💡 Consejos para la Aprobación

### ✅ Hacer:
- Proporciona cuenta demo funcional
- Prueba TODO antes de enviar
- Usa HTTPS en el backend
- Declara todos los permisos correctamente
- Escribe descripción clara y precisa
- Usa capturas reales de la app
- Responde rápido a comentarios de Apple

### ❌ Evitar:
- Subir app que crashea
- Usar HTTP sin justificación
- No proporcionar cuenta demo
- Capturas de pantalla falsas
- Copiar contenido de otras apps
- Uso de marcas registradas sin permiso
- Apps incompletas o de prueba

---

## 🐛 Problemas Comunes

### Problema: "No se puede crear el Archive"

**Solución**:
```bash
cd ios
rm -rf Pods
pod deintegrate
pod install
cd ..
```

### Problema: "Signing certificate not found"

**Solución**:
1. Xcode → Settings → Accounts
2. Selecciona tu cuenta
3. Clic en "Download Manual Profiles"
4. En el proyecto, marca "Automatically manage signing"

### Problema: "App rechazada por usar HTTP"

**Solución**:
- Cambia tu backend a HTTPS (obligatorio)
- No hay forma de evitar esto en producción

### Problema: "Cuenta demo no funciona"

**Solución**:
- Verifica que la cuenta exista en tu backend
- Prueba la cuenta antes de enviar
- Proporciona instrucciones claras

---

## 📞 Recursos Adicionales

- **App Store Connect**: https://appstoreconnect.apple.com/
- **Apple Developer**: https://developer.apple.com/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/
- **TestFlight** (para beta testing): https://developer.apple.com/testflight/

---

## ✅ Checklist Final

Antes de enviar:

- [ ] Cuenta de Apple Developer pagada ($99/año)
- [ ] Mac con Xcode instalado
- [ ] Backend funcionando con HTTPS
- [ ] Bundle Identifier configurado
- [ ] Equipo de developer seleccionado
- [ ] Icono en todos los tamaños
- [ ] Mínimo 3 capturas por tamaño requerido
- [ ] Descripción completa en español
- [ ] Keywords agregados
- [ ] Categoría seleccionada
- [ ] Información de privacidad completada
- [ ] Cuenta demo creada y funcionando
- [ ] Archive creado y subido
- [ ] Build seleccionado en App Store Connect
- [ ] Todos los campos obligatorios completados
- [ ] App probada en dispositivo real

---

## 🎓 Notas Finales

**Diferencias con Android**:
- iOS es MÁS ESTRICTO en las revisiones
- Apple revisa manualmente CADA actualización
- HTTPS es OBLIGATORIO (no opcional)
- Necesitas Mac (no hay alternativa fácil)
- Cuesta $99/año (no pago único como Android)

**Pero**:
- Los usuarios de iOS suelen ser más comprometidos
- Hay menos fragmentación de dispositivos
- El proceso está muy pulido y profesional

---

**¡Felicidades! 🎉 Ya sabes cómo publicar en Apple App Store.**

**Anterior**: Ver `GUIA_PUBLICAR_GOOGLE_PLAY.md` para Android

