# 🔍 Instrucciones para Debugging del Backend - Registro de Oficiales

## ⚠️ PROBLEMA REPORTADO
El botón "Registrar Oficial" parpadea pero no hace nada. No se muestra mensaje de éxito ni de error.

## ✅ VERIFICACIONES EN EL BACKEND

### 1. Verificar que el Endpoint Exista

El endpoint debe estar configurado en tu backend Go:

```go
// En routes/routes.go o main.go
router.POST("/api/rrhh/registrar-oficial", handlers.RegistrarOficial)
```

**Verificar:**
- ✅ El endpoint está registrado
- ✅ La ruta es exactamente `/api/rrhh/registrar-oficial`
- ✅ El método es POST

### 2. Verificar el Handler

El handler debe estar implementado en `handlers/rrhh.go`:

```go
func RegistrarOficial(c *gin.Context) {
    var datos struct {
        PrimerNombre     string      `json:"primer_nombre" binding:"required"`
        SegundoNombre    string      `json:"segundo_nombre"`
        PrimerApellido   string      `json:"primer_apellido" binding:"required"`
        SegundoApellido  string      `json:"segundo_apellido"`
        Cedula           string      `json:"cedula" binding:"required"`
        Contraseña       string      `json:"contraseña" binding:"required,min=6"`
        FechaNacimiento  string      `json:"fecha_nacimiento" binding:"required"`
        Estatura         float64     `json:"estatura" binding:"required"`
        ColorPiel        string      `json:"color_piel" binding:"required"`
        TipoSangre       string      `json:"tipo_sangre" binding:"required"`
        CiudadNacimiento string      `json:"ciudad_nacimiento" binding:"required"`
        Credencial       string      `json:"credencial" binding:"required"`
        Rango            string      `json:"rango" binding:"required"`
        Destacado        string      `json:"destacado"`
        FechaGraduacion  string      `json:"fecha_graduacion" binding:"required"`
        Antiguedad       float64     `json:"antiguedad" binding:"required"`
        Estado           string      `json:"estado" binding:"required"`
        Municipio        string      `json:"municipio" binding:"required"`
        Parroquia        string      `json:"parroquia" binding:"required"`
        LicenciaConducir string      `json:"licencia_conducir"`
        CarnetMedico     string      `json:"carnet_medico"`
        FotoCara         string      `json:"foto_cara" binding:"required"`
        FotoCarnet       string      `json:"foto_carnet"`
        Parientes        *Parientes  `json:"parientes"`
    }

    // Agregar logs para debugging
    fmt.Println("=== RECIBIENDO PETICIÓN DE REGISTRO ===")
    
    if err := c.ShouldBindJSON(&datos); err != nil {
        fmt.Println("Error en binding JSON:", err)
        c.JSON(400, gin.H{
            "success": false,
            "message": "Error en los datos enviados: " + err.Error(),
        })
        return
    }

    fmt.Println("Datos recibidos correctamente")
    fmt.Printf("Credencial: %s\n", datos.Credencial)
    fmt.Printf("Cédula: %s\n", datos.Cedula)
    
    // ... resto del código ...
    
    // Al final, retornar respuesta
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

### 3. Verificar CORS

Si estás probando desde el navegador web, asegúrate de que CORS esté configurado:

```go
// En main.go
import "github.com/gin-contrib/cors"

config := cors.DefaultConfig()
config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:8080"}
config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
router.Use(cors.New(config))
```

### 4. Verificar la Conexión a MongoDB

Asegúrate de que:
- ✅ MongoDB esté corriendo
- ✅ La conexión esté establecida
- ✅ La colección `oficiales` exista (se crea automáticamente)

### 5. Verificar Logs del Backend

Agrega logs en puntos clave:

```go
func RegistrarOficial(c *gin.Context) {
    fmt.Println("=== INICIO RegistrarOficial ===")
    fmt.Println("Method:", c.Request.Method)
    fmt.Println("URL:", c.Request.URL.String())
    fmt.Println("Content-Type:", c.GetHeader("Content-Type"))
    
    // ... código ...
    
    fmt.Println("=== FIN RegistrarOficial ===")
}
```

### 6. Verificar la URL del Backend en el Frontend

En `src/services/apiService.ts`, verifica que la URL sea correcta:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'  // Para desarrollo local
  : 'https://backend-g-e-p-n.onrender.com';  // Para producción
```

**Para web en navegador:**
- Si el backend está en `localhost:8080`, debe estar accesible
- Si estás usando un servidor remoto, usa la URL completa

### 7. Probar el Endpoint Manualmente

Usa Postman o curl para probar:

```bash
curl -X POST http://localhost:8080/api/rrhh/registrar-oficial \
  -H "Content-Type: application/json" \
  -d '{
    "primer_nombre": "Juan",
    "primer_apellido": "Pérez",
    "cedula": "V-12345678",
    "contraseña": "password123",
    "fecha_nacimiento": "1990-05-15",
    "estatura": 175.5,
    "color_piel": "Moreno",
    "tipo_sangre": "O+",
    "ciudad_nacimiento": "Caracas",
    "credencial": "POL-12345",
    "rango": "Oficial",
    "destacado": "",
    "fecha_graduacion": "2015-06-15",
    "antiguedad": 8.5,
    "estado": "Distrito Capital",
    "municipio": "Libertador",
    "parroquia": "Catedral",
    "foto_cara": "data:image/png;base64,iVBORw0KGgo..."
  }'
```

### 8. Verificar la Respuesta del Backend

El backend DEBE retornar:

**Éxito (200):**
```json
{
  "success": true,
  "message": "Oficial registrado correctamente",
  "data": {
    "id": "...",
    "credencial": "POL-12345"
  }
}
```

**Error (400/409):**
```json
{
  "success": false,
  "message": "La credencial ya está registrada"
}
```

### 9. Verificar en la Consola del Navegador

Abre las herramientas de desarrollador (F12) y revisa:
- **Console**: Debe mostrar los logs que agregamos
- **Network**: Debe mostrar la petición POST a `/api/rrhh/registrar-oficial`
  - Verifica el Status Code (200, 400, 500, etc.)
  - Verifica la Response

### 10. Checklist de Verificación

- [ ] El backend está corriendo
- [ ] El endpoint `/api/rrhh/registrar-oficial` existe
- [ ] El método es POST
- [ ] CORS está configurado correctamente
- [ ] MongoDB está conectado
- [ ] Los logs del backend muestran la petición
- [ ] La respuesta del backend tiene el formato correcto
- [ ] La URL en el frontend es correcta
- [ ] No hay errores en la consola del navegador
- [ ] La petición aparece en la pestaña Network

## 🐛 Errores Comunes

### Error: "Cannot POST /api/rrhh/registrar-oficial"
**Solución:** El endpoint no está registrado. Verifica las rutas.

### Error: "CORS policy"
**Solución:** Configura CORS en el backend.

### Error: "timeout"
**Solución:** Aumenta el timeout en axios o verifica la conexión.

### Error: "Network Error"
**Solución:** Verifica que el backend esté corriendo y accesible.

### No hay error pero no funciona
**Solución:** Revisa los logs en la consola del navegador (F12) y los logs del backend.

## 📝 Próximos Pasos

1. Abre la consola del navegador (F12)
2. Intenta registrar un oficial
3. Revisa los logs que aparecen
4. Comparte los logs con el desarrollador del backend
5. Verifica en la pestaña Network si la petición se está enviando


