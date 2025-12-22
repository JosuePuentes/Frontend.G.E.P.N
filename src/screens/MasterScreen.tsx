import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Modal,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {
  loginMaster,
  isMasterAuthenticated,
  getMasterUser,
  logoutMaster,
  crearUsuarioMaster,
  listarUsuariosMaster,
  actualizarPermisosMaster,
  obtenerModulos,
} from '../services/apiService';

// Importar imagen de fondo
const backgroundImageStatic = require('../assets/images/Gemini_Generated_Image_5keo7m5keo7m5keo.png');

// Módulos disponibles del sistema
const MODULOS = [
  {id: 'rrhh', nombre: 'RRHH - Recursos Humanos', descripcion: 'Gestionar oficiales y personal'},
  {id: 'policial', nombre: 'Módulo Policial', descripcion: 'Acceso al sistema policial'},
  {id: 'denuncias', nombre: 'Denuncias', descripcion: 'Gestionar denuncias ciudadanas'},
  {id: 'detenidos', nombre: 'Detenidos', descripcion: 'Registro de detenidos'},
  {id: 'minutas', nombre: 'Minutas Digitales', descripcion: 'Crear y gestionar minutas'},
  {id: 'buscados', nombre: 'Más Buscados', descripcion: 'Lista de más buscados'},
  {id: 'verificacion', nombre: 'Verificación de Cédulas', descripcion: 'Verificar cédulas'},
  {id: 'panico', nombre: 'Botón de Pánico', descripcion: 'Gestionar alertas de pánico'},
];

type MasterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Master'>;

interface Props {
  navigation: MasterScreenNavigationProp;
}

interface UsuarioMaster {
  id: string;
  usuario: string;
  nombre: string;
  email: string;
  activo: boolean;
  permisos: string[];
  fechaCreacion: string;
}

const MasterScreen: React.FC<Props> = ({navigation}) => {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterUser, setMasterUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(true);
  
  // Estados de login
  const [loginUsuario, setLoginUsuario] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Estados de gestión de usuarios
  const [usuarios, setUsuarios] = useState<UsuarioMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showPermisosModal, setShowPermisosModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioMaster | null>(null);

  // Formulario crear usuario
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([]);

  useEffect(() => {
    verificarAutenticacion();
  }, []);

  const verificarAutenticacion = async () => {
    const auth = await isMasterAuthenticated();
    if (auth) {
      const user = await getMasterUser();
      setMasterUser(user);
      setIsAuthenticated(true);
      setShowLogin(false);
      cargarUsuarios();
    } else {
      setIsAuthenticated(false);
      setShowLogin(true);
    }
  };

  const handleLogin = async () => {
    if (!loginUsuario.trim() || !loginPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoginLoading(true);
    try {
      const result = await loginMaster(loginUsuario.trim(), loginPassword);
      if (result.success && result.master) {
        setMasterUser(result.master);
        setIsAuthenticated(true);
        setShowLogin(false);
        setLoginUsuario('');
        setLoginPassword('');
        cargarUsuarios();
        Alert.alert('Éxito', 'Sesión iniciada correctamente');
      } else {
        Alert.alert('Error', result.error || 'Usuario o contraseña incorrectos');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutMaster();
    setIsAuthenticated(false);
    setMasterUser(null);
    setShowLogin(true);
    setUsuarios([]);
    Alert.alert('Éxito', 'Sesión cerrada correctamente');
  };

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const result = await listarUsuariosMaster();
      if (result.success) {
        setUsuarios(result.data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearUsuario = async () => {
    if (!nuevoUsuario.trim() || !nuevoNombre.trim() || !nuevoEmail.trim() || !nuevoPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (nuevoPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const result = await crearUsuarioMaster({
        usuario: nuevoUsuario.trim(),
        nombre: nuevoNombre.trim(),
        email: nuevoEmail.trim(),
        contraseña: nuevoPassword,
        permisos: permisosSeleccionados,
      });

      if (result.success) {
        Alert.alert('Éxito', 'Usuario master creado correctamente');
        setShowCrearModal(false);
        setNuevoUsuario('');
        setNuevoNombre('');
        setNuevoEmail('');
        setNuevoPassword('');
        setPermisosSeleccionados([]);
        cargarUsuarios();
      } else {
        Alert.alert('Error', result.message || 'No se pudo crear el usuario');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermiso = (moduloId: string) => {
    if (permisosSeleccionados.includes(moduloId)) {
      setPermisosSeleccionados(permisosSeleccionados.filter(p => p !== moduloId));
    } else {
      setPermisosSeleccionados([...permisosSeleccionados, moduloId]);
    }
  };

  const handleActualizarPermisos = async () => {
    if (!usuarioSeleccionado) return;

    setLoading(true);
    try {
      const result = await actualizarPermisosMaster(usuarioSeleccionado.id, permisosSeleccionados);
      if (result.success) {
        Alert.alert('Éxito', 'Permisos actualizados correctamente');
        setShowPermisosModal(false);
        setUsuarioSeleccionado(null);
        setPermisosSeleccionados([]);
        cargarUsuarios();
      } else {
        Alert.alert('Error', result.message || 'No se pudieron actualizar los permisos');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar permisos');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalPermisos = (usuario: UsuarioMaster) => {
    setUsuarioSeleccionado(usuario);
    setPermisosSeleccionados([...usuario.permisos]);
    setShowPermisosModal(true);
  };

  const toggleActivo = async (usuario: UsuarioMaster) => {
    try {
      // Aquí llamarías a la API para activar/desactivar
      Alert.alert('Info', 'Funcionalidad de activar/desactivar pendiente de implementar en backend');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado');
    }
  };

  // Si no está autenticado, mostrar login
  if (showLogin || !isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={backgroundImageStatic}
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.overlay} />

          <View style={styles.loginContainer}>
            <View style={styles.loginCard}>
              <Text style={styles.loginTitle}>Acceso Master</Text>
              <Text style={styles.loginSubtitle}>
                Sistema de Gestión de Usuarios y Permisos
              </Text>

              <View style={styles.loginForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Usuario</Text>
                  <TextInput
                    style={styles.input}
                    value={loginUsuario}
                    onChangeText={setLoginUsuario}
                    placeholder="Ingresa tu usuario"
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contraseña</Text>
                  <TextInput
                    style={styles.input}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor="#666"
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, loginLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={loginLoading}>
                  {loginLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  // Si está autenticado, mostrar panel de gestión
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
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.title}>Panel Master</Text>
                <Text style={styles.subtitle}>Gestión de Usuarios y Permisos</Text>
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
            {masterUser && (
              <View style={styles.userInfo}>
                <Text style={styles.userInfoText}>
                  Conectado como: <Text style={styles.userInfoBold}>{masterUser.nombre}</Text>
                </Text>
                <Text style={styles.userInfoText}>
                  Usuario: <Text style={styles.userInfoBold}>@{masterUser.usuario}</Text>
                </Text>
                <Text style={styles.userInfoText}>
                  Email: <Text style={styles.userInfoBold}>{masterUser.email}</Text>
                </Text>
                <View style={styles.permisosSection}>
                  <Text style={styles.permisosLabel}>Módulos con Acceso:</Text>
                  <View style={styles.permisosTags}>
                    {masterUser.permisos && masterUser.permisos.length > 0 ? (
                      masterUser.permisos.map((permiso: string) => {
                        const modulo = MODULOS.find(m => m.id === permiso);
                        return (
                          <View key={permiso} style={styles.permisoTag}>
                            <Text style={styles.permisoTagText}>
                              {modulo?.nombre || permiso}
                            </Text>
                          </View>
                        );
                      })
                    ) : (
                      <Text style={styles.sinPermisos}>Sin módulos asignados</Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.crearButton}
            onPress={() => setShowCrearModal(true)}>
            <Text style={styles.crearButtonText}>+ Crear Usuario Master</Text>
          </TouchableOpacity>

          {loading && usuarios.length === 0 ? (
            <ActivityIndicator size="large" color="#D4AF37" style={styles.loader} />
          ) : (
            <View style={styles.usuariosList}>
              {usuarios.map(usuario => (
                <View key={usuario.id} style={styles.usuarioCard}>
                  <View style={styles.usuarioHeader}>
                    <View style={styles.usuarioInfo}>
                      <Text style={styles.usuarioNombre}>{usuario.nombre}</Text>
                      <Text style={styles.usuarioUsuario}>@{usuario.usuario}</Text>
                      <Text style={styles.usuarioEmail}>{usuario.email}</Text>
                    </View>
                    <View style={styles.usuarioStatus}>
                      <View
                        style={[
                          styles.statusBadge,
                          usuario.activo ? styles.statusActivo : styles.statusInactivo,
                        ]}>
                        <Text style={styles.statusText}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.permisosPreview}>
                    <Text style={styles.permisosLabel}>Permisos:</Text>
                    <View style={styles.permisosTags}>
                      {usuario.permisos.length > 0 ? (
                        usuario.permisos.map(permiso => {
                          const modulo = MODULOS.find(m => m.id === permiso);
                          return (
                            <View key={permiso} style={styles.permisoTag}>
                              <Text style={styles.permisoTagText}>
                                {modulo?.nombre || permiso}
                              </Text>
                            </View>
                          );
                        })
                      ) : (
                        <Text style={styles.sinPermisos}>Sin permisos asignados</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.usuarioActions}>
                    <TouchableOpacity
                      style={styles.permisosButton}
                      onPress={() => abrirModalPermisos(usuario)}>
                      <Text style={styles.permisosButtonText}>Gestionar Permisos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.activoButton,
                        usuario.activo ? styles.activoButtonInactivo : styles.activoButtonActivo,
                      ]}
                      onPress={() => toggleActivo(usuario)}>
                      <Text style={styles.activoButtonText}>
                        {usuario.activo ? 'Desactivar' : 'Activar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Modal Crear Usuario */}
        <Modal
          visible={showCrearModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCrearModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Usuario Master</Text>

              <TextInput
                style={styles.modalInput}
                value={nuevoUsuario}
                onChangeText={setNuevoUsuario}
                placeholder="Nombre de usuario"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.modalInput}
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
                placeholder="Nombre completo"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.modalInput}
                value={nuevoEmail}
                onChangeText={setNuevoEmail}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.modalInput}
                value={nuevoPassword}
                onChangeText={setNuevoPassword}
                placeholder="Contraseña (mínimo 6 caracteres)"
                placeholderTextColor="#999"
                secureTextEntry
              />

              <Text style={styles.modalSectionTitle}>Seleccionar Permisos</Text>
              <Text style={styles.modalSectionSubtitle}>
                Selecciona los módulos a los que tendrá acceso este usuario
              </Text>
              <ScrollView style={styles.modulosList} nestedScrollEnabled>
                {MODULOS.map(modulo => {
                  const isSelected = permisosSeleccionados.includes(modulo.id);
                  return (
                    <TouchableOpacity
                      key={modulo.id}
                      style={[
                        styles.moduloItem,
                        isSelected && styles.moduloItemSelected,
                      ]}
                      onPress={() => handleTogglePermiso(modulo.id)}>
                      <View style={styles.moduloCheckbox}>
                        <View
                          style={[
                            styles.checkboxCircle,
                            isSelected && styles.checkboxCircleSelected,
                          ]}>
                          {isSelected && <Text style={styles.checkMark}>✓</Text>}
                        </View>
                      </View>
                      <View style={styles.moduloInfo}>
                        <Text style={[styles.moduloNombre, isSelected && styles.moduloNombreSelected]}>
                          {modulo.nombre}
                        </Text>
                        <Text style={[styles.moduloDescripcion, isSelected && styles.moduloDescripcionSelected]}>
                          {modulo.descripcion}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {permisosSeleccionados.length > 0 && (
                <View style={styles.selectedCount}>
                  <Text style={styles.selectedCountText}>
                    {permisosSeleccionados.length} módulo{permisosSeleccionados.length !== 1 ? 's' : ''} seleccionado{permisosSeleccionados.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowCrearModal(false);
                    setNuevoUsuario('');
                    setNuevoNombre('');
                    setNuevoEmail('');
                    setNuevoPassword('');
                    setPermisosSeleccionados([]);
                  }}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleCrearUsuario}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.modalSaveText}>Crear</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal Gestionar Permisos */}
        <Modal
          visible={showPermisosModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPermisosModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Gestionar Permisos - {usuarioSeleccionado?.nombre}
              </Text>

              <ScrollView style={styles.modulosList} nestedScrollEnabled>
                {MODULOS.map(modulo => {
                  const isSelected = permisosSeleccionados.includes(modulo.id);
                  return (
                    <TouchableOpacity
                      key={modulo.id}
                      style={[
                        styles.moduloItem,
                        isSelected && styles.moduloItemSelected,
                      ]}
                      onPress={() => handleTogglePermiso(modulo.id)}>
                      <View style={styles.moduloCheckbox}>
                        <View
                          style={[
                            styles.checkboxCircle,
                            isSelected && styles.checkboxCircleSelected,
                          ]}>
                          {isSelected && <Text style={styles.checkMark}>✓</Text>}
                        </View>
                      </View>
                      <View style={styles.moduloInfo}>
                        <Text style={[styles.moduloNombre, isSelected && styles.moduloNombreSelected]}>
                          {modulo.nombre}
                        </Text>
                        <Text style={[styles.moduloDescripcion, isSelected && styles.moduloDescripcionSelected]}>
                          {modulo.descripcion}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {permisosSeleccionados.length > 0 && (
                <View style={styles.selectedCount}>
                  <Text style={styles.selectedCountText}>
                    {permisosSeleccionados.length} módulo{permisosSeleccionados.length !== 1 ? 's' : ''} seleccionado{permisosSeleccionados.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowPermisosModal(false);
                    setUsuarioSeleccionado(null);
                    setPermisosSeleccionados([]);
                  }}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleActualizarPermisos}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.modalSaveText}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
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
    fontSize: 18,
    color: '#D4AF37',
    fontWeight: '600',
  },
  userInfo: {
    backgroundColor: 'rgba(0, 36, 125, 0.3)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0033A0',
    marginTop: 10,
  },
  userInfoText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 5,
  },
  userInfoBold: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  logoutButtonText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '600',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginCard: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
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
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginForm: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#00247D',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#0033A0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  crearButton: {
    backgroundColor: '#00247D',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#0033A0',
  },
  crearButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  usuariosList: {
    gap: 15,
  },
  usuarioCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  usuarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  usuarioUsuario: {
    fontSize: 16,
    color: '#D4AF37',
    marginBottom: 5,
  },
  usuarioEmail: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  usuarioStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusActivo: {
    backgroundColor: '#28a745',
  },
  statusInactivo: {
    backgroundColor: '#dc3545',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  permisosPreview: {
    marginBottom: 15,
  },
  permisosLabel: {
    fontSize: 14,
    color: '#D4AF37',
    marginBottom: 8,
    fontWeight: '600',
  },
  permisosTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permisoTag: {
    backgroundColor: '#00247D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0033A0',
  },
  permisoTagText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  sinPermisos: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
  usuarioActions: {
    flexDirection: 'row',
    gap: 10,
  },
  permisosButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  permisosButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  activoButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activoButtonActivo: {
    backgroundColor: '#28a745',
  },
  activoButtonInactivo: {
    backgroundColor: '#dc3545',
  },
  activoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    padding: 25,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#000000',
    marginBottom: 15,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 15,
  },
  modulosList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  moduloItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    minHeight: 70,
  },
  moduloItemSelected: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
  },
  moduloCheckbox: {
    marginRight: 15,
  },
  checkboxCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D4AF37',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCircleSelected: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  moduloInfo: {
    flex: 1,
  },
  moduloNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  moduloNombreSelected: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  moduloDescripcion: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 18,
  },
  moduloDescripcionSelected: {
    color: '#FFFFFF',
  },
  checkMark: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  selectedCount: {
    marginTop: 15,
    padding: 12,
    backgroundColor: 'rgba(0, 36, 125, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0033A0',
  },
  selectedCountText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalSectionSubtitle: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 15,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  modalCancelText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#00247D',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0033A0',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MasterScreen;

