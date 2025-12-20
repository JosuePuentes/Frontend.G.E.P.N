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
          'Se necesitan permisos de ubicación para continuar',
        );
        setLoading(false);
        return;
      }

      // Realizar login
      const success = await loginPolicial(credencial, pin);
      if (success) {
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Login Policial</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Credencial</Text>
          <TextInput
            style={styles.input}
            value={credencial}
            onChangeText={setCredencial}
            placeholder="Ingresa tu credencial"
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
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

