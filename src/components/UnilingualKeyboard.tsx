import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface UnilingualKeyboardProps {
  selectedContact?: string | null;
  selectedLanguage?: { name: string; flag: string };
  highlightedButton?: 'contacts' | 'transliterate' | 'language' | 'translate' | null;
  isTranslating?: boolean;
}

// Design tokens from iOS app - EXACT MATCH
const PURPLE = '#8b5cf6';        // buttonBorder
const PURPLE_LIGHT = '#c084fc';  // subtextDark
const BUTTON_BG = '#000000';     // buttonBgDark
const TEXT_COLOR = '#FFFFFF';    // mainTextDark

// Scale factor for video (matches other components)
const S = 2.4;

export const UnilingualKeyboard: React.FC<UnilingualKeyboardProps> = ({
  selectedContact = null,
  selectedLanguage = { name: 'Mandarin (Simplified)', flag: '🇨🇳' },
  highlightedButton = null,
  isTranslating = false,
}) => {
  const frame = useCurrentFrame();

  // Pulsing animation for highlighted buttons
  const getPulseGlow = (isHighlighted: boolean) => {
    if (!isHighlighted) return 'none';
    const intensity = interpolate(Math.sin(frame * 0.15), [-1, 1], [15 * S, 25 * S]);
    return `0 0 ${intensity}px ${PURPLE}`;
  };

  // Shared button styles
  const getButtonStyle = (isHighlighted: boolean) => ({
    backgroundColor: BUTTON_BG,
    border: `${2 * S}px solid ${PURPLE}`,
    borderRadius: 18 * S,
    boxShadow: isHighlighted
      ? getPulseGlow(true)
      : `0 ${2 * S}px ${8 * S}px rgba(0, 0, 0, 0.1)`,
  });

  const getBigButtonStyle = (isHighlighted: boolean) => ({
    backgroundColor: BUTTON_BG,
    border: `${2 * S}px solid ${PURPLE}`,
    borderRadius: 20 * S,
    boxShadow: isHighlighted
      ? getPulseGlow(true)
      : `0 ${4 * S}px ${8 * S}px rgba(0, 0, 0, 0.1)`,
  });

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#1C1C1E', // iOS keyboard background
        padding: 16 * S,
        display: 'flex',
        flexDirection: 'column',
        gap: 12 * S,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}
    >
      {/* Top Row: Transliterate (left) + Contacts (right) */}
      <div style={{ display: 'flex', gap: 10 * S }}>
        {/* Transliterate Button */}
        <div
          style={{
            flex: 1,
            height: 44 * S,
            ...getButtonStyle(highlightedButton === 'transliterate'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8 * S,
          }}
        >
          <span style={{ fontSize: 20 * S }}>🔤</span>
          <span
            style={{
              fontSize: 16 * S,
              fontWeight: 600,
              color: TEXT_COLOR,
            }}
          >
            Transliterate
          </span>
        </div>

        {/* Contacts Button */}
        <div
          style={{
            flex: 1,
            height: 44 * S,
            ...getButtonStyle(highlightedButton === 'contacts'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8 * S,
          }}
        >
          {selectedContact ? (
            <>
              <div
                style={{
                  width: 32 * S,
                  height: 32 * S,
                  borderRadius: '50%',
                  backgroundColor: PURPLE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16 * S,
                  color: TEXT_COLOR,
                }}
              >
                {selectedContact.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: 16 * S,
                  fontWeight: 600,
                  color: TEXT_COLOR,
                }}
              >
                {selectedContact}
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 20 * S }}>👥</span>
              <span
                style={{
                  fontSize: 16 * S,
                  fontWeight: 600,
                  color: TEXT_COLOR,
                }}
              >
                Contacts
              </span>
            </>
          )}
        </div>
      </div>

      {/* Bottom Row: Language (left) + Translate (right) */}
      <div style={{ display: 'flex', gap: 10 * S, flex: 1 }}>
        {/* Language Button */}
        <div
          style={{
            flex: 1,
            height: 120 * S,
            ...getBigButtonStyle(highlightedButton === 'language'),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4 * S,
            padding: 12 * S,
          }}
        >
          {/* Flag */}
          <span style={{ fontSize: 48 * S, lineHeight: 1 }}>{selectedLanguage.flag}</span>

          {/* Language name */}
          <span
            style={{
              fontSize: 18 * S,
              fontWeight: 700,
              color: TEXT_COLOR,
              textAlign: 'center',
            }}
          >
            {selectedLanguage.name}
          </span>

          {/* Tap to change */}
          <span
            style={{
              fontSize: 10 * S,
              fontWeight: 500,
              color: PURPLE_LIGHT,
              letterSpacing: 0.5 * S,
            }}
          >
            TAP TO CHANGE
          </span>
        </div>

        {/* Translate Button */}
        <div
          style={{
            flex: 1,
            height: 120 * S,
            ...getBigButtonStyle(highlightedButton === 'translate'),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8 * S,
            padding: 16 * S,
          }}
        >
          {/* Logo: A ⇄ 交 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6 * S,
            }}
          >
            <span
              style={{
                fontSize: 44 * S,
                fontWeight: 300,
                color: TEXT_COLOR,
              }}
            >
              A
            </span>
            <span
              style={{
                fontSize: 44 * S,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              ⇄
            </span>
            <span
              style={{
                fontSize: 44 * S,
                fontWeight: 300,
                color: TEXT_COLOR,
              }}
            >
              交
            </span>
          </div>

          {/* Translate label with letter spacing */}
          <span
            style={{
              fontSize: 20 * S,
              fontWeight: 600,
              color: TEXT_COLOR,
              letterSpacing: 3 * S,
            }}
          >
            {isTranslating ? 'TRANSLATING...' : 'TRANSLATE'}
          </span>
        </div>
      </div>
    </div>
  );
};
