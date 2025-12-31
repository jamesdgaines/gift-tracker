import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme';

export interface CardProps {
  testID?: string;
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  testID,
  children,
  onPress,
  onLongPress,
  style,
  padding = 'md',
  elevated = true,
  disabled = false,
}) => {
  const theme = useTheme();

  const getPadding = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };

  const cardStyles: ViewStyle = {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: getPadding(),
    ...(elevated ? theme.getShadowStyle('sm') : {}),
    opacity: disabled ? 0.6 : 1,
  };

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        style={[cardStyles, style]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} style={[cardStyles, style]}>
      {children}
    </View>
  );
};

export default Card;
