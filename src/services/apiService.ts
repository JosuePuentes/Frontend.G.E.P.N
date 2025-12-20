import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar la URL base de tu backend
const API_BASE_URL = 'http://localhost:8080'; // Cambia esto por la URL de tu servidor

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token si existe
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const loginPolicial = async (
  credencial: string,
  pin: string,
): Promise<boolean> => {
  try {
    const response = await api.post('/api/policial/login', {
      credencial,
      pin,
    });

    if (response.data && response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error en login:', error);
    return false;
  }
};

export const activarPanico = async (
  latitud: number,
  longitud: number,
  ubicacion: string,
): Promise<boolean> => {
  try {
    const response = await api.post('/api/panico/activar', {
      latitud,
      longitud,
      ubicacion,
    });

    return response.status === 200;
  } catch (error) {
    console.error('Error al activar pánico:', error);
    return false;
  }
};

export default api;

