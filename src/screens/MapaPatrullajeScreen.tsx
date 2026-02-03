import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import {
  requestLocationPermission,
  getCurrentLocation,
} from '../services/locationService';
import {
  iniciarPatrullaje,
  finalizarPatrullaje,
  actualizarUbicacion,
  obtenerPatrullajesActivos,
} from '../services/patrullajeService';

// Nota: react-native-maps se instalará después
// import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

interface MapaPatrullajeScreenProps {
  navigation: any;
  route: any;
}

interface Patrullero {
  id: string;
  credencial: string;
  nombre: string;
  apellido: string;
  latitud: number;
  longitud: number;
  color: 'rojo' | 'azul';
  ultimaActualizacion: string;
}

const MapaPatrullajeScreen: React.FC<MapaPatrullajeScreenProps> = ({
  navigation,
  route,
}) => {
  const funcionario = route.params?.funcionario;

  const [patrullajeActivo, setPatrullajeActivo] = useState(false);
  const [miUbicacion, setMiUbicacion] = useState<any>(null);
  const [patrulleros, setPatrulleros] = useState<Patrullero[]>([]);
  const [loading, setLoading] = useState(true);
  const [patrullajeId, setPatrullajeId] = useState<string | null>(null);

  // Intervalo para actualizar ubicación
  const locationInterval = useRef<any>(null);
  const patrullerosInterval = useRef<any>(null);

  useEffect(() => {
    solicitarPermisoYCargarMapa();

    return () => {
      // Limpiar intervalos al salir
      if (locationInterval.current) {
        clearInterval(locationInterval.current);
      }
      if (patrullerosInterval.current) {
        clearInterval(patrullerosInterval.current);
      }
    };
  }, []);

  const solicitarPermisoYCargarMapa = async () => {
    try {
      // Solicitar permiso de ubicación
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        Alert.alert(
          'Permiso Requerido',
          'Se necesita acceso a la ubicación para usar el patrullaje',
          [
            {text: 'Cancelar', onPress: () => navigation.goBack()},
            {text: 'Reintentar', onPress: solicitarPermisoYCargarMapa},
          ],
        );
        return;
      }

      // Obtener ubicación actual
      const location = await getCurrentLocation();
      setMiUbicacion(location);

      setLoading(false);
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
      setLoading(false);
    }
  };

  const handleIniciarPatrullaje = async () => {
    if (!miUbicacion) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
      return;
    }

    try {
      const response = await iniciarPatrullaje(
        miUbicacion.latitud,
        miUbicacion.longitud,
      );

      if (response.success) {
        setPatrullajeActivo(true);
        setPatrullajeId(response.data.patrullajeId);

        Alert.alert('✅ Patrullaje Iniciado', 'Tu ubicación está siendo rastreada');

        // Iniciar actualización de ubicación cada 30 segundos
        locationInterval.current = setInterval(() => {
          actualizarMiUbicacion();
        }, 30000);

        // Obtener patrulleros activos cada 10 segundos
        cargarPatrullerosActivos();
        patrullerosInterval.current = setInterval(() => {
          cargarPatrullerosActivos();
        }, 10000);
      } else {
        Alert.alert('Error', response.message || 'No se pudo iniciar patrullaje');
      }
    } catch (error) {
      console.error('Error al iniciar patrullaje:', error);
      Alert.alert('Error', 'No se pudo iniciar el patrullaje');
    }
  };

  const handleFinalizarPatrullaje = () => {
    Alert.alert(
      'Finalizar Patrullaje',
      '¿Estás seguro que deseas finalizar el patrullaje?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Finalizar', onPress: finalizarPatrullajeConfirmado},
      ],
    );
  };

  const finalizarPatrullajeConfirmado = async () => {
    try {
      if (patrullajeId) {
        const response = await finalizarPatrullaje(patrullajeId);

        if (response.success) {
          // Limpiar intervalos
          if (locationInterval.current) {
            clearInterval(locationInterval.current);
          }
          if (patrullerosInterval.current) {
            clearInterval(patrullerosInterval.current);
          }

          Alert.alert('Patrullaje Finalizado', 'Has finalizado tu patrullaje', [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
        }
      }
    } catch (error) {
      console.error('Error al finalizar patrullaje:', error);
      Alert.alert('Error', 'No se pudo finalizar el patrullaje');
    }
  };

  const actualizarMiUbicacion = async () => {
    try {
      const location = await getCurrentLocation();
      setMiUbicacion(location);

      if (patrullajeId) {
        await actualizarUbicacion(
          patrullajeId,
          location.latitud,
          location.longitud,
        );
      }
    } catch (error) {
      console.error('Error al actualizar ubicación:', error);
    }
  };

  const cargarPatrullerosActivos = async () => {
    try {
      const response = await obtenerPatrullajesActivos();

      if (response.success) {
        setPatrulleros(response.data);
      }
    } catch (error) {
      console.error('Error al cargar patrulleros:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
        <Text style={styles.loadingSubtext}>Solicitando permiso de ubicación</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Patrullaje Activo</Text>
          <Text style={styles.headerSubtitle}>
            {funcionario?.nombre} {funcionario?.apellido}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            patrullajeActivo ? styles.statusActive : styles.statusInactive,
          ]}>
          <Text style={styles.statusText}>
            {patrullajeActivo ? '🟢 Activo' : '⚪ Inactivo'}
          </Text>
        </View>
      </View>

      {/* Mapa - Por ahora mostramos un placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>
            📍 Mapa de Venezuela con GPS
          </Text>
          <Text style={styles.mapInfo}>
            {miUbicacion
              ? `Tu ubicación:\nLat: ${miUbicacion.latitud.toFixed(6)}\nLon: ${miUbicacion.longitud.toFixed(6)}`
              : 'Obteniendo ubicación...'}
          </Text>
          
          {/* Simulación de mapa */}
          <View style={styles.mapSimulation}>
            <Text style={styles.mapSimulationTitle}>
              🗺️ Mapa (react-native-maps)
            </Text>
            <Text style={styles.mapSimulationSubtitle}>
              {patrulleros.length} patrulleros activos
            </Text>
            
            {/* Puntos parpadeantes simulados */}
            {patrulleros.slice(0, 3).map((p, index) => (
              <View key={index} style={styles.patrulleroInfo}>
                <PuntoParpadeanteSimulado color={p.color} />
                <Text style={styles.patrulleroText}>
                  {p.nombre} - {p.credencial}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* NOTA IMPORTANTE */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>⚠️ Nota de Desarrollo:</Text>
          <Text style={styles.noteText}>
            El mapa real con react-native-maps se mostrará aquí. Necesitas
            instalar: npm install react-native-maps
          </Text>
        </View>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        {!patrullajeActivo ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleIniciarPatrullaje}>
            <Text style={styles.startButtonText}>🚓 Iniciar Patrullaje</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ✅ Patrullaje en curso
              </Text>
              <Text style={styles.infoSubtext}>
                Tu ubicación se actualiza cada 30 segundos
              </Text>
            </View>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleFinalizarPatrullaje}>
              <Text style={styles.stopButtonText}>⏹️ Finalizar Patrullaje</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de patrulleros */}
      {patrullajeActivo && (
        <View style={styles.patrullerosCounter}>
          <Text style={styles.counterText}>
            👥 {patrulleros.length} patrulleros en línea
          </Text>
        </View>
      )}
    </View>
  );
};

// Componente para simular punto parpadeante
const PuntoParpadeanteSimulado: React.FC<{color: 'rojo' | 'azul'}> = ({
  color,
}) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.puntoParpadeante,
        {
          backgroundColor: color === 'rojo' ? '#EF4444' : '#3B82F6',
          opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E5E7EB',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: '#10B981',
  },
  statusInactive: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  mapInfo: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  mapSimulation: {
    marginTop: 30,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  mapSimulationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  mapSimulationSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
  },
  patrulleroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  patrulleroText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
  },
  puntoParpadeante: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  noteContainer: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderTopWidth: 2,
    borderTopColor: '#F59E0B',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  controls: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  startButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#DBEAFE',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 13,
    color: '#3B82F6',
  },
  stopButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  stopButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
  patrullerosCounter: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 80,
    right: 20,
    backgroundColor: '#1F2937',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MapaPatrullajeScreen;

