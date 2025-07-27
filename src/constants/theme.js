// MigrAid Modern Design System
// Beautiful, vibrant, and accessible design for trust and safety

import { Platform } from 'react-native';

export const Colors = {
  // Primary brand colors - Vibrant Ocean Blue
  primary: '#0F7FFF', // Vibrant electric blue - modern, trustworthy
  primaryLight: '#4FB3FF',
  primaryDark: '#0B5CBD',
  primaryUltraLight: '#E5F4FF',
  primaryBackground: 'rgba(15, 127, 255, 0.08)',
  primaryGradient: ['#0F7FFF', '#4FB3FF'],
  
  // Secondary colors - Emerald Green
  secondary: '#00D68F', // Vibrant emerald - growth, success, hope
  secondaryLight: '#26FFAB',
  secondaryDark: '#00C085',
  secondaryUltraLight: '#E0FFF4',
  secondaryBackground: 'rgba(0, 214, 143, 0.08)',
  secondaryGradient: ['#00D68F', '#26FFAB'],
  
  // Accent colors - Sunset Orange
  accent: '#FF6B35', // Warm orange - energy, warmth, community
  accentLight: '#FF8A65',
  accentDark: '#E53E3E',
  accentUltraLight: '#FFF2EF',
  accentBackground: 'rgba(255, 107, 53, 0.08)',
  accentGradient: ['#FF6B35', '#FF8A65'],
  
  // Critical Alert - Coral Red
  danger: '#FF4757', // Vibrant coral red - urgent, important
  dangerLight: '#FF6B7A',
  dangerDark: '#C23E52',
  dangerUltraLight: '#FFE8EA',
  dangerBackground: 'rgba(255, 71, 87, 0.08)',
  dangerGradient: ['#FF4757', '#FF6B7A'],
  
  // Status colors - Enhanced vibrancy
  success: '#00D68F', // Vibrant green
  successLight: '#26FFAB',
  successDark: '#00C085',
  successBackground: 'rgba(0, 214, 143, 0.08)',
  successGradient: ['#00D68F', '#26FFAB'],
  
  warning: '#FFB800', // Golden yellow
  warningLight: '#FFCB3D',
  warningDark: '#E6A600',
  warningUltraLight: '#FFF8E0',
  warningBackground: 'rgba(255, 184, 0, 0.08)',
  warningGradient: ['#FFB800', '#FFCB3D'],
  
  info: '#5B9BD5', // Soft blue
  infoLight: '#7BB3E0',
  infoDark: '#4A7FA7',
  infoUltraLight: '#EFF6FF',
  infoBackground: 'rgba(91, 155, 213, 0.08)',
  infoGradient: ['#5B9BD5', '#7BB3E0'],
  
  // Neutral colors - Modern grayscale with subtle tints
  background: '#FAFBFC', // Soft off-white
  backgroundPure: '#FFFFFF', // Pure white
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceVariant: '#F5F7FA',
  surfaceHover: '#EDF2F7',
  surfacePressed: '#E2E8F0',
  
  // Modern gradient backgrounds
  backgroundGradient: ['#FAFBFC', '#F0F4F8'],
  surfaceGradient: ['#FFFFFF', '#F8FAFC'],
  
  // Text colors - Rich and readable
  text: '#1A202C', // Rich dark gray
  textSecondary: '#4A5568', // Medium gray
  textTertiary: '#718096', // Light gray
  textLight: '#A0AEC0', // Very light gray
  textDisabled: '#CBD5E1',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  textOnAccent: '#FFFFFF',
  
  // Privacy/Security indicators - Vibrant and meaningful
  secure: '#00D68F', // Vibrant green for security
  verified: '#0F7FFF', // Primary blue for verification
  anonymous: '#8B5CF6', // Purple for anonymity
  anonymousLight: '#A78BFA',
  anonymousDark: '#7C3AED',
  anonymousBackground: 'rgba(139, 92, 246, 0.08)',
  
  // Border and divider colors - Subtle but defined
  border: '#E2E8F0',
  borderLight: '#F7FAFC',
  borderMedium: '#CBD5E1',
  borderDark: '#A0AEC0',
  divider: '#F1F5F9',
  dividerDark: '#E2E8F0',
  
  // Shadow colors - Multiple depths
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowDark: 'rgba(0, 0, 0, 0.25)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowColored: 'rgba(15, 127, 255, 0.2)',
  
  // Interactive states
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',
  backdrop: 'rgba(26, 32, 44, 0.4)',
  
  // Special colors for visual interest
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  purpleDark: '#7C3AED',
  pink: '#ED64A6',
  pinkLight: '#F687B3',
  pinkDark: '#D53F8C',
  teal: '#38B2AC',
  tealLight: '#4FD1C7',
  tealDark: '#319795',
  indigo: '#667EEA',
  indigoLight: '#7F9CF5',
  indigoDark: '#5A67D8',
};

export const Typography = {
  // Font families - Modern, elegant typography
  fontFamily: {
    // Primary fonts - SF Pro for iOS feel, Roboto for Android
    display: 'SF Pro Display', // For headings and display text
    text: 'SF Pro Text', // For body text
    mono: 'SF Mono', // For code/monospace
    
    // Fallbacks for maximum compatibility
    primary: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    body: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fallback: 'System',
    
    // Weights
    light: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto-Light',
    regular: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto-Regular',
    medium: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto-Medium',
    semiBold: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto-Medium',
    bold: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto-Bold',
    black: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto-Black',
  },
  
  // Font sizes - Enhanced scale for better hierarchy
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
    '7xl': 56,
    '8xl': 64,
  },
  
  // Line heights - Optimized for modern UI
  lineHeight: {
    none: 1,
    tight: 1.15,
    snug: 1.25,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
    mega: 2,
  },
  
  // Font weights - Complete spectrum
  fontWeight: {
    thin: '100',
    extraLight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },
  
  // Letter spacing - Refined for better readability (React Native uses numeric values)
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },
};

export const Spacing = {
  px: 1,    // 1px
  0.5: 2,   // 2px
  1: 4,     // 4px
  1.5: 6,   // 6px
  2: 8,     // 8px
  2.5: 10,  // 10px
  3: 12,    // 12px
  3.5: 14,  // 14px
  4: 16,    // 16px
  5: 20,    // 20px
  6: 24,    // 24px
  7: 28,    // 28px
  8: 32,    // 32px
  9: 36,    // 36px
  10: 40,   // 40px
  12: 48,   // 48px
  14: 56,   // 56px
  16: 64,   // 64px
  20: 80,   // 80px
  24: 96,   // 96px
  28: 112,  // 112px
  32: 128,  // 128px
  
  // Legacy names for backward compatibility
  xs: 4,
  sm: 8,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
};

export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  base: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  full: 9999,
  
  // Special radius for modern UI elements
  button: 12,
  card: 16,
  modal: 20,
  sheet: 24,
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  base: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  '2xl': {
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  
  // Colored shadows for vibrant effects
  primaryShadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryShadow: {
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  accentShadow: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Special effects
  glow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  innerShadow: {
    shadowColor: Colors.shadowLight,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 0,
  },
};

// Modern UI Component Styles
export const CommonStyles = {
  // Enhanced Card styles with vibrant touches
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    ...Shadows.md,
    borderWidth: 0,
  },
  
  cardVibrant: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    ...Shadows.lg,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    overflow: 'hidden',
  },
  
  cardElevated: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    ...Shadows.xl,
    borderWidth: 0,
  },
  
  cardFlat: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  
  cardGradient: {
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    ...Shadows.lg,
    overflow: 'hidden',
  },
  
  // Modern Button styles with vibrant effects
  buttonBase: {
    borderRadius: BorderRadius.button,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    flexDirection: 'row',
  },
  
  buttonPrimary: {
    backgroundColor: Colors.primary,
    ...Shadows.primaryShadow,
  },
  
  buttonSecondary: {
    backgroundColor: Colors.secondary,
    ...Shadows.secondaryShadow,
  },
  
  buttonAccent: {
    backgroundColor: Colors.accent,
    ...Shadows.accentShadow,
  },
  
  buttonDanger: {
    backgroundColor: Colors.danger,
    ...Shadows.md,
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Shadows.xs,
  },
  
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  
  buttonGlow: {
    backgroundColor: Colors.primary,
    ...Shadows.glow,
  },
  
  // Enhanced Input styles
  inputBase: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    minHeight: 52,
    fontFamily: Typography.fontFamily.body,
  },
  
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryUltraLight,
    ...Shadows.sm,
  },
  
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerUltraLight,
  },
  
  inputSuccess: {
    borderColor: Colors.success,
    backgroundColor: Colors.secondaryUltraLight,
  },
  
  // Beautiful Text styles with modern typography
  display: {
    fontSize: Typography.fontSize['6xl'],
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    lineHeight: Typography.lineHeight.tight,
    fontFamily: Typography.fontFamily.display,
    letterSpacing: Typography.letterSpacing.tight,
  },
  
  heading1: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    lineHeight: Typography.lineHeight.tight,
    fontFamily: Typography.fontFamily.display,
    letterSpacing: Typography.letterSpacing.tight,
  },
  
  heading2: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    lineHeight: Typography.lineHeight.snug,
    fontFamily: Typography.fontFamily.display,
  },
  
  heading3: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    lineHeight: Typography.lineHeight.snug,
    fontFamily: Typography.fontFamily.display,
  },
  
  heading4: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    lineHeight: Typography.lineHeight.normal,
    fontFamily: Typography.fontFamily.body,
  },
  
  bodyXL: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.text,
    lineHeight: Typography.lineHeight.relaxed,
    fontFamily: Typography.fontFamily.body,
  },
  
  bodyLarge: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.text,
    lineHeight: Typography.lineHeight.relaxed,
    fontFamily: Typography.fontFamily.body,
  },
  
  body: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.text,
    lineHeight: Typography.lineHeight.normal,
    fontFamily: Typography.fontFamily.body,
  },
  
  bodyMedium: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    lineHeight: Typography.lineHeight.normal,
    fontFamily: Typography.fontFamily.body,
  },
  
  bodySmall: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal,
    fontFamily: Typography.fontFamily.body,
  },
  
  caption: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textTertiary,
    lineHeight: Typography.lineHeight.normal,
    fontFamily: Typography.fontFamily.body,
    letterSpacing: Typography.letterSpacing.wide,
  },
  
  // Vibrant Badges and indicators
  privacyBadge: {
    backgroundColor: Colors.secondaryBackground,
    borderColor: Colors.secondary,
    borderWidth: 2,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    ...Shadows.sm,
  },
  
  verifiedBadge: {
    backgroundColor: Colors.primaryBackground,
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    ...Shadows.sm,
  },
  
  dangerBadge: {
    backgroundColor: Colors.dangerBackground,
    borderColor: Colors.danger,
    borderWidth: 2,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    ...Shadows.sm,
  },
  
  accentBadge: {
    backgroundColor: Colors.accentBackground,
    borderColor: Colors.accent,
    borderWidth: 2,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    ...Shadows.sm,
  },
  
  warningBadge: {
    backgroundColor: Colors.warningBackground,
    borderColor: Colors.warning,
    borderWidth: 2,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    ...Shadows.sm,
  },
  
  // Modern shadows
  shadow: Shadows.md,
  shadowLight: Shadows.sm,
  shadowHeavy: Shadows.xl,
  
  // Layout helpers
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  rowStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
};

// Accessibility configurations
export const Accessibility = {
  minTouchSize: 44, // Minimum touch target size (iOS HIG & Android Guidelines)
  iconSizes: {
    xs: 12,
    sm: 16,
    base: 24,
    lg: 32,
    xl: 48,
    '2xl': 64,
  },
  
  // Focus indicators
  focusRing: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.base,
  },
  
  // High contrast mode support
  highContrast: {
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
  },
};

// Animation configurations
export const Animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  CommonStyles,
  Accessibility,
  Animations,
}; 