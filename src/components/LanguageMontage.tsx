import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

interface LanguageMontageProps {
  startFrame: number;
  duration: number;
}

const PURPLE = '#8b5cf6';

interface LanguageExample {
  flag: string;
  name: string;
  original: string;
  translated: string;
}

const LANGUAGES: LanguageExample[] = [
  { flag: '🇪🇸', name: 'Spanish', original: 'Hello, how are you?', translated: 'Hola, ¿cómo estás?' },
  { flag: '🇫🇷', name: 'French', original: 'I love you', translated: 'Je t\'aime' },
  { flag: '🇸🇦', name: 'Arabic', original: 'Thank you', translated: 'شكراً لك' },
  { flag: '🇯🇵', name: 'Japanese', original: 'Good morning', translated: 'おはようございます' },
  { flag: '🇰🇷', name: 'Korean', original: 'Nice to meet you', translated: '만나서 반가워요' },
  { flag: '🇷🇺', name: 'Russian', original: 'Goodbye', translated: 'До свидания' },
  { flag: '🇮🇳', name: 'Hindi', original: 'Welcome', translated: 'स्वागत है' },
  { flag: '🇵🇹', name: 'Portuguese', original: 'See you later', translated: 'Até logo' },
];

export const LanguageMontage: React.FC<LanguageMontageProps> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > startFrame + duration) return null;

  const localFrame = frame - startFrame;
  const framesPerLanguage = duration / LANGUAGES.length;

  // Which language is currently showing
  const currentIndex = Math.min(
    Math.floor(localFrame / framesPerLanguage),
    LANGUAGES.length - 1
  );
  const currentLanguage = LANGUAGES[currentIndex];

  // Progress within current language
  const languageLocalFrame = localFrame - currentIndex * framesPerLanguage;

  // Card animation
  const cardProgress = spring({
    frame: languageLocalFrame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 10,
    config: { damping: 15, stiffness: 200 },
  });

  // Translation reveal animation
  const translationProgress = spring({
    frame: languageLocalFrame - 8,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 10,
    config: { damping: 12 },
  });

  const cardScale = interpolate(cardProgress, [0, 1], [0.8, 1]);
  const cardOpacity = cardProgress;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1500,
      }}
    >
      {/* Title */}
      <div
        style={{
          marginBottom: 80,
          opacity: interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: PURPLE,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: 2,
          }}
        >
          100+ LANGUAGES
        </span>
      </div>

      {/* Language Card */}
      <div
        style={{
          backgroundColor: '#1C1C1E',
          borderRadius: 40,
          padding: 60,
          width: 900,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          border: `3px solid ${PURPLE}`,
        }}
      >
        {/* Flag and Language Name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 80 }}>{currentLanguage.flag}</span>
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            {currentLanguage.name}
          </span>
        </div>

        {/* Original text */}
        <div
          style={{
            backgroundColor: '#007AFF',
            borderRadius: 24,
            padding: '20px 30px',
            marginBottom: 20,
            alignSelf: 'flex-end',
            marginLeft: 'auto',
            maxWidth: '80%',
          }}
        >
          <span
            style={{
              fontSize: 36,
              color: '#FFFFFF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            {currentLanguage.original}
          </span>
        </div>

        {/* Arrow */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
            opacity: translationProgress,
          }}
        >
          <span style={{ fontSize: 48, color: PURPLE }}>↓</span>
        </div>

        {/* Translated text */}
        <div
          style={{
            backgroundColor: '#3A3A3C',
            borderRadius: 24,
            padding: '20px 30px',
            maxWidth: '80%',
            opacity: translationProgress,
            transform: `translateY(${interpolate(translationProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            style={{
              fontSize: 36,
              color: '#FFFFFF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            {currentLanguage.translated}
          </span>
        </div>
      </div>

      {/* Language indicators */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 60,
        }}
      >
        {LANGUAGES.map((_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: i === currentIndex ? PURPLE : 'rgba(255, 255, 255, 0.3)',
              transition: 'background-color 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
};
