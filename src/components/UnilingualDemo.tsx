import React from 'react';
import { AbsoluteFill, useCurrentFrame, Audio, staticFile } from 'remotion';
import { IPhoneFrame } from './IPhoneFrame';
import { AppleMessages } from './AppleMessages';
import { LanguageSelector } from './LanguageSelector';

export const UnilingualDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== TIMELINE SYNCED WITH VOICEOVER (48.2s @ 30fps = 1447 frames) =====
  //
  // FULL SCRIPT & TIMING:
  // 0.00s (f0):     "My wife's parents have been in America for ten years..."
  // 12.89s (f387):  "They just texted me..." → FIRST MESSAGE APPEARS
  // 17.46s (f524):  "Oh look, another one." → SECOND MESSAGE APPEARS
  // 22.27s (f668):  "Unilingual keyboard..." → SWITCH TO UNILINGUAL KEYBOARD
  // 24.13s (f724):  "paste their message..." → PASTE CHINESE, TAP LANGUAGE
  // 26.02s (f781):  "translate." → SELECT ENGLISH, TRANSLATE TO ENGLISH
  // 28.12s (f844):  "That's what they meant." → SHOW ENGLISH TRANSLATION
  // 30.95s (f929):  "Now I just type my response in English..." → DELETE, TYPE ENGLISH
  // 33.54s (f1006): "hit translate..." → TAP LANGUAGE, SELECT CHINESE, TRANSLATE
  // 35.48s (f1064): "Perfect Mandarin."
  // 37.81s (f1134): "Sent." → MESSAGE SENT
  // 45.22s (f1357): "cheat code" → IN-LAWS RESPOND

  // ===== NEW DETAILED FLOW =====
  // f668: Switch to Unilingual keyboard
  // f700-f720: Show language button highlight (currently Chinese)
  // f724: Paste Chinese message in input
  // f730-f760: Language selector appears, select English
  // f760: English selected, selector closes
  // f781-f830: Translate button highlighted, translating...
  // f830-f844: Show English translation in input
  // f844-f900: "That's what they meant" - user reads translation
  // f900: Delete translation, clear input
  // f929-f1000: Type English response
  // f1000-f1040: Language selector appears, select Chinese
  // f1040: Chinese selected, selector closes
  // f1006-f1080: Translate button highlighted, translating...
  // f1080-f1134: Show Chinese translation
  // f1134: Message sent

  const messages = [
    {
      id: 1,
      text: "我们明天下午到机场！很期待见到你 😊",
      isMe: false,
      showAt: 387,
    },
    {
      id: 2,
      text: "你能来接我们吗？",
      isMe: false,
      showAt: 524,
    },
    {
      id: 3,
      text: "当然可以！我很期待见到你们。航班几点到？",
      isMe: true,
      showAt: 1134,
    },
    {
      id: 4,
      text: "哇！你的中文进步很大！",
      isMe: false,
      showAt: 1280,
    },
    {
      id: 5,
      text: "我们的女儿找到了一个好丈夫 ❤️",
      isMe: false,
      showAt: 1357,
    },
  ];

  // Keyboard state
  const isUnilingualKeyboard = frame >= 668;

  // Language selector states
  // First appearance: select English to read their message (f730-f760)
  const showFirstLanguageSelector = frame >= 730 && frame < 765;
  // Second appearance: select Chinese to translate response (f1000-f1040)
  const showSecondLanguageSelector = frame >= 1000 && frame < 1045;

  // Currently selected language (for keyboard display)
  // Starts as Chinese, changes to English at f760, back to Chinese at f1040
  let currentLanguage: { name: string; flag: string; code: string };
  if (frame < 765) {
    currentLanguage = { name: 'Chinese', flag: '🇨🇳', code: 'zh' };
  } else if (frame < 1045) {
    currentLanguage = { name: 'English', flag: '🇺🇸', code: 'en' };
  } else {
    currentLanguage = { name: 'Chinese', flag: '🇨🇳', code: 'zh' };
  }

  // Which language to highlight in selector
  let highlightLanguageInSelector: string | undefined;
  if (showFirstLanguageSelector && frame >= 750) {
    highlightLanguageInSelector = 'en'; // Selecting English
  } else if (showSecondLanguageSelector && frame >= 1030) {
    highlightLanguageInSelector = 'zh'; // Selecting Chinese
  }

  // Button highlights
  let highlightedButton: 'contacts' | 'transliterate' | 'language' | 'translate' | null = null;

  // Highlight language button before opening selector
  if ((frame >= 720 && frame < 730) || (frame >= 990 && frame < 1000)) {
    highlightedButton = 'language';
  }
  // Highlight translate button during translation
  else if ((frame >= 770 && frame < 830) || (frame >= 1050 && frame < 1120)) {
    highlightedButton = 'translate';
  }

  // Is translating animation
  const isTranslating = (frame >= 785 && frame < 830) || (frame >= 1060 && frame < 1120);

  // Input text progression
  let inputText: string | undefined;

  if (frame >= 724 && frame < 770) {
    // Paste Chinese message - "paste their message"
    inputText = "我们明天下午到机场！很期待见到你";
  } else if (frame >= 830 && frame < 900) {
    // Show English translation - "That's what they meant"
    inputText = "We arrive at the airport tomorrow! Excited to see you";
  } else if (frame >= 929 && frame < 1050) {
    // Type English response - "type my response in English"
    const typingStart = 929;
    const typingEnd = 1000;
    const typingProgress = Math.min((frame - typingStart) / (typingEnd - typingStart), 1);
    const fullText = "Of course! I'm excited to see you. What time is your flight?";
    const charCount = Math.floor(typingProgress * fullText.length);
    inputText = fullText.substring(0, charCount);
  } else if (frame >= 1080 && frame < 1134) {
    // Show Chinese translation - "Perfect Mandarin"
    inputText = "当然可以！我很期待见到你们。航班几点到？";
  }
  // After 1134 (Sent), inputText is undefined

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Voiceover audio */}
      <Audio src={staticFile('audio/voiceover.mp3')} />

      <IPhoneFrame>
        <AppleMessages
          contactName="Wei Lin's Parents"
          contactInitials="林"
          messages={messages}
          showTypingAt={350}
          typingDuration={35}
          inputText={inputText}
          showUnilingualKeyboard={isUnilingualKeyboard}
          keyboardSwitchFrame={668}
          selectedLanguage={currentLanguage}
          highlightedButton={highlightedButton}
          isTranslating={isTranslating}
        />

        {/* First Language Selector - Select English to translate their message */}
        <LanguageSelector
          isVisible={showFirstLanguageSelector}
          appearFrame={730}
          selectedLanguage={frame < 760 ? 'zh' : 'en'}
          highlightLanguage={highlightLanguageInSelector}
        />

        {/* Second Language Selector - Select Chinese to translate our response */}
        <LanguageSelector
          isVisible={showSecondLanguageSelector}
          appearFrame={1000}
          selectedLanguage={frame < 1040 ? 'en' : 'zh'}
          highlightLanguage={highlightLanguageInSelector}
        />
      </IPhoneFrame>
    </AbsoluteFill>
  );
};
