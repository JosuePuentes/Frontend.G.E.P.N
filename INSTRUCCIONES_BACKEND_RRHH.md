# 📋 Instrucciones para Backend - Sistema de RRHH

## 🎯 Objetivo

Implementar el sistema de Recursos Humanos para registrar oficiales policiales que podrán acceder a la aplicación mediante `/policial` con sus credenciales y contraseña.

## 📊 Estructura de Datos

### Modelo de Oficial

```go
type Oficial struct {
    ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    PrimerNombre      string             `bson:"primer_nombre" json:"primer_nombre"`
    SegundoNombre     string             `bson:"segundo_nombre" json:"segundo_nombre"`
    PrimerApellido    string             `bson:"primer_apellido" json:"primer_apellido"`
    SegundoApellido   string             `bson:"segundo_apellido" json:"segundo_apellido"`
    Cedula            string             `bson:"cedula" json:"cedula"`
    Contraseña        string             `bson:"contraseña" json:"-"` // Hash, no se envía
    FechaNacimiento   string             `bson:"fecha_nacimiento" json:"fecha_nacimiento"` // YYYY-MM-DD
    Estatura          float64            `bson:"estatura" json:"estatura"` // en cm
    ColorPiel         string             `bson:"color_piel" json:"color_piel"`
    TipoSangre        string             `bson:"tipo_sangre" json:"tipo_sangre"`
    CiudadNacimiento  string             `bson:"ciudad_nacimiento" json:"ciudad_nacimiento"`
    Credencial        string             `bson:"credencial" json:"credencial"` // Único
    Rango             string             `bson:"rango" json:"rango"`
    Destacado         string             `bson:"destacado" json:"destacado"`
    Estado            string             `bson:"estado" json:"estado"`
    Municipio         string             `bson:"municipio" json:"municipio"`
    Parroquia         string             `bson:"parroquia" json:"parroquia"`
    FotoCara          string             `bson:"foto_cara" json:"foto_cara"` // Base64 o URL
    FotoCarnet        string             `bson:"foto_carnet" json:"foto_carnet,omitempty"` // Base64 o URL, opcional
    QRCode            string             `bson:"qr_code" json:"qr_code,omitempty"` // Código QR generado
    FechaRegistro     time.Time          `bson:"fecha_registro" json:"fecha_registro"`
    Activo            bool               `bson:"activo" json:"activo"`
}
```

## 🔐 Rangos Policiales

Los rangos válidos son (en orden jerárquico):

1. Oficial
2. Primer Oficial
3. Oficial Jefe
4. Inspector
5. Primer Inspector
6. Inspector Jefe
7. Comisario
8. Primer Comisario
9. Comisario Jefe
10. Comisario General
11. Comisario Mayor
12. Comisario Superior

## 🌐 Endpoints Requeridos

### 1. POST `/api/rrhh/registrar-oficial`

Registra un nuevo oficial en el sistema.

**Request Body:**
```json
{
  "primer_nombre": "Juan",
  "segundo_nombre": "Carlos",
  "primer_apellido": "Pérez",
  "segundo_apellido": "González",
  "cedula": "V-12345678",
  "contraseña": "password123",
  "fecha_nacimiento": "1990-05-15",
  "estatura": 175.5,
  "color_piel": "Mestizo",
  "tipo_sangre": "O+",
  "ciudad_nacimiento": "Caracas",
  "credencial": "POL-12345",
  "rango": "Comisario",
  "destacado": "Comando Regional #1",
  "estado": "Distrito Capital",
  "municipio": "Libertador",
  "parroquia": "Catedral",
  "foto_cara": "data:image/png;base64,iVBORw0KGgoAAAANS...", // Base64
  "foto_carnet": "data:image/png;base64,iVBORw0KGgoAAAANS..." // Base64 opcional
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Oficial registrado correctamente",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "credencial": "POL-12345",
    "qr_code": "https://api.example.com/qr/POL-12345.png"
  }
}
```

**Response Error (400/409):**
```json
{
  "success": false,
  "message": "La credencial ya está registrada"
}
```

**Validaciones:**
- ✅ Credencial debe ser única
- ✅ Cédula debe ser única
- ✅ Contraseña mínimo 6 caracteres (hashear con bcrypt)
- ✅ Todos los campos obligatorios deben estar presentes
- ✅ Rango debe ser uno de los válidos
- ✅ Foto de cara es obligatoria
- ✅ Fecha de nacimiento formato YYYY-MM-DD

### 2. GET `/api/rrhh/generar-qr/:oficialId`

Genera o obtiene el código QR del oficial.

**Response Success (200):**
```json
{
  "success": true,
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...", // QR en Base64
  "qr_url": "https://api.example.com/qr/POL-12345.png" // URL del QR
}
```

**Datos del QR:**
El QR debe contener un JSON con la información del oficial:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "credencial": "POL-12345",
  "nombre_completo": "Juan Carlos Pérez González",
  "rango": "Comisario",
  "foto_cara": "data:image/png;base64,...",
  "foto_carnet": "data:image/png;base64,...",
  "destacado": "Comando Regional #1",
  "fecha_registro": "2024-01-15T10:30:00Z"
}
```

### 3. GET `/api/rrhh/oficial/:credencial`

Obtiene información de un oficial por su credencial (para mostrar en el QR escaneado).

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "credencial": "POL-12345",
    "primer_nombre": "Juan",
    "segundo_nombre": "Carlos",
    "primer_apellido": "Pérez",
    "segundo_apellido": "González",
    "nombre_completo": "Juan Carlos Pérez González",
    "cedula": "V-12345678",
    "fecha_nacimiento": "1990-05-15",
    "estatura": 175.5,
    "color_piel": "Mestizo",
    "tipo_sangre": "O+",
    "ciudad_nacimiento": "Caracas",
    "rango": "Comisario",
    "destacado": "Comando Regional #1",
    "estado": "Distrito Capital",
    "municipio": "Libertador",
    "parroquia": "Catedral",
    "foto_cara": "data:image/png;base64,...",
    "foto_carnet": "data:image/png;base64,...",
    "fecha_registro": "2024-01-15T10:30:00Z"
  }
}
```

### 4. GET `/api/rrhh/listar-oficiales`

Lista todos los oficiales registrados (con paginación).

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad por página (default: 20)
- `rango` (opcional): Filtrar por rango
- `estado` (opcional): Filtrar por estado

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "oficiales": [...],
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

## 🔄 Modificar Login Policial

El endpoint existente `/api/policial/login` debe funcionar con las credenciales registradas en RRHH.

**Request Body:**
```json
{
  "credencial": "POL-12345",
  "pin": "123456",
  "latitud": 10.4969,
  "longitud": -66.8983
}
```

**Validación:**
- ✅ Verificar que la credencial exista en la colección de oficiales
- ✅ Verificar que el PIN/contraseña sea correcto
- ✅ Verificar que el oficial esté activo

## 📸 Manejo de Imágenes

### Opción 1: Almacenar Base64 en MongoDB
- **Ventaja**: Simple, no requiere almacenamiento externo
- **Desventaja**: Base de datos más pesada
- **Recomendado para**: Desarrollo y pocos oficiales

### Opción 2: Almacenar en sistema de archivos/S3
- **Ventaja**: Base de datos más ligera, mejor rendimiento
- **Desventaja**: Requiere configuración adicional
- **Recomendado para**: Producción

**Implementación Base64 (simple):**
```go
// Al recibir la imagen en Base64, guardarla directamente
oficial.FotoCara = datos.FotoCara // Ya viene en Base64 desde el frontend
```

**Implementación con almacenamiento:**
```go
// Decodificar Base64 y guardar como archivo
// Generar nombre único: oficial_{credencial}_cara.png
// Guardar en carpeta uploads/oficiales/
// Guardar solo la URL en MongoDB
oficial.FotoCara = "/uploads/oficiales/POL-12345_cara.png"
```

## 🔲 Generación de Código QR

### Librería Recomendada: `github.com/skip2/go-qrcode`

```go
import "github.com/skip2/go-qrcode"

// Generar QR con información del oficial
datosQR := map[string]interface{}{
    "id": oficial.ID.Hex(),
    "credencial": oficial.Credencial,
    "nombre_completo": oficial.PrimerNombre + " " + oficial.SegundoNombre + " " + oficial.PrimerApellido + " " + oficial.SegundoApellido,
    "rango": oficial.Rango,
    "foto_cara": oficial.FotoCara,
    "foto_carnet": oficial.FotoCarnet,
    "destacado": oficial.Destacado,
    "fecha_registro": oficial.FechaRegistro.Format(time.RFC3339),
}

jsonData, _ := json.Marshal(datosQR)
qrCode, err := qrcode.New(string(jsonData), qrcode.Medium)
if err != nil {
    return err
}

// Convertir a Base64
png, _ := qrcode.Encode(string(jsonData), qrcode.Medium, 256)
qrBase64 := base64.StdEncoding.EncodeToString(png)
oficial.QRCode = "data:image/png;base64," + qrBase64
```

## 📱 Endpoint para Escanear QR

### GET `/api/rrhh/verificar-qr/:qrData`

Cuando se escanea el QR, el frontend enviará los datos decodificados. El QR puede contener:
- El ID del oficial
- La credencial del oficial
- Un JSON con los datos del oficial

**Request:**
```
GET /api/rrhh/verificar-qr/POL-12345
```

O si el QR contiene JSON:
```
GET /api/rrhh/verificar-qr/{"id":"507f1f77bcf86cd799439011","credencial":"POL-12345"}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "credencial": "POL-12345",
    "primer_nombre": "Juan",
    "segundo_nombre": "Carlos",
    "primer_apellido": "Pérez",
    "segundo_apellido": "González",
    "nombre_completo": "Juan Carlos Pérez González",
    "cedula": "V-12345678",
    "fecha_nacimiento": "1990-05-15",
    "estatura": 175.5,
    "color_piel": "Mestizo",
    "tipo_sangre": "O+",
    "ciudad_nacimiento": "Caracas",
    "rango": "Comisario",
    "destacado": "Comando Regional #1",
    "estado": "Distrito Capital",
    "municipio": "Libertador",
    "parroquia": "Catedral",
    "foto_cara": "data:image/png;base64,...",
    "foto_carnet": "data:image/png;base64,...",
    "fecha_registro": "2024-01-15T10:30:00Z",
    "activo": true
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Oficial no encontrado"
}
```

## 🔒 Seguridad

1. **Autenticación**: El endpoint `/api/rrhh/*` debe requerir autenticación de administrador
2. **Hash de contraseñas**: Usar bcrypt con salt rounds >= 10
3. **Validación de datos**: Validar todos los campos antes de guardar
4. **Sanitización**: Limpiar datos de entrada para prevenir inyecciones
5. **Rate limiting**: Limitar requests para prevenir abuso

## 📝 Colección MongoDB

**Nombre:** `oficiales`

**Índices:**
```go
// Índice único para credencial
db.oficiales.createIndex({ "credencial": 1 }, { unique: true })

// Índice único para cédula
db.oficiales.createIndex({ "cedula": 1 }, { unique: true })

// Índice para búsquedas por rango
db.oficiales.createIndex({ "rango": 1 })

// Índice para búsquedas por estado
db.oficiales.createIndex({ "estado": 1 })
```

## 🧪 Ejemplo de Handler (Go)

```go
func RegistrarOficial(c *gin.Context) {
    var datos struct {
        PrimerNombre     string `json:"primer_nombre" binding:"required"`
        SegundoNombre    string `json:"segundo_nombre"`
        PrimerApellido   string `json:"primer_apellido" binding:"required"`
        SegundoApellido  string `json:"segundo_apellido"`
        Cedula           string `json:"cedula" binding:"required"`
        Contraseña       string `json:"contraseña" binding:"required,min=6"`
        FechaNacimiento  string `json:"fecha_nacimiento" binding:"required"`
        Estatura         float64 `json:"estatura" binding:"required"`
        ColorPiel        string `json:"color_piel" binding:"required"`
        TipoSangre      string `json:"tipo_sangre" binding:"required"`
        CiudadNacimiento string `json:"ciudad_nacimiento" binding:"required"`
        Credencial       string `json:"credencial" binding:"required"`
        Rango           string `json:"rango" binding:"required"`
        Destacado       string `json:"destacado" binding:"required"`
        Estado          string `json:"estado" binding:"required"`
        Municipio       string `json:"municipio" binding:"required"`
        Parroquia       string `json:"parroquia" binding:"required"`
        FotoCara        string `json:"foto_cara" binding:"required"`
        FotoCarnet      string `json:"foto_carnet"`
    }

    if err := c.ShouldBindJSON(&datos); err != nil {
        c.JSON(400, gin.H{"success": false, "message": err.Error()})
        return
    }

    // Validar rango
    rangosValidos := []string{"Oficial", "Primer Oficial", "Oficial Jefe", "Inspector", "Primer Inspector", "Inspector Jefe", "Comisario", "Primer Comisario", "Comisario Jefe", "Comisario General", "Comisario Mayor", "Comisario Superior"}
    rangoValido := false
    for _, r := range rangosValidos {
        if datos.Rango == r {
            rangoValido = true
            break
        }
    }
    if !rangoValido {
        c.JSON(400, gin.H{"success": false, "message": "Rango inválido"})
        return
    }

    // Verificar que la credencial no exista
    // ... código de verificación ...

    // Hash de contraseña
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(datos.Contraseña), 10)

    // Crear oficial
    oficial := models.Oficial{
        PrimerNombre:    datos.PrimerNombre,
        SegundoNombre:   datos.SegundoNombre,
        PrimerApellido:  datos.PrimerApellido,
        SegundoApellido: datos.SegundoApellido,
        Cedula:          datos.Cedula,
        Contraseña:      string(hashedPassword),
        FechaNacimiento: datos.FechaNacimiento,
        Estatura:        datos.Estatura,
        ColorPiel:       datos.ColorPiel,
        TipoSangre:      datos.TipoSangre,
        CiudadNacimiento: datos.CiudadNacimiento,
        Credencial:      datos.Credencial,
        Rango:           datos.Rango,
        Destacado:       datos.Destacado,
        Estado:          datos.Estado,
        Municipio:       datos.Municipio,
        Parroquia:       datos.Parroquia,
        FotoCara:        datos.FotoCara,
        FotoCarnet:      datos.FotoCarnet,
        FechaRegistro:   time.Now(),
        Activo:          true,
    }

    // Generar QR
    // ... código de generación de QR ...

    // Guardar en MongoDB
    // ... código de guardado ...

    c.JSON(200, gin.H{
        "success": true,
        "message": "Oficial registrado correctamente",
        "data": gin.H{
            "id": oficial.ID.Hex(),
            "credencial": oficial.Credencial,
        },
    })
}
```

## ✅ Checklist de Implementación

- [ ] Crear modelo `Oficial` en `models/models.go`
- [ ] Crear repositorio `OficialRepository` en `database/repositories.go`
- [ ] Crear handler `RegistrarOficial` en `handlers/rrhh.go`
- [ ] Crear handler `GenerarQROficial` en `handlers/rrhh.go`
- [ ] Crear handler `VerificarQR` en `handlers/rrhh.go`
- [ ] Crear handler `ListarOficiales` en `handlers/rrhh.go`
- [ ] Agregar rutas en `routes/routes.go`:
  - `POST /api/rrhh/registrar-oficial`
  - `GET /api/rrhh/generar-qr/:oficialId`
  - `GET /api/rrhh/verificar-qr/:qrData`
  - `GET /api/rrhh/listar-oficiales`
- [ ] Modificar `LoginPolicial` para usar credenciales de oficiales
- [ ] Crear índices en MongoDB
- [ ] Instalar librería de QR: `go get github.com/skip2/go-qrcode`
- [ ] Implementar autenticación para endpoints de RRHH
- [ ] Probar registro de oficial
- [ ] Probar login con credenciales de oficial
- [ ] Probar generación de QR
- [ ] Probar escaneo de QR

## 🔗 Integración con Login Existente

El endpoint `/api/policial/login` debe:
1. Buscar el oficial por `credencial` en la colección `oficiales`
2. Verificar la contraseña con bcrypt
3. Verificar que el oficial esté activo
4. Crear/actualizar la guardia con latitud/longitud
5. Retornar token JWT

## 📦 Dependencias Necesarias

```go
go get github.com/skip2/go-qrcode
go get golang.org/x/crypto/bcrypt
```

## 🎨 Formato del QR Escaneado

Cuando se escanee el QR, debe mostrar una vista tipo carnet con:
- Foto de cara (obligatoria)
- Foto de carnet (si existe)
- Nombre completo
- Rango
- Credencial
- Destacado
- Fecha de registro

Esto se implementará en el frontend como una pantalla de visualización de QR.

