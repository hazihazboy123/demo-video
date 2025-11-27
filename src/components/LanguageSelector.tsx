import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isFavorite?: boolean;
}

interface LanguageSelectorProps {
  isVisible: boolean;
  appearFrame: number;
  selectedLanguage: string; // language code
  highlightLanguage?: string; // language code to highlight (being selected)
}

// Brand colors matching iOS app
const PURPLE = '#8b5cf6';
const GOLD = '#FFD700';

// Scale factor for 1080x1920 canvas
const S = 2.2;

// Favorite languages (English and Chinese) - these show at top
const FAVORITES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isFavorite: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isFavorite: true },
];

// Popular languages
const POPULAR: Language[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isVisible,
  appearFrame,
  selectedLanguage,
  highlightLanguage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!isVisible) return null;

  // Overlay fade in
  const overlayProgress = spring({
    frame: frame - appearFrame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 10,
    config: { damping: 20 },
  });

  // Panel slide up
  const panelProgress = spring({
    frame: frame - appearFrame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 15,
    config: { damping: 20, stiffness: 150 },
  });

  const translateY = (1 - panelProgress) * 200;

  // Language row component
  const LanguageRow: React.FC<{ language: Language; showStar?: boolean; delay?: number }> = ({
    language,
    showStar = false,
    delay = 0,
  }) => {
    const isSelected = selectedLanguage === language.code;
    const isHighlighted = highlightLanguage === language.code;

    // Stagger animation
    const rowProgress = spring({
      frame: frame - appearFrame - delay,
      fps,
      from: 0,
      to: 1,
      durationInFrames: 12,
      config: { damping: 20, stiffness: 180 },
    });

    const scale = isHighlighted ? 0.97 : 1;
    const bgColor = isHighlighted ? '#1a1a1a' : '#000000';
    const borderColor = isHighlighted ? GOLD : PURPLE;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: bgColor,
          border: `${2 * S}px solid ${borderColor}`,
          borderRadius: 20 * S,
          padding: `${14 * S}px ${16 * S}px`,
          marginBottom: 10 * S,
          transform: `scale(${scale * (0.9 + rowProgress * 0.1)})`,
          opacity: rowProgress,
          boxShadow: isHighlighted ? `0 0 ${20 * S}px ${PURPLE}` : 'none',
        }}
      >
        {/* Flag */}
        <span style={{ fontSize: 32 * S, marginRight: 14 * S, lineHeight: 1 }}>
          {language.flag}
        </span>

        {/* Name stack */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 * S }}>
          <span
            style={{
              fontSize: 18 * S,
              fontWeight: 600,
              color: '#FFFFFF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            {language.name}
          </span>
          <span
            style={{
              fontSize: 14 * S,
              color: 'rgba(255,255,255,0.6)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            {language.nativeName}
          </span>
        </div>

        {/* Star (for favorites section) */}
        {showStar && (
          <span
            style={{
              fontSize: 24 * S,
              color: language.isFavorite ? GOLD : PURPLE,
              marginRight: 10 * S,
            }}
          >
            {language.isFavorite ? '★' : '☆'}
          </span>
        )}

        {/* Checkmark if selected, otherwise arrow */}
        {isSelected ? (
          <svg
            width={24 * S}
            height={24 * S}
            viewBox="0 0 24 24"
            fill="none"
            stroke={PURPLE}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <span
            style={{
              fontSize: 28 * S,
              color: PURPLE,
              fontWeight: 500,
            }}
          >
            ›
          </span>
        )}
      </div>
    );
  };

  // Section header
  const SectionHeader: React.FC<{ emoji: string; title: string; delay?: number }> = ({
    emoji,
    title,
    delay = 0,
  }) => {
    const headerProgress = spring({
      frame: frame - appearFrame - delay,
      fps,
      from: 0,
      to: 1,
      durationInFrames: 10,
      config: { damping: 20 },
    });

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8 * S,
          marginBottom: 12 * S,
          marginTop: 16 * S,
          opacity: headerProgress,
        }}
      >
        <span style={{ fontSize: 16 * S }}>{emoji}</span>
        <span
          style={{
            fontSize: 16 * S,
            fontWeight: 700,
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}
        >
          {title}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        backgroundColor: `rgba(0, 0, 0, ${overlayProgress * 0.7})`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 1000,
      }}
    >
      {/* Language Selector Panel */}
      <div
        style={{
          backgroundColor: '#1C1C1E',
          borderTopLeftRadius: 24 * S,
          borderTopRightRadius: 24 * S,
          padding: `${20 * S}px`,
          transform: `translateY(${translateY}px)`,
          opacity: panelProgress,
          maxHeight: '75%',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16 * S,
            position: 'relative',
          }}
        >
          {/* Close button */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              width: 36 * S,
              height: 36 * S,
              borderRadius: 18 * S,
              backgroundColor: '#3A3A3C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width={16 * S} height={16 * S} viewBox="0 0 16 16" fill="none">
              <path d="M1 1L15 15M15 1L1 15" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 22 * S,
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              }}
            >
              Select Language
            </div>
            <div
              style={{
                fontSize: 13 * S,
                color: 'rgba(255,255,255,0.5)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                marginTop: 4 * S,
              }}
            >
              Tap ⭐ to favorite
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <SectionHeader emoji="⭐" title="Favorites" delay={2} />
        {FAVORITES.map((lang, i) => (
          <LanguageRow key={lang.code} language={lang} showStar delay={4 + i * 2} />
        ))}

        {/* Popular Section */}
        <SectionHeader emoji="🔥" title="Popular" delay={8} />
        {POPULAR.map((lang, i) => (
          <LanguageRow key={lang.code} language={lang} showStar delay={10 + i * 2} />
        ))}
      </div>
    </div>
  );
};
