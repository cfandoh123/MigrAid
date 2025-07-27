// MigrAid App - Privacy-First Resource Navigator for Immigrants
// Built with React Native and Expo

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

// Import navigation and services
import AppNavigator from './src/navigation/AppNavigator';
import { storageService } from './src/services/storage';
import { Colors } from './src/constants/theme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user has completed onboarding
      const onboardingComplete = await storageService.getOnboardingComplete();
      setIsOnboardingComplete(onboardingComplete);
      
      // Set default preferences for new users
      if (!onboardingComplete) {
        await storageService.setAnonymousMode(true); // Default to anonymous
        await storageService.setLanguage('en'); // Default language
      }
    } catch (error) {
      console.warn('App initialization error:', error);
      // Fail safely - assume onboarding needed
      setIsOnboardingComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to complete onboarding from child components
  const completeOnboarding = async () => {
    try {
      await storageService.setOnboardingComplete(true);
      setIsOnboardingComplete(true);
    } catch (error) {
      console.warn('Error completing onboarding:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.background 
      }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <AppNavigator 
        isOnboardingComplete={isOnboardingComplete} 
        onCompleteOnboarding={completeOnboarding}
      />
    </>
  );
}
