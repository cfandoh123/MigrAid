// Resource Management for MigrAid Advocates
// Interface for adding, editing, and verifying community resources

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';

import CustomInput from '../../components/common/CustomInput';
import SafeButton from '../../components/common/SafeButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { storageService } from '../../services/storage';
import { mockResources, RESOURCE_CATEGORIES } from '../../data/mockResources';

const ResourceManagement = ({ navigation, route }) => {
  const [language, setLanguage] = useState('en');
  const [currentMode, setCurrentMode] = useState(route?.params?.mode || 'list'); // 'list', 'add', 'edit'
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: '',
      category: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      services: '',
      languages: '',
      requirements: '',
      hours: '',
      verified: false,
      notes: '',
    },
    mode: 'onChange',
  });

  const watchedCategory = watch('category');

  useEffect(() => {
    loadLanguage();
    loadResources();
  }, []);

  useEffect(() => {
    if (currentMode === 'edit' && selectedResource) {
      populateForm(selectedResource);
    } else if (currentMode === 'add') {
      reset();
    }
  }, [currentMode, selectedResource]);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const loadResources = () => {
    // In a real app, this would fetch from API
    setResources(mockResources);
  };

  const populateForm = (resource) => {
    setValue('name', resource.name || '');
    setValue('category', resource.category || '');
    setValue('description', resource.description || '');
    setValue('address', resource.address || '');
    setValue('phone', resource.phone || '');
    setValue('email', resource.email || '');
    setValue('website', resource.website || '');
    setValue('services', Array.isArray(resource.services) ? resource.services.join(', ') : resource.services || '');
    setValue('languages', Array.isArray(resource.languages) ? resource.languages.join(', ') : resource.languages || '');
    setValue('requirements', Array.isArray(resource.requirements) ? resource.requirements.join(', ') : resource.requirements || '');
    setValue('hours', resource.hours || '');
    setValue('verified', resource.verified || false);
    setValue('notes', resource.notes || '');
  };

  const handleSaveResource = async (data) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process form data
      const resourceData = {
        ...data,
        services: data.services.split(',').map(s => s.trim()).filter(s => s),
        languages: data.languages.split(',').map(l => l.trim()).filter(l => l),
        requirements: data.requirements.split(',').map(r => r.trim()).filter(r => r),
        lastUpdated: new Date().toISOString(),
        updatedBy: 'advocate',
      };

      if (currentMode === 'edit') {
        // Update existing resource
        Alert.alert(
          'Resource Updated',
          `${data.name} has been successfully updated in the community resource database.`,
          [
            { text: 'OK', onPress: () => setCurrentMode('list') }
          ]
        );
      } else {
        // Add new resource
        Alert.alert(
          'Resource Added',
          `${data.name} has been successfully added to the community resource database and will be available to users immediately.`,
          [
            { text: 'Add Another', onPress: () => reset() },
            { text: 'Done', onPress: () => setCurrentMode('list') }
          ]
        );
      }

      // Update local state (in real app, refetch from API)
      loadResources();

    } catch (error) {
      Alert.alert(
        'Save Error',
        'There was an error saving the resource. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = (resource) => {
    Alert.alert(
      'Delete Resource',
      `Are you sure you want to delete "${resource.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In real app, this would make API call
            Alert.alert(
              'Resource Deleted',
              `${resource.name} has been removed from the community resource database.`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const handleVerifyResource = (resource) => {
    Alert.alert(
      'Verify Resource',
      `Mark "${resource.name}" as verified? This indicates the information has been confirmed by advocates.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify',
          onPress: () => {
            Alert.alert(
              'Resource Verified',
              `${resource.name} has been marked as verified and will display a verification badge to users.`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const renderResourceListItem = ({ item }) => (
    <View style={styles.resourceItem}>
      <View style={styles.resourceHeader}>
        <View style={styles.resourceInfo}>
          <Text style={styles.resourceName}>{item.name}</Text>
          <Text style={styles.resourceCategory}>{item.category?.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <View style={styles.resourceActions}>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            </View>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setSelectedResource(item);
              setCurrentMode('edit');
            }}
          >
            <Ionicons name="create" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.resourceDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.resourceDetails}>
        <View style={styles.resourceDetail}>
          <Ionicons name="location" size={16} color={Colors.textSecondary} />
          <Text style={styles.resourceDetailText}>{item.address}</Text>
        </View>
        {item.phone && (
          <View style={styles.resourceDetail}>
            <Ionicons name="call" size={16} color={Colors.textSecondary} />
            <Text style={styles.resourceDetailText}>{item.phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.resourceFooter}>
        <Text style={styles.resourceLastUpdated}>
          Updated: {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'Unknown'}
        </Text>
        <View style={styles.resourceActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleVerifyResource(item)}
          >
            <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteResource(item)}
          >
            <Ionicons name="trash" size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCategorySelector = () => (
    <Modal visible={showCategorySelector} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Category</Text>
          <TouchableOpacity onPress={() => setShowCategorySelector(false)}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {Object.entries(RESOURCE_CATEGORIES).map(([key, category]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryOption,
                { backgroundColor: watchedCategory === key ? Colors.primaryBackground : Colors.background }
              ]}
              onPress={() => {
                setValue('category', key);
                setShowCategorySelector(false);
              }}
            >
              <Ionicons 
                name={category.icon} 
                size={24} 
                color={watchedCategory === key ? Colors.primary : Colors.textSecondary} 
              />
              <View style={styles.categoryInfo}>
                <Text style={[
                  styles.categoryName,
                  { color: watchedCategory === key ? Colors.primary : Colors.text }
                ]}>
                  {category.title}
                </Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
              {watchedCategory === key && (
                <Ionicons name="checkmark" size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderListView = () => (
    <View style={styles.listContainer}>
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Community Resources</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCurrentMode('add')}
        >
          <Ionicons name="add" size={24} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.listStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{resources.length}</Text>
          <Text style={styles.statLabel}>Total Resources</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{resources.filter(r => r.verified).length}</Text>
          <Text style={styles.statLabel}>Verified</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{resources.filter(r => !r.verified).length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      <FlatList
        data={resources}
        renderItem={renderResourceListItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resourceList}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={loadResources}
      />
    </View>
  );

  const renderFormView = () => (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentMode('list')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.formTitle}>
          {currentMode === 'edit' ? 'Edit Resource' : 'Add New Resource'}
        </Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Basic Information</Text>
          
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Resource name is required' }}
            render={({ field }) => (
              <CustomInput
                label="Resource Name *"
                placeholder="e.g., Bay Area Legal Aid"
                value={field.value}
                onChangeText={field.onChange}
                leftIcon="library-outline"
                error={errors.name?.message}
              />
            )}
          />

          <TouchableOpacity
            style={styles.categorySelector}
            onPress={() => setShowCategorySelector(true)}
          >
            <Text style={styles.categoryLabel}>Category *</Text>
            <View style={styles.categoryValue}>
              <Text style={[
                styles.categoryText,
                { color: watchedCategory ? Colors.text : Colors.textSecondary }
              ]}>
                {watchedCategory 
                  ? RESOURCE_CATEGORIES[watchedCategory]?.title || 'Select category'
                  : 'Select category'
                }
              </Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <Controller
            control={control}
            name="description"
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <CustomInput
                label="Description *"
                placeholder="Brief description of services offered..."
                value={field.value}
                onChangeText={field.onChange}
                multiline
                numberOfLines={3}
                error={errors.description?.message}
              />
            )}
          />
        </View>

        {/* Contact Information */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Contact Information</Text>
          
          <Controller
            control={control}
            name="address"
            rules={{ required: 'Address is required' }}
            render={({ field }) => (
              <CustomInput
                label="Address *"
                placeholder="123 Main St, City, State 12345"
                value={field.value}
                onChangeText={field.onChange}
                leftIcon="location-outline"
                error={errors.address?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <CustomInput
                label="Phone Number"
                placeholder="(555) 123-4567"
                value={field.value}
                onChangeText={field.onChange}
                leftIcon="call-outline"
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <CustomInput
                label="Email"
                placeholder="contact@organization.org"
                value={field.value}
                onChangeText={field.onChange}
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="website"
            render={({ field }) => (
              <CustomInput
                label="Website"
                placeholder="https://organization.org"
                value={field.value}
                onChangeText={field.onChange}
                leftIcon="globe-outline"
                autoCapitalize="none"
              />
            )}
          />
        </View>

        {/* Service Details */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Service Details</Text>
          
          <Controller
            control={control}
            name="services"
            render={({ field }) => (
              <CustomInput
                label="Services Offered"
                placeholder="Legal aid, housing assistance, food pantry (comma separated)"
                value={field.value}
                onChangeText={field.onChange}
                multiline
                numberOfLines={2}
              />
            )}
          />

          <Controller
            control={control}
            name="languages"
            render={({ field }) => (
              <CustomInput
                label="Languages"
                placeholder="English, Spanish, Mandarin (comma separated)"
                value={field.value}
                onChangeText={field.onChange}
                leftIcon="language-outline"
              />
            )}
          />

          <Controller
            control={control}
            name="requirements"
            render={({ field }) => (
              <CustomInput
                label="Requirements"
                placeholder="ID required, income verification, appointment needed (comma separated)"
                value={field.value}
                onChangeText={field.onChange}
                multiline
                numberOfLines={2}
              />
            )}
          />

          <Controller
            control={control}
            name="hours"
            render={({ field }) => (
              <CustomInput
                label="Hours"
                placeholder="Mon-Fri 9AM-5PM, Sat 10AM-2PM"
                value={field.value}
                onChangeText={field.onChange}
                leftIcon="time-outline"
              />
            )}
          />
        </View>

        {/* Advocate Notes */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Advocate Notes</Text>
          
          <Controller
            control={control}
            name="notes"
            render={({ field }) => (
              <CustomInput
                label="Internal Notes"
                placeholder="Private notes for advocates (not visible to users)"
                value={field.value}
                onChangeText={field.onChange}
                multiline
                numberOfLines={2}
              />
            )}
          />

          <Controller
            control={control}
            name="verified"
            render={({ field }) => (
              <View style={styles.verifiedToggle}>
                <Text style={styles.verifiedLabel}>Mark as Verified</Text>
                <TouchableOpacity
                  style={[
                    styles.toggle,
                    { backgroundColor: field.value ? Colors.success : Colors.border }
                  ]}
                  onPress={() => field.onChange(!field.value)}
                >
                  <View style={[
                    styles.toggleButton,
                    { transform: [{ translateX: field.value ? 20 : 0 }] }
                  ]}>
                    <Ionicons 
                      name={field.value ? "checkmark" : "close"} 
                      size={16} 
                      color={Colors.background} 
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Submit Button */}
        <SafeButton
          title={isSubmitting 
            ? (currentMode === 'edit' ? 'Updating...' : 'Adding...') 
            : (currentMode === 'edit' ? 'Update Resource' : 'Add Resource')
          }
          onPress={handleSubmit(handleSaveResource)}
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          style={styles.submitButton}
          icon={<Ionicons 
            name={currentMode === 'edit' ? "checkmark" : "add"} 
            size={20} 
            color={Colors.background} 
          />}
        />
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {currentMode === 'list' ? renderListView() : renderFormView()}
      {renderCategorySelector()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    gap: Spacing.base,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.base,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  resourceList: {
    padding: Spacing.base,
  },
  resourceItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  resourceCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  resourceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  verifiedBadge: {
    backgroundColor: Colors.successBackground,
    borderRadius: BorderRadius.round,
    padding: Spacing.xs,
  },
  actionButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background,
  },
  resourceDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
  },
  resourceDetails: {
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  resourceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  resourceDetailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  resourceLastUpdated: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
  },
  formContainer: {
    flex: 1,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.base,
  },
  backButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background,
  },
  formTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  form: {
    flex: 1,
    padding: Spacing.base,
  },
  formSection: {
    marginBottom: Spacing.lg,
  },
  formSectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.base,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categorySelector: {
    marginBottom: Spacing.base,
  },
  categoryLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  categoryValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
  },
  categoryText: {
    fontSize: Typography.fontSize.base,
  },
  verifiedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.base,
  },
  verifiedLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
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
  submitButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
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
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.xs,
    gap: Spacing.base,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});

export default ResourceManagement; 