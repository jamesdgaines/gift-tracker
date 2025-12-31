/**
 * Spacing scale for consistent layout
 * Based on 4px base unit
 */

export const spacing = {
  /** 0px */
  none: 0,
  /** 2px */
  xxxs: 2,
  /** 4px */
  xxs: 4,
  /** 8px */
  xs: 8,
  /** 12px */
  sm: 12,
  /** 16px */
  md: 16,
  /** 20px */
  lg: 20,
  /** 24px */
  xl: 24,
  /** 32px */
  xxl: 32,
  /** 40px */
  xxxl: 40,
  /** 48px */
  huge: 48,
  /** 64px */
  massive: 64,
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingKey];

/**
 * Border radius values
 */
export const borderRadius = {
  /** 0px */
  none: 0,
  /** 4px */
  sm: 4,
  /** 8px */
  md: 8,
  /** 12px */
  lg: 12,
  /** 16px */
  xl: 16,
  /** 24px */
  xxl: 24,
  /** Full rounded */
  full: 9999,
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;

/**
 * Icon sizes
 */
export const iconSize = {
  /** 12px */
  xs: 12,
  /** 16px */
  sm: 16,
  /** 20px */
  md: 20,
  /** 24px */
  lg: 24,
  /** 32px */
  xl: 32,
  /** 40px */
  xxl: 40,
  /** 48px */
  xxxl: 48,
} as const;

export type IconSizeKey = keyof typeof iconSize;

/**
 * Avatar sizes
 */
export const avatarSize = {
  /** 24px */
  xs: 24,
  /** 32px */
  sm: 32,
  /** 40px */
  md: 40,
  /** 48px */
  lg: 48,
  /** 64px */
  xl: 64,
  /** 80px */
  xxl: 80,
  /** 120px */
  xxxl: 120,
} as const;

export type AvatarSizeKey = keyof typeof avatarSize;

/**
 * Touch target minimum size (accessibility)
 */
export const touchTarget = {
  min: 44, // Minimum recommended touch target
} as const;

/**
 * Common layout values
 */
export const layout = {
  /** Screen horizontal padding */
  screenPaddingHorizontal: spacing.md,
  /** Screen vertical padding */
  screenPaddingVertical: spacing.md,
  /** Card padding */
  cardPadding: spacing.md,
  /** List item padding */
  listItemPadding: spacing.md,
  /** Section spacing */
  sectionSpacing: spacing.xl,
  /** Form field spacing */
  formFieldSpacing: spacing.md,
  /** Button height */
  buttonHeight: 48,
  /** Input height */
  inputHeight: 48,
  /** Header height */
  headerHeight: 56,
  /** Tab bar height */
  tabBarHeight: 60,
  /** Banner ad height */
  bannerAdHeight: 50,
} as const;
