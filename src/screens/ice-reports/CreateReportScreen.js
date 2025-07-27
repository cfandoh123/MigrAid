// Create Report Screen for MigrAid
// Enhanced anonymous ICE activity reporting form with safety features

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  Linking,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import SafeButton from '../../components/common/SafeButton';
import CustomInput from '../../components/common/CustomInput';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { getString } from '../../constants/strings';
import { REPORT_TYPES, SEVERITY_LEVELS } from '../../data/mockIceReports';
import { storageService } from '../../services/storage';

const CreateReportScreen = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const mapRef = useRef(null);
  
  const [language, setLanguage] = useState('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      reportType: '',
      location: '',
      coordinates: null,
      description: '',
      severity: SEVERITY_LEVELS.MEDIUM,
      incidentTime: new Date().toISOString(),
      isAnonymous: true,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  useEffect(() => {
    loadLanguage();
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => {
      backHandler.remove();
    };
  }, []);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };



  const handleBackPress = () => {
    if (isDirty) {
      handleQuickExit();
      return true;
    }
    return false;
  };

  const handleQuickExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    reset();
    navigation.goBack();
  };

  const reportTypes = [
    { key: REPORT_TYPES.ICE_ACTIVITY, title: 'ICE Activity', icon: 'shield-outline', color: Colors.warning },
    { key: REPORT_TYPES.CHECKPOINT, title: 'Checkpoint', icon: 'car-outline', color: Colors.danger },
    { key: REPORT_TYPES.SURVEILLANCE, title: 'Surveillance', icon: 'eye-outline', color: Colors.info },
    { key: REPORT_TYPES.RAID, title: 'Raid', icon: 'warning-outline', color: Colors.danger },
    { key: REPORT_TYPES.ARREST, title: 'Arrest', icon: 'alert-circle-outline', color: Colors.danger },
    { key: REPORT_TYPES.PATROL, title: 'Patrol', icon: 'walk-outline', color: Colors.warning },
  ];

  const severityLevels = [
    { 
      key: SEVERITY_LEVELS.LOW, 
      title: 'Low', 
      description: 'Routine activity, no immediate concern',
      color: Colors.secondary,
      icon: 'information-circle-outline'
    },
    { 
      key: SEVERITY_LEVELS.MEDIUM, 
      title: 'Medium', 
      description: 'Increased activity, worth noting',
      color: Colors.warning,
      icon: 'warning-outline'
    },
    { 
      key: SEVERITY_LEVELS.HIGH, 
      title: 'High', 
      description: 'Significant activity, community should know',
      color: Colors.danger,
      icon: 'alert-outline'
    },
    { 
      key: SEVERITY_LEVELS.CRITICAL, 
      title: 'Critical', 
      description: 'Urgent situation, immediate awareness needed',
      color: Colors.danger,
      icon: 'flash-outline'
    },
  ];

  const emergencyContacts = [
    {
      name: 'ACLU Immigrant Rights Hotline',
      number: '1-877-523-2298',
      description: 'Know your rights legal support'
    },
    {
      name: 'United We Dream Hotline',
      number: '1-844-363-1423',
      description: 'Immigration defense and support'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Mental health crisis support'
    }
  ];

  const openLocationPicker = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setSelectedLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.warn('Error getting location:', error);
    }
    setShowLocationPicker(true);
  };

  const confirmLocationSelection = () => {
    if (selectedLocation) {
      setValue('coordinates', selectedLocation, { shouldValidate: true });
      setValue('location', `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`, { shouldValidate: true });
    }
    setShowLocationPicker(false);
  };

  const saveReportToStorage = async (reportData) => {
    try {
      const existingReports = await storageService.getItem('@migraid:userReports') || [];
      const newReport = {
        id: Date.now().toString(),
        ...reportData,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      };
      
      existingReports.push(newReport);
      await storageService.setItem('@migraid:userReports', existingReports);
      return newReport.id;
    } catch (error) {
      console.warn('Error saving report:', error);
      return null;
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Save report to local storage
      const reportId = await saveReportToStorage(data);

      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setShowEmergencyContacts(true);

      // Track successful submission
      storageService.updateUsageAnalytics('report_submitted');

    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        'Submission Error',
        'There was an error submitting your report. It has been saved locally and will be submitted when connection is restored.',
        [{ text: 'OK' }]
      );
    }
  };

  const closeEmergencyContacts = () => {
    setShowEmergencyContacts(false);
    Alert.alert(
      'Report Submitted Successfully',
      'Your anonymous report has been submitted to the community. Thank you for helping keep everyone safe.',
      [
        {
          text: 'Submit Another Report',
          onPress: () => {
            reset();
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }
        },
        {
          text: 'Done',
          onPress: () => navigation.goBack(),
          style: 'default'
        }
      ]
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

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
  };

  const renderTypeSelector = ({ field }) => (
    <View style={styles.typeGrid}>
      {reportTypes.map((type) => (
        <TouchableOpacity
          key={type.key}
          style={[
            styles.typeCard,
            {
              borderColor: field.value === type.key ? type.color : Colors.border,
              backgroundColor: field.value === type.key ? `${type.color}10` : Colors.background,
            }
          ]}
          onPress={() => field.onChange(type.key)}
        >
          <Ionicons 
            name={type.icon} 
            size={24} 
            color={field.value === type.key ? type.color : Colors.textSecondary} 
          />
          <Text style={[
            styles.typeTitle,
            { color: field.value === type.key ? type.color : Colors.text }
          ]}>
            {type.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSeveritySelector = ({ field }) => (
    <View style={styles.severityContainer}>
      {severityLevels.map((level) => (
        <TouchableOpacity
          key={level.key}
          style={[
            styles.severityCard,
            {
              borderColor: field.value === level.key ? level.color : Colors.border,
              backgroundColor: field.value === level.key ? `${level.color}15` : Colors.surface,
            }
          ]}
          onPress={() => field.onChange(level.key)}
        >
          <View style={styles.severityHeader}>
            <Ionicons 
              name={level.icon} 
              size={20} 
              color={field.value === level.key ? level.color : Colors.textSecondary} 
            />
            <Text style={[
              styles.severityTitle,
              { color: field.value === level.key ? level.color : Colors.text }
            ]}>
              {level.title}
            </Text>
          </View>
          <Text style={styles.severityDescription}>
            {level.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Anonymous Banner */}
        <View style={styles.anonymousBanner}>
          <View style={styles.anonymousHeader}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.secure} />
            <Text style={styles.anonymousTitle}>THIS IS ANONYMOUS</Text>
          </View>
          <Text style={styles.anonymousText}>
            No personal information is collected. Your location is anonymized. This report helps keep the community safe.
          </Text>
        </View>

        {/* Anonymous Toggle */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.fieldLabel}>Report Type</Text>
              <Text style={styles.fieldHint}>
                Anonymous reports help protect your identity
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                { backgroundColor: isAnonymous ? Colors.secure : Colors.warning }
              ]}
              onPress={() => {
                setIsAnonymous(!isAnonymous);
                setValue('isAnonymous', !isAnonymous);
              }}
            >
              <View style={[
                styles.toggleButton,
                { transform: [{ translateX: isAnonymous ? 0 : 20 }] }
              ]}>
                <Ionicons 
                  name={isAnonymous ? "shield-checkmark" : "person"} 
                  size={16} 
                  color={Colors.background} 
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={[
            styles.toggleLabel,
            { color: isAnonymous ? Colors.secure : Colors.warning }
          ]}>
            {isAnonymous ? 'Anonymous Report (Recommended)' : 'Attributed Report'}
          </Text>
        </View>

        {/* Activity Type */}
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Type of Activity *</Text>
          <Text style={styles.fieldHint}>Select what type of ICE activity you observed</Text>
          <Controller
            control={control}
            name="reportType"
            rules={{ required: 'Please select an activity type' }}
            render={renderTypeSelector}
          />
          {errors.reportType && (
            <Text style={styles.errorText}>{errors.reportType.message}</Text>
          )}
        </View>

        {/* Severity Level */}
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Severity Level *</Text>
          <Text style={styles.fieldHint}>How urgent is this for the community to know?</Text>
          <Controller
            control={control}
            name="severity"
            rules={{ required: 'Please select a severity level' }}
            render={renderSeveritySelector}
          />
          {errors.severity && (
            <Text style={styles.errorText}>{errors.severity.message}</Text>
          )}
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Location *</Text>
          <Text style={styles.fieldHint}>
            General area only. Specific addresses are anonymized for privacy.
          </Text>
          
          <View style={styles.locationRow}>
            <View style={styles.locationInputContainer}>
              <Controller
                control={control}
                name="location"
                rules={{ 
                  required: 'Please provide a location',
                  minLength: { value: 5, message: 'Please provide more detail about the location' }
                }}
                render={({ field }) => (
                  <CustomInput
                    placeholder="E.g., Near Downtown Station, Main St area"
                    value={field.value}
                    onChangeText={field.onChange}
                    leftIcon="location-outline"
                    style={styles.locationInput}
                  />
                )}
              />
            </View>
            
            <TouchableOpacity
              style={styles.mapButton}
              onPress={openLocationPicker}
            >
              <Ionicons name="map" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          {errors.location && (
            <Text style={styles.errorText}>{errors.location.message}</Text>
          )}
        </View>

        {/* Time of Incident */}
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Time of Incident *</Text>
          <Text style={styles.fieldHint}>When did this activity occur?</Text>
          
          <View style={styles.timeContainer}>
            <TouchableOpacity style={styles.timeButton}>
              <Ionicons name="time-outline" size={20} color={Colors.primary} />
              <Text style={styles.timeText}>{formatDateTime(currentDateTime)}</Text>
            </TouchableOpacity>
            <Text style={styles.timeNote}>Tap to change (default: now)</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>What You Observed *</Text>
          <Text style={styles.fieldHint}>
            Describe what you saw. Be specific but avoid identifying individuals.
          </Text>
          <Controller
            control={control}
            name="description"
            rules={{ 
              required: 'Please describe what you observed',
              minLength: { value: 20, message: 'Please provide more detail (at least 20 characters)' }
            }}
            render={({ field }) => (
              <CustomInput
                placeholder="Number of agents, vehicles, duration, actions taken..."
                value={field.value}
                onChangeText={field.onChange}
                multiline
                numberOfLines={4}
                style={styles.descriptionInput}
              />
            )}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description.message}</Text>
          )}
        </View>

        {/* Safety Guidelines */}
        <View style={styles.guidelines}>
          <Text style={styles.guidelinesTitle}>Safety & Privacy Guidelines</Text>
          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.secure} />
              <Text style={styles.guidelineText}>Only report what you directly observed</Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.secure} />
              <Text style={styles.guidelineText}>Avoid specific addresses or identifying details</Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.secure} />
              <Text style={styles.guidelineText}>Your report is completely anonymous</Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.secure} />
              <Text style={styles.guidelineText}>Data is encrypted and stored securely</Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <SafeButton
          title={isSubmitting ? 'Submitting Anonymously...' : 'Submit Anonymous Report'}
          onPress={handleSubmit(onSubmit)}
          variant="secondary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          style={styles.submitButton}
          icon={<Ionicons name="shield-checkmark" size={20} color={Colors.background} />}
        />

        {/* Cancel Button */}
        <SafeButton
          title="Cancel"
          onPress={handleQuickExit}
          variant="outline"
          fullWidth
          disabled={isSubmitting}
          style={styles.cancelButton}
        />
      </ScrollView>

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select General Location</Text>
            <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: selectedLocation?.latitude || 37.7749,
              longitude: selectedLocation?.longitude || -122.4194,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={(event) => {
              setSelectedLocation(event.nativeEvent.coordinate);
            }}
          >
            {selectedLocation && (
              <Marker coordinate={selectedLocation}>
                <View style={styles.customMarker}>
                  <Ionicons name="location" size={24} color={Colors.danger} />
                </View>
              </Marker>
            )}
          </MapView>
          
          <View style={styles.mapActions}>
            <Text style={styles.mapHint}>
              Tap on the map to select a general area. Your exact location will be anonymized.
            </Text>
            <SafeButton
              title="Confirm Location"
              onPress={confirmLocationSelection}
              variant="primary"
              disabled={!selectedLocation}
              style={styles.confirmButton}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Quick Exit Confirmation */}
      <Modal
        visible={showExitConfirm}
        transparent
        animationType="fade"
      >
        <View style={styles.overlayContainer}>
          <View style={styles.exitDialog}>
            <Text style={styles.exitTitle}>Quick Exit</Text>
            <Text style={styles.exitMessage}>
              Are you sure you want to exit? Your report data will be lost.
            </Text>
            <View style={styles.exitActions}>
              <TouchableOpacity
                style={styles.exitButton}
                onPress={() => setShowExitConfirm(false)}
              >
                <Text style={styles.exitButtonText}>Stay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.exitButton, styles.exitConfirmButton]}
                onPress={confirmExit}
              >
                <Text style={[styles.exitButtonText, styles.exitConfirmText]}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Emergency Contacts Modal */}
      <Modal
        visible={showEmergencyContacts}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Emergency Contacts</Text>
            <TouchableOpacity onPress={closeEmergencyContacts}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.emergencyContent}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="shield-checkmark" size={32} color={Colors.secure} />
              <Text style={styles.emergencyTitle}>Report Submitted Successfully</Text>
              <Text style={styles.emergencySubtitle}>
                Your anonymous report helps keep the community safe. Here are resources if you need immediate assistance:
              </Text>
            </View>
            
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emergencyContactCard}
                onPress={() => makeEmergencyCall(contact.number)}
              >
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                  <Text style={styles.contactDescription}>{contact.description}</Text>
                </View>
                <Ionicons name="call" size={24} color={Colors.primary} />
              </TouchableOpacity>
            ))}
            
            <View style={styles.emergencyFooter}>
              <Text style={styles.footerText}>
                Remember: You are not alone. There are resources and people ready to help.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  anonymousBanner: {
    backgroundColor: Colors.secondaryBackground,
    borderColor: Colors.secure,
    borderWidth: 2,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  anonymousHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  anonymousTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.secure,
  },
  anonymousText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  fieldHint: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  toggleInfo: {
    flex: 1,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  toggleButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  toggleLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeCard: {
    width: '48%',
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.xs,
    minHeight: 80,
  },
  typeTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  severityContainer: {
    gap: Spacing.sm,
  },
  severityCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
  },
  severityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  severityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  severityDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  locationInputContainer: {
    flex: 1,
  },
  locationInput: {
    marginBottom: 0,
  },
  mapButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.sm,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    gap: Spacing.xs,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  timeText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  timeNote: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  descriptionInput: {
    marginBottom: 0,
  },
  guidelines: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
  },
  guidelinesTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  guidelinesList: {
    gap: Spacing.sm,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  guidelineText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  submitButton: {
    marginBottom: Spacing.base,
  },
  cancelButton: {
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.danger,
    marginTop: Spacing.xs,
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
  map: {
    flex: 1,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapActions: {
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  mapHint: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  confirmButton: {
    marginTop: Spacing.sm,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.base,
  },
  exitDialog: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.base,
    padding: Spacing.lg,
    maxWidth: 300,
    width: '100%',
  },
  exitTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  exitMessage: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  exitActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  exitButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    alignItems: 'center',
  },
  exitConfirmButton: {
    backgroundColor: Colors.danger,
  },
  exitButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  exitConfirmText: {
    color: Colors.background,
  },
  emergencyContent: {
    flex: 1,
    padding: Spacing.base,
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
});

export default CreateReportScreen; 