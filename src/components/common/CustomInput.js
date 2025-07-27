// CustomInput Component for MigrAid
// Accessible input field with validation styling and icons

import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, CommonStyles, Accessibility } from '../../constants/theme';

const CustomInput = forwardRef(({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  required = false,
  disabled = false,
  style,
  inputStyle,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const hasError = !!error;
  const hasValue = !!value;

  const getContainerStyle = () => {
    if (disabled) {
      return styles.containerDisabled;
    }
    if (hasError) {
      return styles.containerError;
    }
    if (isFocused) {
      return styles.containerFocused;
    }
    return styles.container;
  };

  const getRightIcon = () => {
    if (secureTextEntry) {
      return (
        <Pressable
          onPress={togglePasswordVisibility}
          style={styles.iconButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={Colors.textSecondary}
          />
        </Pressable>
      );
    }
    
    if (rightIcon && onRightIconPress) {
      return (
        <Pressable
          onPress={onRightIconPress}
          style={styles.iconButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Action button"
        >
          <Ionicons
            name={rightIcon}
            size={20}
            color={Colors.textSecondary}
          />
        </Pressable>
      );
    }

    if (rightIcon) {
      return (
        <View style={styles.iconContainer}>
          <Ionicons
            name={rightIcon}
            size={20}
            color={Colors.textSecondary}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.wrapper, style]}>
      {/* Label */}
      {label && (
        <Text style={[
          styles.label,
          hasError && styles.labelError,
          disabled && styles.labelDisabled
        ]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Input Container */}
      <View style={[getContainerStyle(), inputStyle]}>
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={leftIcon}
              size={20}
              color={isFocused ? Colors.primary : Colors.textSecondary}
            />
          </View>
        )}

        {/* Text Input */}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled && editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            disabled && styles.inputDisabled
          ]}
          accessible={true}
          accessibilityLabel={label || placeholder}
          accessibilityHint={helperText}
          accessibilityRequired={required}
          accessibilityInvalid={hasError}
          {...props}
        />

        {/* Right Icon */}
        {getRightIcon()}
      </View>

      {/* Helper Text / Error */}
      {(helperText || error) && (
        <Text style={[
          styles.helperText,
          hasError && styles.errorText
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

// Custom hook for form validation
export const useInputValidation = (initialValue = '', validators = []) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = (val = value) => {
    for (const validator of validators) {
      const errorMessage = validator(val);
      if (errorMessage) {
        setError(errorMessage);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleChange = (newValue) => {
    setValue(newValue);
    if (touched) {
      validate(newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validate();
  };

  return {
    value,
    error: touched ? error : '',
    onChange: handleChange,
    onBlur: handleBlur,
    isValid: !error,
    validate: () => {
      setTouched(true);
      return validate();
    }
  };
};

// Common validators
export const validators = {
  required: (message = 'This field is required') => (value) => {
    return !value || value.trim() === '' ? message : '';
  },
  
  email: (message = 'Please enter a valid email address') => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? message : '';
  },
  
  phone: (message = 'Please enter a valid phone number') => (value) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value?.replace(/[^\d\+]/g, '');
    return value && !phoneRegex.test(cleanPhone) ? message : '';
  },
  
  minLength: (min, message) => (value) => {
    return value && value.length < min ? message || `Must be at least ${min} characters` : '';
  },
  
  maxLength: (max, message) => (value) => {
    return value && value.length > max ? message || `Must be no more than ${max} characters` : '';
  }
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.base,
  },
  label: {
    ...CommonStyles.body,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  labelError: {
    color: Colors.danger,
  },
  labelDisabled: {
    color: Colors.textDisabled,
  },
  required: {
    color: Colors.danger,
  },
  container: {
    ...CommonStyles.inputBase,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  containerFocused: {
    ...CommonStyles.inputBase,
    ...CommonStyles.inputFocused,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  containerError: {
    ...CommonStyles.inputBase,
    ...CommonStyles.inputError,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  containerDisabled: {
    ...CommonStyles.inputBase,
    backgroundColor: Colors.surfaceVariant,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    paddingTop: 2, // Align with text
    marginRight: Spacing.xs,
  },
  iconButton: {
    padding: Spacing.xs,
    marginRight: -Spacing.xs,
    marginTop: -2,
    minHeight: Accessibility.minTouchSize / 2,
    minWidth: Accessibility.minTouchSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text,
    padding: 0, // Remove default padding
    margin: 0, // Remove default margin
    textAlignVertical: 'top',
  },
  inputMultiline: {
    minHeight: 80,
    paddingTop: 0,
  },
  inputDisabled: {
    color: Colors.textDisabled,
  },
  helperText: {
    ...CommonStyles.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  errorText: {
    color: Colors.danger,
  },
});

CustomInput.displayName = 'CustomInput';

export default CustomInput; 