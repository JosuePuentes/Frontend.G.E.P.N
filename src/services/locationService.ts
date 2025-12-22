import {Platform, PermissionsAndroid, Alert} from 'react-native';

// Importar Geolocation según la plataforma
let Geolocation: any;
if (Platform.OS === 'web') {
  Geolocation = {
    getCurrentPosition: (
      success: (position: any) => void,
      error: (error: any) => void,
      options: any,
    ) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        error({message: 'Geolocation no está soportado'});
      }
    },
  };
} else {
  Geolocation = require('@react-native-community/geolocation').default;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    // En web, los permisos se solicitan automáticamente al usar getCurrentPosition
    return true;
  } else if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de Ubicación',
          message: 'La aplicación necesita acceso a tu ubicación para el botón de pánico',
          buttonNeutral: 'Preguntar después',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    // iOS maneja los permisos automáticamente a través de Info.plist
    return true;
  }
};

export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

