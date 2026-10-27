
import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import type { Book } from '../types';

import { useAppDispatch } from '@/store/';
import { fetchBookById } from '../api/books';
import FavoriteButton from '../components/FavoriteButton';
import { addToCart } from '../store/cartSlice';
import { formatVND } from '../utils/format';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'BookDetail'
>;

export default function BookDetailScreen({
  route,
}: Props) {
  const { bookId } = route.params;

  const dispatch = useAppDispatch();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchBookById(bookId)
      .then(data => {
        if (active) setBook(data);
      })
      .catch(err => {
        if (active) setError((err as Error).message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [bookId]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error || !book) {
    return (
      <Text style={styles.message}>
        Không tải được chi tiết sách: {error}
      </Text>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(book));

    Alert.alert(
      'Thành công',
      'Đã thêm sách vào giỏ hàng'
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
     
<View style={styles.coverContainer}>
  <Image
    source={{ uri: book.cover }}
    style={styles.cover}
  />

  <FavoriteButton
    book={book}
    size={24}
    style={{
      top: 12,
      right: 12,
    }}
  />
</View>

      <Text style={styles.title}>
        {book.title}
      </Text>

      <Text>Tác giả: {book.author}</Text>
      <Text>Thể loại: {book.category}</Text>
      <Text>Đánh giá: {book.rating}/10</Text>

      <Text style={styles.price}>
        {formatVND(book.price)}
      </Text>

      <Text>
        {book.stock > 0
          ? `Còn ${book.stock} cuốn`
          : 'Hết hàng'}
      </Text>

      <Text style={styles.description}>
        {book.description}
      </Text>

      <Pressable
        style={[
          styles.button,
          book.stock === 0 && styles.disabled,
        ]}
        disabled={book.stock === 0}
        onPress={handleAddToCart}
      >
        <Text style={styles.buttonText}>
          {book.stock === 0
            ? 'Hết hàng'
            : 'Thêm vào giỏ hàng'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  coverContainer: {
  width: 180,
  alignSelf: 'center',
  position: 'relative',
},
  cover: {
    width: 180,
    height: 270,
    alignSelf: 'center',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e53935',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    padding: 20,
  },
});
