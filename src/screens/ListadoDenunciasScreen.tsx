import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {listarDenuncias} from '../services/apiService';

type ListadoDenunciasScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ListadoDenuncias'
>;

interface Props {
  navigation: ListadoDenunciasScreenNavigationProp;
}

interface Denuncia {
  _id: string;
  denunciante: {
    nombre: string;
    cedula: string;
    telefono: string;
  };
  denuncia: {
    motivo: string;
    hechos: string;
  };
  estado: string;
  fechaCreacion: string;
}

const ESTADOS = ['Pendiente', 'En Proceso', 'Resuelta', 'Archivada'];

const ListadoDenunciasScreen: React.FC<Props> = ({navigation}) => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState<string | undefined>(undefined);
  const [showFiltros, setShowFiltros] = useState(false);

  const cargarDenuncias = async (pagina: number = 1, estado?: string) => {
    try {
      setLoading(pagina === 1);
      const resultado = await listarDenuncias(pagina, 20, estado);
      
      if (resultado.success) {
        if (pagina === 1) {
          setDenuncias(resultado.data || []);
        } else {
          setDenuncias(prev => [...prev, ...(resultado.data || [])]);
        }
        setTotalPages(resultado.totalPages || 1);
        setPage(pagina);
      } else {
        Alert.alert('Error', 'No se pudieron cargar las denuncias');
      }
    } catch (error) {
      console.error('Error al cargar denuncias:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar las denuncias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarDenuncias(1, estadoFiltro);
  }, [estadoFiltro]);

  const onRefresh = () => {
    setRefreshing(true);
    cargarDenuncias(1, estadoFiltro);
  };

  const cargarMas = () => {
    if (page < totalPages && !loading) {
      cargarDenuncias(page + 1, estadoFiltro);
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

  const renderItem = ({item}: {item: Denuncia}) => (
    <TouchableOpacity
      style={styles.denunciaCard}
      onPress={() => navigation.navigate('DetalleDenuncia', {denunciaId: item._id})}>
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
      <View style={styles.denunciaInfo}>
        <Text style={styles.denuncianteText}>
          Denunciante: {item.denunciante.nombre} (C.I: {item.denunciante.cedula})
        </Text>
        <Text style={styles.fechaText}>
          Fecha: {formatearFecha(item.fechaCreacion)}
        </Text>
      </View>
      <Text style={styles.hechosPreview} numberOfLines={2}>
        {item.denuncia.hechos}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listado de Denuncias</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFiltros(!showFiltros)}>
          <Text style={styles.filterButtonText}>Filtros</Text>
        </TouchableOpacity>
      </View>

      {showFiltros && (
        <View style={styles.filtrosContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filtroChip,
                !estadoFiltro && styles.filtroChipActive,
              ]}
              onPress={() => setEstadoFiltro(undefined)}>
              <Text
                style={[
                  styles.filtroChipText,
                  !estadoFiltro && styles.filtroChipTextActive,
                ]}>
                Todas
              </Text>
            </TouchableOpacity>
            {ESTADOS.map(estado => (
              <TouchableOpacity
                key={estado}
                style={[
                  styles.filtroChip,
                  estadoFiltro === estado && styles.filtroChipActive,
                ]}
                onPress={() => setEstadoFiltro(estado)}>
                <Text
                  style={[
                    styles.filtroChipText,
                    estadoFiltro === estado && styles.filtroChipTextActive,
                  ]}>
                  {estado}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Cargando denuncias...</Text>
        </View>
      ) : denuncias.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay denuncias disponibles</Text>
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
          onEndReached={cargarMas}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            page < totalPages ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#D4AF37" />
              </View>
            ) : null
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
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  filterButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  filtrosContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  filtroChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  filtroChipActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  filtroChipText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  filtroChipTextActive: {
    color: '#000000',
    fontWeight: 'bold',
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
  denunciaInfo: {
    marginBottom: 10,
  },
  denuncianteText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 5,
  },
  fechaText: {
    fontSize: 12,
    color: '#999',
  },
  hechosPreview: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
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
  footerLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ListadoDenunciasScreen;


