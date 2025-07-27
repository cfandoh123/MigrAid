// Anonymous Mode Screen for MigrAid Onboarding
// Second step in the onboarding process

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AnonymousModeScreen = ({ navigation }) => {
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const handleContinue = async () => {
    try {
      await storageService.setAnonymousMode(anonymousMode);
      navigation.navigate('Permissions');
    } catch (error) {
      console.warn('Error saving anonymous mode:', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F7FFF" />
      <GradientView {...GradientPresets.primary} style={styles.backgroundGradient}>
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
                  <View style={[styles.progressDot, styles.progressActive]} />
                  <View style={styles.progressLine} />
                  <View style={styles.progressDot} />
                </View>
                <Text style={styles.progressText}>2 of 3</Text>
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
                <Text style={styles.title}> Privacy Protection</Text>
                <Text style={styles.subtitle}>
                  Your safety is our priority. Choose the protection level that's right for you.
                </Text>
              </View>
            </View>

            {/* Privacy Cards Section */}
            <View style={styles.cardsSection}>
              {/* Anonymous Mode Card */}
              <View style={[styles.privacyCard, anonymousMode && styles.selectedCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconContainer}>
                    <Ionicons name="shield-checkmark" size={32} color="#00D68F" />
                  </View>
                  <View style={styles.cardBadge}>
                    <Text style={styles.badgeText}>RECOMMENDED</Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>Anonymous Mode</Text>
                <Text style={styles.cardDescription}>
                  Maximum privacy and safety. Your identity remains completely protected.
                </Text>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#00D68F" />
                    <Text style={styles.featureText}>No data collection</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#00D68F" />
                    <Text style={styles.featureText}>Location anonymized</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#00D68F" />
                    <Text style={styles.featureText}>Complete privacy</Text>
                  </View>
                </View>
                <SafeButton
                  title="Choose Anonymous Mode"
                  onPress={() => setAnonymousMode(true)}
                  variant={anonymousMode ? "primary" : "outline"}
                  fullWidth
                  style={styles.cardButton}
                />
              </View>

              {/* Standard Mode Card */}
              <View style={[styles.privacyCard, !anonymousMode && styles.selectedCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconContainer}>
                    <Ionicons name="person-circle" size={32} color="#FF6B35" />
                  </View>
                </View>
                <Text style={styles.cardTitle}>Standard Mode</Text>
                <Text style={styles.cardDescription}>
                  Basic protection with optional account features for enhanced experience.
                </Text>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#FF6B35" />
                    <Text style={styles.featureText}>Save preferences</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#FF6B35" />
                    <Text style={styles.featureText}>Personalized experience</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="warning" size={16} color="#FFB800" />
                    <Text style={styles.featureText}>Less privacy protection</Text>
                  </View>
                </View>
                <SafeButton
                  title="Choose Standard Mode"
                  onPress={() => setAnonymousMode(false)}
                  variant={!anonymousMode ? "primary" : "outline"}
                  fullWidth
                  style={styles.cardButton}
                />
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
                title="Continue →"
                onPress={handleContinue}
                variant="primary"
                style={styles.continueButton}
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
    backgroundColor: '#00D68F',
  },
  progressActive: {
    backgroundColor: '#FFFFFF',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
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
  cardsSection: {
    flex: 1,
    gap: 20,
  },
  privacyCard: {
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
  selectedCard: {
    borderColor: '#00D68F',
    shadowColor: '#00D68F',
    shadowOpacity: 0.3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 214, 143, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    backgroundColor: '#00D68F',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  cardButton: {
    marginTop: 8,
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
  continueButton: {
    flex: 2,
  },
});

export default AnonymousModeScreen; 