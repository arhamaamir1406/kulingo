import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MatchPairsExercise } from '../../data/types';
import { Colors, Radius, Spacing } from '../../constants/theme';

interface Props {
  exercise: MatchPairsExercise;
  onAnswer: (correct: boolean) => void;
}

type MatchState = 'idle' | 'matched' | 'wrong';

export default function MatchPairs({ exercise, onAnswer }: Props) {
  const [selectedUrdu, setSelectedUrdu] = useState<string | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ urdu: string; english: string } | null>(null);

  const pairs = exercise.pairs;
  const total = pairs.length;

  const englishOptions = React.useMemo(
    () => [...pairs.map((p) => p.english)].sort(() => Math.random() - 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise.id]
  );

  const handleUrdu = (urdu: string) => {
    if (matched.has(urdu)) return;
    setSelectedUrdu(urdu);
    setWrongPair(null);
    checkPair(urdu, selectedEnglish);
  };

  const handleEnglish = (english: string) => {
    const matchingUrdu = pairs.find((p) => p.english === english)?.urdu;
    if (matchingUrdu && matched.has(matchingUrdu)) return;
    setSelectedEnglish(english);
    setWrongPair(null);
    checkPair(selectedUrdu, english);
  };

  const checkPair = (urdu: string | null, english: string | null) => {
    if (!urdu || !english) return;
    const correctPair = pairs.find((p) => p.urdu === urdu);
    if (correctPair?.english === english) {
      const newMatched = new Set(matched).add(urdu);
      setMatched(newMatched);
      setSelectedUrdu(null);
      setSelectedEnglish(null);
      if (newMatched.size === total) setTimeout(() => onAnswer(true), 400);
    } else {
      setWrongPair({ urdu, english });
      setTimeout(() => {
        setSelectedUrdu(null);
        setSelectedEnglish(null);
        setWrongPair(null);
        onAnswer(false);
      }, 700);
    }
  };

  const getUrduState = (urdu: string): MatchState => {
    if (matched.has(urdu)) return 'matched';
    if (wrongPair?.urdu === urdu) return 'wrong';
    return 'idle';
  };

  const getEnglishState = (english: string): MatchState => {
    const urdu = pairs.find((p) => p.english === english)?.urdu;
    if (urdu && matched.has(urdu)) return 'matched';
    if (wrongPair?.english === english) return 'wrong';
    return 'idle';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      <View style={styles.grid}>
        <View style={styles.column}>
          {pairs.map((p) => {
            const state = getUrduState(p.urdu);
            const isSelected = selectedUrdu === p.urdu;
            return (
              <TouchableOpacity
                key={p.urdu}
                style={[styles.chip, chipStyle(state, isSelected)]}
                onPress={() => handleUrdu(p.urdu)}
                activeOpacity={0.8}
              >
                <Text style={[styles.urduText, textStyle(state, isSelected)]}>{p.urdu}</Text>
                <Text style={styles.roman}>{p.roman}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.column}>
          {englishOptions.map((eng) => {
            const state = getEnglishState(eng);
            const isSelected = selectedEnglish === eng;
            return (
              <TouchableOpacity
                key={eng}
                style={[styles.chip, chipStyle(state, isSelected)]}
                onPress={() => handleEnglish(eng)}
                activeOpacity={0.8}
              >
                <Text style={[styles.engText, textStyle(state, isSelected)]}>{eng}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function chipStyle(state: MatchState, selected: boolean) {
  if (state === 'matched') return { backgroundColor: Colors.correctLight, borderColor: Colors.correct, borderBottomColor: Colors.correctDark };
  if (state === 'wrong')   return { backgroundColor: Colors.incorrectLight, borderColor: Colors.incorrect, borderBottomColor: Colors.incorrectDark };
  if (selected)            return { backgroundColor: Colors.primaryLight, borderColor: Colors.primary, borderBottomColor: Colors.primaryDark };
  return { backgroundColor: Colors.white, borderColor: Colors.border, borderBottomColor: Colors.borderDark };
}

function textStyle(state: MatchState, selected: boolean) {
  if (state === 'matched') return { color: Colors.correctDark };
  if (state === 'wrong')   return { color: Colors.incorrect };
  if (selected)            return { color: Colors.primary };
  return { color: Colors.textPrimary };
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
  grid: { flexDirection: 'row', gap: Spacing.sm },
  column: { flex: 1, gap: Spacing.sm },
  chip: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 74,
  },
  urduText: { fontSize: 22, fontWeight: '600', writingDirection: 'rtl', textAlign: 'center' },
  engText:  { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  roman:    { fontSize: 11, color: Colors.textSecondary, fontStyle: 'italic', marginTop: 2 },
});
