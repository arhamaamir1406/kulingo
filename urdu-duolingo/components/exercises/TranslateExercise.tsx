import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TranslateExercise as TranslateExerciseType } from '../../data/types';
import { Colors, Radius, Spacing } from '../../constants/theme';

interface Props {
  exercise: TranslateExerciseType;
  onAnswer: (correct: boolean) => void;
}

export default function TranslateExercise({ exercise, onAnswer }: Props) {
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);

  const handleCheck = () => {
    if (!input.trim() || answered) return;
    setAnswered(true);
    const normalized = input.trim().toLowerCase();
    const isCorrect = exercise.acceptedAnswers.some((a) => a.toLowerCase() === normalized);
    setTimeout(() => onAnswer(isCorrect), 750);
  };

  const isCorrect =
    answered &&
    exercise.acceptedAnswers.some((a) => a.toLowerCase() === input.trim().toLowerCase());

  const isUrdu = exercise.sourceLanguage === 'urdu';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      <View style={styles.sourceCard}>
        <Text style={[styles.sourceText, isUrdu && styles.urduText]}>{exercise.sourceText}</Text>
      </View>

      <TextInput
        style={[
          styles.input,
          answered && (isCorrect ? styles.inputCorrect : styles.inputIncorrect),
        ]}
        value={input}
        onChangeText={setInput}
        placeholder="Type your answer…"
        placeholderTextColor={Colors.textLight}
        editable={!answered}
        onSubmitEditing={handleCheck}
        returnKeyType="done"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {answered && (
        <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
          <Text style={[styles.feedbackText, { color: isCorrect ? Colors.correctDark : Colors.incorrect }]}>
            {isCorrect ? '✓ Correct!' : `✗ Correct: ${exercise.correctAnswer}`}
          </Text>
        </View>
      )}

      {!answered && (
        <TouchableOpacity
          style={[styles.checkBtn, !input.trim() && styles.checkBtnDisabled]}
          onPress={handleCheck}
          disabled={!input.trim()}
        >
          <Text style={styles.checkBtnText}>CHECK</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg },
  prompt: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  sourceCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: Colors.border,
    borderBottomColor: Colors.borderDark,
  },
  sourceText: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  urduText: { fontSize: 44, writingDirection: 'rtl' },
  input: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: Colors.border,
    borderBottomColor: Colors.borderDark,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    fontSize: 18,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
  inputCorrect: { borderColor: Colors.correct, borderBottomColor: Colors.correctDark, backgroundColor: Colors.correctLight },
  inputIncorrect: { borderColor: Colors.incorrect, borderBottomColor: Colors.incorrectDark, backgroundColor: Colors.incorrectLight },
  feedback: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  feedbackCorrect: { backgroundColor: Colors.correctLight },
  feedbackIncorrect: { backgroundColor: Colors.incorrectLight },
  feedbackText: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  checkBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
    padding: Spacing.md,
    alignItems: 'center',
  },
  checkBtnDisabled: {
    backgroundColor: Colors.backgroundAlt,
    borderBottomColor: Colors.border,
  },
  checkBtnText: { color: Colors.white, fontWeight: '900', fontSize: 17, letterSpacing: 1 },
});
