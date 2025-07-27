// ICE Reports Screen for MigrAid
// Enhanced anonymous community safety reporting system with map view

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

import SafeButton from '../../components/common/SafeButton';
import CustomInput from '../../components/common/CustomInput';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { getString } from '../../constants/strings';
import { 
  mockIceReports, 
  getActiveReports, 
  getRecentReports, 
  getReportsBySeverity,
  getCriticalReports,
  SEVERITY_LEVELS,
  REPORT_TYPES
} from '../../data/mockIceReports';
import { storageService } from '../../services/storage';

const TIME_FILTERS = {
  ALL: 'all',
  TODAY: 'today',
  LAST_24H: 'last_24h',
  LAST_7D: 'last_7d',
  LAST_30D: 'last_30d'
};

const VIEW_MODES = {
  LIST: 'list',
  MAP: 'map'
};

const IceReportsScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const [language, setLanguage] = useState('en');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [viewMode, setViewMode] = useState(VIEW_MODES.LIST);
  
  // Filter states
  const [timeFilter, setTimeFilter] = useState(TIME_FILTERS.LAST_7D);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showSafetyResources, setShowSafetyResources] = useState(false);
  
  // Map states
  const [userLocation, setUserLocation] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Stats
  const [reportStats, setReportStats] = useState({
    total: 0,
    critical: 0,
    last24h: 0,
    verified: 0
  });

  const emergencyContacts = [
    {
      name: 'ACLU Immigrant Rights Hotline',
      number: '1-877-523-2298',
      description: 'Know your rights legal support',
      icon: 'shield-outline'
    },
    {
      name: 'United We Dream Hotline',
      number: '1-844-363-1423',
      description: 'Immigration defense and support',
      icon: 'people-outline'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Mental health crisis support',
      icon: 'chatbubble-outline'
    },
    {
      name: 'Local Legal Aid',
      number: '1-888-534-2561',
      description: 'Free legal assistance',
      icon: 'library-outline'
    }
  ];

  useEffect(() => {
    loadLanguage();
    loadReports();
    getUserLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, timeFilter, severityFilter]);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const loadReports = () => {
    try {
      setReports(mockIceReports.filter(report => report && report.id));
      updateStats();
    } catch (error) {
      console.warn('Error loading reports:', error);
      setReports([]);
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setMapRegion({
          ...mapRegion,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.warn('Error getting location:', error);
    }
  };

  const updateStats = () => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const stats = {
      total: mockIceReports.length,
      critical: getCriticalReports().length,
      last24h: mockIceReports.filter(r => r && new Date(r.timestamp) > last24h).length,
      verified: mockIceReports.filter(r => r && r.verificationCount > 2).length
    };
    
    setReportStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...reports];

    // Time filter
    const now = new Date();
    switch (timeFilter) {
      case TIME_FILTERS.TODAY:
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filtered = filtered.filter(r => new Date(r.timestamp) >= today);
        break;
      case TIME_FILTERS.LAST_24H:
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        filtered = filtered.filter(r => new Date(r.timestamp) >= last24h);
        break;
      case TIME_FILTERS.LAST_7D:
        const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(r => new Date(r.timestamp) >= last7d);
        break;
      case TIME_FILTERS.LAST_30D:
        const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(r => new Date(r.timestamp) >= last30d);
        break;
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(r => r.severity === severityFilter);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredReports(filtered);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case SEVERITY_LEVELS.CRITICAL:
        return Colors.danger;
      case SEVERITY_LEVELS.HIGH:
        return Colors.danger;
      case SEVERITY_LEVELS.MEDIUM:
        return Colors.warning;
      case SEVERITY_LEVELS.LOW:
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case SEVERITY_LEVELS.CRITICAL:
        return 'flash';
      case SEVERITY_LEVELS.HIGH:
        return 'alert';
      case SEVERITY_LEVELS.MEDIUM:
        return 'warning';
      case SEVERITY_LEVELS.LOW:
        return 'information-circle';
      default:
        return 'help-circle';
    }
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
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return time.toLocaleDateString();
  };

  const getGeneralLocation = (address) => {
    // Convert specific address to general area for privacy
    if (!address) return 'Location not specified';
    
    const parts = address.split(',');
    if (parts.length >= 2) {
      // Return neighborhood/area and city only
      return `${parts[0].trim()}, ${parts[1].trim()}`;
    }
    return address;
  };

  const handleReportPress = (report) => {
    navigation.navigate('ReportDetail', { report });
  };

  const handleCreateReport = () => {
    navigation.navigate('CreateReport');
  };

  const handleVerifyReport = async (reportId) => {
    // In a real app, this would make an API call
    Alert.alert(
      'Thank You',
      'Your verification helps keep the community informed. This report has been marked as verified.',
      [{ text: 'OK' }]
    );
  };

  const makeEmergencyCall = (number) => {
    if (number.includes('741741') || number.includes('Text HOME')) {
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
        'Emergency Call',
        `Calling ${number}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => Linking.openURL(`tel:${number}`) }
        ]
      );
    }
  };

  const renderMapMarker = (report) => {
    const color = getSeverityColor(report.severity);
    return (
      <Marker
        key={report.id}
        coordinate={{
          latitude: report.location.coordinates.latitude,
          longitude: report.location.coordinates.longitude,
        }}
        onPress={() => setSelectedReport(report)}
      >
        <View style={[styles.mapMarker, { backgroundColor: color }]}>
          <Ionicons 
            name={getSeverityIcon(report.severity)} 
            size={16} 
            color={Colors.background} 
          />
        </View>
        {report.severity === SEVERITY_LEVELS.CRITICAL && (
          <Circle
            center={{
              latitude: report.location.coordinates.latitude,
              longitude: report.location.coordinates.longitude,
            }}
            radius={500}
            fillColor={`${color}20`}
            strokeColor={color}
            strokeWidth={2}
          />
        )}
      </Marker>
    );
  };

  const renderReportItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.reportCard, { borderLeftColor: getSeverityColor(item.severity) }]}
      onPress={() => handleReportPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`ICE report: ${item.type}, ${item.severity} severity`}
    >
      <View style={styles.reportHeader}>
        <View style={styles.reportTypeContainer}>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
            <Ionicons 
              name={getSeverityIcon(item.severity)} 
              size={12} 
              color={Colors.background} 
            />
            <Text style={styles.severityText}>
              {item.severity?.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.reportType}>
            {item.type?.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.reportTime}>{getRelativeTime(item.timestamp)}</Text>
      </View>

      <Text style={styles.reportLocation}>
        📍 {getGeneralLocation(item.location?.address)}
      </Text>

      <Text style={styles.reportDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.reportFooter}>
        <View style={styles.verificationContainer}>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => handleVerifyReport(item.id)}
            accessibilityRole="button"
            accessibilityLabel="Verify this report"
          >
            <Ionicons name="checkmark-circle-outline" size={16} color={Colors.primary} />
            <Text style={styles.verificationText}>
              {item.verificationCount || 0} verified
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.anonymousLabel}>Anonymous Report</Text>
      </View>
    </TouchableOpacity>
  );

  const renderStatsCard = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Community Reports (Last 7 Days)</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{reportStats.total}</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: Colors.danger }]}>{reportStats.critical}</Text>
          <Text style={styles.statLabel}>Critical</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: Colors.warning }]}>{reportStats.last24h}</Text>
          <Text style={styles.statLabel}>Last 24h</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: Colors.success }]}>{reportStats.verified}</Text>
          <Text style={styles.statLabel}>Verified</Text>
        </View>
      </View>
    </View>
  );

  const renderTimeFilter = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
      {Object.entries(TIME_FILTERS).map(([key, value]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.filterChip,
            { backgroundColor: timeFilter === value ? Colors.primary : Colors.surface }
          ]}
          onPress={() => setTimeFilter(value)}
        >
          <Text style={[
            styles.filterChipText,
            { color: timeFilter === value ? Colors.background : Colors.text }
          ]}>
            {key.replace('_', ' ')}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSeverityFilter = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
      <TouchableOpacity
        style={[
          styles.filterChip,
          { backgroundColor: severityFilter === 'all' ? Colors.primary : Colors.surface }
        ]}
        onPress={() => setSeverityFilter('all')}
      >
        <Text style={[
          styles.filterChipText,
          { color: severityFilter === 'all' ? Colors.background : Colors.text }
        ]}>
          ALL
        </Text>
      </TouchableOpacity>
      
      {Object.values(SEVERITY_LEVELS).map((severity) => (
        <TouchableOpacity
          key={severity}
          style={[
            styles.filterChip,
            styles.severityFilterChip,
            { 
              backgroundColor: severityFilter === severity ? getSeverityColor(severity) : Colors.surface,
              borderColor: getSeverityColor(severity)
            }
          ]}
          onPress={() => setSeverityFilter(severity)}
        >
          <Ionicons 
            name={getSeverityIcon(severity)} 
            size={14} 
            color={severityFilter === severity ? Colors.background : getSeverityColor(severity)} 
          />
          <Text style={[
            styles.filterChipText,
            { color: severityFilter === severity ? Colors.background : getSeverityColor(severity) }
          ]}>
            {severity.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with View Toggle and Filters */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.viewButton,
                { backgroundColor: viewMode === VIEW_MODES.LIST ? Colors.primary : Colors.surface }
              ]}
              onPress={() => setViewMode(VIEW_MODES.LIST)}
            >
              <Ionicons 
                name="list" 
                size={20} 
                color={viewMode === VIEW_MODES.LIST ? Colors.background : Colors.text} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewButton,
                { backgroundColor: viewMode === VIEW_MODES.MAP ? Colors.primary : Colors.surface }
              ]}
              onPress={() => setViewMode(VIEW_MODES.MAP)}
            >
              <Ionicons 
                name="map" 
                size={20} 
                color={viewMode === VIEW_MODES.MAP ? Colors.background : Colors.text} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.safetyButton}
            onPress={() => setShowSafetyResources(true)}
          >
            <Ionicons name="shield-checkmark" size={20} color={Colors.secure} />
            <Text style={styles.safetyButtonText}>Safety Resources</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Time Range:</Text>
          {renderTimeFilter()}
          <Text style={styles.filterLabel}>Severity:</Text>
          {renderSeverityFilter()}
        </View>

        {/* Stats */}
        {renderStatsCard()}

        {/* Create Report Button */}
        <SafeButton
          title="+ Report ICE Activity"
          onPress={handleCreateReport}
          variant="secondary"
          size="md"
          fullWidth
          style={styles.createButton}
          icon={<Ionicons name="add-circle" size={20} color={Colors.background} />}
        />
      </View>

      {/* Content */}
      {viewMode === VIEW_MODES.MAP ? (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
            showsUserLocation={!!userLocation}
            showsMyLocationButton={false}
          >
            {filteredReports
              .filter(report => report.location?.coordinates)
              .map(renderMapMarker)
            }
          </MapView>

          {/* Selected Report Card */}
          {selectedReport && (
            <View style={styles.selectedReportCard}>
              <View style={styles.selectedReportHeader}>
                <View style={styles.selectedReportInfo}>
                  <Text style={styles.selectedReportType}>
                    {selectedReport.type?.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.selectedReportTime}>
                    {getRelativeTime(selectedReport.timestamp)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedReport(null)}>
                  <Ionicons name="close" size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.selectedReportLocation}>
                📍 {getGeneralLocation(selectedReport.location?.address)}
              </Text>
              <Text style={styles.selectedReportDescription} numberOfLines={2}>
                {selectedReport.description}
              </Text>
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => handleReportPress(selectedReport)}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Map Controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity
              style={styles.mapControlButton}
              onPress={() => {
                if (userLocation) {
                  setMapRegion({
                    ...mapRegion,
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  });
                }
              }}
            >
              <Ionicons name="locate" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.reportsList}
          showsVerticalScrollIndicator={false}
          refreshing={false}
          onRefresh={loadReports}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="shield-checkmark-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyStateTitle}>No Reports Found</Text>
              <Text style={styles.emptyStateText}>
                {timeFilter !== TIME_FILTERS.ALL || severityFilter !== 'all'
                  ? 'Try adjusting your filters to see more reports'
                  : 'No ICE activity reports for this time period'
                }
              </Text>
            </View>
          }
        />
      )}

      {/* Safety Resources Modal */}
      <Modal
        visible={showSafetyResources}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Safety Resources</Text>
            <TouchableOpacity onPress={() => setShowSafetyResources(false)}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.safetyContent}>
            <View style={styles.safetyHeader}>
              <Ionicons name="shield-checkmark" size={32} color={Colors.secure} />
              <Text style={styles.safetyTitle}>Emergency Contacts & Resources</Text>
              <Text style={styles.safetySubtitle}>
                Available 24/7 for immediate assistance and legal support
              </Text>
            </View>
            
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emergencyContactCard}
                onPress={() => makeEmergencyCall(contact.number)}
              >
                <View style={styles.contactIconContainer}>
                  <Ionicons name={contact.icon} size={24} color={Colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                  <Text style={styles.contactDescription}>{contact.description}</Text>
                </View>
                <Ionicons name="call" size={20} color={Colors.primary} />
              </TouchableOpacity>
            ))}
            
            <View style={styles.safetyFooter}>
              <Text style={styles.footerText}>
                Remember: You have rights. You are not alone. Help is available.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Always Visible Safety Notice */}
      <View style={styles.safetyNotice}>
        <Ionicons name="shield-checkmark" size={16} color={Colors.secure} />
        <Text style={styles.safetyText}>
          All reports are anonymous • Data is encrypted • {filteredReports.length} reports shown
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.base,
    padding: 2,
  },
  viewButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  safetyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
    gap: Spacing.xs,
  },
  safetyButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.secure,
    fontWeight: Typography.fontWeight.medium,
  },
  filtersContainer: {
    marginBottom: Spacing.sm,
  },
  filterLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  filterScroll: {
    marginBottom: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
    marginRight: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  severityFilterChip: {
    flexDirection: 'row',
    gap: Spacing.xs,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  statsContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  createButton: {
    marginBottom: Spacing.base,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
    ...Shadows.md,
  },
  selectedReportCard: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    right: Spacing.base,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    ...Shadows.lg,
  },
  selectedReportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  selectedReportInfo: {
    flex: 1,
  },
  selectedReportType: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  selectedReportTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  selectedReportLocation: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  selectedReportDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.base,
    gap: Spacing.xs,
  },
  viewDetailsText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
  mapControls: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
  },
  mapControlButton: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.round,
    padding: Spacing.sm,
    ...Shadows.md,
  },
  reportsList: {
    padding: Spacing.base,
  },
  reportCard: {
    backgroundColor: Colors.background,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    ...Shadows.sm,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  reportTypeContainer: {
    flex: 1,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  severityText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.background,
    fontWeight: Typography.fontWeight.bold,
  },
  reportType: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  reportTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  reportLocation: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  reportDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
    marginBottom: Spacing.sm,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verificationContainer: {
    flex: 1,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  verificationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  anonymousLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.secure,
    fontWeight: Typography.fontWeight.medium,
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.base,
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
    marginTop: Spacing.base,
    marginBottom: Spacing.xs,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
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
  safetyContent: {
    flex: 1,
    padding: Spacing.base,
  },
  safetyHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  safetyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  safetySubtitle: {
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
  },
  safetyFooter: {
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
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  safetyText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    flex: 1,
  },
});

export default IceReportsScreen; 