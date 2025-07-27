// SafeAreaWrapper Component for MigrAid
// Provides consistent safe area handling with optional scroll functionality

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Colors } from '../../constants/theme';

const SafeAreaWrapper = ({
  children,
  style,
  contentContainerStyle,
  scrollable = false,
  keyboardAvoiding = false,
  backgroundColor = Colors.background,
  showsVerticalScrollIndicator = false,
  refreshControl,
  onScroll,
  scrollEventThrottle = 16,
  enablePullToRefresh = false,
  ...props
}) => {
  
  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={[styles.scrollView, { backgroundColor }]}
          contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          refreshControl={refreshControl}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          keyboardShouldPersistTaps="handled"
          {...props}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.container, { backgroundColor }, style]}>
        {children}
      </View>
    );
  };

  const content = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={[styles.keyboardAvoidingView, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {renderContent()}
    </KeyboardAvoidingView>
  ) : (
    renderContent()
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      {content}
    </SafeAreaView>
  );
};

// Specialized wrappers for common use cases
export const SafeScrollWrapper = ({ children, ...props }) => (
  <SafeAreaWrapper scrollable={true} {...props}>
    {children}
  </SafeAreaWrapper>
);

export const SafeFormWrapper = ({ children, ...props }) => (
  <SafeAreaWrapper 
    scrollable={true} 
    keyboardAvoiding={true} 
    showsVerticalScrollIndicator={false}
    {...props}
  >
    {children}
  </SafeAreaWrapper>
);

export const SafeModalWrapper = ({ children, ...props }) => (
  <SafeAreaWrapper 
    backgroundColor={Colors.background}
    style={styles.modal}
    {...props}
  >
    {children}
  </SafeAreaWrapper>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modal: {
    margin: 0,
  },
});

export default SafeAreaWrapper; 