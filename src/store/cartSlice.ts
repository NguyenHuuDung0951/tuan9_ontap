
import type { RootState } from '@/app/index';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Book, CartItem } from '../types';
// Phai co 2 cai nay neu khong gio hang se bi xoa trang
type CartState = {
  items: CartItem[];
  hydrated: boolean;
};

const initialState: CartState = {
  items: [],
  hydrated: false,
};

const clamp = (qty: number, stock: number) =>
  Math.max(1, Math.min(qty, stock));

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Book>) {
      const book = action.payload;

      if (book.stock <= 0) return;

      const item = state.items.find(
        i => i.book.id === book.id
      );

      if (item) {
        item.quantity = clamp(
          item.quantity + 1,
          book.stock
        );
      } else {
        state.items.push({
          book,
          quantity: 1,
        });
      }
    },

    setQuantity(
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
      }>
    ) {
      const item = state.items.find(
        i => i.book.id === action.payload.id
      );

      if (item) {
        item.quantity = clamp(
          action.payload.quantity,
          item.book.stock
        );
      }
    },

    removeFromCart(
      state,
      action: PayloadAction<string>
    ) {
      state.items = state.items.filter(
        i => i.book.id !== action.payload
      );
    },

    hydrateCart(
      state,
      action: PayloadAction<CartItem[]>
    ) {
      state.items = action.payload;
      state.hydrated = true;
    },
  },
});
// phai co export action de co the su dung trong cac component khac
export const {
  addToCart,
  setQuantity,
  removeFromCart,
  hydrateCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (s: RootState) =>
  s.cart.items;

export const selectCartCount = (s: RootState) =>
  s.cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

export const selectQuantityInCart =
  (id: string) => (s: RootState) =>
    s.cart.items.find(
      item => item.book.id === id
    )?.quantity ?? 0;
