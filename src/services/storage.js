// Privacy-First Storage Service for MigrAid
// Comprehensive local storage with privacy and security considerations

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Share } from 'react-native';

// Storage keys - prefixed for organization and privacy
const STORAGE_KEYS = {
  // User preferences (non-sensitive)
  LANGUAGE: '@migraid:language',
  THEME: '@migraid:theme',
  ANONYMOUS_MODE: '@migraid:anonymousMode',
  ONBOARDING_COMPLETE: '@migraid:onboardingComplete',
  
  // App settings and preferences
  LOCATION_PERMISSIONS: '@migraid:locationPermissions',
  NOTIFICATION_SETTINGS: '@migraid:notificationSettings',
  VIEW_PREFERENCES: '@migraid:viewPreferences',
  ACCESSIBILITY_SETTINGS: '@migraid:accessibilitySettings',
  
  // User data (anonymous)
  SAVED_RESOURCES: '@migraid:savedResources',
  USER_REPORTS: '@migraid:userReports',
  FAVORITE_LOCATIONS: '@migraid:favoriteLocations',
  SEARCH_HISTORY: '@migraid:searchHistory',
  
  // Cached data (temporary)
  CACHED_RESOURCES: '@migraid:cachedResources',
  LAST_CACHE_UPDATE: '@migraid:lastCacheUpdate',
  OFFLINE_DATA: '@migraid:offlineData',
  
  // Anonymous usage data (for app improvement)
  USAGE_ANALYTICS: '@migraid:usageAnalytics',
  APP_PERFORMANCE: '@migraid:appPerformance',
  
  // Privacy settings
  DATA_SHARING_CONSENT: '@migraid:dataSharingConsent',
  PRIVACY_POLICY_ACCEPTED: '@migraid:privacyPolicyAccepted',
  LAST_PRIVACY_UPDATE: '@migraid:lastPrivacyUpdate',
};

class StorageService {
  
  // Generic storage methods with error handling
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return { success: true, error: null };
    } catch (error) {
      console.warn('Storage setItem error:', error);
      return { success: false, error: error.message };
    }
  }

  async getItem(key, defaultValue = null) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      console.warn('Storage getItem error:', error);
      return defaultValue;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return { success: true, error: null };
    } catch (error) {
      console.warn('Storage removeItem error:', error);
      return { success: false, error: error.message };
    }
  }

  async clearAll() {
    try {
      await AsyncStorage.clear();
      return { success: true, error: null };
    } catch (error) {
      console.warn('Storage clearAll error:', error);
      return { success: false, error: error.message };
    }
  }

  // User Preferences
  async setLanguage(languageCode) {
    const result = await this.setItem(STORAGE_KEYS.LANGUAGE, languageCode);
    if (result.success) {
      await this.updateUsageAnalytics('language_change');
    }
    return result;
  }

  async getLanguage() {
    return this.getItem(STORAGE_KEYS.LANGUAGE, 'en');
  }

  async setAnonymousMode(enabled) {
    const result = await this.setItem(STORAGE_KEYS.ANONYMOUS_MODE, enabled);
    if (result.success && !enabled) {
      // If disabling anonymous mode, clear sensitive data
      await this.clearUsageAnalytics();
    }
    return result;
  }

  async getAnonymousMode() {
    return this.getItem(STORAGE_KEYS.ANONYMOUS_MODE, true); // Default to anonymous
  }

  async setOnboardingComplete(completed) {
    return this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, completed);
  }

  async getOnboardingComplete() {
    return this.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE, false);
  }

  async setTheme(theme) {
    return this.setItem(STORAGE_KEYS.THEME, theme);
  }

  async getTheme() {
    return this.getItem(STORAGE_KEYS.THEME, 'light');
  }

  // App Preferences
  async setViewPreferences(preferences) {
    return this.setItem(STORAGE_KEYS.VIEW_PREFERENCES, preferences);
  }

  async getViewPreferences() {
    return this.getItem(STORAGE_KEYS.VIEW_PREFERENCES, {
      defaultView: 'list', // 'list' or 'map'
      mapType: 'standard', // 'standard', 'satellite'
      listSortBy: 'distance', // 'distance', 'name', 'rating'
      showDistances: true,
      compactView: false,
      autoRefresh: true,
    });
  }

  async setAccessibilitySettings(settings) {
    return this.setItem(STORAGE_KEYS.ACCESSIBILITY_SETTINGS, settings);
  }

  async getAccessibilitySettings() {
    return this.getItem(STORAGE_KEYS.ACCESSIBILITY_SETTINGS, {
      largeText: false,
      highContrast: false,
      reduceMotion: false,
      voiceOverEnabled: false,
      hapticFeedback: true,
    });
  }

  // App Settings
  async setLocationPermissions(permissions) {
    return this.setItem(STORAGE_KEYS.LOCATION_PERMISSIONS, permissions);
  }

  async getLocationPermissions() {
    return this.getItem(STORAGE_KEYS.LOCATION_PERMISSIONS, {
      granted: false,
      timestamp: null,
      accuracy: 'balanced'
    });
  }

  async setNotificationSettings(settings) {
    return this.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }

  async getNotificationSettings() {
    return this.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, {
      iceAlerts: false,
      resourceUpdates: false,
      communityReports: false,
      emergencyContacts: true,
      maintenanceUpdates: false,
    });
  }

  // User Data Management
  async addSavedResource(resource) {
    try {
      const savedResources = await this.getSavedResources();
      const isAlreadySaved = savedResources.some(r => r.id === resource.id);
      
      if (!isAlreadySaved) {
        savedResources.push({
          ...resource,
          savedAt: new Date().toISOString(),
          notes: null,
        });
        return this.setItem(STORAGE_KEYS.SAVED_RESOURCES, savedResources);
      }
      
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async removeSavedResource(resourceId) {
    try {
      const savedResources = await this.getSavedResources();
      const filtered = savedResources.filter(r => r.id !== resourceId);
      return this.setItem(STORAGE_KEYS.SAVED_RESOURCES, filtered);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSavedResources() {
    return this.getItem(STORAGE_KEYS.SAVED_RESOURCES, []);
  }

  async isSavedResource(resourceId) {
    const savedResources = await this.getSavedResources();
    return savedResources.some(r => r.id === resourceId);
  }

  async addUserReport(reportData) {
    try {
      const userReports = await this.getUserReports();
      const newReport = {
        id: Date.now().toString(),
        ...reportData,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        anonymous: await this.getAnonymousMode(),
      };
      
      userReports.push(newReport);
      await this.updateUsageAnalytics('report_submitted');
      return this.setItem(STORAGE_KEYS.USER_REPORTS, userReports);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUserReports() {
    return this.getItem(STORAGE_KEYS.USER_REPORTS, []);
  }

  async deleteUserReport(reportId) {
    try {
      const userReports = await this.getUserReports();
      const filtered = userReports.filter(r => r.id !== reportId);
      return this.setItem(STORAGE_KEYS.USER_REPORTS, filtered);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addSearchToHistory(searchQuery, category = null) {
    try {
      if (!searchQuery.trim()) return { success: true, error: null };
      
      const searchHistory = await this.getSearchHistory();
      const existingIndex = searchHistory.findIndex(
        item => item.query.toLowerCase() === searchQuery.toLowerCase() && item.category === category
      );
      
      const searchItem = {
        query: searchQuery,
        category,
        timestamp: new Date().toISOString(),
        count: existingIndex >= 0 ? searchHistory[existingIndex].count + 1 : 1,
      };
      
      if (existingIndex >= 0) {
        searchHistory[existingIndex] = searchItem;
      } else {
        searchHistory.unshift(searchItem);
      }
      
      // Keep only last 50 searches
      const trimmed = searchHistory.slice(0, 50);
      await this.updateUsageAnalytics('resource_search');
      return this.setItem(STORAGE_KEYS.SEARCH_HISTORY, trimmed);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSearchHistory() {
    return this.getItem(STORAGE_KEYS.SEARCH_HISTORY, []);
  }

  async clearSearchHistory() {
    return this.setItem(STORAGE_KEYS.SEARCH_HISTORY, []);
  }

  // Cached Data Management
  async cacheResources(resources) {
    const result = await this.setItem(STORAGE_KEYS.CACHED_RESOURCES, resources);
    if (result.success) {
      await this.setItem(STORAGE_KEYS.LAST_CACHE_UPDATE, Date.now());
    }
    return result;
  }

  async getCachedResources() {
    return this.getItem(STORAGE_KEYS.CACHED_RESOURCES, []);
  }

  async getLastCacheUpdate() {
    return this.getItem(STORAGE_KEYS.LAST_CACHE_UPDATE, 0);
  }

  async isCacheExpired(maxAgeHours = 24) {
    const lastUpdate = await this.getLastCacheUpdate();
    const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds
    return (Date.now() - lastUpdate) > maxAge;
  }

  async clearCache() {
    await this.removeItem(STORAGE_KEYS.CACHED_RESOURCES);
    await this.removeItem(STORAGE_KEYS.LAST_CACHE_UPDATE);
    await this.removeItem(STORAGE_KEYS.OFFLINE_DATA);
  }

  async setOfflineData(data) {
    return this.setItem(STORAGE_KEYS.OFFLINE_DATA, {
      ...data,
      lastUpdate: Date.now(),
    });
  }

  async getOfflineData() {
    return this.getItem(STORAGE_KEYS.OFFLINE_DATA, null);
  }

  // Anonymous Usage Analytics (Privacy-Safe)
  async updateUsageAnalytics(action, metadata = {}) {
    const isAnonymous = await this.getAnonymousMode();
    if (!isAnonymous) return { success: false, error: 'Analytics disabled in non-anonymous mode' };

    try {
      const analytics = await this.getItem(STORAGE_KEYS.USAGE_ANALYTICS, {
        resourceSearches: 0,
        mapViews: 0,
        listViews: 0,
        reportViews: 0,
        reportsSubmitted: 0,
        languageChanges: 0,
        settingsAccessed: 0,
        emergencyContactsUsed: 0,
        resourcesSaved: 0,
        dataExports: 0,
        lastActive: null,
        appVersion: '1.0.0',
        firstUse: null,
      });

      // Set first use if not set
      if (!analytics.firstUse) {
        analytics.firstUse = new Date().toISOString();
      }

      switch (action) {
        case 'resource_search':
          analytics.resourceSearches++;
          break;
        case 'map_view':
          analytics.mapViews++;
          break;
        case 'list_view':
          analytics.listViews++;
          break;
        case 'report_view':
          analytics.reportViews++;
          break;
        case 'report_submitted':
          analytics.reportsSubmitted++;
          break;
        case 'language_change':
          analytics.languageChanges++;
          break;
        case 'settings_accessed':
          analytics.settingsAccessed++;
          break;
        case 'emergency_contact_used':
          analytics.emergencyContactsUsed++;
          break;
        case 'resource_saved':
          analytics.resourcesSaved++;
          break;
        case 'data_export':
          analytics.dataExports++;
          break;
      }

      analytics.lastActive = new Date().toISOString();
      return this.setItem(STORAGE_KEYS.USAGE_ANALYTICS, analytics);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUsageAnalytics() {
    return this.getItem(STORAGE_KEYS.USAGE_ANALYTICS, null);
  }

  async clearUsageAnalytics() {
    return this.removeItem(STORAGE_KEYS.USAGE_ANALYTICS);
  }

  // Privacy and Security Methods
  async setPrivacyConsent(consent) {
    return this.setItem(STORAGE_KEYS.DATA_SHARING_CONSENT, {
      ...consent,
      timestamp: new Date().toISOString(),
    });
  }

  async getPrivacyConsent() {
    return this.getItem(STORAGE_KEYS.DATA_SHARING_CONSENT, {
      analytics: false,
      crashReporting: false,
      performanceMonitoring: false,
      timestamp: null,
    });
  }

  async setPrivacyPolicyAccepted(version) {
    return this.setItem(STORAGE_KEYS.PRIVACY_POLICY_ACCEPTED, {
      version,
      timestamp: new Date().toISOString(),
    });
  }

  async getPrivacyPolicyAccepted() {
    return this.getItem(STORAGE_KEYS.PRIVACY_POLICY_ACCEPTED, null);
  }

  async clearSensitiveData() {
    // Remove potentially sensitive cached data but keep preferences
    await this.clearCache();
    await this.clearUsageAnalytics();
    await this.clearSearchHistory();
    
    // Clear reports if in anonymous mode
    const isAnonymous = await this.getAnonymousMode();
    if (isAnonymous) {
      await this.removeItem(STORAGE_KEYS.USER_REPORTS);
    }
    
    return { success: true, error: null };
  }

  async exportUserData() {
    try {
      // Export all user data for transparency (GDPR-like)
      const userData = {
        metadata: {
          exportDate: new Date().toISOString(),
          appVersion: '1.0.0',
          dataFormat: 'JSON',
        },
        preferences: {},
        userData: {},
        analytics: {},
        privacy: {},
      };
      
      // Group data by category
      for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
        const value = await this.getItem(storageKey);
        
        if (value !== null) {
          if (key.includes('LANGUAGE') || key.includes('THEME') || key.includes('PREFERENCES') || key.includes('SETTINGS')) {
            userData.preferences[key] = value;
          } else if (key.includes('SAVED') || key.includes('USER') || key.includes('SEARCH') || key.includes('FAVORITE')) {
            userData.userData[key] = value;
          } else if (key.includes('ANALYTICS') || key.includes('USAGE')) {
            userData.analytics[key] = value;
          } else if (key.includes('PRIVACY') || key.includes('CONSENT')) {
            userData.privacy[key] = value;
          } else {
            userData.preferences[key] = value;
          }
        }
      }
      
      await this.updateUsageAnalytics('data_export');
      return { success: true, data: userData, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  }

  async shareUserData() {
    try {
      const exportResult = await this.exportUserData();
      if (!exportResult.success) {
        throw new Error(exportResult.error);
      }

      const shareContent = {
        title: 'MigrAid Data Export',
        message: `My MigrAid app data export from ${new Date().toLocaleDateString()}`,
        url: `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportResult.data, null, 2))}`,
      };

      await Share.share(shareContent);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteAllUserData() {
    try {
      // Complete data deletion for privacy
      const deletePromises = Object.values(STORAGE_KEYS).map(key => this.removeItem(key));
      await Promise.all(deletePromises);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteSpecificData(categories = []) {
    try {
      const categoryKeys = {
        preferences: ['LANGUAGE', 'THEME', 'VIEW_PREFERENCES', 'ACCESSIBILITY_SETTINGS'],
        userData: ['SAVED_RESOURCES', 'USER_REPORTS', 'SEARCH_HISTORY', 'FAVORITE_LOCATIONS'],
        cache: ['CACHED_RESOURCES', 'LAST_CACHE_UPDATE', 'OFFLINE_DATA'],
        analytics: ['USAGE_ANALYTICS', 'APP_PERFORMANCE'],
        privacy: ['DATA_SHARING_CONSENT', 'PRIVACY_POLICY_ACCEPTED'],
      };

      for (const category of categories) {
        if (categoryKeys[category]) {
          const keysToDelete = categoryKeys[category];
          for (const keyName of keysToDelete) {
            const storageKey = STORAGE_KEYS[keyName];
            if (storageKey) {
              await this.removeItem(storageKey);
            }
          }
        }
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Utility Methods
  async getStorageSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const migraidKeys = keys.filter(key => key.startsWith('@migraid:'));
      
      let totalSize = 0;
      const keyDetails = {};
      
      for (const key of migraidKeys) {
        const value = await AsyncStorage.getItem(key);
        const size = value ? value.length : 0;
        totalSize += size;
        keyDetails[key] = { sizeBytes: size, sizeMB: (size / (1024 * 1024)).toFixed(4) };
      }
      
      return {
        summary: {
          totalKeys: migraidKeys.length,
          totalSizeBytes: totalSize,
          totalSizeKB: (totalSize / 1024).toFixed(2),
          totalSizeMB: (totalSize / (1024 * 1024)).toFixed(4),
        },
        details: keyDetails,
      };
    } catch (error) {
      console.warn('Storage size calculation error:', error);
      return {
        summary: { totalKeys: 0, totalSizeBytes: 0, totalSizeKB: '0.00', totalSizeMB: '0.00' },
        details: {},
      };
    }
  }

  async getDataSummary() {
    try {
      const summary = {
        preferences: {
          language: await this.getLanguage(),
          anonymousMode: await this.getAnonymousMode(),
          theme: await this.getTheme(),
        },
        userData: {
          savedResources: (await this.getSavedResources()).length,
          userReports: (await this.getUserReports()).length,
          searchHistory: (await this.getSearchHistory()).length,
        },
        privacy: {
          privacyConsent: await this.getPrivacyConsent(),
          privacyPolicyAccepted: await this.getPrivacyPolicyAccepted(),
        },
        analytics: await this.getUsageAnalytics(),
        storage: await this.getStorageSize(),
      };

      return { success: true, data: summary, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  }

  // Health check for storage integrity
  async performHealthCheck() {
    try {
      const issues = [];
      const warnings = [];

      // Check if critical keys exist
      const criticalKeys = [STORAGE_KEYS.LANGUAGE, STORAGE_KEYS.ANONYMOUS_MODE];
      for (const key of criticalKeys) {
        const value = await this.getItem(key);
        if (value === null) {
          warnings.push(`Missing critical preference: ${key}`);
        }
      }

      // Check storage size
      const storageInfo = await this.getStorageSize();
      if (storageInfo.summary.totalSizeMB > 10) {
        warnings.push(`Large storage usage: ${storageInfo.summary.totalSizeMB}MB`);
      }

      // Check for old data
      const lastCacheUpdate = await this.getLastCacheUpdate();
      if (lastCacheUpdate && (Date.now() - lastCacheUpdate) > (7 * 24 * 60 * 60 * 1000)) {
        warnings.push('Cache data is older than 7 days');
      }

      return {
        success: true,
        healthy: issues.length === 0,
        issues,
        warnings,
        recommendations: warnings.length > 0 ? ['Consider clearing old cache data', 'Review storage usage'] : [],
      };
    } catch (error) {
      return {
        success: false,
        healthy: false,
        issues: [error.message],
        warnings: [],
        recommendations: ['Check storage permissions', 'Restart app'],
      };
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService; 