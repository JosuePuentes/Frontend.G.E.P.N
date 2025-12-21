import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {activarPanico, finalizarGuardia, generarQROficial} from '../services/apiService';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const DashboardScreen: React.FC<Props> = ({navigation}) => {
  const [panicPressed, setPanicPressed] = useState(false);
  const panicTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [qrVisible, setQrVisible] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [oficialData, setOficialData] = useState<any>(null);

  const handleFinalizarGuardia = async () => {
    Alert.alert(
      'Finalizar Guardia',
      '¿Estás seguro de que deseas finalizar tu guardia?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Finalizar',
          style: 'destructive',
          onPress: async () => {
            const success = await finalizarGuardia();
            if (success) {
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('policial_user');
              Alert.alert('Éxito', 'Guardia finalizada correctamente');
              navigation.replace('Home');
            } else {
              Alert.alert('Error', 'No se pudo finalizar la guardia');
            }
          },
        },
      ],
    );
  };

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

  useEffect(() => {
    // Cargar datos del oficial al montar
    loadOficialData();
  }, []);

  const loadOficialData = async () => {
    try {
      const userData = await AsyncStorage.getItem('policial_user');
      if (userData) {
        const user = JSON.parse(userData);
        setOficialData(user);
      }
    } catch (error) {
      console.error('Error al cargar datos del oficial:', error);
    }
  };

  const handleVerQR = async () => {
    try {
      const userData = await AsyncStorage.getItem('policial_user');
      if (!userData) {
        Alert.alert('Error', 'No se encontraron datos del oficial');
        return;
      }

      const user = JSON.parse(userData);
      const result = await generarQROficial(user.id || user.credencial);
      
      if (result.success && result.qrCode) {
        setQrCode(result.qrCode);
        setQrVisible(true);
      } else {
        Alert.alert('Error', 'No se pudo generar el código QR');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al generar el código QR');
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
            onPress={() => handleMenuButton('Minutas Digitales')}>
            <Text style={styles.menuButtonIcon}>📝</Text>
            <Text style={styles.menuButtonText}>Minutas Digitales</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleMenuButton('Los Más Buscados')}>
            <Text style={styles.menuButtonIcon}>🔍</Text>
            <Text style={styles.menuButtonText}>Los Más Buscados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleMenuButton('Verificación de Cédulas')}>
            <Text style={styles.menuButtonIcon}>🆔</Text>
            <Text style={styles.menuButtonText}>Verificación de Cédulas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleMenuButton('Registro de Detenidos')}>
            <Text style={styles.menuButtonIcon}>👤</Text>
            <Text style={styles.menuButtonText}>Registro de Detenidos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('QRScanner')}>
            <Text style={styles.menuButtonIcon}>📱</Text>
            <Text style={styles.menuButtonText}>Escanear QR</Text>
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
            <Text style={styles.panicButtonIcon}>🚨</Text>
            <Text style={styles.panicButtonText}>
              {panicPressed ? 'Mantén presionado 5 segundos...' : 'Botón de Apoyo'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity
          style={styles.finalizarButton}
          onPress={handleFinalizarGuardia}
          activeOpacity={0.8}>
          <Text style={styles.finalizarButtonText}>Finalizar Guardia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.qrButton}
          onPress={handleVerQR}
          activeOpacity={0.8}>
          <Text style={styles.qrButtonText}>Ver Mi QR</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para mostrar QR */}
      <Modal
        visible={qrVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setQrVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mi Código QR</Text>
            {qrCode && (
              <Image
                source={{uri: qrCode}}
                style={styles.qrImage}
                resizeMode="contain"
              />
            )}
            {oficialData && (
              <View style={styles.qrInfo}>
                <Text style={styles.qrInfoText}>
                  {oficialData.nombre_completo || oficialData.primer_nombre + ' ' + oficialData.primer_apellido}
                </Text>
                <Text style={styles.qrInfoText}>Credencial: {oficialData.credencial}</Text>
                <Text style={styles.qrInfoText}>Rango: {oficialData.rango}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setQrVisible(false)}>
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  menuButtonIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37', // Texto dorado
    textAlign: 'center',
  },
  panicContainer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  panicButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 25,
    paddingHorizontal: 50,
    borderRadius: 16,
    minWidth: 250,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 3,
    borderColor: '#FF6B60',
  },
  panicButtonPressed: {
    backgroundColor: '#CC2E24',
    borderColor: '#FF3B30',
  },
  panicButtonIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  panicButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  finalizarButton: {
    marginTop: 20,
    backgroundColor: '#2a2a2a',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  finalizarButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  qrButton: {
    marginTop: 15,
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F5D76E',
  },
  qrButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
    maxWidth: 400,
    width: '100%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 20,
  },
  qrImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
  },
  qrInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  qrInfoText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: '#00247D',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0033A0',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;

