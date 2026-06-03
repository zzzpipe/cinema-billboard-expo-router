import { Dimensions, StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import Movie from '../components/Movie';
import AddMovieFloatingButton from '../components/AddMovieFloatingButton';
import SegmentControl from '../components/SegmentControl';
import AddMovieModal from '../components/AddMovieModal';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://10.4.97.41:3000';

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // traigo las pelis de la API
  const getMovies = async () => {
    try {
      const res = await fetch(`${API_URL}/movies`);
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.log('Error trayendo películas:', error);
    }
  };

  // traigo las categorías de la API
  const getCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.log('Error trayendo categorías:', error);
    }
  };

  // cuando arranca la app, cargo todo
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await getMovies();
      await getCategories();
      setLoading(false);
    };
    cargarDatos();
  }, []);

  // mientras carga, muestro un spinner
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Cargando películas...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SegmentControl
        segments={['All Movies', 'Movies By Category']}
        selectedSegment={selectedSegment}
        onSegmentSelect={(index) => setSelectedSegment(index)}
        style={{ width: Dimensions.get('window').width - 20 }}
      />

      {selectedSegment === 0 && (
        <FlatList
          style={{ width: '100%' }}
          data={movies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Movie
              title={item.title}
              poster={item.poster}
              description={item.description}
              rating={item.rating}
              duration={item.duration}
            />
          )}
          contentContainerStyle={{ padding: 10 }}
        />
      )}

      {selectedSegment === 1 && (
        <FlatList
          style={{ width: '100%' }}
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item: category }) => {
            // filtro solo las pelis de esta categoría
            const pelisDeCategoria = movies.filter((m) => m.category === category.name);

            return (
              <View style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category.name}</Text>

                <FlatList
                  horizontal
                  data={pelisDeCategoria}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.horizontalCard}>
                      <Movie
                        title={item.title}
                        poster={item.poster}
                        description={item.description}
                        rating={item.rating}
                        duration={item.duration}
                      />
                    </View>
                  )}
                />
              </View>
            );
          }}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
      <AddMovieFloatingButton
        style={{ position: 'absolute', bottom: 20, right: 20 }}
        onPress={() => setModalVisible(true)}
      />

      <AddMovieModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={() => {
          console.log('Movie submitted');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
