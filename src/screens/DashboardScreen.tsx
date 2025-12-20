import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {activarPanico} from '../services/apiService';
import {Platform} from 'react-native';

// Importar Geolocation según la plataforma
let Geolocation: any;
if (Platform.OS === 'web') {
  // En web, usar la API nativa del navegador
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
  // En móvil, usar la librería nativa
  Geolocation = require('@react-native-community/geolocation').default;
}

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = () => {
  const [panicPressed, setPanicPressed] = useState(false);
  const panicTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePanicPressIn = () => {
    setPanicPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    // Iniciar temporizador de 5 segundos
    panicTimerRef.current = setTimeout(() => {
      handlePanicActivate();
    }, 5000);
  };

  const handlePanicPressOut = () => {
    setPanicPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    // Cancelar temporizador si se suelta antes de 5 segundos
    if (panicTimerRef.current) {
      clearTimeout(panicTimerRef.current);
      panicTimerRef.current = null;
    }
  };

  const handlePanicActivate = async () => {
    try {
      // Obtener ubicación actual
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;

          // Obtener dirección (simplificado, puedes usar geocoding)
          const ubicacion = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;

          const success = await activarPanico(latitude, longitude, ubicacion);
          if (success) {
            Alert.alert('Éxito', 'Botón de pánico activado');
          } else {
            Alert.alert('Error', 'No se pudo activar el botón de pánico');
          }
        },
        error => {
          Alert.alert('Error', 'No se pudo obtener la ubicación');
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      Alert.alert('Error', 'Error al activar el botón de pánico');
    } finally {
      setPanicPressed(false);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMenuButton = (screen: string) => {
    Alert.alert('Info', `Navegar a: ${screen}`);
    // Aquí puedes agregar navegación a otras pantallas cuando las implementes
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleMenuButton('Detenidos')}>
            <Text style={styles.menuButtonText}>Detenidos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleMenuButton('Minutas')}>
            <Text style={styles.menuButtonText}>Minutas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleMenuButton('Búsqueda')}>
            <Text style={styles.menuButtonText}>Búsqueda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleMenuButton('Más Buscados')}>
            <Text style={styles.menuButtonText}>Más Buscados</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.panicContainer}>
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <TouchableOpacity
            style={[
              styles.panicButton,
              panicPressed && styles.panicButtonPressed,
            ]}
            onPressIn={handlePanicPressIn}
            onPressOut={handlePanicPressOut}
            activeOpacity={0.8}>
            <Text style={styles.panicButtonText}>
              {panicPressed ? 'Mantén presionado...' : 'Botón de Pánico'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Fondo negro
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texto blanco sobre fondo negro
    marginBottom: 30,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37', // Borde dorado
    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D4AF37', // Texto dorado
  },
  panicContainer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  panicButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  panicButtonPressed: {
    backgroundColor: '#CC2E24',
  },
  panicButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;

