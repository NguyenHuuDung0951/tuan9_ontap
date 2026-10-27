import { useAppPersistence, } from '@/hooks/usePersistSlice';
import AppNavigator from '@/navigation/AppNavigation';
import cartReducer from '@/store/cartSlice';
import wishlistReducer from '@/store/wishlistSlice';
import { NavigationContainer, } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { ActivityIndicator } from 'react-native';
import { SafeAreaProvider, } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
function Root() {
  const ready = useAppPersistence();

  if (!ready) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Root />
      </Provider>
    </SafeAreaProvider>
  );
}




export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch =
  useDispatch.withTypes<AppDispatch>();

export const useAppSelector =
  useSelector.withTypes<RootState>();
