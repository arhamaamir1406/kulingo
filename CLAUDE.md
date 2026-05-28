# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Critical:** Expo's APIs change significantly between versions. Always read the versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any Expo-specific code (this project uses Expo 54 / React Native 0.81).

## Commands

All commands must be run from the `urdu-duolingo/` subdirectory.

```bash
cd urdu-duolingo
npm start          # Start Expo dev server (scan QR with Expo Go)
npm run android    # Open on Android emulator
npm run ios        # Open on iOS simulator (Mac only)
npm run web        # Open in browser
```

There is no test suite configured.

## Architecture

### Directory layout (inside `urdu-duolingo/`)

```
App.tsx              # Root: NavigationContainer + Tab + Stack navigators
store/
  useProgress.ts     # Zustand store — all user state (XP, hearts, streak, completedLessons)
data/
  types.ts           # All TypeScript interfaces (Unit, Lesson, Exercise subtypes, UserProgress)
  curriculum.ts      # CURRICULUM constant + getLessonById / getNextLesson helpers
screens/
  HomeScreen.tsx     # Lesson path map (units → zigzag nodes)
  LessonScreen.tsx   # Exercise runner (progress bar, result banner, confetti on complete)
  ProfileScreen.tsx  # Stats display
components/
  exercises/         # One component per exercise type
    MultipleChoice.tsx
    TapWords.tsx
    MatchPairs.tsx
    TranslateExercise.tsx
  Mascot.tsx / Confetti.tsx / ProgressBar.tsx / Hearts.tsx / StreakBadge.tsx
constants/
  theme.ts           # Colors, Spacing, Radius, Fonts tokens
```

### Navigation

`App.tsx` wires a bottom-tab navigator (Learn, Profile) where "Learn" is itself a stack containing `HomeScreen` and `LessonScreen`. `LessonScreen` is presented as a modal and receives `{ lessonId, unitId, unitColor }` route params.

### State management

`store/useProgress.ts` is a single Zustand store that persists everything to AsyncStorage under the key `@urdu_progress`. It exposes:
- `completeLesson(lessonId, score, xpReward)` — awards XP, stars (90%=3★, 60%=2★, else 1★), advances streak
- `loseHeart()` / `gainHearts()` / `resetHearts()` — heart management (max 5)
- `isLessonUnlocked(unitId, lessonId)` — sequential unlock logic (first lesson of unit 1 is always open; otherwise previous lesson must be completed)
- `loadProgress()` — must be called once on mount (HomeScreen calls it)

### Curriculum data model

`data/curriculum.ts` exports `CURRICULUM: Unit[]`. Each `Unit` has `lessons: Lesson[]`. Each `Lesson` has `exercises: Exercise[]`. The `Exercise` union (`data/types.ts`) has four variants:

| type | key fields |
|---|---|
| `multipleChoice` | `urduWord?`, `roman?`, `correctAnswer`, `options[]` |
| `tapWords` | `correctAnswer: string[]`, `wordBank: string[]` |
| `matchPairs` | `pairs[]: { urdu, roman, english }` |
| `translate` | `sourceText`, `sourceLanguage`, `correctAnswer`, `acceptedAnswers[]` |

Checkpoint lessons have `isCheckpoint: true` and award 20 XP (vs 10 for regular lessons).

### Styling conventions

All visual tokens live in `constants/theme.ts` (`Colors`, `Spacing`, `Radius`). Components use `StyleSheet.create`. The brand color is red (`#FF3333`) replacing Duolingo's green. Urdu text is rendered RTL via `writingDirection: 'rtl'`. The `babel.config.js` includes the `react-native-reanimated/plugin` required by Reanimated 4.
