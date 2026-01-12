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
} from 'react-native';
import {loginPatrullaje} from '../services/patrullajeService';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patrullaje Policial</Text>
        <Text style={styles.subtitle}>Ingresa tus credenciales</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Credencial</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu credencial"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    backgroundColor: '#10B981',
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
    backgroundColor: '#1E40AF',
    padding: 16,
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPatrullajeScreen;
