
import {
  useCallback,
  useMemo,
} from 'react';

import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import CartItemRow from '../components/CartItemRow';
import { useDebouncedQuantities } from '../hooks/useDebouncedQuantities';
import {
  useAppDispatch,
  useAppSelector,
} from '../store';
import {
  removeFromCart,
  selectCartItems,
} from '../store/cartSlice';
import type { CartItem } from '../types';
import { formatVND } from '../utils/format';

export default function CartScreen() {
  
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);

  const {
    drafts,
    changeQuantity,
    discard,
    flush,
  } = useDebouncedQuantities(300);
  useFocusEffect(
  useCallback(() => {
    return () => {
      flush();
    };
  }, [flush])
);    
  // Ưu tiên số lượng đang hiển thị trên UI
  const qtyOf = useCallback(
    (item: CartItem) =>
      drafts[item.book.id] ?? item.quantity,
    [drafts]
  );
  
  // Tổng tiền tự tính lại khi số lượng thay đổi
  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + item.book.price * qtyOf(item),
      0
    );
  }, [items, qtyOf]);




const confirmRemove = useCallback(
  (item: CartItem) => {
console.log('Đã nhấn xóa:', item.book.title);
    const remove = () => {
      // Hủy debounce đang chờ
      discard(item.book.id);

      // Xóa sản phẩm khỏi Redux
      dispatch(removeFromCart(item.book.id));
    };

    const message =
      `Bạn có chắc muốn xóa "${item.book.title}" khỏi giỏ hàng?`;

    // Nếu chạy trên Web
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(message);

      if (confirmed) {
        remove();
      }

      return;
    }

    // Nếu chạy trên Android hoặc iOS
    Alert.alert(
      'Xóa sản phẩm',
      message,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: remove,
        },
      ]
    );
  },
  [dispatch, discard]
);


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Giỏ hàng của bạn
      </Text>

      <FlatList
        data={items}
        keyExtractor={item => item.book.id}
        renderItem={({ item }) => (
         <CartItemRow
          item={item}
          quantity={qtyOf(item)}
          onChangeQuantity={changeQuantity}
          onRemove={confirmRemove}
        />
        )}
        contentContainerStyle={{
          padding: 12,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Giỏ hàng đang trống
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>
          Tổng cộng
        </Text>

        <Text style={styles.totalPrice}>
          {formatVND(subtotal)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 20,
    color: '#e53935',
    fontWeight: 'bold',
  },
});
