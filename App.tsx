import React from 'react';
import {Platform, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

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
import ErrorBoundary from './src/components/ErrorBoundary';

export type RootStackParamList = {
  Home: undefined;
  LoginPolicial: undefined;
  Dashboard: undefined;
  Denuncia: undefined;
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
    },
  },
};

const App = () => {
  console.log('🎯 [App.tsx] Componente App renderizándose...');
  
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

