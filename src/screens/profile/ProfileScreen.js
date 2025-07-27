// Profile & Settings Screen for MigrAid
// Comprehensive privacy controls, settings, and data management

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
  TouchableOpacity,
  Modal,
  Linking,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SafeButton from '../../components/common/SafeButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { SUPPORTED_LANGUAGES, getString } from '../../constants/strings';
import { storageService } from '../../services/storage';

const APP_VERSION = '1.0.0';
const PRIVACY_POLICY_VERSION = '1.0';

const ProfileScreen = ({ navigation }) => {
  const [language, setLanguage] = useState('en');
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [viewPreferences, setViewPreferences] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({});
  const [accessibilitySettings, setAccessibilitySettings] = useState({});
  
  // Modal states
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [showStorageInfo, setShowStorageInfo] = useState(false);
  
  // Data states
  const [storageInfo, setStorageInfo] = useState(null);
  const [dataSummary, setDataSummary] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [advocateSession, setAdvocateSession] = useState(null);

  const emergencyContacts = [
    {
      name: 'ACLU Immigrant Rights Hotline',
      number: '1-877-523-2298',
      description: 'Know your rights legal support',
      available: '24/7',
      icon: 'shield-outline'
    },
    {
      name: 'United We Dream Hotline',
      number: '1-844-363-1423',
      description: 'Immigration defense and support',
      available: 'Mon-Fri 9AM-6PM ET',
      icon: 'people-outline'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Mental health crisis support',
      available: '24/7',
      icon: 'chatbubble-outline'
    },
    {
      name: 'Local Legal Aid',
      number: '1-888-534-2561',
      description: 'Free legal assistance',
      available: 'Mon-Fri 9AM-5PM',
      icon: 'library-outline'
    },
    {
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      description: 'Domestic violence support',
      available: '24/7',
      icon: 'heart-outline'
    }
  ];

  useEffect(() => {
    loadAllSettings();
    loadStorageInfo();
  }, []);

  const loadAllSettings = async () => {
    try {
      const [
        userLanguage,
        isAnonymous,
        viewPrefs,
        notifSettings,
        accessSettings,
      ] = await Promise.all([
        storageService.getLanguage(),
        storageService.getAnonymousMode(),
        storageService.getViewPreferences(),
        storageService.getNotificationSettings(),
        storageService.getAccessibilitySettings(),
      ]);

      setLanguage(userLanguage);
      setAnonymousMode(isAnonymous);
      setViewPreferences(viewPrefs);
      setNotificationSettings(notifSettings);
      setAccessibilitySettings(accessSettings);

      // Load data summary
      const summary = await storageService.getDataSummary();
      if (summary.success) {
        setDataSummary(summary.data);
      }
    } catch (error) {
      console.warn('Error loading settings:', error);
    }
  };

  const loadStorageInfo = async () => {
    const info = await storageService.getStorageSize();
    setStorageInfo(info);
  };

  const handleLanguageChange = async (newLanguage) => {
    try {
      const result = await storageService.setLanguage(newLanguage);
      if (result.success) {
      setLanguage(newLanguage);
        setShowLanguageSelector(false);
        Alert.alert(
          'Language Changed',
          `Language changed to ${SUPPORTED_LANGUAGES.find(l => l.code === newLanguage)?.name || 'Selected language'}. App will use the new language.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.warn('Error changing language:', error);
      Alert.alert('Error', 'Failed to change language. Please try again.');
    }
  };

  const handleAnonymousModeToggle = async (value) => {
    try {
      const result = await storageService.setAnonymousMode(value);
      if (result.success) {
      setAnonymousMode(value);
      
      Alert.alert(
        value ? 'Anonymous Mode Enabled' : 'Anonymous Mode Disabled',
        value 
            ? 'Enhanced privacy protection is now active. Your data will be anonymized and usage analytics will be collected anonymously.'
            : 'Privacy protection has been reduced. Usage analytics will be disabled.',
        [{ text: 'OK' }]
      );

        // Refresh data summary
        const summary = await storageService.getDataSummary();
        if (summary.success) {
          setDataSummary(summary.data);
        }
      }
    } catch (error) {
      console.warn('Error toggling anonymous mode:', error);
    }
  };

  const handleViewPreferenceChange = async (key, value) => {
    try {
      const newPrefs = { ...viewPreferences, [key]: value };
      const result = await storageService.setViewPreferences(newPrefs);
      if (result.success) {
        setViewPreferences(newPrefs);
      }
    } catch (error) {
      console.warn('Error updating view preferences:', error);
    }
  };

  const handleNotificationToggle = async (key, value) => {
    try {
      const newSettings = { ...notificationSettings, [key]: value };
      const result = await storageService.setNotificationSettings(newSettings);
      if (result.success) {
        setNotificationSettings(newSettings);
      }
    } catch (error) {
      console.warn('Error updating notification settings:', error);
    }
  };

  const handleAccessibilityToggle = async (key, value) => {
    try {
      const newSettings = { ...accessibilitySettings, [key]: value };
      const result = await storageService.setAccessibilitySettings(newSettings);
      if (result.success) {
        setAccessibilitySettings(newSettings);
      }
    } catch (error) {
      console.warn('Error updating accessibility settings:', error);
    }
  };

  const handleDataExport = async () => {
    try {
      const result = await storageService.exportUserData();
      if (result.success) {
        setExportData(result.data);
        setShowDataExport(true);
      } else {
        Alert.alert('Export Error', result.error);
      }
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export data. Please try again.');
    }
  };

  const handleShareData = async () => {
    try {
      const result = await storageService.shareUserData();
      if (!result.success) {
        Alert.alert('Share Error', result.error);
      }
    } catch (error) {
      Alert.alert('Share Error', 'Failed to share data. Please try again.');
    }
  };

  const handleClearSpecificData = (categories) => {
    Alert.alert(
      'Clear Data',
      `Are you sure you want to clear ${categories.join(', ')} data? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: async () => {
            const result = await storageService.deleteSpecificData(categories);
            if (result.success) {
              Alert.alert('Data Cleared', 'Selected data has been permanently deleted.');
              await loadAllSettings();
              await loadStorageInfo();
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const handleDataDeletion = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete ALL your settings, saved resources, reports, and cached data. This action cannot be undone.\n\nYou will need to go through onboarding again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Everything', style: 'destructive', onPress: confirmDataDeletion }
      ]
    );
  };

  const confirmDataDeletion = async () => {
    try {
      const result = await storageService.deleteAllUserData();
      if (result.success) {
      Alert.alert(
        'Data Deleted',
        'All your data has been permanently deleted. The app will restart with default settings.',
        [{ text: 'OK', onPress: () => {
          // Reset to onboarding
          storageService.setOnboardingComplete(false);
        }}]
      );
      } else {
        Alert.alert('Deletion Error', result.error);
      }
    } catch (error) {
      console.warn('Error deleting data:', error);
      Alert.alert('Deletion Error', 'Failed to delete data. Please try again.');
    }
  };

  const handleClearSensitiveData = async () => {
    try {
      const result = await storageService.clearSensitiveData();
      if (result.success) {
    Alert.alert(
          'Sensitive Data Cleared',
          'Cache, usage analytics, and search history have been cleared while preserving your preferences.',
      [{ text: 'OK' }]
    );
        await loadStorageInfo();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to clear sensitive data.');
    }
  };

  const makeEmergencyCall = (contact) => {
    if (contact.number.includes('741741') || contact.number.includes('Text HOME')) {
      Alert.alert(
        'Crisis Text Line',
        'Send a text message "HOME" to 741741 for mental health crisis support?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send Text', 
            onPress: () => Linking.openURL('sms:741741&body=HOME') 
          }
        ]
      );
    } else {
      Alert.alert(
        `Call ${contact.name}?`,
        `${contact.description}\nAvailable: ${contact.available}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => Linking.openURL(`tel:${contact.number}`) }
        ]
      );
    }
    storageService.updateUsageAnalytics('emergency_contact_used');
  };

  const handleAdvocateLogin = () => {
    // Always go to advocate dashboard - it will handle login redirect if needed
    navigation.navigate('Advocate', { screen: 'AdvocateDashboard' });
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'What would you like to do when signing out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Keep My Data',
          onPress: () => performLogout(false),
        },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: () => performLogout(true),
        },
      ]
    );
  };

  const performLogout = async (clearData) => {
    try {
      // Clear advocate session if exists
      await storageService.removeItem('@migraid:advocateSession');
      
      if (clearData) {
        // Clear all user data
        const result = await storageService.deleteAllUserData();
        if (result.success) {
          Alert.alert(
            'Signed Out',
            'You have been signed out and all your data has been cleared. The app will restart with default settings.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Reset to onboarding
                  storageService.setOnboardingComplete(false);
                  // In a real app, you might want to restart or navigate to onboarding
                  navigation.navigate('Advocate', { screen: 'AdvocateLogin' });
                }
              }
            ]
          );
        } else {
          Alert.alert('Logout Error', 'Failed to clear data. Please try again.');
          return;
        }
      } else {
        // Just clear session and navigate to login
        Alert.alert(
          'Signed Out',
          'You have been successfully signed out. Your saved data and preferences are preserved.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Advocate', { screen: 'AdvocateLogin' });
              }
            }
          ]
        );
      }
      
      // Reload the screen data to reflect the logged out state
      await loadAllSettings();
      await loadStorageInfo();
      
    } catch (error) {
      console.warn('Error during logout:', error);
      Alert.alert('Logout Error', 'Failed to sign out. Please try again.');
    }
  };

  const renderLanguageSelector = () => (
    <Modal visible={showLanguageSelector} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Language</Text>
          <TouchableOpacity onPress={() => setShowLanguageSelector(false)}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                { backgroundColor: language === lang.code ? Colors.primaryBackground : Colors.background }
              ]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <View style={styles.languageInfo}>
                <Text style={[
                  styles.languageName,
                  { color: language === lang.code ? Colors.primary : Colors.text }
                ]}>
                  {lang.name}
                </Text>
                <Text style={styles.languageNative}>{lang.nativeName}</Text>
              </View>
              {language === lang.code && (
                <Ionicons name="checkmark" size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderPrivacyPolicy = () => (
    <Modal visible={showPrivacyPolicy} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Privacy Policy</Text>
          <TouchableOpacity onPress={() => setShowPrivacyPolicy(false)}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.privacyPolicyContent}>
            <Text style={styles.privacyPolicyTitle}>MigrAid Privacy Policy</Text>
            <Text style={styles.privacyPolicyVersion}>Version {PRIVACY_POLICY_VERSION} • Updated: January 2024</Text>
            
            <View style={styles.privacySection}>
              <Text style={styles.privacySectionTitle}>Our Privacy Commitment</Text>
              <Text style={styles.privacyText}>
                MigrAid is designed with privacy-first principles. We believe your safety and privacy are fundamental rights, not features.
              </Text>
            </View>

            <View style={styles.privacySection}>
              <Text style={styles.privacySectionTitle}>Local-Only Data Storage</Text>
              <Text style={styles.privacyText}>
                • All your data is stored locally on your device{'\n'}
                • No personal information is transmitted to external servers{'\n'}
                • Your location data is anonymized and never shared{'\n'}
                • Reports you submit are completely anonymous{'\n'}
                • We cannot identify you or track your usage across devices
              </Text>
            </View>

            <View style={styles.privacySection}>
              <Text style={styles.privacySectionTitle}>What Data We Store</Text>
              <Text style={styles.privacyText}>
                • Language preferences and app settings{'\n'}
                • Resources you save for quick access{'\n'}
                • Anonymous reports you submit to help the community{'\n'}
                • Search history to improve your experience{'\n'}
                • Anonymous usage patterns (only if you consent)
              </Text>
            </View>

            <View style={styles.privacySection}>
              <Text style={styles.privacySectionTitle}>What We DON'T Collect</Text>
              <Text style={styles.privacyText}>
                • Your name, email, or any identifying information{'\n'}
                • Your exact location or movement patterns{'\n'}
                • Your contacts or other apps on your device{'\n'}
                • Your conversations or messages{'\n'}
                • Any data that could be used to identify you
              </Text>
            </View>

            <View style={styles.privacySection}>
              <Text style={styles.privacySectionTitle}>Anonymous Mode</Text>
              <Text style={styles.privacyText}>
                When enabled (recommended), Anonymous Mode provides maximum privacy protection by limiting data collection to essential app functionality only.
              </Text>
            </View>

            <View style={styles.privacySection}>
              <Text style={styles.privacySectionTitle}>Your Data Rights</Text>
              <Text style={styles.privacyText}>
                • You can export all your data at any time{'\n'}
                • You can delete specific types of data{'\n'}
                • You can delete all data and start fresh{'\n'}
                • You control what data is stored{'\n'}
                • No data is permanent if you don't want it to be
              </Text>
            </View>

            <View style={styles.privacySection}>
              <Text style={styles.privacySectionTitle}>Third-Party Services</Text>
              <Text style={styles.privacyText}>
                MigrAid uses minimal third-party services:{'\n'}
                • Maps for location services (data anonymized){'\n'}
                • No advertising networks or trackers{'\n'}
                • No analytics services that identify users{'\n'}
                • No data brokers or marketing companies
              </Text>
            </View>

            <View style={styles.privacySection}>
              <Text style={styles.privacySectionTitle}>Changes to This Policy</Text>
              <Text style={styles.privacyText}>
                We will notify you of any material changes to this privacy policy through the app. Continued use constitutes acceptance of changes.
              </Text>
            </View>

            <View style={styles.privacyFooter}>
              <Text style={styles.privacyFooterText}>
                This policy reflects our commitment to protecting immigrant communities through privacy-first technology.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderDataExport = () => (
    <Modal visible={showDataExport} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Data Export</Text>
          <TouchableOpacity onPress={() => setShowDataExport(false)}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {exportData && (
            <View style={styles.exportContent}>
              <View style={styles.exportHeader}>
                <Ionicons name="download" size={32} color={Colors.primary} />
                <Text style={styles.exportTitle}>Your Data Export</Text>
                <Text style={styles.exportSubtitle}>
                  Generated on {exportData.metadata.exportDate ? new Date(exportData.metadata.exportDate).toLocaleString() : 'Unknown'}
                </Text>
              </View>

              <View style={styles.exportSections}>
                <View style={styles.exportSection}>
                  <Text style={styles.exportSectionTitle}>Preferences</Text>
                  <Text style={styles.exportSectionCount}>
                    {Object.keys(exportData.preferences || {}).length} items
                  </Text>
                </View>

                <View style={styles.exportSection}>
                  <Text style={styles.exportSectionTitle}>User Data</Text>
                  <Text style={styles.exportSectionCount}>
                    {Object.keys(exportData.userData || {}).length} items
                  </Text>
                </View>

                <View style={styles.exportSection}>
                  <Text style={styles.exportSectionTitle}>Privacy Settings</Text>
                  <Text style={styles.exportSectionCount}>
                    {Object.keys(exportData.privacy || {}).length} items
                  </Text>
                </View>

                {anonymousMode && (
                  <View style={styles.exportSection}>
                    <Text style={styles.exportSectionTitle}>Anonymous Analytics</Text>
                    <Text style={styles.exportSectionCount}>
                      {Object.keys(exportData.analytics || {}).length} items
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.exportActions}>
                <SafeButton
                  title="Share Data Export"
                  onPress={handleShareData}
                  variant="primary"
                  fullWidth
                  icon={<Ionicons name="share" size={20} color={Colors.background} />}
                  style={styles.exportButton}
                />
                
                <Text style={styles.exportNote}>
                  Your data export is in JSON format and contains all information stored by MigrAid on your device.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderEmergencyContacts = () => (
    <Modal visible={showEmergencyContacts} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Emergency Contacts</Text>
          <TouchableOpacity onPress={() => setShowEmergencyContacts(false)}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.secure} />
            <Text style={styles.emergencyTitle}>Emergency Resources</Text>
            <Text style={styles.emergencySubtitle}>
              Available 24/7 for immediate assistance and legal support
            </Text>
          </View>
          
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={styles.emergencyContactCard}
              onPress={() => makeEmergencyCall(contact)}
            >
              <View style={styles.contactIconContainer}>
                <Ionicons name={contact.icon} size={24} color={Colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
                <Text style={styles.contactDescription}>{contact.description}</Text>
                <Text style={styles.contactAvailability}>Available: {contact.available}</Text>
              </View>
              <Ionicons name="call" size={20} color={Colors.primary} />
            </TouchableOpacity>
          ))}
          
          <View style={styles.emergencyFooter}>
            <Text style={styles.footerText}>
              Remember: You have rights. You are not alone. Help is available.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderStorageInfo = () => (
    <Modal visible={showStorageInfo} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Storage Information</Text>
          <TouchableOpacity onPress={() => setShowStorageInfo(false)}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {storageInfo && (
            <View style={styles.storageContent}>
              <View style={styles.storageHeader}>
                <Ionicons name="server" size={32} color={Colors.info} />
                <Text style={styles.storageTitle}>Local Storage Usage</Text>
                <Text style={styles.storageSubtitle}>
                  All data is stored locally on your device
                </Text>
              </View>

              <View style={styles.storageSummary}>
                <View style={styles.storageItem}>
                  <Text style={styles.storageLabel}>Total Keys</Text>
                  <Text style={styles.storageValue}>{storageInfo.summary.totalKeys}</Text>
                </View>
                <View style={styles.storageItem}>
                  <Text style={styles.storageLabel}>Total Size</Text>
                  <Text style={styles.storageValue}>{storageInfo.summary.totalSizeKB} KB</Text>
                </View>
                <View style={styles.storageItem}>
                  <Text style={styles.storageLabel}>Data Location</Text>
                  <Text style={styles.storageValue}>Device Only</Text>
                </View>
              </View>

              <View style={styles.storageActions}>
                <SafeButton
                  title="Clear Cache"
                  onPress={handleClearSensitiveData}
                  variant="outline"
                  style={styles.storageButton}
                  icon={<Ionicons name="refresh" size={16} color={Colors.primary} />}
                />
              </View>

              <View style={styles.storageNote}>
                <Text style={styles.storageNoteText}>
                  MigrAid stores all data locally for maximum privacy. No data is sent to external servers.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const settingsGroups = [
    {
      title: 'Language & Interface',
      items: [
        {
          id: 'language',
          title: 'Language',
          subtitle: SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName || 'English',
          icon: 'language-outline',
          type: 'navigation',
          action: () => setShowLanguageSelector(true),
        },
        {
          id: 'defaultView',
          title: 'Default View',
          subtitle: viewPreferences.defaultView === 'map' ? 'Map View' : 'List View',
          icon: viewPreferences.defaultView === 'map' ? 'map-outline' : 'list-outline',
          type: 'toggle',
          value: viewPreferences.defaultView === 'map',
          action: (value) => handleViewPreferenceChange('defaultView', value ? 'map' : 'list'),
        },
        {
          id: 'compactView',
          title: 'Compact List View',
          subtitle: viewPreferences.compactView ? 'Enabled' : 'Disabled',
          icon: 'resize-outline',
          type: 'toggle',
          value: viewPreferences.compactView,
          action: (value) => handleViewPreferenceChange('compactView', value),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'anonymous',
          title: 'Anonymous Mode',
          subtitle: anonymousMode ? 'Enhanced privacy protection' : 'Standard privacy',
          icon: 'shield-checkmark-outline',
          type: 'toggle',
          value: anonymousMode,
          action: handleAnonymousModeToggle,
        },
        {
          id: 'showDistances',
          title: 'Show Distances',
          subtitle: viewPreferences.showDistances ? 'Show distance to resources' : 'Hide distances',
          icon: 'location-outline',
          type: 'toggle',
          value: viewPreferences.showDistances,
          action: (value) => handleViewPreferenceChange('showDistances', value),
        },
        {
          id: 'privacyPolicy',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy commitments',
          icon: 'document-text-outline',
          type: 'navigation',
          action: () => setShowPrivacyPolicy(true),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'iceAlerts',
          title: 'ICE Activity Alerts',
          subtitle: notificationSettings.iceAlerts ? 'Enabled' : 'Disabled',
          icon: 'alert-circle-outline',
          type: 'toggle',
          value: notificationSettings.iceAlerts,
          action: (value) => handleNotificationToggle('iceAlerts', value),
        },
        {
          id: 'emergencyContacts',
          title: 'Emergency Contact Notifications',
          subtitle: notificationSettings.emergencyContacts ? 'Enabled' : 'Disabled',
          icon: 'call-outline',
          type: 'toggle',
          value: notificationSettings.emergencyContacts,
          action: (value) => handleNotificationToggle('emergencyContacts', value),
        },
        {
          id: 'resourceUpdates',
          title: 'Resource Updates',
          subtitle: notificationSettings.resourceUpdates ? 'Enabled' : 'Disabled',
          icon: 'refresh-circle-outline',
          type: 'toggle',
          value: notificationSettings.resourceUpdates,
          action: (value) => handleNotificationToggle('resourceUpdates', value),
        },
      ],
    },
    {
      title: 'Accessibility',
      items: [
        {
          id: 'largeText',
          title: 'Large Text',
          subtitle: accessibilitySettings.largeText ? 'Enabled' : 'Disabled',
          icon: 'text-outline',
          type: 'toggle',
          value: accessibilitySettings.largeText,
          action: (value) => handleAccessibilityToggle('largeText', value),
        },
        {
          id: 'highContrast',
          title: 'High Contrast',
          subtitle: accessibilitySettings.highContrast ? 'Enabled' : 'Disabled',
          icon: 'contrast-outline',
          type: 'toggle',
          value: accessibilitySettings.highContrast,
          action: (value) => handleAccessibilityToggle('highContrast', value),
        },
        {
          id: 'hapticFeedback',
          title: 'Haptic Feedback',
          subtitle: accessibilitySettings.hapticFeedback ? 'Enabled' : 'Disabled',
          icon: 'phone-portrait-outline',
          type: 'toggle',
          value: accessibilitySettings.hapticFeedback,
          action: (value) => handleAccessibilityToggle('hapticFeedback', value),
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          id: 'storageInfo',
          title: 'Storage Information',
          subtitle: storageInfo ? `${storageInfo.summary.totalSizeKB} KB used` : 'Loading...',
          icon: 'server-outline',
          type: 'navigation',
          action: () => setShowStorageInfo(true),
        },
        {
          id: 'export',
          title: 'Export My Data',
          subtitle: 'Download all your stored information',
          icon: 'download-outline',
          type: 'navigation',
          action: handleDataExport,
        },
        {
          id: 'clearCache',
          title: 'Clear Cache & Sensitive Data',
          subtitle: 'Remove temporary data while keeping preferences',
          icon: 'refresh-outline',
          type: 'action',
          action: handleClearSensitiveData,
        },
        {
          id: 'clearSpecific',
          title: 'Clear Specific Data',
          subtitle: 'Choose what to delete',
          icon: 'checkmark-circle-outline',
          type: 'action',
          action: () => {
            Alert.alert(
              'Clear Specific Data',
              'Choose what type of data to clear:',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Search History', onPress: () => handleClearSpecificData(['userData']) },
                { text: 'Cache Only', onPress: () => handleClearSpecificData(['cache']) },
                { text: 'Analytics', onPress: () => handleClearSpecificData(['analytics']) },
              ]
            );
          },
        },
        {
          id: 'delete',
          title: 'Delete All Data',
          subtitle: 'Permanently remove all stored data',
          icon: 'trash-outline',
          type: 'danger',
          action: handleDataDeletion,
        },
      ],
    },
    {
      title: 'Account & Security',
      items: [
        {
          id: 'logout',
          title: 'Sign Out',
          subtitle: 'Sign out and optionally clear stored data',
          icon: 'log-out-outline',
          type: 'danger',
          action: handleLogout,
        },
      ],
    },
  ];

  const renderSettingItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.type === 'navigation' || item.type === 'action' || item.type === 'danger' ? item.action : undefined}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingIcon}>
        <Ionicons 
          name={item.icon} 
          size={24} 
          color={item.type === 'danger' ? Colors.danger : Colors.primary} 
        />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle,
          item.type === 'danger' && { color: Colors.danger }
        ]}>
          {item.title}
        </Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      
      <View style={styles.settingAction}>
        {item.type === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={item.action}
            trackColor={{ false: Colors.border, true: Colors.primaryBackground }}
            thumbColor={item.value ? Colors.primary : Colors.textLight}
          />
        ) : (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={item.type === 'danger' ? Colors.danger : Colors.textSecondary} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings & Privacy</Text>
          <Text style={styles.subtitle}>
            Manage your privacy, preferences, and app settings
          </Text>
        </View>

        {/* Privacy Status Card */}
        <View style={[styles.privacyStatus, { borderLeftColor: anonymousMode ? Colors.secure : Colors.warning }]}>
          <View style={styles.privacyIcon}>
            <Ionicons 
              name={anonymousMode ? 'shield-checkmark' : 'shield-outline'} 
              size={32} 
              color={anonymousMode ? Colors.secure : Colors.warning} 
            />
          </View>
          <View style={styles.privacyInfo}>
            <Text style={styles.privacyTitle}>
              {anonymousMode ? 'Anonymous Mode Active' : 'Anonymous Mode Inactive'}
            </Text>
            <Text style={styles.privacyDescription}>
              {anonymousMode 
                ? 'Your privacy is protected with enhanced anonymization'
                : 'Consider enabling anonymous mode for better privacy'
              }
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => setShowEmergencyContacts(true)}
          >
            <Ionicons name="call" size={24} color={Colors.danger} />
            <Text style={styles.quickActionText}>Emergency Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={handleDataExport}
          >
            <Ionicons name="download" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Export Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => setShowPrivacyPolicy(true)}
          >
            <Ionicons name="shield-checkmark" size={24} color={Colors.secure} />
            <Text style={styles.quickActionText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, index) => (
          <View key={index} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupItems}>
              {group.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Advocate Access */}
        <View style={styles.advocateSection}>
          <Text style={styles.groupTitle}>Community Advocates</Text>
          <TouchableOpacity style={styles.advocateCard} onPress={handleAdvocateLogin}>
            <Ionicons 
              name={advocateSession ? "people" : "people-outline"} 
              size={32} 
              color={advocateSession ? Colors.success : Colors.info} 
            />
            <View style={styles.advocateContent}>
              <Text style={styles.advocateTitle}>
                {advocateSession ? 'Advocate Dashboard' : 'Advocate Access'}
              </Text>
              <Text style={styles.advocateDescription}>
                {advocateSession 
                  ? `Signed in as ${advocateSession.username?.split('@')[0] || 'Advocate'} • Tap to open dashboard`
                  : 'Access management tools for verified community advocates and NGO workers'
                }
              </Text>
              {advocateSession && (
                <View style={styles.advocateStatusBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  <Text style={styles.advocateStatusText}>Active Session</Text>
            </View>
              )}
          </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Data Summary */}
        {dataSummary && (
          <View style={styles.dataSummarySection}>
            <Text style={styles.groupTitle}>Your Data Summary</Text>
            <View style={styles.dataSummaryCard}>
              <View style={styles.dataSummaryItem}>
                <Text style={styles.dataSummaryLabel}>Saved Resources</Text>
                <Text style={styles.dataSummaryValue}>{dataSummary.userData.savedResources}</Text>
        </View>
              <View style={styles.dataSummaryItem}>
                <Text style={styles.dataSummaryLabel}>Your Reports</Text>
                <Text style={styles.dataSummaryValue}>{dataSummary.userData.userReports}</Text>
              </View>
              <View style={styles.dataSummaryItem}>
                <Text style={styles.dataSummaryLabel}>Search History</Text>
                <Text style={styles.dataSummaryValue}>{dataSummary.userData.searchHistory}</Text>
              </View>
              <View style={styles.dataSummaryItem}>
                <Text style={styles.dataSummaryLabel}>Storage Used</Text>
                <Text style={styles.dataSummaryValue}>{dataSummary.storage.summary.totalSizeKB} KB</Text>
              </View>
            </View>
          </View>
        )}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>MigrAid v{APP_VERSION}</Text>
          <Text style={styles.appInfoText}>
            Privacy-first resource navigator for immigrant communities
          </Text>
          <Text style={styles.appInfoText}>
            Made with ❤️ for safety and dignity
          </Text>
          <Text style={styles.appInfoText}>
            All data stored locally • No tracking • Open source
          </Text>
        </View>
      </ScrollView>

      {/* Modals */}
      {renderLanguageSelector()}
      {renderPrivacyPolicy()}
      {renderDataExport()}
      {renderEmergencyContacts()}
      {renderStorageInfo()}
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
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  privacyStatus: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    ...Shadows.sm,
  },
  privacyIcon: {
    marginRight: Spacing.base,
  },
  privacyInfo: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  privacyDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.base,
    gap: Spacing.xs,
  },
  quickActionText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  settingsGroup: {
    marginBottom: Spacing.lg,
  },
  groupTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.base,
  },
  groupItems: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIcon: {
    marginRight: Spacing.base,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  settingAction: {
    marginLeft: Spacing.base,
  },
  advocateSection: {
    marginBottom: Spacing.lg,
  },
  advocateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.infoBackground,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.info,
    gap: Spacing.base,
  },
  advocateContent: {
    flex: 1,
  },
  advocateTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.info,
    marginBottom: Spacing.xs,
  },
  advocateDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  advocateStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  advocateStatusText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  dataSummarySection: {
    marginBottom: Spacing.lg,
  },
  dataSummaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  dataSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dataSummaryLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  dataSummaryValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary,
  },
  appInfo: {
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    marginTop: Spacing.base,
    ...Shadows.sm,
  },
  appInfoTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  appInfoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.base,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.xs,
    gap: Spacing.base,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  languageNative: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  privacyPolicyContent: {
    padding: Spacing.base,
  },
  privacyPolicyTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  privacyPolicyVersion: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  privacySection: {
    marginBottom: Spacing.lg,
  },
  privacySectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  privacyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  privacyFooter: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginTop: Spacing.lg,
  },
  privacyFooterText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  exportContent: {
    padding: Spacing.base,
  },
  exportHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  exportTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  exportSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  exportSections: {
    marginBottom: Spacing.lg,
  },
  exportSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.sm,
  },
  exportSectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  exportSectionCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  exportActions: {
    marginBottom: Spacing.lg,
  },
  exportButton: {
    marginBottom: Spacing.base,
  },
  exportNote: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  emergencyHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emergencyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emergencySubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  emergencyContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    gap: Spacing.base,
    ...Shadows.sm,
  },
  contactIconContainer: {
    backgroundColor: Colors.primaryBackground,
    borderRadius: BorderRadius.round,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  contactNumber: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  contactDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  contactAvailability: {
    fontSize: Typography.fontSize.xs,
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  emergencyFooter: {
    marginTop: Spacing.lg,
    padding: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
  },
  footerText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  storageContent: {
    padding: Spacing.base,
  },
  storageHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  storageTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  storageSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  storageSummary: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
  },
  storageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  storageLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  storageValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary,
  },
  storageActions: {
    marginBottom: Spacing.lg,
  },
  storageButton: {
    marginBottom: Spacing.sm,
  },
  storageNote: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
  },
  storageNoteText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
});

export default ProfileScreen; 