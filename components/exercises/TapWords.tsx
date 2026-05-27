import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TapWordsExercise } from '../../data/types';
import { Colors, Radius, Spacing } from '../../constants/theme';

interface Props {
  exercise: TapWordsExercise;
  onAnswer: (correct: boolean) => void;
}

export default function TapWords({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);

  const shuffledBank = React.useMemo(
    () => [...exercise.wordBank].sort(() => Math.random() - 0.5),
    [exercise.id]
  );

  const available = shuffledBank.filter((_, i) => {
    const usedCount = selected.filter((s) => s === shuffledBank[i]).length;
    const bankCount = shuffledBank.filter((s) => s === shuffledBank[i]).length;
    return usedCount < bankCount;
  });

  const handleTap = (word: string) => {
    if (answered) return;
    setSelected([...selected, word]);
  };

  const handleRemove = (index: number) => {
    if (answered) return;
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    setSelected(newSelected);
  };

  const handleCheck = () => {
    if (selected.length === 0) return;
    setAnswered(true);
    const isCorrect = JSON.stringify(selected) === JSON.stringify(exercise.correctAnswer);
    setTimeout(() => onAnswer(isCorrect), 800);
  };

  const isCorrect =
    answered && JSON.stringify(selected) === JSON.stringify(exercise.correctAnswer);

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      <View style={[styles.answerArea, answered && (isCorrect ? styles.correctArea : styles.incorrectArea)]}>
        {selected.length === 0 ? (
          <Text style={styles.placeholder}>Tap words below...</Text>
        ) : (
          <View style={styles.selectedWords}>
            {selected.map((word, i) => (
              <TouchableOpacity
                key={`${word}-${i}`}
                style={[styles.wordChip, styles.selectedChip, answered && (isCorrect ? styles.correctChip : styles.incorrectChip)]}
                onPress={() => handleRemove(i)}
              >
                <Text style={[styles.wordText, { writingDirection: 'rtl' }]}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.separator} />

      <View style={styles.wordBank}>
        {shuffledBank.map((word, i) => {
          const usedCount = selected.filter((s) => s === word).length;
          const totalCount = shuffledBank.filter((s) => s === word).length;
          const isUsed = usedCount >= totalCount;
          return (
            <TouchableOpacity
              key={`bank-${word}-${i}`}
              style={[styles.wordChip, isUsed && styles.usedChip]}
              onPress={() => !isUsed && handleTap(word)}
              activeOpacity={isUsed ? 1 : 0.7}
            >
              <Text style={[styles.wordText, { opacity: isUsed ? 0 : 1, writingDirection: 'rtl' }]}>{word}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!answered && (
        <TouchableOpacity
          style={[styles.checkBtn, selected.length === 0 && styles.checkBtnDisabled]}
          onPress={handleCheck}
          disabled={selected.length === 0}
        >
          <Text style={styles.checkBtnText}>CHECK</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg },
  prompt: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  answerArea: {
    minHeight: 80,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: Spacing.md,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  correctArea: { borderColor: Colors.correct, backgroundColor: Colors.correctLight },
  incorrectArea: { borderColor: Colors.incorrect, backgroundColor: Colors.incorrectLight },
  placeholder: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
  selectedWords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  separator: {
    height: 2,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    flex: 1,
    alignContent: 'flex-start',
  },
  wordChip: {
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    minWidth: 44,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  selectedChip: {
    backgroundColor: Colors.backgroundAlt,
    borderColor: Colors.secondary,
  },
  correctChip: {
    borderColor: Colors.correct,
    backgroundColor: Colors.correctLight,
  },
  incorrectChip: {
    borderColor: Colors.incorrect,
    backgroundColor: Colors.incorrectLight,
  },
  usedChip: {
    backgroundColor: Colors.backgroundAlt,
    borderColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  checkBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  checkBtnDisabled: { backgroundColor: Colors.border },
  checkBtnText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 1,
  },
});
