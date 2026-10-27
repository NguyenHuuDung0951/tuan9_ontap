
import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Button,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { fetchBooks } from '@/api/books';
import BookGrid from '@/components/BookGird';
import type { RootStackParamList } from '../navigation/types';
import type { Book } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList
>;

export default function HomeScreen({
  navigation,
}: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    loadBooks().finally(() => setLoading(false));
  }, [loadBooks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Đang tải sách...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Không tải được sách: {error}</Text>
        <Button
          title="Thử lại"
          onPress={onRefresh}
        />
      </View>
    );
  }

  return (
    <BookGrid
      books={books}
      onPressBook={id =>
        navigation.navigate('BookDetail', {
          bookId: id,
        })
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
});
