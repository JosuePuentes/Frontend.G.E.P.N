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
  ScrollView,
  ImageBackground,
  Image,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {estadosVenezuela, Estado, Municipio} from '../data/venezuelaData';
import {registrarOficial, generarQROficial} from '../services/apiService';

// Importar imagen de fondo
const backgroundImageStatic = require('../assets/images/Gemini_Generated_Image_5keo7m5keo7m5keo.png');

// Rangos policiales
const RANGOS = [
  'Oficial',
  'Primer Oficial',
  'Oficial Jefe',
  'Inspector',
  'Primer Inspector',
  'Inspector Jefe',
  'Comisario',
  'Primer Comisario',
  'Comisario Jefe',
  'Comisario General',
  'Comisario Mayor',
  'Comisario Superior',
];

// Tipos de sangre
const TIPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Colores de piel
const COLORES_PIEL = [
  'Blanco',
  'Negro',
  'Mestizo',
  'Indígena',
  'Amarillo',
  'Otro',
];

type RRHHScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RRHH'>;

interface Props {
  navigation: RRHHScreenNavigationProp;
}

const RRHHScreen: React.FC<Props> = ({navigation}) => {
  // Datos personales
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [estatura, setEstatura] = useState('');
  const [colorPiel, setColorPiel] = useState('');
  const [tipoSangre, setTipoSangre] = useState('');
  const [ciudadNacimiento, setCiudadNacimiento] = useState('');

  // Datos profesionales
  const [credencial, setCredencial] = useState('');
  const [rango, setRango] = useState('');
  const [destacado, setDestacado] = useState('');

  // Ubicación
  const [estado, setEstado] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [parroquia, setParroquia] = useState('');

  // Imágenes
  const [fotoCara, setFotoCara] = useState<string | null>(null);
  const [fotoCarnet, setFotoCarnet] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [showRangoPicker, setShowRangoPicker] = useState(false);
  const [showTipoSangrePicker, setShowTipoSangrePicker] = useState(false);
  const [showColorPielPicker, setShowColorPielPicker] = useState(false);
  const [showEstadoPicker, setShowEstadoPicker] = useState(false);
  const [showMunicipioPicker, setShowMunicipioPicker] = useState(false);
  const [showParroquiaPicker, setShowParroquiaPicker] = useState(false);

  // Obtener municipios del estado seleccionado
  const municipiosDisponibles = estadosVenezuela.find(e => e.id === estado)?.municipios || [];

  // Obtener parroquias del municipio seleccionado
  const parroquiasDisponibles =
    municipiosDisponibles.find(m => m.id === municipio)?.parroquias || [];

  const handleImagePicker = (tipo: 'cara' | 'carnet') => {
    if (Platform.OS === 'web') {
      // @ts-ignore - document existe en web
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          // @ts-ignore - FileReader existe en web
          const reader = new FileReader();
          reader.onload = (event: any) => {
            const base64 = event.target.result;
            if (tipo === 'cara') {
              setFotoCara(base64);
            } else {
              setFotoCarnet(base64);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // Para móvil, usar react-native-image-picker
      Alert.alert('Info', 'En móvil se implementará con react-native-image-picker');
    }
  };

  const handleSubmit = async () => {
    // Validaciones
    if (
      !primerNombre.trim() ||
      !primerApellido.trim() ||
      !cedula.trim() ||
      !contraseña.trim() ||
      !fechaNacimiento.trim() ||
      !estatura.trim() ||
      !colorPiel ||
      !tipoSangre ||
      !ciudadNacimiento.trim() ||
      !credencial.trim() ||
      !rango ||
      !destacado.trim() ||
      !estado ||
      !municipio ||
      !parroquia ||
      !fotoCara
    ) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (contraseña.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const datosOficial = {
        primerNombre: primerNombre.trim(),
        segundoNombre: segundoNombre.trim(),
        primerApellido: primerApellido.trim(),
        segundoApellido: segundoApellido.trim(),
        cedula: cedula.trim(),
        contraseña,
        fechaNacimiento,
        estatura: parseFloat(estatura),
        colorPiel,
        tipoSangre,
        ciudadNacimiento: ciudadNacimiento.trim(),
        credencial: credencial.trim(),
        rango,
        destacado: destacado.trim(),
        estado: estadosVenezuela.find(e => e.id === estado)?.nombre || '',
        municipio: municipiosDisponibles.find(m => m.id === municipio)?.nombre || '',
        parroquia,
        fotoCara, // Base64
        fotoCarnet: fotoCarnet || null, // Base64 opcional
      };

      const result = await registrarOficial(datosOficial);
      if (result.success) {
        Alert.alert('Éxito', 'Oficial registrado correctamente');
        // Limpiar formulario
        setPrimerNombre('');
        setSegundoNombre('');
        setPrimerApellido('');
        setSegundoApellido('');
        setCedula('');
        setContraseña('');
        setFechaNacimiento('');
        setEstatura('');
        setColorPiel('');
        setTipoSangre('');
        setCiudadNacimiento('');
        setCredencial('');
        setRango('');
        setDestacado('');
        setEstado('');
        setMunicipio('');
        setParroquia('');
        setFotoCara(null);
        setFotoCarnet(null);
      } else {
        Alert.alert('Error', result.message || 'No se pudo registrar el oficial');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar el oficial');
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
            <Text style={styles.title}>Registro de Oficiales</Text>
            <Text style={styles.subtitle}>Recursos Humanos</Text>
          </View>

          {/* Datos Personales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos Personales</Text>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Primer Nombre *</Text>
                <TextInput
                  style={styles.input}
                  value={primerNombre}
                  onChangeText={setPrimerNombre}
                  placeholder="Primer nombre"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Segundo Nombre</Text>
                <TextInput
                  style={styles.input}
                  value={segundoNombre}
                  onChangeText={setSegundoNombre}
                  placeholder="Segundo nombre"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Primer Apellido *</Text>
                <TextInput
                  style={styles.input}
                  value={primerApellido}
                  onChangeText={setPrimerApellido}
                  placeholder="Primer apellido"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Segundo Apellido</Text>
                <TextInput
                  style={styles.input}
                  value={segundoApellido}
                  onChangeText={setSegundoApellido}
                  placeholder="Segundo apellido"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cédula *</Text>
              <TextInput
                style={styles.input}
                value={cedula}
                onChangeText={setCedula}
                placeholder="V-12345678"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña *</Text>
              <TextInput
                style={styles.input}
                value={contraseña}
                onChangeText={setContraseña}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha de Nacimiento *</Text>
              <TextInput
                style={styles.input}
                value={fechaNacimiento}
                onChangeText={setFechaNacimiento}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Estatura (cm) *</Text>
                <TextInput
                  style={styles.input}
                  value={estatura}
                  onChangeText={setEstatura}
                  placeholder="170"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Color de Piel *</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowColorPielPicker(!showColorPielPicker)}>
                  <Text style={styles.pickerButtonText}>
                    {colorPiel || 'Seleccionar'}
                  </Text>
                </TouchableOpacity>
                {showColorPielPicker && (
                  <View style={styles.pickerContainer}>
                    {COLORES_PIEL.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={styles.pickerOption}
                        onPress={() => {
                          setColorPiel(color);
                          setShowColorPielPicker(false);
                        }}>
                        <Text style={styles.pickerOptionText}>{color}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Tipo de Sangre *</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowTipoSangrePicker(!showTipoSangrePicker)}>
                  <Text style={styles.pickerButtonText}>
                    {tipoSangre || 'Seleccionar'}
                  </Text>
                </TouchableOpacity>
                {showTipoSangrePicker && (
                  <View style={styles.pickerContainer}>
                    {TIPOS_SANGRE.map(tipo => (
                      <TouchableOpacity
                        key={tipo}
                        style={styles.pickerOption}
                        onPress={() => {
                          setTipoSangre(tipo);
                          setShowTipoSangrePicker(false);
                        }}>
                        <Text style={styles.pickerOptionText}>{tipo}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Ciudad de Nacimiento *</Text>
                <TextInput
                  style={styles.input}
                  value={ciudadNacimiento}
                  onChangeText={setCiudadNacimiento}
                  placeholder="Ciudad"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          {/* Datos Profesionales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos Profesionales</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Credencial *</Text>
              <TextInput
                style={styles.input}
                value={credencial}
                onChangeText={setCredencial}
                placeholder="Número de credencial"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rango *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowRangoPicker(!showRangoPicker)}>
                <Text style={styles.pickerButtonText}>
                  {rango || 'Seleccionar rango'}
                </Text>
              </TouchableOpacity>
              {showRangoPicker && (
                <View style={styles.pickerContainer}>
                  {RANGOS.map(rangoItem => (
                    <TouchableOpacity
                      key={rangoItem}
                      style={styles.pickerOption}
                      onPress={() => {
                        setRango(rangoItem);
                        setShowRangoPicker(false);
                      }}>
                      <Text style={styles.pickerOptionText}>{rangoItem}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Destacado *</Text>
              <TextInput
                style={styles.input}
                value={destacado}
                onChangeText={setDestacado}
                placeholder="Lugar de destacamento"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Ubicación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowEstadoPicker(!showEstadoPicker)}>
                <Text style={styles.pickerButtonText}>
                  {estadosVenezuela.find(e => e.id === estado)?.nombre ||
                    'Seleccionar estado'}
                </Text>
              </TouchableOpacity>
              {showEstadoPicker && (
                <ScrollView style={styles.pickerContainer} nestedScrollEnabled>
                  {estadosVenezuela.map(est => (
                    <TouchableOpacity
                      key={est.id}
                      style={styles.pickerOption}
                      onPress={() => {
                        setEstado(est.id);
                        setMunicipio('');
                        setParroquia('');
                        setShowEstadoPicker(false);
                      }}>
                      <Text style={styles.pickerOptionText}>{est.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {estado && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Municipio *</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowMunicipioPicker(!showMunicipioPicker)}>
                  <Text style={styles.pickerButtonText}>
                    {municipiosDisponibles.find(m => m.id === municipio)
                      ?.nombre || 'Seleccionar municipio'}
                  </Text>
                </TouchableOpacity>
                {showMunicipioPicker && (
                  <ScrollView
                    style={styles.pickerContainer}
                    nestedScrollEnabled>
                    {municipiosDisponibles.map(mun => (
                      <TouchableOpacity
                        key={mun.id}
                        style={styles.pickerOption}
                        onPress={() => {
                          setMunicipio(mun.id);
                          setParroquia('');
                          setShowMunicipioPicker(false);
                        }}>
                        <Text style={styles.pickerOptionText}>
                          {mun.nombre}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}

            {municipio && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Parroquia *</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowParroquiaPicker(!showParroquiaPicker)}>
                  <Text style={styles.pickerButtonText}>
                    {parroquia || 'Seleccionar parroquia'}
                  </Text>
                </TouchableOpacity>
                {showParroquiaPicker && (
                  <ScrollView
                    style={styles.pickerContainer}
                    nestedScrollEnabled>
                    {parroquiasDisponibles.map((parr, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.pickerOption}
                        onPress={() => {
                          setParroquia(parr);
                          setShowParroquiaPicker(false);
                        }}>
                        <Text style={styles.pickerOptionText}>{parr}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
          </View>

          {/* Imágenes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fotografías</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Foto de Cara (Obligatoria) *</Text>
              <TouchableOpacity
                style={styles.imageButton}
                onPress={() => handleImagePicker('cara')}>
                <Text style={styles.imageButtonText}>
                  {fotoCara ? 'Cambiar Foto' : 'Seleccionar Foto'}
                </Text>
              </TouchableOpacity>
              {fotoCara && (
                <Image
                  source={{uri: fotoCara}}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Foto de Carnet Policial (Opcional)
              </Text>
              <TouchableOpacity
                style={styles.imageButton}
                onPress={() => handleImagePicker('carnet')}>
                <Text style={styles.imageButtonText}>
                  {fotoCarnet ? 'Cambiar Foto' : 'Seleccionar Foto'}
                </Text>
              </TouchableOpacity>
              {fotoCarnet && (
                <Image
                  source={{uri: fotoCarnet}}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              )}
            </View>
          </View>

          {/* Botón de Enviar */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Registrar Oficial</Text>
            )}
          </TouchableOpacity>
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
    fontSize: 18,
    color: '#D4AF37',
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
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
  },
  pickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    padding: 15,
    minHeight: 50,
    justifyContent: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  pickerContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  pickerOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  pickerOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: '#00247D',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#0033A0',
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#00247D',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RRHHScreen;

