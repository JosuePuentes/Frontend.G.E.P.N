import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {
  estadosVenezuela,
  getMunicipiosByEstado,
  getParroquiasByMunicipio,
} from '../data/venezuelaData';
import {crearDenuncia} from '../services/apiService';

type DenunciaScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Denuncia'
>;

interface Props {
  navigation: DenunciaScreenNavigationProp;
}

const DenunciaScreen: React.FC<Props> = ({navigation}) => {
  // Datos del denunciante
  const [nombreDenunciante, setNombreDenunciante] = useState('');
  const [cedulaDenunciante, setCedulaDenunciante] = useState('');
  const [telefonoDenunciante, setTelefonoDenunciante] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [estadoDenunciante, setEstadoDenunciante] = useState('');
  const [municipioDenunciante, setMunicipioDenunciante] = useState('');
  const [parroquiaDenunciante, setParroquiaDenunciante] = useState('');

  // Datos de la denuncia
  const [motivo, setMotivo] = useState('');
  const [hechos, setHechos] = useState('');

  // Datos del denunciado
  const [nombreDenunciado, setNombreDenunciado] = useState('');
  const [tieneMasDetalles, setTieneMasDetalles] = useState(false);
  const [direccionDenunciado, setDireccionDenunciado] = useState('');
  const [estadoDenunciado, setEstadoDenunciado] = useState('');
  const [municipioDenunciado, setMunicipioDenunciado] = useState('');
  const [parroquiaDenunciado, setParroquiaDenunciado] = useState('');

  // Estados y municipios para el denunciante
  const municipiosDisponiblesDenunciante = estadoDenunciante
    ? getMunicipiosByEstado(estadoDenunciante)
    : [];
  const parroquiasDisponiblesDenunciante =
    estadoDenunciante && municipioDenunciante
      ? getParroquiasByMunicipio(estadoDenunciante, municipioDenunciante)
      : [];

  // Estados y municipios para el denunciado
  const municipiosDisponibles = estadoDenunciado
    ? getMunicipiosByEstado(estadoDenunciado)
    : [];
  const parroquiasDisponibles =
    estadoDenunciado && municipioDenunciado
      ? getParroquiasByMunicipio(estadoDenunciado, municipioDenunciado)
      : [];

  // Estados para modales de selección del denunciante
  const [showEstadoModalDenunciante, setShowEstadoModalDenunciante] = useState(false);
  const [showMunicipioModalDenunciante, setShowMunicipioModalDenunciante] = useState(false);
  const [showParroquiaModalDenunciante, setShowParroquiaModalDenunciante] = useState(false);

  // Estados para modales de selección del denunciado
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [showMunicipioModal, setShowMunicipioModal] = useState(false);
  const [showParroquiaModal, setShowParroquiaModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validación básica
    if (
      !nombreDenunciante.trim() ||
      !cedulaDenunciante.trim() ||
      !telefonoDenunciante.trim() ||
      !fechaNacimiento.trim() ||
      !estadoDenunciante ||
      !municipioDenunciante ||
      !parroquiaDenunciante.trim() ||
      !motivo.trim() ||
      !hechos.trim()
    ) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (tieneMasDetalles) {
      if (
        !direccionDenunciado.trim() ||
        !estadoDenunciado.trim() ||
        !municipioDenunciado.trim() ||
        !parroquiaDenunciado.trim()
      ) {
        Alert.alert(
          'Error',
          'Si agregas más detalles del denunciado, completa todos los campos',
        );
        return;
      }
    }

    // Preparar datos para enviar al backend
    const denunciaData = {
      denunciante: {
        nombre: nombreDenunciante,
        cedula: cedulaDenunciante,
        telefono: telefonoDenunciante,
        fechaNacimiento,
        estado: estadosVenezuela.find(e => e.id === estadoDenunciante)?.nombre || '',
        municipio: municipiosDisponiblesDenunciante.find(m => m.id === municipioDenunciante)?.nombre || '',
        parroquia: parroquiaDenunciante,
      },
      denuncia: {
        motivo,
        hechos,
      },
      denunciado: {
        nombre: nombreDenunciado || undefined,
        ...(tieneMasDetalles && {
          direccion: direccionDenunciado,
          estado: estadosVenezuela.find(e => e.id === estadoDenunciado)?.nombre || '',
          municipio: municipiosDisponibles.find(m => m.id === municipioDenunciado)?.nombre || '',
          parroquia: parroquiaDenunciado,
        }),
      },
    };

    setLoading(true);
    try {
      const resultado = await crearDenuncia(denunciaData);
      setLoading(false);
      
      if (resultado.success) {
        Alert.alert(
          'Éxito',
          resultado.message || 'Denuncia registrada correctamente. Se procesará en breve.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert(
          'Error',
          resultado.message || 'No se pudo registrar la denuncia. Por favor intenta nuevamente.',
        );
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert(
        'Error',
        error.message || 'Ocurrió un error al registrar la denuncia. Por favor intenta nuevamente.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Realizar Denuncia</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Datos del Denunciante */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Denunciante</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              style={styles.input}
              value={nombreDenunciante}
              onChangeText={setNombreDenunciante}
              placeholder="Ingresa tu nombre completo"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cédula *</Text>
            <TextInput
              style={styles.input}
              value={cedulaDenunciante}
              onChangeText={setCedulaDenunciante}
              placeholder="Ej: V-12345678"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Teléfono *</Text>
            <TextInput
              style={styles.input}
              value={telefonoDenunciante}
              onChangeText={setTelefonoDenunciante}
              placeholder="Ej: 0412-1234567"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de Nacimiento *</Text>
            <TextInput
              style={styles.input}
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowEstadoModalDenunciante(true)}>
              <Text
                style={[
                  styles.selectButtonText,
                  !estadoDenunciante && styles.selectButtonPlaceholder,
                ]}>
                {estadoDenunciante
                  ? estadosVenezuela.find(e => e.id === estadoDenunciante)
                      ?.nombre
                  : 'Selecciona un estado'}
              </Text>
              <Text style={styles.selectArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {estadoDenunciante && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Municipio *</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowMunicipioModalDenunciante(true)}>
                <Text
                  style={[
                    styles.selectButtonText,
                    !municipioDenunciante && styles.selectButtonPlaceholder,
                  ]}>
                  {municipioDenunciante
                    ? municipiosDisponiblesDenunciante.find(
                        m => m.id === municipioDenunciante,
                      )?.nombre
                    : 'Selecciona un municipio'}
                </Text>
                <Text style={styles.selectArrow}>▼</Text>
              </TouchableOpacity>
            </View>
          )}

          {municipioDenunciante && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Parroquia *</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowParroquiaModalDenunciante(true)}>
                <Text
                  style={[
                    styles.selectButtonText,
                    !parroquiaDenunciante && styles.selectButtonPlaceholder,
                  ]}>
                  {parroquiaDenunciante || 'Selecciona una parroquia'}
                </Text>
                <Text style={styles.selectArrow}>▼</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Modales de Selección del Denunciante */}
        <Modal
          visible={showEstadoModalDenunciante}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEstadoModalDenunciante(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Estado</Text>
                <TouchableOpacity
                  onPress={() => setShowEstadoModalDenunciante(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList}>
                {estadosVenezuela.map(estado => (
                  <TouchableOpacity
                    key={estado.id}
                    style={styles.modalItem}
                    onPress={() => {
                      setEstadoDenunciante(estado.id);
                      setMunicipioDenunciante('');
                      setParroquiaDenunciante('');
                      setShowEstadoModalDenunciante(false);
                    }}>
                    <Text style={styles.modalItemText}>{estado.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showMunicipioModalDenunciante}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMunicipioModalDenunciante(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Municipio</Text>
                <TouchableOpacity
                  onPress={() => setShowMunicipioModalDenunciante(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList}>
                {municipiosDisponiblesDenunciante.map(municipio => (
                  <TouchableOpacity
                    key={municipio.id}
                    style={styles.modalItem}
                    onPress={() => {
                      setMunicipioDenunciante(municipio.id);
                      setParroquiaDenunciante('');
                      setShowMunicipioModalDenunciante(false);
                    }}>
                    <Text style={styles.modalItemText}>{municipio.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showParroquiaModalDenunciante}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowParroquiaModalDenunciante(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Parroquia</Text>
                <TouchableOpacity
                  onPress={() => setShowParroquiaModalDenunciante(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList}>
                {parroquiasDisponiblesDenunciante.map((parroquia, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalItem}
                    onPress={() => {
                      setParroquiaDenunciante(parroquia);
                      setShowParroquiaModalDenunciante(false);
                    }}>
                    <Text style={styles.modalItemText}>{parroquia}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Datos de la Denuncia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de la Denuncia</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Motivo *</Text>
            <TextInput
              style={styles.input}
              value={motivo}
              onChangeText={setMotivo}
              placeholder="Ej: Robo, Agresión, etc."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Relato de los Hechos *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={hechos}
              onChangeText={setHechos}
              placeholder="Describe detalladamente los hechos ocurridos..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Datos del Denunciado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Denunciado</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Denunciado</Text>
            <TextInput
              style={styles.input}
              value={nombreDenunciado}
              onChangeText={setNombreDenunciado}
              placeholder="Nombre completo (si lo conoces)"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setTieneMasDetalles(!tieneMasDetalles)}>
              <View
                style={[
                  styles.checkboxBox,
                  tieneMasDetalles && styles.checkboxBoxChecked,
                ]}>
                {tieneMasDetalles && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                Agregar más detalles del denunciado
              </Text>
            </TouchableOpacity>
          </View>

          {tieneMasDetalles && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={styles.input}
                  value={direccionDenunciado}
                  onChangeText={setDireccionDenunciado}
                  placeholder="Dirección completa"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Estado</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowEstadoModal(true)}>
                  <Text
                    style={[
                      styles.selectButtonText,
                      !estadoDenunciado && styles.selectButtonPlaceholder,
                    ]}>
                    {estadoDenunciado
                      ? estadosVenezuela.find(e => e.id === estadoDenunciado)
                          ?.nombre
                      : 'Selecciona un estado'}
                  </Text>
                  <Text style={styles.selectArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {estadoDenunciado && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Municipio</Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => setShowMunicipioModal(true)}>
                    <Text
                      style={[
                        styles.selectButtonText,
                        !municipioDenunciado && styles.selectButtonPlaceholder,
                      ]}>
                      {municipioDenunciado
                        ? municipiosDisponibles.find(
                            m => m.id === municipioDenunciado,
                          )?.nombre
                        : 'Selecciona un municipio'}
                    </Text>
                    <Text style={styles.selectArrow}>▼</Text>
                  </TouchableOpacity>
                </View>
              )}

              {municipioDenunciado && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Parroquia</Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => setShowParroquiaModal(true)}>
                    <Text
                      style={[
                        styles.selectButtonText,
                        !parroquiaDenunciado && styles.selectButtonPlaceholder,
                      ]}>
                      {parroquiaDenunciado || 'Selecciona una parroquia'}
                    </Text>
                    <Text style={styles.selectArrow}>▼</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Modal de Selección de Estado */}
              <Modal
                visible={showEstadoModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowEstadoModal(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Seleccionar Estado</Text>
                      <TouchableOpacity
                        onPress={() => setShowEstadoModal(false)}>
                        <Text style={styles.modalClose}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalList}>
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setEstadoDenunciado('');
                          setMunicipioDenunciado('');
                          setParroquiaDenunciado('');
                          setShowEstadoModal(false);
                        }}>
                        <Text style={styles.modalItemText}>Ninguno</Text>
                      </TouchableOpacity>
                      {estadosVenezuela.map(estado => (
                        <TouchableOpacity
                          key={estado.id}
                          style={styles.modalItem}
                          onPress={() => {
                            setEstadoDenunciado(estado.id);
                            setMunicipioDenunciado('');
                            setParroquiaDenunciado('');
                            setShowEstadoModal(false);
                          }}>
                          <Text style={styles.modalItemText}>
                            {estado.nombre}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>

              {/* Modal de Selección de Municipio */}
              <Modal
                visible={showMunicipioModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowMunicipioModal(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                        Seleccionar Municipio
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowMunicipioModal(false)}>
                        <Text style={styles.modalClose}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalList}>
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setMunicipioDenunciado('');
                          setParroquiaDenunciado('');
                          setShowMunicipioModal(false);
                        }}>
                        <Text style={styles.modalItemText}>Ninguno</Text>
                      </TouchableOpacity>
                      {municipiosDisponibles.map(municipio => (
                        <TouchableOpacity
                          key={municipio.id}
                          style={styles.modalItem}
                          onPress={() => {
                            setMunicipioDenunciado(municipio.id);
                            setParroquiaDenunciado('');
                            setShowMunicipioModal(false);
                          }}>
                          <Text style={styles.modalItemText}>
                            {municipio.nombre}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>

              {/* Modal de Selección de Parroquia */}
              <Modal
                visible={showParroquiaModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowParroquiaModal(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                        Seleccionar Parroquia
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowParroquiaModal(false)}>
                        <Text style={styles.modalClose}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalList}>
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setParroquiaDenunciado('');
                          setShowParroquiaModal(false);
                        }}>
                        <Text style={styles.modalItemText}>Ninguna</Text>
                      </TouchableOpacity>
                      {parroquiasDisponibles.map((parroquia, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.modalItem}
                          onPress={() => {
                            setParroquiaDenunciado(parroquia);
                            setShowParroquiaModal(false);
                          }}>
                          <Text style={styles.modalItemText}>{parroquia}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            </>
          )}
        </View>

        {/* Botón de Enviar */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Denuncia</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  section: {
    marginBottom: 30,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 20,
    marginBottom: 15,
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
  textArea: {
    minHeight: 120,
    paddingTop: 15,
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  checkboxBoxChecked: {
    backgroundColor: '#D4AF37',
  },
  checkmark: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    flex: 1,
  },
  selectButton: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#FFFFFF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderBottomWidth: 0,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalClose: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  submitButton: {
    backgroundColor: '#CF142B',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});

export default DenunciaScreen;

