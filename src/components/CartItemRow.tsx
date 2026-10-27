
import React from 'react';

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { CartItem } from '../types';
import { formatVND } from '../utils/format';

type Props = {
  item: CartItem;
  quantity: number;
  onChangeQuantity: (id: string, qty: number) => void;
  onRemove: (item: CartItem) => void;
};

function CartItemRow({
  item,
  quantity,
  onChangeQuantity,
  onRemove,
}: Props) {
  const { book } = item;

  const canDecrease = quantity > 1;
  const canIncrease = quantity < book.stock;

  return (
    <View style={styles.row}>
      <Image
        source={{ uri: book.cover }}
        style={styles.cover}
      />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>

        <Text style={styles.price}>
          {formatVND(book.price)}
        </Text>

        <View style={styles.quantityRow}>
          <Pressable
            disabled={!canDecrease}
            style={[
              styles.quantityButton,
              !canDecrease && styles.disabled,
            ]}
            onPress={() =>
              onChangeQuantity(book.id, quantity - 1)
            }
          >
            <Text style={styles.buttonText}>−</Text>
          </Pressable>

          <Text style={styles.quantity}>
            {quantity}
          </Text>

          <Pressable
            disabled={!canIncrease}
            style={[
              styles.quantityButton,
              !canIncrease && styles.disabled,
            ]}
            onPress={() =>
              onChangeQuantity(book.id, quantity + 1)
            }
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.stock}>
          Tồn kho: {book.stock}
        </Text>

        <Text style={styles.subtotal}>
          Thành tiền: {formatVND(book.price * quantity)}
        </Text>
      </View>

      <Pressable
        onPress={() => onRemove(item)}
        hitSlop={8}
        >
        <Text style={styles.remove}>✕</Text>
        </Pressable>
            </View>
  );
}

export default React.memo(CartItemRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#e53935',
    fontWeight: 'bold',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stock: {
    fontSize: 12,
    color: '#777',
  },
  subtotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  remove: {
    fontSize: 20,
    color: '#e53935',
    marginLeft: 6,
  },
});
