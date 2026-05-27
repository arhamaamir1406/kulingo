import React, { useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, SafeAreaView, StatusBar, Animated, Platform,
} from 'react-native';
import { CURRICULUM } from '../data/curriculum';
import { useProgress } from '../store/useProgress';
import { Colors, Radius, Spacing } from '../constants/theme';
import Mascot from '../components/Mascot';

interface Props { navigation: any }

// ─── colour helpers ──────────────────────────────────────────────────────────
function darken(hex: string, amt = 40) {
  const r = Math.max(0, parseInt(hex.slice(1,3),16)-amt);
  const g = Math.max(0, parseInt(hex.slice(3,5),16)-amt);
  const b = Math.max(0, parseInt(hex.slice(5,7),16)-amt);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}
function lighten(hex: string, amt = 40) {
  const r = Math.min(255, parseInt(hex.slice(1,3),16)+amt);
  const g = Math.min(255, parseInt(hex.slice(3,5),16)+amt);
  const b = Math.min(255, parseInt(hex.slice(5,7),16)+amt);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// [leftFlex, rightFlex] zigzag
function getFlexes(idx: number, checkpoint: boolean): [number,number] {
  if (checkpoint) return [1,1];
  const p:[number,number][] = [[2,2],[4,1],[5,1],[2,2],[1,5],[1,4]];
  return p[idx % p.length];
}

// ─── Pulsing wrapper for the active node ─────────────────────────────────────
function PulsingNode({ active, children }: { active:boolean; children:React.ReactNode }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!active) { scale.setValue(1); return; }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale,{ toValue:1.08, duration:700, useNativeDriver:true }),
        Animated.timing(scale,{ toValue:1,    duration:700, useNativeDriver:true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [active]);
  return <Animated.View style={{ transform:[{scale}] }}>{children}</Animated.View>;
}

// ─── "Continue Learning" hero card ───────────────────────────────────────────
function ContinueCard({
  lessonTitle, lessonIcon, unitColor, unitName, onPress,
}: { lessonTitle:string; lessonIcon:string; unitColor:string; unitName:string; onPress:()=>void }) {
  const webGrad: any = Platform.OS==='web'
    ? { background:`linear-gradient(135deg, ${lighten(unitColor,45)} 0%, ${unitColor} 55%, ${darken(unitColor,15)} 100%)` }
    : { backgroundColor: unitColor };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.continueCard,
        webGrad,
        { borderBottomColor: darken(unitColor,40) },
        pressed && { transform:[{translateY:4}], borderBottomWidth:0 },
      ]}
    >
      {/* decorative circles */}
      <View style={[styles.deco1,{borderColor:'rgba(255,255,255,0.18)'}]}/>
      <View style={[styles.deco2,{borderColor:'rgba(255,255,255,0.1)'}]}/>

      <View style={styles.continueIconWrap}>
        <Text style={styles.continueIcon}>{lessonIcon}</Text>
      </View>
      <View style={styles.continueText}>
        <Text style={styles.continueLabel}>CONTINUE LEARNING</Text>
        <Text style={styles.continueTitle} numberOfLines={1}>{lessonTitle}</Text>
        <Text style={styles.continueSub}>{unitName}</Text>
      </View>
      <View style={styles.goBadge}>
        <Text style={styles.goText}>GO!</Text>
      </View>
    </Pressable>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
const NODE  = 78;
const CHKPT = 92;

export default function HomeScreen({ navigation }: Props) {
  const {
    isLoaded, loadProgress, xp, hearts, streak,
    isLessonUnlocked, isLessonCompleted, getLessonStars,
  } = useProgress();

  useEffect(() => { if (!isLoaded) loadProgress(); }, []);

  // Animated streak flame wiggle
  const flame = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flame, { toValue:-1, duration:450, useNativeDriver:true }),
        Animated.timing(flame, { toValue: 1, duration:450, useNativeDriver:true }),
        Animated.timing(flame, { toValue: 0, duration:200, useNativeDriver:true }),
        Animated.delay(2200),
      ])
    ).start();
  }, []);
  const flameRot = flame.interpolate({ inputRange:[-1,0,1], outputRange:['-12deg','0deg','12deg'] });

  // Mascot gentle bob
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue:-6, duration:1100, useNativeDriver:true }),
        Animated.timing(bob, { toValue: 6, duration:1100, useNativeDriver:true }),
      ])
    ).start();
  }, []);

  // Find first active lesson
  let firstActiveLesson: { id:string; title:string; icon:string; unitColor:string; unitName:string; unitId:string } | null = null;
  outer: for (const unit of CURRICULUM) {
    for (const lesson of unit.lessons) {
      if (isLessonUnlocked(unit.id,lesson.id) && !isLessonCompleted(lesson.id)) {
        firstActiveLesson = {
          id: lesson.id, title: lesson.title, icon: lesson.icon,
          unitColor: unit.color, unitName: unit.title, unitId: unit.id,
        };
        break outer;
      }
    }
  }

  const goToLesson = useCallback((lessonId:string, unitId:string, unitColor:string) => {
    navigation.navigate('Lesson',{ lessonId, unitId, unitColor });
  },[navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white}/>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.flag}>🇵🇰</Text>
          <Text style={styles.lang}>URDU</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Streak with animated flame */}
          <View style={styles.pill}>
            <Animated.Text style={[styles.pillIcon,{ transform:[{rotate:flameRot}] }]}>🔥</Animated.Text>
            <Text style={[styles.pillNum,{ color:Colors.streakOrange }]}>{streak}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillIcon}>⚡</Text>
            <Text style={[styles.pillNum,{ color:Colors.xpBlue }]}>{xp}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillIcon}>❤️</Text>
            <Text style={[styles.pillNum,{ color:Colors.heartRed }]}>{hearts}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── CONTINUE CARD ── */}
        {firstActiveLesson && (
          <ContinueCard
            lessonTitle={firstActiveLesson.title}
            lessonIcon={firstActiveLesson.icon}
            unitColor={firstActiveLesson.unitColor}
            unitName={firstActiveLesson.unitName}
            onPress={() => goToLesson(firstActiveLesson!.id, firstActiveLesson!.unitId, firstActiveLesson!.unitColor)}
          />
        )}

        {/* ── MASCOT GREETING ── */}
        <View style={styles.greetRow}>
          <Animated.View style={{ transform:[{translateY:bob}] }}>
            <Mascot size={72}/>
          </Animated.View>
          <View style={styles.bubble}>
            <Text style={styles.bubbleHi}>Hey there! 👋</Text>
            <Text style={styles.bubbleSub}>I'm Karo. Let's learn Urdu!</Text>
          </View>
        </View>

        {/* ── UNITS ── */}
        {CURRICULUM.map((unit, uIdx) => {
          const locked = !isLessonUnlocked(unit.id, unit.lessons[0].id);

          const webBannerGrad: any = Platform.OS==='web'
            ? { background:`linear-gradient(135deg, ${lighten(unit.color,30)} 0%, ${unit.color} 100%)` }
            : { backgroundColor: unit.color };

          return (
            <View key={unit.id} style={[styles.unitCard, locked && { opacity:0.6 }]}>

              {/* UNIT BANNER */}
              <View style={[styles.banner, webBannerGrad, { borderBottomColor: darken(unit.color,30) }]}>
                {/* decorative bg circles */}
                <View style={styles.bannerDeco1}/>
                <View style={styles.bannerDeco2}/>

                <View style={styles.bannerBody}>
                  <Text style={styles.bannerSection}>SECTION {uIdx+1}</Text>
                  <Text style={styles.bannerTitle}>{unit.title}</Text>
                  <Text style={styles.bannerUrdu}>{unit.titleUrdu}</Text>
                </View>
                <View style={[styles.bannerBadge]}>
                  <Text style={styles.bannerIcon}>{unit.icon}</Text>
                </View>
                {locked && <View style={styles.lockDot}><Text>🔒</Text></View>}
              </View>

              {/* PATH NODES */}
              <View style={styles.path}>
                {unit.lessons.map((lesson, lIdx) => {
                  const unlocked  = isLessonUnlocked(unit.id,lesson.id);
                  const completed = isLessonCompleted(lesson.id);
                  const stars     = getLessonStars(lesson.id);
                  const isActive  = firstActiveLesson?.id === lesson.id;
                  const [lf,rf]   = getFlexes(lIdx, !!lesson.isCheckpoint);
                  const nSize     = lesson.isCheckpoint ? CHKPT : NODE;
                  const nodeBg    = completed ? darken(unit.color,10) : unlocked ? unit.color : '#CACACA';
                  const nodeBorder= completed ? darken(unit.color,35) : unlocked ? darken(unit.color,45) : '#999';

                  // Connector dots before this node (except first)
                  let dotLf=lf, dotRf=rf;
                  if (lIdx>0) {
                    const [plf,prf] = getFlexes(lIdx-1, !!unit.lessons[lIdx-1].isCheckpoint);
                    dotLf = (lf+plf)/2;
                    dotRf = (rf+prf)/2;
                  }

                  return (
                    <View key={lesson.id}>
                      {/* connector dots */}
                      {lIdx>0 && (
                        <View style={styles.dotRow}>
                          <View style={{ flex: dotLf }}/>
                          <View style={styles.dotCol}>
                            {[0,1,2].map(d=>(
                              <View key={d} style={[styles.dot,{ backgroundColor: unlocked ? unit.color : '#CACACA' }]}/>
                            ))}
                          </View>
                          <View style={{ flex: dotRf }}/>
                        </View>
                      )}

                      {/* node row */}
                      <View style={styles.pathRow}>
                        {lf>0 && <View style={{ flex:lf }}/>}

                        <View style={styles.nodeWrap}>
                          {/* Karo above active node */}
                          {isActive && (
                            <View style={styles.karoAbove}>
                              <Mascot size={30}/>
                            </View>
                          )}

                          <PulsingNode active={isActive ?? false}>
                            <TouchableOpacity
                              style={[
                                styles.node,
                                {
                                  width: nSize, height: nSize,
                                  borderRadius: nSize/2,
                                  backgroundColor: nodeBg,
                                  borderBottomColor: nodeBorder,
                                },
                                isActive && { ...styles.activeGlow, shadowColor: unit.color },
                                completed && styles.completedNode,
                              ]}
                              onPress={() => unlocked && goToLesson(lesson.id, unit.id, unit.color)}
                              activeOpacity={unlocked ? 0.82 : 1}
                            >
                              {completed && (
                                <View style={styles.checkOverlay}>
                                  <Text style={styles.checkMark}>✓</Text>
                                </View>
                              )}
                              <Text style={[styles.nodeIcon, { fontSize: lesson.isCheckpoint ? 36 : 30 }]}>
                                {!unlocked ? '🔒' : lesson.isCheckpoint ? '🏆' : lesson.icon}
                              </Text>
                            </TouchableOpacity>
                          </PulsingNode>

                          {/* stars row */}
                          {completed && (
                            <View style={styles.starsRow}>
                              {[1,2,3].map(s=>(
                                <Text key={s} style={{ fontSize:11, opacity: s<=stars ? 1 : 0.15 }}>⭐</Text>
                              ))}
                            </View>
                          )}

                          {/* START / CHALLENGE badge */}
                          {isActive && (
                            <View style={[styles.ctaBadge,{ backgroundColor:unit.color, borderBottomColor:darken(unit.color,35) }]}>
                              <Text style={styles.ctaText}>
                                {lesson.isCheckpoint ? 'CHALLENGE' : 'START'}
                              </Text>
                            </View>
                          )}
                        </View>

                        {rf>0 && <View style={{ flex:rf }}/>}
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Unit complete trophy */}
              {unit.lessons.every(l => isLessonCompleted(l.id)) && (
                <View style={[styles.unitComplete,{ borderColor:unit.color+'55' }]}>
                  <Text style={styles.unitCompleteEmoji}>🎉</Text>
                  <Text style={[styles.unitCompleteText,{ color:unit.color }]}>Unit Complete!</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height:80 }}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor:'#F2F2F2' },

  /* header */
  header: {
    flexDirection:'row', justifyContent:'space-between', alignItems:'center',
    paddingHorizontal:Spacing.lg, paddingVertical:Spacing.sm+2,
    backgroundColor:Colors.white, borderBottomWidth:2, borderBottomColor:Colors.border,
  },
  headerLeft: { flexDirection:'row', alignItems:'center', gap:8 },
  flag: { fontSize:26 },
  lang: { fontSize:17, fontWeight:'900', color:Colors.textPrimary, letterSpacing:2 },
  headerRight: { flexDirection:'row', alignItems:'center', gap:8 },
  pill: {
    flexDirection:'row', alignItems:'center', gap:3,
    backgroundColor:Colors.backgroundAlt, borderRadius:Radius.full,
    paddingHorizontal:10, paddingVertical:5,
  },
  pillIcon: { fontSize:17 },
  pillNum:  { fontSize:15, fontWeight:'800' },

  /* scroll */
  scroll: { flex:1 },
  scrollContent: { paddingTop:Spacing.lg, paddingBottom:20, paddingHorizontal:Spacing.md },

  /* continue card */
  continueCard: {
    flexDirection:'row', alignItems:'center', gap:Spacing.md,
    borderRadius:Radius.xl, padding:Spacing.lg,
    marginBottom:Spacing.xl, overflow:'hidden',
    borderBottomWidth:5,
    shadowColor:'rgba(0,0,0,0.35)', shadowOffset:{width:0,height:8},
    shadowOpacity:1, shadowRadius:16, elevation:14,
  },
  deco1: {
    position:'absolute', right:-28, top:-28,
    width:100, height:100, borderRadius:50, borderWidth:30,
  },
  deco2: {
    position:'absolute', right:40, bottom:-40,
    width:80, height:80, borderRadius:40, borderWidth:24,
  },
  continueIconWrap: {
    width:60, height:60, borderRadius:30,
    backgroundColor:'rgba(255,255,255,0.25)',
    alignItems:'center', justifyContent:'center',
  },
  continueIcon: { fontSize:32 },
  continueText: { flex:1 },
  continueLabel: { fontSize:10, fontWeight:'800', color:'rgba(255,255,255,0.75)', letterSpacing:2, marginBottom:2 },
  continueTitle: { fontSize:18, fontWeight:'900', color:'#fff', marginBottom:1 },
  continueSub:   { fontSize:12, color:'rgba(255,255,255,0.7)' },
  goBadge: {
    backgroundColor:'rgba(255,255,255,0.25)', borderRadius:Radius.lg,
    paddingHorizontal:Spacing.md, paddingVertical:Spacing.sm,
    borderWidth:2, borderColor:'rgba(255,255,255,0.4)',
  },
  goText: { color:'#fff', fontWeight:'900', fontSize:15, letterSpacing:1 },

  /* greeting */
  greetRow: {
    flexDirection:'row', alignItems:'center', gap:Spacing.md,
    marginBottom:Spacing.xl, paddingHorizontal:4,
  },
  bubble: {
    flex:1, backgroundColor:Colors.white, borderRadius:Radius.xl,
    padding:Spacing.md, borderWidth:2, borderColor:Colors.border,
    shadowColor:'rgba(0,0,0,0.08)', shadowOffset:{width:0,height:4},
    shadowOpacity:1, shadowRadius:8, elevation:4,
  },
  bubbleHi:  { fontSize:15, fontWeight:'800', color:Colors.textPrimary, marginBottom:2 },
  bubbleSub: { fontSize:13, color:Colors.textSecondary },

  /* unit card */
  unitCard: {
    backgroundColor:Colors.white, borderRadius:Radius.xl,
    marginBottom:Spacing.xl, overflow:'hidden',
    shadowColor:'rgba(0,0,0,0.10)', shadowOffset:{width:0,height:4},
    shadowOpacity:1, shadowRadius:12, elevation:6,
  },

  /* banner */
  banner: {
    flexDirection:'row', alignItems:'center', minHeight:96,
    padding:Spacing.lg, overflow:'hidden',
    borderBottomWidth:4,
  },
  bannerDeco1: {
    position:'absolute', right:-22, top:-22, width:90, height:90,
    borderRadius:45, backgroundColor:'rgba(255,255,255,0.12)',
  },
  bannerDeco2: {
    position:'absolute', right:55, bottom:-35, width:70, height:70,
    borderRadius:35, backgroundColor:'rgba(255,255,255,0.08)',
  },
  bannerBody: { flex:1 },
  bannerSection: { fontSize:10, fontWeight:'800', color:'rgba(255,255,255,0.65)', letterSpacing:2.5, marginBottom:3 },
  bannerTitle:   { fontSize:22, fontWeight:'900', color:'#fff', marginBottom:1 },
  bannerUrdu:    { fontSize:14, color:'rgba(255,255,255,0.75)', writingDirection:'rtl' },
  bannerBadge: {
    width:56, height:56, borderRadius:28,
    backgroundColor:'rgba(255,255,255,0.22)', alignItems:'center', justifyContent:'center',
  },
  bannerIcon: { fontSize:28 },
  lockDot: { position:'absolute', top:10, right:10 },

  /* path */
  path: { paddingHorizontal:Spacing.md, paddingVertical:Spacing.lg },
  pathRow: { flexDirection:'row', alignItems:'flex-end' },
  nodeWrap: { alignItems:'center' },

  dotRow: { flexDirection:'row', alignItems:'center', height:30 },
  dotCol: { gap:5, alignItems:'center' },
  dot: { width:7, height:7, borderRadius:3.5, opacity:0.4 },

  karoAbove: { marginBottom:-4, zIndex:10 },

  node: {
    alignItems:'center', justifyContent:'center',
    borderBottomWidth:5,
    shadowOffset:{width:0,height:5}, shadowOpacity:1, shadowRadius:6, elevation:7,
  },
  activeGlow: {
    shadowOpacity:0.6, shadowRadius:18, elevation:14,
  },
  completedNode: {
    // subtle inner ring for completed
  },
  checkOverlay: {
    position:'absolute', top:0, left:0, right:0, bottom:0,
    borderRadius:999, backgroundColor:'rgba(0,0,0,0.18)',
    alignItems:'center', justifyContent:'center', zIndex:1,
  },
  checkMark: { fontSize:28, color:'#fff', fontWeight:'900' },
  nodeIcon: { fontWeight:'400' },

  starsRow: { flexDirection:'row', marginTop:5, gap:1 },

  ctaBadge: {
    borderRadius:Radius.full, paddingHorizontal:12, paddingVertical:5,
    marginTop:8, borderBottomWidth:3,
  },
  ctaText: { color:'#fff', fontSize:11, fontWeight:'900', letterSpacing:1.2 },

  /* unit complete */
  unitComplete: {
    flexDirection:'row', alignItems:'center', justifyContent:'center',
    gap:Spacing.sm, padding:Spacing.md, margin:Spacing.md,
    borderRadius:Radius.lg, borderWidth:2,
    backgroundColor:Colors.backgroundAlt,
  },
  unitCompleteEmoji: { fontSize:22 },
  unitCompleteText: { fontSize:15, fontWeight:'800' },
});
