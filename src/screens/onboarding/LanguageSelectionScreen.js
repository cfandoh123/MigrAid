// Language Selection Screen for MigrAid Onboarding
// Beautiful, accessible language selection with flags and animations

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientView, { GradientPresets } from '../../components/common/GradientView';

import SafeButton from '../../components/common/SafeButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CommonStyles } from '../../constants/theme';
import { SUPPORTED_LANGUAGES, getString } from '../../constants/strings';
import { storageService } from '../../services/storage';

const LanguageSelectionScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [animatedValues] = useState(
    SUPPORTED_LANGUAGES.reduce((acc, lang) => {
      acc[lang.code] = new Animated.Value(0);
      return acc;
    }, {})
  );

  const handleLanguageSelect = (languageCode) => {
    // Reset all animations
    Object.values(animatedValues).forEach(value => {
      Animated.timing(value, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    // Animate selected language
    Animated.spring(animatedValues[languageCode], {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    setSelectedLanguage(languageCode);
  };

  const handleContinue = async () => {
    try {
      await storageService.setLanguage(selectedLanguage);
      navigation.navigate('AnonymousMode');
    } catch (error) {
      console.warn('Error saving language:', error);
    }
  };

  const renderLanguageButton = (language, index) => {
    const isSelected = selectedLanguage === language.code;
    const animatedValue = animatedValues[language.code];
    
    const scaleInterpolation = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.05],
    });

    const elevationInterpolation = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    });

    return (
      <Animated.View
        key={language.code}
        style={[
          styles.languageButtonContainer,
          {
            transform: [{ scale: scaleInterpolation }],
            elevation: elevationInterpolation,
          }
        ]}
      >
        <Pressable
          style={[
            styles.languageButton,
            isSelected && styles.languageButtonSelected,
          ]}
          onPress={() => handleLanguageSelect(language.code)}
          android_ripple={{ color: Colors.primaryLight }}
        >
          <View style={styles.languageContent}>
            <View style={styles.flagContainer}>
              <Text style={styles.flagEmoji}>{language.flag}</Text>
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                </View>
              )}
            </View>
            
            <View style={styles.languageInfo}>
              <Text style={[
                styles.languageTitle,
                isSelected && styles.languageTitleSelected
              ]}>
                {language.nativeName || language.name}
              </Text>
              <Text style={[
                styles.languageSubtitle,
                isSelected && styles.languageSubtitleSelected
              ]}>
                {language.name !== language.nativeName ? language.name : ''}
              </Text>
            </View>
          </View>
          
          {isSelected && (
            <View style={styles.selectionRipple}>
              <View style={styles.rippleCircle} />
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <GradientView 
      {...GradientPresets.subtle}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
          </View>
          <Text style={styles.progressText}>Step 1 of 3</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/migraid-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.appName}>MigrAid</Text>
            <Text style={styles.tagline}>Safety • Privacy • Community</Text>
          </View>
          <Text style={styles.welcomeTitle}>
            {getString('welcome', selectedLanguage)}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Choose your preferred language to continue
          </Text>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select Your Language
          </Text>
          <Text style={styles.sectionDescription}>
            Choose the language you'd like to use throughout the app
          </Text>
          
          <View style={styles.languageList}>
            {SUPPORTED_LANGUAGES.map((language, index) => renderLanguageButton(language, index))}
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.actions}>
          <SafeButton
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.continueButton}
            icon={<Ionicons name="arrow-forward" size={20} color={Colors.background} />}
          />
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can change your language preference anytime in settings
          </Text>
        </View>
              </ScrollView>
      </SafeAreaView>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  progressBar: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  progressStep: {
    width: 60,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
  },
  progressStepActive: {
    backgroundColor: Colors.primary,
  },
  progressText: {
    ...CommonStyles.caption,
    color: Colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundPure,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    ...Shadows.md,
    marginBottom: Spacing.base,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: Spacing.lg,
  },
  appName: {
    ...CommonStyles.heading2,
    color: Colors.text,
    fontWeight: Typography.fontWeight.black,
    marginBottom: Spacing.sm,
  },
  tagline: {
    ...CommonStyles.bodyMedium,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
    letterSpacing: Typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  welcomeTitle: {
    ...CommonStyles.heading1,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    color: Colors.text,
    fontWeight: Typography.fontWeight.black,
  },
  welcomeSubtitle: {
    ...CommonStyles.bodyLarge,
    textAlign: 'center',
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...CommonStyles.heading3,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  sectionDescription: {
    ...CommonStyles.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  languageList: {
    gap: Spacing.base,
  },
  languageButtonContainer: {
    borderRadius: BorderRadius.lg,
  },
  languageButton: {
    backgroundColor: Colors.backgroundPure,
    borderRadius: BorderRadius.xl,
    borderWidth: 3,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    ...Shadows.md,
    minHeight: 80,
  },
  languageButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryUltraLight,
    ...Shadows.lg,
    transform: [{ scale: 1.02 }],
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  flagContainer: {
    position: 'relative',
    marginRight: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surfaceVariant,
  },
  flagEmoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryShadow,
    borderWidth: 3,
    borderColor: Colors.backgroundPure,
  },
  languageInfo: {
    flex: 1,
  },
  languageTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: 2,
    color: Colors.text,
  },
  languageTitleSelected: {
    color: Colors.primary,
  },
  languageSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  languageSubtitleSelected: {
    color: Colors.primaryDark,
  },
  selectionRipple: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  rippleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    opacity: 0.1,
  },
  actions: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  continueButton: {
    marginBottom: Spacing.base,
    ...Shadows.primaryShadow,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    minHeight: 56,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.base,
  },
  footerText: {
    ...CommonStyles.caption,
    textAlign: 'center',
    color: Colors.textLight,
    fontStyle: 'italic',
  },
});

export default LanguageSelectionScreen; 