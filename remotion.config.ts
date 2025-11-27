import { Config } from '@remotion/cli/config';

// ===== MAXIMUM QUALITY SETTINGS FOR CRISP MOBILE PLAYBACK =====
// Optimized for iOS/Android with perfect color reproduction and sharpness

// Frame rendering quality
Config.setVideoImageFormat('png'); // LOSSLESS - No compression artifacts!
Config.setOverwriteOutput(true);

// Scale=2 renders text at 2x resolution for high-DPI screens (iPhone, Android flagships)
Config.setScale(2);

// Video encoding quality
Config.setCodec('h264'); // Best mobile compatibility
Config.setCrf(15); // ULTRA HIGH quality (lower = better, 15 is near-lossless)

// H.264 encoding preset
Config.setX264Preset('slow');

// Audio quality
Config.setAudioCodec('aac');
Config.setAudioBitrate('256k');

// Pixel format
Config.setPixelFormat('yuv420p');

// CRITICAL: Override FFmpeg command for PERFECT mobile video quality
Config.overrideFfmpegCommand(({ args }) => {
  // Find the pixel format argument and replace yuvj420p with yuv420p
  const pixFmtIndex = args.findIndex(arg => arg === '-pix_fmt');
  if (pixFmtIndex !== -1) {
    args[pixFmtIndex + 1] = 'yuv420p';
  }

  // Inject bt709 color space parameters for HD accuracy on phones
  const colorSpaceOptions = [
    '-colorspace', 'bt709',
    '-color_primaries', 'bt709',
    '-color_trc', 'bt709',
  ];

  args.splice(args.length - 1, 0, ...colorSpaceOptions);
  return args;
});
