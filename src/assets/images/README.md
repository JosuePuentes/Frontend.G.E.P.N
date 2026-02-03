# Imágenes Requeridas

Coloca las siguientes imágenes en esta carpeta:

1. **bandera-venezuela.png** - Bandera de Venezuela
2. **policias-tacticos.png** - Imagen de policías tácticos
3. **patrullas.png** - Imagen de patrullas policiales

## Foto de fondo – Login Patrullaje

Para usar **tu propia foto de fondo** en la pantalla de login de patrullaje (`/patrullaje/login`):

1. Guarda tu imagen en esta misma carpeta con el nombre: **`login-patrullaje-fondo.png`** (o `login-patrullaje-fondo.jpg`).
2. En `src/screens/LoginPatrullajeScreen.tsx`, cambia la línea del `require` de la imagen de fondo por:
   ```ts
   const backgroundImage = require('../assets/images/login-patrullaje-fondo.png');
   ```
   (usa `.jpg` si tu archivo es JPG).

Recomendación: imagen en horizontal, buena resolución (por ejemplo 1920×1080), para que se vea bien de fondo.

---

Formato recomendado: PNG con fondo transparente o JPG  
Tamaño recomendado: Al menos 300x300px para mejor calidad

