
import type {
    NavigatorScreenParams,
} from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Cart: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  BookDetail: { bookId: string };
  Wishlist: undefined;
};
