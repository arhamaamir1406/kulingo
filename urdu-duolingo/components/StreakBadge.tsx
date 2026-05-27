import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';

interface Props {
  streak: number;
  size?: 'sm' | 'lg';
}

export default function StreakBadge({ streak, size = 'sm' }: Props) {
  const isLg = size === 'lg';
  return (
    <View style={[styles.container, isLg && styles.large]}>
      <Text style={[styles.fire, isLg && styles.fireLg]}>🔥</Text>
      <Text style={[styles.count, isLg && styles.countLg]}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
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
  fireLg: { fontSize: 28 },
  count: { fontSize: 15, fontWeight: '800', color: Colors.streakOrange },
  countLg: { fontSize: 26, fontWeight: '900' },
});
