export type ExerciseType = 'multipleChoice' | 'tapWords' | 'matchPairs' | 'translate';

export interface VocabItem {
  id: string;
  urdu: string;
  roman: string;
  english: string;
}

export interface MultipleChoiceExercise {
  type: 'multipleChoice';
  id: string;
  prompt: string;
  urduWord?: string;
  roman?: string;
  correctAnswer: string;
  options: string[];
}

export interface TapWordsExercise {
  type: 'tapWords';
  id: string;
  prompt: string;
  correctAnswer: string[];
  wordBank: string[];
}

export interface MatchPairsExercise {
  type: 'matchPairs';
  id: string;
  prompt: string;
  pairs: { urdu: string; roman: string; english: string }[];
}

export interface TranslateExercise {
  type: 'translate';
  id: string;
  prompt: string;
  sourceText: string;
  sourceLanguage: 'urdu' | 'english';
  correctAnswer: string;
  acceptedAnswers: string[];
}

export type Exercise =
  | MultipleChoiceExercise
  | TapWordsExercise
  | MatchPairsExercise
  | TranslateExercise;

export interface Lesson {
  id: string;
  title: string;
  icon: string;
  xpReward: number;
  exercises: Exercise[];
  isCheckpoint?: boolean;
}

export interface Unit {
  id: string;
  title: string;
  titleUrdu: string;
  color: string;
  icon: string;
  lessons: Lesson[];
}

export interface LessonProgress {
  completed: boolean;
  stars: number;
  bestScore: number;
}

export interface UserProgress {
  completedLessons: Record<string, LessonProgress>;
  xp: number;
  hearts: number;
  streak: number;
  lastStreakDate: string | null;
  longestStreak: number;
}
