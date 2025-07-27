// Advocate Dashboard for MigrAid
// Main dashboard for community advocates and NGO workers

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SafeButton from '../../components/common/SafeButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CommonStyles } from '../../constants/theme';
import GradientView, { GradientPresets } from '../../components/common/GradientView';
import { storageService } from '../../services/storage';
import { mockResources } from '../../data/mockResources';
import { mockIceReports } from '../../data/mockIceReports';

const AdvocateDashboard = ({ navigation }) => {
  const [language, setLanguage] = useState('en');
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState({
    totalResources: 0,
    pendingReports: 0,
    verifiedResources: 0,
    activeAnnouncements: 0,
    todayActivity: 0,
    weeklyUsers: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadLanguage();
    loadSession();
    loadDashboardData();
  }, []);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const loadSession = async () => {
    try {
      const advocateSession = await storageService.getItem('@migraid:advocateSession');
      if (advocateSession && advocateSession.expires > Date.now()) {
        setSession(advocateSession);
      } else {
        // Session expired, redirect to login
        navigation.navigate('AdvocateLogin');
      }
    } catch (error) {
      console.warn('Error loading session:', error);
      navigation.navigate('AdvocateLogin');
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load statistics
      const totalResources = mockResources.length;
      const pendingReports = mockIceReports.filter(r => r.status === 'unverified').length;
      const verifiedResources = mockResources.filter(r => r.verified).length;
      
      // Mock additional statistics
      const activeAnnouncements = 3;
      const todayActivity = Math.floor(Math.random() * 50) + 20;
      const weeklyUsers = Math.floor(Math.random() * 500) + 200;

      setStats({
        totalResources,
        pendingReports,
        verifiedResources,
        activeAnnouncements,
        todayActivity,
        weeklyUsers,
      });

      // Generate recent activity feed
      const activity = generateRecentActivity();
      setRecentActivity(activity);

    } catch (error) {
      console.warn('Error loading dashboard data:', error);
    }
  };

  const generateRecentActivity = () => {
    const activities = [
      {
        id: '1',
        type: 'resource_added',
        title: 'New Legal Aid Center Added',
        description: 'Bay Area Legal Aid - Mission District location verified',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        icon: 'add-circle',
        color: Colors.success,
      },
      {
        id: '2',
        type: 'report_verified',
        title: 'ICE Report Verified',
        description: 'Downtown checkpoint report confirmed by 3 sources',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        icon: 'checkmark-circle',
        color: Colors.primary,
      },
      {
        id: '3',
        type: 'announcement_posted',
        title: 'Community Announcement Posted',
        description: 'Updated emergency contact information shared',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        icon: 'megaphone',
        color: Colors.info,
      },
      {
        id: '4',
        type: 'resource_updated',
        title: 'Resource Information Updated',
        description: 'SF Food Bank hours updated for weekend availability',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        icon: 'create',
        color: Colors.warning,
      },
      {
        id: '5',
        type: 'user_support',
        title: 'Support Request Resolved',
        description: 'Helped user find housing assistance in Oakland',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        icon: 'help-circle',
        color: Colors.secondary,
      },
    ];

    return activities;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleBackToApp = () => {
    // Navigate to the main app's home screen
    navigation.goBack(); // Dismiss the modal first
    setTimeout(() => {
      navigation.navigate('Main', {
        screen: 'Home',
        params: { screen: 'HomeMain' }
      });
    }, 100);
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const renderStatCard = (title, value, subtitle, icon, gradientPreset = GradientPresets.primary) => (
    <GradientView {...gradientPreset} style={styles.statCard}>
      <View style={styles.statContent}>
        <Ionicons name={icon} size={32} color={Colors.textOnPrimary} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </View>
    </GradientView>
  );

  const renderActivityItem = (item) => (
    <View key={item.id} style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon} size={16} color={item.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{getRelativeTime(item.timestamp)}</Text>
      </View>
    </View>
  );

  const managementTools = [
    {
      id: 'resources',
      title: 'Resource Management',
      description: 'Add, edit, and verify community resources',
      icon: 'library',
      color: Colors.primary,
      action: () => navigation.navigate('ResourceManagement'),
    },
    {
      id: 'reports',
      title: 'Report Moderation',
      description: 'Review and verify ICE activity reports',
      icon: 'shield-checkmark',
      color: Colors.warning,
      action: () => Alert.alert('Coming Soon', 'Report moderation interface is being developed.'),
    },
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'Create community announcements',
      icon: 'megaphone',
      color: Colors.info,
      action: () => Alert.alert('Coming Soon', 'Announcement creation interface is being developed.'),
    },
    {
      id: 'analytics',
      title: 'Usage Analytics',
      description: 'View anonymous usage statistics',
      icon: 'analytics',
      color: Colors.secondary,
      action: () => Alert.alert('Coming Soon', 'Analytics dashboard is being developed.'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.homeButton} onPress={handleBackToApp}>
                <Ionicons name="home-outline" size={20} color={Colors.primary} />
                <Text style={styles.homeButtonText}>Back to App</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Advocate Dashboard</Text>
              <Text style={styles.headerSubtitle}>
                Welcome back, {session?.username?.split('@')[0] || 'Advocate'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Dashboard Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'Total Resources',
              stats.totalResources,
              'Community resources',
              'library',
              GradientPresets.primary
            )}
            {renderStatCard(
              'Pending Reports',
              stats.pendingReports,
              'Need verification',
              'alert-circle',
              GradientPresets.warning
            )}
            {renderStatCard(
              'Verified Resources',
              stats.verifiedResources,
              'Community verified',
              'checkmark-circle',
              GradientPresets.secondary
            )}
            {renderStatCard(
              'Weekly Users',
              stats.weeklyUsers,
              'Active this week',
              'people',
              GradientPresets.accent
            )}
          </View>
        </View>

        {/* Management Tools */}
        <View style={styles.toolsSection}>
          <Text style={styles.sectionTitle}>Management Tools</Text>
          <View style={styles.toolsGrid}>
            {managementTools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={styles.toolCard}
                onPress={tool.action}
              >
                <View style={[styles.toolIcon, { backgroundColor: `${tool.color}20` }]}>
                  <Ionicons name={tool.icon} size={32} color={tool.color} />
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={handleRefresh}>
              <Ionicons name="refresh" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.activityFeed}>
            {recentActivity.map(renderActivityItem)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <SafeButton
              title="Add Resource"
              onPress={() => navigation.navigate('ResourceManagement', { mode: 'add' })}
              variant="primary"
              size="md"
              fullWidth
              icon={<Ionicons name="add" size={20} color={Colors.background} />}
              style={styles.quickActionButton}
            />
            <SafeButton
              title="Emergency Announcement"
              onPress={() => Alert.alert('Coming Soon', 'Emergency announcement feature is being developed.')}
              variant="secondary"
              size="md"
              fullWidth
              icon={<Ionicons name="warning" size={20} color={Colors.background} />}
              style={styles.quickActionButton}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            MigrAid Advocate Dashboard • Serving the community with privacy and dignity
          </Text>
          <Text style={styles.footerVersion}>Version 1.0.0 • Last updated: {new Date().toLocaleDateString()}</Text>
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
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  headerActions: {
    minWidth: 80,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.primaryBackground,
    gap: Spacing.xs,
  },
  homeButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },

  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.base,
  },
  statsSection: {
    padding: Spacing.base,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    width: '48%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
    overflow: 'hidden',
    minHeight: 130,
  },
  statContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 28,
    marginVertical: 8,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  toolsSection: {
    padding: Spacing.base,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  toolCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    alignItems: 'center',
    minHeight: 120,
    ...Shadows.sm,
  },
  toolIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  toolTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  toolDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  activitySection: {
    padding: Spacing.base,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  activityFeed: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  activityDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  activityTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
  },
  quickActionsSection: {
    padding: Spacing.base,
  },
  quickActions: {
    gap: Spacing.sm,
  },
  quickActionButton: {
    marginBottom: Spacing.xs,
  },
  footer: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  footerVersion: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default AdvocateDashboard; 