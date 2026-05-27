import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';

interface Props {
  streak: number;
  size?: 'sm' | 'lg';
}

export default function StreakBadge({ streak, size = 'sm' }: Props) {
  const isLarge = size === 'lg';
  return (
    <View style={[styles.container, isLarge && styles.large]}>
      <Text style={[styles.fire, isLarge && styles.fireLarge]}>🔥</Text>
      <Text style={[styles.count, isLarge && styles.countLarge]}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    gap: 2,
  },
  large: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  fire: { fontSize: 16 },
  fireLarge: { fontSize: 28 },
  count: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.streakOrange,
  },
  countLarge: { fontSize: 28 },
});
