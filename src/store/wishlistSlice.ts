
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Book } from '../types';
import type { RootState } from './index';

type WishlistState = {
  items: Book[];
  hydrated: boolean;
};

const initialState: WishlistState = {
  items: [],
  hydrated: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(
      state,
      action: PayloadAction<Book>
    ) {
      const index = state.items.findIndex(
        book => book.id === action.payload.id
      );

      if (index >= 0) {
        // Đã yêu thích -> bỏ yêu thích
        state.items.splice(index, 1);
      } else {
        // Chưa yêu thích -> thêm yêu thích
        state.items.push(action.payload);
      }
    },

    hydrateWishlist(
      state,
      action: PayloadAction<Book[]>
    ) {
      state.items = action.payload;
      state.hydrated = true;
    },
  },
});

export const {
  toggleWishlist,
  hydrateWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

export const selectWishlist = (state: RootState) =>
  state.wishlist.items;

export const selectIsFavorite =
  (id: string) => (state: RootState) =>
    state.wishlist.items.some(
      book => book.id === id
    );
