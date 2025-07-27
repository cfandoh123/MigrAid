// Advocate Dashboard Screen for MigrAid
// Tools and resources for community advocates and NGO workers

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SafeButton from '../../components/common/SafeButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { getString } from '../../constants/strings';
import { mockResources, getVerifiedResources } from '../../data/mockResources';
import { getActiveReports, getVerifiedReports } from '../../data/mockIceReports';
import { storageService } from '../../services/storage';

const AdvocateScreen = ({ navigation }) => {
  const [language, setLanguage] = useState('en');
  const [stats, setStats] = useState({
    totalResources: 0,
    verifiedResources: 0,
    activeReports: 0,
    verifiedReports: 0,
  });

  useEffect(() => {
    loadLanguage();
    loadStats();
  }, []);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const loadStats = () => {
    const totalResources = mockResources.length;
    const verifiedResources = getVerifiedResources().length;
    const activeReports = getActiveReports().length;
    const verifiedReports = getVerifiedReports().length;

    setStats({
      totalResources,
      verifiedResources,
      activeReports,
      verifiedReports,
    });
  };

  const handleFeatureComingSoon = (feature) => {
    Alert.alert(
      'Coming Soon',
      `${feature} feature is being developed and will be available in a future update.`,
      [{ text: 'OK' }]
    );
  };

  const dashboardCards = [
    {
      title: 'Resource Management',
      description: 'Add, edit, and verify community resources',
      icon: 'library-outline',
      color: Colors.primary,
      action: () => handleFeatureComingSoon('Resource Management'),
    },
    {
      title: 'Report Verification',
      description: 'Review and verify community safety reports',
      icon: 'shield-checkmark-outline',
      color: Colors.secondary,
      action: () => handleFeatureComingSoon('Report Verification'),
    },
    {
      title: 'Community Outreach',
      description: 'Send announcements and safety alerts',
      icon: 'megaphone-outline',
      color: Colors.warning,
      action: () => handleFeatureComingSoon('Community Outreach'),
    },
    {
      title: 'Analytics Dashboard',
      description: 'View usage patterns and community needs',
      icon: 'analytics-outline',
      color: Colors.info,
      action: () => handleFeatureComingSoon('Analytics Dashboard'),
    },
  ];

  const quickActions = [
    {
      title: 'Verify New Resources',
      count: stats.totalResources - stats.verifiedResources,
      icon: 'checkmark-circle-outline',
      color: Colors.primary,
      action: () => handleFeatureComingSoon('Resource Verification'),
    },
    {
      title: 'Review Reports',
      count: stats.activeReports,
      icon: 'document-text-outline',
      color: Colors.warning,
      action: () => handleFeatureComingSoon('Report Review'),
    },
    {
      title: 'Send Alert',
      count: 0,
      icon: 'alert-circle-outline',
      color: Colors.error,
      action: () => handleFeatureComingSoon('Community Alerts'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Advocate Dashboard</Text>
          <Text style={styles.welcomeSubtitle}>
            Tools and resources for community workers and NGO staff
          </Text>
        </View>

        {/* Access Notice */}
        <View style={styles.accessNotice}>
          <Ionicons name="information-circle" size={24} color={Colors.info} />
          <View style={styles.accessContent}>
            <Text style={styles.accessTitle}>Advocate Access</Text>
            <Text style={styles.accessText}>
              This dashboard is designed for verified community advocates, NGO workers, and trusted community members.
            </Text>
          </View>
        </View>

        {/* Statistics Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalResources}</Text>
              <Text style={styles.statLabel}>Total Resources</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: Colors.secondary }]}>
                {stats.verifiedResources}
              </Text>
              <Text style={styles.statLabel}>Verified Resources</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: Colors.warning }]}>
                {stats.activeReports}
              </Text>
              <Text style={styles.statLabel}>Active Reports</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: Colors.info }]}>
                {stats.verifiedReports}
              </Text>
              <Text style={styles.statLabel}>Verified Reports</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          {quickActions.map((action, index) => (
            <SafeButton
              key={index}
              title={`${action.title} ${action.count > 0 ? `(${action.count})` : ''}`}
              onPress={action.action}
              variant="outline"
              fullWidth
              icon={<Ionicons name={action.icon} size={20} color={action.color} />}
              style={[styles.actionButton, { borderColor: action.color }]}
              textStyle={{ color: action.color }}
            />
          ))}
        </View>

        {/* Dashboard Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard Tools</Text>
          
          <View style={styles.cardsGrid}>
            {dashboardCards.map((card, index) => (
              <View key={index} style={styles.dashboardCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name={card.icon} size={32} color={card.color} />
                  <Text style={styles.cardTitle}>{card.title}</Text>
                </View>
                
                <Text style={styles.cardDescription}>{card.description}</Text>
                
                <SafeButton
                  title="Open"
                  onPress={card.action}
                  variant="outline"
                  size="sm"
                  style={[styles.cardButton, { borderColor: card.color }]}
                  textStyle={{ color: card.color }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Support Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Resources</Text>
          
          <View style={styles.supportCard}>
            <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Need Help?</Text>
              <Text style={styles.supportText}>
                Contact our advocate support team for training, technical assistance, or coordination with other organizations.
              </Text>
              <SafeButton
                title="Contact Support"
                onPress={() => handleFeatureComingSoon('Support Contact')}
                variant="primary"
                size="sm"
                style={styles.supportButton}
              />
            </View>
          </View>
        </View>

        {/* Privacy Reminder */}
        <View style={styles.privacyReminder}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.secure} />
          <Text style={styles.privacyText}>
            All advocate tools maintain user privacy and data protection standards
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
    padding: Spacing.base,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  accessNotice: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  accessContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  accessTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.info,
    marginBottom: Spacing.xs,
  },
  accessText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    alignItems: 'center',
    width: '48%',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  statNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dashboardCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    width: '48%',
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  cardDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.base,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  cardButton: {
    alignSelf: 'center',
  },
  supportCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    ...Shadows.sm,
  },
  supportContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  supportTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  supportText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  supportButton: {
    alignSelf: 'flex-start',
  },
  privacyReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.base,
    marginTop: Spacing.base,
  },
  privacyText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default AdvocateScreen; 