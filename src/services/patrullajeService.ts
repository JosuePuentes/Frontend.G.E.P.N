import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// URL del backend - cambiar a producción cuando esté listo
const API_BASE_URL = 'http://10.0.2.2:8080'; // Android emulator
// const API_BASE_URL = 'http://localhost:8080'; // iOS simulator
// const API_BASE_URL = 'https://tu-backend.com'; // Producción

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar token automáticamente
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

/**
 * Login de patrullaje
 * @param credencial Credencial del funcionario
 * @param pin PIN de 6 dígitos
 */
export const loginPatrullaje = async (
  credencial: string,
  pin: string,
): Promise<any> => {
  try {
    const response = await api.post('/api/patrullaje/login', {
      credencial,
      pin,
    });

    // Guardar token si lo devuelve
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem(
        'funcionario_patrullaje',
        JSON.stringify(response.data.data),
      );
    }

    return {
      success: true,
      data: response.data.data,
      token: response.data.token,
    };
  } catch (error: any) {
    console.error('Error en loginPatrullaje:', error);
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Credenciales incorrectas',
      };
    }
    return {
      success: false,
      message: 'No se pudo conectar con el servidor',
    };
  }
};

/**
 * Iniciar patrullaje
 * @param latitud Latitud actual
 * @param longitud Longitud actual
 */
export const iniciarPatrullaje = async (
  latitud: number,
  longitud: number,
): Promise<any> => {
  try {
    const response = await api.post('/api/patrullaje/iniciar', {
      latitud,
      longitud,
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Error en iniciarPatrullaje:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al iniciar patrullaje',
    };
  }
};

/**
 * Finalizar patrullaje
 * @param patrullajeId ID del patrullaje activo
 */
export const finalizarPatrullaje = async (
  patrullajeId: string,
): Promise<any> => {
  try {
    const response = await api.post('/api/patrullaje/finalizar', {
      patrullajeId,
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Error en finalizarPatrullaje:', error);
    return {
      success: false,
      message:
        error.response?.data?.message || 'Error al finalizar patrullaje',
    };
  }
};

/**
 * Actualizar ubicación del patrullaje
 * @param patrullajeId ID del patrullaje activo
 * @param latitud Latitud actual
 * @param longitud Longitud actual
 */
export const actualizarUbicacion = async (
  patrullajeId: string,
  latitud: number,
  longitud: number,
): Promise<any> => {
  try {
    const response = await api.post('/api/patrullaje/actualizar-ubicacion', {
      patrullajeId,
      latitud,
      longitud,
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Error en actualizarUbicacion:', error);
    return {
      success: false,
      message:
        error.response?.data?.message || 'Error al actualizar ubicación',
    };
  }
};

/**
 * Obtener patrullajes activos
 * Devuelve la lista de todos los funcionarios en patrullaje activo
 */
export const obtenerPatrullajesActivos = async (): Promise<any> => {
  try {
    const response = await api.get('/api/patrullaje/activos');

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: any) {
    console.error('Error en obtenerPatrullajesActivos:', error);
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message || 'Error al obtener patrullajes activos',
    };
  }
};

/**
 * Obtener historial de patrullajes
 */
export const obtenerHistorialPatrullajes = async (): Promise<any> => {
  try {
    const response = await api.get('/api/patrullaje/historial');

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: any) {
    console.error('Error en obtenerHistorialPatrullajes:', error);
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message ||
        'Error al obtener historial de patrullajes',
    };
  }
};

export default {
  loginPatrullaje,
  iniciarPatrullaje,
  finalizarPatrullaje,
  actualizarUbicacion,
  obtenerPatrullajesActivos,
  obtenerHistorialPatrullajes,
};
