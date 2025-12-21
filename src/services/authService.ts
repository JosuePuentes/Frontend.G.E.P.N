import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'ciudadano_auth';
const USER_KEY = 'ciudadano_user';

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
    // Validar que la cédula no esté registrada
    const existingUsers = await AsyncStorage.getItem('ciudadanos_registrados');
    const users = existingUsers ? JSON.parse(existingUsers) : [];
    
    if (users.find((u: any) => u.cedula === cedula)) {
      return false; // Cédula ya registrada
    }

    // Guardar usuario
    const newUser = {
      nombre,
      cedula,
      telefono,
      contraseña, // En producción, esto debería estar hasheado
    };
    
    users.push(newUser);
    await AsyncStorage.setItem('ciudadanos_registrados', JSON.stringify(users));

    // Auto-login después del registro
    const userData: CiudadanoUser = {nombre, cedula, telefono};
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    await AsyncStorage.setItem(AUTH_KEY, 'true');

    return true;
  } catch (error) {
    console.error('Error en registro:', error);
    return false;
  }
};

export const loginCiudadano = async (
  cedula: string,
  contraseña: string,
): Promise<boolean> => {
  try {
    const existingUsers = await AsyncStorage.getItem('ciudadanos_registrados');
    const users = existingUsers ? JSON.parse(existingUsers) : [];
    
    const user = users.find(
      (u: any) => u.cedula === cedula && u.contraseña === contraseña,
    );

    if (user) {
      const userData: CiudadanoUser = {
        nombre: user.nombre,
        cedula: user.cedula,
        telefono: user.telefono,
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(AUTH_KEY, 'true');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error en login:', error);
    return false;
  }
};

export const logoutCiudadano = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error en logout:', error);
  }
};

export const isCiudadanoAuthenticated = async (): Promise<boolean> => {
  try {
    const auth = await AsyncStorage.getItem(AUTH_KEY);
    return auth === 'true';
  } catch (error) {
    return false;
  }
};

export const getCiudadanoUser = async (): Promise<CiudadanoUser | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

