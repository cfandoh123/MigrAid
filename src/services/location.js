// Privacy-Aware Location Service for MigrAid
// Handles location permissions and data with privacy protection

import * as Location from 'expo-location';
import { storageService } from './storage';

class LocationService {
  constructor() {
    this.lastKnownLocation = null;
    this.watchId = null;
    this.isWatching = false;
  }

  // Request location permissions with privacy explanation
  async requestPermissions() {
    try {
      // Check current permission status
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        await this.updatePermissionStorage(true);
        return { granted: true, status: existingStatus };
      }

      // Request permissions with privacy context
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      const granted = status === 'granted';
      await this.updatePermissionStorage(granted);
      
      return { granted, status };
    } catch (error) {
      console.warn('Location permission request error:', error);
      return { granted: false, status: 'error', error };
    }
  }

  // Update permission status in storage
  async updatePermissionStorage(granted) {
    await storageService.setLocationPermissions({
      granted,
      timestamp: Date.now()
    });
  }

  // Get current location with privacy protection
  async getCurrentLocation(options = {}) {
    try {
      // Check permissions first
      const permissions = await storageService.getLocationPermissions();
      if (!permissions.granted) {
        throw new Error('Location permissions not granted');
      }

      const locationOptions = {
        accuracy: Location.Accuracy.Balanced, // Balance between accuracy and privacy
        timeout: 10000,
        ...options
      };

      const location = await Location.getCurrentPositionAsync(locationOptions);
      
      // Store last known location (anonymized)
      this.lastKnownLocation = this.anonymizeLocation(location.coords);
      
      return {
        success: true,
        location: this.lastKnownLocation,
        timestamp: location.timestamp
      };
    } catch (error) {
      console.warn('Get current location error:', error);
      return {
        success: false,
        error: error.message,
        location: null
      };
    }
  }

  // Get last known location (cached, anonymized)
  getLastKnownLocation() {
    return this.lastKnownLocation;
  }

  // Start watching location changes (for real-time features)
  async startLocationWatch(callback, options = {}) {
    try {
      if (this.isWatching) {
        await this.stopLocationWatch();
      }

      const permissions = await storageService.getLocationPermissions();
      if (!permissions.granted) {
        throw new Error('Location permissions not granted');
      }

      const watchOptions = {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30000, // 30 seconds minimum
        distanceInterval: 100, // 100 meters minimum
        ...options
      };

      this.watchId = await Location.watchPositionAsync(watchOptions, (location) => {
        const anonymizedLocation = this.anonymizeLocation(location.coords);
        this.lastKnownLocation = anonymizedLocation;
        
        if (callback) {
          callback({
            success: true,
            location: anonymizedLocation,
            timestamp: location.timestamp
          });
        }
      });

      this.isWatching = true;
      return { success: true };
    } catch (error) {
      console.warn('Start location watch error:', error);
      return { success: false, error: error.message };
    }
  }

  // Stop watching location changes
  async stopLocationWatch() {
    if (this.watchId) {
      await Location.removeLocationUpdateSubscription(this.watchId);
      this.watchId = null;
      this.isWatching = false;
    }
  }

  // Anonymize location for privacy protection
  anonymizeLocation(coords, radiusMeters = 200) {
    // Add random offset within specified radius for privacy
    const { latitude, longitude } = coords;
    
    // Convert meters to degrees (approximate)
    const latOffset = (Math.random() - 0.5) * 2 * (radiusMeters / 111320);
    const lngOffset = (Math.random() - 0.5) * 2 * (radiusMeters / (111320 * Math.cos(latitude * Math.PI / 180)));
    
    return {
      latitude: latitude + latOffset,
      longitude: longitude + lngOffset,
      accuracy: coords.accuracy,
      anonymized: true,
      originalRadius: radiusMeters
    };
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  // Find nearby resources
  async findNearbyResources(resources, maxDistanceKm = 10) {
    try {
      const locationResult = await this.getCurrentLocation();
      
      if (!locationResult.success) {
        return { success: false, error: 'Unable to get location' };
      }

      const userLocation = locationResult.location;
      const maxDistanceMeters = maxDistanceKm * 1000;

      const nearby = resources
        .map(resource => {
          if (!resource.coordinates) return null;
          
          const distance = this.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            resource.coordinates.latitude,
            resource.coordinates.longitude
          );

          return {
            ...resource,
            distance,
            distanceKm: (distance / 1000).toFixed(1)
          };
        })
        .filter(resource => resource && resource.distance <= maxDistanceMeters)
        .sort((a, b) => a.distance - b.distance);

      return {
        success: true,
        resources: nearby,
        userLocation: userLocation,
        searchRadius: maxDistanceKm
      };
    } catch (error) {
      console.warn('Find nearby resources error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if location services are enabled
  async isLocationEnabled() {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.warn('Location services check error:', error);
      return false;
    }
  }

  // Get location permission status
  async getPermissionStatus() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status;
    } catch (error) {
      console.warn('Get permission status error:', error);
      return 'undetermined';
    }
  }

  // Privacy utility: clear all location data
  async clearLocationData() {
    await this.stopLocationWatch();
    this.lastKnownLocation = null;
    await storageService.setLocationPermissions({
      granted: false,
      timestamp: null
    });
  }

  // Get anonymized location for reporting (extra privacy layer)
  getAnonymizedLocationForReporting(coords) {
    return this.anonymizeLocation(coords, 500); // Larger radius for reports
  }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService; 