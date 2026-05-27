import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useProgress, MAX_HEARTS } from '../store/useProgress';
import { CURRICULUM } from '../data/curriculum';
import { Colors, Radius, Spacing } from '../constants/theme';
import Mascot from '../components/Mascot';

export default function ProfileScreen() {
  const {
    isLoaded, loadProgress,
    xp, hearts, streak, longestStreak,
    completedLessons, resetHearts,
  } = useProgress();

  useEffect(() => { if (!isLoaded) loadProgress(); }, []);

  const totalLessons  = CURRICULUM.reduce((a, u) => a + u.lessons.length, 0);
  const doneCount     = Object.values(completedLessons).filter((l) => l.completed).length;
  const level         = Math.floor(xp / 100) + 1;
  const xpInLevel     = xp % 100;
  const xpToNext      = 100 - xpInLevel;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── profile hero ── */}
        <View style={styles.hero}>
          <View style={styles.avatarRing}>
            <Mascot size={80} />
          </View>
          <Text style={styles.heroName}>Urdu Learner</Text>
          <View style={[styles.levelBadge, { backgroundColor: Colors.primary }]}>
            <Text style={styles.levelText}>⚡ Level {level}</Text>
          </View>
        </View>

        {/* ── xp progress ── */}
        <View style={styles.xpCard}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>Level {level}</Text>
            <Text style={styles.xpLabel}>{xpInLevel} / 100 XP</Text>
            <Text style={styles.xpLabel}>Level {level + 1}</Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpInLevel}%` as any }]} />
          </View>
          <Text style={styles.xpSub}>{xpToNext} XP until Level {level + 1}</Text>
        </View>

        {/* ── stats grid ── */}
        <View style={styles.grid}>
          {[
            { icon: '🔥', value: streak,        label: 'Day Streak',   color: Colors.streakOrange },
            { icon: '⚡', value: xp,             label: 'Total XP',     color: Colors.xpBlue },
            { icon: '📚', value: doneCount,      label: 'Lessons Done', color: Colors.primary },
            { icon: '🏆', value: longestStreak,  label: 'Best Streak',  color: Colors.gold },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statEmoji}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── hearts ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hearts</Text>
          <View style={styles.heartsCard}>
            <View style={styles.heartsRow}>
              {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                <Text key={i} style={{ fontSize: 30, opacity: i < hearts ? 1 : 0.18 }}>❤️</Text>
              ))}
            </View>
            <Text style={styles.heartsSub}>{hearts} / {MAX_HEARTS} remaining</Text>
            {hearts < MAX_HEARTS && (
              <TouchableOpacity style={styles.refillBtn} onPress={resetHearts}>
                <Text style={styles.refillText}>🔄  Refill Hearts</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── unit progress ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unit Progress</Text>
          {CURRICULUM.map((unit) => {
            const done  = unit.lessons.filter((l) => completedLessons[l.id]?.completed).length;
            const total = unit.lessons.length;
            const pct   = total > 0 ? done / total : 0;
            return (
              <View key={unit.id} style={styles.unitRow}>
                <View style={styles.unitRowHead}>
                  <Text style={styles.unitRowIcon}>{unit.icon}</Text>
                  <Text style={styles.unitRowName}>{unit.title}</Text>
                  <Text style={[styles.unitRowCount, { color: unit.color }]}>{done}/{total}</Text>
                </View>
                <View style={styles.unitTrack}>
                  <View style={[styles.unitFill, { width: `${pct * 100}%` as any, backgroundColor: unit.color }]} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  content: { paddingBottom: Spacing.xxl },

  /* hero */
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#1A1A1A',
  },
  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  heroName: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: Spacing.sm },
  levelBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  levelText: { fontSize: 14, fontWeight: '800', color: Colors.white },

  /* xp bar */
  xpCard: {
    margin: Spacing.lg,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  xpLabel: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  xpTrack: {
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  xpFill: { height: '100%', backgroundColor: Colors.xpBlue, borderRadius: Radius.full },
  xpSub: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },

  /* stats */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: Colors.border,
    borderBottomColor: Colors.borderDark,
  },
  statEmoji: { fontSize: 28, marginBottom: Spacing.xs },
  statValue: { fontSize: 26, fontWeight: '900' },
  statLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600', marginTop: 2 },

  /* sections */
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary, marginBottom: Spacing.md },

  /* hearts */
  heartsCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  heartsRow: { flexDirection: 'row', gap: Spacing.xs },
  heartsSub: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  refillBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: Colors.primaryDark,
  },
  refillText: { color: Colors.white, fontWeight: '800', fontSize: 14 },

  /* unit progress */
  unitRow: { marginBottom: Spacing.md },
  unitRowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  unitRowIcon: { fontSize: 18 },
  unitRowName: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  unitRowCount: { fontSize: 13, fontWeight: '800' },
  unitTrack: {
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  unitFill: { height: '100%', borderRadius: Radius.full },
});
