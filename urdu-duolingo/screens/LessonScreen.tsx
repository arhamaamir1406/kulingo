import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Pressable,
  StyleSheet, SafeAreaView, StatusBar, Animated, Platform,
} from 'react-native';
import { getLessonById } from '../data/curriculum';
import { Exercise } from '../data/types';
import { useProgress } from '../store/useProgress';
import { Colors, Radius, Spacing } from '../constants/theme';
import ProgressBar from '../components/ProgressBar';
import Mascot from '../components/Mascot';
import Confetti from '../components/Confetti';
import MultipleChoice from '../components/exercises/MultipleChoice';
import MatchPairs from '../components/exercises/MatchPairs';
import TapWords from '../components/exercises/TapWords';
import TranslateExercise from '../components/exercises/TranslateExercise';

interface Props { route: any; navigation: any }
type ResultState = 'none' | 'correct' | 'incorrect';

function darken(hex: string, amt = 40) {
  const r = Math.max(0,parseInt(hex.slice(1,3),16)-amt);
  const g = Math.max(0,parseInt(hex.slice(3,5),16)-amt);
  const b = Math.max(0,parseInt(hex.slice(5,7),16)-amt);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

export default function LessonScreen({ route, navigation }: Props) {
  const { lessonId, unitId, unitColor } = route.params;
  const found = getLessonById(lessonId);
  const { completeLesson, loseHeart, hearts } = useProgress();

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [result, setResult] = useState<ResultState>('none');
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Slide-up animation for result banner
  const bannerSlide = useRef(new Animated.Value(120)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;

  // Shake animation for wrong answer
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Mascot bob on complete screen
  const mascotBob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (finished) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(mascotBob, { toValue:-8, duration:900, useNativeDriver:true }),
          Animated.timing(mascotBob, { toValue: 8, duration:900, useNativeDriver:true }),
        ])
      ).start();
    }
  }, [finished]);

  if (!found) return <View style={styles.center}><Text>Lesson not found</Text></View>;

  const { lesson } = found;
  const exercises = lesson.exercises;
  const current   = exercises[exerciseIndex];
  const progress  = exerciseIndex / exercises.length;
  const accent    = unitColor || Colors.primary;

  const showBanner = () => {
    Animated.parallel([
      Animated.spring(bannerSlide, { toValue:0, useNativeDriver:true, tension:90, friction:11 }),
      Animated.timing(bannerOpacity, { toValue:1, duration:180, useNativeDriver:true }),
    ]).start();
  };

  const hideBanner = () => {
    bannerSlide.setValue(120);
    bannerOpacity.setValue(0);
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration:60, useNativeDriver:true }),
      Animated.timing(shakeAnim, { toValue:-10, duration:60, useNativeDriver:true }),
      Animated.timing(shakeAnim, { toValue: 8,  duration:60, useNativeDriver:true }),
      Animated.timing(shakeAnim, { toValue:-8,  duration:60, useNativeDriver:true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration:60, useNativeDriver:true }),
    ]).start();
  };

  const handleAnswer = useCallback(async (correct: boolean) => {
    if (result !== 'none') return;
    setResult(correct ? 'correct' : 'incorrect');
    if (correct) {
      setCorrectCount(c => c+1);
    } else {
      shake();
      await loseHeart();
    }
    showBanner();
  }, [result, loseHeart]);

  const handleContinue = async () => {
    hideBanner();
    if (exerciseIndex + 1 >= exercises.length) {
      const finalCorrect = correctCount + (result === 'correct' ? 1 : 0);
      const score = Math.round((finalCorrect / exercises.length) * 100);
      await completeLesson(lessonId, score, lesson.xpReward);
      setShowConfetti(true);
      setFinished(true);
    } else {
      setExerciseIndex(i => i+1);
      setResult('none');
    }
  };

  // ── LESSON COMPLETE ──────────────────────────────────────────────────────
  if (finished) {
    const totalScore = correctCount + (result === 'correct' ? 1 : 0);
    const pct   = Math.round((totalScore / exercises.length) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    const webAccentGrad: any = Platform.OS === 'web'
      ? { background:`linear-gradient(160deg, ${accent}dd 0%, ${accent} 100%)` }
      : { backgroundColor: accent };

    return (
      <SafeAreaView style={styles.safe}>
        <Confetti visible={showConfetti}/>

        <View style={styles.completeWrap}>
          {/* animated mascot */}
          <Animated.View style={{ transform:[{translateY:mascotBob}], marginBottom:Spacing.lg }}>
            <Mascot size={110}/>
          </Animated.View>

          {/* card */}
          <View style={[styles.completeCard, { borderColor: accent+'55' }]}>
            <Text style={styles.completeTitle}>Lesson Complete!</Text>
            <Text style={styles.completeSub}>{lesson.title}</Text>

            <View style={styles.starsRow}>
              {[1,2,3].map(s=>(
                <Text key={s} style={{ fontSize:36, opacity:s<=stars?1:0.15, marginHorizontal:4 }}>⭐</Text>
              ))}
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.statBox,{ borderColor:Colors.correct }]}>
                <Text style={[styles.statVal,{ color:Colors.correctDark }]}>{totalScore}/{exercises.length}</Text>
                <Text style={styles.statLbl}>Correct</Text>
              </View>
              <View style={[styles.statBox,{ borderColor:Colors.xpBlue }]}>
                <Text style={[styles.statVal,{ color:Colors.xpBlue }]}>+{lesson.xpReward}</Text>
                <Text style={styles.statLbl}>XP</Text>
              </View>
              <View style={[styles.statBox,{ borderColor:Colors.gold }]}>
                <Text style={[styles.statVal,{ color:Colors.gold }]}>{pct}%</Text>
                <Text style={styles.statLbl}>Score</Text>
              </View>
            </View>
          </View>

          {/* continue button */}
          <Pressable
            style={({ pressed }) => [
              styles.continueBtn,
              webAccentGrad,
              { borderBottomColor: darken(accent,40) },
              pressed && { transform:[{translateY:4}], borderBottomWidth:0 },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueBtnTxt}>CONTINUE  🎉</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── ACTIVE LESSON ────────────────────────────────────────────────────────
  const webProgressGrad: any = Platform.OS === 'web'
    ? { background:`linear-gradient(90deg, ${accent} 0%, ${accent}cc 100%)` }
    : {};

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white}/>

      {/* top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>
        <ProgressBar progress={progress} color={accent}/>
        <View style={styles.heartPill}>
          <Text style={styles.heartTxt}>❤️ {hearts}</Text>
        </View>
      </View>

      {/* exercise */}
      <Animated.View style={[styles.exerciseArea,{ transform:[{translateX:shakeAnim}] }]}>
        {renderExercise(current, handleAnswer, result)}
      </Animated.View>

      {/* result banner – slides up */}
      {result !== 'none' && (
        <Animated.View
          style={[
            styles.resultBanner,
            result === 'correct' ? styles.correctBanner : styles.incorrectBanner,
            { transform:[{translateY:bannerSlide}], opacity:bannerOpacity },
          ]}
        >
          {/* left: emoji + text */}
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerEmoji}>{result==='correct'?'🎉':'💔'}</Text>
            <View>
              <Text style={[styles.bannerTitle,{ color:result==='correct'?Colors.correctDark:Colors.incorrect }]}>
                {result==='correct' ? 'Excellent!' : 'Oops!'}
              </Text>
              <Text style={styles.bannerSub}>
                {result==='correct' ? 'Keep it up!' : "You've got this!"}
              </Text>
            </View>
          </View>

          {/* continue / finish */}
          <Pressable
            style={({ pressed }) => [
              styles.nextBtn,
              {
                backgroundColor: result==='correct' ? Colors.correct : Colors.incorrect,
                borderBottomColor: result==='correct' ? Colors.correctDark : Colors.incorrectDark,
              },
              pressed && { transform:[{translateY:3}], borderBottomWidth:0 },
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.nextBtnTxt}>
              {exerciseIndex+1 >= exercises.length ? 'FINISH' : 'CONTINUE'}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

function renderExercise(ex: Exercise, onAnswer:(c:boolean)=>void, result:ResultState) {
  const h = result !== 'none' ? () => {} : onAnswer;
  switch (ex.type) {
    case 'multipleChoice': return <MultipleChoice exercise={ex} onAnswer={h}/>;
    case 'matchPairs':     return <MatchPairs exercise={ex} onAnswer={h}/>;
    case 'tapWords':       return <TapWords exercise={ex} onAnswer={h}/>;
    case 'translate':      return <TranslateExercise exercise={ex} onAnswer={h}/>;
    default: return null;
  }
}

const styles = StyleSheet.create({
  safe:   { flex:1, backgroundColor:Colors.white },
  center: { flex:1, alignItems:'center', justifyContent:'center' },

  /* top bar */
  topBar: {
    flexDirection:'row', alignItems:'center',
    paddingHorizontal:Spacing.md, paddingVertical:Spacing.sm+2,
    gap:Spacing.sm, borderBottomWidth:2, borderBottomColor:Colors.border,
  },
  closeBtn: {
    width:40, height:40, borderRadius:20,
    backgroundColor:Colors.backgroundAlt, alignItems:'center', justifyContent:'center',
  },
  closeX: { fontSize:15, color:Colors.textSecondary, fontWeight:'800' },
  heartPill: {
    backgroundColor:Colors.incorrectLight, borderRadius:Radius.full,
    paddingHorizontal:Spacing.sm+2, paddingVertical:4,
  },
  heartTxt: { fontSize:14, fontWeight:'800', color:Colors.heartRed },

  exerciseArea: { flex:1, paddingTop:Spacing.xl },

  /* result banner */
  resultBanner: {
    padding:Spacing.lg, paddingBottom:Spacing.xxl,
    borderTopWidth:3, flexDirection:'row',
    alignItems:'center', justifyContent:'space-between', gap:Spacing.md,
  },
  correctBanner:   { backgroundColor:Colors.correctLight,   borderTopColor:Colors.correct },
  incorrectBanner: { backgroundColor:Colors.incorrectLight, borderTopColor:Colors.incorrect },
  bannerLeft: { flexDirection:'row', alignItems:'center', gap:Spacing.md, flex:1 },
  bannerEmoji: { fontSize:36 },
  bannerTitle: { fontSize:20, fontWeight:'900' },
  bannerSub:   { fontSize:13, color:Colors.textSecondary, marginTop:2 },
  nextBtn: {
    borderRadius:Radius.lg, paddingHorizontal:Spacing.xl,
    paddingVertical:Spacing.md+2, borderBottomWidth:4,
  },
  nextBtnTxt: { color:Colors.white, fontWeight:'900', fontSize:15, letterSpacing:0.8 },

  /* complete screen */
  completeWrap: {
    flex:1, alignItems:'center', justifyContent:'center',
    paddingHorizontal:Spacing.xl, backgroundColor:Colors.white,
  },
  completeCard: {
    width:'100%', backgroundColor:Colors.white, borderRadius:Radius.xl,
    padding:Spacing.xl, alignItems:'center', borderWidth:3,
    marginBottom:Spacing.xl,
    shadowColor:'rgba(0,0,0,0.12)', shadowOffset:{width:0,height:6},
    shadowOpacity:1, shadowRadius:16, elevation:10,
  },
  completeTitle: { fontSize:30, fontWeight:'900', color:Colors.textPrimary },
  completeSub:   { fontSize:15, color:Colors.textSecondary, marginTop:4, textAlign:'center' },
  starsRow: { flexDirection:'row', marginVertical:Spacing.lg },
  statsRow: { flexDirection:'row', gap:Spacing.sm, width:'100%' },
  statBox: {
    flex:1, backgroundColor:Colors.backgroundAlt,
    borderRadius:Radius.lg, padding:Spacing.md,
    alignItems:'center', borderWidth:2, borderBottomWidth:4,
  },
  statVal: { fontSize:22, fontWeight:'900' },
  statLbl: { fontSize:11, color:Colors.textSecondary, marginTop:3, fontWeight:'600' },
  continueBtn: {
    width:'100%', borderRadius:Radius.xl,
    paddingVertical:Spacing.lg+2, alignItems:'center', borderBottomWidth:5,
    shadowColor:'rgba(0,0,0,0.2)', shadowOffset:{width:0,height:5},
    shadowOpacity:1, shadowRadius:10, elevation:8,
  },
  continueBtnTxt: { color:Colors.white, fontWeight:'900', fontSize:19, letterSpacing:1 },
});
