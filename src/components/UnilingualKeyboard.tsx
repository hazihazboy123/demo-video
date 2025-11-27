import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface UnilingualKeyboardProps {
  selectedContact?: string | null;
  selectedLanguage?: { name: string; flag: string };
  highlightedButton?: 'contacts' | 'transliterate' | 'language' | 'translate' | null;
  isTranslating?: boolean;
}

// Brand colors - matching iOS app exactly
const PURPLE = '#8b5cf6';
const PURPLE_LIGHT = '#c084fc';
const GOLD = '#FFD700';

export const UnilingualKeyboard: React.FC<UnilingualKeyboardProps> = ({
  selectedContact = null,
  selectedLanguage = { name: 'Chinese', flag: '🇨🇳' },
  highlightedButton = null,
  isTranslating = false,
}) => {
  const frame = useCurrentFrame();

  // Scale for 1080px wide canvas - reduced to fit properly
  const S = 2.2; // Reduced scale to fit within screen

  // Pulsing animation for highlighted buttons
  const getPulseScale = (isHighlighted: boolean) => {
    if (!isHighlighted) return 1;
    return 1 + interpolate(Math.sin(frame * 0.15), [-1, 1], [0, 0.02]);
  };

  const getBorderStyle = (buttonType: string) => {
    const isHighlighted = highlightedButton === buttonType;
    return {
      border: `${isHighlighted ? 3 * S : 2 * S}px solid ${isHighlighted ? GOLD : PURPLE}`,
      boxShadow: isHighlighted ? `0 0 ${20 * S}px ${PURPLE}` : `0 ${4 * S}px ${8 * S}px rgba(0, 0, 0, 0.2)`,
    };
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#1C1C1E', // Dark background matching iOS dark keyboard
        padding: `${10 * S}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10 * S,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}
    >
      {/* Top Row: Contacts + Transliterate */}
      <div style={{ display: 'flex', gap: 10 * S }}>
        {/* Contacts Button */}
        <div
          style={{
            flex: 1,
            height: 48 * S,
            backgroundColor: '#000000',
            borderRadius: 10 * S,
            ...getBorderStyle('contacts'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8 * S,
            transform: `scale(${getPulseScale(highlightedButton === 'contacts')})`,
          }}
        >
          {selectedContact ? (
            <>
              <div
                style={{
                  width: 28 * S,
                  height: 28 * S,
                  borderRadius: '50%',
                  backgroundColor: PURPLE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14 * S,
                  color: '#fff',
                }}
              >
                {selectedContact.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: 16 * S,
                  fontWeight: 600,
                  color: '#FFFFFF',
                }}
              >
                {selectedContact}
              </span>
            </>
          ) : (
            <>
              {/* Contacts icon - two people */}
              <svg
                width={28 * S}
                height={28 * S}
                viewBox="0 0 24 24"
                fill="#64B5F6"
              >
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <span
                style={{
                  fontSize: 18 * S,
                  fontWeight: 600,
                  color: '#FFFFFF',
                }}
              >
                Contacts
              </span>
            </>
          )}
        </div>

        {/* Transliterate Button */}
        <div
          style={{
            flex: 1,
            height: 48 * S,
            backgroundColor: '#000000',
            borderRadius: 10 * S,
            ...getBorderStyle('transliterate'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8 * S,
            transform: `scale(${getPulseScale(highlightedButton === 'transliterate')})`,
          }}
        >
          {/* ABC box icon */}
          <div
            style={{
              width: 32 * S,
              height: 24 * S,
              backgroundColor: '#64B5F6',
              borderRadius: 4 * S,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 11 * S,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: -0.5,
              }}
            >
              abc
            </span>
          </div>
          <span
            style={{
              fontSize: 18 * S,
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            Transliterate
          </span>
        </div>
      </div>

      {/* Bottom Row: Language + Translate */}
      <div style={{ display: 'flex', gap: 10 * S }}>
        {/* Language Button */}
        <div
          style={{
            flex: 1,
            height: 120 * S,
            backgroundColor: '#000000',
            borderRadius: 14 * S,
            ...getBorderStyle('language'),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4 * S,
            transform: `scale(${getPulseScale(highlightedButton === 'language')})`,
            padding: `${12 * S}px`,
          }}
        >
          {/* Flag */}
          <span style={{ fontSize: 44 * S, lineHeight: 1 }}>{selectedLanguage.flag}</span>

          {/* Language name */}
          <span
            style={{
              fontSize: 18 * S,
              fontWeight: 700,
              color: '#FFFFFF',
              textAlign: 'center',
              marginTop: 2 * S,
            }}
          >
            {selectedLanguage.name}
          </span>

          {/* Tap to change */}
          <span
            style={{
              fontSize: 9 * S,
              fontWeight: 500,
              color: PURPLE_LIGHT,
              letterSpacing: 0.8 * S,
              marginTop: 2 * S,
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
            backgroundColor: '#000000',
            borderRadius: 14 * S,
            ...getBorderStyle('translate'),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8 * S,
            transform: `scale(${getPulseScale(highlightedButton === 'translate')})`,
            padding: `${12 * S}px`,
          }}
        >
          {/* Logo: A ⇄ 交 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4 * S,
            }}
          >
            <span
              style={{
                fontSize: 36 * S,
                fontWeight: 400,
                color: '#FFFFFF',
              }}
            >
              A
            </span>
            <span
              style={{
                fontSize: 28 * S,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              ⇄
            </span>
            <span
              style={{
                fontSize: 36 * S,
                fontWeight: 400,
                color: '#FFFFFF',
              }}
            >
              交
            </span>
          </div>

          {/* Translate label */}
          <span
            style={{
              fontSize: 16 * S,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: 2 * S,
            }}
          >
            {isTranslating ? 'TRANSLATING...' : 'TRANSLATE'}
          </span>
        </div>
      </div>

      {/* Bottom Safe Area with Globe and Microphone */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 4 * S,
          paddingLeft: 4 * S,
          paddingRight: 12 * S,
        }}
      >
        {/* Globe button */}
        <div
          style={{
            width: 36 * S,
            height: 36 * S,
            backgroundColor: '#5A5A5C',
            borderRadius: 5 * S,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 ${1 * S}px 0 rgba(0, 0, 0, 0.35)`,
          }}
        >
          <svg
            width={20 * S}
            height={20 * S}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>

        {/* Microphone button */}
        <svg
          width={22 * S}
          height={22 * S}
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </div>
    </div>
  );
};
