import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate, Img, staticFile } from 'remotion';

interface BrandingScreenProps {
  startFrame: number;
}

const PURPLE = '#8b5cf6';

export const BrandingScreen: React.FC<BrandingScreenProps> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;

  const localFrame = frame - startFrame;

  // Fade in overlay
  const overlayOpacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Logo animation
  const logoProgress = spring({
    frame: localFrame - 10,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 20,
    config: { damping: 12, stiffness: 100 },
  });

  const logoScale = interpolate(logoProgress, [0, 1], [0.5, 1]);
  const logoOpacity = logoProgress;

  // Title animation
  const titleProgress = spring({
    frame: localFrame - 25,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 15,
    config: { damping: 15 },
  });

  // Tagline animation
  const taglineProgress = spring({
    frame: localFrame - 35,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 15,
    config: { damping: 15 },
  });

  // App Store badge animation
  const badgeProgress = spring({
    frame: localFrame - 50,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 15,
    config: { damping: 15 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        backgroundColor: `rgba(0, 0, 0, ${overlayOpacity * 0.95})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      {/* Logo: A ⇄ 交 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 40,
        }}
      >
        <span
          style={{
            fontSize: 140,
            fontWeight: 200,
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          }}
        >
          A
        </span>
        <span
          style={{
            fontSize: 100,
            fontWeight: 200,
            color: PURPLE,
          }}
        >
          ⇄
        </span>
        <span
          style={{
            fontSize: 140,
            fontWeight: 200,
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          }}
        >
          交
        </span>
      </div>

      {/* App Name */}
      <div
        style={{
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 90,
            fontWeight: 700,
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: 4,
          }}
        >
          UNILINGUAL
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineProgress,
          transform: `translateY(${interpolate(taglineProgress, [0, 1], [20, 0])}px)`,
          marginBottom: 80,
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}
        >
          Your cheat code to any language
        </span>
      </div>

      {/* App Store Badge */}
      <div
        style={{
          opacity: badgeProgress,
          transform: `translateY(${interpolate(badgeProgress, [0, 1], [20, 0])}px) scale(${interpolate(badgeProgress, [0, 1], [0.9, 1])})`,
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: '24px 48px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          {/* Apple logo */}
          <svg width={56} height={68} viewBox="0 0 384 512" fill="#000">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 24,
                color: '#000',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              Download on the
            </span>
            <span
              style={{
                fontSize: 44,
                fontWeight: 600,
                color: '#000',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              }}
            >
              App Store
            </span>
          </div>
        </div>
      </div>

      {/* 100+ Languages badge */}
      <div
        style={{
          opacity: badgeProgress,
          transform: `translateY(${interpolate(badgeProgress, [0, 1], [20, 0])}px)`,
          marginTop: 60,
        }}
      >
        <div
          style={{
            border: `3px solid ${PURPLE}`,
            borderRadius: 50,
            padding: '16px 40px',
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: PURPLE,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            100+ Languages Supported
          </span>
        </div>
      </div>
    </div>
  );
};
