import React from 'react';
import { useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion';

// Import IOSKeyboard from AppleMessages (we'll need to export it)
// For now, we'll recreate a simple version here
const IOSKeyboard: React.FC<{ inputText?: string }> = ({ inputText }) => {
  const suggestions = inputText ? [`"${inputText}"`, 'afternoon', 'afterwords'] : ['"I"', 'The', "I'm"];

  const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  const KEY_WIDTH = 102;
  const KEY_HEIGHT = 92;
  const KEY_GAP = 6;
  const KEY_RADIUS = 5;
  const SIDE_PAD = 3;
  const SHIFT_WIDTH = 162;
  const BACKSPACE_WIDTH = 162;
  const BOTTOM_KEY_WIDTH = 90;
  const SPACE_WIDTH = 786;

  const KeyBase: React.FC<{
    width: number;
    isSpecial?: boolean;
    children: React.ReactNode;
  }> = ({ width, isSpecial = false, children }) => (
    <div style={{
      width,
      height: KEY_HEIGHT,
      backgroundColor: isSpecial ? '#5A5A5C' : '#636366',
      borderRadius: KEY_RADIUS,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 0 #000',
    }}>
      {children}
    </div>
  );

  const LetterKey: React.FC<{ letter: string }> = ({ letter }) => (
    <KeyBase width={KEY_WIDTH}>
      <span style={{
        fontSize: 48,
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        fontWeight: 400,
      }}>
        {letter}
      </span>
    </KeyBase>
  );

  return (
    <div style={{ backgroundColor: '#1C1C1E' }}>
      {/* QuickType Suggestions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 88,
        borderBottom: '1px solid #38383A',
      }}>
        {suggestions.map((s, i) => (
          <div key={i} style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            borderRight: i < 2 ? '1px solid #38383A' : 'none',
          }}>
            <span style={{
              fontSize: 36,
              color: '#fff',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}>{s}</span>
          </div>
        ))}
        <div style={{
          width: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid #38383A',
          height: '100%',
        }}>
          <span style={{ fontSize: 32, color: '#fff', fontWeight: 500 }}>≡A</span>
        </div>
      </div>

      {/* Keyboard rows */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: `16px ${SIDE_PAD}px 8px`,
      }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', gap: KEY_GAP }}>
          {row1.map((key) => <LetterKey key={key} letter={key} />)}
        </div>

        {/* Row 2 */}
        <div style={{ display: 'flex', gap: KEY_GAP, justifyContent: 'center' }}>
          {row2.map((key) => <LetterKey key={key} letter={key} />)}
        </div>

        {/* Row 3 */}
        <div style={{ display: 'flex', gap: KEY_GAP }}>
          <KeyBase width={SHIFT_WIDTH} isSpecial>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V6M5 12l7-7 7 7" />
            </svg>
          </KeyBase>
          {row3.map((key) => <LetterKey key={key} letter={key} />)}
          <KeyBase width={BACKSPACE_WIDTH} isSpecial>
            <svg width={48} height={36} viewBox="0 0 24 18" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H8l-7-8 7-8z" />
              <line x1="17" y1="6" x2="12" y2="12" />
              <line x1="12" y1="6" x2="17" y2="12" />
            </svg>
          </KeyBase>
        </div>

        {/* Row 4 */}
        <div style={{ display: 'flex', gap: KEY_GAP }}>
          <KeyBase width={BOTTOM_KEY_WIDTH} isSpecial>
            <span style={{ fontSize: 34, color: '#fff', fontWeight: 500 }}>123</span>
          </KeyBase>
          <KeyBase width={BOTTOM_KEY_WIDTH} isSpecial>
            <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </KeyBase>
          <KeyBase width={SPACE_WIDTH}>
            <span></span>
          </KeyBase>
          <KeyBase width={BOTTOM_KEY_WIDTH} isSpecial>
            <svg width={40} height={32} viewBox="0 0 20 16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 1v5a3 3 0 0 1-3 3H3" />
              <polyline points="6,5 3,9 6,13" />
            </svg>
          </KeyBase>
        </div>
      </div>

      {/* Bottom row: emoji and dictation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px 8px',
      }}>
        <span style={{ fontSize: 56, lineHeight: 1 }}>😊</span>
        <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </div>
    </div>
  );
};

// Placeholder UnilingualKeyboard - you can replace this with the actual component
const UnilingualKeyboard: React.FC<{
  selectedContact?: string;
  selectedLanguage?: string;
  highlightedButton?: 'translate' | 'send' | null;
  isTranslating?: boolean;
}> = ({ selectedContact, selectedLanguage, highlightedButton, isTranslating }) => {
  return (
    <div style={{
      backgroundColor: '#1C1C1E',
      padding: '16px',
      minHeight: 400,
    }}>
      {/* Unilingual keyboard interface */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {/* Contact selector */}
        <div style={{
          backgroundColor: '#2C2C2E',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: 20,
            color: selectedContact ? '#fff' : '#8E8E93',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            {selectedContact || 'Select Contact'}
          </span>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Language selector */}
        <div style={{
          backgroundColor: '#2C2C2E',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: 20,
            color: selectedLanguage ? '#fff' : '#8E8E93',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            {selectedLanguage || 'Select Language'}
          </span>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Text input area */}
        <div style={{
          backgroundColor: '#2C2C2E',
          borderRadius: 12,
          padding: '16px',
          minHeight: 120,
        }}>
          <span style={{
            fontSize: 18,
            color: '#8E8E93',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            Type your message...
          </span>
        </div>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
        }}>
          {/* Translate button */}
          <div style={{
            flex: 1,
            backgroundColor: highlightedButton === 'translate' ? '#0A84FF' : '#2C2C2E',
            borderRadius: 12,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isTranslating ? 0.6 : 1,
            boxShadow: highlightedButton === 'translate' ? '0 0 20px rgba(10, 132, 255, 0.5)' : 'none',
          }}>
            <span style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#fff',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}>
              {isTranslating ? 'Translating...' : 'Translate'}
            </span>
          </div>

          {/* Send button */}
          <div style={{
            flex: 1,
            backgroundColor: highlightedButton === 'send' ? '#34C759' : '#2C2C2E',
            borderRadius: 12,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: highlightedButton === 'send' ? '0 0 20px rgba(52, 199, 89, 0.5)' : 'none',
          }}>
            <span style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#fff',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}>
              Send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface KeyboardSwitcherProps {
  activeKeyboard: 'apple' | 'unilingual';
  switchFrame: number;
  inputText?: string;
  selectedContact?: string;
  selectedLanguage?: string;
  highlightedButton?: 'translate' | 'send' | null;
  isTranslating?: boolean;
}

export const KeyboardSwitcher: React.FC<KeyboardSwitcherProps> = ({
  activeKeyboard,
  switchFrame,
  inputText,
  selectedContact,
  selectedLanguage,
  highlightedButton,
  isTranslating,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate spring animation for smooth transition
  const transitionProgress = spring({
    frame: frame - switchFrame,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
      mass: 1,
    },
  });

  // Determine if we're in transition
  const isAfterSwitch = frame >= switchFrame;

  // Apple keyboard position and opacity
  const appleTranslateX = interpolate(
    transitionProgress,
    [0, 1],
    [0, activeKeyboard === 'unilingual' && isAfterSwitch ? -1080 : 0]
  );
  const appleOpacity = interpolate(
    transitionProgress,
    [0, 0.5, 1],
    [1, activeKeyboard === 'unilingual' && isAfterSwitch ? 0.5 : 1, activeKeyboard === 'unilingual' && isAfterSwitch ? 0 : 1]
  );

  // Unilingual keyboard position and opacity
  const unilingualTranslateX = interpolate(
    transitionProgress,
    [0, 1],
    [activeKeyboard === 'unilingual' && isAfterSwitch ? 1080 : 0, 0]
  );
  const unilingualOpacity = interpolate(
    transitionProgress,
    [0, 0.5, 1],
    [activeKeyboard === 'unilingual' && isAfterSwitch ? 0 : 1, activeKeyboard === 'unilingual' && isAfterSwitch ? 0.5 : 1, activeKeyboard === 'unilingual' && isAfterSwitch ? 1 : 1]
  );

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Apple Keyboard */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform: `translateX(${appleTranslateX}px)`,
        opacity: appleOpacity,
        pointerEvents: activeKeyboard === 'apple' ? 'auto' : 'none',
      }}>
        <IOSKeyboard inputText={inputText} />
      </div>

      {/* Unilingual Keyboard */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform: `translateX(${unilingualTranslateX}px)`,
        opacity: unilingualOpacity,
        pointerEvents: activeKeyboard === 'unilingual' ? 'auto' : 'none',
      }}>
        <UnilingualKeyboard
          selectedContact={selectedContact}
          selectedLanguage={selectedLanguage}
          highlightedButton={highlightedButton}
          isTranslating={isTranslating}
        />
      </div>
    </div>
  );
};
