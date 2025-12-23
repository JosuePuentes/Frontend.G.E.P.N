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
  Image,
  Platform,
  Modal,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {estadosVenezuela, Estado, Municipio} from '../data/venezuelaData';
import {getCiudadesByEstado} from '../data/ciudadesVenezuela';
import {registrarOficial, generarQROficial, listarOficiales} from '../services/apiService';
import DatePickerField from '../components/DatePickerField';

// Importar imagen de fondo
const backgroundImageStatic = require('../assets/images/Gemini_Generated_Image_5keo7m5keo7m5keo.png');

// Rangos policiales (17 opciones completas)
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
  'Comisario General de Brigada',
  'Comisario General de División',
  'Comisario General Inspector',
  'Comisario General en Jefe',
  'Director General',
];

// Tipos de sangre
const TIPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Colores de piel válidos (sin "Indígena")
const COLORES_PIEL = [
  'Blanco',
  'Negro',
  'Moreno',
  'Rubio',
  'Trigueño',
  'Mestizo',
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
  const [fechaGraduacion, setFechaGraduacion] = useState('');
  const [antiguedad, setAntiguedad] = useState('');

  // Documentos
  const [licenciaConducir, setLicenciaConducir] = useState('');
  const [carnetMedico, setCarnetMedico] = useState('');

  // Parientes (información sensible)
  const [padreNombre, setPadreNombre] = useState('');
  const [padreCedula, setPadreCedula] = useState('');
  const [madreNombre, setMadreNombre] = useState('');
  const [madreCedula, setMadreCedula] = useState('');
  const [esposaNombre, setEsposaNombre] = useState('');
  const [esposaCedula, setEsposaCedula] = useState('');
  const [hijos, setHijos] = useState<Array<{nombre: string; cedula: string; fechaNacimiento: string}>>([]);
  const [showHijoForm, setShowHijoForm] = useState(false);
  const [hijoNombre, setHijoNombre] = useState('');
  const [hijoCedula, setHijoCedula] = useState('');
  const [hijoFechaNacimiento, setHijoFechaNacimiento] = useState('');

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
  const [showCiudadPicker, setShowCiudadPicker] = useState(false);

  // Estados para la lista de oficiales
  const [vistaActual, setVistaActual] = useState<'registro' | 'lista'>('registro');
  const [oficiales, setOficiales] = useState<any[]>([]);
  const [oficialesFiltrados, setOficialesFiltrados] = useState<any[]>([]);
  const [buscador, setBuscador] = useState('');
  const [cargandoOficiales, setCargandoOficiales] = useState(false);

  // Estado para modal de confirmación
  const [showModalConfirmacion, setShowModalConfirmacion] = useState(false);
  const [oficialRegistrado, setOficialRegistrado] = useState<any>(null);

  // Obtener municipios del estado seleccionado
  const municipiosDisponibles = estadosVenezuela.find(e => e.id === estado)?.municipios || [];

  // Obtener parroquias del municipio seleccionado
  const parroquiasDisponibles =
    municipiosDisponibles.find(m => m.id === municipio)?.parroquias || [];

  // Obtener ciudades del estado seleccionado (para ciudad de nacimiento)
  const ciudadesDisponibles = estado ? getCiudadesByEstado(estado) : [];

  // Función para cargar oficiales
  const cargarOficiales = async () => {
    setCargandoOficiales(true);
    try {
      const result = await listarOficiales();
      if (result.success && result.data) {
        // Si la respuesta tiene un objeto con oficiales, extraerlo
        const listaOficiales = Array.isArray(result.data) 
          ? result.data 
          : (result.data.oficiales || result.data.data || []);
        setOficiales(listaOficiales);
        setOficialesFiltrados(listaOficiales);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los oficiales');
      }
    } catch (error: any) {
      console.error('Error al cargar oficiales:', error);
      Alert.alert('Error', 'Error al cargar la lista de oficiales');
    } finally {
      setCargandoOficiales(false);
    }
  };

  // Efecto para cargar oficiales cuando se cambia a la vista de lista
  useEffect(() => {
    if (vistaActual === 'lista') {
      cargarOficiales();
    }
  }, [vistaActual]);

  // Función para filtrar oficiales
  useEffect(() => {
    if (!buscador.trim()) {
      setOficialesFiltrados(oficiales);
      return;
    }

    const termino = buscador.toLowerCase().trim();
    const filtrados = oficiales.filter(oficial => {
      const nombreCompleto = `${oficial.primer_nombre || ''} ${oficial.segundo_nombre || ''} ${oficial.primer_apellido || ''} ${oficial.segundo_apellido || ''}`.toLowerCase();
      const credencial = (oficial.credencial || '').toLowerCase();
      const cedula = (oficial.cedula || '').toLowerCase();
      
      return nombreCompleto.includes(termino) || 
             credencial.includes(termino) || 
             cedula.includes(termino);
    });
    
    setOficialesFiltrados(filtrados);
  }, [buscador, oficiales]);

  // Función para obtener nombre completo
  const obtenerNombreCompleto = (oficial: any) => {
    const partes = [
      oficial.primer_nombre,
      oficial.segundo_nombre,
      oficial.primer_apellido,
      oficial.segundo_apellido
    ].filter(p => p && p.trim());
    return partes.join(' ') || 'Sin nombre';
  };

  // Funciones de validación de fechas
  const validarFecha = (fecha: string, nombreCampo: string): string | null => {
    if (!fecha.trim()) {
      return `${nombreCampo} es obligatorio`;
    }

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      return `${nombreCampo} debe estar en formato YYYY-MM-DD`;
    }

    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      return `${nombreCampo} no es una fecha válida`;
    }

    // Verificar que no sea fecha futura
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaObj > hoy) {
      return `${nombreCampo} no puede ser una fecha futura`;
    }

    return null;
  };

  const validarFechaGraduacion = (fechaNac: string, fechaGrad: string): string | null => {
    if (!fechaNac || !fechaGrad) return null;

    const fechaNacObj = new Date(fechaNac);
    const fechaGradObj = new Date(fechaGrad);

    // Calcular diferencia en años
    const diffAnios = fechaGradObj.getFullYear() - fechaNacObj.getFullYear();
    const diffMeses = fechaGradObj.getMonth() - fechaNacObj.getMonth();
    const diffDias = fechaGradObj.getDate() - fechaNacObj.getDate();

    let añosCompletos = diffAnios;
    if (diffMeses < 0 || (diffMeses === 0 && diffDias < 0)) {
      añosCompletos--;
    }

    if (añosCompletos < 18) {
      return 'La fecha de graduación debe ser al menos 18 años después de la fecha de nacimiento';
    }

    return null;
  };

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
    console.log('=== INICIO handleSubmit ===');
    console.log('Estado actual:', {
      primerNombre,
      primerApellido,
      cedula,
      credencial,
      rango,
      estado,
      municipio,
      parroquia,
      ciudadNacimiento,
      fotoCara: fotoCara ? 'Sí' : 'No',
    });

    // Validaciones
    console.log('🔍 Iniciando validaciones...');
    // Validaciones de campos obligatorios
    if (!primerNombre.trim()) {
      console.log('❌ Error: Primer nombre vacío');
      Alert.alert('Error', 'El primer nombre es obligatorio');
      return;
    }
    console.log('✅ Primer nombre válido');
    if (!primerApellido.trim()) {
      console.log('❌ Error: Primer apellido vacío');
      Alert.alert('Error', 'El primer apellido es obligatorio');
      return;
    }
    console.log('✅ Primer apellido válido');
    if (!cedula.trim()) {
      console.log('❌ Error: Cédula vacía');
      Alert.alert('Error', 'La cédula es obligatoria');
      return;
    }
    console.log('✅ Cédula válida');
    if (!contraseña.trim()) {
      console.log('❌ Error: Contraseña vacía');
      Alert.alert('Error', 'La contraseña es obligatoria');
      return;
    }
    console.log('✅ Contraseña válida');
    if (!fechaNacimiento.trim()) {
      console.log('❌ Error: Fecha de nacimiento vacía');
      Alert.alert('Error', 'La fecha de nacimiento es obligatoria');
      return;
    }
    console.log('✅ Fecha de nacimiento válida');
    if (!estatura.trim()) {
      console.log('❌ Error: Estatura vacía');
      Alert.alert('Error', 'La estatura es obligatoria');
      return;
    }
    console.log('✅ Estatura válida');
    if (!colorPiel) {
      console.log('❌ Error: Color de piel no seleccionado');
      Alert.alert('Error', 'El color de piel es obligatorio');
      return;
    }
    console.log('✅ Color de piel válido');
    if (!tipoSangre) {
      console.log('❌ Error: Tipo de sangre no seleccionado');
      Alert.alert('Error', 'El tipo de sangre es obligatorio');
      return;
    }
    console.log('✅ Tipo de sangre válido');
    if (!ciudadNacimiento.trim()) {
      console.log('❌ Error: Ciudad de nacimiento vacía');
      Alert.alert('Error', 'La ciudad de nacimiento es obligatoria. Por favor selecciona una ciudad del estado.');
      return;
    }
    console.log('✅ Ciudad de nacimiento válida');
    if (!estado) {
      console.log('❌ Error: Estado no seleccionado');
      Alert.alert('Error', 'Debes seleccionar un estado para poder elegir la ciudad de nacimiento');
      return;
    }
    console.log('✅ Estado válido');
    if (!credencial.trim()) {
      console.log('❌ Error: Credencial vacía');
      Alert.alert('Error', 'La credencial es obligatoria');
      return;
    }
    console.log('✅ Credencial válida');
    if (!rango) {
      console.log('❌ Error: Rango no seleccionado');
      Alert.alert('Error', 'El rango es obligatorio');
      return;
    }
    console.log('✅ Rango válido');
    if (!fechaGraduacion.trim()) {
      console.log('❌ Error: Fecha de graduación vacía');
      Alert.alert('Error', 'La fecha de graduación es obligatoria');
      return;
    }
    console.log('✅ Fecha de graduación válida');
    if (!antiguedad.trim()) {
      console.log('❌ Error: Antigüedad vacía');
      Alert.alert('Error', 'La antigüedad es obligatoria');
      return;
    }
    console.log('✅ Antigüedad válida');
    if (!municipio) {
      console.log('❌ Error: Municipio no seleccionado');
      Alert.alert('Error', 'El municipio es obligatorio');
      return;
    }
    console.log('✅ Municipio válido');
    if (!parroquia) {
      console.log('❌ Error: Parroquia no seleccionada');
      Alert.alert('Error', 'La parroquia es obligatoria');
      return;
    }
    console.log('✅ Parroquia válida');
    if (!fotoCara) {
      console.log('❌ Error: Foto de cara no seleccionada');
      Alert.alert('Error', 'La foto de cara es obligatoria');
      return;
    }
    console.log('✅ Foto de cara válida');

    // Validación de contraseña
    console.log('🔍 Validando contraseña...');
    if (contraseña.length < 6) {
      console.log('❌ Error: Contraseña muy corta');
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    console.log('✅ Contraseña válida (longitud)');

    // Validación de fechas
    console.log('🔍 Validando fechas...');
    const errorFechaNac = validarFecha(fechaNacimiento, 'La fecha de nacimiento');
    if (errorFechaNac) {
      console.log('❌ Error en fecha de nacimiento:', errorFechaNac);
      Alert.alert('Error', errorFechaNac);
      return;
    }
    console.log('✅ Fecha de nacimiento válida');

    const errorFechaGrad = validarFecha(fechaGraduacion, 'La fecha de graduación');
    if (errorFechaGrad) {
      console.log('❌ Error en fecha de graduación:', errorFechaGrad);
      Alert.alert('Error', errorFechaGrad);
      return;
    }
    console.log('✅ Fecha de graduación válida');

    const errorRelacionFechas = validarFechaGraduacion(fechaNacimiento, fechaGraduacion);
    if (errorRelacionFechas) {
      console.log('❌ Error en relación de fechas:', errorRelacionFechas);
      Alert.alert('Error', errorRelacionFechas);
      return;
    }
    console.log('✅ Relación de fechas válida');

    // Validación de números
    console.log('🔍 Validando números...');
    const estaturaNum = parseFloat(estatura);
    if (isNaN(estaturaNum) || estaturaNum <= 0) {
      console.log('❌ Error: Estatura inválida');
      Alert.alert('Error', 'Por favor ingresa una estatura válida (número positivo)');
      return;
    }
    console.log('✅ Estatura válida:', estaturaNum);
    const antiguedadNum = parseFloat(antiguedad);
    if (isNaN(antiguedadNum) || antiguedadNum < 0) {
      console.log('❌ Error: Antigüedad inválida');
      Alert.alert('Error', 'Por favor ingresa una antigüedad válida (número positivo)');
      return;
    }
    console.log('✅ Antigüedad válida:', antiguedadNum);

    console.log('✅ Todas las validaciones pasaron, iniciando registro...');
    setLoading(true);
    console.log('⏳ Loading activado');

    try {
      console.log('📦 Preparando datos de hijos...');
      // Preparar datos de hijos con formato correcto
      const hijosFormateados = hijos.length > 0 
        ? hijos.map(hijo => ({
            nombre: hijo.nombre.trim(),
            cedula: hijo.cedula.trim(),
            fecha_nacimiento: hijo.fechaNacimiento.trim() || null,
          }))
        : null;
      console.log('✅ Hijos formateados:', hijosFormateados);

      console.log('📦 Preparando datos del oficial...');
      const datosOficial = {
        primer_nombre: primerNombre.trim(),
        segundo_nombre: segundoNombre.trim() || null,
        primer_apellido: primerApellido.trim(),
        segundo_apellido: segundoApellido.trim() || null,
        cedula: cedula.trim(),
        contraseña,
        fecha_nacimiento: fechaNacimiento,
        estatura: parseFloat(estatura),
        color_piel: colorPiel,
        tipo_sangre: tipoSangre,
        ciudad_nacimiento: ciudadNacimiento.trim(),
        credencial: credencial.trim(),
        rango,
        destacado: '', // Campo destacado se deja vacío en RRHH (se asigna en otros módulos)
        fecha_graduacion: fechaGraduacion.trim(),
        antiguedad: parseFloat(antiguedad),
        estado: estadosVenezuela.find(e => e.id === estado)?.nombre || '',
        municipio: municipiosDisponibles.find(m => m.id === municipio)?.nombre || '',
        parroquia,
        licencia_conducir: licenciaConducir.trim() || null,
        carnet_medico: carnetMedico.trim() || null,
        foto_cara: fotoCara, // Base64
        foto_carnet: fotoCarnet || null, // Base64 opcional
        // Información sensible (NO aparece en QR)
        parientes: {
          padre: {
            nombre: padreNombre.trim() || null,
            cedula: padreCedula.trim() || null,
          },
          madre: {
            nombre: madreNombre.trim() || null,
            cedula: madreCedula.trim() || null,
          },
          esposa: {
            nombre: esposaNombre.trim() || null,
            cedula: esposaCedula.trim() || null,
          },
          hijos: hijosFormateados,
        },
      };

      console.log('📤 Datos a enviar:', JSON.stringify(datosOficial, null, 2));

      console.log('🚀 === ENVIANDO DATOS AL BACKEND ===');
      const result = await registrarOficial(datosOficial);
      console.log('📥 === RESPUESTA RECIBIDA ===');
      console.log('✅ Result:', result);
      console.log('✅ Success:', result.success);
      console.log('✅ Message:', result.message);
      
      console.log('🔍 Verificando resultado...');
      if (result.success) {
        console.log('✅ ✅ ✅ REGISTRO EXITOSO ✅ ✅ ✅');
        console.log('🧹 Limpiando formulario...');
        // Limpiar formulario primero
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
        setFechaGraduacion('');
        setAntiguedad('');
        setLicenciaConducir('');
        setCarnetMedico('');
        setPadreNombre('');
        setPadreCedula('');
        setMadreNombre('');
        setMadreCedula('');
        setEsposaNombre('');
        setEsposaCedula('');
        setHijos([]);
        setEstado('');
        setMunicipio('');
        setParroquia('');
        setFotoCara(null);
        setFotoCarnet(null);
        
        // Calcular edad
        const calcularEdad = (fechaNac: string): number => {
          const hoy = new Date();
          const nacimiento = new Date(fechaNac);
          let edad = hoy.getFullYear() - nacimiento.getFullYear();
          const mes = hoy.getMonth() - nacimiento.getMonth();
          if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
          }
          return edad;
        };

        const edad = calcularEdad(fechaNacimiento);
        const nombreCompleto = `${primerNombre} ${segundoNombre || ''} ${primerApellido} ${segundoApellido || ''}`.trim();

        // Guardar datos del oficial registrado para el modal
        setOficialRegistrado({
          nombreCompleto,
          cedula,
          credencial,
          edad,
          rango,
        });

        console.log('📢 Mostrando modal de confirmación...');
        setShowModalConfirmacion(true);
        console.log('✅ Modal de confirmación mostrado');
        console.log('✅ === REGISTRO COMPLETADO EXITOSAMENTE ===');
        
        // Recargar lista si está en la vista de lista
        if (vistaActual === 'lista') {
          console.log('🔄 Recargando lista de oficiales...');
          cargarOficiales();
        }
      } else {
        console.log('❌ Registro falló, result.success es false');
        // Mostrar mensaje específico del backend (para credenciales duplicadas, etc.)
        const mensajeError = result.message || 'No se pudo registrar el oficial';
        console.error('❌ === ERROR EN REGISTRO ===');
        console.error('❌ Mensaje de error:', mensajeError);
        
        if (mensajeError.toLowerCase().includes('credencial') || mensajeError.toLowerCase().includes('duplicad')) {
          Alert.alert('Error', 'La credencial ya está registrada. Por favor usa otra credencial.');
        } else if (mensajeError.toLowerCase().includes('cédula') || mensajeError.toLowerCase().includes('cedula')) {
          Alert.alert('Error', 'La cédula ya está registrada. Por favor verifica los datos.');
        } else {
          Alert.alert('Error', mensajeError);
        }
      }
    } catch (error: any) {
      // Manejar errores de red o del servidor
      console.error('❌ === ERROR EN CATCH ===');
      console.error('❌ Error completo:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error message:', error.message);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar el oficial';
      console.error('Mensaje de error final:', errorMessage);
      
      if (errorMessage.toLowerCase().includes('credencial') || errorMessage.toLowerCase().includes('duplicad')) {
        Alert.alert('Error', 'La credencial ya está registrada. Por favor usa otra credencial.');
      } else if (errorMessage.toLowerCase().includes('cédula') || errorMessage.toLowerCase().includes('cedula')) {
        Alert.alert('Error', 'La cédula ya está registrada. Por favor verifica los datos.');
      } else if (error.message && (error.message.includes('Network') || error.message.includes('timeout'))) {
        Alert.alert('Error de Conexión', 'Error de conexión. Por favor verifica tu conexión a internet');
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      console.log('🏁 Finalizando handleSubmit, desactivando loading...');
      setLoading(false);
      console.log('✅ Loading desactivado');
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
            <Text style={styles.title}>Recursos Humanos</Text>
            <Text style={styles.subtitle}>Gestión de Oficiales</Text>
          </View>

          {/* Botones de navegación */}
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[styles.navButton, vistaActual === 'registro' && styles.navButtonActive]}
              onPress={() => setVistaActual('registro')}>
              <Text style={[styles.navButtonText, vistaActual === 'registro' && styles.navButtonTextActive]}>
                Registrar Oficial
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, vistaActual === 'lista' && styles.navButtonActive]}
              onPress={() => setVistaActual('lista')}>
              <Text style={[styles.navButtonText, vistaActual === 'lista' && styles.navButtonTextActive]}>
                Lista de Oficiales
              </Text>
            </TouchableOpacity>
          </View>

          {/* Vista de Lista de Oficiales */}
          {vistaActual === 'lista' && (
            <View style={styles.listaContainer}>
              {/* Buscador */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={buscador}
                  onChangeText={setBuscador}
                  placeholder="Buscar por nombre, credencial o cédula..."
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={cargarOficiales}
                  disabled={cargandoOficiales}>
                  <Text style={styles.refreshButtonText}>🔄</Text>
                </TouchableOpacity>
              </View>

              {/* Información de resultados */}
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  {oficialesFiltrados.length} oficial{oficialesFiltrados.length !== 1 ? 'es' : ''} encontrado{oficialesFiltrados.length !== 1 ? 's' : ''}
                  {buscador.trim() && ` (de ${oficiales.length} total)`}
                </Text>
              </View>

              {/* Tabla de oficiales */}
              {cargandoOficiales ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#D4AF37" />
                  <Text style={styles.loadingText}>Cargando oficiales...</Text>
                </View>
              ) : oficialesFiltrados.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {buscador.trim() ? 'No se encontraron oficiales con ese criterio' : 'No hay oficiales registrados'}
                  </Text>
                </View>
              ) : (
                <View style={styles.tableContainer}>
                  {/* Encabezado de la tabla */}
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, {flex: 2}]}>Nombre Completo</Text>
                    <Text style={[styles.tableHeaderCell, {flex: 1.2}]}>Credencial</Text>
                    <Text style={[styles.tableHeaderCell, {flex: 1.2}]}>Cédula</Text>
                    <Text style={[styles.tableHeaderCell, {flex: 1.2}]}>Rango</Text>
                    <Text style={[styles.tableHeaderCell, {flex: 1}]}>Estado</Text>
                  </View>

                  {/* Filas de la tabla */}
                  <ScrollView style={styles.tableBody} nestedScrollEnabled>
                    {oficialesFiltrados.map((oficial, index) => (
                      <View
                        key={oficial.id || oficial._id || index}
                        style={[
                          styles.tableRow,
                          index % 2 === 0 && styles.tableRowEven
                        ]}>
                        <Text style={[styles.tableCell, {flex: 2}]} numberOfLines={1}>
                          {obtenerNombreCompleto(oficial)}
                        </Text>
                        <Text style={[styles.tableCell, {flex: 1.2}]} numberOfLines={1}>
                          {oficial.credencial || 'N/A'}
                        </Text>
                        <Text style={[styles.tableCell, {flex: 1.2}]} numberOfLines={1}>
                          {oficial.cedula || 'N/A'}
                        </Text>
                        <Text style={[styles.tableCell, {flex: 1.2}]} numberOfLines={1}>
                          {oficial.rango || 'N/A'}
                        </Text>
                        <Text style={[styles.tableCell, {flex: 1}]} numberOfLines={1}>
                          {oficial.activo !== false ? 'Activo' : 'Inactivo'}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {/* Vista de Registro de Oficial */}
          {vistaActual === 'registro' && (
            <>

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
              <Text style={styles.helperText}>
                (Esta contraseña se usará para el login en el módulo policial)
              </Text>
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
              <DatePickerField
                label="Fecha de Nacimiento"
                value={fechaNacimiento}
                onChange={setFechaNacimiento}
                placeholder="YYYY-MM-DD"
                required
                maximumDate={new Date()}
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
                    <ScrollView nestedScrollEnabled style={{maxHeight: 200}}>
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
                    </ScrollView>
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
                    <ScrollView nestedScrollEnabled style={{maxHeight: 200}}>
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
                    </ScrollView>
                  </View>
                )}
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Ciudad de Nacimiento *</Text>
                {estado ? (
                  <>
                    <TouchableOpacity
                      style={styles.pickerButton}
                      onPress={() => setShowCiudadPicker(!showCiudadPicker)}>
                      <Text style={styles.pickerButtonText}>
                        {ciudadNacimiento || 'Seleccionar ciudad'}
                      </Text>
                    </TouchableOpacity>
                    {showCiudadPicker && (
                      <View style={styles.pickerContainer}>
                        <ScrollView nestedScrollEnabled style={{maxHeight: 200}}>
                          {ciudadesDisponibles.map(ciudad => (
                            <TouchableOpacity
                              key={ciudad.id}
                              style={styles.pickerOption}
                              onPress={() => {
                                setCiudadNacimiento(ciudad.nombre);
                                setShowCiudadPicker(false);
                              }}>
                              <Text style={styles.pickerOptionText}>{ciudad.nombre}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </>
                ) : (
                  <Text style={styles.helperText}>
                    Primero selecciona un estado
                  </Text>
                )}
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
                  <ScrollView nestedScrollEnabled style={{maxHeight: 300}}>
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
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Destacado</Text>
              <Text style={styles.helperText}>
                (Se asigna en otros módulos - Campo bloqueado)
              </Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value=""
                editable={false}
                placeholder="Este campo se asigna en otros módulos"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <DatePickerField
                  label="Fecha de Graduación"
                  value={fechaGraduacion}
                  onChange={setFechaGraduacion}
                  placeholder="YYYY-MM-DD"
                  required
                  maximumDate={new Date()}
                  minimumDate={fechaNacimiento ? (() => {
                    const fechaMin = new Date(fechaNacimiento);
                    fechaMin.setFullYear(fechaMin.getFullYear() + 18);
                    return fechaMin;
                  })() : undefined}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Antigüedad (años) *</Text>
                <TextInput
                  style={styles.input}
                  value={antiguedad}
                  onChangeText={setAntiguedad}
                  placeholder="Años de servicio"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Documentos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documentos</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Licencia de Conducir</Text>
              <TextInput
                style={styles.input}
                value={licenciaConducir}
                onChangeText={setLicenciaConducir}
                placeholder="Número de licencia"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Carnet Médico</Text>
              <TextInput
                style={styles.input}
                value={carnetMedico}
                onChangeText={setCarnetMedico}
                placeholder="Número de carnet médico"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Parientes (Información Sensible - NO aparece en QR) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Parientes Principales (Confidencial)
            </Text>
            <Text style={styles.sectionSubtitle}>
              Esta información es sensible y no aparecerá en el QR
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Padre - Nombre</Text>
              <TextInput
                style={styles.input}
                value={padreNombre}
                onChangeText={setPadreNombre}
                placeholder="Nombre completo del padre"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Padre - Cédula</Text>
              <TextInput
                style={styles.input}
                value={padreCedula}
                onChangeText={setPadreCedula}
                placeholder="Cédula del padre"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Madre - Nombre</Text>
              <TextInput
                style={styles.input}
                value={madreNombre}
                onChangeText={setMadreNombre}
                placeholder="Nombre completo de la madre"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Madre - Cédula</Text>
              <TextInput
                style={styles.input}
                value={madreCedula}
                onChangeText={setMadreCedula}
                placeholder="Cédula de la madre"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Esposa/Esposo - Nombre</Text>
              <TextInput
                style={styles.input}
                value={esposaNombre}
                onChangeText={setEsposaNombre}
                placeholder="Nombre completo"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Esposa/Esposo - Cédula</Text>
              <TextInput
                style={styles.input}
                value={esposaCedula}
                onChangeText={setEsposaCedula}
                placeholder="Cédula"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hijos</Text>
              {hijos.map((hijo, index) => (
                <View key={index} style={styles.hijoItem}>
                  <View style={styles.hijoInfo}>
                    <Text style={styles.hijoText}>
                      {hijo.nombre} - {hijo.cedula}
                    </Text>
                    <Text style={styles.hijoTextSmall}>
                      Nacimiento: {hijo.fechaNacimiento}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      const nuevosHijos = hijos.filter((_, i) => i !== index);
                      setHijos(nuevosHijos);
                    }}>
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {showHijoForm ? (
                <View style={styles.hijoForm}>
                  <TextInput
                    style={styles.input}
                    value={hijoNombre}
                    onChangeText={setHijoNombre}
                    placeholder="Nombre del hijo"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    style={[styles.input, {marginTop: 10}]}
                    value={hijoCedula}
                    onChangeText={setHijoCedula}
                    placeholder="Cédula"
                    placeholderTextColor="#999"
                  />
                  <View style={{marginTop: 10}}>
                    <DatePickerField
                      label="Fecha de Nacimiento del Hijo"
                      value={hijoFechaNacimiento}
                      onChange={setHijoFechaNacimiento}
                      placeholder="YYYY-MM-DD"
                      maximumDate={new Date()}
                    />
                  </View>
                  <View style={styles.hijoFormButtons}>
                    <TouchableOpacity
                      style={styles.addHijoButton}
                      onPress={() => {
                        if (hijoNombre.trim() && hijoCedula.trim()) {
                          setHijos([
                            ...hijos,
                            {
                              nombre: hijoNombre.trim(),
                              cedula: hijoCedula.trim(),
                              fechaNacimiento: hijoFechaNacimiento.trim(),
                            },
                          ]);
                          setHijoNombre('');
                          setHijoCedula('');
                          setHijoFechaNacimiento('');
                          setShowHijoForm(false);
                        }
                      }}>
                      <Text style={styles.addHijoButtonText}>Agregar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelHijoButton}
                      onPress={() => {
                        setShowHijoForm(false);
                        setHijoNombre('');
                        setHijoCedula('');
                        setHijoFechaNacimiento('');
                      }}>
                      <Text style={styles.cancelHijoButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addHijoButton}
                  onPress={() => setShowHijoForm(true)}>
                  <Text style={styles.addHijoButtonText}>+ Agregar Hijo</Text>
                </TouchableOpacity>
              )}
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
        setCiudadNacimiento(''); // Limpiar ciudad cuando cambia el estado
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
            onPress={() => {
              console.log('🖱️ Botón "Registrar Oficial" presionado');
              handleSubmit();
            }}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Registrar Oficial</Text>
            )}
          </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {/* Modal de Confirmación de Registro */}
        <Modal
          visible={showModalConfirmacion}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModalConfirmacion(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>✅ Oficial Registrado Exitosamente</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowModalConfirmacion(false);
                    setOficialRegistrado(null);
                  }}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              
              {oficialRegistrado && (
                <View style={styles.modalBody}>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLabel}>Nombre Completo:</Text>
                    <Text style={styles.modalValue}>{oficialRegistrado.nombreCompleto}</Text>
                  </View>
                  
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLabel}>Cédula:</Text>
                    <Text style={styles.modalValue}>{oficialRegistrado.cedula}</Text>
                  </View>
                  
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLabel}>Credencial:</Text>
                    <Text style={styles.modalValue}>{oficialRegistrado.credencial}</Text>
                  </View>
                  
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLabel}>Edad:</Text>
                    <Text style={styles.modalValue}>{oficialRegistrado.edad} años</Text>
                  </View>
                  
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLabel}>Rango:</Text>
                    <Text style={styles.modalValue}>{oficialRegistrado.rango}</Text>
                  </View>
                </View>
              )}
              
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowModalConfirmacion(false);
                  setOficialRegistrado(null);
                }}>
                <Text style={styles.modalButtonText}>Cerrar</Text>
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
  inputDisabled: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    borderColor: '#666666',
    color: '#666666',
    opacity: 0.6,
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
  sectionSubtitle: {
    fontSize: 12,
    color: '#FF6B60',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  helperText: {
    fontSize: 12,
    color: '#D4AF37',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  hijoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  hijoInfo: {
    flex: 1,
  },
  hijoText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 4,
  },
  hijoTextSmall: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hijoForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  hijoFormButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addHijoButton: {
    backgroundColor: '#00247D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0033A0',
  },
  addHijoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelHijoButton: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  cancelHijoButtonText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '600',
  },
  // Estilos para navegación
  navButtons: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 12,
    padding: 5,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  navButtonActive: {
    backgroundColor: '#00247D',
    borderWidth: 1,
    borderColor: '#0033A0',
  },
  navButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Estilos para lista de oficiales
  listaContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#000000',
  },
  refreshButton: {
    backgroundColor: '#00247D',
    paddingHorizontal: 20,
    marginLeft: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0033A0',
  },
  refreshButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  infoContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  infoText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  emptyText: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#00247D',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0033A0',
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: 500,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tableRowEven: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  tableCell: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  // Estilos para modal de confirmación
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 25,
    width: '90%',
    maxWidth: 500,
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    flex: 1,
  },
  modalClose: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  modalLabel: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: '600',
    flex: 1,
  },
  modalValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  modalButton: {
    backgroundColor: '#00247D',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0033A0',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RRHHScreen;

