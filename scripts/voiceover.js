require('dotenv').config();
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const fs = require('fs');
const path = require('path');

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// The voiceover script - chill, confident, slightly cocky
// Pauses marked with ... for natural timing with visuals
const script = `My wife's parents have been in America for ten years.

They still don't think I've learned any Chinese.

And honestly... they're right. I haven't.

But they don't need to know that.

They just texted me... no idea what this says.

Oh look, another one. Still no clue.

But I know exactly what to do.

Unilingual keyboard... paste their message... translate.

Oh. That's what they meant. They're landing tomorrow.

Now I just type my response in English... hit translate...

Perfect Mandarin. Sent.

They're gonna think I've been studying this whole time.

Nah. I just got the cheat code.

Unilingual.`;

// Voice ID: Noah – Chill Conversationalist
const VOICE_ID = 'eZm9vdjYgL9PZKtf7XMM';

async function generateVoiceover() {
  console.log('🎙️  Generating voiceover with Noah...');
  console.log('📝 Script:\n', script);
  console.log('\n');

  const outputDir = path.join(__dirname, '../public/audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const response = await client.textToSpeech.convertWithTimestamps(
      VOICE_ID,
      {
        text: script,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,        // Balanced
          similarity_boost: 0.75,
          style: 0.3,           // Keep it chill, not too dramatic
          use_speaker_boost: true
        }
      }
    );

    // Save audio file
    const audioPath = path.join(outputDir, 'voiceover.mp3');
    const audioBuffer = Buffer.from(response.audioBase64, 'base64');
    fs.writeFileSync(audioPath, audioBuffer);
    console.log(`✅ Audio saved to ${audioPath}`);

    // Convert character timestamps to word timestamps
    const { characters, characterStartTimesSeconds, characterEndTimesSeconds } = response.alignment;
    const words = [];
    let currentWord = '';
    let wordStartTime = null;

    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      const startTime = characterStartTimesSeconds[i];

      if (char === ' ' || char === '\n' || char === '\r' || char === '\t') {
        if (currentWord) {
          words.push({
            word: currentWord,
            start: wordStartTime,
            end: characterEndTimesSeconds[i - 1],
          });
          currentWord = '';
          wordStartTime = null;
        }
      } else {
        if (!currentWord) {
          wordStartTime = startTime;
        }
        currentWord += char;
      }
    }

    if (currentWord) {
      words.push({
        word: currentWord,
        start: wordStartTime,
        end: characterEndTimesSeconds[characterEndTimesSeconds.length - 1],
      });
    }

    // Calculate total duration
    const totalDuration = characterEndTimesSeconds[characterEndTimesSeconds.length - 1];

    // Save timestamps
    const timestampsPath = path.join(outputDir, 'timestamps.json');
    fs.writeFileSync(timestampsPath, JSON.stringify({
      script,
      words,
      totalDuration,
      fps: 30,
      totalFrames: Math.ceil(totalDuration * 30),
    }, null, 2));

    console.log(`✅ Timestamps saved to ${timestampsPath}`);
    console.log(`\n📊 Stats:`);
    console.log(`   Duration: ${totalDuration.toFixed(2)}s`);
    console.log(`   Words: ${words.length}`);
    console.log(`   Frames (at 30fps): ${Math.ceil(totalDuration * 30)}`);

    // Print key timestamps for syncing visuals
    console.log(`\n🎬 Key phrases for visual sync:`);

    const keyPhrases = [
      "They just texted me",
      "another one",
      "what to do",
      "Unilingual keyboard",
      "translate",
      "That's what they meant",
      "type my response",
      "hit translate",
      "Sent",
      "cheat code",
      "Unilingual"
    ];

    keyPhrases.forEach(phrase => {
      const phraseWords = phrase.toLowerCase().split(' ');
      const firstWord = phraseWords[0];

      for (let i = 0; i < words.length; i++) {
        if (words[i].word.toLowerCase().includes(firstWord)) {
          // Check if this is the start of the phrase
          let match = true;
          for (let j = 1; j < phraseWords.length && i + j < words.length; j++) {
            if (!words[i + j].word.toLowerCase().includes(phraseWords[j])) {
              match = false;
              break;
            }
          }
          if (match) {
            const startTime = words[i].start;
            const frame = Math.round(startTime * 30);
            console.log(`   "${phrase}" → ${startTime.toFixed(2)}s (frame ${frame})`);
            break;
          }
        }
      }
    });

    return { audioPath, timestampsPath, totalDuration };
  } catch (error) {
    console.error('❌ Error generating voiceover:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateVoiceover()
    .then(() => console.log('\n🎉 Done! Ready to sync with Remotion.'))
    .catch(console.error);
}

module.exports = { generateVoiceover, script, VOICE_ID };
