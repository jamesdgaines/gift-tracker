import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTheme } from '@/theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  testID?: string;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  required?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      testID,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      inputStyle,
      labelStyle,
      disabled = false,
      required = false,
      onFocus,
      onBlur,
      ...textInputProps
    },
    ref
  ) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const getBorderColor = (): string => {
      if (error) {
        return theme.colors.error;
      }
      if (isFocused) {
        return theme.colors.borderFocus;
      }
      return theme.colors.inputBorder;
    };

    const inputContainerStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: disabled ? theme.colors.backgroundTertiary : theme.colors.inputBackground,
      borderWidth: 1,
      borderColor: getBorderColor(),
      borderRadius: theme.borderRadius.md,
      height: textInputProps.multiline ? undefined : theme.layout.inputHeight,
      minHeight: textInputProps.multiline ? 100 : undefined,
      paddingHorizontal: theme.spacing.md,
      opacity: disabled ? 0.6 : 1,
    };

    const textInputStyles: TextStyle = {
      flex: 1,
      color: theme.colors.text,
      fontSize: theme.fontSize.md,
      paddingVertical: theme.spacing.sm,
      textAlignVertical: textInputProps.multiline ? 'top' : 'center',
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                {
                  color: error ? theme.colors.error : theme.colors.text,
                  fontSize: theme.fontSize.sm,
                  fontWeight: theme.fontWeight.medium,
                },
                labelStyle,
              ]}
            >
              {label}
              {required && <Text style={{ color: theme.colors.error }}> *</Text>}
            </Text>
          </View>
        )}

        <View style={inputContainerStyles}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            testID={testID}
            style={[textInputStyles, inputStyle]}
            placeholderTextColor={theme.colors.placeholder}
            editable={!disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            {...textInputProps}
          />

          {rightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              style={styles.rightIconContainer}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {(error || hint) && (
          <Text
            style={[
              styles.helperText,
              {
                color: error ? theme.colors.error : theme.colors.textSecondary,
                fontSize: theme.fontSize.xs,
              },
            ]}
          >
            {error || hint}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    marginBottom: 4,
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
  helperText: {
    marginTop: 4,
  },
});

export default Input;
