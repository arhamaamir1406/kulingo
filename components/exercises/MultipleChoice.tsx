import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MultipleChoiceExercise } from '../../data/types';
import { Colors, Radius, Spacing } from '../../constants/theme';

interface Props {
  exercise: MultipleChoiceExercise;
  onAnswer: (correct: boolean) => void;
}

export default function MultipleChoice({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    setTimeout(() => {
      onAnswer(option === exercise.correctAnswer);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      {exercise.urduWord && (
        <View style={styles.wordCard}>
          <Text style={styles.urduWord}>{exercise.urduWord}</Text>
          {exercise.roman && <Text style={styles.roman}>{exercise.roman}</Text>}
        </View>
      )}

      <View style={styles.optionsGrid}>
        {exercise.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === exercise.correctAnswer;
          let bg = Colors.white;
          let borderColor = Colors.border;
          let textColor = Colors.textPrimary;

          if (isSelected) {
            if (isCorrect) {
              bg = Colors.correctLight;
              borderColor = Colors.correct;
            } else {
              bg = Colors.incorrectLight;
              borderColor = Colors.incorrect;
              textColor = Colors.incorrect;
            }
          } else if (selected && isCorrect) {
            bg = Colors.correctLight;
            borderColor = Colors.correct;
          }

          return (
            <TouchableOpacity
              key={option}
              style={[styles.option, { backgroundColor: bg, borderColor }]}
              onPress={() => handleSelect(option)}
              activeOpacity={0.75}
            >
              <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
    marginBottom: Spacing.xl,
  },
  wordCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  urduWord: {
    fontSize: 48,
    color: Colors.textPrimary,
    writingDirection: 'rtl',
    textAlign: 'center',
    fontWeight: '600',
  },
  roman: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  option: {
    width: '47%',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
