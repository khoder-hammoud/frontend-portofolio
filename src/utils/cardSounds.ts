// Card Sound Effects Utility
// Uses Web Audio API to generate subtle card flip sounds

class CardSoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private userInteracted: boolean = false;

  constructor() {
    // Don't initialize AudioContext immediately
    this.initUserInteraction();
  }

  private initUserInteraction() {
    if (typeof window !== 'undefined') {
      const handleUserInteraction = () => {
        this.userInteracted = true;
        // Initialize AudioContext on first user interaction
        if (!this.audioContext && 'AudioContext' in window) {
          this.audioContext = new AudioContext();
        }
        // Remove listeners after first interaction
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };

      // Add event listeners for user interaction
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('keydown', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
    }
  }

  private ensureAudioContext(): boolean {
    if (!this.userInteracted || !this.audioContext) {
      return false;
    }
    
    // Resume if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    return true;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Subtle card flip sound
  playFlip() {
    if (!this.enabled || !this.ensureAudioContext()) return;

    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext!.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      400,
      this.audioContext!.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.1, this.audioContext!.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext!.currentTime + 0.1
    );

    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + 0.1);
  }

  // Subtle hover sound
  playHover() {
    if (!this.enabled || !this.ensureAudioContext()) return;

    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);

    oscillator.frequency.setValueAtTime(1200, this.audioContext!.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.05, this.audioContext!.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext!.currentTime + 0.05
    );

    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + 0.05);
  }

  // Card shuffle sound
  playShuffle() {
    if (!this.enabled || !this.ensureAudioContext()) return;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.frequency.setValueAtTime(
          600 + Math.random() * 400,
          this.audioContext!.currentTime
        );
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.03, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext!.currentTime + 0.05
        );

        oscillator.start(this.audioContext!.currentTime);
        oscillator.stop(this.audioContext!.currentTime + 0.05);
      }, i * 50);
    }
  }
}

export const cardSounds = new CardSoundManager();
