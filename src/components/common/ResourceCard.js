// ResourceCard Component for MigrAid
// Displays resource information with verification badges and category-based styling

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, CommonStyles, Shadows } from '../../constants/theme';
import { RESOURCE_CATEGORIES } from '../../data/mockResources';

const ResourceCard = ({ 
  resource, 
  onPress, 
  showDistance = false, 
  distance = null,
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
    return categoryIcons[category] || 'information-circle';
  };

  const handlePhoneCall = (phone) => {
    const phoneNumber = phone.replace(/[^\d]/g, '');
    Linking.openURL(`tel:${phoneNumber}`)
      .catch(() => {
        Alert.alert('Error', 'Unable to make phone call');
      });
  };

  const handleWebsite = (website) => {
    Linking.openURL(website)
      .catch(() => {
        Alert.alert('Error', 'Unable to open website');
      });
  };

  const formatAddress = (address) => {
    // Show first part of address for privacy
    const parts = address.split(',');
    return parts.length > 1 ? `${parts[0]}, ${parts[1]}` : address;
  };

  const categoryColor = getCategoryColor(resource.category);
  const categoryIcon = getCategoryIcon(resource.category);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={onPress}
      android_ripple={{ color: Colors.primaryLight }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${resource.name}, ${resource.category} resource, ${resource.verified ? 'verified' : 'unverified'}`}
      accessibilityHint="Tap to view resource details"
    >
      {/* Category Indicator */}
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]}>
        <Ionicons name={categoryIcon} size={16} color={Colors.background} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Header Row */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {resource.name}
            </Text>
            {resource.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.verified} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          
          {showDistance && distance !== null && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.distanceText}>
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {resource.description}
        </Text>

        {/* Details Row */}
        <View style={styles.details}>
          {/* Address */}
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {formatAddress(resource.address)}
            </Text>
          </View>

          {/* Hours */}
          {resource.hours && (
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>
                {resource.hours}
              </Text>
            </View>
          )}

          {/* Languages */}
          {resource.languages && resource.languages.length > 0 && (
            <View style={styles.detailItem}>
              <Ionicons name="language-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>
                {resource.languages.slice(0, 3).join(', ')}
                {resource.languages.length > 3 && ` +${resource.languages.length - 3}`}
              </Text>
            </View>
          )}
        </View>

        {/* Actions Row */}
        <View style={styles.actions}>
          {resource.phone && (
            <Pressable
              style={styles.actionButton}
              onPress={() => handlePhoneCall(resource.phone)}
              android_ripple={{ color: Colors.primaryLight }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Call ${resource.name}`}
            >
              <Ionicons name="call-outline" size={16} color={categoryColor} />
              <Text style={[styles.actionText, { color: categoryColor }]}>Call</Text>
            </Pressable>
          )}

          {resource.website && (
            <Pressable
              style={styles.actionButton}
              onPress={() => handleWebsite(resource.website)}
              android_ripple={{ color: Colors.primaryLight }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Visit ${resource.name} website`}
            >
              <Ionicons name="globe-outline" size={16} color={categoryColor} />
              <Text style={[styles.actionText, { color: categoryColor }]}>Website</Text>
            </Pressable>
          )}

          <View style={styles.spacer} />

          {/* View Details Arrow */}
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    ...Shadows.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.base,
    overflow: 'hidden',
  },
  categoryIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.base,
    paddingTop: Spacing.base + 4, // Account for category indicator
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    ...CommonStyles.bodyLarge,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.verified,
  },
  verifiedText: {
    ...CommonStyles.caption,
    color: Colors.verified,
    marginLeft: 2,
    fontWeight: Typography.fontWeight.medium,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  distanceText: {
    ...CommonStyles.caption,
    color: Colors.textSecondary,
    marginLeft: 2,
    fontWeight: Typography.fontWeight.medium,
  },
  description: {
    ...CommonStyles.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  details: {
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...CommonStyles.bodySmall,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    minHeight: 32, // Accessibility touch target
  },
  actionText: {
    ...CommonStyles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Spacing.xs,
  },
  spacer: {
    flex: 1,
  },
});

export default ResourceCard; 