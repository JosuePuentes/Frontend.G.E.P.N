import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // true = login, false = registro
  const [credencial, setCredencial] = useState('');
  const [pin, setPin] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  // Colores de la bandera de Venezuela
  const amarillo = '#FFCC02';
  const azul = '#00247D';
  const rojo = '#CF142B';
  const dorado = '#D4AF37';

  // Intentar cargar el escudo de la policía (opcional)
  let escudoPolicia = null;
  try {
    escudoPolicia = require('../../assets/images/escudo-policia.png');
  } catch (e) {
    // Si la imagen no existe, escudoPolicia será null
  }

  const handleLogin = () => {
    if (!credencial.trim() || !pin.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    // Aquí iría la lógica de login
    setModalVisible(false);
    navigation.navigate('LoginPolicial');
  };

  const handleRegister = () => {
    if (!nombre.trim() || !apellido.trim() || !credencial.trim() || !pin.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    // Aquí iría la lógica de registro
    Alert.alert('Éxito', 'Registro completado. Por favor inicia sesión.');
    setIsLogin(true);
    setNombre('');
    setApellido('');
  };

  const handleDenuncia = () => {
    Alert.alert('Realizar Denuncia', 'Funcionalidad de denuncia próximamente disponible');
    // Aquí se implementará la funcionalidad de denuncia
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón de Iniciar Sesión */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>G.E.P.N</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.loginHeaderButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}>
            <Text style={styles.loginHeaderButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Línea de colores de la bandera */}
      <View style={styles.flagLineContainer}>
        <View style={[styles.flagLineStrip, {backgroundColor: amarillo}]} />
        <View style={[styles.flagLineStrip, {backgroundColor: azul}]} />
        <View style={[styles.flagLineStrip, {backgroundColor: rojo}]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Contenido Principal */}
        <View style={styles.mainContent}>
          {/* Escudo de la Policía */}
          {escudoPolicia && (
            <View style={styles.escudoContainer}>
              <Image
                source={escudoPolicia}
                style={styles.escudoImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Título Principal */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleMain}>Gestión Especial</Text>
            <Text style={styles.titleMain}>Policial Nacional</Text>
            <View style={styles.acronymContainer}>
              <Text style={styles.acronym}>G.E.P.N</Text>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              Sistema de gestión especializado para operaciones policiales nacionales
            </Text>
          </View>

          {/* Botón de Realizar Denuncia */}
          <TouchableOpacity
            style={styles.denunciaButton}
            onPress={handleDenuncia}
            activeOpacity={0.8}>
            <View style={styles.denunciaButtonContent}>
              <Text style={styles.denunciaIcon}>🚨</Text>
              <Text style={styles.denunciaButtonText}>Realizar Denuncia</Text>
            </View>
          </TouchableOpacity>

          {/* Información adicional */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Servicios Disponibles</Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Text style={styles.infoBullet}>•</Text>
                <Text style={styles.infoText}>Registro de denuncias</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoBullet}>•</Text>
                <Text style={styles.infoText}>Gestión de operaciones</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoBullet}>•</Text>
                <Text style={styles.infoText}>Sistema de alertas</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Login/Registro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isLogin ? 'Iniciar Sesión' : 'Registro'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setCredencial('');
                  setPin('');
                  setNombre('');
                  setApellido('');
                }}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs Login/Registro */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.tabActive]}
                onPress={() => {
                  setIsLogin(true);
                  setNombre('');
                  setApellido('');
                }}>
                <Text
                  style={[
                    styles.tabText,
                    isLogin && styles.tabTextActive,
                  ]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.tabActive]}
                onPress={() => {
                  setIsLogin(false);
                  setCredencial('');
                  setPin('');
                }}>
                <Text
                  style={[
                    styles.tabText,
                    !isLogin && styles.tabTextActive,
                  ]}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>

            {/* Formulario */}
            <ScrollView style={styles.formContainer}>
              {!isLogin && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                      style={styles.input}
                      value={nombre}
                      onChangeText={setNombre}
                      placeholder="Ingresa tu nombre"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Apellido</Text>
                    <TextInput
                      style={styles.input}
                      value={apellido}
                      onChangeText={setApellido}
                      placeholder="Ingresa tu apellido"
                      placeholderTextColor="#999"
                    />
                  </View>
                </>
              )}

              <View style={styles.inputGroup}>
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  PIN {isLogin ? '(6 dígitos)' : '(6 dígitos)'}
                </Text>
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
                style={styles.submitButton}
                onPress={isLogin ? handleLogin : handleRegister}
                activeOpacity={0.8}>
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 3,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  loginHeaderButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  loginHeaderButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  flagLineContainer: {
    width: '100%',
    height: 6,
    flexDirection: 'row',
    borderRadius: 0,
    overflow: 'hidden',
  },
  flagLineStrip: {
    flex: 1,
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  escudoContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  escudoImage: {
    width: 120,
    height: 120,
    maxWidth: 150,
    maxHeight: 150,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleMain: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 1.5,
  },
  acronymContainer: {
    marginTop: 15,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  acronym: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 6,
  },
  descriptionContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
  denunciaButton: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#CF142B',
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 30,
    marginBottom: 40,
    shadowColor: '#CF142B',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  denunciaButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  denunciaIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  denunciaButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  infoContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoList: {
    alignItems: 'flex-start',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoBullet: {
    fontSize: 20,
    color: '#D4AF37',
    marginRight: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#CCCCCC',
    flex: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#D4AF37',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default HomeScreen;
