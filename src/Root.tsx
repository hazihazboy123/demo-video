import React from 'react';
import { Composition } from 'remotion';
import { UnilingualDemo } from './components/UnilingualDemo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="UnilingualDemo"
        component={UnilingualDemo}
        durationInFrames={1447} // 48.2 seconds at 30fps (synced with voiceover)
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
