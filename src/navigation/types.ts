import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Root stack contains all screens
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  PersonDetail: { personId: string };
  PersonForm: { personId?: string };
  GiftDetail: { giftId: string; personId: string };
  GiftForm: { personId: string; giftId?: string; occasionId?: string };
  OccasionDetail: { occasionId: string };
  OccasionForm: { occasionId?: string; personId?: string };
  GiftHistory: { personId: string };
};

// Main tab navigator
export type MainTabParamList = {
  Home: undefined;
  Occasions: undefined;
  Reports: undefined;
  Settings: undefined;
};

// Screen props for root stack screens
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// Screen props for tab screens
export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

// Declare global types for useNavigation hook
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
