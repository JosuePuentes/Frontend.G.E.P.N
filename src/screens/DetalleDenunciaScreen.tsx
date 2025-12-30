import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {obtenerDenuncia, actualizarEstadoDenuncia} from '../services/apiService';

type DetalleDenunciaScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DetalleDenuncia'
>;

type DetalleDenunciaScreenRouteProp = RouteProp<
  RootStackParamList,
  'DetalleDenuncia'
>;

interface Props {
  navigation: DetalleDenunciaScreenNavigationProp;
  route: DetalleDenunciaScreenRouteProp;
}

interface Denuncia {
  _id: string;
  denunciante: {
    nombre: string;
    cedula: string;
    telefono: string;
    fechaNacimiento: string;
    estado: string;
    municipio: string;
    parroquia: string;
  };
  denuncia: {
    motivo: string;
    hechos: string;
  };
  denunciado?: {
    nombre?: string;
    direccion?: string;
    estado?: string;
    municipio?: string;
    parroquia?: string;
  };
  estado: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
}

const ESTADOS = ['Pendiente', 'En Proceso', 'Resuelta', 'Archivada'];

const DetalleDenunciaScreen: React.FC<Props> = ({navigation, route}) => {
  const {denunciaId} = route.params;
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null);
  const [loading, setLoading] = useState(true);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  useEffect(() => {
    cargarDenuncia();
  }, [denunciaId]);

  const cargarDenuncia = async () => {
    try {
      setLoading(true);
      const resultado = await obtenerDenuncia(denunciaId);
      
      if (resultado.success && resultado.data) {
        setDenuncia(resultado.data);
      } else {
        Alert.alert('Error', 'No se pudo cargar la denuncia');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error al cargar denuncia:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar la denuncia');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (nuevoEstado: string) => {
    if (nuevoEstado === denuncia?.estado) {
      setShowEstadoModal(false);
      return;
    }

    try {
      setCambiandoEstado(true);
      const resultado = await actualizarEstadoDenuncia(denunciaId, nuevoEstado);
      
      if (resultado.success) {
        Alert.alert('Éxito', resultado.message || 'Estado actualizado correctamente');
        setShowEstadoModal(false);
        // Recargar la denuncia para obtener el estado actualizado
        await cargarDenuncia();
      } else {
        Alert.alert('Error', resultado.message || 'No se pudo actualizar el estado');
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      Alert.alert('Error', 'Ocurrió un error al cambiar el estado');
    } finally {
      setCambiandoEstado(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return fecha;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return '#FFA500';
      case 'En Proceso':
        return '#2196F3';
      case 'Resuelta':
        return '#4CAF50';
      case 'Archivada':
        return '#757575';
      default:
        return '#999';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de Denuncia</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Cargando denuncia...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!denuncia) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de Denuncia</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontró la denuncia</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Denuncia</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Estado actual */}
        <View style={styles.section}>
          <View style={styles.estadoContainer}>
            <Text style={styles.sectionTitle}>Estado Actual</Text>
            <View
              style={[
                styles.estadoBadge,
                {backgroundColor: getEstadoColor(denuncia.estado)},
              ]}>
              <Text style={styles.estadoText}>{denuncia.estado}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.cambiarEstadoButton}
            onPress={() => setShowEstadoModal(true)}
            disabled={cambiandoEstado}>
            <Text style={styles.cambiarEstadoButtonText}>Cambiar Estado</Text>
          </TouchableOpacity>
        </View>

        {/* Información de la Denuncia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Denuncia</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Motivo:</Text>
            <Text style={styles.infoValue}>{denuncia.denuncia.motivo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hechos:</Text>
            <Text style={styles.infoValue}>{denuncia.denuncia.hechos}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha de Creación:</Text>
            <Text style={styles.infoValue}>
              {formatearFecha(denuncia.fechaCreacion)}
            </Text>
          </View>
          {denuncia.fechaActualizacion && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Última Actualización:</Text>
              <Text style={styles.infoValue}>
                {formatearFecha(denuncia.fechaActualizacion)}
              </Text>
            </View>
          )}
        </View>

        {/* Datos del Denunciante */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Denunciante</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{denuncia.denunciante.nombre}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cédula:</Text>
            <Text style={styles.infoValue}>{denuncia.denunciante.cedula}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>{denuncia.denunciante.telefono}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha de Nacimiento:</Text>
            <Text style={styles.infoValue}>
              {denuncia.denunciante.fechaNacimiento}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ubicación:</Text>
            <Text style={styles.infoValue}>
              {denuncia.denunciante.parroquia}, {denuncia.denunciante.municipio},{' '}
              {denuncia.denunciante.estado}
            </Text>
          </View>
        </View>

        {/* Datos del Denunciado */}
        {denuncia.denunciado && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del Denunciado</Text>
            {denuncia.denunciado.nombre && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nombre:</Text>
                <Text style={styles.infoValue}>
                  {denuncia.denunciado.nombre}
                </Text>
              </View>
            )}
            {denuncia.denunciado.direccion && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dirección:</Text>
                <Text style={styles.infoValue}>
                  {denuncia.denunciado.direccion}
                </Text>
              </View>
            )}
            {denuncia.denunciado.estado && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ubicación:</Text>
                <Text style={styles.infoValue}>
                  {denuncia.denunciado.parroquia || ''},{' '}
                  {denuncia.denunciado.municipio || ''},{' '}
                  {denuncia.denunciado.estado}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal para cambiar estado */}
      <Modal
        visible={showEstadoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEstadoModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cambiar Estado</Text>
              <TouchableOpacity onPress={() => setShowEstadoModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {ESTADOS.map(estado => (
                <TouchableOpacity
                  key={estado}
                  style={[
                    styles.modalItem,
                    denuncia.estado === estado && styles.modalItemActive,
                  ]}
                  onPress={() => cambiarEstado(estado)}
                  disabled={cambiandoEstado}>
                  <Text
                    style={[
                      styles.modalItemText,
                      denuncia.estado === estado && styles.modalItemTextActive,
                    ]}>
                    {estado}
                  </Text>
                  {denuncia.estado === estado && (
                    <Text style={styles.modalItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            {cambiandoEstado && (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="small" color="#D4AF37" />
              </View>
            )}
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
    marginBottom: 20,
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
    marginBottom: 15,
  },
  estadoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  estadoBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  estadoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cambiarEstadoButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cambiarEstadoButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#CCCCCC',
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemActive: {
    backgroundColor: '#2a2a2a',
  },
  modalItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalItemTextActive: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  modalItemCheck: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalLoading: {
    padding: 20,
    alignItems: 'center',
  },
});

export default DetalleDenunciaScreen;

