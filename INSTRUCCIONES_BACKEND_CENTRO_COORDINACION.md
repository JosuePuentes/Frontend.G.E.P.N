# Instrucciones Backend - Centro de Coordinación Policial

## Descripción General

Este módulo permite gestionar la estructura organizacional policial por estados, creando centros de coordinación, estaciones policiales y partes donde se asignan funcionarios.

## Estructura de Datos

### 1. Centro de Coordinación

```go
type CentroCoordinacion struct {
    ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Estado        string             `bson:"estado" json:"estado"` // ID del estado
    Nombre        string             `bson:"nombre" json:"nombre"`
    FechaCreacion time.Time          `bson:"fechaCreacion" json:"fechaCreacion"`
    CreadoPor     string             `bson:"creadoPor" json:"creadoPor"` // ID del usuario master
}
```

### 2. Estación Policial

```go
type EstacionPolicial struct {
    ID                    primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    CentroCoordinacionID  primitive.ObjectID `bson:"centroCoordinacionId" json:"centroCoordinacionId"`
    Nombre                string             `bson:"nombre" json:"nombre"`
    Direccion             string             `bson:"direccion" json:"direccion"`
    Telefono              string             `bson:"telefono,omitempty" json:"telefono,omitempty"`
    FechaCreacion         time.Time          `bson:"fechaCreacion" json:"fechaCreacion"`
    CreadoPor             string             `bson:"creadoPor" json:"creadoPor"`
}
```

### 3. Parte

```go
type Parte struct {
    ID                primitive.ObjectID     `bson:"_id,omitempty" json:"id"`
    EstacionPolicialID primitive.ObjectID     `bson:"estacionPolicialId" json:"estacionPolicialId"`
    Numero            string                 `bson:"numero" json:"numero"`
    Fecha             time.Time              `bson:"fecha" json:"fecha"`
    Funcionarios      []FuncionarioAsignado  `bson:"funcionarios" json:"funcionarios"`
    CreadoPor         string                 `bson:"creadoPor" json:"creadoPor"`
}

type FuncionarioAsignado struct {
    FuncionarioID primitive.ObjectID `bson:"funcionarioId" json:"funcionarioId"`
    Credencial    string             `bson:"credencial" json:"credencial"`
    Nombre        string             `bson:"nombre" json:"nombre"` // Nombre completo
    Apellidos     string             `bson:"apellidos" json:"apellidos"` // Apellidos completos
    Edad          int                `bson:"edad" json:"edad"`
    Rango         string             `bson:"rango" json:"rango"`
    FechaAsignacion time.Time        `bson:"fechaAsignacion" json:"fechaAsignacion"`
}
```

## Endpoints Requeridos

### 1. Crear Centro de Coordinación

**POST** `/api/centro-coordinacion/crear`

**Headers:**
```
Authorization: <token_master>
Content-Type: application/json
```

**Request Body:**
```json
{
  "estado": "01",
  "nombre": "Centro de Coordinación Zulia"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Centro de coordinación creado correctamente",
  "data": {
    "id": "...",
    "estado": "01",
    "nombre": "Centro de Coordinación Zulia",
    "fechaCreacion": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Listar Centros de Coordinación

**GET** `/api/centro-coordinacion/listar`

**Headers:**
```
Authorization: <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "estado": "01",
      "nombre": "Centro de Coordinación Zulia",
      "fechaCreacion": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Nota:** 
- Usuario Master: ve todos los centros
- Usuario RRHH Regional: solo ve centros de su estado asignado

### 3. Crear Estación Policial

**POST** `/api/centro-coordinacion/estacion/crear`

**Headers:**
```
Authorization: <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "centroCoordinacionId": "...",
  "nombre": "Estación Central Maracaibo",
  "direccion": "Av. Principal, Maracaibo",
  "telefono": "0261-1234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Estación policial creada correctamente",
  "data": {
    "id": "...",
    "centroCoordinacionId": "...",
    "nombre": "Estación Central Maracaibo",
    "direccion": "Av. Principal, Maracaibo",
    "telefono": "0261-1234567",
    "fechaCreacion": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Listar Estaciones por Centro

**GET** `/api/centro-coordinacion/estaciones/:centroId`

**Headers:**
```
Authorization: <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "centroCoordinacionId": "...",
      "nombre": "Estación Central Maracaibo",
      "direccion": "Av. Principal, Maracaibo",
      "telefono": "0261-1234567",
      "fechaCreacion": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 5. Crear Parte

**POST** `/api/centro-coordinacion/parte/crear`

**Headers:**
```
Authorization: <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "estacionPolicialId": "...",
  "numero": "001-2024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Parte creado correctamente",
  "data": {
    "id": "...",
    "estacionPolicialId": "...",
    "numero": "001-2024",
    "fecha": "2024-01-15T10:30:00Z",
    "funcionarios": []
  }
}
```

### 6. Listar Partes por Estación

**GET** `/api/centro-coordinacion/partes/:estacionId`

**Headers:**
```
Authorization: <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "estacionPolicialId": "...",
      "numero": "001-2024",
      "fecha": "2024-01-15T10:30:00Z",
      "funcionarios": [
        {
          "funcionarioId": "...",
          "credencial": "OF-12345",
          "nombre": "Juan Carlos",
          "apellidos": "Pérez González",
          "edad": 32,
          "rango": "Inspector",
          "fechaAsignacion": "2024-01-15T10:30:00Z"
        }
      ]
    }
  ]
}
```

### 7. Buscar Funcionarios

**GET** `/api/centro-coordinacion/buscar-funcionarios?q=<busqueda>`

**Headers:**
```
Authorization: <token>
```

**Query Parameters:**
- `q`: Término de búsqueda (credencial o nombre)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "credencial": "OF-12345",
      "primerNombre": "Juan",
      "segundoNombre": "Carlos",
      "primerApellido": "Pérez",
      "segundoApellido": "González",
      "fechaNacimiento": "1992-05-15",
      "rango": "Inspector"
    }
  ]
}
```

**Nota Importante:**
- Usuario Master: busca en TODOS los funcionarios registrados
- Usuario RRHH Regional: busca solo en funcionarios asignados a su región/estado

### 8. Asignar Funcionario a Parte

**POST** `/api/centro-coordinacion/parte/asignar-funcionario`

**Headers:**
```
Authorization: <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "parteId": "...",
  "funcionarioId": "..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Funcionario asignado correctamente"
}
```

**Validaciones:**
- Verificar que el funcionario existe
- Verificar que el parte existe
- Verificar que el funcionario no esté ya asignado a ese parte
- Calcular edad del funcionario desde fechaNacimiento
- Obtener nombre completo y rango del funcionario

## Filtrado por Permisos

### Usuario Master
- Ve TODOS los centros de coordinación de todos los estados
- Busca en TODOS los funcionarios registrados en RRHH
- Puede crear centros en cualquier estado

### Usuario RRHH Regional
- Solo ve centros de coordinación de su estado asignado
- Solo busca en funcionarios asignados a su región/estado
- Solo puede crear centros en su estado asignado

**Implementación sugerida:**
- Agregar campo `EstadoAsignado` al modelo `UsuarioMaster` o `UsuarioRRHH`
- En los endpoints, verificar el token y filtrar según el estado asignado
- Para búsqueda de funcionarios, filtrar por estado de asignación del funcionario

## Índices MongoDB

```javascript
// Centros de Coordinación
db.centroscoordinacion.createIndex({ "estado": 1 });
db.centroscoordinacion.createIndex({ "creadoPor": 1 });

// Estaciones Policiales
db.estacionespoliciales.createIndex({ "centroCoordinacionId": 1 });
db.estacionespoliciales.createIndex({ "creadoPor": 1 });

// Partes
db.partes.createIndex({ "estacionPolicialId": 1 });
db.partes.createIndex({ "numero": 1 });
db.partes.createIndex({ "funcionarios.funcionarioId": 1 });
```

## Ejemplo de Handler (Go)

```go
func CrearCentroCoordinacion(c *gin.Context) {
    var req struct {
        Estado string `json:"estado" binding:"required"`
        Nombre string `json:"nombre" binding:"required"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"success": false, "message": "Datos inválidos"})
        return
    }
    
    // Obtener usuario del token
    usuarioID := c.GetString("usuarioID")
    usuarioTipo := c.GetString("usuarioTipo") // "master" o "rrhh"
    
    // Si es RRHH regional, verificar que el estado coincida con su asignación
    if usuarioTipo == "rrhh" {
        usuarioRRHH, err := obtenerUsuarioRRHH(usuarioID)
        if err != nil || usuarioRRHH.EstadoAsignado != req.Estado {
            c.JSON(403, gin.H{"success": false, "message": "No tiene permisos para crear centros en este estado"})
            return
        }
    }
    
    centro := CentroCoordinacion{
        Estado:        req.Estado,
        Nombre:        req.Nombre,
        FechaCreacion: time.Now(),
        CreadoPor:     usuarioID,
    }
    
    // Guardar en MongoDB
    result, err := db.Collection("centroscoordinacion").InsertOne(context.Background(), centro)
    if err != nil {
        c.JSON(500, gin.H{"success": false, "message": "Error al crear centro"})
        return
    }
    
    centro.ID = result.InsertedID.(primitive.ObjectID)
    
    c.JSON(200, gin.H{
        "success": true,
        "message": "Centro de coordinación creado correctamente",
        "data": centro,
    })
}
```

## Relación con RRHH

Cuando un funcionario es asignado a un parte:
1. Se guarda la relación en el parte
2. El funcionario puede tener un campo `EstadoAsignado` o `CentroCoordinacionAsignado` para facilitar búsquedas
3. Los usuarios RRHH regionales solo verán funcionarios que tengan asignado su estado

## Notas Adicionales

- Los partes pueden tener múltiples funcionarios asignados
- Un funcionario puede estar asignado a múltiples partes (diferentes turnos/días)
- La búsqueda de funcionarios debe ser flexible: buscar por credencial exacta o por nombre (primer nombre, apellidos)
- Considerar implementar paginación para listados grandes

