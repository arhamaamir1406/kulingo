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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise.id]
  );

  const handleTap = (word: string) => {
    if (answered) return;
    setSelected((prev) => [...prev, word]);
  };

  const handleRemove = (index: number) => {
    if (answered) return;
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    if (selected.length === 0) return;
    setAnswered(true);
    const isCorrect = JSON.stringify(selected) === JSON.stringify(exercise.correctAnswer);
    setTimeout(() => onAnswer(isCorrect), 750);
  };

  const isCorrect =
    answered && JSON.stringify(selected) === JSON.stringify(exercise.correctAnswer);

  const usedCounts: Record<string, number> = {};
  selected.forEach((w) => { usedCounts[w] = (usedCounts[w] ?? 0) + 1; });

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      {/* Answer area */}
      <View style={[
        styles.answerArea,
        answered && (isCorrect ? styles.correctArea : styles.incorrectArea),
      ]}>
        {selected.length === 0
          ? <Text style={styles.placeholder}>Tap words below…</Text>
          : (
            <View style={styles.selectedWords}>
              {selected.map((word, i) => (
                <TouchableOpacity
                  key={`sel-${i}`}
                  style={[
                    styles.chip,
                    styles.selectedChip,
                    answered && (isCorrect ? styles.correctChip : styles.incorrectChip),
                  ]}
                  onPress={() => handleRemove(i)}
                >
                  <Text style={[styles.chipText, { writingDirection: 'rtl' }]}>{word}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )
        }
      </View>

      <View style={styles.separator} />

      {/* Word bank */}
      <View style={styles.wordBank}>
        {shuffledBank.map((word, i) => {
          const bankCount = shuffledBank.filter((w) => w === word).length;
          const usedCount = usedCounts[word] ?? 0;
          const isUsed = usedCount >= bankCount;
          return (
            <TouchableOpacity
              key={`bank-${i}`}
              style={[styles.chip, isUsed && styles.usedChip]}
              onPress={() => !isUsed && handleTap(word)}
              activeOpacity={isUsed ? 1 : 0.7}
            >
              <Text style={[styles.chipText, { opacity: isUsed ? 0 : 1, writingDirection: 'rtl' }]}>
                {word}
              </Text>
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
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  answerArea: {
    minHeight: 88,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: Colors.border,
    borderBottomColor: Colors.borderDark,
    padding: Spacing.md,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  correctArea:   { borderColor: Colors.correct,   borderBottomColor: Colors.correctDark,   backgroundColor: Colors.correctLight },
  incorrectArea: { borderColor: Colors.incorrect, borderBottomColor: Colors.incorrectDark, backgroundColor: Colors.incorrectLight },
  placeholder: { color: Colors.textLight, fontSize: 15, textAlign: 'center' },
  selectedWords: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  separator: { height: 2, backgroundColor: Colors.border, marginVertical: Spacing.md },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    flex: 1,
    alignContent: 'flex-start',
  },
  chip: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: Colors.border,
    borderBottomColor: Colors.borderDark,
    minWidth: 44,
    alignItems: 'center',
  },
  selectedChip: {
    backgroundColor: Colors.backgroundAlt,
    borderColor: Colors.primary,
    borderBottomColor: Colors.primaryDark,
  },
  correctChip: {
    borderColor: Colors.correct,
    borderBottomColor: Colors.correctDark,
    backgroundColor: Colors.correctLight,
  },
  incorrectChip: {
    borderColor: Colors.incorrect,
    borderBottomColor: Colors.incorrectDark,
    backgroundColor: Colors.incorrectLight,
  },
  usedChip: {
    backgroundColor: Colors.backgroundAlt,
    borderColor: Colors.border,
    borderBottomColor: Colors.border,
  },
  chipText: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary },
  checkBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  checkBtnDisabled: {
    backgroundColor: Colors.backgroundAlt,
    borderBottomColor: Colors.border,
  },
  checkBtnText: { color: Colors.white, fontWeight: '900', fontSize: 17, letterSpacing: 1 },
});
