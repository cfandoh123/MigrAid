// Advocate Login Screen for MigrAid
// Simple authentication for community advocates and NGO workers

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CustomInput from '../../components/common/CustomInput';
import SafeButton from '../../components/common/SafeButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { storageService } from '../../services/storage';

// Demo credentials for advocate access
const DEMO_CREDENTIALS = {
  username: 'advocate@migraid.org',
  password: 'community2025'
};

const AdvocateLogin = ({ navigation }) => {
  const [language, setLanguage] = useState('en');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  useEffect(() => {
    loadLanguage();
    checkExistingSession();
  }, []);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const checkExistingSession = async () => {
    try {
      const session = await storageService.getItem('@migraid:advocateSession');
      if (session && session.expires > Date.now()) {
        // Valid session exists, navigate to home page
        navigation.goBack(); // Dismiss the modal first
        setTimeout(() => {
          navigation.navigate('Main', {
            screen: 'Home',
            params: { screen: 'HomeMain' }
          });
        }, 100);
      }
    } catch (error) {
      console.warn('Error checking session:', error);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Login Required', 'Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check credentials
      if (username.trim() === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        // Successful login
        const session = {
          username: username.trim(),
          loginTime: new Date().toISOString(),
          expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          role: 'advocate',
          permissions: ['resource_management', 'report_moderation', 'announcements', 'statistics']
        };

        await storageService.setItem('@migraid:advocateSession', session);
        await storageService.updateUsageAnalytics('advocate_login');

        Alert.alert(
          'Login Successful',
          'Welcome! You are now signed in as an advocate.',
          [
            {
              text: 'Continue',
              onPress: () => {
                // Navigate to home page
                navigation.goBack(); // Dismiss the modal first
                setTimeout(() => {
                  navigation.navigate('Main', {
                    screen: 'Home',
                    params: { screen: 'HomeMain' }
                  });
                }, 100);
              }
            }
          ]
        );
      } else {
        // Failed login
        setLoginAttempts(prev => prev + 1);
        
        if (loginAttempts >= 2) {
          Alert.alert(
            'Multiple Failed Attempts',
            'For security, please try again later. Contact your organization administrator if you need assistance.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Login Failed',
            'Invalid username or password. Please check your credentials and try again.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      Alert.alert(
        'Login Error',
        'There was an error during login. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Password Recovery',
      'For password recovery, please contact your organization administrator or the MigrAid support team.\n\nDemo Credentials:\nUsername: advocate@migraid.org\nPassword: community2025',
      [{ text: 'OK' }]
    );
  };

  const handleRequestAccess = () => {
    Alert.alert(
      'Request Advocate Access',
      'To request advocate access:\n\n1. You must be affiliated with a verified NGO or community organization\n2. Contact your organization administrator\n3. Submit required verification documents\n4. Complete advocate training program\n\nFor more information, visit migraid.org/advocate-program',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Learn More', onPress: () => {
          // In a real app, this would open a web link
          Alert.alert('Info', 'This would open the advocate program information page.');
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Logo Section - Pinned to top */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../../assets/migraid-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logoTitle}>MigrAid</Text>
              <Text style={styles.logoSubtitle}>Advocate Portal</Text>
            </View>
          </View>

          {/* Centered Content Area */}
          <View style={styles.centeredContent}>
            {/* Login Form */}
            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Welcome Back</Text>
                <Text style={styles.formSubtitle}>
                  Sign in to access resource management and community moderation tools
                </Text>
              </View>

              <View style={styles.form}>
                <CustomInput
                  label="Username / Email"
                  placeholder="advocate@organization.org"
                  value={username}
                  onChangeText={setUsername}
                  leftIcon="person-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />

                <CustomInput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  leftIcon="lock-closed-outline"
                  rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />

                <SafeButton
                  title={isLoading ? 'Signing In...' : 'Sign In'}
                  onPress={handleLogin}
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading || !username.trim() || !password.trim()}
                  style={styles.loginButton}
                  icon={<Ionicons name="log-in" size={20} color={Colors.background} />}
                />
              </View>
            </View>

            {/* Action Links */}
            <View style={styles.actionLinks}>
              <TouchableOpacity
                style={styles.actionLink}
                onPress={handleForgotPassword}
              >
                <Text style={styles.actionLinkText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionLink}
                onPress={handleRequestAccess}
              >
                <Text style={styles.actionLinkText}>Request Advocate Access</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Content */}
          <View style={styles.bottomContent}>
            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <Ionicons name="shield-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.securityText}>
                Advocate access is restricted to verified community organizations and NGO workers.
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By signing in, you agree to follow MigrAid's community guidelines and data protection policies.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: screenHeight,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: Spacing.base,
  },
  logoTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  logoSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: 0.5,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  formContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formHeader: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  formSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    paddingHorizontal: Spacing.base,
  },
  form: {
    gap: Spacing.lg,
  },
  input: {
    marginBottom: 0,
  },
  loginButton: {
    marginTop: Spacing.sm,
    ...Shadows.sm,
  },
  demoInfo: {
    backgroundColor: Colors.infoBackground,
    borderColor: Colors.info,
    borderWidth: 1,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  demoTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.info,
  },
  demoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  actionLinks: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.lg,
  },
  actionLink: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  actionLinkText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
    textDecorationLine: 'underline',
  },
  bottomContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  securityText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
    paddingHorizontal: Spacing.base,
  },
});

export default AdvocateLogin; 