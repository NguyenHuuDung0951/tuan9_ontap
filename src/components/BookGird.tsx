
import React from 'react';
import { FlatList } from 'react-native';

import type { Book } from '../types';
import BookCard from './BookCard';

type Props = {
  books: Book[];
  onPressBook: (id: string) => void;
  ListEmptyComponent?: React.ReactElement;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function BookGrid({
  books,
  onPressBook,
  ListEmptyComponent,
  refreshing,
  onRefresh,
}: Props) {
  return (
    <FlatList
      data={books}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <BookCard
          book={item}
          onPress={onPressBook}
        />
      )}
      numColumns={2}
      columnWrapperStyle={{
        gap: 12,
      }}
      contentContainerStyle={[
        {
          padding: 12,
          gap: 12,
        },
        books.length === 0 && {
          flexGrow: 1,
        },
      ]}
      ListEmptyComponent={ListEmptyComponent}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
