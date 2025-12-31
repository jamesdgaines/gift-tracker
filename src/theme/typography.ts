import { TextStyle, Platform } from 'react-native';

/**
 * Font family configuration
 */
export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
} as const;

/**
 * Font weight values
 */
export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

/**
 * Font sizes
 */
export const fontSize = {
  /** 10px */
  xxs: 10,
  /** 12px */
  xs: 12,
  /** 14px */
  sm: 14,
  /** 16px */
  md: 16,
  /** 18px */
  lg: 18,
  /** 20px */
  xl: 20,
  /** 24px */
  xxl: 24,
  /** 28px */
  xxxl: 28,
  /** 32px */
  huge: 32,
  /** 40px */
  massive: 40,
} as const;

/**
 * Line height values
 */
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Pre-defined text styles
 */
export interface Typography {
  // Headings
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;

  // Body text
  bodyLarge: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;

  // Labels and captions
  label: TextStyle;
  labelSmall: TextStyle;
  caption: TextStyle;

  // Special
  button: TextStyle;
  buttonSmall: TextStyle;
  link: TextStyle;
  overline: TextStyle;
}

export const typography: Typography = {
  // Headings
  h1: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.huge * lineHeight.tight,
  },
  h2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
  },
  h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xl * lineHeight.tight,
  },
  h4: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg * lineHeight.normal,
  },

  // Body text
  bodyLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.lg * lineHeight.relaxed,
  },
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.relaxed,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },

  // Labels and captions
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  labelSmall: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xs * lineHeight.normal,
  },
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
  },

  // Special
  button: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  buttonSmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  link: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.md * lineHeight.normal,
    textDecorationLine: 'underline',
  },
  overline: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xxs * lineHeight.normal,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
};

export type TypographyKey = keyof Typography;
