# 📋 INSTRUCCIONES PARA EL BACKEND - PRODUCCIÓN

**IMPORTANTE**: Este archivo contiene todas las instrucciones que necesita el backend para estar listo para producción y funcionar con las apps móviles.

---

## 🎯 RESUMEN EJECUTIVO

Para que las apps móviles funcionen correctamente, el backend necesita:

1. ✅ **Estar desplegado en un servidor con IP pública o dominio** (no localhost)
2. ✅ **Tener certificado SSL/HTTPS** (obligatorio para iOS, recomendado para Android)
3. ✅ **Configurar CORS** para aceptar peticiones desde las apps móviles
4. ✅ **Implementar todos los endpoints necesarios**
5. ✅ **Tener base de datos configurada y funcionando**
6. ✅ **Variables de entorno configuradas correctamente**

---

## 📍 PASO 1: DESPLEGAR EL BACKEND EN UN SERVIDOR

### Opciones de Hosting Recomendadas:

#### Opción 1: Heroku (Fácil y Gratuito para empezar)
```bash
# Instalar Heroku CLI
# Windows: descargar de https://devcenter.heroku.com/articles/heroku-cli

# Login a Heroku
heroku login

# Crear app
heroku create nombre-app-gepn-backend

# Agregar base de datos
heroku addons:create jawsdb:kitefin  # MySQL gratuito

# Desplegar
git push heroku main

# Tu URL será: https://nombre-app-gepn-backend.herokuapp.com
```

#### Opción 2: Railway (Moderno y Fácil)
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Iniciar proyecto
railway init

# Agregar MySQL
railway add mysql

# Desplegar
railway up

# Obtendrás una URL como: https://tu-app.railway.app
```

#### Opción 3: DigitalOcean App Platform
- Conectar repositorio Git
- Seleccionar Node.js
- Agregar base de datos MySQL
- Desplegar automáticamente

#### Opción 4: AWS EC2 (Más control, requiere configuración)
- Crear instancia EC2
- Instalar Node.js y MySQL
- Configurar Nginx como proxy reverso
- Configurar PM2 para mantener el servidor corriendo

#### Opción 5: VPS (Hostinger, Contabo, etc.)
- Contratar VPS
- Instalar Node.js, MySQL, Nginx
- Configurar dominio
- Usar PM2 para el backend

---

## 🔐 PASO 2: CONFIGURAR HTTPS (OBLIGATORIO)

### Por qué es necesario:
- **iOS**: Apple **OBLIGA** a usar HTTPS. Las apps iOS NO funcionarán con HTTP.
- **Android**: Google Play Store requiere HTTPS para apps en producción.

### Cómo obtener certificado SSL GRATIS:

#### Si usas un dominio (Recomendado):

```bash
# 1. Instalar Certbot
# Ubuntu/Debian:
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 2. Obtener certificado
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# 3. Renovar automáticamente
sudo certbot renew --dry-run
```

#### Si usas Heroku/Railway/DigitalOcean:
- ✅ **Ya tienen HTTPS automático** - no necesitas hacer nada

---

## 🌐 PASO 3: CONFIGURAR CORS CORRECTAMENTE

Actualiza tu archivo `server.js` o equivalente:

```javascript
const cors = require('cors');

// Configuración de CORS para producción
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (apps móviles)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:3000',  // Desarrollo web
      'https://tudominio.com',  // Producción web
      // Las apps móviles no envían origin, se permiten con el !origin arriba
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## 📡 PASO 4: ENDPOINTS OBLIGATORIOS

Asegúrate de que el backend tenga implementados estos endpoints:

### 1. Registro de Ciudadano
```
POST /api/ciudadano/registro
Content-Type: application/json

Body:
{
  "nombre": "Juan Pérez",
  "cedula": "V-12345678",
  "telefono": "0412-1234567",
  "contraseña": "password123"
}

Response 201:
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "cedula": "V-12345678",
    "telefono": "0412-1234567"
  },
  "token": "jwt_token_aqui"
}
```

### 2. Login de Ciudadano
```
POST /api/ciudadano/login
Content-Type: application/json

Body:
{
  "cedula": "V-12345678",
  "contraseña": "password123"
}

Response 200:
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "cedula": "V-12345678",
    "telefono": "0412-1234567"
  },
  "token": "jwt_token_aqui"
}
```

### 3. Crear Denuncia
```
POST /api/denuncia/crear
Authorization: Bearer jwt_token_aqui
Content-Type: application/json

Body:
{
  "denunciante": {
    "nombre": "Juan Pérez",
    "cedula": "V-12345678",
    "telefono": "0412-1234567",
    "fechaNacimiento": "15/05/1990",
    "parroquia": "La Candelaria"
  },
  "denuncia": {
    "motivo": "Robo",
    "hechos": "Me robaron el teléfono en la calle..."
  },
  "denunciado": {
    "nombre": "Pedro González",
    "direccion": "Calle Principal #123",
    "estado": "05",
    "municipio": "0501",
    "parroquia": "Caracas"
  }
}

Response 201:
{
  "success": true,
  "message": "Denuncia registrada correctamente",
  "data": {
    "id": 1,
    "numero_denuncia": "DEN-2026-0001",
    "fecha": "2026-01-12T10:30:00Z"
  }
}
```

### 4. Obtener Mis Denuncias
```
GET /api/denuncia/mis-denuncias
Authorization: Bearer jwt_token_aqui

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero_denuncia": "DEN-2026-0001",
      "motivo": "Robo",
      "fecha_denuncia": "2026-01-12T10:30:00Z",
      "estado": "Pendiente"
    }
  ]
}
```

### 5. Obtener Detalle de Denuncia
```
GET /api/denuncia/:id
Authorization: Bearer jwt_token_aqui

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "numero_denuncia": "DEN-2026-0001",
    "motivo": "Robo",
    "hechos": "Me robaron el teléfono...",
    "fecha_denuncia": "2026-01-12T10:30:00Z",
    "estado": "Pendiente",
    "denunciante": {
      "nombre": "Juan Pérez",
      "cedula": "V-12345678",
      "telefono": "0412-1234567"
    },
    "denunciado": {
      "nombre": "Pedro González",
      "direccion": "Calle Principal #123"
    }
  }
}
```

### 6. Health Check (Para verificar que funciona)
```
GET /api/health

Response 200:
{
  "status": "OK",
  "message": "Servidor funcionando",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

---

## 🗄️ PASO 5: BASE DE DATOS

### Tablas necesarias:

```sql
-- Tabla de ciudadanos
CREATE TABLE ciudadanos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  contraseña_hash VARCHAR(255) NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT TRUE,
  INDEX idx_cedula (cedula)
);

-- Tabla de denuncias
CREATE TABLE denuncias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ciudadano_id INT NOT NULL,
  numero_denuncia VARCHAR(50) UNIQUE NOT NULL,
  -- Datos del denunciante
  nombre_denunciante VARCHAR(255) NOT NULL,
  cedula_denunciante VARCHAR(20) NOT NULL,
  telefono_denunciante VARCHAR(20) NOT NULL,
  fecha_nacimiento_denunciante DATE,
  parroquia_denunciante VARCHAR(255),
  -- Datos de la denuncia
  motivo VARCHAR(255) NOT NULL,
  hechos TEXT NOT NULL,
  -- Datos del denunciado
  nombre_denunciado VARCHAR(255),
  direccion_denunciado VARCHAR(500),
  estado_denunciado VARCHAR(100),
  municipio_denunciado VARCHAR(100),
  parroquia_denunciado VARCHAR(100),
  -- Metadatos
  fecha_denuncia DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'Pendiente',
  FOREIGN KEY (ciudadano_id) REFERENCES ciudadanos(id) ON DELETE CASCADE,
  INDEX idx_ciudadano (ciudadano_id),
  INDEX idx_fecha (fecha_denuncia),
  INDEX idx_estado (estado),
  INDEX idx_numero (numero_denuncia)
);
```

---

## 🔑 PASO 6: VARIABLES DE ENTORNO

Crea un archivo `.env` con estas variables:

```env
# Base de datos
DB_HOST=tu-host-mysql
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=gepn_db
DB_PORT=3306

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambiar_esto_123456789
JWT_EXPIRES_IN=7d

# Servidor
PORT=8080
NODE_ENV=production

# URL del servidor (para CORS)
API_URL=https://tu-dominio.com
```

**IMPORTANTE**: 
- Cambia `JWT_SECRET` por algo completamente aleatorio y seguro
- Usa variables de entorno en tu plataforma de hosting
- NUNCA subas el archivo `.env` a Git

---

## 🚀 PASO 7: CONFIGURACIÓN FINAL

### 1. Instalar dependencias:
```bash
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

### 2. Configurar `package.json`:
```json
{
  "name": "gepn-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### 3. Verificar que el servidor escucha en todas las interfaces:
```javascript
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
```

---

## ✅ PASO 8: PROBAR EL BACKEND

### 1. Verificar que el servidor está corriendo:
```bash
curl https://tu-dominio.com/api/health
```

### 2. Probar registro:
```bash
curl -X POST https://tu-dominio.com/api/ciudadano/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "cedula": "V-99999999",
    "telefono": "0412-9999999",
    "contraseña": "test123"
  }'
```

### 3. Probar login:
```bash
curl -X POST https://tu-dominio.com/api/ciudadano/login \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "V-99999999",
    "contraseña": "test123"
  }'
```

---

## 📱 PASO 9: URL PARA EL FRONTEND

Una vez que el backend esté desplegado, proporciona la URL completa:

**Ejemplo**:
- ✅ `https://gepn-backend.herokuapp.com`
- ✅ `https://api.gepn.com.ve`
- ✅ `https://backend.miapp.com`

**NO válido para apps**:
- ❌ `http://localhost:8080` (solo para desarrollo local)
- ❌ `http://192.168.1.100:8080` (IP privada)
- ❌ `http://midominio.com` (sin HTTPS)

---

## 🔒 PASO 10: SEGURIDAD ADICIONAL (RECOMENDADO)

### 1. Rate Limiting:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);
```

### 2. Helmet (Seguridad HTTP):
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 3. Validación de datos:
```bash
npm install express-validator
```

### 4. Logs:
```bash
npm install morgan
```

```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: "CORS error" en la app
**Solución**: Verifica que CORS permita requests sin origin (apps móviles)

### Problema: "Network request failed" en iOS
**Solución**: El backend DEBE usar HTTPS, iOS bloquea HTTP

### Problema: "Unable to resolve host"
**Solución**: Verifica que el dominio/IP sea accesible públicamente

### Problema: "Connection timeout"
**Solución**: Verifica el firewall del servidor, debe permitir tráfico en el puerto

---

## 📋 CHECKLIST FINAL

Antes de decir que el backend está listo:

- [ ] Backend desplegado en servidor con IP pública o dominio
- [ ] HTTPS configurado y funcionando
- [ ] CORS configurado correctamente
- [ ] Todos los endpoints implementados y probados
- [ ] Base de datos creada y tablas configuradas
- [ ] Variables de entorno configuradas
- [ ] JWT_SECRET configurado y seguro
- [ ] Health check endpoint funcionando
- [ ] Probado registro de usuario
- [ ] Probado login de usuario
- [ ] Probado creación de denuncia
- [ ] Probado obtención de denuncias
- [ ] URL del backend proporcionada al equipo frontend

---

## 📞 INFORMACIÓN PARA ENTREGAR AL FRONTEND

Una vez completado todo, proporciona esta información:

```
✅ URL del Backend: https://tu-dominio.com
✅ Estado del servidor: Corriendo
✅ Base de datos: Configurada
✅ HTTPS: Activo
✅ Endpoints: Todos funcionando

Endpoints disponibles:
- POST /api/ciudadano/registro
- POST /api/ciudadano/login
- POST /api/denuncia/crear
- GET /api/denuncia/mis-denuncias
- GET /api/denuncia/:id
- GET /api/health
```

---

## 🎓 RECURSOS ADICIONALES

- [Documentación de Express](https://expressjs.com/)
- [Documentación de JWT](https://jwt.io/)
- [Guía de CORS](https://developer.mozilla.org/es/docs/Web/HTTP/CORS)
- [Despliegue en Heroku](https://devcenter.heroku.com/articles/deploying-nodejs)
- [Certbot para SSL](https://certbot.eff.org/)

---

**¿Dudas?** Consulta `BACKEND_INSTRUCCIONES.md` para más detalles de implementación.
