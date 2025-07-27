// MapScreen for MigrAid
// Interactive map for discovering resources with location-based features

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import CustomInput from '../../components/common/CustomInput';
import SafeButton from '../../components/common/SafeButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { getString } from '../../constants/strings';
import { mockResources, RESOURCE_CATEGORIES, searchResources } from '../../data/mockResources';
import { storageService } from '../../services/storage';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// San Francisco Bay Area default region
const DEFAULT_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const MapScreen = ({ navigation, route }) => {
  const mapRef = useRef(null);
  const [language, setLanguage] = useState('en');
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredResources, setFilteredResources] = useState(mockResources);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    loadLanguage();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory]);

  const loadLanguage = async () => {
    const userLanguage = await storageService.getLanguage();
    setLanguage(userLanguage);
  };

  const requestLocationPermission = async () => {
    try {
      setIsLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        await getCurrentLocation();
      } else {
        handleLocationPermissionDenied();
      }
    } catch (error) {
      console.warn('Error requesting location permission:', error);
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(userCoords);
      
      // Update region to center on user location
      const newRegion = {
        ...userCoords,
        latitudeDelta: LATITUDE_DELTA / 4, // Zoom in more when we have user location
        longitudeDelta: LONGITUDE_DELTA / 4,
      };
      
      setRegion(newRegion);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.warn('Error getting current location:', error);
      setIsOffline(true);
    }
  };

  const handleLocationPermissionDenied = () => {
    Alert.alert(
      'Location Access Needed',
      'To show nearby resources and provide directions, please enable location access in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          }
        }
      ]
    );
  };

  const applyFilters = () => {
    let filtered = mockResources;

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = searchResources(searchQuery.trim());
      filtered = filtered.filter(resource => 
        searchResults.some(result => result.id === resource.id)
      );
    }

    setFilteredResources(filtered);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case RESOURCE_CATEGORIES.LEGAL:
        return Colors.primary;
      case RESOURCE_CATEGORIES.HEALTHCARE:
        return Colors.secondary;
      case RESOURCE_CATEGORIES.FOOD:
        return Colors.warning;
      case RESOURCE_CATEGORIES.SHELTER:
        return Colors.info;
      default:
        return Colors.textSecondary;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case RESOURCE_CATEGORIES.LEGAL:
        return 'scale';
      case RESOURCE_CATEGORIES.HEALTHCARE:
        return 'medical';
      case RESOURCE_CATEGORIES.FOOD:
        return 'restaurant';
      case RESOURCE_CATEGORIES.SHELTER:
        return 'home';
      default:
        return 'location';
    }
  };

  const handleMarkerPress = (resource) => {
    setSelectedMarker(resource);
    
    // Animate to marker location
    if (mapRef.current && resource.coordinates) {
      mapRef.current.animateToRegion({
        latitude: resource.coordinates.latitude,
        longitude: resource.coordinates.longitude,
        latitudeDelta: LATITUDE_DELTA / 8,
        longitudeDelta: LONGITUDE_DELTA / 8,
      }, 500);
    }
  };

  const handleCalloutPress = (resource) => {
    navigation.navigate('ResourceDetail', { resource });
  };

  const handleDirections = (resource) => {
    if (resource.coordinates) {
      const url = `https://maps.apple.com/?daddr=${resource.coordinates.latitude},${resource.coordinates.longitude}`;
      Linking.openURL(url);
    } else if (resource.address) {
      const encodedAddress = encodeURIComponent(resource.address);
      const url = `https://maps.apple.com/?daddr=${encodedAddress}`;
      Linking.openURL(url);
    }
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: LATITUDE_DELTA / 4,
        longitudeDelta: LONGITUDE_DELTA / 4,
      }, 1000);
    } else if (!locationPermission) {
      requestLocationPermission();
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    storageService.updateUsageAnalytics('map_search');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const categories = [
    { key: null, title: 'All', icon: 'apps-outline', color: Colors.textSecondary },
    { key: RESOURCE_CATEGORIES.LEGAL, title: getString('legal', language), icon: 'scale-outline', color: Colors.primary },
    { key: RESOURCE_CATEGORIES.HEALTHCARE, title: getString('healthcare', language), icon: 'medical-outline', color: Colors.secondary },
    { key: RESOURCE_CATEGORIES.FOOD, title: getString('food', language), icon: 'restaurant-outline', color: Colors.warning },
    { key: RESOURCE_CATEGORIES.SHELTER, title: getString('shelter', language), icon: 'home-outline', color: Colors.info },
  ];

  const renderCustomMarker = (resource) => (
    <Marker
      key={resource.id}
      coordinate={resource.coordinates}
      onPress={() => handleMarkerPress(resource)}
      tracksViewChanges={false}
    >
      <View style={[
        styles.markerContainer,
        { 
          backgroundColor: getCategoryColor(resource.category),
          borderColor: selectedMarker?.id === resource.id ? Colors.text : Colors.background,
          borderWidth: selectedMarker?.id === resource.id ? 3 : 2,
        }
      ]}>
        <Ionicons 
          name={getCategoryIcon(resource.category)} 
          size={16} 
          color={Colors.background} 
        />
      </View>
      
      <Callout onPress={() => handleCalloutPress(resource)}>
        <View style={styles.calloutContainer}>
          <View style={styles.calloutHeader}>
            <Text style={styles.calloutTitle} numberOfLines={2}>
              {resource.name}
            </Text>
            {resource.verified && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
            )}
          </View>
          
          <Text style={styles.calloutCategory}>
            {getString(resource.category, language)}
          </Text>
          
          <Text style={styles.calloutDescription} numberOfLines={2}>
            {resource.description}
          </Text>
          
          <View style={styles.calloutActions}>
            <TouchableOpacity 
              style={styles.calloutButton}
              onPress={() => handleDirections(resource)}
            >
              <Ionicons name="navigate" size={14} color={Colors.primary} />
              <Text style={styles.calloutButtonText}>Directions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.calloutButton}
              onPress={() => handleCalloutPress(resource)}
            >
              <Ionicons name="information-circle" size={14} color={Colors.primary} />
              <Text style={styles.calloutButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Callout>
    </Marker>
  );

  const renderCategoryFilter = (category) => (
    <TouchableOpacity
      key={category.key || 'all'}
      style={[
        styles.categoryFilterButton,
        {
          backgroundColor: selectedCategory === category.key ? category.color : Colors.background,
          borderColor: category.color,
        }
      ]}
      onPress={() => setSelectedCategory(category.key)}
    >
      <Ionicons 
        name={category.icon} 
        size={16} 
        color={selectedCategory === category.key ? Colors.background : category.color} 
      />
      <Text style={[
        styles.categoryFilterText,
        { color: selectedCategory === category.key ? Colors.background : category.color }
      ]}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading map and getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Offline state
  if (isOffline) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline" size={64} color={Colors.textSecondary} />
          <Text style={styles.errorTitle}>Map Unavailable</Text>
          <Text style={styles.errorMessage}>
            Unable to load map. Please check your internet connection and location permissions.
          </Text>
          <SafeButton
            title="Try Again"
            onPress={requestLocationPermission}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <CustomInput
          placeholder={`${getString('search', language)} ${getString('resources', language)} on map...`}
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon="search-outline"
          rightIcon={searchQuery ? "close-circle" : null}
          onRightIconPress={searchQuery ? clearSearch : null}
          style={styles.searchInput}
        />
        
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons 
            name={showFilters ? "close" : "options"} 
            size={20} 
            color={Colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filter by Category:</Text>
          <View style={styles.filtersRow}>
            {categories.map(renderCategoryFilter)}
          </View>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} shown
        </Text>
        {selectedCategory && (
          <TouchableOpacity onPress={() => setSelectedCategory(null)}>
            <Text style={styles.clearFilterText}>Clear filter</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={locationPermission}
        showsMyLocationButton={false}
        loadingEnabled={true}
        loadingIndicatorColor={Colors.primary}
        loadingBackgroundColor={Colors.background}
        moveOnMarkerPress={false}
        showsCompass={true}
        showsScale={true}
        onPress={() => setSelectedMarker(null)}
      >
        {filteredResources
          .filter(resource => resource.coordinates)
          .map(renderCustomMarker)
        }
      </MapView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        {/* Center on User Location */}
        <TouchableOpacity
          style={[
            styles.fab,
            { backgroundColor: locationPermission ? Colors.primary : Colors.textSecondary }
          ]}
          onPress={centerOnUser}
          disabled={!locationPermission}
        >
          <Ionicons 
            name="locate" 
            size={24} 
            color={Colors.background} 
          />
        </TouchableOpacity>

        {/* View List */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('ResourcesList')}
        >
          <Ionicons 
            name="list" 
            size={24} 
            color={Colors.background} 
          />
        </TouchableOpacity>
      </View>

      {/* Selected Marker Info Card */}
      {selectedMarker && (
        <View style={styles.selectedMarkerCard}>
          <View style={styles.selectedMarkerHeader}>
            <View style={styles.selectedMarkerInfo}>
              <Text style={styles.selectedMarkerName} numberOfLines={1}>
                {selectedMarker.name}
              </Text>
              <Text style={styles.selectedMarkerCategory}>
                {getString(selectedMarker.category, language)}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => setSelectedMarker(null)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.selectedMarkerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDirections(selectedMarker)}
            >
              <Ionicons name="navigate" size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Directions</Text>
            </TouchableOpacity>
            
            {selectedMarker.phone && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => Linking.openURL(`tel:${selectedMarker.phone}`)}
              >
                <Ionicons name="call" size={16} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCalloutPress(selectedMarker)}
            >
              <Ionicons name="information-circle" size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.lg,
  },
  retryButton: {
    paddingHorizontal: Spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  filterToggle: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  categoryFilterText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  clearFilterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.base,
  },
  calloutContainer: {
    width: 250,
    padding: Spacing.sm,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  calloutTitle: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  calloutCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  calloutDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
    marginBottom: Spacing.sm,
  },
  calloutActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  calloutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  calloutButtonText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  fabContainer: {
    position: 'absolute',
    right: Spacing.base,
    bottom: Spacing.base,
    gap: Spacing.sm,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  selectedMarkerCard: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    right: 80, // Leave space for FABs
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedMarkerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  selectedMarkerInfo: {
    flex: 1,
  },
  selectedMarkerName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  selectedMarkerCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  selectedMarkerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default MapScreen; 