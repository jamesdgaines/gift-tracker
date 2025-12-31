import { Platform, ViewStyle } from 'react-native';

/**
 * Shadow styles for elevation effects
 * iOS uses shadow* properties, Android uses elevation
 */

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

const createShadow = (
  offsetY: number,
  blur: number,
  opacity: number,
  elevation: number,
  color = '#000000'
): ShadowStyle => ({
  shadowColor: color,
  shadowOffset: {
    width: 0,
    height: offsetY,
  },
  shadowOpacity: opacity,
  shadowRadius: blur,
  elevation,
});

export const shadows = {
  /** No shadow */
  none: createShadow(0, 0, 0, 0),

  /** Subtle shadow for cards */
  sm: createShadow(1, 2, 0.05, 1),

  /** Default shadow */
  md: createShadow(2, 4, 0.1, 2),

  /** Elevated shadow for modals, dropdowns */
  lg: createShadow(4, 8, 0.12, 4),

  /** Strong shadow for floating elements */
  xl: createShadow(8, 16, 0.15, 8),

  /** Maximum shadow for overlays */
  xxl: createShadow(12, 24, 0.2, 12),
} as const;

export type ShadowKey = keyof typeof shadows;

/**
 * Get platform-specific shadow style
 * On Android, only elevation is used
 * On iOS, shadow* properties are used
 */
export const getShadowStyle = (key: ShadowKey): ViewStyle => {
  const shadow = shadows[key];

  if (Platform.OS === 'android') {
    return {
      elevation: shadow.elevation,
    };
  }

  return {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
  };
};
