class SoundEngine {
  private ctx: AudioContext | null = null;
  private isKnocking = false;
  private isChiming = false;
  private isFlashing = false;
  private initialized = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    return this.ctx;
  }

  public init() {
    if (this.initialized) return;
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(console.error);
    }
    this.initialized = true;
  }

  public playKnock() {
    const ctx = this.getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') return; // Cannot play if suspended (e.g. on mobile before init)
    if (this.isKnocking) return; // Prevent overlapping distortion

    this.isKnocking = true;
    const t = ctx.currentTime;
    
    const playSingleKnock = (time: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(1, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.15);
    };

    playSingleKnock(t);
    playSingleKnock(t + 0.15);

    setTimeout(() => {
      this.isKnocking = false;
    }, 350);
  }

  public playGlassChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') return;
    if (this.isChiming) return;

    this.isChiming = true;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 1);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.5);

    setTimeout(() => {
      this.isChiming = false;
    }, 1500);
  }

  public async playFlashSound() {
    const ctx = this.getContext();
    if (!ctx) return;
    
    // We must ensure context is resumed here because this is an explicit click action.
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(console.error);
    }
    
    if (this.isFlashing) return;
    this.isFlashing = true;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.2);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.6);

    setTimeout(() => {
      this.isFlashing = false;
    }, 600);
  }
}

export const soundEngine = new SoundEngine();
