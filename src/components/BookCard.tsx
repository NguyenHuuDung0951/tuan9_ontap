
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import type { Book } from '../types';
import { formatVND } from '../utils/format';
import FavoriteButton from './FavoriteButton';

type Props = {
  book: Book;
  onPress: (id: string) => void;
};

export default function BookCard({
  book,
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(book.id)}
    >

        <View>
          <Image
            source={{ uri: book.cover }}
            style={styles.cover}
          />

          <FavoriteButton book={book} />
        </View>

      <Text
        style={styles.title}
        numberOfLines={2}
      >
        {book.title}
      </Text>

      <Text style={styles.author}>
        {book.author}
      </Text>

      <Text style={styles.price}>
        {formatVND(book.price)}
      </Text>

      <Text style={styles.stock}>
        {book.stock > 0
          ? `Còn ${book.stock} cuốn`
          : 'Hết hàng'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  cover: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    minHeight: 40,
  },
  author: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53935',
    marginTop: 6,
  },
  stock: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
});
