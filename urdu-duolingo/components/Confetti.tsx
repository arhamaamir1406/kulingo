/**
 * Confetti burst – rendered as 40 animated particles falling from the top.
 * Uses only useNativeDriver-safe transforms so it works on web & native.
 */
import React, { useEffect, useRef, memo } from 'react';
import { View, Animated, Dimensions } from 'react-native';

const { width: W } = Dimensions.get('window');

const COLORS = [
  '#FF3333', '#FFD700', '#58CC02', '#1CB0F6',
  '#FF9600', '#CE82FF', '#FF6B9D', '#FFFFFF', '#FF3333', '#FFD700',
];

// Pre-computed so each render is stable
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: (0.05 + Math.random() * 0.9) * W,
  color: COLORS[i % COLORS.length],
  size: 7 + Math.random() * 9,
  delay: Math.random() * 700,
  fall: 1500 + Math.random() * 1000,
  drift: (Math.random() - 0.5) * 110,
  isCircle: Math.random() > 0.4,
  rotations: 2 + Math.random() * 5,          // full 360° rotations (always positive)
  rotDir: Math.random() > 0.5 ? 1 : -1,      // clockwise or counter
}));

const Particle = memo(({ p }: { p: typeof PARTICLES[number] }) => {
  const ty  = useRef(new Animated.Value(0)).current;
  const tx  = useRef(new Animated.Value(0)).current;
  const rot = useRef(new Animated.Value(0)).current;
  const op  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(p.delay),
      Animated.parallel([
        Animated.timing(op,  { toValue: 1,           duration: 80,     useNativeDriver: true }),
        Animated.timing(ty,  { toValue: 680,          duration: p.fall, useNativeDriver: true }),
        Animated.timing(tx,  { toValue: p.drift,      duration: p.fall, useNativeDriver: true }),
        Animated.timing(rot, { toValue: p.rotations,  duration: p.fall, useNativeDriver: true }),
      ]),
    ]).start();

    // Fade out in the latter half
    Animated.sequence([
      Animated.delay(p.delay + p.fall * 0.58),
      Animated.timing(op, { toValue: 0, duration: p.fall * 0.42, useNativeDriver: true }),
    ]).start();
  }, []);

  const rotate = rot.interpolate({
    inputRange: [0, p.rotations],
    outputRange: ['0deg', `${p.rotDir * p.rotations * 360}deg`],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: -12,
        left: p.x,
        width: p.size,
        height: p.isCircle ? p.size : p.size * 0.42,
        backgroundColor: p.color,
        borderRadius: p.isCircle ? p.size / 2 : 3,
        opacity: op,
        transform: [{ translateY: ty }, { translateX: tx }, { rotate }],
      }}
    />
  );
});

interface Props { visible: boolean }

export default function Confetti({ visible }: Props) {
  if (!visible) return null;
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
    >
      {PARTICLES.map((p) => <Particle key={p.id} p={p} />)}
    </View>
  );
}
