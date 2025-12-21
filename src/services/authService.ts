import AsyncStorage from '@react-native-async-storage/async-storage';
import {registerCiudadano as apiRegister, loginCiudadano as apiLogin} from './apiService';

const AUTH_KEY = 'ciudadano_auth';
const USER_KEY = 'ciudadano_user';
const TOKEN_KEY = 'authToken';

export interface CiudadanoUser {
  nombre: string;
  cedula: string;
  telefono: string;
}

export const registerCiudadano = async (
  nombre: string,
  cedula: string,
  telefono: string,
  contraseña: string,
): Promise<boolean> => {
  try {
    // Usar el backend real
    const result = await apiRegister(nombre, cedula, telefono, contraseña);
    
    if (result.success) {
      await AsyncStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Error en registro:', error);
    throw error; // Re-lanzar para que el componente pueda manejar el error
  }
};

export const loginCiudadano = async (
  cedula: string,
  contraseña: string,
): Promise<boolean> => {
  try {
    // Usar el backend real
    const result = await apiLogin(cedula, contraseña);
    
    if (result.success) {
      await AsyncStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Error en login:', error);
    throw error; // Re-lanzar para que el componente pueda manejar el error
  }
};

export const logoutCiudadano = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error en logout:', error);
  }
};

export const isCiudadanoAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const auth = await AsyncStorage.getItem(AUTH_KEY);
    // Verificar que existan tanto el token como el flag de autenticación
    return (auth === 'true' && token !== null);
  } catch (error) {
    return false;
  }
};

export const getCiudadanoUser = async (): Promise<CiudadanoUser | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
    // Si no hay datos en AsyncStorage, intentar obtener del token
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      // El token contiene la información del usuario
      // Por ahora retornamos null y el componente debe manejar esto
      return null;
    }
    return null;
  } catch (error) {
    return null;
  }
};

