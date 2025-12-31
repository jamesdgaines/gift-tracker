import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useTheme } from '@/theme';
import { TEST_IDS } from '@/constants/testIDs';
import { HomeScreen, OccasionsScreen, ReportsScreen, SettingsScreen } from '@/screens';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Simple icon component (will be replaced with proper icons)
const TabIcon: React.FC<{ name: string; focused: boolean; color: string }> = ({
  name,
  color,
}) => (
  <Text style={{ color, fontSize: 20 }}>
    {name === 'Home' && '👥'}
    {name === 'Occasions' && '🎉'}
    {name === 'Reports' && '📊'}
    {name === 'Settings' && '⚙️'}
  </Text>
);

export const TabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopColor: theme.colors.border,
          height: theme.layout.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.medium,
        },
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.fontWeight.semibold,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'People',
          tabBarButtonTestID: TEST_IDS.NAV.TAB_HOME,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="Home" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Occasions"
        component={OccasionsScreen}
        options={{
          title: 'Occasions',
          tabBarButtonTestID: TEST_IDS.NAV.TAB_OCCASIONS,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="Occasions" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Reports',
          tabBarButtonTestID: TEST_IDS.NAV.TAB_REPORTS,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="Reports" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarButtonTestID: TEST_IDS.NAV.TAB_SETTINGS,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="Settings" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
