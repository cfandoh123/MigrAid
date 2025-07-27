// Home Screen for MigrAid
// Privacy-first design with quick access to resources and safety features

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientView, { GradientPresets } from '../../components/common/GradientView';

// Import components and services
import SafeButton from '../../components/common/SafeButton';
import CustomInput from '../../components/common/CustomInput';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CommonStyles } from '../../constants/theme';
import { strings, getString } from '../../constants/strings';
import { storageService } from '../../services/storage';
import { mockResources, RESOURCE_CATEGORIES, getCategoryStats, getResourcesByCategory } from '../../data/mockResources';
import { getActiveReports, getRecentReports, getCriticalReports } from '../../data/mockIceReports';

const HomeScreen = ({ navigation }) => {
  const [language, setLanguage] = useState('en');
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [activeReports, setActiveReports] = useState(0);
  const [criticalReports, setCriticalReports] = useState(0);
  const [recentReports, setRecentReports] = useState(0);
  const [categoryStats, setCategoryStats] = useState({});
  const [recentResources, setRecentResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUserPreferences();
    loadDashboardData();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const userLanguage = await storageService.getLanguage();
      const isAnonymous = await storageService.getAnonymousMode();
      
      setLanguage(userLanguage);
      setAnonymousMode(isAnonymous);
    } catch (error) {
      console.warn('Error loading user preferences:', error);
    }
  };

  const loadDashboardData = () => {
    try {
      // Load ICE reports data
      const activeReportsData = getActiveReports() || [];
      const criticalReportsData = getCriticalReports() || [];
      const recentReportsData = getRecentReports(24) || [];
      
      setActiveReports(activeReportsData.length);
      setCriticalReports(criticalReportsData.length);
      setRecentReports(recentReportsData.length);
      
      // Load resource category statistics
      const stats = getCategoryStats();
      console.log('Category Stats:', stats); // Debug log
      setCategoryStats(stats || {});
      
      // Load recent/featured resources (top 3 from each category)
      const legal = getResourcesByCategory(RESOURCE_CATEGORIES.LEGAL).filter(r => r && r.name).slice(0, 2);
      const healthcare = getResourcesByCategory(RESOURCE_CATEGORIES.HEALTHCARE).filter(r => r && r.name).slice(0, 2);
      setRecentResources([...legal, ...healthcare]);
    } catch (error) {
      console.warn('Error loading dashboard data:', error);
      // Set safe defaults
      setActiveReports(0);
      setCriticalReports(0);
      setRecentReports(0);
      setCategoryStats({
        [RESOURCE_CATEGORIES.LEGAL]: 12,
        [RESOURCE_CATEGORIES.HEALTHCARE]: 15,
        [RESOURCE_CATEGORIES.FOOD]: 8,
        [RESOURCE_CATEGORIES.SHELTER]: 10,
      });
      setRecentResources([]);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Resources', {
        screen: 'ResourcesList',
        params: { searchQuery: searchQuery.trim() }
      });
      storageService.updateUsageAnalytics('resource_search');
    }
  };

  const navigateToResources = (category = null) => {
    navigation.navigate('Resources', {
      screen: 'ResourcesList',
      params: { category }
    });
  };

  const navigateToReports = () => {
    navigation.navigate('Reports', {
      screen: 'ReportsList'
    });
  };

  const makeEmergencyCall = (number) => {
    // Handle Crisis Text Line specially
    if (number.includes('741741') || number.includes('Text HOME')) {
      Alert.alert(
        'Crisis Text Line',
        'Send a text message "HOME" to 741741 for mental health crisis support?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Send Text',
            onPress: () => Linking.openURL('sms:741741&body=HOME'),
            style: 'default',
          },
        ]
      );
      return;
    }

    // Handle regular phone calls
    Alert.alert(
      getString('emergencyCall', language) || 'Emergency Call',
      `${getString('calling', language) || 'Calling'} ${number}`,
      [
        {
          text: getString('cancel', language) || 'Cancel',
          style: 'cancel',
        },
        {
          text: getString('call', language) || 'Call',
          onPress: () => Linking.openURL(`tel:${number}`),
          style: 'default',
        },
      ]
    );
  };

  const showPrivacyInfo = () => {
    Alert.alert(
      getString('yourPrivacy', language),
      getString('dataProtection', language),
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  };

  const resourceCategories = [
    {
      key: RESOURCE_CATEGORIES.LEGAL,
      title: getString('legal', language),
      icon: 'scale-outline',
      color: Colors.primary,
      count: categoryStats[RESOURCE_CATEGORIES.LEGAL] || 0,
    },
    {
      key: RESOURCE_CATEGORIES.HEALTHCARE,
      title: getString('healthcare', language),
      icon: 'medical-outline',
      color: Colors.secondary,
      count: categoryStats[RESOURCE_CATEGORIES.HEALTHCARE] || 0,
    },
    {
      key: RESOURCE_CATEGORIES.FOOD,
      title: getString('food', language),
      icon: 'restaurant-outline',
      color: Colors.warning,
      count: categoryStats[RESOURCE_CATEGORIES.FOOD] || 0,
    },
    {
      key: RESOURCE_CATEGORIES.SHELTER,
      title: getString('shelter', language),
      icon: 'home-outline',
      color: Colors.info,
      count: categoryStats[RESOURCE_CATEGORIES.SHELTER] || 0,
    },
  ];

  const emergencyContacts = [
    {
      name: 'Legal Aid Hotline',
      number: '1-800-520-2356',
      icon: 'call-outline',
      description: '24/7 Immigration Legal Support'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      icon: 'chatbubble-outline',
      description: 'Mental Health Crisis Support'
    },
    {
      name: '911 Emergency',
      number: '911',
      icon: 'warning-outline',
      description: 'Life-threatening emergencies only'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy Banner */}
        {anonymousMode && (
          <View style={styles.privacyBanner}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.secure} />
            <Text style={styles.privacyText}>
              {getString('anonymousMode', language)}
            </Text>
            <SafeButton
              title="?"
              onPress={showPrivacyInfo}
              variant="outline"
              size="sm"
              style={styles.privacyButton}
            />
          </View>
        )}

        {/* Welcome Section */}
        <GradientView 
          {...GradientPresets.primary}
          style={styles.welcomeSection}
        >
          <View style={styles.logoHeader}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>
                Welcome to MigrAid
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Your safety and privacy come first. Find resources, stay informed, and connect with your community.
              </Text>
            </View>
          </View>
        </GradientView>

        {/* Quick Search Bar */}
        <View style={styles.searchSection}>
          <CustomInput
            placeholder={getString('search', language) + ' ' + getString('resources', language)}
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
            rightIcon={searchQuery.trim() ? "arrow-forward-outline" : null}
            onRightIconPress={searchQuery.trim() ? handleSearch : null}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            style={styles.searchInput}
          />
        </View>

        {/* ICE Activity Alerts */}
        {(criticalReports > 0 || recentReports > 0) && (
          <TouchableOpacity 
            style={styles.alertBanner}
            onPress={navigateToReports}
            activeOpacity={0.7}
          >
            <View style={styles.alertHeader}>
              <Ionicons 
                name="warning" 
                size={24} 
                color={criticalReports > 0 ? Colors.danger : Colors.warning} 
              />
              <Text style={[
                styles.alertTitle,
                { color: criticalReports > 0 ? Colors.danger : Colors.warning }
              ]}>
                {criticalReports > 0 
                  ? `${criticalReports} Critical ICE Alert${criticalReports > 1 ? 's' : ''}`
                  : `${recentReports} Recent Report${recentReports > 1 ? 's' : ''}`
                }
              </Text>
            </View>
            <Text style={styles.alertSubtitle}>
              {criticalReports > 0 
                ? 'Active ICE activity in your area'
                : 'Recent ICE activity reported'
              }
            </Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Quick Stats */}
        <View style={styles.quickStatsCard}>
          <Text style={styles.quickStatsTitle}> Community Overview</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.quickStatNumber}>50</Text>
              <Text style={styles.quickStatLabel}>Resources</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.quickStatNumber, { color: activeReports > 0 ? '#FF6B35' : '#00D68F' }]}>
                {activeReports}
              </Text>
              <Text style={styles.quickStatLabel}>Active Reports</Text>
            </View>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🚨 Emergency Contacts
          </Text>
          <View style={styles.emergencyGrid}>
            {emergencyContacts.filter(contact => contact && contact.name && contact.number).map((contact, index) => (
              <GradientView
                key={index}
                {...GradientPresets.danger}
                style={styles.emergencyCard}
              >
                <TouchableOpacity
                  style={styles.emergencyContent}
                  onPress={() => makeEmergencyCall(contact.number)}
                  activeOpacity={0.8}
                >
                  <View style={styles.emergencyHeader}>
                    <View style={styles.emergencyIconContainer}>
                      <Ionicons name={contact.icon || 'call'} size={24} color={Colors.textOnPrimary} />
                    </View>
                    <Text style={styles.emergencyName}>{contact.name}</Text>
                  </View>
                  <Text style={styles.emergencyNumber}>{contact.number}</Text>
                  <Text style={styles.emergencyDescription}>{contact.description || ''}</Text>
                </TouchableOpacity>
              </GradientView>
            ))}
          </View>
        </View>

        {/* Resource Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getString('findResources', language)}
          </Text>
          
          <View style={styles.categoriesGrid}>
            {resourceCategories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[styles.categoryCard, { borderColor: category.color }]}
                onPress={() => navigateToResources(category.key)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryHeader}>
                  <Ionicons 
                    name={category.icon} 
                    size={28} 
                    color={category.color} 
                  />
                  <View style={[styles.countBadge, { backgroundColor: category.color }]}>
                    <Text style={styles.countText}>{category.count}</Text>
                  </View>
                </View>
                <Text style={[styles.categoryTitle, { color: category.color }]}>
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Resources */}
        {recentResources.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                Quick Access
              </Text>
              <TouchableOpacity onPress={() => navigateToResources()}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.recentResourcesContainer}>
              {recentResources.filter(resource => resource && resource.id && resource.name).map((resource) => (
                <TouchableOpacity
                  key={resource.id}
                  style={styles.resourceCard}
                  onPress={() => navigation.navigate('Resources', {
                    screen: 'ResourceDetail',
                    params: { resource: resource }
                  })}
                  activeOpacity={0.7}
                >
                  <View style={styles.resourceHeader}>
                    <Text style={styles.resourceName} numberOfLines={1}>
                      {resource.name}
                    </Text>
                    {resource.verified && (
                      <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                    )}
                  </View>
                  <Text style={styles.resourceCategory}>
                    {getString(resource.category, language)}
                  </Text>
                  <Text style={styles.resourceDescription} numberOfLines={2}>
                    {resource.description || 'No description available'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <SafeButton
            title={getString('viewReports', language)}
            onPress={navigateToReports}
            variant="secondary"
            fullWidth
            icon={<Ionicons name="alert-circle-outline" size={20} color={Colors.background} />}
            style={styles.actionButton}
          />
          
          <SafeButton
            title={"🗺️ " + getString('map', language)}
            onPress={() => navigation.navigate('Resources', {
              screen: 'ResourcesMap'
            })}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
        </View>

        {/* Safety Reminder */}
        <View style={styles.safetyReminder}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.safetyText}>
            {getString('noLocationTracking', language)} • {getString('encryptedReports', language)}
          </Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  privacyText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  privacyButton: {
    minWidth: 32,
    minHeight: 32,
  },
  welcomeSection: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.primaryShadow,
    overflow: 'hidden',
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  homeLogoImage: {
    width: 60,
    height: 60,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 24,
    opacity: 0.95,
  },
  searchSection: {
    marginBottom: Spacing.lg,
  },
  searchInput: {
    marginBottom: 0,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerBackground,
    borderColor: Colors.danger,
    borderWidth: 1,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    minHeight: 60,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  alertSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.lg + 24, // Icon width + margin
    flex: 1,
  },
  quickStatsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#0F7FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E8F4FD',
  },
  quickStatsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  quickStatNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F7FFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    lineHeight: 16,
    textAlign: 'center',
  },

  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...CommonStyles.heading4,
    marginBottom: Spacing.lg,
    color: Colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: '48%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    ...Shadows.lg,
    overflow: 'hidden',
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 28,
    marginVertical: 8,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  viewAllText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  emergencyGrid: {
    gap: Spacing.sm,
  },
  emergencyCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
    marginBottom: Spacing.base,
  },
  emergencyContent: {
    padding: Spacing.lg,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  emergencyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.base,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
    flex: 1,
  },
  emergencyNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 8,
    opacity: 0.9,
  },
  emergencyDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 16,
    opacity: 0.8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    minHeight: 100,
    ...Shadows.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  countText: {
    color: Colors.background,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  categoryTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    textAlign: 'center',
  },
  recentResourcesContainer: {
    gap: Spacing.sm,
  },
  resourceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  resourceName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    flex: 1,
  },
  resourceCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  resourceDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
  safetyReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.base,
  },
  safetyText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen; 