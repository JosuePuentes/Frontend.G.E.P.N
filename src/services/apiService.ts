import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar la URL base de tu backend
// Para desarrollo local: 'http://localhost:8080'
// Para producción: 'https://backend-g-e-p-n.onrender.com'
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : 'https://backend-g-e-p-n.onrender.com';

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
      // El backend acepta el token directamente o con Bearer
      config.headers.Authorization = token;
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

// Funciones para ciudadanos
export const registerCiudadano = async (
  nombre: string,
  cedula: string,
  telefono: string,
  contraseña: string,
): Promise<{success: boolean; token?: string; data?: any}> => {
  try {
    const response = await api.post('/api/ciudadano/registro', {
      nombre,
      cedula,
      telefono,
      contraseña,
    });

    if (response.data.success && response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('ciudadano_user', JSON.stringify(response.data.data));
      return {success: true, token: response.data.token, data: response.data.data};
    }
    return {success: false};
  } catch (error: any) {
    console.error('Error en registro:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    return {success: false};
  }
};

export const loginCiudadano = async (
  cedula: string,
  contraseña: string,
): Promise<{success: boolean; token?: string; data?: any}> => {
  try {
    const response = await api.post('/api/ciudadano/login', {
      cedula,
      contraseña,
    });

    if (response.data.success && response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('ciudadano_user', JSON.stringify(response.data.data));
      return {success: true, token: response.data.token, data: response.data.data};
    }
    return {success: false};
  } catch (error: any) {
    console.error('Error en login:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    return {success: false};
  }
};

// Funciones para denuncias
export const crearDenuncia = async (datosDenuncia: any): Promise<boolean> => {
  try {
    const response = await api.post('/api/denuncia/crear', datosDenuncia);
    return response.data.success;
  } catch (error) {
    console.error('Error al crear denuncia:', error);
    return false;
  }
};

export const obtenerMisDenuncias = async (): Promise<any[]> => {
  try {
    const response = await api.get('/api/denuncia/mis-denuncias');
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error('Error al obtener denuncias:', error);
    return [];
  }
};

export default api;

