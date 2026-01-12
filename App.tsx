import React, {useEffect} from 'react';
import {Platform, Linking, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {requestLocationPermission} from './src/services/locationService';

// Deshabilitar react-native-screens para web (causa problemas de renderizado)
if (Platform.OS === 'web') {
  try {
    const {enableScreens} = require('react-native-screens');
    enableScreens(false);
  } catch (e) {
    // Ignorar si no está disponible
  }
}

import HomeScreen from './src/screens/HomeScreen';
import LoginPolicialScreen from './src/screens/LoginPolicialScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import DenunciaScreen from './src/screens/DenunciaScreen';
import RRHHScreen from './src/screens/RRHHScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import MasterScreen from './src/screens/MasterScreen';
import CentroCoordinacionScreen from './src/screens/CentroCoordinacionScreen';
import ListadoDenunciasScreen from './src/screens/ListadoDenunciasScreen';
import DetalleDenunciaScreen from './src/screens/DetalleDenunciaScreen';
import MisDenunciasScreen from './src/screens/MisDenunciasScreen';
import LoginPatrullajeScreen from './src/screens/LoginPatrullajeScreen';
import MapaPatrullajeScreen from './src/screens/MapaPatrullajeScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

export type RootStackParamList = {
  Home: undefined;
  LoginPolicial: undefined;
  Dashboard: undefined;
  Denuncia: undefined;
  RRHH: undefined;
  QRScanner: undefined;
  Master: undefined;
  CentroCoordinacion: undefined;
  ListadoDenuncias: undefined;
  DetalleDenuncia: {denunciaId: string};
  MisDenuncias: undefined;
  LoginPatrullaje: undefined;
  MapaPatrullaje: {funcionario: any};
};

const Stack = createStackNavigator<RootStackParamList>();

// Configuración de deep linking para web
const linking = {
  prefixes: Platform.OS === 'web' ? ['/'] : ['gepn://'],
  config: {
        screens: {
          Home: '',
          LoginPolicial: 'policial',
          Dashboard: 'dashboard',
          Denuncia: 'denuncia',
          RRHH: 'rrhh',
          QRScanner: 'qr-scanner',
          Master: 'master',
          CentroCoordinacion: 'centro-coordinacion',
          ListadoDenuncias: 'denuncias/listado',
          DetalleDenuncia: 'denuncias/:denunciaId',
          MisDenuncias: 'denuncias/mis-denuncias',
          LoginPatrullaje: 'patrullaje/login',
          MapaPatrullaje: 'patrullaje/mapa',
        },
  },
};

const App = () => {
  console.log('🎯 [App.tsx] Componente App renderizándose...');

  // Solicitar permisos GPS al iniciar la app
  useEffect(() => {
    const solicitarPermisos = async () => {
      try {
        const tienePermiso = await requestLocationPermission();
        if (!tienePermiso && Platform.OS !== 'web') {
          Alert.alert(
            'Permisos de Ubicación',
            'La aplicación necesita acceso a tu ubicación para el botón de pánico. Puedes activarlo desde la configuración de tu dispositivo.',
          );
        }
      } catch (error) {
        console.error('Error al solicitar permisos GPS:', error);
      }
    };

    solicitarPermisos();
  }, []);
  
  try {
    console.log('🎯 [App.tsx] Creando ErrorBoundary...');
    return (
      <ErrorBoundary>
        <SafeAreaProvider>
          <NavigationContainer
            linking={linking}
            onReady={() => {
              console.log('✅ [App.tsx] NavigationContainer listo');
            }}
            onStateChange={() => {
              console.log('🔄 [App.tsx] Estado de navegación cambió');
            }}>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
              }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="LoginPolicial" component={LoginPolicialScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Denuncia" component={DenunciaScreen} />
            <Stack.Screen name="RRHH" component={RRHHScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen name="Master" component={MasterScreen} />
            <Stack.Screen name="CentroCoordinacion" component={CentroCoordinacionScreen} />
            <Stack.Screen name="ListadoDenuncias" component={ListadoDenunciasScreen} />
            <Stack.Screen name="DetalleDenuncia" component={DetalleDenunciaScreen} />
            <Stack.Screen name="MisDenuncias" component={MisDenunciasScreen} />
            <Stack.Screen name="LoginPatrullaje" component={LoginPatrullajeScreen} />
            <Stack.Screen name="MapaPatrullaje" component={MapaPatrullajeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('❌ [App.tsx] Error en render:', error);
    throw error;
  }
};

export default App;

