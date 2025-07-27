// Report Detail Screen for MigrAid
// Detailed view of ICE activity reports with community notes

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { getString } from '../../constants/strings';
import { storageService } from '../../services/storage';

const ReportDetailScreen = ({ route }) => {
  const { report } = route.params;
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return Colors.warning;
      case 'resolved':
        return Colors.success;
      case 'unverified':
        return Colors.textLight;
      default:
        return Colors.textSecondary;
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Report Header */}
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(report.status) }]} />
            <Text style={styles.reportType}>
              {report.type.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
              {report.status.toUpperCase()}
            </Text>
            {report.isActive && (
              <Text style={styles.activeIndicator}>🔴 ACTIVE</Text>
            )}
          </View>
        </View>

        {/* Report Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Details</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Reported Time</Text>
              <Text style={styles.detailValue}>{formatDateTime(report.timestamp)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{report.location.address}</Text>
              {report.location.approximate && (
                <Text style={styles.approximateNote}>
                  📍 Location is approximate for privacy
                </Text>
              )}
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="people" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Community Verifications</Text>
              <Text style={styles.detailValue}>
                {report.verificationCount} verification{report.verificationCount !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{report.description}</Text>
        </View>

        {/* Tags */}
        {report.tags && report.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {report.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Community Notes */}
        {report.communityNotes && report.communityNotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community Updates</Text>
            {report.communityNotes.map((note, index) => (
              <View key={note.id} style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteTime}>
                    {formatDateTime(note.timestamp)}
                  </Text>
                  <Text style={styles.noteAuthor}>Anonymous</Text>
                </View>
                <Text style={styles.noteContent}>{note.content}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Resolution Info */}
        {!report.isActive && report.resolvedAt && (
          <View style={styles.section}>
            <View style={styles.resolvedContainer}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <View style={styles.resolvedContent}>
                <Text style={styles.resolvedTitle}>Activity Resolved</Text>
                <Text style={styles.resolvedTime}>
                  Resolved at: {formatDateTime(report.resolvedAt)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Safety Notice */}
        <View style={styles.safetyNotice}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.secure} />
          <Text style={styles.safetyText}>
            This report was submitted anonymously. Location data has been anonymized for community safety.
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  reportType: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  activeIndicator: {
    fontSize: Typography.fontSize.xs,
    color: Colors.warning,
    marginTop: 2,
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
  detailRow: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
  },
  detailContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  approximateNote: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
  },
  tagText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
  },
  noteCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.sm,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  noteTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  noteAuthor: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  noteContent: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  resolvedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  resolvedContent: {
    marginLeft: Spacing.sm,
  },
  resolvedTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },
  resolvedTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  safetyNotice: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginTop: Spacing.lg,
  },
  safetyText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
});

export default ReportDetailScreen; 