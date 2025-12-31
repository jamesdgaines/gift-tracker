import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import Button, { ButtonProps } from './Button';

export interface EmptyStateProps {
  testID?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionButton?: {
    title: string;
    onPress: () => void;
    variant?: ButtonProps['variant'];
  };
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  testID,
  title,
  description,
  icon,
  actionButton,
  style,
}) => {
  const theme = useTheme();

  return (
    <View testID={testID} style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.semibold,
          },
        ]}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={[
            styles.description,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.fontSize.md,
            },
          ]}
        >
          {description}
        </Text>
      )}

      {actionButton && (
        <View style={styles.buttonContainer}>
          <Button
            title={actionButton.title}
            onPress={actionButton.onPress}
            variant={actionButton.variant || 'primary'}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 24,
  },
});

export default EmptyState;
