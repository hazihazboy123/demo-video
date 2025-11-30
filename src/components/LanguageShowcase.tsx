import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { UnilingualKeyboard } from './UnilingualKeyboard';

interface LanguageShowcaseProps {
  startFrame: number;
  duration: number;
}

// All languages supported by the app (100+)
const LANGUAGES = [
  // Major world languages
  { flag: '🇨🇳', name: 'Mandarin' },
  { flag: '🇪🇸', name: 'Spanish' },
  { flag: '🇬🇧', name: 'English' },
  { flag: '🇮🇳', name: 'Hindi' },
  { flag: '🇸🇦', name: 'Arabic' },
  { flag: '🇧🇩', name: 'Bengali' },
  { flag: '🇵🇹', name: 'Portuguese' },
  { flag: '🇷🇺', name: 'Russian' },
  { flag: '🇯🇵', name: 'Japanese' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇰🇷', name: 'Korean' },
  { flag: '🇮🇹', name: 'Italian' },
  { flag: '🇹🇷', name: 'Turkish' },
  { flag: '🇻🇳', name: 'Vietnamese' },
  { flag: '🇵🇱', name: 'Polish' },
  { flag: '🇺🇦', name: 'Ukrainian' },
  { flag: '🇳🇱', name: 'Dutch' },
  { flag: '🇷🇴', name: 'Romanian' },
  { flag: '🇬🇷', name: 'Greek' },
  { flag: '🇨🇿', name: 'Czech' },
  { flag: '🇸🇪', name: 'Swedish' },
  { flag: '🇭🇺', name: 'Hungarian' },
  { flag: '🇵🇭', name: 'Filipino' },
  { flag: '🇳🇴', name: 'Norwegian' },
  { flag: '🇩🇰', name: 'Danish' },
  { flag: '🇫🇮', name: 'Finnish' },
  { flag: '🇲🇾', name: 'Malay' },
  { flag: '🇮🇩', name: 'Indonesian' },
  { flag: '🇹🇭', name: 'Thai' },
  // South Asian
  { flag: '🇵🇰', name: 'Urdu' },
  { flag: '🇮🇷', name: 'Persian' },
  { flag: '🇮🇳', name: 'Tamil' },
  { flag: '🇮🇳', name: 'Telugu' },
  { flag: '🇮🇳', name: 'Marathi' },
  { flag: '🇮🇳', name: 'Gujarati' },
  { flag: '🇮🇳', name: 'Kannada' },
  { flag: '🇮🇳', name: 'Malayalam' },
  { flag: '🇮🇳', name: 'Punjabi' },
  { flag: '🇳🇵', name: 'Nepali' },
  { flag: '🇱🇰', name: 'Sinhala' },
  // Southeast Asian
  { flag: '🇰🇭', name: 'Khmer' },
  { flag: '🇱🇦', name: 'Lao' },
  { flag: '🇲🇲', name: 'Burmese' },
  // East Asian
  { flag: '🇹🇼', name: 'Mandarin (Trad)' },
  { flag: '🇭🇰', name: 'Cantonese' },
  // Middle Eastern
  { flag: '🇪🇬', name: 'Egyptian Arabic' },
  { flag: '🇮🇶', name: 'Iraqi Arabic' },
  { flag: '🇵🇸', name: 'Levantine Arabic' },
  { flag: '🇲🇦', name: 'Maghrebi Arabic' },
  { flag: '🇦🇫', name: 'Pashto' },
  { flag: '🇹🇯', name: 'Tajik' },
  { flag: '✡️', name: 'Hebrew' },
  // African
  { flag: '🇹🇿', name: 'Swahili' },
  { flag: '🇪🇹', name: 'Amharic' },
  { flag: '🇳🇬', name: 'Hausa' },
  { flag: '🇳🇬', name: 'Yoruba' },
  { flag: '🇳🇬', name: 'Igbo' },
  { flag: '🇿🇦', name: 'Zulu' },
  { flag: '🇿🇦', name: 'Xhosa' },
  { flag: '🇿🇦', name: 'Afrikaans' },
  // European
  { flag: '🇦🇱', name: 'Albanian' },
  { flag: '🇦🇲', name: 'Armenian' },
  { flag: '🇧🇾', name: 'Belarusian' },
  { flag: '🇧🇦', name: 'Bosnian' },
  { flag: '🇧🇬', name: 'Bulgarian' },
  { flag: '🇭🇷', name: 'Croatian' },
  { flag: '🇪🇪', name: 'Estonian' },
  { flag: '🇬🇪', name: 'Georgian' },
  { flag: '🇮🇸', name: 'Icelandic' },
  { flag: '🇮🇪', name: 'Irish' },
  { flag: '🇱🇻', name: 'Latvian' },
  { flag: '🇱🇹', name: 'Lithuanian' },
  { flag: '🇱🇺', name: 'Luxembourgish' },
  { flag: '🇲🇰', name: 'Macedonian' },
  { flag: '🇲🇹', name: 'Maltese' },
  { flag: '🇷🇸', name: 'Serbian' },
  { flag: '🇸🇰', name: 'Slovak' },
  { flag: '🇸🇮', name: 'Slovenian' },
  { flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', name: 'Welsh' },
  { flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', name: 'Scottish Gaelic' },
  { flag: '🇮🇲', name: 'Manx' },
  { flag: '🇫🇴', name: 'Faroese' },
  // Regional Spanish
  { flag: '🇲🇽', name: 'Mexican Spanish' },
  { flag: '🇦🇷', name: 'Argentine Spanish' },
  { flag: '🇨🇴', name: 'Colombian Spanish' },
  { flag: '🇨🇱', name: 'Chilean Spanish' },
  // Regional Portuguese
  { flag: '🇧🇷', name: 'Brazilian Portuguese' },
  { flag: '🇦🇴', name: 'African Portuguese' },
  // Regional French
  { flag: '🇨🇦', name: 'Canadian French' },
  { flag: '🇧🇪', name: 'Belgian French' },
  { flag: '🇨🇭', name: 'Swiss French' },
  // Regional English
  { flag: '🇺🇸', name: 'American English' },
  { flag: '🇦🇺', name: 'Australian English' },
  // Pacific
  { flag: '🇬🇺', name: 'Chamorro' },
  { flag: '🇲🇭', name: 'Marshallese' },
  { flag: '🇼🇸', name: 'Samoan' },
  { flag: '🇫🇲', name: 'Pohnpeian' },
  // Other
  { flag: '✡️', name: 'Yiddish' },
  { flag: '🇮🇳', name: 'Sanskrit' },
  { flag: '🇮🇶', name: 'Kurdish' },
  { flag: '🇲🇻', name: 'Dhivehi' },
];

export const LanguageShowcase: React.FC<LanguageShowcaseProps> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > startFrame + duration) return null;

  const localFrame = frame - startFrame;

  // Fade in
  const fadeIn = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // Language cycling - starts slow, speeds up, then slows down
  const cycleProgress = localFrame / duration;

  // Easing function for the cycle speed (slow-fast-slow)
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Calculate which language to show based on progress
  // Go through all languages once, with slow-fast-slow easing
  const totalCycles = 1;
  const adjustedProgress = easeInOutCubic(cycleProgress);
  const languageIndex = Math.floor(adjustedProgress * LANGUAGES.length * totalCycles) % LANGUAGES.length;
  const currentLanguage = LANGUAGES[languageIndex];

  // Title animation
  const titleOpacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Counter for "100+ Languages"
  const counterEnd = Math.min(localFrame * 2, 100);
  const showPlus = localFrame > 50;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        backgroundColor: `rgba(0, 0, 0, ${fadeIn * 0.95})`,
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
          marginBottom: 60,
          opacity: titleOpacity,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          }}
        >
          {Math.floor(counterEnd)}{showPlus ? '+' : ''} Languages
        </span>
      </div>

      {/* Actual Unilingual Keyboard with cycling language */}
      <div
        style={{
          width: 1000,
          opacity: fadeIn,
          borderRadius: 40,
          overflow: 'hidden',
        }}
      >
        <UnilingualKeyboard
          selectedLanguage={currentLanguage}
          highlightedButton="language"
        />
      </div>

      {/* Subtitle */}
      <div
        style={{
          marginTop: 50,
          opacity: interpolate(localFrame, [30, 50], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}
        >
          One keyboard. Every language.
        </span>
      </div>
    </div>
  );
};
