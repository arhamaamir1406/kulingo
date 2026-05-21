import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { getLessonById } from '../data/curriculum';
import { Exercise } from '../data/types';
import { useProgress } from '../store/useProgress';
import { Colors, Radius, Spacing } from '../constants/theme';
import ProgressBar from '../components/ProgressBar';
import MultipleChoice from '../components/exercises/MultipleChoice';
import MatchPairs from '../components/exercises/MatchPairs';
import TapWords from '../components/exercises/TapWords';
import TranslateExercise from '../components/exercises/TranslateExercise';

interface Props {
  route: any;
  navigation: any;
}

type ResultState = 'none' | 'correct' | 'incorrect';

export default function LessonScreen({ route, navigation }: Props) {
  const { lessonId, unitId, unitColor } = route.params;
  const found = getLessonById(lessonId);
  const { completeLesson, loseHeart, hearts } = useProgress();

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [result, setResult] = useState<ResultState>('none');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!found) {
    return (
      <View style={styles.center}>
        <Text>Lesson not found</Text>
      </View>
    );
  }

  const { lesson } = found;
  const exercises = lesson.exercises;
  const currentExercise = exercises[exerciseIndex];
  const progress = exerciseIndex / exercises.length;

  const handleAnswer = useCallback(
    async (correct: boolean) => {
      if (result !== 'none') return;
      setResult(correct ? 'correct' : 'incorrect');
      if (correct) {
        setCorrectCount((c) => c + 1);
      } else {
        setWrongCount((w) => w + 1);
        await loseHeart();
      }
    },
    [result, loseHeart]
  );

  const handleContinue = async () => {
    if (exerciseIndex + 1 >= exercises.length) {
      const score = Math.round((correctCount / exercises.length) * 100);
      const finalXP = result === 'correct' ? lesson.xpReward : Math.floor(lesson.xpReward * 0.5);
      await completeLesson(lessonId, score + (result === 'correct' ? 0 : 0), finalXP);
      setFinished(true);
    } else {
      setExerciseIndex((i) => i + 1);
      setResult('none');
    }
  };

  if (finished) {
    const totalScore = correctCount + (result === 'correct' ? 1 : 0);
    const totalExercises = exercises.length;
    const pct = Math.round((totalScore / totalExercises) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: Colors.white }]}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>{stars === 3 ? '🏆' : stars === 2 ? '⭐' : '✨'}</Text>
          <Text style={styles.completeTitle}>Lesson Complete!</Text>
          <Text style={styles.completeSubtitle}>{lesson.title}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalScore}/{totalExercises}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: Colors.streakOrange }]}>+{lesson.xpReward}</Text>
              <Text style={styles.statLabel}>XP Earned</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {stars === 3 ? '⭐⭐⭐' : stars === 2 ? '⭐⭐' : '⭐'}
              </Text>
              <Text style={styles.statLabel}>Stars</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: unitColor || Colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueBtnText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <ProgressBar progress={progress} color={unitColor || Colors.primary} />
        <View style={styles.heartsSmall}>
          <Text style={styles.heartText}>❤️ {hearts}</Text>
        </View>
      </View>

      <View style={styles.exerciseContainer}>
        {renderExercise(currentExercise, handleAnswer, result)}
      </View>

      {result !== 'none' && (
        <View
          style={[
            styles.resultBanner,
            result === 'correct' ? styles.correctBanner : styles.incorrectBanner,
          ]}
        >
          <Text style={[styles.resultText, { color: result === 'correct' ? Colors.correct : Colors.incorrect }]}>
            {result === 'correct' ? '🎉 Correct!' : '❌ Incorrect'}
          </Text>
          <TouchableOpacity
            style={[
              styles.nextBtn,
              { backgroundColor: result === 'correct' ? Colors.primary : Colors.incorrect },
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.nextBtnText}>
              {exerciseIndex + 1 >= exercises.length ? 'FINISH' : 'CONTINUE'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

function renderExercise(exercise: Exercise, onAnswer: (correct: boolean) => void, result: ResultState) {
  if (result !== 'none') {
    // Show result state but don't pass new onAnswer
    const noop = () => {};
    switch (exercise.type) {
      case 'multipleChoice': return <MultipleChoice exercise={exercise} onAnswer={noop} />;
      case 'matchPairs': return <MatchPairs exercise={exercise} onAnswer={noop} />;
      case 'tapWords': return <TapWords exercise={exercise} onAnswer={noop} />;
      case 'translate': return <TranslateExercise exercise={exercise} onAnswer={noop} />;
    }
  }
  switch (exercise.type) {
    case 'multipleChoice': return <MultipleChoice exercise={exercise} onAnswer={onAnswer} />;
    case 'matchPairs': return <MatchPairs exercise={exercise} onAnswer={onAnswer} />;
    case 'tapWords': return <TapWords exercise={exercise} onAnswer={onAnswer} />;
    case 'translate': return <TranslateExercise exercise={exercise} onAnswer={onAnswer} />;
    default: return null;
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundAlt,
  },
  closeBtnText: { fontSize: 16, color: Colors.textSecondary, fontWeight: '700' },
  heartsSmall: {
    backgroundColor: Colors.red + '22',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  heartText: { fontSize: 14, fontWeight: '700', color: Colors.red },
  exerciseContainer: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  resultBanner: {
    padding: Spacing.lg,
    borderTopWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  correctBanner: {
    backgroundColor: Colors.correctLight,
    borderTopColor: Colors.correct,
  },
  incorrectBanner: {
    backgroundColor: Colors.incorrectLight,
    borderTopColor: Colors.incorrect,
  },
  resultText: { fontSize: 20, fontWeight: '800' },
  nextBtn: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  nextBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  completeEmoji: { fontSize: 80 },
  completeTitle: { fontSize: 32, fontWeight: '900', color: Colors.textPrimary },
  completeSubtitle: { fontSize: 18, color: Colors.textSecondary, textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginVertical: Spacing.lg,
    width: '100%',
    justifyContent: 'center',
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  statValue: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, fontWeight: '600' },
  continueBtn: {
    width: '100%',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  continueBtnText: { color: Colors.white, fontWeight: '900', fontSize: 18, letterSpacing: 1 },
});
