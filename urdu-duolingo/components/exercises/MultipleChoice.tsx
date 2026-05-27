import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { MultipleChoiceExercise } from '../../data/types';
import { Colors, Radius, Spacing } from '../../constants/theme';

interface Props {
  exercise: MultipleChoiceExercise;
  onAnswer: (correct: boolean) => void;
}

function darken(hex: string, amt = 40) {
  const r = Math.max(0,parseInt(hex.slice(1,3),16)-amt);
  const g = Math.max(0,parseInt(hex.slice(3,5),16)-amt);
  const b = Math.max(0,parseInt(hex.slice(5,7),16)-amt);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

export default function MultipleChoice({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    setTimeout(() => onAnswer(option === exercise.correctAnswer), 750);
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

      <View style={styles.options}>
        {exercise.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect  = option === exercise.correctAnswer;

          // Determine visual state
          let bg          = Colors.white;
          let border      = Colors.border;
          let borderBot   = Colors.borderDark;
          let textColor   = Colors.textPrimary;
          let webGrad: any = {};

          if (isSelected) {
            if (isCorrect) {
              bg = Colors.correctLight; border = Colors.correct;
              borderBot = Colors.correctDark; textColor = Colors.correctDark;
            } else {
              bg = Colors.incorrectLight; border = Colors.incorrect;
              borderBot = Colors.incorrectDark; textColor = Colors.incorrect;
            }
          } else if (selected && isCorrect) {
            bg = Colors.correctLight; border = Colors.correct;
            borderBot = Colors.correctDark; textColor = Colors.correctDark;
          }

          return (
            <Pressable
              key={option}
              onPress={() => handleSelect(option)}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: bg,
                  borderColor: border,
                  borderBottomColor: borderBot,
                },
                // Physical 3-D press — border collapses and button sinks 4 px
                !selected && pressed && styles.optionPressed,
              ]}
            >
              {/* Leading indicator dot for selected state */}
              {isSelected && (
                <View style={[
                  styles.dot,
                  { backgroundColor: isCorrect ? Colors.correct : Colors.incorrect }
                ]}/>
              )}
              <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
              {/* trailing tick / cross */}
              {isSelected && (
                <Text style={styles.trailIcon}>{isCorrect ? '✓' : '✗'}</Text>
              )}
            </Pressable>
          );
        })}
      </View>
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
    letterSpacing: 0.2,
  },

  wordCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: Colors.border,
    borderBottomColor: Colors.borderDark,
  },
  urduWord: {
    fontSize: 54,
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

  options: { gap: Spacing.sm + 2 },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.lg,
    borderWidth: 2,
    borderBottomWidth: 5,          // ← Duolingo 3-D shadow border
    minHeight: 66,
    gap: Spacing.sm,
  },

  // When physically pressed: sink 4 px and lose bottom border
  optionPressed: {
    transform: [{ translateY: 4 }],
    borderBottomWidth: 1,
  },

  dot: {
    width: 10, height: 10, borderRadius: 5, flexShrink: 0,
  },
  optionText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  trailIcon: {
    fontSize: 18, fontWeight: '900', flexShrink: 0,
  },
});
