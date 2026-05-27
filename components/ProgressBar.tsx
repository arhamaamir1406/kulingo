import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius } from '../constants/theme';

interface Props {
  progress: number; // 0-1
  color?: string;
}

export default function ProgressBar({ progress, color = Colors.primary }: Props) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
    flex: 1,
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
