

import {
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import type {
    RootStackParamList,
    TabParamList,
} from './types';

import CartScreen from '@/screens/CartScreens';
import HomeScreen from '@/screens/HomeSreen';
import AccountScreen from '../screens/AccountScreen';
import BookDetailScreen from '../screens/BookDetailScreen';

import { useAppSelector } from '../store';
import { selectCartCount } from '../store/cartSlice';

const Tab =
  createBottomTabNavigator<TabParamList>();

const Stack =
  createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  const cartCount = useAppSelector(selectCartCount);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Giỏ hàng',
          tabBarBadge: cartCount || undefined,
        }}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: 'Tài khoản',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{
          title: 'Chi tiết sách',
        }}
      />
    </Stack.Navigator>
  );
}
