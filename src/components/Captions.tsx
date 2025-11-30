import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

interface Caption {
  text: string;
  startFrame: number;
  endFrame: number;
}

// Captions synced with voiceover timestamps (timestamps * 30fps)
const CAPTIONS: Caption[] = [
  { text: "My wife's parents haven't been in America for ten years.", startFrame: 0, endFrame: 89 },
  { text: "They still don't think I've learned any Chinese.", startFrame: 108, endFrame: 170 },
  { text: "And honestly... they're right. I haven't.", startFrame: 171, endFrame: 294 },
  { text: "But they don't need to know that.", startFrame: 323, endFrame: 365 },
  { text: "They just texted me... no idea what this says.", startFrame: 387, endFrame: 499 },
  { text: "Oh look, another one. Still no clue.", startFrame: 524, endFrame: 585 },
  { text: "But I know exactly what to do.", startFrame: 590, endFrame: 643 },
  { text: "Unilingual keyboard... paste their message... translate.", startFrame: 668, endFrame: 807 },
  { text: "Oh. That's what they meant. They're landing tomorrow.", startFrame: 828, endFrame: 919 },
  { text: "Now I just type my response in English... hit translate...", startFrame: 929, endFrame: 1055 },
  { text: "Perfect Mandarin. Sent.", startFrame: 1064, endFrame: 1156 },
  { text: "They're gonna think I've been studying this whole time.", startFrame: 1177, endFrame: 1278 },
  { text: "Nah. I just got the cheat code.", startFrame: 1296, endFrame: 1388 },
  { text: "Unilingual.", startFrame: 1409, endFrame: 1447 },
];

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find current caption
  const currentCaption = CAPTIONS.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame
  );

  if (!currentCaption) return null;

  // Animation for caption appearance
  const appearProgress = spring({
    frame: frame - currentCaption.startFrame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 8,
    config: { damping: 15, stiffness: 200 },
  });

  // Fade out near end
  const fadeOut = interpolate(
    frame,
    [currentCaption.endFrame - 5, currentCaption.endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = Math.min(appearProgress, fadeOut);
  const translateY = interpolate(appearProgress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 320, // Position below header, above messages
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 40px',
        zIndex: 500,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          padding: '16px 28px',
          maxWidth: '90%',
        }}
      >
        <span
          style={{
            fontSize: 42,
            fontWeight: 500,
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          {currentCaption.text}
        </span>
      </div>
    </div>
  );
};
