import React from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { UnilingualKeyboard } from './UnilingualKeyboard';

interface Message {
  id: number;
  text: string;
  isMe: boolean;
  showAt: number;
}

interface AppleMessagesProps {
  contactName: string;
  contactInitials?: string;
  messages: Message[];
  showTypingAt?: number;
  typingDuration?: number;
  inputText?: string;
  // Keyboard switching props
  showUnilingualKeyboard?: boolean;
  keyboardSwitchFrame?: number;
  selectedLanguage?: { name: string; flag: string };
  highlightedButton?: 'contacts' | 'transliterate' | 'language' | 'translate' | null;
  isTranslating?: boolean;
}

// Scale factor - tuned for 1080x1920 canvas to match real iOS
// iPhone screen is 393x852 points, we have 1080x1920 pixels
// 1080/393 = 2.75, but keyboard needs to be proportionally smaller
const S = 2.4; // Slightly reduced for better proportions

// iOS Status Bar
const StatusBar: React.FC = () => {
  return (
    <div style={{
      height: 54 * S,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${14 * S}px ${28 * S}px 0`,
    }}>
      {/* Time */}
      <div style={{
        fontSize: 17 * S,
        fontWeight: 600,
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}>
        8:33
      </div>

      {/* Dynamic Island space */}
      <div style={{
        width: 126 * S,
        height: 37 * S,
        backgroundColor: '#000',
        borderRadius: 20 * S,
      }} />

      {/* Right icons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6 * S,
      }}>
        {/* Signal */}
        <svg width={18 * S} height={12 * S} viewBox="0 0 18 12" fill="none">
          <rect x="0" y="7" width="3" height="5" rx="0.5" fill="#fff"/>
          <rect x="5" y="5" width="3" height="7" rx="0.5" fill="#fff"/>
          <rect x="10" y="2" width="3" height="10" rx="0.5" fill="rgba(255,255,255,0.3)"/>
          <rect x="15" y="0" width="3" height="12" rx="0.5" fill="rgba(255,255,255,0.3)"/>
        </svg>
        {/* 5G E */}
        <span style={{
          fontSize: 14 * S,
          fontWeight: 600,
          color: '#fff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}>5G E</span>
        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 25 * S,
            height: 12 * S,
            border: `${1 * S}px solid rgba(255,255,255,0.35)`,
            borderRadius: 3 * S,
            padding: 2 * S,
          }}>
            <div style={{
              width: '30%',
              height: '100%',
              backgroundColor: '#FF3B30',
              borderRadius: 1 * S,
            }} />
          </div>
          <div style={{
            width: 2 * S,
            height: 5 * S,
            backgroundColor: 'rgba(255,255,255,0.35)',
            borderRadius: `0 ${1 * S}px ${1 * S}px 0`,
            marginLeft: 1 * S,
          }} />
        </div>
      </div>
    </div>
  );
};

// Messages Header
const MessagesHeader: React.FC<{ contactName: string; contactInitials?: string }> = ({
  contactName,
  contactInitials
}) => {
  const initials = contactInitials || contactName[0].toUpperCase();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${12 * S}px ${20 * S}px`,
    }}>
      {/* Back button with badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6 * S,
      }}>
        <svg width={12 * S} height={21 * S} viewBox="0 0 12 21" fill="none">
          <path d="M10 2L2 10.5L10 19" stroke="#007AFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{
          backgroundColor: '#3A3A3C',
          borderRadius: 12 * S,
          padding: `${4 * S}px ${10 * S}px`,
        }}>
          <span style={{
            fontSize: 17 * S,
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>7</span>
        </div>
      </div>

      {/* Center - Avatar and name */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4 * S,
      }}>
        <div style={{
          width: 50 * S,
          height: 50 * S,
          borderRadius: 25 * S,
          background: 'linear-gradient(180deg, #8E8E93 0%, #636366 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 22 * S,
            fontWeight: 500,
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            {initials}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4 * S,
        }}>
          <span style={{
            fontSize: 15 * S,
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            {contactName}
          </span>
          <svg width={8 * S} height={14 * S} viewBox="0 0 8 14" fill="none">
            <path d="M1 1L7 7L1 13" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Video call button */}
      <div style={{
        width: 44 * S,
        height: 44 * S,
        borderRadius: 22 * S,
        backgroundColor: '#3A3A3C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width={24 * S} height={18 * S} viewBox="0 0 24 18" fill="none">
          <rect x="1" y="2" width="15" height="14" rx="2" stroke="#007AFF" strokeWidth="2" fill="none"/>
          <path d="M18 6L23 3V15L18 12" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
    </div>
  );
};

// Typing indicator
const TypingIndicator: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{
      display: 'flex',
      padding: `0 ${20 * S}px`,
      marginTop: 8 * S,
    }}>
      <div style={{
        backgroundColor: '#3A3A3C',
        borderRadius: 22 * S,
        padding: `${12 * S}px ${18 * S}px`,
        display: 'flex',
        gap: 6 * S,
      }}>
        {[0, 1, 2].map((i) => {
          const delay = i * 8;
          const opacity = interpolate((frame + delay) % 30, [0, 10, 20, 30], [0.4, 1, 0.4, 0.4]);
          const translateY = interpolate((frame + delay) % 30, [0, 10, 20, 30], [0, -4, 0, 0]);
          return (
            <div
              key={i}
              style={{
                width: 10 * S,
                height: 10 * S,
                borderRadius: 5 * S,
                backgroundColor: '#8E8E93',
                opacity,
                transform: `translateY(${translateY * S}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Message bubble
const MessageBubble: React.FC<{ message: Message; isFirst?: boolean; isLast?: boolean; showDelivered?: boolean }> = ({
  message,
  isFirst = true,
  isLast = true,
  showDelivered = false
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - message.showAt, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (frame < message.showAt) return null;

  const opacity = progress;
  const scale = interpolate(progress, [0, 1], [0.9, 1]);
  const translateY = interpolate(progress, [0, 1], [15, 0]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: message.isMe ? 'flex-end' : 'flex-start',
      padding: `0 ${20 * S}px`,
      marginTop: isFirst ? 10 * S : 3 * S,
      opacity,
      transform: `translateY(${translateY}px) scale(${scale})`,
    }}>
      <div style={{
        maxWidth: '75%',
        backgroundColor: message.isMe ? '#007AFF' : '#3A3A3C',
        borderRadius: 22 * S,
        padding: `${10 * S}px ${18 * S}px`,
      }}>
        <span style={{
          fontSize: 20 * S,
          lineHeight: 1.3,
          color: '#fff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}>
          {message.text}
        </span>
      </div>
      {showDelivered && (
        <span style={{
          fontSize: 13 * S,
          color: '#8E8E93',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          marginTop: 4 * S,
          marginRight: 6 * S,
        }}>
          Delivered
        </span>
      )}
    </div>
  );
};

// Timestamp
const TimestampDivider: React.FC<{ text: string }> = ({ text }) => (
  <div style={{
    textAlign: 'center',
    padding: `${20 * S}px 0 ${12 * S}px`,
  }}>
    <span style={{
      fontSize: 14 * S,
      color: '#8E8E93',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      {text}
    </span>
  </div>
);

// Input bar
const InputBar: React.FC<{ typedText?: string }> = ({ typedText }) => {
  return (
    <div style={{
      padding: `${10 * S}px ${14 * S}px`,
      display: 'flex',
      alignItems: 'center',
      gap: 10 * S,
      backgroundColor: '#000',
    }}>
      {/* Plus button */}
      <div style={{
        width: 38 * S,
        height: 38 * S,
        borderRadius: 19 * S,
        backgroundColor: '#3A3A3C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width={22 * S} height={22 * S} viewBox="0 0 22 22" fill="none">
          <path d="M11 4V18M4 11H18" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Text input */}
      <div style={{
        flex: 1,
        height: 42 * S,
        borderRadius: 21 * S,
        border: `${1.5 * S}px solid #3A3A3C`,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${18 * S}px`,
      }}>
        <span style={{
          fontSize: 20 * S,
          color: typedText ? '#fff' : '#8E8E93',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}>
          {typedText || 'iMessage'}
        </span>
      </div>

      {/* Send button */}
      {typedText && (
        <div style={{
          width: 38 * S,
          height: 38 * S,
          borderRadius: 19 * S,
          backgroundColor: '#007AFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width={20 * S} height={20 * S} viewBox="0 0 20 20" fill="none">
            <path d="M10 16V4M10 4L5 9M10 4L15 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
};

// iOS Keyboard - Exact replica of Apple's native keyboard
// Canvas is 1080px wide
// Measurements based on real iOS keyboard proportions
const KEYBOARD_SIDE_PADDING = 6;
const KEY_GAP = 12;
const KEY_RADIUS = 10;
const KEY_HEIGHT = 100;
// 10 keys + 9 gaps + 2*padding = 1080
// 10*keyWidth + 9*12 + 12 = 1080 → keyWidth = (1080 - 108 - 12) / 10 = 96
const KEY_WIDTH = 96;

const IOSKeyboard: React.FC<{ inputText?: string }> = ({ inputText }) => {
  const suggestions = inputText ? [`"${inputText}"`, 'afternoon', 'afterwords'] : ['"I"', 'The', "I'm"];

  const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  // Row 2 is 9 keys centered
  // Row 2 width = 9*96 + 8*12 = 864 + 96 = 960, centered in 1080 = 60px padding each side

  // Row 3: shift + 7 letter keys + backspace
  // 7 keys = 7*96 + 6*12 = 672 + 72 = 744
  // Remaining = 1080 - 12 - 744 - 12 - 12 = 300 for shift + backspace
  // shift = 84, backspace = 84, but they need more space
  // Let's calc: 1080 - 12 (padding) = 1068
  // 7 keys + 6 gaps = 744, shift gap keys gap backspace = shift + 12 + 744 + 12 + backspace
  // 1068 = shift + 12 + 744 + 12 + backspace → shift + backspace = 300, each = 150
  const SHIFT_WIDTH = 90;
  const BACKSPACE_WIDTH = 90;
  // Recalc: 90 + 12 + 744 + 12 + 90 = 948, centered means (1080-948)/2 = 66 padding

  // Row 4: 123 + globe + space + return
  // Make 123 and globe square-ish, return slightly wider
  const NUM_KEY_WIDTH = 90;
  const GLOBE_KEY_WIDTH = 90;
  const RETURN_KEY_WIDTH = 180;
  // Space = 1080 - 12 - 90 - 12 - 90 - 12 - space - 12 - 180 - 12 = 1080 - 420 = 660
  const SPACE_WIDTH = 590;

  const KeyBase: React.FC<{
    width: number;
    isSpecial?: boolean;
    children: React.ReactNode;
  }> = ({ width, isSpecial = false, children }) => (
    <div style={{
      width,
      height: KEY_HEIGHT,
      backgroundColor: isSpecial ? '#4A4A4C' : '#636366',
      borderRadius: KEY_RADIUS,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
    </div>
  );

  const LetterKey: React.FC<{ letter: string }> = ({ letter }) => (
    <KeyBase width={KEY_WIDTH}>
      <span style={{
        fontSize: 52,
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        fontWeight: 400,
      }}>
        {letter}
      </span>
    </KeyBase>
  );

  return (
    <div style={{ backgroundColor: '#0D0D0D' }}>
      {/* QuickType Suggestions Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 90,
        backgroundColor: '#1C1C1E',
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
              fontSize: 38,
              color: '#fff',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}>{s}</span>
          </div>
        ))}
        <div style={{
          width: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid #38383A',
          height: '100%',
        }}>
          <span style={{ fontSize: 36, color: '#fff', fontWeight: 500 }}>≡A</span>
        </div>
      </div>

      {/* Keyboard rows */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: `20px ${KEYBOARD_SIDE_PADDING}px 16px`,
        backgroundColor: '#0D0D0D',
      }}>
        {/* Row 1: q w e r t y u i o p */}
        <div style={{ display: 'flex', gap: KEY_GAP, justifyContent: 'center' }}>
          {row1.map((key) => <LetterKey key={key} letter={key} />)}
        </div>

        {/* Row 2: a s d f g h j k l (centered) */}
        <div style={{ display: 'flex', gap: KEY_GAP, justifyContent: 'center' }}>
          {row2.map((key) => <LetterKey key={key} letter={key} />)}
        </div>

        {/* Row 3: shift z x c v b n m backspace */}
        <div style={{ display: 'flex', gap: KEY_GAP, justifyContent: 'center' }}>
          {/* Shift */}
          <KeyBase width={SHIFT_WIDTH} isSpecial>
            <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V6M5 12l7-7 7 7" />
            </svg>
          </KeyBase>
          {row3.map((key) => <LetterKey key={key} letter={key} />)}
          {/* Backspace */}
          <KeyBase width={BACKSPACE_WIDTH} isSpecial>
            <svg width={44} height={32} viewBox="0 0 24 18" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H8l-7-8 7-8z" />
              <line x1="17" y1="6" x2="12" y2="12" />
              <line x1="12" y1="6" x2="17" y2="12" />
            </svg>
          </KeyBase>
        </div>

        {/* Row 4: 123, globe, space, return */}
        <div style={{ display: 'flex', gap: KEY_GAP, justifyContent: 'center' }}>
          {/* 123 */}
          <KeyBase width={NUM_KEY_WIDTH} isSpecial>
            <span style={{ fontSize: 36, color: '#fff', fontWeight: 500 }}>123</span>
          </KeyBase>

          {/* Globe */}
          <KeyBase width={GLOBE_KEY_WIDTH} isSpecial>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </KeyBase>

          {/* Space */}
          <KeyBase width={SPACE_WIDTH}>
            <span></span>
          </KeyBase>

          {/* Return */}
          <KeyBase width={RETURN_KEY_WIDTH} isSpecial>
            <svg width={36} height={28} viewBox="0 0 20 16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 1v5a3 3 0 0 1-3 3H3" />
              <polyline points="6,5 3,9 6,13" />
            </svg>
          </KeyBase>
        </div>
      </div>
    </div>
  );
};

// Home indicator
const HomeIndicator: React.FC<{ isUnilingualKeyboard?: boolean }> = ({ isUnilingualKeyboard = false }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 0',
    backgroundColor: '#1C1C1E',
  }}>
    <div style={{
      width: 280,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
    }} />
  </div>
);

export const AppleMessages: React.FC<AppleMessagesProps> = ({
  contactName,
  contactInitials,
  messages,
  showTypingAt,
  typingDuration = 45,
  inputText,
  showUnilingualKeyboard = false,
  keyboardSwitchFrame = 0,
  selectedLanguage = { name: 'Chinese', flag: '🇨🇳' },
  highlightedButton = null,
  isTranslating = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const showTyping = showTypingAt !== undefined && frame >= showTypingAt && frame < showTypingAt + typingDuration;

  // Keyboard switch animation
  const shouldShowUnilingual = showUnilingualKeyboard && frame >= keyboardSwitchFrame;
  const switchProgress = keyboardSwitchFrame > 0 && frame >= keyboardSwitchFrame
    ? spring({
        frame: frame - keyboardSwitchFrame,
        fps,
        from: 0,
        to: 1,
        durationInFrames: 12,
        config: { damping: 20, stiffness: 200 },
      })
    : showUnilingualKeyboard ? 1 : 0;

  const visibleMessages = messages.filter(m => frame >= m.showAt);
  const lastVisibleMessage = visibleMessages[visibleMessages.length - 1];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      <StatusBar />
      <MessagesHeader contactName={contactName} contactInitials={contactInitials} />

      {/* Messages area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}>
        <TimestampDivider text="Today 12:55 PM" />

        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];
          const isFirst = !prevMsg || prevMsg.isMe !== msg.isMe;
          const isLast = !nextMsg || nextMsg.isMe !== msg.isMe;
          const showDelivered = msg.isMe && isLast && msg === lastVisibleMessage;

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isFirst={isFirst}
              isLast={isLast}
              showDelivered={showDelivered}
            />
          );
        })}
        {showTyping && <TypingIndicator />}
      </div>

      <InputBar typedText={inputText} />

      {/* Keyboard Container with switch animation */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* iOS Keyboard */}
        <div
          style={{
            transform: `translateX(${-switchProgress * 100}%)`,
            opacity: 1 - switchProgress,
            position: shouldShowUnilingual ? 'absolute' : 'relative',
            width: '100%',
            top: 0,
            left: 0,
          }}
        >
          <IOSKeyboard inputText={inputText} />
        </div>

        {/* Unilingual Keyboard */}
        <div
          style={{
            transform: `translateX(${(1 - switchProgress) * 100}%)`,
            opacity: switchProgress,
            position: !shouldShowUnilingual ? 'absolute' : 'relative',
            width: '100%',
            top: 0,
            left: 0,
          }}
        >
          <UnilingualKeyboard
            selectedLanguage={selectedLanguage}
            highlightedButton={highlightedButton}
            isTranslating={isTranslating}
          />
        </div>
      </div>

      <HomeIndicator isUnilingualKeyboard={shouldShowUnilingual} />
    </div>
  );
};
