import React from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface IOSContextMenuProps {
  isVisible: boolean;
  appearFrame: number;
  type: 'copy' | 'paste';
  position: { x: number; y: number };
}

// Scale factor
const S = 2.4;

export const IOSContextMenu: React.FC<IOSContextMenuProps> = ({
  isVisible,
  appearFrame,
  type,
  position,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!isVisible) return null;

  const progress = spring({
    frame: frame - appearFrame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 8,
    config: { damping: 15, stiffness: 200 },
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = progress;

  const menuItems = type === 'copy'
    ? ['Copy', 'Reply', 'More...']
    : ['Paste'];

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `scale(${scale}) translateX(-50%)`,
        opacity,
        zIndex: 1000,
      }}
    >
      {/* Menu container */}
      <div
        style={{
          backgroundColor: '#2C2C2E',
          borderRadius: 14 * S,
          overflow: 'hidden',
          display: 'flex',
          boxShadow: `0 ${8 * S}px ${24 * S}px rgba(0, 0, 0, 0.4)`,
        }}
      >
        {menuItems.map((item, index) => {
          const isHighlighted = (type === 'copy' && item === 'Copy') || (type === 'paste' && item === 'Paste');
          return (
            <div
              key={item}
              style={{
                padding: `${12 * S}px ${20 * S}px`,
                borderRight: index < menuItems.length - 1 ? `1px solid #48484A` : 'none',
                backgroundColor: isHighlighted ? 'rgba(0, 122, 255, 0.3)' : 'transparent',
              }}
            >
              <span
                style={{
                  fontSize: 17 * S,
                  fontWeight: 400,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>

      {/* Arrow pointing down */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -8 * S,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: `${10 * S}px solid transparent`,
          borderRight: `${10 * S}px solid transparent`,
          borderTop: `${10 * S}px solid #2C2C2E`,
        }}
      />
    </div>
  );
};
