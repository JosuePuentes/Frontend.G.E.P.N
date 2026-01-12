# 🚓 INSTRUCCIONES BACKEND - MÓDULO DE PATRULLAJE

**Para la IA del Backend (Go + MongoDB)**

---

## 📋 RESUMEN

Necesitas implementar un módulo de patrullaje policial que permita:
1. Login con credenciales + PIN de 6 dígitos
2. Iniciar/finalizar patrullaje
3. Rastrear ubicación en tiempo real de patrulleros activos
4. Mostrar todos los patrulleros activos en un mapa

---

## 🗄️ BASE DE DATOS - COLECCIONES NECESARIAS

### 1. Colección: `funcionarios` (si no existe)

Ya debes tener esta colección desde el módulo de RRHH. Asegúrate de que tenga estos campos:

```go
type Funcionario struct {
    ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Nombre        string             `bson:"nombre" json:"nombre"`
    Apellido      string             `bson:"apellido" json:"apellido"`
    Cedula        string             `bson:"cedula" json:"cedula"`
    Credencial    string             `bson:"credencial" json:"credencial"`
    PIN           string             `bson:"pin" json:"pin"` // PIN hasheado con bcrypt
    Rango         string             `bson:"rango" json:"rango"`
    Unidad        string             `bson:"unidad" json:"unidad"`
    Activo        bool               `bson:"activo" json:"activo"`
    FechaRegistro time.Time          `bson:"fecha_registro" json:"fecha_registro"`
}
```

**IMPORTANTE**: El PIN debe guardarse hasheado con bcrypt, NO en texto plano.

### 2. Colección: `patrullajes` (NUEVA)

```go
type Patrullaje struct {
    ID                  primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    FuncionarioID       primitive.ObjectID `bson:"funcionario_id" json:"funcionario_id"`
    Credencial          string             `bson:"credencial" json:"credencial"`
    Nombre              string             `bson:"nombre" json:"nombre"`
    Apellido            string             `bson:"apellido" json:"apellido"`
    Rango               string             `bson:"rango" json:"rango"`
    Unidad              string             `bson:"unidad" json:"unidad"`
    
    // Ubicación actual
    Latitud             float64            `bson:"latitud" json:"latitud"`
    Longitud            float64            `bson:"longitud" json:"longitud"`
    
    // Color del marcador en el mapa
    Color               string             `bson:"color" json:"color"` // "rojo" o "azul"
    
    // Fechas
    FechaInicio         time.Time          `bson:"fecha_inicio" json:"fecha_inicio"`
    FechaFin            *time.Time         `bson:"fecha_fin,omitempty" json:"fecha_fin,omitempty"`
    UltimaActualizacion time.Time          `bson:"ultima_actualizacion" json:"ultima_actualizacion"`
    
    // Estado
    Activo              bool               `bson:"activo" json:"activo"`
}
```

**Índices necesarios**:
```javascript
// En MongoDB
db.patrullajes.createIndex({ "funcionario_id": 1 })
db.patrullajes.createIndex({ "activo": 1 })
db.patrullajes.createIndex({ "fecha_inicio": -1 })
db.funcionarios.createIndex({ "credencial": 1 }, { unique: true })
db.funcionarios.createIndex({ "pin": 1 })
```

---

## 🔌 ENDPOINTS A IMPLEMENTAR

### 1. Login de Patrullaje

```
POST /api/patrullaje/login
Content-Type: application/json

Body:
{
  "credencial": "POLICIA-12345",
  "pin": "123456"
}

Response 200 (Success):
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": "60d5ec49f1b2c8b1f8e4e1a1",
    "nombre": "Juan",
    "apellido": "Pérez",
    "credencial": "POLICIA-12345",
    "rango": "Oficial",
    "unidad": "Patrullaje"
  },
  "token": "jwt_token_aqui"
}

Response 401 (Error):
{
  "success": false,
  "message": "Credencial o PIN incorrectos"
}

Response 403 (Usuario inactivo):
{
  "success": false,
  "message": "Funcionario inactivo"
}
```

**Lógica**:
1. Buscar funcionario por `credencial`
2. Verificar que el funcionario esté `activo = true`
3. Comparar el PIN usando `bcrypt.CompareHashAndPassword()`
4. Si es correcto, generar token JWT
5. Devolver datos del funcionario

---

### 2. Iniciar Patrullaje

```
POST /api/patrullaje/iniciar
Authorization: Bearer jwt_token
Content-Type: application/json

Body:
{
  "latitud": 10.4806,
  "longitud": -66.9036
}

Response 201 (Success):
{
  "success": true,
  "message": "Patrullaje iniciado correctamente",
  "data": {
    "patrullajeId": "60d5ec49f1b2c8b1f8e4e1a2",
    "nombre": "Juan Pérez",
    "credencial": "POLICIA-12345",
    "color": "azul",
    "fecha_inicio": "2026-01-12T14:30:00Z"
  }
}

Response 400 (Ya tiene patrullaje activo):
{
  "success": false,
  "message": "Ya tienes un patrullaje activo"
}
```

**Lógica**:
1. Extraer funcionario del token JWT
2. Verificar que NO tenga un patrullaje activo (`activo = true`)
3. Asignar color alternando: contar patrullajes activos, si par → "rojo", si impar → "azul"
4. Crear documento en colección `patrullajes`:
   - `funcionario_id`: del token
   - `latitud`, `longitud`: del body
   - `color`: calculado
   - `fecha_inicio`: ahora
   - `ultima_actualizacion`: ahora
   - `activo`: true
5. Copiar datos del funcionario (nombre, apellido, credencial, etc.)
6. Devolver patrullajeId

---

### 3. Actualizar Ubicación

```
POST /api/patrullaje/actualizar-ubicacion
Authorization: Bearer jwt_token
Content-Type: application/json

Body:
{
  "patrullajeId": "60d5ec49f1b2c8b1f8e4e1a2",
  "latitud": 10.4810,
  "longitud": -66.9040
}

Response 200 (Success):
{
  "success": true,
  "message": "Ubicación actualizada",
  "data": {
    "latitud": 10.4810,
    "longitud": -66.9040,
    "ultima_actualizacion": "2026-01-12T14:35:00Z"
  }
}
```

**Lógica**:
1. Verificar que el patrullaje pertenece al funcionario del token
2. Verificar que el patrullaje esté activo
3. Actualizar:
   - `latitud`
   - `longitud`
   - `ultima_actualizacion`: ahora

---

### 4. Obtener Patrullajes Activos

```
GET /api/patrullaje/activos
Authorization: Bearer jwt_token

Response 200 (Success):
{
  "success": true,
  "data": [
    {
      "id": "60d5ec49f1b2c8b1f8e4e1a2",
      "credencial": "POLICIA-12345",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rango": "Oficial",
      "unidad": "Patrullaje",
      "latitud": 10.4810,
      "longitud": -66.9040,
      "color": "azul",
      "ultima_actualizacion": "2026-01-12T14:35:00Z"
    },
    {
      "id": "60d5ec49f1b2c8b1f8e4e1a3",
      "credencial": "POLICIA-67890",
      "nombre": "María",
      "apellido": "González",
      "rango": "Sargento",
      "unidad": "Patrullaje",
      "latitud": 10.4900,
      "longitud": -66.8900,
      "color": "rojo",
      "ultima_actualizacion": "2026-01-12T14:34:00Z"
    }
  ]
}
```

**Lógica**:
1. Buscar todos los patrullajes donde `activo = true`
2. Ordenar por `ultima_actualizacion` descendente
3. Devolver array con todos los patrulleros activos

---

### 5. Finalizar Patrullaje

```
POST /api/patrullaje/finalizar
Authorization: Bearer jwt_token
Content-Type: application/json

Body:
{
  "patrullajeId": "60d5ec49f1b2c8b1f8e4e1a2"
}

Response 200 (Success):
{
  "success": true,
  "message": "Patrullaje finalizado correctamente",
  "data": {
    "patrullajeId": "60d5ec49f1b2c8b1f8e4e1a2",
    "fecha_inicio": "2026-01-12T14:30:00Z",
    "fecha_fin": "2026-01-12T16:45:00Z",
    "duracion_minutos": 135
  }
}
```

**Lógica**:
1. Verificar que el patrullaje pertenece al funcionario del token
2. Verificar que el patrullaje esté activo
3. Actualizar:
   - `activo`: false
   - `fecha_fin`: ahora
4. Calcular duración: `fecha_fin - fecha_inicio`
5. Devolver datos

---

### 6. Obtener Historial de Patrullajes

```
GET /api/patrullaje/historial
Authorization: Bearer jwt_token

Query params (opcionales):
?funcionarioId=60d5ec49f1b2c8b1f8e4e1a1
?limit=50
?skip=0

Response 200 (Success):
{
  "success": true,
  "data": [
    {
      "id": "60d5ec49f1b2c8b1f8e4e1a2",
      "credencial": "POLICIA-12345",
      "nombre": "Juan Pérez",
      "fecha_inicio": "2026-01-12T14:30:00Z",
      "fecha_fin": "2026-01-12T16:45:00Z",
      "duracion_minutos": 135,
      "activo": false
    }
  ],
  "total": 150
}
```

**Lógica**:
1. Si es usuario Master/RRHH: mostrar historial de todos
2. Si es funcionario normal: solo su historial
3. Ordenar por `fecha_inicio` descendente
4. Implementar paginación

---

## 🔐 SEGURIDAD

### 1. Crear PIN para Funcionario (desde RRHH)

Cuando RRHH cree un funcionario, debe poder asignar un PIN:

```go
// Hashear el PIN antes de guardarlo
hashedPIN, err := bcrypt.GenerateFromPassword([]byte(pin), bcrypt.DefaultCost)
if err != nil {
    return err
}

funcionario.PIN = string(hashedPIN)
```

### 2. Validar PIN en Login

```go
// Comparar PIN
err := bcrypt.CompareHashAndPassword([]byte(funcionario.PIN), []byte(pinIngresado))
if err != nil {
    // PIN incorrecto
    return errors.New("PIN incorrecto")
}
```

### 3. JWT Token

El token JWT debe contener:

```go
claims := jwt.MapClaims{
    "funcionario_id": funcionario.ID.Hex(),
    "credencial":     funcionario.Credencial,
    "tipo":           "patrullaje",
    "exp":            time.Now().Add(time.Hour * 24).Unix(), // 24 horas
}
```

---

## 🔄 MIDDLEWARE DE AUTENTICACIÓN

Crear middleware para validar token JWT:

```go
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Extraer token del header Authorization
        authHeader := r.Header.Get("Authorization")
        if authHeader == "" {
            http.Error(w, "Token no proporcionado", http.StatusUnauthorized)
            return
        }

        // Validar formato "Bearer token"
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            http.Error(w, "Formato de token inválido", http.StatusUnauthorized)
            return
        }

        // Validar token
        token := parts[1]
        claims, err := ValidarToken(token)
        if err != nil {
            http.Error(w, "Token inválido o expirado", http.StatusUnauthorized)
            return
        }

        // Agregar claims al contexto
        ctx := context.WithValue(r.Context(), "funcionario_id", claims["funcionario_id"])
        ctx = context.WithValue(ctx, "credencial", claims["credencial"])

        // Continuar con el siguiente handler
        next.ServeHTTP(w, r.WithContext(ctx))
    }
}
```

---

## 🎨 LÓGICA DEL COLOR

Para que los puntos en el mapa se vean diferentes:

```go
func AsignarColor() string {
    // Contar patrullajes activos
    count, _ := patrullajesCollection.CountDocuments(context.TODO(), bson.M{"activo": true})
    
    // Alternar colores
    if count%2 == 0 {
        return "rojo"
    }
    return "azul"
}
```

---

## 📍 VALIDACIONES IMPORTANTES

### 1. Validar Coordenadas

```go
func ValidarCoordenadas(lat, lon float64) error {
    if lat < -90 || lat > 90 {
        return errors.New("Latitud inválida")
    }
    if lon < -180 || lon > 180 {
        return errors.New("Longitud inválida")
    }
    return nil
}
```

### 2. Validar PIN

```go
func ValidarPIN(pin string) error {
    if len(pin) != 6 {
        return errors.New("El PIN debe tener 6 dígitos")
    }
    if !regexp.MustCompile(`^[0-9]{6}$`).MatchString(pin) {
        return errors.New("El PIN debe contener solo números")
    }
    return nil
}
```

### 3. Verificar Patrullaje Activo

```go
func TienePatrullajeActivo(funcionarioID primitive.ObjectID) (bool, error) {
    count, err := patrullajesCollection.CountDocuments(
        context.TODO(),
        bson.M{
            "funcionario_id": funcionarioID,
            "activo":        true,
        },
    )
    return count > 0, err
}
```

---

## 🧪 CASOS DE PRUEBA

### 1. Login exitoso

```bash
curl -X POST http://localhost:8080/api/patrullaje/login \
  -H "Content-Type: application/json" \
  -d '{
    "credencial": "POLICIA-12345",
    "pin": "123456"
  }'
```

### 2. Iniciar patrullaje

```bash
curl -X POST http://localhost:8080/api/patrullaje/iniciar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "latitud": 10.4806,
    "longitud": -66.9036
  }'
```

### 3. Obtener patrullajes activos

```bash
curl -X GET http://localhost:8080/api/patrullaje/activos \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Agregar campo `pin` a colección `funcionarios`
- [ ] Crear colección `patrullajes` con índices
- [ ] Implementar endpoint POST `/api/patrullaje/login`
- [ ] Implementar endpoint POST `/api/patrullaje/iniciar`
- [ ] Implementar endpoint POST `/api/patrullaje/actualizar-ubicacion`
- [ ] Implementar endpoint GET `/api/patrullaje/activos`
- [ ] Implementar endpoint POST `/api/patrullaje/finalizar`
- [ ] Implementar endpoint GET `/api/patrullaje/historial`
- [ ] Agregar middleware de autenticación JWT
- [ ] Agregar lógica de asignación de colores
- [ ] Probar todos los endpoints
- [ ] Actualizar módulo RRHH para permitir crear/editar PIN

---

## 🔄 ACTUALIZACIÓN DEL MÓDULO RRHH

En el endpoint de creación/edición de funcionarios, agregar campo PIN:

```
POST /api/rrhh/funcionarios/crear
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "cedula": "V-12345678",
  "credencial": "POLICIA-12345",
  "pin": "123456",     // NUEVO
  "rango": "Oficial",
  "unidad": "Patrullaje"
}
```

**IMPORTANTE**: El PIN debe hashearse antes de guardar.

---

## 📞 INFORMACIÓN PARA ENTREGAR AL FRONTEND

Una vez implementado, confirma:

```
✅ Endpoint POST /api/patrullaje/login - Funcionando
✅ Endpoint POST /api/patrullaje/iniciar - Funcionando
✅ Endpoint POST /api/patrullaje/actualizar-ubicacion - Funcionando
✅ Endpoint GET /api/patrullaje/activos - Funcionando
✅ Endpoint POST /api/patrullaje/finalizar - Funcionando
✅ Endpoint GET /api/patrullaje/historial - Funcionando
✅ JWT funcionando correctamente
✅ PINs hasheados con bcrypt
✅ CORS configurado
✅ Probado con datos de prueba
```

---

## 🎯 DATOS DE PRUEBA

Crea al menos 2 funcionarios de prueba con PIN:

```javascript
// Funcionario 1
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "cedula": "V-12345678",
  "credencial": "POLICIA-12345",
  "pin": "123456", // Hashear antes de guardar
  "rango": "Oficial",
  "unidad": "Patrullaje",
  "activo": true
}

// Funcionario 2
{
  "nombre": "María",
  "apellido": "González",
  "cedula": "V-87654321",
  "credencial": "POLICIA-67890",
  "pin": "654321", // Hashear antes de guardar
  "rango": "Sargento",
  "unidad": "Patrullaje",
  "activo": true
}
```

---

**FIN DE LAS INSTRUCCIONES**

¿Dudas? Consulta la documentación de Go + MongoDB o pregunta al equipo frontend.
