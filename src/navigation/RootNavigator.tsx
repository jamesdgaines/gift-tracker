import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { TabNavigator } from './TabNavigator';
import { PersonDetailScreen, PersonFormScreen } from '@/screens';
import type { RootStackParamList } from './types';

// Placeholder screens for screens that aren't implemented yet
const PlaceholderDetailScreen: React.FC<{ name: string; route: { params?: object } }> = ({
  name,
  route,
}) => {
  const theme = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.colors.background }]}>
      <Text style={{ color: theme.colors.text, fontSize: 18 }}>{name}</Text>
      <Text style={{ color: theme.colors.textSecondary, marginTop: 8 }}>
        Coming soon...
      </Text>
      <Text style={{ color: theme.colors.textTertiary, marginTop: 8, fontSize: 12 }}>
        Params: {JSON.stringify(route.params)}
      </Text>
    </View>
  );
};

const GiftDetailScreen = ({ route }: { route: { params?: object } }) => (
  <PlaceholderDetailScreen name="Gift Detail" route={route} />
);
const GiftFormScreen = ({ route }: { route: { params?: object } }) => (
  <PlaceholderDetailScreen name="Gift Form" route={route} />
);
const OccasionDetailScreen = ({ route }: { route: { params?: object } }) => (
  <PlaceholderDetailScreen name="Occasion Detail" route={route} />
);
const OccasionFormScreen = ({ route }: { route: { params?: object } }) => (
  <PlaceholderDetailScreen name="Occasion Form" route={route} />
);
const GiftHistoryScreen = ({ route }: { route: { params?: object } }) => (
  <PlaceholderDetailScreen name="Gift History" route={route} />
);

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.fontWeight.semibold,
        },
                contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonDetail"
        component={PersonDetailScreen}
        options={{
          title: 'Person Details',
        }}
      />
      <Stack.Screen
        name="PersonForm"
        component={PersonFormScreen}
        options={({ route }) => ({
          title: route.params?.personId ? 'Edit Person' : 'Add Person',
          presentation: 'modal',
        })}
      />
      <Stack.Screen
        name="GiftDetail"
        component={GiftDetailScreen}
        options={{
          title: 'Gift Details',
        }}
      />
      <Stack.Screen
        name="GiftForm"
        component={GiftFormScreen}
        options={({ route }) => ({
          title: route.params?.giftId ? 'Edit Gift' : 'Add Gift',
          presentation: 'modal',
        })}
      />
      <Stack.Screen
        name="OccasionDetail"
        component={OccasionDetailScreen}
        options={{
          title: 'Occasion Details',
        }}
      />
      <Stack.Screen
        name="OccasionForm"
        component={OccasionFormScreen}
        options={({ route }) => ({
          title: route.params?.occasionId ? 'Edit Occasion' : 'Add Occasion',
          presentation: 'modal',
        })}
      />
      <Stack.Screen
        name="GiftHistory"
        component={GiftHistoryScreen}
        options={{
          title: 'Gift History',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default RootNavigator;
