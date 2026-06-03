import { Image, StyleSheet, Text, View } from 'react-native';
import { getRatingStars, formatDuration } from '../utils/formatters';

const Movie = ({ title, poster, description, rating, duration }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Image source={{ uri: poster }} style={styles.poster} />
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.rating}>{getRatingStars(rating)}</Text>
      <Text style={styles.duration}>{formatDuration(duration)}</Text>
    </View>
  );
};

export default Movie;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  poster: {
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 14,
    color: '#777',
  },
});
