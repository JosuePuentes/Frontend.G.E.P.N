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
import {estadosVenezuela} from '../data/venezuelaData';
import {
  crearCentroCoordinacion,
  listarCentrosCoordinacion,
  crearEstacionPolicial,
  listarEstacionesPolicial,
  crearParte,
  listarPartes,
  buscarFuncionarios,
  asignarFuncionarioAParte,
} from '../services/apiService';

// Importar imagen de fondo
const backgroundImageStatic = require('../assets/images/Gemini_Generated_Image_5keo7m5keo7m5keo.png');

type CentroCoordinacionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CentroCoordinacion'
>;

interface Props {
  navigation: CentroCoordinacionScreenNavigationProp;
}

interface CentroCoordinacion {
  id: string;
  estado: string;
  nombre: string;
  fechaCreacion: string;
}

interface EstacionPolicial {
  id: string;
  centroCoordinacionId: string;
  nombre: string;
  direccion: string;
  telefono: string;
  fechaCreacion: string;
}

interface Parte {
  id: string;
  estacionPolicialId: string;
  numero: string;
  fecha: string;
  funcionarios: FuncionarioAsignado[];
}

interface FuncionarioAsignado {
  id: string;
  credencial: string;
  nombre: string;
  apellidos: string;
  edad: number;
  rango: string;
}

interface Funcionario {
  id: string;
  credencial: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  rango: string;
}

const CentroCoordinacionScreen: React.FC<Props> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'centros' | 'estaciones' | 'partes'>('centros');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>('');
  const [centroSeleccionado, setCentroSeleccionado] = useState<CentroCoordinacion | null>(null);
  const [estacionSeleccionada, setEstacionSeleccionada] = useState<EstacionPolicial | null>(null);

  // Estados para listas
  const [centros, setCentros] = useState<CentroCoordinacion[]>([]);
  const [estaciones, setEstaciones] = useState<EstacionPolicial[]>([]);
  const [partes, setPartes] = useState<Parte[]>([]);

  // Estados para modales
  const [showCrearCentroModal, setShowCrearCentroModal] = useState(false);
  const [showCrearEstacionModal, setShowCrearEstacionModal] = useState(false);
  const [showCrearParteModal, setShowCrearParteModal] = useState(false);
  const [showAsignarFuncionarioModal, setShowAsignarFuncionarioModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [parteIdParaAsignar, setParteIdParaAsignar] = useState<string>('');

  // Formularios
  const [nuevoCentroEstado, setNuevoCentroEstado] = useState('');
  const [nuevoCentroNombre, setNuevoCentroNombre] = useState('');
  const [nuevaEstacionNombre, setNuevaEstacionNombre] = useState('');
  const [nuevaEstacionDireccion, setNuevaEstacionDireccion] = useState('');
  const [nuevaEstacionTelefono, setNuevaEstacionTelefono] = useState('');
  const [nuevoParteNumero, setNuevoParteNumero] = useState('');

  // Búsqueda de funcionarios
  const [busquedaFuncionario, setBusquedaFuncionario] = useState('');
  const [funcionariosEncontrados, setFuncionariosEncontrados] = useState<Funcionario[]>([]);
  const [buscandoFuncionarios, setBuscandoFuncionarios] = useState(false);

  useEffect(() => {
    cargarCentros();
  }, []);

  useEffect(() => {
    if (centroSeleccionado) {
      cargarEstaciones(centroSeleccionado.id);
    }
  }, [centroSeleccionado]);

  useEffect(() => {
    if (estacionSeleccionada) {
      cargarPartes(estacionSeleccionada.id);
    }
  }, [estacionSeleccionada]);

  const cargarCentros = async () => {
    setLoading(true);
    try {
      const result = await listarCentrosCoordinacion();
      if (result.success) {
        setCentros(result.data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los centros de coordinación');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstaciones = async (centroId: string) => {
    setLoading(true);
    try {
      const result = await listarEstacionesPolicial(centroId);
      if (result.success) {
        setEstaciones(result.data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las estaciones');
    } finally {
      setLoading(false);
    }
  };

  const cargarPartes = async (estacionId: string) => {
    setLoading(true);
    try {
      const result = await listarPartes(estacionId);
      if (result.success) {
        setPartes(result.data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los partes');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCentro = async () => {
    if (!nuevoCentroEstado || !nuevoCentroNombre.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const result = await crearCentroCoordinacion({
        estado: nuevoCentroEstado,
        nombre: nuevoCentroNombre.trim(),
      });

      if (result.success) {
        Alert.alert('Éxito', 'Centro de coordinación creado correctamente');
        setShowCrearCentroModal(false);
        setNuevoCentroEstado('');
        setNuevoCentroNombre('');
        cargarCentros();
      } else {
        Alert.alert('Error', result.message || 'No se pudo crear el centro');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear el centro');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearEstacion = async () => {
    if (!centroSeleccionado || !nuevaEstacionNombre.trim() || !nuevaEstacionDireccion.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const result = await crearEstacionPolicial({
        centroCoordinacionId: centroSeleccionado.id,
        nombre: nuevaEstacionNombre.trim(),
        direccion: nuevaEstacionDireccion.trim(),
        telefono: nuevaEstacionTelefono.trim() || '',
      });

      if (result.success) {
        Alert.alert('Éxito', 'Estación policial creada correctamente');
        setShowCrearEstacionModal(false);
        setNuevaEstacionNombre('');
        setNuevaEstacionDireccion('');
        setNuevaEstacionTelefono('');
        cargarEstaciones(centroSeleccionado.id);
      } else {
        Alert.alert('Error', result.message || 'No se pudo crear la estación');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear la estación');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearParte = async () => {
    if (!estacionSeleccionada || !nuevoParteNumero.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const result = await crearParte({
        estacionPolicialId: estacionSeleccionada.id,
        numero: nuevoParteNumero.trim(),
      });

      if (result.success) {
        Alert.alert('Éxito', 'Parte creado correctamente');
        setShowCrearParteModal(false);
        setNuevoParteNumero('');
        cargarPartes(estacionSeleccionada.id);
      } else {
        Alert.alert('Error', result.message || 'No se pudo crear el parte');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear el parte');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarFuncionarios = async () => {
    if (!busquedaFuncionario.trim()) {
      Alert.alert('Error', 'Ingresa una credencial o nombre para buscar');
      return;
    }

    setBuscandoFuncionarios(true);
    try {
      const result = await buscarFuncionarios(busquedaFuncionario.trim());
      if (result.success) {
        setFuncionariosEncontrados(result.data || []);
      } else {
        Alert.alert('Error', result.message || 'No se encontraron funcionarios');
        setFuncionariosEncontrados([]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al buscar funcionarios');
      setFuncionariosEncontrados([]);
    } finally {
      setBuscandoFuncionarios(false);
    }
  };

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleAsignarFuncionario = async (funcionario: Funcionario, parteId: string) => {
    setLoading(true);
    try {
      const result = await asignarFuncionarioAParte({
        parteId,
        funcionarioId: funcionario.id,
      });

      if (result.success) {
        Alert.alert('Éxito', 'Funcionario asignado correctamente');
        setShowAsignarFuncionarioModal(false);
        setBusquedaFuncionario('');
        setFuncionariosEncontrados([]);
        cargarPartes(estacionSeleccionada!.id);
      } else {
        Alert.alert('Error', result.message || 'No se pudo asignar el funcionario');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al asignar el funcionario');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarCentro = (centro: CentroCoordinacion) => {
    setCentroSeleccionado(centro);
    setViewMode('estaciones');
    setEstacionSeleccionada(null);
  };

  const seleccionarEstacion = (estacion: EstacionPolicial) => {
    setEstacionSeleccionada(estacion);
    setViewMode('partes');
  };

  const volverAEstaciones = () => {
    setViewMode('estaciones');
    setEstacionSeleccionada(null);
    setPartes([]);
  };

  const volverACentros = () => {
    setViewMode('centros');
    setCentroSeleccionado(null);
    setEstacionSeleccionada(null);
    setEstaciones([]);
    setPartes([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundImageStatic}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.overlay} />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (viewMode === 'partes') {
                volverAEstaciones();
              } else if (viewMode === 'estaciones') {
                volverACentros();
              } else {
                navigation.goBack();
              }
            }}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {viewMode === 'centros'
              ? 'Centros de Coordinación'
              : viewMode === 'estaciones'
              ? `Estaciones - ${centroSeleccionado?.nombre}`
              : `Partes - ${estacionSeleccionada?.nombre}`}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          {viewMode === 'centros' && (
            <>
              <TouchableOpacity
                style={styles.crearButton}
                onPress={() => setShowCrearCentroModal(true)}>
                <Text style={styles.crearButtonText}>+ Crear Centro de Coordinación</Text>
              </TouchableOpacity>

              {loading && centros.length === 0 ? (
                <ActivityIndicator size="large" color="#D4AF37" style={styles.loader} />
              ) : (
                <View style={styles.listContainer}>
                  {centros.map(centro => (
                    <TouchableOpacity
                      key={centro.id}
                      style={styles.itemCard}
                      onPress={() => seleccionarCentro(centro)}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{centro.nombre}</Text>
                        <Text style={styles.itemSubtitle}>
                          {estadosVenezuela.find(e => e.id === centro.estado)?.nombre || centro.estado}
                        </Text>
                      </View>
                      <Text style={styles.itemArrow}>→</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          {viewMode === 'estaciones' && centroSeleccionado && (
            <>
              <TouchableOpacity
                style={styles.crearButton}
                onPress={() => setShowCrearEstacionModal(true)}>
                <Text style={styles.crearButtonText}>+ Crear Estación Policial</Text>
              </TouchableOpacity>

              {loading && estaciones.length === 0 ? (
                <ActivityIndicator size="large" color="#D4AF37" style={styles.loader} />
              ) : (
                <View style={styles.listContainer}>
                  {estaciones.map(estacion => (
                    <TouchableOpacity
                      key={estacion.id}
                      style={styles.itemCard}
                      onPress={() => seleccionarEstacion(estacion)}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{estacion.nombre}</Text>
                        <Text style={styles.itemSubtitle}>{estacion.direccion}</Text>
                        {estacion.telefono && (
                          <Text style={styles.itemSubtitle}>Tel: {estacion.telefono}</Text>
                        )}
                      </View>
                      <Text style={styles.itemArrow}>→</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          {viewMode === 'partes' && estacionSeleccionada && (
            <>
              <TouchableOpacity
                style={styles.crearButton}
                onPress={() => setShowCrearParteModal(true)}>
                <Text style={styles.crearButtonText}>+ Crear Parte</Text>
              </TouchableOpacity>

              {loading && partes.length === 0 ? (
                <ActivityIndicator size="large" color="#D4AF37" style={styles.loader} />
              ) : (
                <View style={styles.listContainer}>
                  {partes.map(parte => (
                    <View key={parte.id} style={styles.parteCard}>
                      <View style={styles.parteHeader}>
                        <Text style={styles.parteNumero}>Parte #{parte.numero}</Text>
                        <Text style={styles.parteFecha}>
                          {new Date(parte.fecha).toLocaleDateString('es-VE')}
                        </Text>
                      </View>

                      <View style={styles.funcionariosList}>
                        <Text style={styles.funcionariosTitle}>
                          Funcionarios Asignados ({parte.funcionarios.length})
                        </Text>
                        {parte.funcionarios.length > 0 ? (
                          parte.funcionarios.map((func, index) => (
                            <View key={index} style={styles.funcionarioItem}>
                              <Text style={styles.funcionarioText}>
                                {func.nombre} {func.apellidos}
                              </Text>
                              <Text style={styles.funcionarioSubtext}>
                                Credencial: {func.credencial} | Edad: {func.edad} | {func.rango}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.sinFuncionarios}>Sin funcionarios asignados</Text>
                        )}
                      </View>

                      <TouchableOpacity
                        style={styles.asignarButton}
                        onPress={() => {
                          setParteIdParaAsignar(parte.id);
                          setShowAsignarFuncionarioModal(true);
                        }}>
                        <Text style={styles.asignarButtonText}>+ Asignar Funcionario</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Modal Crear Centro */}
        <Modal
          visible={showCrearCentroModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCrearCentroModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Centro de Coordinación</Text>

              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowEstadoModal(true)}>
                <Text
                  style={[
                    styles.selectButtonText,
                    !nuevoCentroEstado && styles.selectButtonPlaceholder,
                  ]}>
                  {nuevoCentroEstado
                    ? estadosVenezuela.find(e => e.id === nuevoCentroEstado)?.nombre
                    : 'Selecciona un estado'}
                </Text>
                <Text style={styles.selectArrow}>▼</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.modalInput}
                value={nuevoCentroNombre}
                onChangeText={setNuevoCentroNombre}
                placeholder="Nombre del centro de coordinación"
                placeholderTextColor="#999"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowCrearCentroModal(false);
                    setNuevoCentroEstado('');
                    setNuevoCentroNombre('');
                  }}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleCrearCentro}
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

        {/* Modal Seleccionar Estado */}
        <Modal
          visible={showEstadoModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEstadoModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Estado</Text>
                <TouchableOpacity onPress={() => setShowEstadoModal(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList}>
                {estadosVenezuela.map(estado => (
                  <TouchableOpacity
                    key={estado.id}
                    style={styles.modalItem}
                    onPress={() => {
                      setNuevoCentroEstado(estado.id);
                      setShowEstadoModal(false);
                    }}>
                    <Text style={styles.modalItemText}>{estado.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal Crear Estación */}
        <Modal
          visible={showCrearEstacionModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCrearEstacionModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Estación Policial</Text>

              <TextInput
                style={styles.modalInput}
                value={nuevaEstacionNombre}
                onChangeText={setNuevaEstacionNombre}
                placeholder="Nombre de la estación"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.modalInput}
                value={nuevaEstacionDireccion}
                onChangeText={setNuevaEstacionDireccion}
                placeholder="Dirección"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.modalInput}
                value={nuevaEstacionTelefono}
                onChangeText={setNuevaEstacionTelefono}
                placeholder="Teléfono (opcional)"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowCrearEstacionModal(false);
                    setNuevaEstacionNombre('');
                    setNuevaEstacionDireccion('');
                    setNuevaEstacionTelefono('');
                  }}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleCrearEstacion}
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

        {/* Modal Crear Parte */}
        <Modal
          visible={showCrearParteModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCrearParteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Parte</Text>

              <TextInput
                style={styles.modalInput}
                value={nuevoParteNumero}
                onChangeText={setNuevoParteNumero}
                placeholder="Número del parte"
                placeholderTextColor="#999"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowCrearParteModal(false);
                    setNuevoParteNumero('');
                  }}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleCrearParte}
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

        {/* Modal Asignar Funcionario */}
        <Modal
          visible={showAsignarFuncionarioModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAsignarFuncionarioModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Asignar Funcionario</Text>

              <View style={styles.busquedaContainer}>
                <TextInput
                  style={styles.busquedaInput}
                  value={busquedaFuncionario}
                  onChangeText={setBusquedaFuncionario}
                  placeholder="Buscar por credencial o nombre"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={styles.buscarButton}
                  onPress={handleBuscarFuncionarios}
                  disabled={buscandoFuncionarios}>
                  {buscandoFuncionarios ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buscarButtonText}>Buscar</Text>
                  )}
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.funcionariosListModal}>
                {funcionariosEncontrados.map(funcionario => {
                  const nombreCompleto = `${funcionario.primerNombre} ${funcionario.segundoNombre || ''} ${funcionario.primerApellido} ${funcionario.segundoApellido || ''}`.trim();
                  const edad = calcularEdad(funcionario.fechaNacimiento);
                  
                  return (
                    <TouchableOpacity
                      key={funcionario.id}
                      style={styles.funcionarioCard}
                      onPress={() => {
                        if (parteIdParaAsignar) {
                          handleAsignarFuncionario(funcionario, parteIdParaAsignar);
                        } else {
                          Alert.alert('Error', 'No se ha seleccionado un parte');
                        }
                      }}>
                      <Text style={styles.funcionarioCardNombre}>{nombreCompleto}</Text>
                      <Text style={styles.funcionarioCardInfo}>
                        Credencial: {funcionario.credencial} | Edad: {edad} años | {funcionario.rango}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowAsignarFuncionarioModal(false);
                  setBusquedaFuncionario('');
                  setFuncionariosEncontrados([]);
                }}>
                <Text style={styles.modalCancelText}>Cerrar</Text>
              </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
  },
  backButton: {
    paddingVertical: 5,
  },
  backButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
  listContainer: {
    gap: 15,
  },
  itemCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHeader: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  itemArrow: {
    fontSize: 24,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  parteCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 15,
  },
  parteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  parteNumero: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  parteFecha: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  funcionariosList: {
    marginBottom: 15,
  },
  funcionariosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37',
    marginBottom: 10,
  },
  funcionarioItem: {
    backgroundColor: 'rgba(0, 36, 125, 0.3)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#0033A0',
  },
  funcionarioText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  funcionarioSubtext: {
    fontSize: 13,
    color: '#CCCCCC',
  },
  sinFuncionarios: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  asignarButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  asignarButtonText: {
    color: '#000000',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalClose: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  selectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectButtonText: {
    color: '#000000',
    fontSize: 16,
    flex: 1,
  },
  selectButtonPlaceholder: {
    color: '#999',
  },
  selectArrow: {
    color: '#D4AF37',
    fontSize: 12,
    marginLeft: 10,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  modalItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
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
  busquedaContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  busquedaInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#000000',
  },
  buscarButton: {
    backgroundColor: '#00247D',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0033A0',
  },
  buscarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  funcionariosListModal: {
    maxHeight: 400,
    marginBottom: 20,
  },
  funcionarioCard: {
    backgroundColor: 'rgba(0, 36, 125, 0.3)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0033A0',
  },
  funcionarioCardNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  funcionarioCardInfo: {
    fontSize: 14,
    color: '#CCCCCC',
  },
});

export default CentroCoordinacionScreen;

