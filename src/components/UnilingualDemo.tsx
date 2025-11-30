import React from 'react';
import { AbsoluteFill, useCurrentFrame, Audio, staticFile } from 'remotion';
import { IPhoneFrame } from './IPhoneFrame';
import { AppleMessages } from './AppleMessages';
import { LanguageSelector } from './LanguageSelector';
import { Captions } from './Captions';
import { LanguageShowcase } from './LanguageShowcase';
import { BrandingScreen } from './BrandingScreen';

export const UnilingualDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== TIMELINE SYNCED WITH VOICEOVER (48.2s @ 30fps = 1447 frames) =====
  // All times from timestamps.json, converted to frames (time * 30)
  //
  // VOICEOVER SYNC POINTS:
  // 12.89s (f387):  "They just texted me..." → First message appears
  // 17.46s (f524):  "Oh look, another one." → Second message appears
  // 22.27s (f668):  "Unilingual keyboard..." → Switch to Unilingual keyboard
  // 24.13s (f724):  "paste their message..." → Paste Chinese text
  // 26.02s (f781):  "translate." → Hit translate button
  // 27.60s (f828):  "Oh." → Translation starting to appear
  // 28.12s (f844):  "That's what they meant." → Show English translation
  // 29.39s (f882):  "They're landing tomorrow." → User reads translation
  // 30.95s (f929):  "Now I just type my response in English..." → Start typing
  // 33.54s (f1006): "hit translate..." → Hit translate for Chinese
  // 35.48s (f1064): "Perfect Mandarin." → Show Chinese translation
  // 37.81s (f1134): "Sent." → Message sent
  // 39.24s (f1177): "They're gonna think..." → Parents start replying
  // 45.22s (f1357): "cheat code" → Show parents' response
  // 46.97s (f1409): "Unilingual." → Final branding moment

  const messages = [
    {
      id: 1,
      text: "我们明天下午到机场！很期待见到你 😊",
      isMe: false,
      showAt: 387, // "They just texted me"
    },
    {
      id: 2,
      text: "你能来接我们吗？",
      isMe: false,
      showAt: 524, // "Oh look, another one"
    },
    {
      id: 3,
      text: "当然可以！我很期待见到你们。航班几点到？",
      isMe: true,
      showAt: 1134, // "Sent."
    },
    {
      id: 4,
      text: "哇！你的中文进步很大！",
      isMe: false,
      showAt: 1250, // After "They're gonna think..."
    },
    {
      id: 5,
      text: "我们的女儿找到了一个好丈夫 ❤️",
      isMe: false,
      showAt: 1320, // Before "cheat code"
    },
  ];

  // Keyboard state - switch at "Unilingual keyboard"
  const isUnilingualKeyboard = frame >= 668;

  // ===== COPY/PASTE STATE =====
  // Copy/paste happens during "paste their message" (f724)
  // We show copy menu briefly before paste
  let selectedMessageId: number | null = null;
  let showCopyMenu = false;
  let showPasteMenu = false;
  let inputFocused = false;

  // First copy/paste: f700-f724
  if (frame >= 700 && frame < 712) {
    selectedMessageId = 1;
    showCopyMenu = true;
  } else if (frame >= 712 && frame < 720) {
    selectedMessageId = 2;
    showCopyMenu = true;
  } else if (frame >= 720 && frame < 730) {
    inputFocused = true;
    showPasteMenu = true;
  }

  // Second copy/paste: after parents respond (f1360-f1400)
  if (frame >= 1360 && frame < 1375) {
    selectedMessageId = 4;
    showCopyMenu = true;
  } else if (frame >= 1375 && frame < 1390) {
    selectedMessageId = 5;
    showCopyMenu = true;
  } else if (frame >= 1390 && frame < 1405) {
    inputFocused = true;
    showPasteMenu = true;
  }

  // Language selector states
  // First: select English after pasting (f760-f780)
  const showFirstLanguageSelector = frame >= 760 && frame < 785;
  // Second: select Chinese before "hit translate" (f990-f1010)
  const showSecondLanguageSelector = frame >= 990 && frame < 1015;
  // Third: select English for parents' messages (f1410-f1430)
  const showThirdLanguageSelector = frame >= 1410 && frame < 1435;

  // Currently selected language
  let currentLanguage: { name: string; flag: string; code: string };
  if (frame < 785) {
    currentLanguage = { name: 'Mandarin (Simplified)', flag: '🇨🇳', code: 'zh' };
  } else if (frame < 1015) {
    currentLanguage = { name: 'English', flag: '🇺🇸', code: 'en' };
  } else if (frame < 1435) {
    currentLanguage = { name: 'Mandarin (Simplified)', flag: '🇨🇳', code: 'zh' };
  } else {
    currentLanguage = { name: 'English', flag: '🇺🇸', code: 'en' };
  }

  // Language highlight in selector
  let highlightLanguageInSelector: string | undefined;
  if (showFirstLanguageSelector && frame >= 775) {
    highlightLanguageInSelector = 'en';
  } else if (showSecondLanguageSelector && frame >= 1005) {
    highlightLanguageInSelector = 'zh';
  } else if (showThirdLanguageSelector && frame >= 1425) {
    highlightLanguageInSelector = 'en';
  }

  // Button highlights
  let highlightedButton: 'contacts' | 'transliterate' | 'language' | 'translate' | null = null;

  // Language button highlight before selector
  if ((frame >= 755 && frame < 760) || (frame >= 985 && frame < 990) || (frame >= 1405 && frame < 1410)) {
    highlightedButton = 'language';
  }
  // Translate button during "translate" (f781) and "hit translate" (f1006)
  else if ((frame >= 785 && frame < 828) || (frame >= 1020 && frame < 1064) || (frame >= 1435 && frame < 1480)) {
    highlightedButton = 'translate';
  }

  // Translating animation
  const isTranslating = (frame >= 790 && frame < 828) || (frame >= 1030 && frame < 1064) || (frame >= 1445 && frame < 1480);

  // ===== INPUT TEXT - SYNCED WITH VOICEOVER =====
  let inputText: string | undefined;

  // "paste their message" (f724) - paste first message
  if (frame >= 730 && frame < 745) {
    const pasteProgress = Math.min((frame - 730) / 15, 1);
    const msg = "我们明天下午到机场！很期待见到你 😊";
    inputText = msg.substring(0, Math.floor(pasteProgress * msg.length));
  }
  // Paste second message
  else if (frame >= 745 && frame < 760) {
    const pasteProgress = Math.min((frame - 745) / 15, 1);
    const msg1 = "我们明天下午到机场！很期待见到你 😊";
    const msg2 = " 你能来接我们吗？";
    inputText = msg1 + msg2.substring(0, Math.floor(pasteProgress * msg2.length));
  }
  // Show Chinese while selecting language (f760-f785)
  else if (frame >= 760 && frame < 828) {
    inputText = "我们明天下午到机场！很期待见到你 😊 你能来接我们吗？";
  }
  // "That's what they meant" (f828) - show English translation
  // "They're landing tomorrow" (f882) - still showing
  else if (frame >= 828 && frame < 929) {
    inputText = "We arrive at the airport tomorrow afternoon! Looking forward to seeing you 😊 Can you pick us up?";
  }
  // "Now I just type my response in English" (f929) - type response
  else if (frame >= 929 && frame < 1020) {
    const typingProgress = Math.min((frame - 929) / 70, 1);
    const response = "Of course! I'm excited to see you. What time is your flight?";
    inputText = response.substring(0, Math.floor(typingProgress * response.length));
  }
  // Keep showing English while selecting Chinese (f1020)
  else if (frame >= 1020 && frame < 1064) {
    inputText = "Of course! I'm excited to see you. What time is your flight?";
  }
  // "Perfect Mandarin" (f1064) - show Chinese translation
  else if (frame >= 1064 && frame < 1134) {
    inputText = "当然可以！我很期待见到你们。航班几点到？";
  }
  // After "Sent" (f1134) - clear input, message is sent
  // Parents' messages copy/paste (f1405+)
  else if (frame >= 1405 && frame < 1420) {
    const pasteProgress = Math.min((frame - 1405) / 15, 1);
    const msg = "哇！你的中文进步很大！";
    inputText = msg.substring(0, Math.floor(pasteProgress * msg.length));
  }
  else if (frame >= 1420 && frame < 1435) {
    const pasteProgress = Math.min((frame - 1420) / 15, 1);
    const msg1 = "哇！你的中文进步很大！";
    const msg2 = " 我们的女儿找到了一个好丈夫 ❤️";
    inputText = msg1 + msg2.substring(0, Math.floor(pasteProgress * msg2.length));
  }
  // Show Chinese while translating
  else if (frame >= 1435 && frame < 1480) {
    inputText = "哇！你的中文进步很大！ 我们的女儿找到了一个好丈夫 ❤️";
  }
  // Show English translation of parents' messages
  else if (frame >= 1480) {
    inputText = "Wow! Your Chinese has improved so much! Our daughter found a good husband ❤️";
  }

  // Timeline for additional content after main story
  // Main story ends at ~1550 frames (translation shown)
  // Language montage: 1560-1800 (240 frames = 8 seconds)
  // Branding screen: 1800+ (stays until end)

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
          selectedMessageId={selectedMessageId}
          showCopyMenu={showCopyMenu}
          showPasteMenu={showPasteMenu}
          inputFocused={inputFocused}
        />

        {/* First Language Selector - Select English */}
        <LanguageSelector
          isVisible={showFirstLanguageSelector}
          appearFrame={760}
          selectedLanguage={frame < 780 ? 'zh' : 'en'}
          highlightLanguage={highlightLanguageInSelector}
        />

        {/* Second Language Selector - Select Chinese */}
        <LanguageSelector
          isVisible={showSecondLanguageSelector}
          appearFrame={990}
          selectedLanguage={frame < 1010 ? 'en' : 'zh'}
          highlightLanguage={highlightLanguageInSelector}
        />

        {/* Third Language Selector - Select English for parents' messages */}
        <LanguageSelector
          isVisible={showThirdLanguageSelector}
          appearFrame={1410}
          selectedLanguage={frame < 1430 ? 'zh' : 'en'}
          highlightLanguage={highlightLanguageInSelector}
        />

        {/* Captions/Subtitles - shown throughout voiceover */}
        <Captions />
      </IPhoneFrame>

      {/* Language Showcase - keyboard with cycling languages */}
      <LanguageShowcase startFrame={1560} duration={240} />

      {/* Final Branding Screen */}
      <BrandingScreen startFrame={1800} />
    </AbsoluteFill>
  );
};
