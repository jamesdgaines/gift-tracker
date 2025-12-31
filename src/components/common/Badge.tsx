import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/theme';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'custom';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  testID?: string;
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  testID,
  label,
  variant = 'default',
  size = 'md',
  color,
  backgroundColor,
  style,
  textStyle,
  icon,
}) => {
  const theme = useTheme();

  const getBackgroundColor = (): string => {
    if (backgroundColor) return backgroundColor;

    switch (variant) {
      case 'primary':
        return theme.colors.primaryLight;
      case 'success':
        return theme.colors.successLight;
      case 'warning':
        return theme.colors.warningLight;
      case 'error':
        return theme.colors.errorLight;
      case 'default':
      default:
        return theme.colors.backgroundTertiary;
    }
  };

  const getTextColor = (): string => {
    if (color) return color;

    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'default':
      default:
        return theme.colors.textSecondary;
    }
  };

  const getPadding = (): { paddingHorizontal: number; paddingVertical: number } => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 6, paddingVertical: 2 };
      case 'md':
        return { paddingHorizontal: 8, paddingVertical: 4 };
      case 'lg':
        return { paddingHorizontal: 12, paddingVertical: 6 };
      default:
        return { paddingHorizontal: 8, paddingVertical: 4 };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return theme.fontSize.xxs;
      case 'md':
        return theme.fontSize.xs;
      case 'lg':
        return theme.fontSize.sm;
      default:
        return theme.fontSize.xs;
    }
  };

  const padding = getPadding();

  const badgeStyles: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: padding.paddingHorizontal,
    paddingVertical: padding.paddingVertical,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  };

  const labelStyles: TextStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
    fontWeight: theme.fontWeight.medium,
  };

  return (
    <View testID={testID} style={[badgeStyles, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[labelStyles, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 4,
  },
});

export default Badge;
