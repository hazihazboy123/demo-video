import React from 'react';
import { Composition } from 'remotion';
import { UnilingualDemo } from './components/UnilingualDemo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="UnilingualDemo"
        component={UnilingualDemo}
        durationInFrames={1920} // 48.2s voiceover + language montage + branding (64s total)
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
