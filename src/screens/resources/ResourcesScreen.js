// Resources Screen for MigrAid
// Browse and search immigrant resources by category

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SafeButton from '../../components/common/SafeButton';
import CustomInput from '../../components/common/CustomInput';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { getString } from '../../constants/strings';
import { mockResources, RESOURCE_CATEGORIES, getResourcesByCategory, searchResources } from '../../data/mockResources';
import { storageService } from '../../services/storage';

const SORT_OPTIONS = {
  NAME: 'name',
  DISTANCE: 'distance',
  UPDATED: 'updated',
  RATING: 'rating',
  CATEGORY: 'category'
};

const ResourcesScreen = ({ navigation, route }) => {
  const [language, setLanguage] = useState('en');
  const [allResources, setAllResources] = useState(mockResources);
  const [displayedResources, setDisplayedResources] = useState(mockResources);
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || null);
  const [searchQuery, setSearchQuery] = useState(route.params?.searchQuery || '');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NAME);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [savedResources, setSavedResources] = useState(new Set());

  useEffect(() => {
    loadLanguage();
    loadSavedResources();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [selectedCategory, searchQuery, sortBy, allResources]);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const loadSavedResources = async () => {
    try {
      const saved = await storageService.getItem('@migraid:savedResources') || [];
      setSavedResources(new Set(saved));
    } catch (error) {
      console.warn('Error loading saved resources:', error);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = allResources;

    // Apply category filter
    if (selectedCategory) {
      filtered = getResourcesByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchResources(searchQuery.trim()).filter(resource => 
        selectedCategory ? resource.category === selectedCategory : true
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.NAME:
          return (a.name || '').localeCompare(b.name || '');
        case SORT_OPTIONS.UPDATED:
          return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
        case SORT_OPTIONS.CATEGORY:
          return (a.category || '').localeCompare(b.category || '');
        case SORT_OPTIONS.RATING:
          // Mock rating based on verification and other factors
          const getRating = (resource) => {
            let rating = 3.0;
            if (resource.verified) rating += 1.0;
            if (resource.emergencyContact) rating += 0.5;
            if (resource.services && resource.services.length > 3) rating += 0.3;
            return rating;
          };
          return getRating(b) - getRating(a);
        case SORT_OPTIONS.DISTANCE:
          // Mock distance sorting (in a real app, would use user location)
          return Math.random() - 0.5; // Random for now
        default:
          return 0;
      }
    });

    setDisplayedResources(sorted);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    storageService.updateUsageAnalytics('resource_search');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const toggleSaveResource = async (resourceId) => {
    const newSaved = new Set(savedResources);
    if (newSaved.has(resourceId)) {
      newSaved.delete(resourceId);
    } else {
      newSaved.add(resourceId);
    }
    setSavedResources(newSaved);
    
    try {
      await storageService.setItem('@migraid:savedResources', Array.from(newSaved));
    } catch (error) {
      console.warn('Error saving resource:', error);
    }
  };

  const getSortDisplayName = (sortOption) => {
    switch (sortOption) {
      case SORT_OPTIONS.NAME: return 'Name';
      case SORT_OPTIONS.DISTANCE: return 'Distance';
      case SORT_OPTIONS.UPDATED: return 'Recently Updated';
      case SORT_OPTIONS.RATING: return 'Rating';
      case SORT_OPTIONS.CATEGORY: return 'Category';
      default: return 'Name';
    }
  };

  const getMockRating = (resource) => {
    let rating = 3.0;
    if (resource.verified) rating += 1.0;
    if (resource.emergencyContact) rating += 0.5;
    if (resource.services && resource.services.length > 3) rating += 0.3;
    return Math.min(5.0, rating);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const categories = [
    { key: null, title: 'All', icon: 'apps-outline' },
    { key: RESOURCE_CATEGORIES.LEGAL, title: getString('legal', language), icon: 'scale-outline' },
    { key: RESOURCE_CATEGORIES.HEALTHCARE, title: getString('healthcare', language), icon: 'medical-outline' },
    { key: RESOURCE_CATEGORIES.FOOD, title: getString('food', language), icon: 'restaurant-outline' },
    { key: RESOURCE_CATEGORIES.SHELTER, title: getString('shelter', language), icon: 'home-outline' },
  ];

  const sortOptions = [
    { key: SORT_OPTIONS.NAME, title: 'Name', icon: 'text-outline' },
    { key: SORT_OPTIONS.DISTANCE, title: 'Distance', icon: 'location-outline' },
    { key: SORT_OPTIONS.UPDATED, title: 'Recently Updated', icon: 'time-outline' },
    { key: SORT_OPTIONS.RATING, title: 'Rating', icon: 'star-outline' },
    { key: SORT_OPTIONS.CATEGORY, title: 'Category', icon: 'folder-outline' },
  ];

  const handleResourcePress = (resource) => {
    navigation.navigate('ResourceDetail', { resource });
  };

  const renderResourceItem = ({ item }) => {
    const isSaved = savedResources.has(item.id);
    const rating = getMockRating(item);
    
    return (
      <TouchableOpacity
        style={styles.resourceCard}
        onPress={() => handleResourcePress(item)}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${item.category} resource`}
      >
        <View style={styles.resourceHeader}>
          <View style={styles.resourceTitleRow}>
            <Text style={styles.resourceName} numberOfLines={2}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => toggleSaveResource(item.id)}
              style={styles.saveButton}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? 'Remove from saved' : 'Save resource'}
            >
              <Ionicons 
                name={isSaved ? 'bookmark' : 'bookmark-outline'} 
                size={20} 
                color={isSaved ? Colors.warning : Colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.badgeRow}>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.secondary} />
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            )}
            
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={Colors.warning} />
              <Text style={styles.badgeText}>{rating.toFixed(1)}</Text>
            </View>
            
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{getString(item.category, language)}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.resourceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.resourceFooter}>
          <View style={styles.resourceInfo}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.resourceAddress} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
          
          {item.phone && (
            <View style={styles.resourceInfo}>
              <Ionicons name="call-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.resourcePhone}>{item.phone}</Text>
            </View>
          )}
          
          <View style={styles.resourceInfo}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.resourceDate}>Updated {formatDate(item.lastUpdated)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryFilter = ({ item }) => (
    <SafeButton
      title={item.title}
      onPress={() => setSelectedCategory(item.key)}
      variant={selectedCategory === item.key ? 'primary' : 'outline'}
      size="sm"
      icon={<Ionicons name={item.icon} size={16} color={
        selectedCategory === item.key ? Colors.background : Colors.primary
      } />}
      style={styles.categoryButton}
    />
  );

  const renderSortOption = ({ item }) => (
    <TouchableOpacity
      style={[styles.sortOption, sortBy === item.key && styles.sortOptionActive]}
      onPress={() => {
        setSortBy(item.key);
        setShowSortMenu(false);
      }}
    >
      <Ionicons 
        name={item.icon} 
        size={16} 
        color={sortBy === item.key ? Colors.primary : Colors.textSecondary} 
      />
      <Text style={[
        styles.sortOptionText,
        sortBy === item.key && styles.sortOptionTextActive
      ]}>
        {item.title}
      </Text>
      {sortBy === item.key && (
        <Ionicons name="checkmark" size={16} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search and Sort Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <CustomInput
              placeholder={`${getString('search', language)} ${getString('resources', language)}...`}
              value={searchQuery}
              onChangeText={handleSearch}
              leftIcon="search-outline"
              rightIcon={searchQuery ? "close-circle" : null}
              onRightIconPress={searchQuery ? handleClearSearch : null}
              style={styles.searchInput}
            />
          </View>
          
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortMenu(!showSortMenu)}
            accessibilityRole="button"
            accessibilityLabel="Sort options"
          >
            <Ionicons name="funnel-outline" size={20} color={Colors.primary} />
            <Text style={styles.sortButtonText}>Sort</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => navigation.navigate('ResourcesMap', { 
              category: selectedCategory,
              searchQuery: searchQuery 
            })}
            accessibilityRole="button"
            accessibilityLabel="View map"
          >
            <Ionicons name="map-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Sort Menu */}
        {showSortMenu && (
          <View style={styles.sortMenu}>
            <Text style={styles.sortMenuTitle}>Sort by:</Text>
            <FlatList
              data={sortOptions}
              renderItem={renderSortOption}
              keyExtractor={(item) => item.key}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item.key || 'all'}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {displayedResources.length} {displayedResources.length === 1 ? 'resource' : 'resources'} found
        </Text>
        <Text style={styles.sortDisplay}>
          Sorted by {getSortDisplayName(sortBy)}
        </Text>
      </View>

      {/* Resources List */}
      <FlatList
        data={displayedResources}
        renderItem={renderResourceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resourcesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No results found' : 'No resources found'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? `Try adjusting your search "${searchQuery}" or category filter`
                : 'No resources found for this category'
              }
            </Text>
            {(searchQuery || selectedCategory) && (
              <SafeButton
                title="Clear Filters"
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                variant="outline"
                style={styles.clearFiltersButton}
              />
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchInput: {
    marginBottom: 0,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    minHeight: 44,
  },
  sortButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  mapButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.sm,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortMenu: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.base,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.base,
  },
  sortMenuTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  sortOptionActive: {
    backgroundColor: Colors.primaryBackground,
  },
  sortOptionText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  sortOptionTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  filtersContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersList: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  categoryButton: {
    marginRight: Spacing.sm,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultsCount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
  },
  sortDisplay: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  resourcesList: {
    padding: Spacing.base,
  },
  resourceCard: {
    backgroundColor: Colors.background,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  resourceHeader: {
    marginBottom: Spacing.sm,
  },
  resourceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  resourceName: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  saveButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningBackground,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  categoryBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  resourceDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
    marginBottom: Spacing.sm,
  },
  resourceFooter: {
    gap: Spacing.xs,
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  resourceAddress: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  resourcePhone: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  resourceDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.base,
    marginBottom: Spacing.xs,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.base,
  },
  clearFiltersButton: {
    marginTop: Spacing.sm,
  },
});

export default ResourcesScreen; 