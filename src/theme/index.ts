import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors, palette } from './colors';
import { spacing, borderRadius, iconSize, avatarSize, layout, touchTarget } from './spacing';
import { typography, fontFamily, fontWeight, fontSize, lineHeight } from './typography';
import { shadows, getShadowStyle } from './shadows';

export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  iconSize: typeof iconSize;
  avatarSize: typeof avatarSize;
  layout: typeof layout;
  touchTarget: typeof touchTarget;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
  fontWeight: typeof fontWeight;
  fontSize: typeof fontSize;
  lineHeight: typeof lineHeight;
  shadows: typeof shadows;
  getShadowStyle: typeof getShadowStyle;
  isDark: boolean;
}

export const createTheme = (isDark: boolean): Theme => ({
  colors: isDark ? darkColors : lightColors,
  spacing,
  borderRadius,
  iconSize,
  avatarSize,
  layout,
  touchTarget,
  typography,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  shadows,
  getShadowStyle,
  isDark,
});

export const lightTheme = createTheme(false);
export const darkTheme = createTheme(true);

/**
 * Hook to get the current theme based on system preference or user setting
 * @param forcedTheme Optional theme override ('light' | 'dark')
 */
export const useTheme = (forcedTheme?: 'light' | 'dark' | 'system'): Theme => {
  const systemColorScheme = useColorScheme();

  if (forcedTheme === 'light') {
    return lightTheme;
  }

  if (forcedTheme === 'dark') {
    return darkTheme;
  }

  // 'system' or undefined - use system preference
  return systemColorScheme === 'dark' ? darkTheme : lightTheme;
};

// Re-export all theme components
export { lightColors, darkColors, palette } from './colors';
export type { ThemeColors } from './colors';
export {
  spacing,
  borderRadius,
  iconSize,
  avatarSize,
  layout,
  touchTarget,
} from './spacing';
export type { SpacingKey, SpacingValue, BorderRadiusKey, IconSizeKey, AvatarSizeKey } from './spacing';
export { typography, fontFamily, fontWeight, fontSize, lineHeight } from './typography';
export type { Typography, TypographyKey } from './typography';
export { shadows, getShadowStyle } from './shadows';
export type { ShadowStyle, ShadowKey } from './shadows';
