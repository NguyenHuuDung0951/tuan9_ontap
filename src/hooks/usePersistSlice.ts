
import { useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PayloadAction } from '@reduxjs/toolkit';

import {
    useAppDispatch,
    useAppSelector,
} from '../store';

import type { RootState } from '../store';

import { hydrateCart } from '../store/cartSlice';
import { hydrateWishlist } from '../store/wishlistSlice';

// Hook dùng chung để lưu và khôi phục dữ liệu
export function usePersistSlice<T>(options: {
  key: string;
  selectItems: (state: RootState) => T[];
  selectHydrated: (state: RootState) => boolean;
  hydrate: (items: T[]) => PayloadAction<T[]>;
}) {
  const {
    key,
    selectItems,
    selectHydrated,
    hydrate,
  } = options;

  const dispatch = useAppDispatch();

  const items = useAppSelector(selectItems);
  const hydrated = useAppSelector(selectHydrated);

  // 1. Đọc dữ liệu từ AsyncStorage khi mở app
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const raw = await AsyncStorage.getItem(key);

        if (active) {
          const savedItems: T[] = raw
            ? JSON.parse(raw)
            : [];

          dispatch(hydrate(savedItems));
        }
      } catch (error) {
        console.warn('Lỗi đọc dữ liệu:', error);

        if (active) {
          dispatch(hydrate([]));
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [key, dispatch, hydrate]);

  // 2. Ghi dữ liệu khi Redux thay đổi
  useEffect(() => {
    if (!hydrated) return;

    AsyncStorage.setItem(
      key,
      JSON.stringify(items)
    ).catch(error => {
      console.warn('Lỗi lưu dữ liệu:', error);
    });
  }, [key, items, hydrated]);

  return hydrated;
}

// Selector được khai báo ngoài hook
const selectCartItems = (s: RootState) => s.cart.items;
const selectCartHydrated = (s: RootState) =>
  s.cart.hydrated;

const selectWishlistItems = (s: RootState) =>
  s.wishlist.items;
const selectWishlistHydrated = (s: RootState) =>
  s.wishlist.hydrated;

// Hook quản lý cả giỏ hàng và yêu thích
export function useAppPersistence() {
  const cartReady = usePersistSlice({
    key: '@bookstore/cart',
    selectItems: selectCartItems,
    selectHydrated: selectCartHydrated,
    hydrate: hydrateCart,
  });

  const wishlistReady = usePersistSlice({
    key: '@bookstore/wishlist',
    selectItems: selectWishlistItems,
    selectHydrated: selectWishlistHydrated,
    hydrate: hydrateWishlist,
  });

  return cartReady && wishlistReady;
}
