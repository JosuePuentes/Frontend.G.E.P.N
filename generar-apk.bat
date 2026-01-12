@echo off
echo ==========================================
echo   Generando APK para Android - G.E.P.N
echo ==========================================
echo.

REM Verificar si estamos en el directorio correcto
if not exist "android" (
    echo ERROR: No se encuentra la carpeta android
    echo Asegurate de ejecutar este script desde la raiz del proyecto
    pause
    exit /b 1
)

REM Verificar si existe el keystore
if not exist "android\app\gepn-release-key.keystore" (
    echo.
    echo ADVERTENCIA: No se encuentra el keystore de firma
    echo El APK se generara SIN FIRMAR
    echo.
    echo Para crear un keystore firmado, ejecuta:
    echo cd android\app
    echo keytool -genkeypair -v -storetype PKCS12 -keystore gepn-release-key.keystore -alias gepn-key-alias -keyalg RSA -keysize 2048 -validity 10000
    echo.
    pause
)

echo Limpiando builds anteriores...
cd android
call gradlew clean

echo.
echo Generando APK de Release...
call gradlew assembleRelease

if %ERRORLEVEL% == 0 (
    echo.
    echo ==========================================
    echo   APK GENERADO EXITOSAMENTE!
    echo ==========================================
    echo.
    echo El APK esta en:
    echo android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo Puedes instalarlo en un dispositivo Android o distribuirlo.
    echo.
) else (
    echo.
    echo ERROR: No se pudo generar el APK
    echo Revisa los errores arriba
    echo.
)

cd ..
pause
