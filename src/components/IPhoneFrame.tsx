import React from 'react';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

// Full screen - no phone frame, just the screen content filling the canvas
// Like a screen recording that fills the whole 1080x1920 space
export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  return (
    <div style={{
      width: 1080,
      height: 1920,
      backgroundColor: '#000',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
};
