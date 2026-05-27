import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';
import { MAX_HEARTS } from '../store/useProgress';

interface Props {
  hearts: number;
  size?: number;
}

export default function Hearts({ hearts, size = 20 }: Props) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: size - 2 }}>❤️</Text>
      <Text style={[styles.count, { fontSize: size - 4 }]}>{hearts}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.incorrectLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    gap: 3,
  },
  count: {
    fontWeight: '800',
    color: Colors.heartRed,
  },
});
