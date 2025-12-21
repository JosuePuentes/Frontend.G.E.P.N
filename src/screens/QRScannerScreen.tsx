import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {verificarQR} from '../services/apiService';

// Importar imagen de fondo
const backgroundImageStatic = require('../assets/images/Gemini_Generated_Image_5keo7m5keo7m5keo.png');

type QRScannerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'QRScanner'
>;

interface Props {
  navigation: QRScannerScreenNavigationProp;
}

const QRScannerScreen: React.FC<Props> = ({navigation}) => {
  const [qrData, setQrData] = useState('');
  const [oficialData, setOficialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerificarQR = async () => {
    if (!qrData.trim()) {
      Alert.alert('Error', 'Por favor ingresa el código QR');
      return;
    }

    setLoading(true);
    try {
      const result = await verificarQR(qrData.trim());
      if (result.success && result.data) {
        setOficialData(result.data);
      } else {
        Alert.alert('Error', 'QR inválido o no se encontró el oficial');
        setOficialData(null);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al verificar el QR');
      setOficialData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundImageStatic}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.overlay} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Verificar Código QR</Text>
            <Text style={styles.subtitle}>Escanea o ingresa el código QR</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Código QR</Text>
            <TextInput
              style={styles.input}
              value={qrData}
              onChangeText={setQrData}
              placeholder="Ingresa o pega el código QR aquí"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerificarQR}
              disabled={loading}>
              <Text style={styles.verifyButtonText}>
                {loading ? 'Verificando...' : 'Verificar QR'}
              </Text>
            </TouchableOpacity>
          </View>

          {oficialData && (
            <View style={styles.carnetContainer}>
              <Text style={styles.carnetTitle}>Carnet de Identificación</Text>
              
              {/* Foto de cara */}
              {oficialData.foto_cara && (
                <View style={styles.photoContainer}>
                  <Image
                    source={{uri: oficialData.foto_cara}}
                    style={styles.photoCara}
                    resizeMode="cover"
                  />
                </View>
              )}

              {/* Información del oficial */}
              <View style={styles.infoSection}>
                <Text style={styles.nombreCompleto}>
                  {oficialData.nombre_completo ||
                    `${oficialData.primer_nombre || ''} ${oficialData.segundo_nombre || ''} ${oficialData.primer_apellido || ''} ${oficialData.segundo_apellido || ''}`.trim()}
                </Text>
                <Text style={styles.rango}>{oficialData.rango}</Text>
                <Text style={styles.credencial}>
                  Credencial: {oficialData.credencial}
                </Text>
              </View>

              {/* Foto de carnet (si existe) */}
              {oficialData.foto_carnet && (
                <View style={styles.carnetPhotoContainer}>
                  <Image
                    source={{uri: oficialData.foto_carnet}}
                    style={styles.photoCarnet}
                    resizeMode="contain"
                  />
                </View>
              )}

              {/* Información adicional */}
              <View style={styles.detailsSection}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cédula:</Text>
                  <Text style={styles.detailValue}>{oficialData.cedula}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Destacado:</Text>
                  <Text style={styles.detailValue}>{oficialData.destacado}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ubicación:</Text>
                  <Text style={styles.detailValue}>
                    {oficialData.parroquia}, {oficialData.municipio}, {oficialData.estado}
                  </Text>
                </View>
                {oficialData.fecha_registro && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fecha de Registro:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(oficialData.fecha_registro).toLocaleDateString('es-VE')}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {oficialData.activo ? '✅ Activo' : '❌ Inactivo'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  section: {
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#000000',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  verifyButton: {
    backgroundColor: '#00247D',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#0033A0',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  carnetContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 16,
    padding: 25,
    borderWidth: 3,
    borderColor: '#D4AF37',
    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  carnetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 20,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoCara: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#D4AF37',
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2a2a2a',
  },
  nombreCompleto: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  rango: {
    fontSize: 18,
    color: '#D4AF37',
    fontWeight: '600',
    marginBottom: 5,
  },
  credencial: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  carnetPhotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoCarnet: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  detailLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: '#00247D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0033A0',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRScannerScreen;

