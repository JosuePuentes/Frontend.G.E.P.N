import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {Platform} from 'react-native';
import {requestLocationPermission} from '../services/locationService';
import {loginPolicial} from '../services/apiService';

// Importar Geolocation según la plataforma
let Geolocation: any;
if (Platform.OS === 'web') {
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
  Geolocation = require('@react-native-community/geolocation').default;
}

// Importar imagen de fondo (misma que HomeScreen)
const backgroundImageStatic = require('../assets/images/Gemini_Generated_Image_5keo7m5keo7m5keo.png');

type LoginPolicialScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoginPolicial'
>;

interface Props {
  navigation: LoginPolicialScreenNavigationProp;
}

const LoginPolicialScreen: React.FC<Props> = ({navigation}) => {
  const [credencial, setCredencial] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!credencial.trim() || !pin.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      Alert.alert('Error', 'El PIN debe tener 6 dígitos numéricos');
      return;
    }

    setLoading(true);

    try {
      // Solicitar permisos GPS
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos de ubicación para iniciar guardia',
        );
        setLoading(false);
        return;
      }

      // Obtener ubicación GPS
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          
          // Realizar login con GPS
          const result = await loginPolicial(credencial, pin, latitude, longitude);
          if (result.success) {
            Alert.alert('Éxito', 'Guardia iniciada correctamente');
            navigation.replace('Dashboard');
          } else {
            Alert.alert('Error', 'Credenciales incorrectas');
          }
          setLoading(false);
        },
        error => {
          Alert.alert('Error', 'No se pudo obtener la ubicación. Intenta nuevamente.');
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundImageStatic}
        style={styles.backgroundImage}
        resizeMode="cover">
        {/* Overlay semi-transparente para mejorar legibilidad */}
        <View style={styles.overlay} />
        
        <View style={styles.content}>
          <Text style={styles.title}>Login Policial</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Credencial</Text>
            <TextInput
              style={styles.input}
              value={credencial}
              onChangeText={setCredencial}
              placeholder="Ingresa tu credencial"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>PIN (6 dígitos)</Text>
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={setPin}
              placeholder="000000"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay oscuro para mejorar legibilidad
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    zIndex: 1, // Asegurar que el contenido esté sobre el fondo
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#000000',
  },
  loginButton: {
    backgroundColor: '#00247D',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0033A0',
    shadowColor: '#00247D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginPolicialScreen;

