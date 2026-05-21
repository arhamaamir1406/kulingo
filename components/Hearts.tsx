import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';
import { MAX_HEARTS } from '../store/useProgress';

interface Props {
  hearts: number;
  size?: number;
}

export default function Hearts({ hearts, size = 22 }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <Text key={i} style={{ fontSize: size, opacity: i < hearts ? 1 : 0.25, marginHorizontal: 1 }}>
          ❤️
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
