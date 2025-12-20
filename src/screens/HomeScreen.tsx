import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  // Colores de la bandera de Venezuela
  const amarillo = '#FFCC02'; // Amarillo
  const azul = '#00247D'; // Azul
  const rojo = '#CF142B'; // Rojo
  const dorado = '#D4AF37'; // Dorado

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Línea horizontal con colores de la bandera de Venezuela */}
          <View style={styles.flagLineContainer}>
            <View style={[styles.flagLineStrip, {backgroundColor: amarillo}]} />
            <View style={[styles.flagLineStrip, {backgroundColor: azul}]} />
            <View style={[styles.flagLineStrip, {backgroundColor: rojo}]} />
          </View>

          {/* Título Principal */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleMain}>Gestión Especial</Text>
            <Text style={styles.titleMain}>Policial Nacional</Text>
            <View style={styles.acronymContainer}>
              <Text style={styles.acronym}>G.E.P.N</Text>
            </View>
          </View>

          {/* 4 Iconos con colores de la bandera */}
          <View style={styles.iconsContainer}>
            <View style={[styles.iconBox, {borderColor: amarillo}]}>
              <View style={[styles.iconCircle, {backgroundColor: amarillo, borderColor: amarillo}]} />
              <Text style={[styles.iconText, {color: amarillo}]}>
                Detenidos
              </Text>
            </View>

            <View style={[styles.iconBox, {borderColor: azul}]}>
              <View style={[styles.iconCircle, {backgroundColor: azul, borderColor: azul}]} />
              <Text style={[styles.iconText, {color: azul}]}>Minutas</Text>
            </View>

            <View style={[styles.iconBox, {borderColor: rojo}]}>
              <View style={[styles.iconCircle, {backgroundColor: rojo, borderColor: rojo}]} />
              <Text style={[styles.iconText, {color: rojo}]}>Búsqueda</Text>
            </View>

            <View style={[styles.iconBox, {borderColor: dorado}]}>
              <View style={[styles.iconCircle, {backgroundColor: dorado, borderColor: dorado}]} />
              <Text style={[styles.iconText, {color: dorado}]}>
                Más Buscados
              </Text>
            </View>
          </View>

          {/* Botón de Inicio de Sesión */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginPolicial')}
            activeOpacity={0.8}>
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
    backgroundColor: '#000000', // Fondo negro
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
  flagLineContainer: {
    width: '100%',
    height: 8,
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 4,
    overflow: 'hidden',
  },
  flagLineStrip: {
    flex: 1,
    height: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleMain: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texto blanco sobre fondo negro
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 1,
  },
  acronymContainer: {
    marginTop: 15,
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#D4AF37', // Dorado
  },
  acronym: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37', // Dorado
    letterSpacing: 5,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  iconBox: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 3,
    backgroundColor: '#1a1a1a',
    minHeight: 120,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
    borderWidth: 3,
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 12,
    minWidth: 250,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#D4AF37', // Dorado
  },
  loginButtonText: {
    color: '#D4AF37', // Dorado
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});

export default HomeScreen;

