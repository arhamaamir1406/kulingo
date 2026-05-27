import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, LessonProgress } from '../data/types';

const STORAGE_KEY = '@urdu_progress';
const MAX_HEARTS = 5;

interface ProgressStore extends UserProgress {
  isLoaded: boolean;
  loadProgress: () => Promise<void>;
  checkStreak: (progress: UserProgress) => void;
  completeLesson: (lessonId: string, score: number, xpReward: number) => Promise<void>;
  loseHeart: () => Promise<void>;
  gainHearts: (count: number) => Promise<void>;
  resetHearts: () => Promise<void>;
  isLessonUnlocked: (unitId: string, lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonStars: (lessonId: string) => number;
}

const defaultProgress: UserProgress = {
  completedLessons: {},
  xp: 0,
  hearts: MAX_HEARTS,
  streak: 0,
  lastStreakDate: null,
  longestStreak: 0,
};

export const useProgress = create<ProgressStore>((set, get) => ({
  ...defaultProgress,
  isLoaded: false,

  loadProgress: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProgress;
        set({ ...parsed, isLoaded: true });
        get().checkStreak(parsed);
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  checkStreak: (progress: UserProgress) => {
    const today = new Date().toDateString();
    const last = progress.lastStreakDate;
    if (!last) return;
    const lastDate = new Date(last);
    const diffDays = Math.floor((Date.now() - lastDate.getTime()) / 86400000);
    if (diffDays > 1) {
      const updated = { ...progress, streak: 0 };
      set(updated);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  },

  completeLesson: async (lessonId, score, xpReward) => {
    const state = get();
    const today = new Date().toDateString();
    const existing = state.completedLessons[lessonId];
    const stars = score >= 90 ? 3 : score >= 60 ? 2 : 1;

    const lessonProgress: LessonProgress = {
      completed: true,
      stars: Math.max(stars, existing?.stars ?? 0),
      bestScore: Math.max(score, existing?.bestScore ?? 0),
    };

    let newStreak = state.streak;
    let newLongest = state.longestStreak;
    const isNewDay = state.lastStreakDate !== today;
    if (isNewDay) {
      newStreak += 1;
      newLongest = Math.max(newStreak, newLongest);
    }

    const updated: UserProgress = {
      completedLessons: { ...state.completedLessons, [lessonId]: lessonProgress },
      xp: state.xp + xpReward,
      hearts: state.hearts,
      streak: newStreak,
      lastStreakDate: today,
      longestStreak: newLongest,
    };

    set(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  loseHeart: async () => {
    const state = get();
    if (state.hearts <= 0) return;
    const updated = { ...state, hearts: state.hearts - 1 };
    set({ hearts: updated.hearts });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, hearts: updated.hearts }));
  },

  gainHearts: async (count) => {
    const state = get();
    const updated = { ...state, hearts: Math.min(state.hearts + count, MAX_HEARTS) };
    set({ hearts: updated.hearts });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  resetHearts: async () => {
    const state = get();
    const updated = { ...state, hearts: MAX_HEARTS };
    set({ hearts: MAX_HEARTS });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  isLessonUnlocked: (unitId, lessonId) => {
    const { CURRICULUM } = require('../data/curriculum');
    const { completedLessons } = get();

    const unit = CURRICULUM.find((u: any) => u.id === unitId);
    if (!unit) return false;

    const lessonIndex = unit.lessons.findIndex((l: any) => l.id === lessonId);
    if (lessonIndex === 0) {
      const unitIndex = CURRICULUM.findIndex((u: any) => u.id === unitId);
      if (unitIndex === 0) return true;
      const prevUnit = CURRICULUM[unitIndex - 1];
      const lastLesson = prevUnit.lessons[prevUnit.lessons.length - 1];
      return !!completedLessons[lastLesson.id]?.completed;
    }

    const prevLesson = unit.lessons[lessonIndex - 1];
    return !!completedLessons[prevLesson.id]?.completed;
  },

  isLessonCompleted: (lessonId) => {
    return !!get().completedLessons[lessonId]?.completed;
  },

  getLessonStars: (lessonId) => {
    return get().completedLessons[lessonId]?.stars ?? 0;
  },
}));

export { MAX_HEARTS };
