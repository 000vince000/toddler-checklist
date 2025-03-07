export class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement>;

  private constructor() {
    this.sounds = new Map();
    this.preloadSounds();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private preloadSounds() {
    const soundEffects = {
      success: '/sounds/success.mp3',
      click: '/sounds/click.mp3',
      celebration: '/sounds/celebration.mp3',
    };

    Object.entries(soundEffects).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  play(soundName: string) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(console.error);
    }
  }
}

export const playSound = (soundName: string) => {
  SoundManager.getInstance().play(soundName);
}; 