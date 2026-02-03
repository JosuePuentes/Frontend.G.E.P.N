import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {loginPatrullaje} from '../services/patrullajeService';

// Foto de fondo: coloca tu imagen en src/assets/images/login-patrullaje-fondo.png (o .jpg)
// y cambia la línea siguiente a: require('../assets/images/login-patrullaje-fondo.png')
const backgroundImage = require('../assets/images/Gemini_Generated_Image_5keo7m5keo7m5keo.png');

interface LoginPatrullajeScreenProps {
  navigation: any;
}

const LoginPatrullajeScreen: React.FC<LoginPatrullajeScreenProps> = ({
  navigation,
}) => {
  const [credencial, setCredencial] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [funcionarioData, setFuncionarioData] = useState<any>(null);

  const handleLogin = async () => {
    // Validaciones
    if (!credencial.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu credencial');
      return;
    }

    if (!pin.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu PIN');
      return;
    }

    if (pin.length !== 6) {
      Alert.alert('Error', 'El PIN debe tener 6 dígitos');
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      Alert.alert('Error', 'El PIN debe contener solo números');
      return;
    }

    setLoading(true);

    try {
      const response = await loginPatrullaje(credencial, pin);

      if (response.success) {
        // Guardar datos del funcionario
        setFuncionarioData(response.data);
        // Mostrar modal con información
        setModalVisible(true);
      } else {
        Alert.alert('Error', response.message || 'Credenciales incorrectas');
      }
    } catch (error: any) {
      console.error('Error en login patrullaje:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo conectar con el servidor',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinuar = () => {
    setModalVisible(false);
    // Navegar al mapa de patrullaje
    navigation.replace('MapaPatrullaje', {
      funcionario: funcionarioData,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.overlay} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Patrullaje Policial</Text>
            <Text style={styles.subtitle}>Ingresa tus credenciales</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Credencial</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu credencial"
                placeholderTextColor="#6B7280"
                value={credencial}
                onChangeText={setCredencial}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PIN (6 dígitos)</Text>
              <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor="#6B7280"
                value={pin}
                onChangeText={text => setPin(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Patrullaje</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={loading}>
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Modal de confirmación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✅ Acceso Autorizado</Text>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Nombre:</Text>
                <Text style={styles.dataValue}>
                  {funcionarioData?.nombre} {funcionarioData?.apellido}
                </Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Credencial:</Text>
                <Text style={styles.dataValue}>
                  {funcionarioData?.credencial}
                </Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Rango:</Text>
                <Text style={styles.dataValue}>
                  {funcionarioData?.rango || 'Oficial'}
                </Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Unidad:</Text>
                <Text style={styles.dataValue}>
                  {funcionarioData?.unidad || 'Patrullaje'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleContinuar}>
              <Text style={styles.modalButtonText}>Continuar al Mapa</Text>
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
    backgroundColor: '#0a0f2e',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 36, 125, 0.55)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    zIndex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#D4AF37',
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00247D',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#00247D',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#0033A0',
    shadowColor: '#00247D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#00247D',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    backgroundColor: '#00247D',
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalBody: {
    padding: 20,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    width: 100,
  },
  dataValue: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    fontWeight: '500',
  },
  modalButton: {
    backgroundColor: '#00247D',
    padding: 16,
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPatrullajeScreen;

