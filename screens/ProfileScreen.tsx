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
import StreakBadge from '../components/StreakBadge';

export default function ProfileScreen() {
  const { isLoaded, loadProgress, xp, hearts, streak, longestStreak, completedLessons, resetHearts } =
    useProgress();

  useEffect(() => {
    if (!isLoaded) loadProgress();
  }, []);

  const totalLessons = CURRICULUM.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedCount = Object.values(completedLessons).filter((l) => l.completed).length;
  const totalXP = xp;
  const level = Math.floor(totalXP / 100) + 1;
  const xpForNextLevel = level * 100;
  const xpInCurrentLevel = totalXP % 100;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🧑‍🎓</Text>
          </View>
          <Text style={styles.profileName}>Urdu Learner</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {level}</Text>
          </View>
        </View>

        <View style={styles.xpBar}>
          <View style={styles.xpBarHeader}>
            <Text style={styles.xpLabel}>⚡ {xpInCurrentLevel} / {100} XP</Text>
            <Text style={styles.xpLabel}>Level {level + 1} in {100 - xpInCurrentLevel} XP</Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpInCurrentLevel}%`, backgroundColor: Colors.xpBlue }]} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={styles.statValue}>{totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📚</Text>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Lessons Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hearts</Text>
          <View style={styles.heartsContainer}>
            <View style={styles.heartsRow}>
              {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                <Text key={i} style={{ fontSize: 32, opacity: i < hearts ? 1 : 0.2 }}>❤️</Text>
              ))}
            </View>
            <Text style={styles.heartsSubtext}>{hearts}/{MAX_HEARTS} remaining</Text>
            {hearts < MAX_HEARTS && (
              <TouchableOpacity style={styles.refillBtn} onPress={resetHearts}>
                <Text style={styles.refillBtnText}>Refill Hearts</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          {CURRICULUM.map((unit) => {
            const unitCompleted = unit.lessons.filter((l) => completedLessons[l.id]?.completed).length;
            const unitTotal = unit.lessons.length;
            const pct = unitTotal > 0 ? unitCompleted / unitTotal : 0;

            return (
              <View key={unit.id} style={styles.unitProgress}>
                <View style={styles.unitProgressHeader}>
                  <Text style={styles.unitProgressIcon}>{unit.icon}</Text>
                  <Text style={styles.unitProgressTitle}>{unit.title}</Text>
                  <Text style={[styles.unitProgressCount, { color: unit.color }]}>
                    {unitCompleted}/{unitTotal}
                  </Text>
                </View>
                <View style={styles.unitProgressTrack}>
                  <View
                    style={[
                      styles.unitProgressFill,
                      { width: `${pct * 100}%`, backgroundColor: unit.color },
                    ]}
                  />
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  avatarText: { fontSize: 48 },
  profileName: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  levelBadge: {
    backgroundColor: Colors.primary + '22',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.xs,
  },
  levelText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  xpBar: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  xpBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  xpLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  xpTrack: {
    height: 14,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  xpFill: { height: '100%', borderRadius: Radius.full },
  statsGrid: {
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
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  statEmoji: { fontSize: 28, marginBottom: Spacing.xs },
  statValue: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginTop: 2 },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  heartsContainer: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  heartsRow: { flexDirection: 'row', gap: Spacing.xs },
  heartsSubtext: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  refillBtn: {
    backgroundColor: Colors.red,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  refillBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  unitProgress: {
    marginBottom: Spacing.md,
  },
  unitProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  unitProgressIcon: { fontSize: 18 },
  unitProgressTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  unitProgressCount: { fontSize: 13, fontWeight: '700' },
  unitProgressTrack: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  unitProgressFill: { height: '100%', borderRadius: Radius.full },
});
