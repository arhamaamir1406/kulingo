import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { CURRICULUM } from '../data/curriculum';
import { useProgress } from '../store/useProgress';
import { Colors, Radius, Spacing } from '../constants/theme';
import StreakBadge from '../components/StreakBadge';
import Hearts from '../components/Hearts';

interface Props {
  navigation: any;
}

export default function HomeScreen({ navigation }: Props) {
  const { isLoaded, loadProgress, xp, hearts, streak, isLessonUnlocked, isLessonCompleted, getLessonStars } =
    useProgress();

  useEffect(() => {
    if (!isLoaded) loadProgress();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.flag}>🇵🇰</Text>
          <Text style={styles.headerTitle}>Urdu</Text>
        </View>
        <View style={styles.headerRight}>
          <StreakBadge streak={streak} />
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>⚡ {xp}</Text>
          </View>
          <Hearts hearts={hearts} size={18} />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {CURRICULUM.map((unit, unitIndex) => {
          const firstLessonUnlocked = isLessonUnlocked(unit.id, unit.lessons[0].id);
          const isUnitLocked = !firstLessonUnlocked;

          return (
            <View key={unit.id} style={styles.unit}>
              <View style={[styles.unitHeader, { backgroundColor: unit.color + '22', borderColor: unit.color + '44' }]}>
                <Text style={styles.unitIcon}>{unit.icon}</Text>
                <View style={styles.unitInfo}>
                  <Text style={styles.unitNumber}>Unit {unitIndex + 1}</Text>
                  <Text style={[styles.unitTitle, { color: unit.color }]}>{unit.title}</Text>
                  <Text style={styles.unitTitleUrdu}>{unit.titleUrdu}</Text>
                </View>
                {isUnitLocked && <Text style={styles.lockIcon}>🔒</Text>}
              </View>

              <View style={styles.lessonList}>
                {unit.lessons.map((lesson, lessonIndex) => {
                  const unlocked = isLessonUnlocked(unit.id, lesson.id);
                  const completed = isLessonCompleted(lesson.id);
                  const stars = getLessonStars(lesson.id);

                  return (
                    <TouchableOpacity
                      key={lesson.id}
                      style={[
                        styles.lessonBtn,
                        lesson.isCheckpoint && styles.checkpointBtn,
                        !unlocked && styles.lockedBtn,
                        completed && { borderColor: unit.color },
                      ]}
                      onPress={() =>
                        unlocked &&
                        navigation.navigate('Lesson', {
                          lessonId: lesson.id,
                          unitId: unit.id,
                          unitColor: unit.color,
                        })
                      }
                      activeOpacity={unlocked ? 0.7 : 1}
                    >
                      <View style={styles.lessonLeft}>
                        <View
                          style={[
                            styles.iconCircle,
                            { backgroundColor: unlocked ? unit.color + '22' : Colors.backgroundAlt },
                          ]}
                        >
                          <Text style={[styles.lessonIcon, !unlocked && styles.lockedIcon]}>
                            {unlocked ? lesson.icon : '🔒'}
                          </Text>
                        </View>
                        <View>
                          <Text style={[styles.lessonTitle, !unlocked && styles.lockedText]}>
                            {lesson.title}
                          </Text>
                          {lesson.isCheckpoint && (
                            <Text style={[styles.checkpointLabel, { color: unit.color }]}>Checkpoint</Text>
                          )}
                          <Text style={styles.lessonXP}>+{lesson.xpReward} XP</Text>
                        </View>
                      </View>

                      <View style={styles.lessonRight}>
                        {completed ? (
                          <View style={styles.starsRow}>
                            {[1, 2, 3].map((s) => (
                              <Text key={s} style={{ fontSize: 14, opacity: s <= stars ? 1 : 0.2 }}>
                                ⭐
                              </Text>
                            ))}
                          </View>
                        ) : unlocked ? (
                          <View style={[styles.startBadge, { backgroundColor: unit.color }]}>
                            <Text style={styles.startText}>START</Text>
                          </View>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  flag: { fontSize: 28 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  xpBadge: {
    backgroundColor: Colors.xpBlue + '22',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  xpText: { fontSize: 14, fontWeight: '700', color: Colors.xpBlue },
  scroll: { flex: 1 },
  scrollContent: { paddingVertical: Spacing.lg },
  unit: { marginBottom: Spacing.xl, paddingHorizontal: Spacing.md },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 2,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  unitIcon: { fontSize: 32 },
  unitInfo: { flex: 1 },
  unitNumber: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase' },
  unitTitle: { fontSize: 18, fontWeight: '800' },
  unitTitleUrdu: { fontSize: 14, color: Colors.textSecondary, writingDirection: 'rtl' },
  lockIcon: { fontSize: 24 },
  lessonList: { gap: Spacing.sm },
  lessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  checkpointBtn: {
    borderStyle: 'dashed',
  },
  lockedBtn: { opacity: 0.5 },
  lessonLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIcon: { fontSize: 24 },
  lockedIcon: { opacity: 0.5 },
  lessonTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  lockedText: { color: Colors.textSecondary },
  checkpointLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  lessonXP: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  lessonRight: { alignItems: 'flex-end' },
  starsRow: { flexDirection: 'row' },
  startBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  startText: { color: Colors.white, fontWeight: '800', fontSize: 12 },
});
