/**
 * Karo – the black-crow mascot of this app.
 * Built entirely from Views so it works on every platform.
 */
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface Props {
  size?: number;
  style?: ViewStyle;
}

const MASCOT_RED = '#FF3333';
const MASCOT_BLACK = '#1A1A1A';

export default function Mascot({ size = 100, style }: Props) {
  const h = size;         // head diameter
  const bodyW = h * 0.78;
  const bodyH = h * 0.58;
  const bodyTop = h * 0.52;
  const wingW = h * 0.22;
  const wingH = bodyH * 0.7;

  // Eye geometry (relative to head)
  const eyeD = h * 0.26;
  const eyeTop = h * 0.22;
  const eyeGap = h * 0.06;
  const centerX = h / 2;
  const leftEyeLeft = centerX - eyeGap / 2 - eyeD;
  const rightEyeLeft = centerX + eyeGap / 2;
  const pupilD = eyeD * 0.54;
  const shineD = pupilD * 0.38;

  const beakW = h * 0.36;
  const beakH = h * 0.14;
  const beakTop = h * 0.58;

  const bellyW = bodyW * 0.42;
  const bellyH = bodyH * 0.52;

  const footW = h * 0.18;
  const footH = h * 0.09;

  const totalHeight = bodyTop + bodyH + footH + 2;

  return (
    <View style={[{ width: h, height: totalHeight }, style]}>
      {/* ── left wing ── */}
      <View
        style={{
          position: 'absolute',
          top: bodyTop + bodyH * 0.08,
          left: (h - bodyW) / 2 - wingW * 0.55,
          width: wingW,
          height: wingH,
          backgroundColor: MASCOT_BLACK,
          borderRadius: wingW * 0.4,
          transform: [{ rotate: '-18deg' }],
        }}
      />

      {/* ── right wing ── */}
      <View
        style={{
          position: 'absolute',
          top: bodyTop + bodyH * 0.08,
          right: (h - bodyW) / 2 - wingW * 0.55,
          width: wingW,
          height: wingH,
          backgroundColor: MASCOT_BLACK,
          borderRadius: wingW * 0.4,
          transform: [{ rotate: '18deg' }],
        }}
      />

      {/* ── body ── */}
      <View
        style={{
          position: 'absolute',
          top: bodyTop,
          left: (h - bodyW) / 2,
          width: bodyW,
          height: bodyH,
          backgroundColor: MASCOT_BLACK,
          borderRadius: bodyW / 2,
        }}
      >
        {/* red belly */}
        <View
          style={{
            position: 'absolute',
            bottom: bodyH * 0.1,
            left: (bodyW - bellyW) / 2,
            width: bellyW,
            height: bellyH,
            backgroundColor: MASCOT_RED,
            borderRadius: bellyW / 2,
            opacity: 0.9,
          }}
        />
      </View>

      {/* ── head ── */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: h,
          height: h,
          backgroundColor: MASCOT_BLACK,
          borderRadius: h / 2,
        }}
      >
        {/* left eye white */}
        <View
          style={{
            position: 'absolute',
            top: eyeTop,
            left: leftEyeLeft,
            width: eyeD,
            height: eyeD,
            backgroundColor: 'white',
            borderRadius: eyeD / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: pupilD,
              height: pupilD,
              backgroundColor: MASCOT_BLACK,
              borderRadius: pupilD / 2,
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 2,
                left: 2,
                width: shineD,
                height: shineD,
                backgroundColor: 'white',
                borderRadius: shineD / 2,
              }}
            />
          </View>
        </View>

        {/* right eye white */}
        <View
          style={{
            position: 'absolute',
            top: eyeTop,
            left: rightEyeLeft,
            width: eyeD,
            height: eyeD,
            backgroundColor: 'white',
            borderRadius: eyeD / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: pupilD,
              height: pupilD,
              backgroundColor: MASCOT_BLACK,
              borderRadius: pupilD / 2,
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 2,
                left: 2,
                width: shineD,
                height: shineD,
                backgroundColor: 'white',
                borderRadius: shineD / 2,
              }}
            />
          </View>
        </View>

        {/* beak */}
        <View
          style={{
            position: 'absolute',
            top: beakTop,
            left: (h - beakW) / 2,
            width: beakW,
            height: beakH,
            backgroundColor: MASCOT_RED,
            borderRadius: beakH / 2,
          }}
        />
      </View>

      {/* ── left foot ── */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: h * 0.22,
          width: footW,
          height: footH,
          backgroundColor: MASCOT_RED,
          borderRadius: footH / 2,
        }}
      />

      {/* ── right foot ── */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: h * 0.22,
          width: footW,
          height: footH,
          backgroundColor: MASCOT_RED,
          borderRadius: footH / 2,
        }}
      />
    </View>
  );
}
