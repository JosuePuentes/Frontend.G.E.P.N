import React, {useState, useEffect, useRef} from 'react';
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
  ImageBackground,
  Alert,
  ActivityIndicator,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {
  registerCiudadano,
  loginCiudadano,
  isCiudadanoAuthenticated,
  getCiudadanoUser,
  logoutCiudadano,
} from '../services/authService';
import {activarPanico} from '../services/apiService';
import {requestLocationPermission, getCurrentLocation} from '../services/locationService';

// Importar imágenes estáticamente para que Webpack las procese
// Usar require directo - Webpack lo procesará en tiempo de compilación
// Desde src/screens/, la ruta correcta es ../assets/images/ (no ../../assets/images/)
const logoImage = require('../assets/images/Gemini_Generated_Image_5keo7m5keo7m5keo.png');
const backgroundImageStatic = require('../assets/images/Gemini_Generated_Image_5keo7m5keo7m5keo.png');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // true = login, false = registro
  const [cedula, setCedula] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para botón de pánico
  const [panicPressed, setPanicPressed] = useState(false);
  const [panicProgress, setPanicProgress] = useState(0);
  const panicTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Verificar autenticación y solicitar permisos GPS al cargar
  useEffect(() => {
    checkAuth();
    solicitarPermisosGPS();
  }, []);

  const solicitarPermisosGPS = async () => {
    try {
      const tienePermiso = await requestLocationPermission();
      if (!tienePermiso) {
        Alert.alert(
          'Permisos de Ubicación',
          'La aplicación necesita acceso a tu ubicación para el botón de pánico. Puedes activarlo desde la configuración.',
        );
      }
    } catch (error) {
      console.error('Error al solicitar permisos GPS:', error);
    }
  };

  const checkAuth = async () => {
    const auth = await isCiudadanoAuthenticated();
    setIsAuthenticated(auth);
    if (auth) {
      const user = await getCiudadanoUser();
      if (user) {
        setUserName(user.nombre);
      }
    }
  };

  // Colores de la bandera de Venezuela
  const amarillo = '#FFCC02';
  const azul = '#00247D';
  const rojo = '#CF142B';
  const dorado = '#D4AF37';

  // Usar las imágenes importadas estáticamente
  const escudoPolicia = logoImage;
  const backgroundImage = backgroundImageStatic;

  // Logs para debugging
  if (escudoPolicia) {
    console.log('✅ Logo cargado correctamente');
  } else {
    console.log('⚠️ No se encontró ningún logo');
  }

  if (backgroundImage) {
    console.log('✅ Imagen de fondo cargada correctamente');
  } else {
    console.log('⚠️ No se encontró imagen de fondo');
  }

  const handleLogin = async () => {
    if (!cedula.trim() || !contraseña.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    const success = await loginCiudadano(cedula, contraseña);
    setLoading(false);

    if (success) {
      Alert.alert('Éxito', 'Sesión iniciada correctamente');
      setModalVisible(false);
      setCedula('');
      setContraseña('');
      await checkAuth();
    } else {
      Alert.alert('Error', 'Cédula o contraseña incorrectos');
    }
  };

  const handleRegister = async () => {
    if (!nombre.trim() || !cedula.trim() || !telefono.trim() || !contraseña.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (contraseña.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    const success = await registerCiudadano(nombre, cedula, telefono, contraseña);
    setLoading(false);

    if (success) {
      Alert.alert('Éxito', 'Registro completado. Sesión iniciada automáticamente.');
      setModalVisible(false);
      setNombre('');
      setCedula('');
      setTelefono('');
      setContraseña('');
      setIsLogin(true);
      await checkAuth();
    } else {
      Alert.alert('Error', 'La cédula ya está registrada');
    }
  };

  const handleDenuncia = async () => {
    console.log('🚨 [HomeScreen] handleDenuncia llamado');
    
    // Verificar autenticación
    const auth = await isCiudadanoAuthenticated();
    console.log('🔐 [HomeScreen] Estado de autenticación:', auth);
    
    if (!auth) {
      console.log('⚠️ [HomeScreen] Usuario no autenticado, abriendo modal');
      // Abrir modal de login/registro directamente
      setModalVisible(true);
      Alert.alert(
        'Acceso Requerido',
        'Debes iniciar sesión o registrarte para realizar una denuncia',
      );
      return;
    }
    
    console.log('✅ [HomeScreen] Usuario autenticado, navegando a Denuncia');
    try {
      navigation.navigate('Denuncia');
      console.log('✅ [HomeScreen] Navegación ejecutada');
    } catch (error) {
      console.error('❌ [HomeScreen] Error en navegación:', error);
      Alert.alert('Error', 'No se pudo abrir el formulario de denuncia');
    }
  };

  const handleLogout = async () => {
    await logoutCiudadano();
    setIsAuthenticated(false);
    setUserName('');
    Alert.alert('Éxito', 'Sesión cerrada correctamente');
  };

  const handlePanicPressIn = async () => {
    // Verificar que el usuario esté autenticado
    if (!isAuthenticated) {
      Alert.alert(
        'Acceso Requerido',
        'Debes iniciar sesión para usar el botón de pánico',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Iniciar Sesión',
            onPress: () => setModalVisible(true),
          },
        ],
      );
      return;
    }

    setPanicPressed(true);
    setPanicProgress(0);

    // Animación de escala
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();

    // Actualizar progreso cada 100ms
    progressIntervalRef.current = setInterval(() => {
      setPanicProgress(prev => {
        const newProgress = prev + 2; // 5 segundos = 5000ms, 100ms = 2%
        if (newProgress >= 100) {
          return 100;
        }
        return newProgress;
      });
    }, 100);

    // Timer de 5 segundos
    panicTimerRef.current = setTimeout(async () => {
      await activarPanicoCompleto();
    }, 5000);
  };

  const handlePanicPressOut = () => {
    setPanicPressed(false);
    setPanicProgress(0);

    // Cancelar animación
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    // Limpiar timers
    if (panicTimerRef.current) {
      clearTimeout(panicTimerRef.current);
      panicTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const activarPanicoCompleto = async () => {
    try {
      // Obtener ubicación GPS
      const location = await getCurrentLocation();
      const {latitude, longitude} = location;

      // Obtener dirección aproximada (opcional)
      const ubicacion = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;

      // Activar pánico en el backend
      const success = await activarPanico(latitude, longitude, ubicacion);

      if (success) {
        // Vibración
        if (Platform.OS !== 'web') {
          Vibration.vibrate([0, 500, 200, 500]); // Patrón de vibración
        }

        // Notificación
        Alert.alert(
          '🚨 ALERTA DE PÁNICO ACTIVADA',
          'Tu alerta ha sido enviada a los oficiales de guardia. Ayuda en camino.',
          [{text: 'OK'}],
        );

        // Reproducir sonido
        if (Platform.OS === 'web') {
          try {
            // Crear un sonido de alerta usando Web Audio API
            // @ts-ignore
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800; // Frecuencia de alerta
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
          } catch (error) {
            console.error('Error al reproducir sonido:', error);
          }
        } else {
          // En móvil, usar react-native-sound o similar si está disponible
          // Por ahora, la vibración es suficiente
        }
      } else {
        Alert.alert('Error', 'No se pudo activar la alerta. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al activar pánico:', error);
      Alert.alert(
        'Error',
        'No se pudo obtener tu ubicación. Verifica que los permisos de GPS estén activados.',
      );
    } finally {
      setPanicPressed(false);
      setPanicProgress(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  // Limpiar timers al desmontar
  useEffect(() => {
    return () => {
      if (panicTimerRef.current) {
        clearTimeout(panicTimerRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover">
          {/* Overlay semi-transparente para mejorar legibilidad */}
          <View style={styles.overlay} />
          
          {/* Header con botón de Iniciar Sesión */}
          <View style={styles.header}>
            <View style={styles.headerLeft} />
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>G.E.P.N</Text>
            </View>
            <View style={styles.headerRight}>
              {isAuthenticated ? (
                <View style={styles.userContainer}>
                  <Text style={styles.userNameText}>{userName}</Text>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}>
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.loginHeaderButton}
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.8}>
                  <Text style={styles.loginHeaderButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
              )}
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
                <Text style={styles.titleMain}>Gestión Estratégica</Text>
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
                onPress={() => {
                  console.log('🔘 [HomeScreen] TouchableOpacity onPress ejecutado');
                  handleDenuncia();
                }}
                activeOpacity={0.7}>
                <View style={styles.denunciaButtonContent}>
                  <Text style={styles.denunciaIcon}>🚨</Text>
                  <Text style={styles.denunciaButtonText}>Realizar Denuncia</Text>
                </View>
              </TouchableOpacity>

              {/* Botón de Pánico Circular */}
              <View style={styles.panicContainer}>
                <Animated.View style={{transform: [{scale: scaleAnim}]}}>
                  <TouchableOpacity
                    style={[
                      styles.panicButton,
                      panicPressed && styles.panicButtonPressed,
                      !isAuthenticated && styles.panicButtonDisabled,
                    ]}
                    onPressIn={handlePanicPressIn}
                    onPressOut={handlePanicPressOut}
                    activeOpacity={0.8}
                    disabled={!isAuthenticated}>
                    <View style={styles.panicButtonInner}>
                      <Text style={styles.panicButtonIcon}>🚨</Text>
                      <Text style={styles.panicButtonText}>
                        {panicPressed
                          ? `Mantén presionado... ${Math.round(panicProgress)}%`
                          : 'Botón de Pánico'}
                      </Text>
                      {panicPressed && (
                        <View style={styles.progressBarContainer}>
                          <View
                            style={[
                              styles.progressBar,
                              {width: `${panicProgress}%`},
                            ]}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
                {!isAuthenticated && (
                  <Text style={styles.panicWarningText}>
                    Inicia sesión para usar el botón de pánico
                  </Text>
                )}
              </View>

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
        </ImageBackground>
      ) : (
        <>
          {/* Header con botón de Iniciar Sesión */}
          <View style={styles.header}>
            <View style={styles.headerLeft} />
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>G.E.P.N</Text>
            </View>
            <View style={styles.headerRight}>
              {isAuthenticated ? (
                <View style={styles.userContainer}>
                  <Text style={styles.userNameText}>{userName}</Text>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}>
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.loginHeaderButton}
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.8}>
                  <Text style={styles.loginHeaderButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
              )}
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
                <Text style={styles.titleMain}>Gestión Estratégica</Text>
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
                onPress={() => {
                  console.log('🔘 [HomeScreen] TouchableOpacity onPress ejecutado');
                  handleDenuncia();
                }}
                activeOpacity={0.7}>
                <View style={styles.denunciaButtonContent}>
                  <Text style={styles.denunciaIcon}>🚨</Text>
                  <Text style={styles.denunciaButtonText}>Realizar Denuncia</Text>
                </View>
              </TouchableOpacity>

              {/* Botón de Pánico Circular */}
              <View style={styles.panicContainer}>
                <Animated.View style={{transform: [{scale: scaleAnim}]}}>
                  <TouchableOpacity
                    style={[
                      styles.panicButton,
                      panicPressed && styles.panicButtonPressed,
                      !isAuthenticated && styles.panicButtonDisabled,
                    ]}
                    onPressIn={handlePanicPressIn}
                    onPressOut={handlePanicPressOut}
                    activeOpacity={0.8}
                    disabled={!isAuthenticated}>
                    <View style={styles.panicButtonInner}>
                      <Text style={styles.panicButtonIcon}>🚨</Text>
                      <Text style={styles.panicButtonText}>
                        {panicPressed
                          ? `Mantén presionado... ${Math.round(panicProgress)}%`
                          : 'Botón de Pánico'}
                      </Text>
                      {panicPressed && (
                        <View style={styles.progressBarContainer}>
                          <View
                            style={[
                              styles.progressBar,
                              {width: `${panicProgress}%`},
                            ]}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
                {!isAuthenticated && (
                  <Text style={styles.panicWarningText}>
                    Inicia sesión para usar el botón de pánico
                  </Text>
                )}
              </View>

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
        </>
      )}

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
                  setCedula('');
                  setContraseña('');
                  setNombre('');
                  setTelefono('');
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
                  setTelefono('');
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
                  setCedula('');
                  setContraseña('');
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
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre Completo</Text>
                  <TextInput
                    style={styles.input}
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Ingresa tu nombre completo"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cédula</Text>
                <TextInput
                  style={styles.input}
                  value={cedula}
                  onChangeText={setCedula}
                  placeholder="Ej: V-12345678"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                />
              </View>

              {!isLogin && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Número de Teléfono</Text>
                  <TextInput
                    style={styles.input}
                    value={telefono}
                    onChangeText={setTelefono}
                    placeholder="Ej: 0412-1234567"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  value={contraseña}
                  onChangeText={setContraseña}
                  placeholder={isLogin ? 'Ingresa tu contraseña' : 'Mínimo 6 caracteres'}
                  placeholderTextColor="#999"
                  secureTextEntry
                />
          </View>

          <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={isLogin ? handleLogin : handleRegister}
                disabled={loading}
            activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                  </Text>
                )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(10, 10, 10, 0.9)', // Semi-transparente para ver el fondo
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    zIndex: 10, // Asegurar que esté sobre el fondo
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
    zIndex: 1, // Asegurar que el contenido esté sobre el fondo
  },
  escudoContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  escudoImage: {
    width: 200,
    height: 200,
    maxWidth: 250,
    maxHeight: 250,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparente para ver el fondo
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
    backgroundColor: 'rgba(26, 26, 26, 0.85)', // Semi-transparente para ver el fondo
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  userNameText: {
    color: '#D4AF37',
    fontSize: 12,
    marginBottom: 4,
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  logoutButtonText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontWeight: '500',
  },
  panicContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  panicButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 4,
    borderColor: '#FF6B60',
  },
  panicButtonPressed: {
    backgroundColor: '#CC2E24',
    borderColor: '#FF3B30',
  },
  panicButtonDisabled: {
    backgroundColor: '#666',
    borderColor: '#888',
    opacity: 0.5,
  },
  panicButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  panicButtonIcon: {
    fontSize: 64,
    marginBottom: 10,
  },
  panicButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBarContainer: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  panicWarningText: {
    color: '#FF6B60',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
