// Permissions Screen for MigrAid Onboarding
// Third and final step in the onboarding process

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientView, { GradientPresets } from '../../components/common/GradientView';

import SafeButton from '../../components/common/SafeButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CommonStyles } from '../../constants/theme';
import { getString } from '../../constants/strings';
import { storageService } from '../../services/storage';
import { locationService } from '../../services/location';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PermissionsScreen = ({ navigation, onCompleteOnboarding }) => {
  const [language, setLanguage] = useState('en');
  const [locationPermission, setLocationPermission] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  useEffect(() => {
    loadLanguage();
    checkExistingPermissions();
  }, []);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const checkExistingPermissions = async () => {
    try {
      const permissions = await storageService.getLocationPermissions();
      setLocationPermission(permissions.granted);
    } catch (error) {
      console.warn('Error checking permissions:', error);
    }
  };

  const handleLocationPermission = async () => {
    setIsRequestingLocation(true);
    try {
      const result = await locationService.requestPermissions();
      setLocationPermission(result.granted);
      
      if (result.granted) {
        await storageService.setLocationPermissions(result);
      }
    } catch (error) {
      console.warn('Error requesting location permission:', error);
      Alert.alert(
        'Permission Error',
        'Unable to request location permission. You can enable it later in Settings.'
      );
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleComplete = async () => {
    try {
      await storageService.updateUsageAnalytics('onboarding_completed');
      if (onCompleteOnboarding) {
        onCompleteOnboarding();
      }
    } catch (error) {
      console.warn('Error completing onboarding:', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00D68F" />
      <GradientView {...GradientPresets.secondary} style={styles.backgroundGradient}>
        <SafeAreaView style={styles.safeContainer}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressDot, styles.progressComplete]} />
                  <View style={styles.progressLine} />
                  <View style={[styles.progressDot, styles.progressComplete]} />
                  <View style={styles.progressLine} />
                  <View style={[styles.progressDot, styles.progressActive]} />
                </View>
                <Text style={styles.progressText}>3 of 3</Text>
              </View>

              <View style={styles.logoContainer}>
                <View style={styles.logoGlow}>
                  <Image 
                    source={require('../../../assets/migraid-logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.title}> Almost Ready!</Text>
                <Text style={styles.subtitle}>
                  Enable optional features to enhance your MigrAid experience while keeping you safe.
                </Text>
              </View>
            </View>

            {/* Permissions Section */}
            <View style={styles.permissionsSection}>
              {/* Location Permission Card */}
              <View style={[styles.permissionCard, locationPermission && styles.enabledCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.permissionIconContainer}>
                    <Ionicons 
                      name={locationPermission ? "location" : "location-outline"} 
                      size={32} 
                      color={locationPermission ? "#00D68F" : "#0F7FFF"} 
                    />
                  </View>
                  {locationPermission && (
                    <View style={styles.enabledBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                      <Text style={styles.enabledText}>ENABLED</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.permissionTitle}>Location Access</Text>
                <Text style={styles.permissionDescription}>
                  Find nearby resources and services to help you when you need them most.
                </Text>
                
                <View style={styles.privacyNote}>
                  <Ionicons name="shield-checkmark" size={16} color="#00D68F" />
                  <Text style={styles.privacyText}>
                    Your location is anonymized and never shared with third parties
                  </Text>
                </View>

                <SafeButton
                  title={locationPermission ? "✓ Location Enabled" : "Enable Location"}
                  onPress={handleLocationPermission}
                  variant={locationPermission ? "secondary" : "primary"}
                  loading={isRequestingLocation}
                  disabled={locationPermission}
                  fullWidth
                  style={styles.permissionButton}
                />
              </View>

              {/* Privacy Summary Card */}
              <View style={styles.privacySummaryCard}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="shield-checkmark" size={28} color="#00D68F" />
                  <Text style={styles.summaryTitle}>Your Privacy is Protected</Text>
                </View>
                
                <View style={styles.privacyFeatures}>
                  <View style={styles.privacyFeature}>
                    <Ionicons name="checkmark-circle" size={18} color="#00D68F" />
                    <Text style={styles.privacyFeatureText}>Anonymous by default</Text>
                  </View>
                  <View style={styles.privacyFeature}>
                    <Ionicons name="checkmark-circle" size={18} color="#00D68F" />
                    <Text style={styles.privacyFeatureText}>No data collection</Text>
                  </View>
                  <View style={styles.privacyFeature}>
                    <Ionicons name="checkmark-circle" size={18} color="#00D68F" />
                    <Text style={styles.privacyFeatureText}>Local storage only</Text>
                  </View>
                  <View style={styles.privacyFeature}>
                    <Ionicons name="checkmark-circle" size={18} color="#00D68F" />
                    <Text style={styles.privacyFeatureText}>Complete encryption</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Navigation */}
            <View style={styles.navigationSection}>
              <SafeButton
                title="← Back"
                onPress={handleBack}
                variant="outline"
                style={styles.backButton}
              />
              
              <SafeButton
                title=" Start Using MigrAid"
                onPress={handleComplete}
                variant="primary"
                style={styles.completeButton}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </GradientView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressComplete: {
    backgroundColor: '#FFFFFF',
  },
  progressActive: {
    backgroundColor: '#FFB800',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  permissionsSection: {
    flex: 1,
    gap: 20,
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  enabledCard: {
    borderColor: '#00D68F',
    shadowColor: '#00D68F',
    shadowOpacity: 0.2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  permissionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(15, 127, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enabledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D68F',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  enabledText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 8,
  },
  permissionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
    lineHeight: 24,
    marginBottom: 16,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 214, 143, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  privacyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00D68F',
    flex: 1,
    lineHeight: 18,
  },
  permissionButton: {
    marginTop: 8,
  },
  privacySummaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 214, 143, 0.2)',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A202C',
  },
  privacyFeatures: {
    gap: 12,
  },
  privacyFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyFeatureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  navigationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 16,
  },
  backButton: {
    flex: 1,
    borderColor: '#FFFFFF',
  },
  completeButton: {
    flex: 2,
  },
});

export default PermissionsScreen; 