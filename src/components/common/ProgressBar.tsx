import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { useTheme } from '@/theme';

export interface ProgressBarProps {
  testID?: string;
  progress: number; // 0-100
  height?: number;
  showPercentage?: boolean;
  label?: string;
  subLabel?: string;
  animated?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  autoVariant?: boolean; // Automatically set variant based on progress
  thresholds?: {
    warning?: number;
    error?: number;
  };
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  testID,
  progress,
  height = 8,
  showPercentage = false,
  label,
  subLabel,
  animated = true,
  variant = 'default',
  autoVariant = false,
  thresholds = { warning: 75, error: 100 },
  style,
}) => {
  const theme = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, animated, animatedWidth]);

  const getVariant = (): 'default' | 'success' | 'warning' | 'error' => {
    if (!autoVariant) return variant;

    if (clampedProgress >= (thresholds.error || 100)) {
      return 'error';
    }
    if (clampedProgress >= (thresholds.warning || 75)) {
      return 'warning';
    }
    return 'default';
  };

  const getProgressColor = (): string => {
    const currentVariant = getVariant();

    switch (currentVariant) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'default':
      default:
        return theme.colors.primary;
    }
  };

  const interpolatedWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View testID={testID} style={[styles.container, style]}>
      {(label || showPercentage) && (
        <View style={styles.headerContainer}>
          {label && (
            <Text
              style={[
                styles.label,
                { color: theme.colors.text, fontSize: theme.fontSize.sm },
              ]}
            >
              {label}
            </Text>
          )}
          {showPercentage && (
            <Text
              style={[
                styles.percentage,
                { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
              ]}
            >
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: theme.colors.backgroundTertiary,
            borderRadius: height / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progress,
            {
              width: interpolatedWidth,
              height,
              backgroundColor: getProgressColor(),
              borderRadius: height / 2,
            },
          ]}
        />
      </View>

      {subLabel && (
        <Text
          style={[
            styles.subLabel,
            { color: theme.colors.textSecondary, fontSize: theme.fontSize.xs },
          ]}
        >
          {subLabel}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontWeight: '500',
  },
  percentage: {
    fontWeight: '500',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  subLabel: {
    marginTop: 4,
  },
});

export default ProgressBar;
