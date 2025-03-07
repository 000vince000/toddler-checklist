class MusicManager {
  private static instance: MusicManager;
  private bgMusic: HTMLAudioElement;
  private isPlaying: boolean = false;

  private constructor() {
    this.bgMusic = new Audio('/music/background.mp3');
    this.bgMusic.loop = true;
    this.setupAutoplay();
  }

  static getInstance(): MusicManager {
    if (!MusicManager.instance) {
      MusicManager.instance = new MusicManager();
    }
    return MusicManager.instance;
  }

  private setupAutoplay() {
    document.addEventListener('click', () => {
      if (!this.isPlaying) {
        this.play();
      }
    }, { once: true });
  }

  play() {
    this.bgMusic.play().catch(console.error);
    this.isPlaying = true;
  }

  pause() {
    this.bgMusic.pause();
    this.isPlaying = false;
  }

  setVolume(volume: number) {
    this.bgMusic.volume = Math.max(0, Math.min(1, volume));
  }
}

export const musicManager = MusicManager.getInstance(); 