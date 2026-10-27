

import {
    Pressable,
    StyleSheet,
    Text,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

import type { Book } from '../types';

import {
    useAppDispatch,
    useAppSelector,
} from '../store';

import {
    selectIsFavorite,
    toggleWishlist,
} from '../store/wishlistSlice';

type Props = {
  book: Book;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function FavoriteButton({
  book,
  size = 18,
  style,
}: Props) {
  const dispatch = useAppDispatch();

  const isFavorite = useAppSelector(
    selectIsFavorite(book.id)
  );

  const handlePress = () => {
    dispatch(toggleWishlist(book));
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={[
        styles.badge,
        {
          width: size * 2,
          height: size * 2,
          borderRadius: size,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: size,
          color: isFavorite ? '#e53935' : '#777',
        }}
      >
        {isFavorite ? '♥' : '♡'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    zIndex: 2,
  },
});
