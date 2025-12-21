# 📋 Instrucciones para el Backend - G.E.P.N

Este documento contiene las instrucciones completas para implementar el backend que manejará el registro de usuarios, autenticación y almacenamiento de denuncias en base de datos.

## 🗄️ Estructura de Base de Datos

### Tabla: `ciudadanos`

Almacena la información de los ciudadanos registrados.

```sql
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
```

### Tabla: `denuncias`

Almacena las denuncias realizadas por los ciudadanos.

```sql
CREATE TABLE denuncias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ciudadano_id INT NOT NULL,
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
  estado VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, En Proceso, Resuelta, Archivada
  FOREIGN KEY (ciudadano_id) REFERENCES ciudadanos(id) ON DELETE CASCADE,
  INDEX idx_ciudadano (ciudadano_id),
  INDEX idx_fecha (fecha_denuncia),
  INDEX idx_estado (estado)
);
```

### Tabla: `tokens` (Opcional - para JWT)

Si usas tokens JWT para autenticación.

```sql
CREATE TABLE tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ciudadano_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  fecha_expiracion DATETIME NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (ciudadano_id) REFERENCES ciudadanos(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_ciudadano (ciudadano_id)
);
```

## 🔐 Endpoints de API Necesarios

### 1. Registro de Ciudadano

**POST** `/api/ciudadano/registro`

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "cedula": "V-12345678",
  "telefono": "0412-1234567",
  "contraseña": "password123"
}
```

**Respuesta Exitosa (201):**
```json
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

**Respuesta Error (400):**
```json
{
  "success": false,
  "message": "La cédula ya está registrada"
}
```

### 2. Login de Ciudadano

**POST** `/api/ciudadano/login`

**Body:**
```json
{
  "cedula": "V-12345678",
  "contraseña": "password123"
}
```

**Respuesta Exitosa (200):**
```json
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

**Respuesta Error (401):**
```json
{
  "success": false,
  "message": "Cédula o contraseña incorrectos"
}
```

### 3. Crear Denuncia

**POST** `/api/denuncia/crear`

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

**Body:**
```json
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
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Denuncia registrada correctamente",
  "data": {
    "id": 1,
    "numero_denuncia": "DEN-2024-0001",
    "fecha": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Obtener Denuncias del Usuario

**GET** `/api/denuncia/mis-denuncias`

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero_denuncia": "DEN-2024-0001",
      "motivo": "Robo",
      "fecha_denuncia": "2024-01-15T10:30:00Z",
      "estado": "Pendiente"
    }
  ]
}
```

## 💻 Ejemplo de Implementación con Node.js + Express + MySQL

### 1. Instalación de Dependencias

```bash
npm init -y
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

### 2. Estructura de Carpetas

```
backend/
├── config/
│   └── database.js
├── controllers/
│   ├── ciudadanoController.js
│   └── denunciaController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── Ciudadano.js
│   └── Denuncia.js
├── routes/
│   ├── ciudadanoRoutes.js
│   └── denunciaRoutes.js
├── utils/
│   └── validators.js
├── .env
├── server.js
└── package.json
```

### 3. Archivo `.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=gepn_db
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=7d
PORT=8080
```

### 4. Configuración de Base de Datos (`config/database.js`)

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### 5. Modelo de Ciudadano (`models/Ciudadano.js`)

```javascript
const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Ciudadano {
  static async crear(nombre, cedula, telefono, contraseña) {
    // Verificar si la cédula ya existe
    const [existing] = await db.execute(
      'SELECT id FROM ciudadanos WHERE cedula = ?',
      [cedula]
    );

    if (existing.length > 0) {
      throw new Error('La cédula ya está registrada');
    }

    // Hashear contraseña
    const contraseñaHash = await bcrypt.hash(contraseña, 10);

    // Insertar nuevo ciudadano
    const [result] = await db.execute(
      `INSERT INTO ciudadanos (nombre, cedula, telefono, contraseña_hash) 
       VALUES (?, ?, ?, ?)`,
      [nombre, cedula, telefono, contraseñaHash]
    );

    return {
      id: result.insertId,
      nombre,
      cedula,
      telefono
    };
  }

  static async buscarPorCedula(cedula) {
    const [rows] = await db.execute(
      'SELECT * FROM ciudadanos WHERE cedula = ? AND activo = TRUE',
      [cedula]
    );
    return rows[0];
  }

  static async verificarContraseña(contraseña, hash) {
    return await bcrypt.compare(contraseña, hash);
  }

  static async obtenerPorId(id) {
    const [rows] = await db.execute(
      'SELECT id, nombre, cedula, telefono FROM ciudadanos WHERE id = ? AND activo = TRUE',
      [id]
    );
    return rows[0];
  }
}

module.exports = Ciudadano;
```

### 6. Modelo de Denuncia (`models/Denuncia.js`)

```javascript
const db = require('../config/database');

class Denuncia {
  static async crear(ciudadanoId, datosDenuncia) {
    const {
      nombreDenunciante,
      cedulaDenunciante,
      telefonoDenunciante,
      fechaNacimientoDenunciante,
      parroquiaDenunciante,
      motivo,
      hechos,
      nombreDenunciado,
      direccionDenunciado,
      estadoDenunciado,
      municipioDenunciado,
      parroquiaDenunciado
    } = datosDenuncia;

    // Generar número de denuncia
    const numeroDenuncia = await this.generarNumeroDenuncia();

    const [result] = await db.execute(
      `INSERT INTO denuncias (
        ciudadano_id, nombre_denunciante, cedula_denunciante, 
        telefono_denunciante, fecha_nacimiento_denunciante, 
        parroquia_denunciante, motivo, hechos, nombre_denunciado,
        direccion_denunciado, estado_denunciado, municipio_denunciado,
        parroquia_denunciado, numero_denuncia
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ciudadanoId,
        nombreDenunciante,
        cedulaDenunciante,
        telefonoDenunciante,
        fechaNacimientoDenunciante || null,
        parroquiaDenunciante,
        motivo,
        hechos,
        nombreDenunciado || null,
        direccionDenunciado || null,
        estadoDenunciado || null,
        municipioDenunciado || null,
        parroquiaDenunciado || null,
        numeroDenuncia
      ]
    );

    return {
      id: result.insertId,
      numero_denuncia: numeroDenuncia
    };
  }

  static async generarNumeroDenuncia() {
    const año = new Date().getFullYear();
    const [rows] = await db.execute(
      'SELECT COUNT(*) as total FROM denuncias WHERE YEAR(fecha_denuncia) = ?',
      [año]
    );
    const numero = (rows[0].total + 1).toString().padStart(4, '0');
    return `DEN-${año}-${numero}`;
  }

  static async obtenerPorCiudadano(ciudadanoId) {
    const [rows] = await db.execute(
      `SELECT id, numero_denuncia, motivo, fecha_denuncia, estado 
       FROM denuncias 
       WHERE ciudadano_id = ? 
       ORDER BY fecha_denuncia DESC`,
      [ciudadanoId]
    );
    return rows;
  }

  static async obtenerPorId(id, ciudadanoId) {
    const [rows] = await db.execute(
      `SELECT * FROM denuncias 
       WHERE id = ? AND ciudadano_id = ?`,
      [id, ciudadanoId]
    );
    return rows[0];
  }
}

module.exports = Denuncia;
```

### 7. Middleware de Autenticación (`middleware/auth.js`)

```javascript
const jwt = require('jsonwebtoken');
const Ciudadano = require('../models/Ciudadano');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const ciudadano = await Ciudadano.obtenerPorId(decoded.id);

    if (!ciudadano) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    req.ciudadano = ciudadano;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

module.exports = authMiddleware;
```

### 8. Controlador de Ciudadano (`controllers/ciudadanoController.js`)

```javascript
const Ciudadano = require('../models/Ciudadano');
const jwt = require('jsonwebtoken');

const generarToken = (ciudadano) => {
  return jwt.sign(
    { id: ciudadano.id, cedula: ciudadano.cedula },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.registro = async (req, res) => {
  try {
    const { nombre, cedula, telefono, contraseña } = req.body;

    // Validaciones
    if (!nombre || !cedula || !telefono || !contraseña) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (contraseña.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Crear ciudadano
    const ciudadano = await Ciudadano.crear(nombre, cedula, telefono, contraseña);
    
    // Generar token
    const token = generarToken(ciudadano);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: ciudadano,
      token
    });
  } catch (error) {
    if (error.message === 'La cédula ya está registrada') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { cedula, contraseña } = req.body;

    if (!cedula || !contraseña) {
      return res.status(400).json({
        success: false,
        message: 'Cédula y contraseña son requeridos'
      });
    }

    // Buscar ciudadano
    const ciudadano = await Ciudadano.buscarPorCedula(cedula);

    if (!ciudadano) {
      return res.status(401).json({
        success: false,
        message: 'Cédula o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const contraseñaValida = await Ciudadano.verificarContraseña(
      contraseña,
      ciudadano.contraseña_hash
    );

    if (!contraseñaValida) {
      return res.status(401).json({
        success: false,
        message: 'Cédula o contraseña incorrectos'
      });
    }

    // Generar token
    const token = generarToken(ciudadano);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: ciudadano.id,
        nombre: ciudadano.nombre,
        cedula: ciudadano.cedula,
        telefono: ciudadano.telefono
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
};
```

### 9. Controlador de Denuncia (`controllers/denunciaController.js`)

```javascript
const Denuncia = require('../models/Denuncia');

exports.crear = async (req, res) => {
  try {
    const { denunciante, denuncia, denunciado } = req.body;
    const ciudadanoId = req.ciudadano.id;

    // Validaciones
    if (!denunciante || !denuncia) {
      return res.status(400).json({
        success: false,
        message: 'Datos del denunciante y denuncia son requeridos'
      });
    }

    if (!denunciante.nombre || !denunciante.cedula || 
        !denunciante.telefono || !denuncia.motivo || !denuncia.hechos) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios deben ser completados'
      });
    }

    // Convertir fecha de nacimiento si viene en formato DD/MM/AAAA
    let fechaNacimiento = null;
    if (denunciante.fechaNacimiento) {
      const [dia, mes, año] = denunciante.fechaNacimiento.split('/');
      fechaNacimiento = `${año}-${mes}-${dia}`;
    }

    const datosDenuncia = {
      nombreDenunciante: denunciante.nombre,
      cedulaDenunciante: denunciante.cedula,
      telefonoDenunciante: denunciante.telefono,
      fechaNacimientoDenunciante: fechaNacimiento,
      parroquiaDenunciante: denunciante.parroquia,
      motivo: denuncia.motivo,
      hechos: denuncia.hechos,
      nombreDenunciado: denunciado?.nombre || null,
      direccionDenunciado: denunciado?.direccion || null,
      estadoDenunciado: denunciado?.estado || null,
      municipioDenunciado: denunciado?.municipio || null,
      parroquiaDenunciado: denunciado?.parroquia || null
    };

    const resultado = await Denuncia.crear(ciudadanoId, datosDenuncia);

    res.status(201).json({
      success: true,
      message: 'Denuncia registrada correctamente',
      data: {
        id: resultado.id,
        numero_denuncia: resultado.numero_denuncia,
        fecha: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error al crear denuncia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar la denuncia'
    });
  }
};

exports.misDenuncias = async (req, res) => {
  try {
    const ciudadanoId = req.ciudadano.id;
    const denuncias = await Denuncia.obtenerPorCiudadano(ciudadanoId);

    res.json({
      success: true,
      data: denuncias
    });
  } catch (error) {
    console.error('Error al obtener denuncias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener denuncias'
    });
  }
};
```

### 10. Rutas (`routes/ciudadanoRoutes.js`)

```javascript
const express = require('express');
const router = express.Router();
const ciudadanoController = require('../controllers/ciudadanoController');

router.post('/registro', ciudadanoController.registro);
router.post('/login', ciudadanoController.login);

module.exports = router;
```

### 11. Rutas de Denuncia (`routes/denunciaRoutes.js`)

```javascript
const express = require('express');
const router = express.Router();
const denunciaController = require('../controllers/denunciaController');
const authMiddleware = require('../middleware/auth');

router.post('/crear', authMiddleware, denunciaController.crear);
router.get('/mis-denuncias', authMiddleware, denunciaController.misDenuncias);

module.exports = router;
```

### 12. Servidor Principal (`server.js`)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ciudadanoRoutes = require('./routes/ciudadanoRoutes');
const denunciaRoutes = require('./routes/denunciaRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/ciudadano', ciudadanoRoutes);
app.use('/api/denuncia', denunciaRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
```

### 13. `package.json`

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
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 🔄 Actualizar el Frontend

Una vez que tengas el backend funcionando, actualiza `src/services/apiService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8080'; // O la URL de tu servidor

// Agregar funciones para ciudadano
export const registerCiudadano = async (
  nombre: string,
  cedula: string,
  telefono: string,
  contraseña: string,
): Promise<{success: boolean; token?: string; data?: any}> => {
  try {
    const response = await api.post('/api/ciudadano/registro', {
      nombre,
      cedula,
      telefono,
      contraseña,
    });

    if (response.data.success && response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('ciudadano_user', JSON.stringify(response.data.data));
      return {success: true, token: response.data.token, data: response.data.data};
    }
    return {success: false};
  } catch (error: any) {
    console.error('Error en registro:', error);
    return {success: false};
  }
};

export const loginCiudadano = async (
  cedula: string,
  contraseña: string,
): Promise<{success: boolean; token?: string; data?: any}> => {
  try {
    const response = await api.post('/api/ciudadano/login', {
      cedula,
      contraseña,
    });

    if (response.data.success && response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('ciudadano_user', JSON.stringify(response.data.data));
      return {success: true, token: response.data.token, data: response.data.data};
    }
    return {success: false};
  } catch (error: any) {
    console.error('Error en login:', error);
    return {success: false};
  }
};

export const crearDenuncia = async (datosDenuncia: any): Promise<boolean> => {
  try {
    const response = await api.post('/api/denuncia/crear', datosDenuncia);
    return response.data.success;
  } catch (error) {
    console.error('Error al crear denuncia:', error);
    return false;
  }
};
```

## 🚀 Pasos para Implementar

1. **Instalar MySQL/MariaDB** en tu servidor
2. **Crear la base de datos** usando los scripts SQL proporcionados
3. **Configurar el archivo `.env`** con tus credenciales
4. **Instalar dependencias**: `npm install`
5. **Ejecutar el servidor**: `npm run dev`
6. **Probar los endpoints** con Postman o similar
7. **Actualizar el frontend** para usar los nuevos endpoints

## 🔒 Seguridad Adicional Recomendada

- Usar HTTPS en producción
- Validar y sanitizar todas las entradas
- Implementar rate limiting
- Agregar logs de auditoría
- Usar variables de entorno para secretos
- Implementar recuperación de contraseña
- Agregar verificación de email (opcional)

## 📝 Notas

- Ajusta los tipos de datos según tu base de datos (PostgreSQL, MongoDB, etc.)
- El formato de fecha puede variar según tu necesidad
- Considera agregar índices adicionales según el uso
- Implementa paginación para las listas de denuncias

