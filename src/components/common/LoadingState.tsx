import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export interface LoadingStateProps {
  testID?: string;
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  testID,
  message,
  size = 'large',
  color,
  fullScreen = false,
  style,
}) => {
  const theme = useTheme();

  const containerStyles: ViewStyle = {
    ...(fullScreen ? styles.fullScreen : styles.inline),
    backgroundColor: fullScreen ? theme.colors.background : 'transparent',
  };

  return (
    <View testID={testID} style={[containerStyles, style]}>
      <ActivityIndicator size={size} color={color || theme.colors.primary} />
      {message && (
        <Text
          style={[
            styles.message,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.fontSize.sm,
            },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
});

export default LoadingState;
