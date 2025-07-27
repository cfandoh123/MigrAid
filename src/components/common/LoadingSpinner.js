// LoadingSpinner Component for MigrAid
// Accessible loading spinner with overlay and size options

import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

import { Colors, Typography, Spacing, BorderRadius, CommonStyles, Shadows } from '../../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoadingSpinner = ({
  size = 'large',
  color = Colors.primary,
  message,
  overlay = false,
  backgroundColor = Colors.background,
  style,
  ...props
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'medium':
        return 36;
      case 'large':
        return 48;
      case 'xlarge':
        return 64;
      default:
        return 48;
    }
  };

  const renderSpinner = () => (
    <View style={[
      styles.container,
      overlay && styles.overlayContainer,
      { backgroundColor: overlay ? 'rgba(255, 255, 255, 0.9)' : backgroundColor },
      style
    ]}>
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel={message || 'Loading'}
        accessibilityLiveRegion="polite"
      >
        <View style={[
          styles.spinnerContainer,
          overlay && styles.overlaySpinnerContainer
        ]}>
          <ActivityIndicator
            size={getSpinnerSize()}
            color={color}
            {...props}
          />
          {message && (
            <Text style={[
              styles.message,
              size === 'small' && styles.messageSmall,
              size === 'xlarge' && styles.messageLarge
            ]}>
              {message}
            </Text>
          )}
        </View>
      </Animated.View>
    </View>
  );

  if (overlay) {
    return (
      <View style={styles.overlay}>
        {renderSpinner()}
      </View>
    );
  }

  return renderSpinner();
};

// Specialized loading components
export const FullScreenLoader = ({ message = 'Loading...', ...props }) => (
  <View style={styles.fullScreenContainer}>
    <LoadingSpinner
      size="xlarge"
      message={message}
      overlay={false}
      style={styles.fullScreenSpinner}
      {...props}
    />
  </View>
);

export const OverlayLoader = ({ message, visible = true, ...props }) => {
  if (!visible) return null;
  
  return (
    <LoadingSpinner
      overlay={true}
      message={message}
      {...props}
    />
  );
};

export const InlineLoader = ({ message, size = 'medium', ...props }) => (
  <View style={styles.inlineContainer}>
    <LoadingSpinner
      size={size}
      message={message}
      overlay={false}
      style={styles.inlineSpinner}
      {...props}
    />
  </View>
);

export const ButtonLoader = ({ size = 'small', color = Colors.background }) => (
  <ActivityIndicator
    size={size === 'small' ? 16 : 20}
    color={color}
  />
);

// Loading skeleton for lists
export const LoadingSkeleton = ({ height = 80, style }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    shimmer.start();
    
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View 
      style={[
        styles.skeleton,
        { height, opacity },
        style
      ]}
      accessible={true}
      accessibilityLabel="Loading content"
    />
  );
};

// Loading dots animation
export const LoadingDots = ({ color = Colors.primary, size = 8 }) => {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      const duration = 600;
      const delay = 200;

      Animated.loop(
        Animated.stagger(delay, [
          Animated.sequence([
            Animated.timing(dot1Anim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(dot1Anim, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(dot2Anim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Anim, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(dot3Anim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Anim, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animateDots();
  }, [dot1Anim, dot2Anim, dot3Anim]);

  const getDotStyle = (animValue) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    opacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [{
      scale: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1.2],
      }),
    }],
  });

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={getDotStyle(dot1Anim)} />
      <Animated.View style={getDotStyle(dot2Anim)} />
      <Animated.View style={getDotStyle(dot3Anim)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.base,
  },
  overlaySpinnerContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.base,
    minWidth: 120,
  },
  message: {
    ...CommonStyles.body,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.base,
  },
  messageSmall: {
    ...CommonStyles.bodySmall,
    marginTop: Spacing.xs,
  },
  messageLarge: {
    ...CommonStyles.bodyLarge,
    marginTop: Spacing.lg,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenSpinner: {
    flex: 1,
  },
  inlineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.base,
  },
  inlineSpinner: {
    backgroundColor: 'transparent',
  },
  skeleton: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
});

export default LoadingSpinner; 