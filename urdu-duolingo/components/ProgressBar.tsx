import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import { Colors, Radius } from '../constants/theme';

interface Props {
  progress: number; // 0–1
  color?: string;
}

export default function ProgressBar({ progress, color = Colors.primary }: Props) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: Math.min(Math.max(progress, 0), 1) * 100,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterp = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // Web-only gradient sheen via inline style
  const webSheen: any =
    Platform.OS === 'web'
      ? { background: `linear-gradient(180deg, ${color}dd 0%, ${color} 60%, ${color}cc 100%)` }
      : { backgroundColor: color };

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, webSheen, { width: widthInterp }]}>
        {/* Inner highlight */}
        <View style={styles.sheen} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 20,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: Radius.full,
  },
});
