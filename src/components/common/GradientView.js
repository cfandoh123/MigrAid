// Beautiful Gradient View Component for MigrAid
// Provides vibrant, modern gradient backgrounds

import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';

const GradientView = ({
  children,
  colors = Colors.primaryGradient,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  ...props
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={style}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

// Predefined gradient presets
export const GradientPresets = {
  primary: {
    colors: Colors.primaryGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  secondary: {
    colors: Colors.secondaryGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  accent: {
    colors: Colors.accentGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  danger: {
    colors: Colors.dangerGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  warning: {
    colors: Colors.warningGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  success: {
    colors: Colors.successGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  sunset: {
    colors: [Colors.accent, Colors.warning, Colors.dangerLight],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  ocean: {
    colors: [Colors.primary, Colors.info, Colors.teal],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  forest: {
    colors: [Colors.secondary, Colors.teal, Colors.success],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  midnight: {
    colors: [Colors.indigo, Colors.purple, Colors.pink],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  subtle: {
    colors: [Colors.backgroundPure, Colors.background],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

export default GradientView; 