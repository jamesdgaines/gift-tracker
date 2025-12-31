/**
 * Color palette for the Gift Tracker app
 * Supports light and dark modes
 */

export const palette = {
  // Primary brand colors
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main primary
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Secondary accent colors
  secondary: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899', // Main secondary
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },

  // Success colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main success
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Warning colors
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Main warning
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error colors
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Main error
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Neutral grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Pure colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export interface ThemeColors {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceElevated: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  textLink: string;

  // Borders
  border: string;
  borderLight: string;
  borderFocus: string;

  // Semantic
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;

  // Status colors
  statusIdea: string;
  statusPurchased: string;
  statusWrapped: string;
  statusHidden: string;
  statusGiven: string;
  statusReturned: string;

  // Priority colors
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  priorityMustHave: string;

  // Interactive
  ripple: string;
  overlay: string;
  shadow: string;

  // Specific components
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  headerBackground: string;
  cardBackground: string;
  inputBackground: string;
  inputBorder: string;
  placeholder: string;
}

export const lightColors: ThemeColors = {
  // Backgrounds
  background: palette.gray[50],
  backgroundSecondary: palette.white,
  backgroundTertiary: palette.gray[100],
  surface: palette.white,
  surfaceElevated: palette.white,

  // Text
  text: palette.gray[900],
  textSecondary: palette.gray[600],
  textTertiary: palette.gray[400],
  textInverse: palette.white,
  textLink: palette.primary[600],

  // Borders
  border: palette.gray[200],
  borderLight: palette.gray[100],
  borderFocus: palette.primary[500],

  // Semantic
  primary: palette.primary[500],
  primaryLight: palette.primary[100],
  primaryDark: palette.primary[700],
  secondary: palette.secondary[500],
  success: palette.success[500],
  successLight: palette.success[100],
  warning: palette.warning[500],
  warningLight: palette.warning[100],
  error: palette.error[500],
  errorLight: palette.error[100],

  // Status colors
  statusIdea: palette.gray[400],
  statusPurchased: palette.primary[500],
  statusWrapped: '#8B5CF6',
  statusHidden: palette.warning[500],
  statusGiven: palette.success[500],
  statusReturned: palette.error[500],

  // Priority colors
  priorityLow: palette.gray[400],
  priorityMedium: palette.primary[500],
  priorityHigh: palette.warning[500],
  priorityMustHave: palette.error[500],

  // Interactive
  ripple: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Specific components
  tabBarBackground: palette.white,
  tabBarActive: palette.primary[500],
  tabBarInactive: palette.gray[400],
  headerBackground: palette.white,
  cardBackground: palette.white,
  inputBackground: palette.gray[50],
  inputBorder: palette.gray[300],
  placeholder: palette.gray[400],
};

export const darkColors: ThemeColors = {
  // Backgrounds
  background: palette.gray[900],
  backgroundSecondary: palette.gray[800],
  backgroundTertiary: palette.gray[700],
  surface: palette.gray[800],
  surfaceElevated: palette.gray[700],

  // Text
  text: palette.gray[50],
  textSecondary: palette.gray[300],
  textTertiary: palette.gray[500],
  textInverse: palette.gray[900],
  textLink: palette.primary[400],

  // Borders
  border: palette.gray[700],
  borderLight: palette.gray[800],
  borderFocus: palette.primary[400],

  // Semantic
  primary: palette.primary[400],
  primaryLight: palette.primary[900],
  primaryDark: palette.primary[300],
  secondary: palette.secondary[400],
  success: palette.success[400],
  successLight: palette.success[900],
  warning: palette.warning[400],
  warningLight: palette.warning[900],
  error: palette.error[400],
  errorLight: palette.error[900],

  // Status colors
  statusIdea: palette.gray[500],
  statusPurchased: palette.primary[400],
  statusWrapped: '#A78BFA',
  statusHidden: palette.warning[400],
  statusGiven: palette.success[400],
  statusReturned: palette.error[400],

  // Priority colors
  priorityLow: palette.gray[500],
  priorityMedium: palette.primary[400],
  priorityHigh: palette.warning[400],
  priorityMustHave: palette.error[400],

  // Interactive
  ripple: 'rgba(255, 255, 255, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',

  // Specific components
  tabBarBackground: palette.gray[800],
  tabBarActive: palette.primary[400],
  tabBarInactive: palette.gray[500],
  headerBackground: palette.gray[800],
  cardBackground: palette.gray[800],
  inputBackground: palette.gray[700],
  inputBorder: palette.gray[600],
  placeholder: palette.gray[500],
};
