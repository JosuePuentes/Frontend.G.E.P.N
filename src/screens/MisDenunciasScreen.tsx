import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {obtenerMisDenuncias} from '../services/apiService';

type MisDenunciasScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MisDenuncias'
>;

interface Props {
  navigation: MisDenunciasScreenNavigationProp;
}

interface Denuncia {
  _id: string;
  denuncia: {
    motivo: string;
    hechos: string;
  };
  estado: string;
  fechaCreacion: string;
}

const MisDenunciasScreen: React.FC<Props> = ({navigation}) => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDenuncias = async () => {
    try {
      setLoading(true);
      const resultado = await obtenerMisDenuncias();
      
      if (resultado.success) {
        setDenuncias(resultado.data || []);
      } else {
        Alert.alert('Error', 'No se pudieron cargar tus denuncias');
      }
    } catch (error) {
      console.error('Error al cargar denuncias:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar tus denuncias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarDenuncias();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    cargarDenuncias();
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

  const getEstadoDescripcion = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'Tu denuncia está siendo revisada';
      case 'En Proceso':
        return 'Tu denuncia está en proceso de investigación';
      case 'Resuelta':
        return 'Tu denuncia ha sido resuelta';
      case 'Archivada':
        return 'Tu denuncia ha sido archivada';
      default:
        return '';
    }
  };

  const renderItem = ({item}: {item: Denuncia}) => (
    <View style={styles.denunciaCard}>
      <View style={styles.denunciaHeader}>
        <Text style={styles.denunciaMotivo}>{item.denuncia.motivo}</Text>
        <View
          style={[
            styles.estadoBadge,
            {backgroundColor: getEstadoColor(item.estado)},
          ]}>
          <Text style={styles.estadoText}>{item.estado}</Text>
        </View>
      </View>
      <Text style={styles.estadoDescripcion}>
        {getEstadoDescripcion(item.estado)}
      </Text>
      <Text style={styles.hechosPreview} numberOfLines={3}>
        {item.denuncia.hechos}
      </Text>
      <Text style={styles.fechaText}>
        Fecha: {formatearFecha(item.fechaCreacion)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Denuncias</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Cargando denuncias...</Text>
        </View>
      ) : denuncias.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No has realizado ninguna denuncia</Text>
          <TouchableOpacity
            style={styles.nuevaDenunciaButton}
            onPress={() => navigation.navigate('Denuncia')}>
            <Text style={styles.nuevaDenunciaButtonText}>
              Realizar Nueva Denuncia
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={denuncias}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
  listContent: {
    padding: 15,
  },
  denunciaCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  denunciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  denunciaMotivo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  estadoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  estadoDescripcion: {
    fontSize: 14,
    color: '#D4AF37',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  hechosPreview: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 10,
  },
  fechaText: {
    fontSize: 12,
    color: '#999',
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
    padding: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  nuevaDenunciaButton: {
    backgroundColor: '#CF142B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  nuevaDenunciaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MisDenunciasScreen;


