import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  testID?: string;
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  testID,
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const getBackgroundColor = (): string => {
    if (disabled) {
      return theme.colors.border;
    }

    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.primaryLight;
      case 'danger':
        return theme.colors.error;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = (): string => {
    if (disabled) {
      return theme.colors.textTertiary;
    }

    switch (variant) {
      case 'primary':
      case 'danger':
        return theme.colors.textInverse;
      case 'secondary':
        return theme.colors.primary;
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.textInverse;
    }
  };

  const getBorderColor = (): string | undefined => {
    if (variant === 'outline') {
      return disabled ? theme.colors.border : theme.colors.primary;
    }
    return undefined;
  };

  const getHeight = (): number => {
    switch (size) {
      case 'sm':
        return 36;
      case 'md':
        return 44;
      case 'lg':
        return 52;
      default:
        return 44;
    }
  };

  const getPadding = (): number => {
    switch (size) {
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

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return theme.fontSize.sm;
      case 'md':
        return theme.fontSize.md;
      case 'lg':
        return theme.fontSize.lg;
      default:
        return theme.fontSize.md;
    }
  };

  const buttonStyles: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    height: getHeight(),
    paddingHorizontal: getPadding(),
    borderRadius: theme.borderRadius.md,
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: getBorderColor(),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.6 : 1,
    ...theme.getShadowStyle(variant === 'primary' || variant === 'danger' ? 'sm' : 'none'),
  };

  const textStyles: TextStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
    fontWeight: theme.fontWeight.semibold,
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={getTextColor()} />;
    }

    const iconElement = icon && <View style={styles.iconWrapper}>{icon}</View>;

    return (
      <View style={styles.contentContainer}>
        {iconPosition === 'left' && iconElement}
        <Text style={[textStyles, textStyle]}>{title}</Text>
        {iconPosition === 'right' && iconElement}
      </View>
    );
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      style={[buttonStyles, style]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={title}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginHorizontal: 6,
  },
});

export default Button;
