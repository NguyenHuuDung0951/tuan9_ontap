
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAppSelector } from '@/store';
import { selectWishlist } from '../store/wishlistSlice';

export default function AccountScreen() {
  const wishlist = useAppSelector(selectWishlist);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Tài khoản của tôi
      </Text>

      <Text>
        Số sách yêu thích: {wishlist.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
