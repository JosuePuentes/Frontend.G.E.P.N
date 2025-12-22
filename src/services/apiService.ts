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
  latitud?: number,
  longitud?: number,
): Promise<{success: boolean; token?: string; usuario?: any}> => {
  try {
    const body: any = {credencial, pin};
    if (latitud !== undefined && longitud !== undefined) {
      body.latitud = latitud;
      body.longitud = longitud;
    }

    const response = await api.post('/api/policial/login', body);

    if (response.data && response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('policial_user', JSON.stringify(response.data.usuario));
      await AsyncStorage.setItem('guardia_activa', 'true');
      return {success: true, token: response.data.token, usuario: response.data.usuario};
    }
    return {success: false};
  } catch (error) {
    console.error('Error en login:', error);
    return {success: false};
  }
};

export const finalizarGuardia = async (): Promise<boolean> => {
  try {
    const response = await api.post('/api/policial/finalizar-guardia');
    if (response.status === 200) {
      await AsyncStorage.removeItem('guardia_activa');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al finalizar guardia:', error);
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

// Funciones para RRHH
export const registrarOficial = async (datosOficial: any): Promise<{success: boolean; message?: string}> => {
  try {
    const response = await api.post('/api/rrhh/registrar-oficial', datosOficial);
    return {success: response.data.success, message: response.data.message};
  } catch (error: any) {
    console.error('Error al registrar oficial:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar oficial',
    };
  }
};

export const generarQROficial = async (oficialId: string): Promise<{success: boolean; qrCode?: string}> => {
  try {
    const response = await api.get(`/api/rrhh/generar-qr/${oficialId}`);
    return {
      success: response.data.success,
      qrCode: response.data.qrCode || response.data.qr_code,
    };
  } catch (error) {
    console.error('Error al generar QR:', error);
    return {success: false};
  }
};

export const verificarQR = async (qrData: string): Promise<{success: boolean; data?: any}> => {
  try {
    const response = await api.get(`/api/rrhh/verificar-qr/${qrData}`);
    return {
      success: response.data.success,
      data: response.data.data?.oficial || response.data.data,
    };
  } catch (error: any) {
    console.error('Error al verificar QR:', error);
    return {
      success: false,
    };
  }
};

// Funciones para Master
export const loginMaster = async (
  usuario: string,
  contraseña: string,
): Promise<{success: boolean; token?: string; master?: any; error?: string}> => {
  try {
    const response = await api.post('/api/master/login', {
      usuario,
      contraseña,
    });

    if (response.data && response.data.token) {
      await AsyncStorage.setItem('masterToken', response.data.token);
      await AsyncStorage.setItem('master_user', JSON.stringify(response.data.master));
      // También guardar en authToken para que el interceptor lo use
      await AsyncStorage.setItem('authToken', response.data.token);
      
      return {
        success: true,
        token: response.data.token,
        master: response.data.master,
      };
    }
    
    return {
      success: false,
      error: response.data?.error || 'Error desconocido',
    };
  } catch (error: any) {
    console.error('Error en login master:', error);
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.error || error.response.data?.mensaje || 'Error al iniciar sesión',
      };
    }
    
    return {
      success: false,
      error: 'Error de conexión',
    };
  }
};

export const isMasterAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('masterToken');
    const user = await AsyncStorage.getItem('master_user');
    return !!(token && user);
  } catch {
    return false;
  }
};

export const getMasterUser = async (): Promise<any | null> => {
  try {
    const userStr = await AsyncStorage.getItem('master_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const logoutMaster = async (): Promise<void> => {
  await AsyncStorage.removeItem('masterToken');
  await AsyncStorage.removeItem('master_user');
  // No remover authToken aquí porque puede ser usado por otros módulos
};

export const crearUsuarioMaster = async (datos: {
  usuario: string;
  nombre: string;
  email: string;
  contraseña: string;
  permisos: string[];
}): Promise<{success: boolean; message?: string}> => {
  try {
    const response = await api.post('/api/master/crear-usuario', datos);
    return {success: response.data.success, message: response.data.message};
  } catch (error: any) {
    console.error('Error al crear usuario master:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear usuario master',
    };
  }
};

export const listarUsuariosMaster = async (): Promise<{success: boolean; data?: any[]}> => {
  try {
    const response = await api.get('/api/master/usuarios');
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error al listar usuarios master:', error);
    return {success: false};
  }
};

export const actualizarPermisosMaster = async (
  usuarioId: string,
  permisos: string[],
): Promise<{success: boolean; message?: string}> => {
  try {
    const response = await api.put(`/api/master/usuarios/${usuarioId}/permisos`, {permisos});
    return {success: response.data.success, message: response.data.message};
  } catch (error: any) {
    console.error('Error al actualizar permisos:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar permisos',
    };
  }
};

export const obtenerModulos = async (): Promise<{success: boolean; data?: any[]}> => {
  try {
    const response = await api.get('/api/master/modulos');
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error al obtener módulos:', error);
    return {success: false};
  }
};

// Funciones para Centro de Coordinación Policial
export const crearCentroCoordinacion = async (datos: {
  estado: string;
  nombre: string;
}): Promise<{success: boolean; message?: string}> => {
  try {
    const response = await api.post('/api/centro-coordinacion/crear', datos);
    return {success: response.data.success, message: response.data.message};
  } catch (error: any) {
    console.error('Error al crear centro de coordinación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear centro de coordinación',
    };
  }
};

export const listarCentrosCoordinacion = async (): Promise<{success: boolean; data?: any[]}> => {
  try {
    const response = await api.get('/api/centro-coordinacion/listar');
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error al listar centros de coordinación:', error);
    return {success: false};
  }
};

export const crearEstacionPolicial = async (datos: {
  centroCoordinacionId: string;
  nombre: string;
  direccion: string;
  telefono?: string;
}): Promise<{success: boolean; message?: string}> => {
  try {
    const response = await api.post('/api/centro-coordinacion/estacion/crear', datos);
    return {success: response.data.success, message: response.data.message};
  } catch (error: any) {
    console.error('Error al crear estación policial:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear estación policial',
    };
  }
};

export const listarEstacionesPolicial = async (
  centroId: string,
): Promise<{success: boolean; data?: any[]}> => {
  try {
    const response = await api.get(`/api/centro-coordinacion/estaciones/${centroId}`);
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error al listar estaciones:', error);
    return {success: false};
  }
};

export const crearParte = async (datos: {
  estacionPolicialId: string;
  numero: string;
}): Promise<{success: boolean; message?: string}> => {
  try {
    const response = await api.post('/api/centro-coordinacion/parte/crear', datos);
    return {success: response.data.success, message: response.data.message};
  } catch (error: any) {
    console.error('Error al crear parte:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear parte',
    };
  }
};

export const listarPartes = async (estacionId: string): Promise<{success: boolean; data?: any[]}> => {
  try {
    const response = await api.get(`/api/centro-coordinacion/partes/${estacionId}`);
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error al listar partes:', error);
    return {success: false};
  }
};

export const buscarFuncionarios = async (
  busqueda: string,
): Promise<{success: boolean; data?: any[]; message?: string}> => {
  try {
    const response = await api.get(`/api/centro-coordinacion/buscar-funcionarios?q=${encodeURIComponent(busqueda)}`);
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Error al buscar funcionarios:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al buscar funcionarios',
    };
  }
};

export const asignarFuncionarioAParte = async (datos: {
  parteId: string;
  funcionarioId: string;
}): Promise<{success: boolean; message?: string}> => {
  try {
    const response = await api.post('/api/centro-coordinacion/parte/asignar-funcionario', datos);
    return {success: response.data.success, message: response.data.message};
  } catch (error: any) {
    console.error('Error al asignar funcionario:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al asignar funcionario',
    };
  }
};

export default api;

