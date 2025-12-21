// Datos de Estados, Municipios y Parroquias de Venezuela

export interface Estado {
  id: string;
  nombre: string;
  municipios: Municipio[];
}

export interface Municipio {
  id: string;
  nombre: string;
  parroquias: string[];
}

export const estadosVenezuela: Estado[] = [
  {
    id: '01',
    nombre: 'Amazonas',
    municipios: [
      {
        id: '0101',
        nombre: 'Alto Orinoco',
        parroquias: ['La Esmeralda', 'Huachamacare', 'Marawaka', 'Mavaca', 'Sierra Parima'],
      },
      {
        id: '0102',
        nombre: 'Atabapo',
        parroquias: ['Ucata', 'Yapacana', 'Caname', 'La Guadalupe'],
      },
      {
        id: '0103',
        nombre: 'Atures',
        parroquias: ['Fernando Girón Tovar', 'Luis Alberto Gómez', 'Pahueña', 'Platanillal'],
      },
      {
        id: '0104',
        nombre: 'Autana',
        parroquias: ['Samariapo', 'Sipapo', 'Munduapo', 'Guayapo'],
      },
      {
        id: '0105',
        nombre: 'Manapiare',
        parroquias: ['Alto Ventuari', 'Medio Ventuari', 'Bajo Ventuari'],
      },
      {
        id: '0106',
        nombre: 'Maroa',
        parroquias: ['Victorino', 'Comunidad'],
      },
      {
        id: '0107',
        nombre: 'Río Negro',
        parroquias: ['Casiquiare', 'Cocuy', 'San Carlos de Río Negro', 'Solano'],
      },
    ],
  },
  {
    id: '02',
    nombre: 'Anzoátegui',
    municipios: [
      {
        id: '0201',
        nombre: 'Anaco',
        parroquias: ['San Joaquín', 'Cachipo'],
      },
      {
        id: '0202',
        nombre: 'Aragua',
        parroquias: ['Aragua de Barcelona', 'Cachipo', 'El Carmen', 'El Pilar', 'Naricual', 'San Cristóbal'],
      },
      {
        id: '0203',
        nombre: 'Bolívar',
        parroquias: ['Bergantín', 'Caigua', 'El Carmen', 'El Pilar', 'Naricual', 'San Cristóbal'],
      },
      {
        id: '0204',
        nombre: 'Bruzual',
        parroquias: ['Clarines', 'Guanape', 'Sabana de Uchire'],
      },
      {
        id: '0205',
        nombre: 'Cajigal',
        parroquias: ['Onoto', 'San Pablo'],
      },
      {
        id: '0206',
        nombre: 'Carvajal',
        parroquias: ['Valle de Guanape', 'Santa Bárbara'],
      },
      {
        id: '0207',
        nombre: 'Freites',
        parroquias: ['Atapirire', 'Boca del Pao', 'El Pao', 'Maturín'],
      },
      {
        id: '0208',
        nombre: 'Guanipa',
        parroquias: ['San José de Guanipa'],
      },
      {
        id: '0209',
        nombre: 'Guanta',
        parroquias: ['Guanta', 'Chorrerón'],
      },
      {
        id: '0210',
        nombre: 'Independencia',
        parroquias: ['Mamo', 'Soledad'],
      },
      {
        id: '0211',
        nombre: 'Libertad',
        parroquias: ['San Mateo', 'El Carito', 'Santa Inés', 'La Romereña'],
      },
      {
        id: '0212',
        nombre: 'McGregor',
        parroquias: ['El Chaparro', 'Tomás Alfaro', 'Calatrava'],
      },
      {
        id: '0213',
        nombre: 'Miranda',
        parroquias: ['Aguasay', 'Aragua de Maturín', 'Chaguaramas', 'El Pinto', 'Guanaguana', 'La Toscana', 'Taguaya'],
      },
      {
        id: '0214',
        nombre: 'Monagas',
        parroquias: ['Caripe', 'El Guácharo', 'La Guanota', 'Sabana de Piedra', 'San Agustín', 'Teresen', 'Caripe'],
      },
      {
        id: '0215',
        nombre: 'Peñalver',
        parroquias: ['Aragua de Barcelona', 'Cachipo', 'El Carmen', 'El Pilar', 'Naricual', 'San Cristóbal'],
      },
      {
        id: '0216',
        nombre: 'Píritu',
        parroquias: ['Píritu', 'San Francisco'],
      },
      {
        id: '0217',
        nombre: 'San Juan de Capistrano',
        parroquias: ['Boca de Uchire', 'Boca de Chávez'],
      },
      {
        id: '0218',
        nombre: 'Santa Ana',
        parroquias: ['Pueblo Nuevo', 'Santa Ana'],
      },
      {
        id: '0219',
        nombre: 'Simón Rodríguez',
        parroquias: ['El Tejero', 'Pariaguán'],
      },
      {
        id: '0220',
        nombre: 'Sotillo',
        parroquias: ['Cantaura', 'Libertador', 'Santa Ana', 'Urica'],
      },
      {
        id: '0221',
        nombre: 'Urbaneja',
        parroquias: ['Lechería', 'El Morro'],
      },
    ],
  },
  {
    id: '03',
    nombre: 'Apure',
    municipios: [
      {
        id: '0301',
        nombre: 'Achaguas',
        parroquias: ['Achaguas', 'Apurito', 'El Yagual', 'Guachara', 'Mucuritas', 'Queseras del Medio'],
      },
      {
        id: '0302',
        nombre: 'Biruaca',
        parroquias: ['Biruaca'],
      },
      {
        id: '0303',
        nombre: 'Muñoz',
        parroquias: ['Bruzual', 'Mantecal', 'Quintero', 'Rincón Hondo', 'San Vicente'],
      },
      {
        id: '0304',
        nombre: 'Páez',
        parroquias: ['Guasdualito', 'Aramendi', 'El Amparo', 'San Camilo', 'Urdaneta'],
      },
      {
        id: '0305',
        nombre: 'Pedro Camejo',
        parroquias: ['Cunaviche', 'San Juan de Payara', 'San Rafael de Atamaica'],
      },
      {
        id: '0306',
        nombre: 'Rómulo Gallegos',
        parroquias: ['Elorza', 'La Trinidad'],
      },
      {
        id: '0307',
        nombre: 'San Fernando',
        parroquias: ['San Fernando', 'El Recreo', 'Peñalver', 'San Rafael de Atamaica'],
      },
    ],
  },
  {
    id: '04',
    nombre: 'Aragua',
    municipios: [
      {
        id: '0401',
        nombre: 'Bolívar',
        parroquias: ['Camatagua', 'Carmen de Cura'],
      },
      {
        id: '0402',
        nombre: 'Camatagua',
        parroquias: ['Camatagua'],
      },
      {
        id: '0403',
        nombre: 'Francisco Linares Alcántara',
        parroquias: ['Santa Rita', 'Francisco de Miranda', 'Moseñor Feliciano González'],
      },
      {
        id: '0404',
        nombre: 'Girardot',
        parroquias: ['Andrés Eloy Blanco', 'Choroní', 'Joaquín Crespo', 'Pedro Célestino Muñoz', 'José Casas Godett', 'Los Tacariguas'],
      },
      {
        id: '0405',
        nombre: 'José Ángel Álamo',
        parroquias: ['Santos Michelena', 'Tiara'],
      },
      {
        id: '0406',
        nombre: 'José Félix Ribas',
        parroquias: ['Cagua', 'Bella Vista'],
      },
      {
        id: '0407',
        nombre: 'José Rafael Revenga',
        parroquias: ['El Consejo', 'Pueblo de Colón'],
      },
      {
        id: '0408',
        nombre: 'Libertador',
        parroquias: ['Palo Negro', 'San Martín de Porres'],
      },
      {
        id: '0409',
        nombre: 'Mario Briceño Iragorry',
        parroquias: ['Caña de Azúcar', 'Ocumare de la Costa'],
      },
      {
        id: '0410',
        nombre: 'Ocumare de la Costa de Oro',
        parroquias: ['San Casimiro', 'Güiripa', 'Ollas de Caramacate', 'Valle Morín'],
      },
      {
        id: '0411',
        nombre: 'San Casimiro',
        parroquias: ['Guiripa', 'Ollas de Caramacate', 'Valle Morín'],
      },
      {
        id: '0412',
        nombre: 'San Sebastián',
        parroquias: ['Canelones', 'Cantagallo', 'Paracotos', 'San Sebastián'],
      },
      {
        id: '0413',
        nombre: 'Santiago Mariño',
        parroquias: ['Alfredo Pacheco Miranda', 'Arevalo Aponte', 'Chuao', 'Samán de Güere', 'Turmero'],
      },
      {
        id: '0414',
        nombre: 'Santos Michelena',
        parroquias: ['Las Tejerías', 'Tiara'],
      },
      {
        id: '0415',
        nombre: 'Sucre',
        parroquias: ['Cagua', 'Bella Vista'],
      },
      {
        id: '0416',
        nombre: 'Tovar',
        parroquias: ['Colonia Tovar'],
      },
      {
        id: '0417',
        nombre: 'Urdaneta',
        parroquias: ['Barbacoas', 'San Francisco de Cara', 'Taguay'],
      },
      {
        id: '0418',
        nombre: 'Zamora',
        parroquias: ['Villa de Cura', 'Magdaleno', 'San Francisco de Asís', 'Valles de Tucutunemo', 'Augusto Mijares'],
      },
    ],
  },
  {
    id: '05',
    nombre: 'Barinas',
    municipios: [
      {
        id: '0501',
        nombre: 'Alberto Arvelo Torrealba',
        parroquias: ['Sabaneta', 'Juan Antonio Rodríguez Domínguez'],
      },
      {
        id: '0502',
        nombre: 'Andrés Eloy Blanco',
        parroquias: ['El Cantón', 'Santa Cruz de Guacas', 'Puerto Vivas'],
      },
      {
        id: '0503',
        nombre: 'Antonio José de Sucre',
        parroquias: ['Socopó', 'Bum Bum', 'La Mula', 'El Real'],
      },
      {
        id: '0504',
        nombre: 'Arismendi',
        parroquias: ['Arismendi', 'Guadarrama', 'La Unión', 'San Antonio'],
      },
      {
        id: '0505',
        nombre: 'Barinas',
        parroquias: ['Barinas', 'Alberto Arvelo Larriva', 'Alto Barinas', 'Manuel Palacio Fajardo', 'Juan Antonio Rodríguez Domínguez', 'Dominga Ortiz de Páez'],
      },
      {
        id: '0506',
        nombre: 'Bolívar',
        parroquias: ['Barinitas', 'Altamira de Cáceres', 'Calderas', 'Barrancas', 'El Socorro', 'Mazparrito'],
      },
      {
        id: '0507',
        nombre: 'Cruz Paredes',
        parroquias: ['Santa Bárbara', 'Pedro Briceño Méndez', 'Ramón Ignacio Méndez', 'José Ignacio del Pumar'],
      },
      {
        id: '0508',
        nombre: 'Ezequiel Zamora',
        parroquias: ['Santa Bárbara', 'Pedro Briceño Méndez', 'Ramón Ignacio Méndez', 'José Ignacio del Pumar'],
      },
      {
        id: '0509',
        nombre: 'Obispos',
        parroquias: ['Obispos', 'El Real', 'La Luz', 'Los Guasimitos', 'Los Paredones', 'Los Rastrojos'],
      },
      {
        id: '0510',
        nombre: 'Pedraza',
        parroquias: ['Ciudad Bolivia', 'Ignacio Briceño', 'José Félix Ribas', 'Páez', 'Payara', 'Pimpinela', 'Ramón Ignacio Méndez'],
      },
      {
        id: '0511',
        nombre: 'Rojas',
        parroquias: ['Libertad de Barinas', 'Dolores', 'Palacios Fajardo', 'Santa Rosa', 'Simón Rodríguez', 'Alto Barinas'],
      },
      {
        id: '0512',
        nombre: 'Sosa',
        parroquias: ['Ciudad de Nutrias', 'El Regalo', 'Puerto Nutrias', 'Santa Catalina', 'Simón Bolívar'],
      },
    ],
  },
  {
    id: '06',
    nombre: 'Bolívar',
    municipios: [
      {
        id: '0601',
        nombre: 'Angostura',
        parroquias: ['Sección Capital Angostura'],
      },
      {
        id: '0602',
        nombre: 'Caroní',
        parroquias: ['Caroní', 'Cachamay', 'Chirica', 'Dalla Costa', 'Once de Abril', 'Simón Bolívar', 'Unare', 'Universidad', 'Vista al Sol', 'Pozo Verde', 'Yocoima'],
      },
      {
        id: '0603',
        nombre: 'Cedeño',
        parroquias: ['Cedeño', 'Altagracia', 'Ascensión Farreras', 'Guaniamo', 'La Urbana', 'Pijiguaos'],
      },
      {
        id: '0604',
        nombre: 'El Callao',
        parroquias: ['El Callao'],
      },
      {
        id: '0605',
        nombre: 'Gran Sabana',
        parroquias: ['Ikabarú'],
      },
      {
        id: '0606',
        nombre: 'Heres',
        parroquias: ['Catedral', 'Zea', 'Orinoco', 'José Antonio Páez', 'Marhuanta', 'Agua Salada', 'Vista Hermosa', 'La Sabanita', 'Panapana'],
      },
      {
        id: '0607',
        nombre: 'Piar',
        parroquias: ['Andrés Eloy Blanco', 'Pedro Cova', 'Raúl Leoni', 'Barceloneta', 'Santa Bárbara', 'San Francisco'],
      },
      {
        id: '0608',
        nombre: 'Roscio',
        parroquias: ['Roscio', 'Salóm'],
      },
      {
        id: '0609',
        nombre: 'Sifontes',
        parroquias: ['Sifontes', 'Dalla Costa', 'San Isidro'],
      },
      {
        id: '0610',
        nombre: 'Sucre',
        parroquias: ['Sucre', 'Aripao', 'Guarataro', 'Las Majadas', 'Moitaco'],
      },
    ],
  },
  {
    id: '07',
    nombre: 'Carabobo',
    municipios: [
      {
        id: '0701',
        nombre: 'Bejuma',
        parroquias: ['Bejuma', 'Canoabo', 'Simón Bolívar'],
      },
      {
        id: '0702',
        nombre: 'Carlos Arvelo',
        parroquias: ['Güigüe', 'Belén', 'Tacarigua'],
      },
      {
        id: '0703',
        nombre: 'Diego Ibarra',
        parroquias: ['Mariara', 'Aguas Calientes'],
      },
      {
        id: '0704',
        nombre: 'Guacara',
        parroquias: ['Ciudad Alianza', 'Guacara', 'Yagua'],
      },
      {
        id: '0705',
        nombre: 'Juan José Mora',
        parroquias: ['Morón', 'Urama'],
      },
      {
        id: '0706',
        nombre: 'Libertador',
        parroquias: ['Tocuyito', 'Independencia'],
      },
      {
        id: '0707',
        nombre: 'Los Guayos',
        parroquias: ['Los Guayos'],
      },
      {
        id: '0708',
        nombre: 'Miranda',
        parroquias: ['Miranda'],
      },
      {
        id: '0709',
        nombre: 'Montalbán',
        parroquias: ['Montalbán'],
      },
      {
        id: '0710',
        nombre: 'Naguanagua',
        parroquias: ['Naguanagua'],
      },
      {
        id: '0711',
        nombre: 'Puerto Cabello',
        parroquias: ['Bartolomé Salóm', 'Democracia', 'Fraternidad', 'Goaigoaza', 'Juan José Flores', 'Unión', 'Borburata', 'Patanemo'],
      },
      {
        id: '0712',
        nombre: 'San Diego',
        parroquias: ['San Diego'],
      },
      {
        id: '0713',
        nombre: 'San Joaquín',
        parroquias: ['San Joaquín'],
      },
      {
        id: '0714',
        nombre: 'Valencia',
        parroquias: ['Candelaria', 'Catedral', 'El Socorro', 'Miguel Peña', 'Rafael Urdaneta', 'San Blas', 'San José', 'Santa Rosa', 'Negro Primero'],
      },
    ],
  },
  {
    id: '08',
    nombre: 'Cojedes',
    municipios: [
      {
        id: '0801',
        nombre: 'Anzoátegui',
        parroquias: ['Cojedes', 'Juan de Mata Suárez'],
      },
      {
        id: '0802',
        nombre: 'Falcon',
        parroquias: ['Tinaquillo'],
      },
      {
        id: '0803',
        nombre: 'Girardot',
        parroquias: ['El Baúl', 'Sucre'],
      },
      {
        id: '0804',
        nombre: 'Lima Blanco',
        parroquias: ['Macapo', 'La Aguadita'],
      },
      {
        id: '0805',
        nombre: 'Pao de San Juan Bautista',
        parroquias: ['Pao'],
      },
      {
        id: '0806',
        nombre: 'Ricaurte',
        parroquias: ['El Amparo', 'Libertad de Cojedes'],
      },
      {
        id: '0807',
        nombre: 'Rómulo Gallegos',
        parroquias: ['Rómulo Gallegos'],
      },
      {
        id: '0808',
        nombre: 'San Carlos',
        parroquias: ['San Carlos', 'Juan Ángel Bravo', 'Manuel Manrique'],
      },
      {
        id: '0809',
        nombre: 'Tinaco',
        parroquias: ['General en Jefe José Laurencio Silva'],
      },
    ],
  },
  {
    id: '09',
    nombre: 'Delta Amacuro',
    municipios: [
      {
        id: '0901',
        nombre: 'Antonio Díaz',
        parroquias: ['Curiapo', 'Almirante Luis Brión', 'Francisco Aniceto Lugo', 'Manuel Renaud', 'Padre Barral', 'Santos de Abelgas'],
      },
      {
        id: '0902',
        nombre: 'Casacoima',
        parroquias: ['Imataca', 'Juan Bautista Arismendi', 'Manuel Piar', 'Rómulo Gallegos'],
      },
      {
        id: '0903',
        nombre: 'Pedernales',
        parroquias: ['Pedernales', 'Luis Beltrán Prieto Figueroa'],
      },
      {
        id: '0904',
        nombre: 'Tucupita',
        parroquias: ['San José', 'José Vidal Marcano', 'Juan Millán', 'Leonardo Ruíz Pineda', 'Mariscal Antonio José de Sucre', 'Monseñor Argimiro García', 'San Rafael', 'Virgen del Valle'],
      },
    ],
  },
  {
    id: '10',
    nombre: 'Distrito Capital',
    municipios: [
      {
        id: '1001',
        nombre: 'Libertador',
        parroquias: [
          'Alta Gracia',
          'Antímano',
          'Caricuao',
          'Catedral',
          'Coche',
          'El Junquito',
          'El Paraíso',
          'El Recreo',
          'El Valle',
          'La Candelaria',
          'La Pastora',
          'La Vega',
          'Macarao',
          'San Agustín',
          'San Bernardino',
          'San José',
          'San Juan',
          'San Pedro',
          'Santa Rosalía',
          'Santa Teresa',
          'Sucre',
          '23 de Enero',
        ],
      },
    ],
  },
  {
    id: '11',
    nombre: 'Falcón',
    municipios: [
      {
        id: '1101',
        nombre: 'Acosta',
        parroquias: ['Capadare', 'La Pastora', 'Libertador', 'San Juan de los Cayos'],
      },
      {
        id: '1102',
        nombre: 'Bolívar',
        parroquias: ['Aracua', 'La Peña', 'San Luis'],
      },
      {
        id: '1103',
        nombre: 'Buchivacoa',
        parroquias: ['Bariro', 'Borojó', 'Capatárida', 'Guajiro', 'Seque', 'Zazárida', 'Valle de Eroa'],
      },
      {
        id: '1104',
        nombre: 'Cacique Manaure',
        parroquias: ['Cacique Manaure'],
      },
      {
        id: '1105',
        nombre: 'Carirubana',
        parroquias: ['Norte', 'Carirubana', 'Santa Ana', 'Urbana Punta Cardón'],
      },
      {
        id: '1106',
        nombre: 'Colina',
        parroquias: ['Avaria', 'Las Piedras', 'San José de la Costa', 'Zazárida'],
      },
      {
        id: '1107',
        nombre: 'Dabajuro',
        parroquias: ['Dabajuro'],
      },
      {
        id: '1108',
        nombre: 'Democracia',
        parroquias: ['Agua Clara', 'Avaria', 'Pedregal', 'Piedra Grande', 'Purureche'],
      },
      {
        id: '1109',
        nombre: 'Falcón',
        parroquias: ['Adaure', 'Adícora', 'Baraived', 'Buena Vista', 'Jadacaquiva', 'El Vínculo', 'El Hato', 'Moruy', 'Pueblo Nuevo'],
      },
      {
        id: '1110',
        nombre: 'Federación',
        parroquias: ['Churuguara', 'Agua Larga', 'El Paují', 'Independencia', 'Mapararí'],
      },
      {
        id: '1111',
        nombre: 'Jacura',
        parroquias: ['Jacura', 'Agua Linda', 'Araurima', 'Los Taques'],
      },
      {
        id: '1112',
        nombre: 'Los Taques',
        parroquias: ['Los Taques', 'Judibana'],
      },
      {
        id: '1113',
        nombre: 'Mauroa',
        parroquias: ['Mene de Mauroa', 'San Félix', 'Casigua'],
      },
      {
        id: '1114',
        nombre: 'Miranda',
        parroquias: ['Guzmán Guillermo', 'Mitare', 'Río Seco', 'Sabaneta', 'San Antonio', 'San Gabriel', 'Santa Ana', 'Tene', 'Teresa'],
      },
      {
        id: '1115',
        nombre: 'Monseñor Iturriza',
        parroquias: ['El Cayudo', 'José Leonardo Chirino', 'Las Vegas del Tuy'],
      },
      {
        id: '1116',
        nombre: 'Palmasola',
        parroquias: ['Palmasola'],
      },
      {
        id: '1117',
        nombre: 'Petit',
        parroquias: ['Cabure', 'Colina', 'Curimagua'],
      },
      {
        id: '1118',
        nombre: 'Píritu',
        parroquias: ['San José de la Costa', 'Píritu'],
      },
      {
        id: '1119',
        nombre: 'San Francisco',
        parroquias: ['Sucre', 'Pecaya'],
      },
      {
        id: '1120',
        nombre: 'Silva',
        parroquias: ['Bariro', 'Borojó', 'Capatárida', 'Guajiro', 'Seque', 'Zazárida'],
      },
      {
        id: '1121',
        nombre: 'Sucre',
        parroquias: ['Tucacas', 'Boca de Aroa'],
      },
      {
        id: '1122',
        nombre: 'Tocópero',
        parroquias: ['Tocópero'],
      },
      {
        id: '1123',
        nombre: 'Unión',
        parroquias: ['Unión', 'Chichiriviche', 'Boca del Tocuyo', 'Tocuyo de la Costa'],
      },
      {
        id: '1124',
        nombre: 'Urumaco',
        parroquias: ['Urumaco'],
      },
      {
        id: '1125',
        nombre: 'Zamora',
        parroquias: ['Puerto Cumarebo', 'La Ciénaga', 'Las Piedras', 'San José de la Costa', 'Zazárida'],
      },
    ],
  },
  {
    id: '12',
    nombre: 'Guárico',
    municipios: [
      {
        id: '1201',
        nombre: 'Camaguán',
        parroquias: ['Camaguán', 'Puerto Miranda', 'Uverito'],
      },
      {
        id: '1202',
        nombre: 'Chaguaramas',
        parroquias: ['Chaguaramas'],
      },
      {
        id: '1203',
        nombre: 'El Socorro',
        parroquias: ['El Socorro'],
      },
      {
        id: '1204',
        nombre: 'Francisco de Miranda',
        parroquias: ['Calabozo', 'El Calvario', 'El Rastro', 'Guardatinajas'],
      },
      {
        id: '1205',
        nombre: 'José Félix Ribas',
        parroquias: ['Tucupido', 'San Rafael de Laya'],
      },
      {
        id: '1206',
        nombre: 'José Tadeo Monagas',
        parroquias: ['Altagracia de Orituco', 'San Rafael de Orituco', 'San Francisco Javier de Orituco', 'Soublette', 'Lezama', 'Paso Real de Macaira', 'Carlos Soublette', 'San Francisco de Macaira', 'Libertad de Orituco'],
      },
      {
        id: '1207',
        nombre: 'Juan Germán Roscio',
        parroquias: ['Cantagallo', 'San Juan de los Morros'],
      },
      {
        id: '1208',
        nombre: 'Julián Mellado',
        parroquias: ['El Sombrero', 'Sosa'],
      },
      {
        id: '1209',
        nombre: 'Las Mercedes',
        parroquias: ['Las Mercedes', 'Cabruta', 'Santa Rita de Manapire'],
      },
      {
        id: '1210',
        nombre: 'Leonardo Infante',
        parroquias: ['Valle de la Pascua', 'Espino'],
      },
      {
        id: '1211',
        nombre: 'Ortiz',
        parroquias: ['Ortiz', 'San Francisco de Tiznados', 'San José de Tiznados', 'San Lorenzo de Tiznados'],
      },
      {
        id: '1212',
        nombre: 'Pedro Zaraza',
        parroquias: ['San José de Unare', 'Zaraza'],
      },
      {
        id: '1213',
        nombre: 'San Gerónimo de Guayabal',
        parroquias: ['Guayabal', 'Cazorla'],
      },
      {
        id: '1214',
        nombre: 'San José de Guaribe',
        parroquias: ['San José de Guaribe'],
      },
      {
        id: '1215',
        nombre: 'Santa María de Ipire',
        parroquias: ['Santa María de Ipire'],
      },
    ],
  },
  {
    id: '13',
    nombre: 'Lara',
    municipios: [
      {
        id: '1301',
        nombre: 'Andrés Eloy Blanco',
        parroquias: ['Pío Tamayo', 'Quebrada Honda de Guache', 'Yacambú'],
      },
      {
        id: '1302',
        nombre: 'Crespo',
        parroquias: ['Freitez', 'José María Blanco'],
      },
      {
        id: '1303',
        nombre: 'Iribarren',
        parroquias: ['Catedral', 'Concepción', 'El Cují', 'Juan de Villegas', 'Santa Rosa', 'Tamaca', 'Unión', 'Aguedo Felipe Alvarado', 'Buena Vista', 'Juárez'],
      },
      {
        id: '1304',
        nombre: 'Jiménez',
        parroquias: ['Juan Bautista Rodríguez', 'Cuara', 'Diego de Lozada', 'Paraíso de San José', 'San Miguel', 'Tintorero', 'José Bernardo Dorante', 'Coronel Mariano Peraza'],
      },
      {
        id: '1305',
        nombre: 'Morán',
        parroquias: ['Anzoátegui', 'Bolívar', 'Guárico', 'Hilario Luna y Luna', 'Humocaro Alto', 'Humocaro Bajo', 'La Candelaria', 'Morán'],
      },
      {
        id: '1306',
        nombre: 'Palavecino',
        parroquias: ['Cabudare', 'José Gregorio Bastidas', 'Agua Viva'],
      },
      {
        id: '1307',
        nombre: 'Simón Planas',
        parroquias: ['Sarare', 'Buría', 'Gustavo Vega', 'Trinidad Samuel'],
      },
      {
        id: '1308',
        nombre: 'Torres',
        parroquias: ['Altagracia', 'Antonio Díaz', 'Camacaro', 'Castañeda', 'Cecilio Zubillaga', 'Chiquinquirá', 'El Blanco', 'Espinoza de los Monteros', 'Heriberto Arrollo', 'Lara', 'Las Mercedes', 'Manuel Morillo', 'Montaña Verde', 'Montes de Oca', 'Reyes de Vargas', 'Torres', 'Trinidad Samuel'],
      },
      {
        id: '1309',
        nombre: 'Urdaneta',
        parroquias: ['Siquisique', 'Moroturo', 'San Miguel', 'Xaguas'],
      },
    ],
  },
  {
    id: '14',
    nombre: 'Mérida',
    municipios: [
      {
        id: '1401',
        nombre: 'Alberto Adriani',
        parroquias: ['Eloy Paredes', 'San Rafael de Alcázar', 'Santa Elena de Arenales'],
      },
      {
        id: '1402',
        nombre: 'Andrés Bello',
        parroquias: ['Andrés Bello', 'La Azulita'],
      },
      {
        id: '1403',
        nombre: 'Antonio Pinto Salinas',
        parroquias: ['Santa Cruz de Mora', 'Mesa Bolívar', 'Mesa de Las Palmas'],
      },
      {
        id: '1404',
        nombre: 'Aricagua',
        parroquias: ['Aricagua'],
      },
      {
        id: '1405',
        nombre: 'Arzobispo Chacón',
        parroquias: ['Capurí', 'Chacantá', 'El Molino', 'Guaimaral', 'Mucutuy', 'Mucuchachí'],
      },
      {
        id: '1406',
        nombre: 'Campo Elías',
        parroquias: ['Fernández Peña', 'Matriz', 'Montalbán', 'Acequias', 'Jají', 'La Mesa', 'San José del Sur'],
      },
      {
        id: '1407',
        nombre: 'Caracciolo Parra Olmedo',
        parroquias: ['Tucaní', 'Florencio Ramírez'],
      },
      {
        id: '1408',
        nombre: 'Cardenal Quintero',
        parroquias: ['Santo Domingo', 'Las Piedras'],
      },
      {
        id: '1409',
        nombre: 'Guaraque',
        parroquias: ['Guaraque', 'Mesa de Quintero', 'Río Negro'],
      },
      {
        id: '1410',
        nombre: 'Julio César Salas',
        parroquias: ['Arapuey', 'Palmira'],
      },
      {
        id: '1411',
        nombre: 'Justo Briceño',
        parroquias: ['San Cristóbal de Torondoy', 'Torondoy'],
      },
      {
        id: '1412',
        nombre: 'Libertador',
        parroquias: ['Antonio Spinetti Dini', 'Arias', 'Caracciolo Parra Olmedo', 'Domingo Peña', 'El Llano', 'Gonzalo Picón Febres', 'Jacinto Plaza', 'Juan Rodríguez Suárez', 'Lasso de la Vega', 'Mariano Picón Salas', 'Milla', 'Osuna Rodríguez', 'Sagrario', 'El Morro', 'Los Nevados'],
      },
      {
        id: '1413',
        nombre: 'Miranda',
        parroquias: ['Andrés Eloy Blanco', 'La Venta', 'Piñango', 'Timotes'],
      },
      {
        id: '1414',
        nombre: 'Obispo Ramos de Lora',
        parroquias: ['Eloy Paredes', 'San Rafael de Alcázar', 'Santa Elena de Arenales'],
      },
      {
        id: '1415',
        nombre: 'Padre Noguera',
        parroquias: ['Santa María de Caparo'],
      },
      {
        id: '1416',
        nombre: 'Pueblo Llano',
        parroquias: ['Pueblo Llano'],
      },
      {
        id: '1417',
        nombre: 'Rangel',
        parroquias: ['Cacute', 'La Toma', 'Mucurubá', 'San Rafael'],
      },
      {
        id: '1418',
        nombre: 'Rivas Dávila',
        parroquias: ['Gerónimo Maldonado', 'Bailadores'],
      },
      {
        id: '1419',
        nombre: 'Santos Marquina',
        parroquias: ['Tabay'],
      },
      {
        id: '1420',
        nombre: 'Sucre',
        parroquias: ['Chiguará', 'Estánquez', 'Lagunillas', 'La Trampa', 'Pueblo Nuevo del Sur', 'San Juan'],
      },
      {
        id: '1421',
        nombre: 'Tovar',
        parroquias: ['El Amparo', 'El Llano', 'San Francisco', 'Tovar'],
      },
      {
        id: '1422',
        nombre: 'Tulio Febres Cordero',
        parroquias: ['Independencia', 'María de la Concepción Palacios y Blanco', 'Nueva Bolivia', 'Santa Apolonia'],
      },
      {
        id: '1423',
        nombre: 'Zea',
        parroquias: ['Caño El Tigre', 'Zea'],
      },
    ],
  },
  {
    id: '15',
    nombre: 'Miranda',
    municipios: [
      {
        id: '1501',
        nombre: 'Acevedo',
        parroquias: ['Caucagua', 'Aragüita', 'Arévalo González', 'Capaya', 'El Café', 'Marizapa', 'Panaquire', 'Ribas'],
      },
      {
        id: '1502',
        nombre: 'Andrés Bello',
        parroquias: ['Cumbo', 'San José de Barlovento'],
      },
      {
        id: '1503',
        nombre: 'Baruta',
        parroquias: ['Baruta', 'El Cafetal', 'Las Minas de Baruta'],
      },
      {
        id: '1504',
        nombre: 'Brión',
        parroquias: ['Higuerote', 'Curiepe', 'Tacarigua de Brión'],
      },
      {
        id: '1505',
        nombre: 'Buroz',
        parroquias: ['Mamporal'],
      },
      {
        id: '1506',
        nombre: 'Carrizal',
        parroquias: ['Carrizal'],
      },
      {
        id: '1507',
        nombre: 'Chacao',
        parroquias: ['Chacao'],
      },
      {
        id: '1508',
        nombre: 'Cristóbal Rojas',
        parroquias: ['Charallave', 'Las Brisas'],
      },
      {
        id: '1509',
        nombre: 'El Hatillo',
        parroquias: ['El Hatillo'],
      },
      {
        id: '1510',
        nombre: 'Guaicaipuro',
        parroquias: ['Altagracia de la Montaña', 'Cecilio Acosta', 'Los Teques', 'El Jarillo', 'San Pedro', 'Tácata', 'Paracotos'],
      },
      {
        id: '1511',
        nombre: 'Independencia',
        parroquias: ['Cartanal', 'Santa Teresa del Tuy'],
      },
      {
        id: '1512',
        nombre: 'Lander',
        parroquias: ['La Democracia', 'Ocumare del Tuy', 'Santa Bárbara'],
      },
      {
        id: '1513',
        nombre: 'Los Salias',
        parroquias: ['San Antonio de los Altos'],
      },
      {
        id: '1514',
        nombre: 'Páez',
        parroquias: ['Río Chico', 'El Guapo', 'Tacarigua de la Laguna', 'Paparo', 'San Fernando del Guapo'],
      },
      {
        id: '1515',
        nombre: 'Paz Castillo',
        parroquias: ['Santa Lucía del Tuy'],
      },
      {
        id: '1516',
        nombre: 'Pedro Gual',
        parroquias: ['Cúpira', 'Machurucuto'],
      },
      {
        id: '1517',
        nombre: 'Plaza',
        parroquias: ['Guarenas'],
      },
      {
        id: '1518',
        nombre: 'Simón Bolívar',
        parroquias: ['San Antonio de Yare', 'San Francisco de Yare'],
      },
      {
        id: '1519',
        nombre: 'Sucre',
        parroquias: ['Caucagüita', 'Filas de Mariche', 'La Dolorita', 'Leoncio Martínez', 'Petare', 'Caucagüita'],
      },
      {
        id: '1520',
        nombre: 'Urdaneta',
        parroquias: ['Cúa', 'Nueva Cúa'],
      },
      {
        id: '1521',
        nombre: 'Zamora',
        parroquias: ['Guatire', 'Bolívar'],
      },
    ],
  },
  {
    id: '16',
    nombre: 'Monagas',
    municipios: [
      {
        id: '1601',
        nombre: 'Acosta',
        parroquias: ['San Antonio de Capayacuar', 'El Tejero', 'Libertador de Monagas'],
      },
      {
        id: '1602',
        nombre: 'Aguasay',
        parroquias: ['Aguasay'],
      },
      {
        id: '1603',
        nombre: 'Bolívar',
        parroquias: ['Aragua de Maturín', 'Chaguaramas', 'El Pinto', 'Guanaguana', 'La Toscana', 'Taguaya'],
      },
      {
        id: '1604',
        nombre: 'Caripe',
        parroquias: ['Caripe', 'El Guácharo', 'La Guanota', 'Sabana de Piedra', 'San Agustín', 'Teresen', 'Caripe'],
      },
      {
        id: '1605',
        nombre: 'Cedeño',
        parroquias: ['Areo', 'Capital Cedeño', 'San Félix de Cantalicio', 'Viento Fresco'],
      },
      {
        id: '1606',
        nombre: 'Ezequiel Zamora',
        parroquias: ['El Tejero', 'Punta de Mata'],
      },
      {
        id: '1607',
        nombre: 'Libertador',
        parroquias: ['Chaguaramas del Pao', 'El Carito', 'San Félix de Cantalicio', 'Viento Fresco'],
      },
      {
        id: '1608',
        nombre: 'Maturín',
        parroquias: ['Alto de los Godos', 'Boquerón', 'Las Cocuizas', 'La Cruz', 'San Simón', 'El Corozo', 'El Furrial', 'Jusepín', 'La Pica', 'San Vicente'],
      },
      {
        id: '1609',
        nombre: 'Piar',
        parroquias: ['Aparicio', 'Chaguaramas', 'El Pinto', 'Guanaguana', 'La Toscana', 'Taguaya'],
      },
      {
        id: '1610',
        nombre: 'Punceres',
        parroquias: ['Cachipo', 'Quiriquire'],
      },
      {
        id: '1611',
        nombre: 'Santa Bárbara',
        parroquias: ['Santa Bárbara'],
      },
      {
        id: '1612',
        nombre: 'Sotillo',
        parroquias: ['Barrancas del Orinoco', 'Los Barrancos de Fajardo'],
      },
      {
        id: '1613',
        nombre: 'Uracoa',
        parroquias: ['Uracoa'],
      },
    ],
  },
  {
    id: '17',
    nombre: 'Nueva Esparta',
    municipios: [
      {
        id: '1701',
        nombre: 'Antolín del Campo',
        parroquias: ['Antolín del Campo'],
      },
      {
        id: '1702',
        nombre: 'Arismendi',
        parroquias: ['Arismendi', 'García', 'Francisco Fajardo', 'Bolívar', 'Guevara', 'Matasiete', 'Santa Ana', 'Sucre'],
      },
      {
        id: '1703',
        nombre: 'Díaz',
        parroquias: ['Díaz', 'Zabala', 'Francisco Fajardo', 'Itriago', 'San Antonio', 'Gonzalo'],
      },
      {
        id: '1704',
        nombre: 'García',
        parroquias: ['García', 'Francisco Fajardo', 'Itriago', 'San Antonio', 'Gonzalo'],
      },
      {
        id: '1705',
        nombre: 'Gómez',
        parroquias: ['Bolívar', 'Guevara', 'Matasiete', 'Santa Ana', 'Sucre'],
      },
      {
        id: '1706',
        nombre: 'Maneiro',
        parroquias: ['Aguirre', 'Maneiro', 'Adrián'],
      },
      {
        id: '1707',
        nombre: 'Marcano',
        parroquias: ['Adrián', 'Juan Griego', 'Yaguaraparo'],
      },
      {
        id: '1708',
        nombre: 'Mariño',
        parroquias: ['Porlamar'],
      },
      {
        id: '1709',
        nombre: 'Península de Macanao',
        parroquias: ['Boca de Río', 'San Francisco de Macanao'],
      },
      {
        id: '1710',
        nombre: 'Tubores',
        parroquias: ['Los Barales', 'Vicente Fuentes'],
      },
      {
        id: '1711',
        nombre: 'Villalba',
        parroquias: ['Villalba', 'San Pedro de Coche'],
      },
    ],
  },
  {
    id: '18',
    nombre: 'Portuguesa',
    municipios: [
      {
        id: '1801',
        nombre: 'Agua Blanca',
        parroquias: ['Agua Blanca'],
      },
      {
        id: '1802',
        nombre: 'Araure',
        parroquias: ['Araure', 'Río Acarigua'],
      },
      {
        id: '1803',
        nombre: 'Esteller',
        parroquias: ['Píritu', 'Uveral'],
      },
      {
        id: '1804',
        nombre: 'Guanare',
        parroquias: ['Guanare', 'Córdoba', 'San José de la Montaña', 'San Juan de Guanaguanare', 'Virgen de Coromoto'],
      },
      {
        id: '1805',
        nombre: 'Guanarito',
        parroquias: ['Guanarito', 'Trinidad de la Capilla', 'Divina Pastora'],
      },
      {
        id: '1806',
        nombre: 'Monseñor José Vicente de Unda',
        parroquias: ['Peña Blanca'],
      },
      {
        id: '1807',
        nombre: 'Ospino',
        parroquias: ['Aparición', 'La Estación', 'Ospino'],
      },
      {
        id: '1808',
        nombre: 'Páez',
        parroquias: ['Acarigua', 'Payara', 'Pimpinela', 'Ramón Peraza'],
      },
      {
        id: '1809',
        nombre: 'Papelón',
        parroquias: ['Caño Delgadito'],
      },
      {
        id: '1810',
        nombre: 'San Genaro de Boconoíto',
        parroquias: ['Antolín Tovar Anquino'],
      },
      {
        id: '1811',
        nombre: 'San Rafael de Onoto',
        parroquias: ['San Rafael de Onoto', 'Santa Fe', 'Thermo Morles'],
      },
      {
        id: '1812',
        nombre: 'Santa Rosalía',
        parroquias: ['Santa Rosalía', 'Florida'],
      },
      {
        id: '1813',
        nombre: 'Sucre',
        parroquias: ['Sucre', 'Concepción', 'San Rafael de Palo Alzado', 'Uvencio Antonio Velásquez', 'San José de Saguaz', 'Villa Rosa'],
      },
      {
        id: '1814',
        nombre: 'Turén',
        parroquias: ['Turén', 'Canelones', 'Santa Cruz', 'San Isidro Labrador'],
      },
    ],
  },
  {
    id: '19',
    nombre: 'Sucre',
    municipios: [
      {
        id: '1901',
        nombre: 'Andrés Eloy Blanco',
        parroquias: ['Casanay', 'Tunapuy', 'El Pilar', 'El Rincón', 'General Francisco Antonio Vásquez', 'Guaraúnos', 'Tunapuy', 'Unión'],
      },
      {
        id: '1902',
        nombre: 'Andrés Mata',
        parroquias: ['San José de Aerocuar', 'Tavera Acosta'],
      },
      {
        id: '1903',
        nombre: 'Arismendi',
        parroquias: ['Río Caribe', 'Antonio José de Sucre', 'El Morro de Puerto Santo', 'Puerto Santo', 'San Juan de las Galdonas'],
      },
      {
        id: '1904',
        nombre: 'Benítez',
        parroquias: ['El Pilar', 'El Rincón', 'General Francisco Antonio Vásquez', 'Guaraúnos', 'Tunapuy', 'Unión'],
      },
      {
        id: '1905',
        nombre: 'Bermúdez',
        parroquias: ['Bordones', 'Los Güires', 'Punceres'],
      },
      {
        id: '1906',
        nombre: 'Bolívar',
        parroquias: ['Marigüitar', 'Araya', 'Chacopata', 'Manicuare', 'Tunapuy'],
      },
      {
        id: '1907',
        nombre: 'Cajigal',
        parroquias: ['Irapa', 'Campo Claro', 'Marabal', 'San Antonio de Irapa', 'Soro'],
      },
      {
        id: '1908',
        nombre: 'Cruz Salmerón Acosta',
        parroquias: ['Cumaná', 'Alta Gracia', 'Santa Fe', 'Valle de San Juan', 'Yaguaraparo'],
      },
      {
        id: '1909',
        nombre: 'Libertador',
        parroquias: ['Cumanacoa', 'Arenas', 'Aricagua', 'Cocollar', 'San Fernando', 'San Lorenzo', 'Villa Frontado'],
      },
      {
        id: '1910',
        nombre: 'Mariño',
        parroquias: ['Cariaco', 'Catuaro', 'Rendón', 'Santa Cruz', 'Santa María'],
      },
      {
        id: '1911',
        nombre: 'Mejía',
        parroquias: ['San Antonio del Golfo'],
      },
      {
        id: '1912',
        nombre: 'Montes',
        parroquias: ['Cumaná', 'Alta Gracia', 'Santa Fe', 'Valle de San Juan', 'Yaguaraparo'],
      },
      {
        id: '1913',
        nombre: 'Ribero',
        parroquias: ['Cariaco', 'Catuaro', 'Rendón', 'Santa Cruz', 'Santa María'],
      },
      {
        id: '1914',
        nombre: 'Sucre',
        parroquias: ['Cumaná', 'Alta Gracia', 'Santa Fe', 'Valle de San Juan', 'Yaguaraparo'],
      },
      {
        id: '1915',
        nombre: 'Valdez',
        parroquias: ['Güiria', 'Bideau', 'Cristóbal Colón', 'Punta de Piedras'],
      },
    ],
  },
  {
    id: '20',
    nombre: 'Táchira',
    municipios: [
      {
        id: '2001',
        nombre: 'Andrés Bello',
        parroquias: ['Cordero'],
      },
      {
        id: '2002',
        nombre: 'Antonio Rómulo Costa',
        parroquias: ['Las Mesas'],
      },
      {
        id: '2003',
        nombre: 'Ayacucho',
        parroquias: ['San Cristóbal', 'Juan Germán Roscio', 'Román Cárdenas', 'Francisco de Miranda', 'José María Vargas'],
      },
      {
        id: '2004',
        nombre: 'Bolívar',
        parroquias: ['San Simón', 'San José de Bolívar'],
      },
      {
        id: '2005',
        nombre: 'Cárdenas',
        parroquias: ['Táriba', 'La Florida', 'Amenodoro Rangel Lamus', 'San José'],
      },
      {
        id: '2006',
        nombre: 'Córdoba',
        parroquias: ['Santa Ana del Táchira', 'Alberto Adriani', 'Santo Domingo'],
      },
      {
        id: '2007',
        nombre: 'Fernández Feo',
        parroquias: ['San Rafael del Piñal', 'Buenos Aires', 'Vegas de El Zulia'],
      },
      {
        id: '2008',
        nombre: 'Francisco de Miranda',
        parroquias: ['Palmira'],
      },
      {
        id: '2009',
        nombre: 'García de Hevia',
        parroquias: ['Capacho Nuevo', 'Juan Vicente Gómez', 'Capacho Viejo', 'La Grita', 'El Cobre', 'El Pinal', 'La Independencia', 'La Fría'],
      },
      {
        id: '2010',
        nombre: 'Guásimos',
        parroquias: ['Independencia', 'Juan Germán Roscio', 'Román Cárdenas'],
      },
      {
        id: '2011',
        nombre: 'Independencia',
        parroquias: ['San Juan de Colón', 'San Pedro del Río'],
      },
      {
        id: '2012',
        nombre: 'Jáuregui',
        parroquias: ['La Grita', 'Emilio Constantino Guerrero', 'Monseñor Miguel Antonio Salas', 'El Cobre', 'El Pinal', 'La Independencia', 'La Fría'],
      },
      {
        id: '2013',
        nombre: 'José María Vargas',
        parroquias: ['El Cobre', 'El Pinal', 'La Independencia', 'La Fría'],
      },
      {
        id: '2014',
        nombre: 'Junín',
        parroquias: ['Rubio', 'Bramón', 'La Petrólea', 'Queniquea', 'San Vicente de la Revancha', 'Santa Rosalía', 'Táriba'],
      },
      {
        id: '2015',
        nombre: 'Libertad',
        parroquias: ['Capacho Nuevo', 'Juan Vicente Gómez', 'Capacho Viejo', 'La Grita', 'El Cobre', 'El Pinal', 'La Independencia', 'La Fría'],
      },
      {
        id: '2016',
        nombre: 'Libertador',
        parroquias: ['Abejales', 'Doradas', 'Emeterio Ochoa', 'San Joaquín de Navay', 'Lobatera', 'Constitución'],
      },
      {
        id: '2017',
        nombre: 'Lobatera',
        parroquias: ['Lobatera', 'Constitución'],
      },
      {
        id: '2018',
        nombre: 'Michelena',
        parroquias: ['Michelena', 'Coloncito'],
      },
      {
        id: '2019',
        nombre: 'Panamericano',
        parroquias: ['La Palmita', 'Buenos Aires'],
      },
      {
        id: '2020',
        nombre: 'Pedro María Ureña',
        parroquias: ['Ureña', 'Nueva Arcadia'],
      },
      {
        id: '2021',
        nombre: 'Rafael Urdaneta',
        parroquias: ['Delicias', 'Colón', 'San Juan de Colón', 'San Pedro del Río'],
      },
      {
        id: '2022',
        nombre: 'Samuel Darío Maldonado',
        parroquias: ['Boconó', 'Hernández'],
      },
      {
        id: '2023',
        nombre: 'San Cristóbal',
        parroquias: ['San Cristóbal', 'Juan Germán Roscio', 'Román Cárdenas', 'Francisco de Miranda', 'José María Vargas'],
      },
      {
        id: '2024',
        nombre: 'San Judas Tadeo',
        parroquias: ['Umuquena'],
      },
      {
        id: '2025',
        nombre: 'Seboruco',
        parroquias: ['Seboruco'],
      },
      {
        id: '2026',
        nombre: 'Simón Rodríguez',
        parroquias: ['San Simón', 'San José de Bolívar'],
      },
      {
        id: '2027',
        nombre: 'Sucre',
        parroquias: ['Queniquea', 'San Vicente de la Revancha', 'Santa Rosalía', 'Táriba'],
      },
      {
        id: '2028',
        nombre: 'Torbes',
        parroquias: ['San Josécito'],
      },
      {
        id: '2029',
        nombre: 'Uribante',
        parroquias: ['Pregonero', 'Cárdenas', 'Potosi', 'Juan Pablo Peñaloza'],
      },
      {
        id: '2030',
        nombre: 'Ureña',
        parroquias: ['Ureña', 'Nueva Arcadia'],
      },
    ],
  },
  {
    id: '21',
    nombre: 'Trujillo',
    municipios: [
      {
        id: '2101',
        nombre: 'Andrés Bello',
        parroquias: ['Aramendi', 'Santa Isabel', 'Gabriel Picón González', 'Héctor Amable Mora', 'José Nucete Sardi', 'Pulido Méndez'],
      },
      {
        id: '2102',
        nombre: 'Boconó',
        parroquias: ['Boconó', 'El Carmen', 'Mosquey', 'Ayacucho', 'Burbusay', 'General Ribas', 'Guaramacal', 'Vega de Guaramacal', 'Monseñor Jáuregui', 'Rafael Rangel', 'San Miguel', 'San José'],
      },
      {
        id: '2103',
        nombre: 'Bolívar',
        parroquias: ['Sabana Grande', 'Cheregüé', 'Granados'],
      },
      {
        id: '2104',
        nombre: 'Candelaria',
        parroquias: ['Chejendé', 'Arnoldo Gabaldón', 'Bolivia', 'Carrillo', 'Cegarra', 'Manuel Salvador Ulloa', 'San José'],
      },
      {
        id: '2105',
        nombre: 'Carache',
        parroquias: ['Carache', 'La Concepción', 'Cuicas', 'Panamericana', 'Santa Cruz'],
      },
      {
        id: '2106',
        nombre: 'Escuque',
        parroquias: ['Escuque', 'La Unión', 'Santa Rita', 'Sabana Libre'],
      },
      {
        id: '2107',
        nombre: 'José Felipe Márquez Cañizalez',
        parroquias: ['El Socorro', 'Los Caprichos', 'Antonio José de Sucre'],
      },
      {
        id: '2108',
        nombre: 'Juan Vicente Campo Elías',
        parroquias: ['Campo Elías', 'Arnoldo Gabaldón'],
      },
      {
        id: '2109',
        nombre: 'La Ceiba',
        parroquias: ['Santa Apolonia', 'La Ceiba', 'El Progreso', 'Tres de Febrero'],
      },
      {
        id: '2110',
        nombre: 'Miranda',
        parroquias: ['El Dividive', 'Agua Santa', 'Agua Caliente', 'El Cenizo', 'Valerita'],
      },
      {
        id: '2111',
        nombre: 'Monte Carmelo',
        parroquias: ['Monte Carmelo', 'Buena Vista', 'Santa María del Horcón'],
      },
      {
        id: '2112',
        nombre: 'Motatán',
        parroquias: ['Motatán', 'El Baño', 'Jalisco'],
      },
      {
        id: '2113',
        nombre: 'Pampán',
        parroquias: ['Pampán', 'Flor de Patria', 'La Paz', 'Santa Ana'],
      },
      {
        id: '2114',
        nombre: 'Pampanito',
        parroquias: ['Pampanito', 'La Concepción', 'Pampanito II'],
      },
      {
        id: '2115',
        nombre: 'Rafael Rangel',
        parroquias: ['Betijoque', 'José Gregorio Hernández', 'La Pueblita', 'Los Cedros'],
      },
      {
        id: '2116',
        nombre: 'San Rafael de Carvajal',
        parroquias: ['Carvajal', 'Antonio Nicolás Briceño', 'Campo Alegre', 'José Leonardo Suárez'],
      },
      {
        id: '2117',
        nombre: 'Sucre',
        parroquias: ['Sabana de Mendoza', 'El Paraíso', 'Junín', 'Valmore Rodríguez', 'Andrés Linares'],
      },
      {
        id: '2118',
        nombre: 'Urdaneta',
        parroquias: ['La Quebrada', 'Cabimbú', 'Jajó', 'La Mesa', 'Santiago', 'Tuñame', 'La Vega'],
      },
      {
        id: '2119',
        nombre: 'Valera',
        parroquias: ['Valera', 'Isnotú', 'Juan Ignacio Montilla', 'La Beatriz', 'La Puerta', 'Mendoza del Valle de Momboy', 'Mercedes Díaz', 'San Luis'],
      },
    ],
  },
  {
    id: '22',
    nombre: 'Vargas',
    municipios: [
      {
        id: '2201',
        nombre: 'Vargas',
        parroquias: [
          'Caraballeda',
          'Carayaca',
          'Carlos Soublette',
          'Caruao',
          'Catia La Mar',
          'El Junko',
          'La Guaira',
          'Macuto',
          'Maiquetía',
          'Naiguatá',
          'Urimare',
        ],
      },
    ],
  },
  {
    id: '23',
    nombre: 'Yaracuy',
    municipios: [
      {
        id: '2301',
        nombre: 'Arístides Bastidas',
        parroquias: ['San Pablo'],
      },
      {
        id: '2302',
        nombre: 'Bolívar',
        parroquias: ['Aroa'],
      },
      {
        id: '2303',
        nombre: 'Bruzual',
        parroquias: ['Chivacoa', 'Campo Elías'],
      },
      {
        id: '2304',
        nombre: 'Cocorote',
        parroquias: ['Cocorote'],
      },
      {
        id: '2305',
        nombre: 'Independencia',
        parroquias: ['Independencia', 'José Antonio Páez'],
      },
      {
        id: '2306',
        nombre: 'José Antonio Páez',
        parroquias: ['Sabana de Parra'],
      },
      {
        id: '2307',
        nombre: 'La Trinidad',
        parroquias: ['Boraure'],
      },
      {
        id: '2308',
        nombre: 'Manuel Monge',
        parroquias: ['Yumare'],
      },
      {
        id: '2309',
        nombre: 'Nirgua',
        parroquias: ['Nirgua', 'Salom', 'Temerrla', 'Capital Nirgua'],
      },
      {
        id: '2310',
        nombre: 'Peña',
        parroquias: ['Yaritagua', 'San Andrés'],
      },
      {
        id: '2311',
        nombre: 'San Felipe',
        parroquias: ['San Felipe', 'Albarico', 'San Javier'],
      },
      {
        id: '2312',
        nombre: 'Sucre',
        parroquias: ['Guama', 'Urachiche'],
      },
      {
        id: '2313',
        nombre: 'Urachiche',
        parroquias: ['Urachiche'],
      },
      {
        id: '2314',
        nombre: 'Veroes',
        parroquias: ['Farriar'],
      },
    ],
  },
  {
    id: '24',
    nombre: 'Zulia',
    municipios: [
      {
        id: '2401',
        nombre: 'Almirante Padilla',
        parroquias: ['Isla de Toas', 'Monagas'],
      },
      {
        id: '2402',
        nombre: 'Baralt',
        parroquias: ['San Timoteo', 'General Urdaneta', 'Libertador', 'Manuel Guanipa Matos', 'Marcelino Briceño', 'Pueblo Nuevo', 'Venezuela'],
      },
      {
        id: '2403',
        nombre: 'Cabimas',
        parroquias: ['Ambrosio', 'Carmen Herrera', 'La Rosa', 'Germán Ríos Linares', 'San Benito', 'Rómulo Betancourt', 'Jorge Hernández', 'Punta Gorda', 'Arístides Calvani'],
      },
      {
        id: '2404',
        nombre: 'Catatumbo',
        parroquias: ['Encontrados', 'Udón Pérez'],
      },
      {
        id: '2405',
        nombre: 'Colón',
        parroquias: ['Morales', 'San Carlos del Zulia', 'Santa Bárbara', 'Santa Cruz del Zulia', 'Urribarrí'],
      },
      {
        id: '2406',
        nombre: 'Francisco Javier Pulgar',
        parroquias: ['Simón Rodríguez', 'Carlos Quevedo', 'Francisco Javier Pulgar', 'José Ramón Yépez'],
      },
      {
        id: '2407',
        nombre: 'Jesús Enrique Lossada',
        parroquias: ['La Concepción', 'San José', 'Mariano Parra León', 'José Ramón Yépez'],
      },
      {
        id: '2408',
        nombre: 'Jesús María Semprún',
        parroquias: ['Jesús María Semprún', 'Bari', 'Gibraltar', 'Heras', 'El Rosario', 'Donaldo García'],
      },
      {
        id: '2409',
        nombre: 'La Cañada de Urdaneta',
        parroquias: ['La Concepción', 'San José', 'Mariano Parra León', 'José Ramón Yépez'],
      },
      {
        id: '2410',
        nombre: 'Lagunillas',
        parroquias: ['Ciudad Ojeda', 'Omar Torrijos Herrera', 'Venezuela', 'Alonso de Ojeda', 'Libertad', 'Campo Lara'],
      },
      {
        id: '2411',
        nombre: 'Machiques de Perijá',
        parroquias: ['Machiques', 'Libertad', 'Río Negro', 'San José de Perijá'],
      },
      {
        id: '2412',
        nombre: 'Mara',
        parroquias: ['San Rafael', 'La Sierrita', 'Las Parcelas', 'Luis de Vicente', 'Monseñor Marcos Sergio Godoy', 'Ricaurte', 'Tamare', 'Las Morochas'],
      },
      {
        id: '2413',
        nombre: 'Maracaibo',
        parroquias: [
          'Bolívar',
          'Coquivacoa',
          'Chiquinquirá',
          'Santa Lucía',
          'Olegario Villalobos',
          'Juana de Ávila',
          'Caracciolo Parra Pérez',
          'Cecilio Acosta',
          'Cristo de Aranza',
          'Idelfonso Vásquez',
          'Cacique Mara',
          'Raúl Leoni',
          'Santa Rosa',
          'San Isidro',
          'Venancio Pulgar',
          'Manuel Dagnino',
          'Luis Hurtado Higuera',
          'Francisco Eugenio Bustamante',
          'Antonio Borjas Romero',
          'Edgar Sanabria',
          'El Manzanillo',
          'Rafael Urdaneta',
          'Raúl Cuenca',
        ],
      },
      {
        id: '2414',
        nombre: 'Miranda',
        parroquias: ['Los Puertos de Altagracia', 'Pueblo Nuevo El Chivo', 'Santa Rita'],
      },
      {
        id: '2415',
        nombre: 'Páez',
        parroquias: ['Sinamaica', 'Alta Guajira', 'Elías Sánchez Rubio', 'Guajira', 'Indígena Bolivariano Guajira', 'Donaldo García'],
      },
      {
        id: '2416',
        nombre: 'Rosario de Perijá',
        parroquias: ['La Villa del Rosario', 'El Rosario'],
      },
      {
        id: '2417',
        nombre: 'San Francisco',
        parroquias: ['San Francisco', 'El Bajo', 'Domitila Flores', 'Francisco Ochoa', 'Los Cortijos', 'Marcial Hernández', 'José Domingo Rus'],
      },
      {
        id: '2418',
        nombre: 'Santa Rita',
        parroquias: ['Santa Rita', 'El Mene', 'Pedro Lucas Urribarrí', 'José Cenobio Urribarrí'],
      },
      {
        id: '2419',
        nombre: 'Simón Bolívar',
        parroquias: ['El Rosario', 'Sixto Zambrano'],
      },
      {
        id: '2420',
        nombre: 'Sucre',
        parroquias: ['Bobures', 'El Batey', 'Gibraltar', 'Heras', 'Monseñor Arturo Celestino Álvarez', 'Rómulo Gallegos', 'El Rosario'],
      },
      {
        id: '2421',
        nombre: 'Valmore Rodríguez',
        parroquias: ['Bachaquero', 'Libertad', 'Mene Grande', 'Venezuela', 'El Danto'],
      },
    ],
  },
];

// Funciones helper para obtener datos
export const getEstados = () => estadosVenezuela.map(e => ({id: e.id, nombre: e.nombre}));

export const getMunicipiosByEstado = (estadoId: string): Municipio[] => {
  const estado = estadosVenezuela.find(e => e.id === estadoId);
  return estado ? estado.municipios : [];
};

export const getParroquiasByMunicipio = (estadoId: string, municipioId: string): string[] => {
  const estado = estadosVenezuela.find(e => e.id === estadoId);
  if (!estado) return [];
  
  const municipio = estado.municipios.find(m => m.id === municipioId);
  return municipio ? municipio.parroquias : [];
};

