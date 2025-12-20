import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  // Importar imágenes (las imágenes deben estar en src/assets/images/)
  // Si las imágenes no existen, el require fallará - agrega las imágenes primero
  let banderaVenezuela: ImageSourcePropType | null = null;
  let policiasTacticos: ImageSourcePropType | null = null;
  let patrullas: ImageSourcePropType | null = null;

  try {
    banderaVenezuela = require('../../assets/images/bandera-venezuela.png');
  } catch (e) {
    console.warn('Imagen bandera-venezuela.png no encontrada');
  }

  try {
    policiasTacticos = require('../../assets/images/policias-tacticos.png');
  } catch (e) {
    console.warn('Imagen policias-tacticos.png no encontrada');
  }

  try {
    patrullas = require('../../assets/images/patrullas.png');
  } catch (e) {
    console.warn('Imagen patrullas.png no encontrada');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Bandera de Venezuela */}
          {banderaVenezuela && (
            <View style={styles.flagContainer}>
              <Image
                source={banderaVenezuela}
                style={styles.flagImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Título Principal */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleMain}>Gestión Especial</Text>
            <Text style={styles.titleMain}>Policial Nacional</Text>
            <View style={styles.acronymContainer}>
              <Text style={styles.acronym}>G.E.P.N</Text>
            </View>
          </View>

          {/* Imágenes de policías y patrullas */}
          <View style={styles.imagesContainer}>
            {policiasTacticos && (
              <View style={styles.imageWrapper}>
                <Image
                  source={policiasTacticos}
                  style={styles.featureImage}
                  resizeMode="contain"
                />
              </View>
            )}
            {patrullas && (
              <View style={styles.imageWrapper}>
                <Image
                  source={patrullas}
                  style={styles.featureImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>

          {/* Botón de Inicio de Sesión */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginPolicial')}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  flagContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  flagImage: {
    width: 120,
    height: 80,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleMain: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  acronymContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#000000',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  acronym: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37', // Dorado
    letterSpacing: 4,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  featureImage: {
    width: '100%',
    height: 150,
    maxWidth: 150,
  },
  loginButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 10,
    minWidth: 250,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  loginButtonText: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default HomeScreen;

