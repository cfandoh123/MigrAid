// MigrAid App Navigator - Professional Navigation System
// Privacy-first navigation with accessibility and smooth transitions

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import main app screens
import HomeScreen from '../screens/home/HomeScreen';
import ResourcesScreen from '../screens/resources/ResourcesScreen';
import ResourceDetailScreen from '../screens/resources/ResourceDetailScreen';
import MapScreen from '../screens/resources/MapScreen';
import IceReportsScreen from '../screens/ice-reports/IceReportsScreen';
import ReportDetailScreen from '../screens/ice-reports/ReportDetailScreen';
import CreateReportScreen from '../screens/ice-reports/CreateReportScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Import advocate screens
import AdvocateLogin from '../screens/advocate/AdvocateLogin';
import AdvocateDashboard from '../screens/advocate/AdvocateDashboard';
import ResourceManagement from '../screens/advocate/ResourceManagement';

// Import onboarding screens
import LanguageSelectionScreen from '../screens/onboarding/LanguageSelectionScreen';
import AnonymousModeScreen from '../screens/onboarding/AnonymousModeScreen';
import PermissionsScreen from '../screens/onboarding/PermissionsScreen';

// Import theme
import { Colors, Typography, Spacing, Shadows } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Onboarding Stack Navigator
const OnboardingStack = ({ onCompleteOnboarding }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="LanguageSelection" 
        component={LanguageSelectionScreen}
      />
      <Stack.Screen 
        name="AnonymousMode" 
        component={AnonymousModeScreen}
      />
      <Stack.Screen 
        name="Permissions"
      >
        {(props) => (
          <PermissionsScreen 
            {...props} 
            onCompleteOnboarding={onCompleteOnboarding} 
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Stack navigators for each tab
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
          ...Shadows.sm,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontFamily: Typography.fontFamily.semiBold,
          fontSize: Typography.fontSize.lg,
        },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ 
          title: 'MigrAid',
          headerStyle: {
            backgroundColor: Colors.primary,
            ...Shadows.sm,
          },
          headerLeft: () => null,
          headerRight: () => null,
        }}
      />
    </Stack.Navigator>
  );
};

const ResourcesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
          ...Shadows.sm,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontFamily: Typography.fontFamily.semiBold,
          fontSize: Typography.fontSize.lg,
        },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="ResourcesList" 
        component={ResourcesScreen}
        options={{ title: 'Resources' }}
      />
      <Stack.Screen 
        name="ResourceDetail" 
        component={ResourceDetailScreen}
        options={({ route }) => ({ 
          title: route.params?.resource?.name || 'Resource Details',
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen 
        name="ResourcesMap" 
        component={MapScreen}
        options={{ 
          title: 'Resource Map',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const IceReportsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
          ...Shadows.sm,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontFamily: Typography.fontFamily.semiBold,
          fontSize: Typography.fontSize.lg,
        },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="ReportsList" 
        component={IceReportsScreen}
        options={{ title: 'Community Reports' }}
      />
      <Stack.Screen 
        name="ReportDetail" 
        component={ReportDetailScreen}
        options={{ 
          title: 'Report Details',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="CreateReport" 
        component={CreateReportScreen}
        options={{ 
          title: 'Report Activity',
          presentation: 'modal',
          headerBackTitleVisible: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            };
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
          ...Shadows.sm,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontFamily: Typography.fontFamily.semiBold,
          fontSize: Typography.fontSize.lg,
        },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Settings & Privacy' }}
      />
    </Stack.Navigator>
  );
};

// Advocate Stack Navigator
const AdvocateStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
          ...Shadows.sm,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontFamily: Typography.fontFamily.semiBold,
          fontSize: Typography.fontSize.lg,
        },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="AdvocateLogin" 
        component={AdvocateLogin}
        options={{ 
          title: 'Advocate Login',
          headerShown: false, // Custom header in component
        }}
      />
      <Stack.Screen 
        name="AdvocateDashboard" 
        component={AdvocateDashboard}
        options={{ 
          title: 'Advocate Dashboard',
          headerLeft: null, // Prevent going back to login
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="ResourceManagement" 
        component={ResourceManagement}
        options={{ 
          title: 'Resource Management',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Resources') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: Spacing.sm,
          paddingBottom: Math.max(insets.bottom, Spacing.sm),
          paddingLeft: insets.left,
          paddingRight: insets.right,
          height: 60 + Math.max(insets.bottom, Spacing.sm),
          ...Shadows.sm,
        },
        tabBarLabelStyle: {
          fontSize: Typography.fontSize.xs,
          fontFamily: Typography.fontFamily.medium,
          fontWeight: Typography.fontWeight.medium,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingTop: 6,
          paddingBottom: 2,
        },
        headerShown: false, // We handle headers in individual stack navigators
        tabBarHideOnKeyboard: true, // Hide tab bar when keyboard is open
      })}
      safeAreaInsets={{
        bottom: 0, // This ensures the tab bar extends to the bottom edge
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab, dashboard with resource categories and recent reports'
        }}
      />
      <Tab.Screen 
        name="Resources" 
        component={ResourcesStack}
        options={{
          tabBarLabel: 'Resources',
          tabBarAccessibilityLabel: 'Resources tab, browse legal aid, healthcare, food, and shelter services'
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={IceReportsStack}
        options={{
          tabBarLabel: 'ICE Reports',
          tabBarAccessibilityLabel: 'Community reports tab, view and report ICE activity anonymously'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab, settings, privacy controls, and advocate login'
        }}
      />
    </Tab.Navigator>
  );
};

// Main Root Stack Navigator
const RootStack = createStackNavigator();

const AppNavigator = ({ isOnboardingComplete = false, onCompleteOnboarding }) => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false, // Disable swipe gestures for security in root navigator
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      >
        {!isOnboardingComplete ? (
          <RootStack.Screen 
            name="Onboarding"
            options={{
              animationTypeForReplace: 'pop',
            }}
          >
            {(props) => (
              <OnboardingStack 
                {...props} 
                onCompleteOnboarding={onCompleteOnboarding} 
              />
            )}
          </RootStack.Screen>
        ) : (
          <>
            <RootStack.Screen 
              name="Main" 
              component={TabNavigator}
            />
            <RootStack.Screen 
              name="Advocate" 
              component={AdvocateStack}
              options={{
                presentation: 'modal',
                cardStyleInterpolator: ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateY: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.height, 0],
                          }),
                        },
                      ],
                    },
                    overlayStyle: {
                      opacity: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.5],
                      }),
                    },
                  };
                },
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 