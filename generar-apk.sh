#!/bin/bash

echo "=========================================="
echo "  Generando APK para Android - G.E.P.N"
echo "=========================================="
echo ""

# Verificar si estamos en el directorio correcto
if [ ! -d "android" ]; then
    echo "ERROR: No se encuentra la carpeta android"
    echo "Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Verificar si existe el keystore
if [ ! -f "android/app/gepn-release-key.keystore" ]; then
    echo ""
    echo "ADVERTENCIA: No se encuentra el keystore de firma"
    echo "El APK se generará SIN FIRMAR"
    echo ""
    echo "Para crear un keystore firmado, ejecuta:"
    echo "cd android/app"
    echo "keytool -genkeypair -v -storetype PKCS12 -keystore gepn-release-key.keystore -alias gepn-key-alias -keyalg RSA -keysize 2048 -validity 10000"
    echo ""
    read -p "Presiona Enter para continuar..."
fi

echo "Limpiando builds anteriores..."
cd android
./gradlew clean

echo ""
echo "Generando APK de Release..."
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "  ✅ APK GENERADO EXITOSAMENTE!"
    echo "=========================================="
    echo ""
    echo "El APK está en:"
    echo "android/app/build/outputs/apk/release/app-release.apk"
    echo ""
    echo "Puedes instalarlo en un dispositivo Android o distribuirlo."
    echo ""
else
    echo ""
    echo "❌ ERROR: No se pudo generar el APK"
    echo "Revisa los errores arriba"
    echo ""
    exit 1
fi

cd ..

