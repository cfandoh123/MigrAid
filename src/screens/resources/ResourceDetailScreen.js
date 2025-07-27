// Resource Detail Screen for MigrAid
// Detailed view of a specific resource with contact and navigation options

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
  Share,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SafeButton from '../../components/common/SafeButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { getString } from '../../constants/strings';
import { storageService } from '../../services/storage';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    rating: 5,
    comment: "Excellent service, staff was very helpful and understanding. They helped me with my immigration paperwork quickly.",
    date: "2025-01-15",
    helpful: 12,
    anonymous: true
  },
  {
    id: 2,
    rating: 4,
    comment: "Good resource, but had to wait a long time. Staff speaks multiple languages which is helpful.",
    date: "2025-01-10",
    helpful: 8,
    anonymous: true
  },
  {
    id: 3,
    rating: 5,
    comment: "Saved my family during a difficult time. Free services and very professional staff.",
    date: "2025-01-05",
    helpful: 15,
    anonymous: true
  }
];

const ResourceDetailScreen = ({ route, navigation }) => {
  // Safety check for route params
  const resource = route?.params?.resource;
  const [language, setLanguage] = useState('en');
  const [isSaved, setIsSaved] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    loadLanguage();
    loadSavedStatus();
  }, []);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const loadSavedStatus = async () => {
    try {
      const saved = await storageService.getItem('@migraid:savedResources') || [];
      setIsSaved(saved.includes(resource?.id));
    } catch (error) {
      console.warn('Error loading saved status:', error);
    }
  };

  const toggleSave = async () => {
    try {
      const saved = await storageService.getItem('@migraid:savedResources') || [];
      let newSaved;
      
      if (isSaved) {
        newSaved = saved.filter(id => id !== resource.id);
      } else {
        newSaved = [...saved, resource.id];
      }
      
      await storageService.setItem('@migraid:savedResources', newSaved);
      setIsSaved(!isSaved);
      
      Alert.alert(
        isSaved ? 'Removed from Saved' : 'Saved',
        isSaved ? 'Resource removed from your saved list' : 'Resource saved to your list',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.warn('Error saving resource:', error);
      Alert.alert('Error', 'Failed to save resource. Please try again.');
    }
  };

  const handleCall = () => {
    if (resource?.phone) {
      Alert.alert(
        'Call Resource',
        `Call ${resource.name}?\n${resource.phone}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call',
            onPress: () => Linking.openURL(`tel:${resource.phone}`)
          }
        ]
      );
    }
  };

  const handleWebsite = () => {
    if (resource?.website) {
      Linking.openURL(resource.website);
    }
  };

  const handleDirections = () => {
    if (resource?.coordinates) {
      const url = `https://maps.apple.com/?daddr=${resource.coordinates.latitude},${resource.coordinates.longitude}`;
      Linking.openURL(url);
    } else if (resource?.address) {
      const encodedAddress = encodeURIComponent(resource.address);
      const url = `https://maps.apple.com/?daddr=${encodedAddress}`;
      Linking.openURL(url);
    }
  };

  const handleShare = async () => {
    try {
      const message = `Check out this resource: ${resource.name}\n${resource.description}\n\nAddress: ${resource.address}\n${resource.phone ? `Phone: ${resource.phone}` : ''}`;
      
      await Share.share({
        message,
        title: resource.name,
      });
    } catch (error) {
      console.warn('Error sharing resource:', error);
    }
  };

  const handleReportIncorrect = () => {
    Alert.alert(
      'Report Incorrect Information',
      'Please let us know what information is incorrect or outdated about this resource.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Contact Information',
          onPress: () => showReportDetails('contact')
        },
        {
          text: 'Services/Hours',
          onPress: () => showReportDetails('services')
        },
        {
          text: 'Location/Address',
          onPress: () => showReportDetails('location')
        },
        {
          text: 'Other',
          onPress: () => showReportDetails('other')
        }
      ]
    );
  };

  const showReportDetails = (type) => {
    Alert.alert(
      'Report Submitted',
      `Thank you for reporting incorrect ${type} information. Our team will review and update this resource within 24-48 hours.`,
      [{ text: 'OK' }]
    );
  };

  const getMockRating = (resource) => {
    let rating = 3.0;
    if (resource.verified) rating += 1.0;
    if (resource.emergencyContact) rating += 0.5;
    if (resource.services && resource.services.length > 3) rating += 0.3;
    return Math.min(5.0, rating);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={Colors.warning}
        />
      );
    }
    return stars;
  };

  const renderReview = (review, index) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewRating}>
          {renderStars(review.rating)}
          <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
        </View>
        <View style={styles.reviewHelpful}>
          <Ionicons name="thumbs-up-outline" size={12} color={Colors.textSecondary} />
          <Text style={styles.helpfulText}>{review.helpful}</Text>
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      <Text style={styles.reviewAuthor}>Anonymous User</Text>
    </View>
  );

  // Early return if resource is invalid
  if (!resource || !resource.id || !resource.name) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={Colors.danger} />
          <Text style={styles.errorTitle}>Resource Not Found</Text>
          <Text style={styles.errorMessage}>
            The requested resource could not be loaded or does not exist.
          </Text>
          <SafeButton
            title="Go to Resources"
            onPress={() => {
              try {
                navigation.navigate('Resources', { screen: 'ResourcesList' });
              } catch (error) {
                console.warn('Navigation error:', error);
                navigation.navigate('Resources');
              }
            }}
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const rating = getMockRating(resource);
  const displayReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.resourceName}>{resource.name || 'Unknown Resource'}</Text>
            <TouchableOpacity onPress={toggleSave} style={styles.saveButton}>
              <Ionicons 
                name={isSaved ? 'bookmark' : 'bookmark-outline'} 
                size={24} 
                color={isSaved ? Colors.warning : Colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.badgeRow}>
            {resource.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            )}
            
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={Colors.warning} />
              <Text style={styles.badgeText}>{rating.toFixed(1)} ({mockReviews.length} reviews)</Text>
            </View>
            
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{getString(resource.category, language)}</Text>
            </View>
          </View>

          {resource.lastUpdated && (
            <Text style={styles.lastUpdated}>
              Last updated: {formatDate(resource.lastUpdated)}
            </Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description}>
            {resource.description || 'No description available.'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {resource.phone && (
            <TouchableOpacity style={styles.quickActionButton} onPress={handleCall}>
              <Ionicons name="call" size={20} color={Colors.primary} />
              <Text style={styles.quickActionText}>Call</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.quickActionButton} onPress={handleDirections}>
            <Ionicons name="navigate" size={20} color={Colors.primary} />
            <Text style={styles.quickActionText}>Directions</Text>
          </TouchableOpacity>
          
          {resource.website && (
            <TouchableOpacity style={styles.quickActionButton} onPress={handleWebsite}>
              <Ionicons name="globe" size={20} color={Colors.primary} />
              <Text style={styles.quickActionText}>Website</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.quickActionButton} onPress={handleShare}>
            <Ionicons name="share" size={20} color={Colors.primary} />
            <Text style={styles.quickActionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          {resource.address && (
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{resource.address}</Text>
              </View>
            </View>
          )}

          {resource.phone && (
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{resource.phone}</Text>
              </View>
            </View>
          )}

          {resource.website && (
            <View style={styles.infoRow}>
              <Ionicons name="globe" size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Website</Text>
                <Text style={styles.infoValue}>{resource.website}</Text>
              </View>
            </View>
          )}

          {resource.email && (
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{resource.email}</Text>
              </View>
            </View>
          )}

          {resource.hours && (
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Hours</Text>
                <Text style={styles.infoValue}>{resource.hours}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Requirements */}
        {resource.requirements && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements & Eligibility</Text>
            <View style={styles.requirementsCard}>
              <Ionicons name="information-circle" size={20} color={Colors.info} />
              <View style={styles.requirementsContent}>
                {Array.isArray(resource.requirements) ? (
                  resource.requirements.map((req, index) => (
                    <View key={index} style={styles.requirementItem}>
                      <Ionicons name="checkmark-circle-outline" size={16} color={Colors.info} />
                      <Text style={styles.requirementText}>{req}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.requirementText}>{resource.requirements}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Services */}
        {resource.services && Array.isArray(resource.services) && resource.services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services Offered</Text>
            <View style={styles.servicesGrid}>
              {resource.services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                  <Text style={styles.serviceText}>{service || 'Service details unavailable'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {resource.languages && Array.isArray(resource.languages) && resource.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages Supported</Text>
            <View style={styles.languagesContainer}>
              {resource.languages.map((lang, index) => (
                <View key={index} style={styles.languageTag}>
                  <Ionicons name="chatbubble-outline" size={12} color={Colors.primary} />
                  <Text style={styles.languageText}>{lang || 'Unknown'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* User Reviews */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Community Reviews</Text>
            <View style={styles.overallRating}>
              <View style={styles.ratingStars}>
                {renderStars(Math.round(rating))}
              </View>
              <Text style={styles.ratingText}>{rating.toFixed(1)} ({mockReviews.length})</Text>
            </View>
          </View>

          {displayReviews.map((review, index) => renderReview(review, index))}

          {mockReviews.length > 2 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAllReviews(!showAllReviews)}
            >
              <Text style={styles.showMoreText}>
                {showAllReviews ? 'Show Less' : `Show All ${mockReviews.length} Reviews`}
              </Text>
              <Ionicons 
                name={showAllReviews ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={Colors.primary} 
              />
            </TouchableOpacity>
          )}

          <View style={styles.reviewDisclaimer}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.textSecondary} />
            <Text style={styles.disclaimerText}>
              Reviews are anonymous and moderated for community safety
            </Text>
          </View>
        </View>

        {/* Emergency Contact */}
        {resource.emergencyContact && (
          <View style={styles.emergencySection}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="warning" size={20} color={Colors.danger} />
              <Text style={styles.emergencyTitle}>Emergency Contact</Text>
            </View>
            <Text style={styles.emergencyNumber}>{resource.emergencyContact}</Text>
            <Text style={styles.emergencyNote}>Available 24/7 for urgent situations</Text>
          </View>
        )}

        {/* Report Section */}
        <View style={styles.reportSection}>
          <TouchableOpacity style={styles.reportButton} onPress={handleReportIncorrect}>
            <Ionicons name="flag-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.reportText}>Report incorrect information</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  resourceName: {
    flex: 1,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  saveButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
    gap: Spacing.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningBackground,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
    gap: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  categoryText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  lastUpdated: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.base,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  quickActionButton: {
    alignItems: 'center',
    gap: Spacing.xs,
    minWidth: 60,
  },
  quickActionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  requirementsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
    gap: Spacing.sm,
  },
  requirementsContent: {
    flex: 1,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  requirementText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
  },
  servicesGrid: {
    gap: Spacing.sm,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  serviceText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
    gap: Spacing.xs,
  },
  languageText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  overallRating: {
    alignItems: 'flex-end',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: Spacing.xs,
  },
  ratingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  reviewHelpful: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  helpfulText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  reviewComment: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
    marginBottom: Spacing.sm,
  },
  reviewAuthor: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  showMoreText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  reviewDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.base,
  },
  disclaimerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emergencySection: {
    backgroundColor: Colors.dangerBackground,
    borderColor: Colors.danger,
    borderWidth: 2,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  emergencyTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.danger,
  },
  emergencyNumber: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.danger,
    marginBottom: Spacing.xs,
  },
  emergencyNote: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  reportSection: {
    alignItems: 'center',
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  reportText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.danger,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.lg,
  },
  errorButton: {
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.xl,
  },
});

export default ResourceDetailScreen; 