// Versión web del servicio de ubicación
export const requestLocationPermission = async (): Promise<boolean> => {
  if (!navigator.geolocation) {
    console.warn('Geolocation no está soportado en este navegador');
    return false;
  }
  return true;
};

export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation no está soportado'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

