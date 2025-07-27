// Onboarding Screen for MigrAid
// Language selection and privacy-first setup

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SafeButton from '../../components/common/SafeButton';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { SUPPORTED_LANGUAGES, strings, getString } from '../../constants/strings';
import { storageService } from '../../services/storage';

const OnboardingScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [anonymousMode, setAnonymousMode] = useState(true);

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
  };

  const handleGetStarted = async () => {
    try {
      // Save user preferences
      await storageService.setLanguage(selectedLanguage);
      await storageService.setAnonymousMode(anonymousMode);
      await storageService.setOnboardingComplete(true);
      
      // Navigation will be handled by App.js re-render
    } catch (error) {
      console.warn('Error saving onboarding preferences:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/migraid-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>MigrAid</Text>
          <Text style={styles.tagline}>Safety • Privacy • Community</Text>
          <Text style={styles.subtitle}>
            Privacy-first resource navigation for immigrant communities
          </Text>
        </View>

        {/* Welcome Message */}
        <View style={styles.section}>
          <Text style={styles.welcomeTitle}>
            {getString('welcome', selectedLanguage)}
          </Text>
          <Text style={styles.welcomeMessage}>
            {getString('welcomeMessage', selectedLanguage)}
          </Text>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getString('selectLanguage', selectedLanguage)}
          </Text>
          
          <View style={styles.languageList}>
            {SUPPORTED_LANGUAGES.map((language) => (
              <SafeButton
                key={language.code}
                title={`${language.nativeName} (${language.name})`}
                onPress={() => handleLanguageSelect(language.code)}
                variant={selectedLanguage === language.code ? 'primary' : 'outline'}
                fullWidth
                style={styles.languageButton}
              />
            ))}
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <View style={styles.privacyHeader}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.secure} />
            <Text style={styles.sectionTitle}>
              {getString('anonymousMode', selectedLanguage)}
            </Text>
          </View>
          
          <Text style={styles.privacyDescription}>
            {getString('anonymousModeDesc', selectedLanguage)}
          </Text>
          
          <SafeButton
            title={anonymousMode ? '✓ Anonymous Mode ON' : 'Anonymous Mode OFF'}
            onPress={() => setAnonymousMode(!anonymousMode)}
            variant={anonymousMode ? 'secondary' : 'outline'}
            fullWidth
            style={styles.privacyButton}
          />
        </View>

        {/* Get Started Button */}
        <SafeButton
          title={getString('getStarted', selectedLanguage)}
          onPress={handleGetStarted}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.getStartedButton}
        />

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyNoticeText}>
            {getString('dataProtection', selectedLanguage)}
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
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: Spacing.base,
  },
  appName: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.lg,
    paddingHorizontal: Spacing.base,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.base,
  },
  languageList: {
    gap: Spacing.sm,
  },
  languageButton: {
    marginBottom: Spacing.sm,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  privacyDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.base,
  },
  privacyButton: {
    marginBottom: Spacing.base,
  },
  getStartedButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  privacyNotice: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    alignItems: 'center',
  },
  privacyNoticeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default OnboardingScreen; 