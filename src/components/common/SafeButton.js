// SafeButton - Beautiful, Accessible Button Component for MigrAid
// Modern design with vibrant colors and smooth interactions

import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Accessibility, Shadows } from '../../constants/theme';
import GradientView, { GradientPresets } from './GradientView';

const SafeButton = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, accent, outline, danger, ghost, glow
  size = 'base', // sm, base, lg, xl
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  gradient = false,
  accessibilityLabel,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyles = () => {
    const baseStyle = {
      minHeight: Accessibility.minTouchSize,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: BorderRadius.button,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.base,
      overflow: 'hidden',
    };

    // Size variations
    if (size === 'sm') {
      baseStyle.paddingHorizontal = Spacing.base;
      baseStyle.paddingVertical = Spacing.sm;
      baseStyle.minHeight = 40;
      baseStyle.borderRadius = BorderRadius.lg;
    } else if (size === 'lg') {
      baseStyle.paddingHorizontal = Spacing.xl;
      baseStyle.paddingVertical = Spacing.lg;
      baseStyle.minHeight = 56;
      baseStyle.borderRadius = BorderRadius.xl;
    } else if (size === 'xl') {
      baseStyle.paddingHorizontal = Spacing['2xl'];
      baseStyle.paddingVertical = Spacing.xl;
      baseStyle.minHeight = 64;
      baseStyle.borderRadius = BorderRadius.xl;
    }

    // Variant styles with beautiful shadows and effects
    let variantStyle = {};
    let shadowStyle = {};
    
    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: disabled ? Colors.surfaceVariant : Colors.primary,
          borderWidth: 0,
        };
        shadowStyle = disabled ? {} : Shadows.primaryShadow;
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: disabled ? Colors.surfaceVariant : Colors.secondary,
          borderWidth: 0,
        };
        shadowStyle = disabled ? {} : Shadows.secondaryShadow;
        break;
      case 'accent':
        variantStyle = {
          backgroundColor: disabled ? Colors.surfaceVariant : Colors.accent,
          borderWidth: 0,
        };
        shadowStyle = disabled ? {} : Shadows.accentShadow;
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: Colors.backgroundPure,
          borderWidth: 3,
          borderColor: disabled ? Colors.borderMedium : Colors.primary,
        };
        shadowStyle = disabled ? {} : Shadows.sm;
        break;
      case 'danger':
        variantStyle = {
          backgroundColor: disabled ? Colors.surfaceVariant : Colors.danger,
          borderWidth: 0,
        };
        shadowStyle = disabled ? {} : Shadows.lg;
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
        shadowStyle = {};
        break;
      case 'glow':
        variantStyle = {
          backgroundColor: disabled ? Colors.surfaceVariant : Colors.primary,
          borderWidth: 0,
        };
        shadowStyle = disabled ? {} : Shadows.glow;
        break;
      default:
        variantStyle = {
          backgroundColor: disabled ? Colors.surfaceVariant : Colors.primary,
          borderWidth: 0,
        };
        shadowStyle = disabled ? {} : Shadows.primaryShadow;
    }

    // Full width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return { ...baseStyle, ...variantStyle, ...shadowStyle };
  };

  const getTextStyles = () => {
    const baseTextStyle = {
      fontSize: Typography.fontSize.md,
      fontWeight: Typography.fontWeight.semiBold,
      textAlign: 'center',
      fontFamily: Typography.fontFamily.body,
      letterSpacing: Typography.letterSpacing.wide,
    };

    // Size variations
    if (size === 'sm') {
      baseTextStyle.fontSize = Typography.fontSize.sm;
      baseTextStyle.fontWeight = Typography.fontWeight.medium;
    } else if (size === 'lg') {
      baseTextStyle.fontSize = Typography.fontSize.lg;
      baseTextStyle.fontWeight = Typography.fontWeight.bold;
    } else if (size === 'xl') {
      baseTextStyle.fontSize = Typography.fontSize.xl;
      baseTextStyle.fontWeight = Typography.fontWeight.bold;
    }

    // Variant text colors
    let textColor = Colors.textOnPrimary; // Default white text
    if (variant === 'outline') {
      textColor = disabled ? Colors.textLight : Colors.primary;
    } else if (variant === 'ghost') {
      textColor = disabled ? Colors.textLight : Colors.primary;
    } else if (disabled) {
      textColor = Colors.textLight;
    }

    return {
      ...baseTextStyle,
      color: textColor,
    };
  };

  const getGradientPreset = () => {
    switch (variant) {
      case 'primary':
        return GradientPresets.primary;
      case 'secondary':
        return GradientPresets.secondary;
      case 'accent':
        return GradientPresets.accent;
      case 'danger':
        return GradientPresets.danger;
      default:
        return GradientPresets.primary;
    }
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.textOnPrimary} 
        />
      ) : (
        <>
          {icon && (
            <View style={{ marginRight: title ? Spacing.sm : 0 }}>
              {icon}
            </View>
          )}
          {title && (
            <Text style={[getTextStyles(), textStyle]}>
              {title}
            </Text>
          )}
        </>
      )}
    </>
  );

  if (gradient && !disabled && (variant === 'primary' || variant === 'secondary' || variant === 'accent' || variant === 'danger')) {
    return (
      <Pressable
        style={({ pressed }) => [
          getButtonStyles(),
          { backgroundColor: 'transparent' },
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          style,
        ]}
        onPress={handlePress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: disabled || loading }}
        {...props}
      >
        <GradientView 
          {...getGradientPreset()}
          style={StyleSheet.absoluteFill}
        />
        <ButtonContent />
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyles(),
        pressed && !disabled && { 
          opacity: 0.85, 
          transform: [{ scale: 0.98 }] 
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      <ButtonContent />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Additional custom styles can be added here if needed
});

export default SafeButton; 