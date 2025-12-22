# 📋 Opciones y Configuración del Frontend - Sistema RRHH

## 🎨 Colores de Piel Válidos

Los colores de piel válidos son (sin "Indígena"):

1. Blanco
2. Negro
3. Moreno
4. Rubio
5. Trigueño
6. Mestizo
7. Amarillo
8. Otro

**⚠️ IMPORTANTE**: NO incluir "Indígena" en la lista de opciones.

## 🩸 Tipos de Sangre

Todos los tipos de sangre disponibles (8 opciones):

1. A+
2. A-
3. B+
4. B-
5. AB+
6. AB-
7. O+
8. O-

## 🏙️ Ciudades de Venezuela por Estado

El sistema debe incluir un selector de ciudades de Venezuela organizadas por estado. El usuario debe poder:

1. Seleccionar un estado primero
2. Ver las ciudades disponibles para ese estado en un selector desplegable
3. Seleccionar la ciudad de nacimiento de la lista

**Nota**: 
- La ciudad de nacimiento NO debe ser un campo de texto libre
- Debe ser un selector que muestre las ciudades del estado seleccionado
- Si no se ha seleccionado un estado, debe mostrar un mensaje indicando que primero debe seleccionar un estado

## 🔐 Rangos Policiales Disponibles

Todos los rangos disponibles (17 opciones, en orden jerárquico):

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
13. Comisario General de Brigada
14. Comisario General de División
15. Comisario General Inspector
16. Comisario General en Jefe
17. Director General

**⚠️ IMPORTANTE**: Todos los rangos están disponibles, no solo hasta "Inspector". El sistema debe permitir seleccionar cualquiera de los 17 rangos.

## ✅ Validaciones y Mensajes de Error

### Validaciones Requeridas

1. **Campos Obligatorios**:
   - Primer Nombre
   - Primer Apellido
   - Cédula
   - Contraseña (mínimo 6 caracteres)
   - Fecha de Nacimiento (formato YYYY-MM-DD)
   - Estatura (número positivo)
   - Color de Piel
   - Tipo de Sangre
   - Ciudad de Nacimiento
   - Credencial
   - Rango
   - Fecha de Graduación (formato YYYY-MM-DD)
   - Antigüedad (número positivo)
   - Estado
   - Municipio
   - Parroquia
   - Foto de Cara

2. **Campos Opcionales**:
   - Segundo Nombre
   - Segundo Apellido
   - Destacado (debe dejarse vacío en RRHH)
   - Licencia de Conducir
   - Carnet Médico
   - Foto de Carnet
   - Información de Parientes

### Mensajes de Error

El frontend debe mostrar mensajes de error claros y específicos:

- **Campos vacíos**: "Por favor completa todos los campos obligatorios"
- **Contraseña corta**: "La contraseña debe tener al menos 6 caracteres"
- **Formato de fecha inválido**: "La fecha debe estar en formato YYYY-MM-DD"
- **Número inválido**: "Por favor ingresa un número válido"
- **Credencial duplicada**: Mostrar el mensaje JSON que retorna el backend
- **Cédula duplicada**: Mostrar el mensaje JSON que retorna el backend
- **Error de red**: "Error de conexión. Por favor verifica tu conexión a internet"
- **Error del servidor**: Mostrar el mensaje específico del backend

## 📝 Notas Importantes

### 1. Contraseña para Login Policial

**La contraseña registrada en RRHH es la que se usa para el login policial.**

- El oficial registrado en RRHH podrá iniciar sesión en el módulo policial usando:
  - **Credencial**: El número de credencial asignado
  - **Contraseña**: La misma contraseña registrada en RRHH

### 2. Respuestas del Backend

**El backend retorna JSON con mensajes claros cuando hay credenciales duplicadas.**

El frontend debe manejar correctamente las respuestas del backend:

**Ejemplo de respuesta de error (409 Conflict)**:
```json
{
  "success": false,
  "message": "La credencial ya está registrada"
}
```

**Ejemplo de respuesta de error para cédula duplicada (409 Conflict)**:
```json
{
  "success": false,
  "message": "La cédula ya está registrada"
}
```

El frontend debe mostrar estos mensajes al usuario de forma clara.

### 3. Campo "Destacado"

**El campo "destacado" debe dejarse vacío en RRHH (se asigna en otros módulos).**

- El campo "Destacado" NO debe ser obligatorio en el formulario de RRHH
- El campo debe permitir estar vacío
- La asignación del destacamento se realiza en otros módulos del sistema
- Si el usuario intenta llenar este campo, se puede mostrar una nota informativa indicando que se asignará en otro módulo

### 4. Rangos Disponibles

**Todos los rangos están disponibles, no solo hasta "Inspector".**

- El sistema debe incluir los 17 rangos completos
- No debe haber restricciones que limiten la selección solo hasta "Inspector"
- Cualquier oficial puede ser registrado con cualquiera de los 17 rangos disponibles

## 🔄 Flujo de Registro

1. Usuario completa el formulario de registro
2. Frontend valida todos los campos obligatorios
3. Si hay errores, muestra mensajes específicos
4. Si todo está correcto, envía los datos al backend
5. Backend valida y retorna respuesta
6. Si hay credenciales duplicadas, muestra el mensaje del backend
7. Si es exitoso, muestra mensaje de confirmación y limpia el formulario

## 🎯 Checklist de Implementación

- [x] Colores de piel sin "Indígena"
- [x] 8 tipos de sangre completos
- [x] Lista de ciudades por estado
- [x] 17 rangos disponibles
- [x] Campo destacado opcional
- [x] Validaciones completas
- [x] Mensajes de error claros
- [x] Manejo de respuestas del backend
- [x] Integración con login policial

