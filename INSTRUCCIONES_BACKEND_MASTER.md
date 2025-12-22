# 📋 Instrucciones para Backend - Sistema Master

## 🎯 Objetivo

Implementar un sistema de gestión de usuarios master con permisos por módulos. Los usuarios master pueden crear otros usuarios master y asignarles permisos específicos a diferentes módulos del sistema.

## 📊 Estructura de Datos

### Modelo de Usuario Master

```go
type UsuarioMaster struct {
    ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Usuario       string             `bson:"usuario" json:"usuario"` // Único
    Nombre        string             `bson:"nombre" json:"nombre"`
    Email         string             `bson:"email" json:"email"` // Único
    Contraseña    string             `bson:"contraseña" json:"-"` // Hash, no se envía
    Permisos      []string           `bson:"permisos" json:"permisos"` // Array de IDs de módulos
    Activo        bool               `bson:"activo" json:"activo"`
    CreadoPor     string             `bson:"creado_por" json:"creado_por"` // ID del usuario que lo creó
    FechaCreacion time.Time          `bson:"fecha_creacion" json:"fecha_creacion"`
    UltimoAcceso  time.Time          `bson:"ultimo_acceso,omitempty" json:"ultimo_acceso,omitempty"`
}
```

### Módulos del Sistema

```go
type Modulo struct {
    ID          string `json:"id"`
    Nombre      string `json:"nombre"`
    Descripcion string `json:"descripcion"`
}

var ModulosDisponibles = []Modulo{
    {ID: "rrhh", Nombre: "RRHH - Recursos Humanos", Descripcion: "Gestionar oficiales y personal"},
    {ID: "policial", Nombre: "Módulo Policial", Descripcion: "Acceso al sistema policial"},
    {ID: "denuncias", Nombre: "Denuncias", Descripcion: "Gestionar denuncias ciudadanas"},
    {ID: "detenidos", Nombre: "Detenidos", Descripcion: "Registro de detenidos"},
    {ID: "minutas", Nombre: "Minutas Digitales", Descripcion: "Crear y gestionar minutas"},
    {ID: "buscados", Nombre: "Más Buscados", Descripcion: "Lista de más buscados"},
    {ID: "verificacion", Nombre: "Verificación de Cédulas", Descripcion: "Verificar cédulas"},
    {ID: "panico", Nombre: "Botón de Pánico", Descripcion: "Gestionar alertas de pánico"},
}
```

## 🔐 Usuario Master Inicial

**IMPORTANTE**: Al iniciar el sistema por primera vez, crear un usuario master con todos los permisos:

```go
// Usuario: admin
// Contraseña: Admin123! (cambiar en producción)
// Permisos: Todos los módulos
// Activo: true
```

## 🌐 Endpoints Requeridos

### 1. POST `/api/master/login`

Login para usuarios master.

**Request Body:**
```json
{
  "usuario": "admin",
  "contraseña": "Admin123!"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "usuario": "admin",
    "nombre": "Administrador Principal",
    "email": "admin@gepn.gob.ve",
    "permisos": ["rrhh", "policial", "denuncias", "detenidos", "minutas", "buscados", "verificacion", "panico"],
    "activo": true
  }
}
```

### 2. POST `/api/master/crear-usuario`

Crea un nuevo usuario master. Solo usuarios master pueden crear otros usuarios master.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "usuario": "rrhh_manager",
  "nombre": "Gerente de RRHH",
  "email": "rrhh@gepn.gob.ve",
  "contraseña": "Password123!",
  "permisos": ["rrhh"]
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Usuario master creado correctamente",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "usuario": "rrhh_manager"
  }
}
```

**Validaciones:**
- ✅ Usuario debe ser único
- ✅ Email debe ser único
- ✅ Contraseña mínimo 6 caracteres (hashear con bcrypt)
- ✅ Verificar que los permisos sean válidos
- ✅ El usuario que crea debe tener permisos (o ser el admin inicial)

### 3. GET `/api/master/usuarios`

Lista todos los usuarios master (requiere autenticación).

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "usuario": "admin",
      "nombre": "Administrador Principal",
      "email": "admin@gepn.gob.ve",
      "permisos": ["rrhh", "policial", "denuncias", "detenidos", "minutas", "buscados", "verificacion", "panico"],
      "activo": true,
      "fecha_creacion": "2024-01-15T10:30:00Z",
      "ultimo_acceso": "2024-01-20T15:45:00Z"
    }
  ]
}
```

### 4. PUT `/api/master/usuarios/:usuarioId/permisos`

Actualiza los permisos de un usuario master.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "permisos": ["rrhh", "policial"]
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Permisos actualizados correctamente"
}
```

### 5. PUT `/api/master/usuarios/:usuarioId/activar`

Activa o desactiva un usuario master.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "activo": true
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Usuario activado/desactivado correctamente"
}
```

### 6. GET `/api/master/modulos`

Obtiene la lista de módulos disponibles del sistema.

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "rrhh",
      "nombre": "RRHH - Recursos Humanos",
      "descripcion": "Gestionar oficiales y personal"
    },
    {
      "id": "policial",
      "nombre": "Módulo Policial",
      "descripcion": "Acceso al sistema policial"
    }
    // ... más módulos
  ]
}
```

## 🔒 Control de Acceso por Módulos

### Middleware de Verificación de Permisos

```go
func VerificarPermiso(modulo string) gin.HandlerFunc {
    return func(c *gin.Context) {
        // Obtener token del header
        token := c.GetHeader("Authorization")
        
        // Validar token y obtener usuario
        usuario, err := validarToken(token)
        if err != nil {
            c.JSON(401, gin.H{"success": false, "message": "No autorizado"})
            c.Abort()
            return
        }
        
        // Verificar si el usuario tiene el permiso
        tienePermiso := false
        for _, permiso := range usuario.Permisos {
            if permiso == modulo || permiso == "all" {
                tienePermiso = true
                break
            }
        }
        
        if !tienePermiso {
            c.JSON(403, gin.H{"success": false, "message": "No tiene permisos para este módulo"})
            c.Abort()
            return
        }
        
        // Guardar usuario en contexto
        c.Set("usuario_master", usuario)
        c.Next()
    }
}
```

### Uso en Rutas

```go
// Ruta protegida para RRHH
rrhhRoutes := router.Group("/api/rrhh")
rrhhRoutes.Use(VerificarPermiso("rrhh"))
{
    rrhhRoutes.POST("/registrar-oficial", RegistrarOficial)
    rrhhRoutes.GET("/generar-qr/:oficialId", GenerarQROficial)
    // ... más rutas
}

// Ruta protegida para módulo policial
policialRoutes := router.Group("/api/policial")
policialRoutes.Use(VerificarPermiso("policial"))
{
    policialRoutes.POST("/login", LoginPolicial)
    // ... más rutas
}
```

## 🔗 Integración con RRHH

Los usuarios master con permiso `rrhh` pueden:
1. Acceder a `/api/rrhh/*`
2. Crear oficiales en el sistema
3. Gestionar oficiales registrados

Los oficiales creados pueden acceder a `/api/policial/login` con sus credenciales.

## 📝 Colección MongoDB

**Nombre:** `usuarios_master`

**Índices:**
```go
// Índice único para usuario
db.usuarios_master.createIndex({ "usuario": 1 }, { unique: true })

// Índice único para email
db.usuarios_master.createIndex({ "email": 1 }, { unique: true })

// Índice para búsquedas por permisos
db.usuarios_master.createIndex({ "permisos": 1 })
```

## 🧪 Ejemplo de Handler (Go)

```go
func CrearUsuarioMaster(c *gin.Context) {
    // Obtener usuario que está creando (del token)
    usuarioCreador, exists := c.Get("usuario_master")
    if !exists {
        c.JSON(401, gin.H{"success": false, "message": "No autorizado"})
        return
    }
    
    var datos struct {
        Usuario     string   `json:"usuario" binding:"required"`
        Nombre      string   `json:"nombre" binding:"required"`
        Email       string   `json:"email" binding:"required,email"`
        Contraseña  string   `json:"contraseña" binding:"required,min=6"`
        Permisos    []string `json:"permisos" binding:"required"`
    }
    
    if err := c.ShouldBindJSON(&datos); err != nil {
        c.JSON(400, gin.H{"success": false, "message": err.Error()})
        return
    }
    
    // Validar que los permisos sean válidos
    permisosValidos := []string{"rrhh", "policial", "denuncias", "detenidos", "minutas", "buscados", "verificacion", "panico"}
    for _, permiso := range datos.Permisos {
        valido := false
        for _, pv := range permisosValidos {
            if permiso == pv {
                valido = true
                break
            }
        }
        if !valido {
            c.JSON(400, gin.H{"success": false, "message": "Permiso inválido: " + permiso})
            return
        }
    }
    
    // Verificar que el usuario no exista
    // ... código de verificación ...
    
    // Hash de contraseña
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(datos.Contraseña), 10)
    
    // Crear usuario master
    usuarioMaster := models.UsuarioMaster{
        Usuario:       datos.Usuario,
        Nombre:        datos.Nombre,
        Email:         datos.Email,
        Contraseña:    string(hashedPassword),
        Permisos:      datos.Permisos,
        Activo:        true,
        CreadoPor:     usuarioCreador.(models.UsuarioMaster).ID.Hex(),
        FechaCreacion: time.Now(),
    }
    
    // Guardar en MongoDB
    // ... código de guardado ...
    
    c.JSON(200, gin.H{
        "success": true,
        "message": "Usuario master creado correctamente",
        "data": gin.H{
            "id": usuarioMaster.ID.Hex(),
            "usuario": usuarioMaster.Usuario,
        },
    })
}
```

## 🚀 Inicialización del Sistema

### Script de Inicialización

Crear un script que se ejecute al iniciar el servidor para crear el usuario master inicial si no existe:

```go
func InicializarUsuarioMaster() error {
    // Verificar si ya existe un usuario master
    count, err := db.CountUsuariosMaster()
    if err != nil {
        return err
    }
    
    if count > 0 {
        return nil // Ya existe al menos un usuario
    }
    
    // Crear usuario master inicial
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("Admin123!"), 10)
    
    usuarioMaster := models.UsuarioMaster{
        Usuario:       "admin",
        Nombre:        "Administrador Principal",
        Email:         "admin@gepn.gob.ve",
        Contraseña:    string(hashedPassword),
        Permisos:      []string{"rrhh", "policial", "denuncias", "detenidos", "minutas", "buscados", "verificacion", "panico"},
        Activo:        true,
        CreadoPor:     "system",
        FechaCreacion: time.Now(),
    }
    
    return db.CrearUsuarioMaster(usuarioMaster)
}
```

Llamar esta función en `main.go` al iniciar el servidor.

## ✅ Checklist de Implementación

- [ ] Crear modelo `UsuarioMaster` en `models/models.go`
- [ ] Crear repositorio `UsuarioMasterRepository` en `database/repositories.go`
- [ ] Crear handler `LoginMaster` en `handlers/master.go`
- [ ] Crear handler `CrearUsuarioMaster` en `handlers/master.go`
- [ ] Crear handler `ListarUsuariosMaster` en `handlers/master.go`
- [ ] Crear handler `ActualizarPermisos` en `handlers/master.go`
- [ ] Crear handler `ActivarUsuarioMaster` en `handlers/master.go`
- [ ] Crear handler `ObtenerModulos` en `handlers/master.go`
- [ ] Crear middleware `VerificarPermiso` en `middleware/auth.go`
- [ ] Agregar rutas en `routes/routes.go`:
  - `POST /api/master/login`
  - `POST /api/master/crear-usuario` (protegida)
  - `GET /api/master/usuarios` (protegida)
  - `PUT /api/master/usuarios/:usuarioId/permisos` (protegida)
  - `PUT /api/master/usuarios/:usuarioId/activar` (protegida)
  - `GET /api/master/modulos`
- [ ] Crear índices en MongoDB
- [ ] Implementar script de inicialización del usuario master
- [ ] Aplicar middleware de permisos a todas las rutas protegidas
- [ ] Probar login de usuario master
- [ ] Probar creación de usuarios master
- [ ] Probar asignación de permisos
- [ ] Probar control de acceso por módulos

## 🔒 Seguridad

1. **Autenticación JWT**: Todos los endpoints protegidos requieren token JWT
2. **Hash de contraseñas**: Usar bcrypt con salt rounds >= 10
3. **Validación de permisos**: Verificar permisos en cada endpoint protegido
4. **Rate limiting**: Limitar requests para prevenir abuso
5. **Logs de auditoría**: Registrar quién crea/modifica usuarios master

## 📦 Dependencias Necesarias

```go
go get golang.org/x/crypto/bcrypt
go get github.com/golang-jwt/jwt/v4
```

## 🎯 Flujo de Trabajo

1. **Usuario Master Inicial**: Se crea automáticamente al iniciar el sistema
2. **Crear Usuarios Master**: El admin inicial crea otros usuarios master
3. **Asignar Permisos**: Se asignan permisos específicos a cada usuario
4. **Acceso a Módulos**: Los usuarios solo pueden acceder a módulos con permisos
5. **RRHH crea Oficiales**: Usuarios con permiso `rrhh` pueden crear oficiales
6. **Oficiales acceden**: Los oficiales creados acceden con `/api/policial/login`

