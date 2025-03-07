// Define the sprite configuration type
interface SpriteConfig {
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  fps: number;
}

// Export the sprite configurations
export const SPRITE_CONFIGS: Record<string, SpriteConfig> = {
  'put-on-clothes': {
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 8,
    fps: 8
  },
  'change-diaper-morning': {
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 8,
    fps: 8
  },
  'wash-hands': {
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 8,
    fps: 8
  },
  'eat-dinner': {
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 8,
    fps: 8
  },
  'put-toys-back': {
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 8,
    fps: 8
  },
  'change-diaper-evening': {
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 8,
    fps: 8
  }
};

// You can also add helper functions for sprite animation here
export function calculateSpriteFrame(
  currentFrame: number, 
  config: SpriteConfig
): { x: number; y: number } {
  const x = (currentFrame % config.frameCount) * config.frameWidth;
  const y = Math.floor(currentFrame / config.frameCount) * config.frameHeight;
  return { x, y };
} 