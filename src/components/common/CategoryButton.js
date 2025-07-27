// CategoryButton Component for MigrAid
// Large, accessible buttons for resource categories with icons and counts

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, CommonStyles, Shadows, Accessibility } from '../../constants/theme';
import { RESOURCE_CATEGORIES } from '../../data/mockResources';

const CategoryButton = ({ 
  category, 
  title, 
  count = 0, 
  onPress, 
  selected = false,
  style 
}) => {
  
  const getCategoryColor = (category) => {
    const categoryColors = {
      [RESOURCE_CATEGORIES.LEGAL]: Colors.info,
      [RESOURCE_CATEGORIES.HEALTHCARE]: Colors.danger,
      [RESOURCE_CATEGORIES.FOOD]: Colors.warning,
      [RESOURCE_CATEGORIES.SHELTER]: Colors.secondary,
      [RESOURCE_CATEGORIES.EDUCATION]: Colors.primary,
      [RESOURCE_CATEGORIES.EMPLOYMENT]: Colors.verified,
      [RESOURCE_CATEGORIES.TRANSLATION]: Colors.anonymous,
    };
    return categoryColors[category] || Colors.primary;
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      [RESOURCE_CATEGORIES.LEGAL]: 'briefcase',
      [RESOURCE_CATEGORIES.HEALTHCARE]: 'medical',
      [RESOURCE_CATEGORIES.FOOD]: 'restaurant',
      [RESOURCE_CATEGORIES.SHELTER]: 'home',
      [RESOURCE_CATEGORIES.EDUCATION]: 'school',
      [RESOURCE_CATEGORIES.EMPLOYMENT]: 'business',
      [RESOURCE_CATEGORIES.TRANSLATION]: 'language',
    };
    return categoryIcons[category] || 'apps';
  };

  const getCategoryBackground = (category) => {
    const categoryBackgrounds = {
      [RESOURCE_CATEGORIES.LEGAL]: Colors.infoBackground,
      [RESOURCE_CATEGORIES.HEALTHCARE]: Colors.dangerBackground,
      [RESOURCE_CATEGORIES.FOOD]: Colors.warningBackground,
      [RESOURCE_CATEGORIES.SHELTER]: Colors.secondaryBackground,
      [RESOURCE_CATEGORIES.EDUCATION]: Colors.primaryBackground,
      [RESOURCE_CATEGORIES.EMPLOYMENT]: 'rgba(139, 92, 246, 0.1)', // Purple background
      [RESOURCE_CATEGORIES.TRANSLATION]: 'rgba(139, 92, 246, 0.15)', // Slightly darker purple
    };
    return categoryBackgrounds[category] || Colors.primaryBackground;
  };

  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);
  const categoryBackground = getCategoryBackground(category);

  return (
    <Pressable
      style={[
        styles.container,
        selected && [styles.containerSelected, { borderColor: categoryColor }],
        { backgroundColor: selected ? categoryBackground : Colors.surface },
        style
      ]}
      onPress={onPress}
      android_ripple={{ color: categoryColor + '20' }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title} category, ${count} resources available`}
      accessibilityHint="Tap to view resources in this category"
      accessibilityState={{ selected }}
    >
      {/* Icon Container */}
      <View style={[styles.iconContainer, { backgroundColor: categoryBackground }]}>
        <Ionicons 
          name={categoryIcon} 
          size={Accessibility.iconSizes.lg} 
          color={categoryColor} 
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[
          styles.title,
          selected && { color: categoryColor }
        ]}>
          {title}
        </Text>
        
        <Text style={[
          styles.count,
          selected && { color: categoryColor }
        ]}>
          {count} {count === 1 ? 'resource' : 'resources'}
        </Text>
      </View>

      {/* Arrow Indicator */}
      <View style={styles.arrow}>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={selected ? categoryColor : Colors.textSecondary} 
        />
      </View>

      {/* Selection Indicator */}
      {selected && (
        <View style={[styles.selectionIndicator, { backgroundColor: categoryColor }]} />
      )}
    </Pressable>
  );
};

// Large grid version for home screen
export const CategoryGridButton = ({ 
  category, 
  title, 
  count = 0, 
  onPress, 
  style 
}) => {
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);
  const categoryBackground = getCategoryBackground(category);

  const getCategoryColor = (category) => {
    const categoryColors = {
      [RESOURCE_CATEGORIES.LEGAL]: Colors.info,
      [RESOURCE_CATEGORIES.HEALTHCARE]: Colors.danger,
      [RESOURCE_CATEGORIES.FOOD]: Colors.warning,
      [RESOURCE_CATEGORIES.SHELTER]: Colors.secondary,
      [RESOURCE_CATEGORIES.EDUCATION]: Colors.primary,
      [RESOURCE_CATEGORIES.EMPLOYMENT]: Colors.verified,
      [RESOURCE_CATEGORIES.TRANSLATION]: Colors.anonymous,
    };
    return categoryColors[category] || Colors.primary;
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      [RESOURCE_CATEGORIES.LEGAL]: 'briefcase',
      [RESOURCE_CATEGORIES.HEALTHCARE]: 'medical',
      [RESOURCE_CATEGORIES.FOOD]: 'restaurant',
      [RESOURCE_CATEGORIES.SHELTER]: 'home',
      [RESOURCE_CATEGORIES.EDUCATION]: 'school',
      [RESOURCE_CATEGORIES.EMPLOYMENT]: 'business',
      [RESOURCE_CATEGORIES.TRANSLATION]: 'language',
    };
    return categoryIcons[category] || 'apps';
  };

  const getCategoryBackground = (category) => {
    const categoryBackgrounds = {
      [RESOURCE_CATEGORIES.LEGAL]: Colors.infoBackground,
      [RESOURCE_CATEGORIES.HEALTHCARE]: Colors.dangerBackground,
      [RESOURCE_CATEGORIES.FOOD]: Colors.warningBackground,
      [RESOURCE_CATEGORIES.SHELTER]: Colors.secondaryBackground,
      [RESOURCE_CATEGORIES.EDUCATION]: Colors.primaryBackground,
      [RESOURCE_CATEGORIES.EMPLOYMENT]: 'rgba(139, 92, 246, 0.1)',
      [RESOURCE_CATEGORIES.TRANSLATION]: 'rgba(139, 92, 246, 0.15)',
    };
    return categoryBackgrounds[category] || Colors.primaryBackground;
  };

  return (
    <Pressable
      style={[styles.gridContainer, { backgroundColor: categoryBackground }, style]}
      onPress={onPress}
      android_ripple={{ color: categoryColor + '20' }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title} category, ${count} resources available`}
      accessibilityHint="Tap to view resources in this category"
    >
      {/* Icon */}
      <View style={styles.gridIconContainer}>
        <Ionicons 
          name={categoryIcon} 
          size={Accessibility.iconSizes.xl} 
          color={categoryColor} 
        />
      </View>

      {/* Title */}
      <Text style={[styles.gridTitle, { color: categoryColor }]}>
        {title}
      </Text>

      {/* Count */}
      <Text style={styles.gridCount}>
        {count}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // List style button
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
    minHeight: Accessibility.minTouchSize + 20, // Extra space for comfortable touch
  },
  containerSelected: {
    ...Shadows.base,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.base,
  },
  content: {
    flex: 1,
  },
  title: {
    ...CommonStyles.bodyLarge,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  count: {
    ...CommonStyles.bodySmall,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  arrow: {
    marginLeft: Spacing.sm,
  },
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },

  // Grid style button
  gridContainer: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.xs,
    ...Shadows.sm,
    minHeight: Accessibility.minTouchSize * 2, // Large touch target
    minWidth: Accessibility.minTouchSize * 2,
  },
  gridIconContainer: {
    marginBottom: Spacing.sm,
  },
  gridTitle: {
    ...CommonStyles.body,
    fontWeight: Typography.fontWeight.semiBold,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  gridCount: {
    ...CommonStyles.bodySmall,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
});

export default CategoryButton; 