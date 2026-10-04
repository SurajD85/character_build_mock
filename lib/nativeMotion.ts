/**
 * Zero-dependency Browser Native Web Animations API (WAAPI) Helper
 * Replaces GSAP with 100% MIT open-source native browser animation engine.
 */

export interface NativeCruiseOptions {
  speed?: number; // Speed multiplier (e.g. 0.5x, 1.0x, 1.8x)
  onRepeat?: () => void;
}

export class NativeCruiseController {
  private element: HTMLElement;
  private animation: Animation | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public start(options: NativeCruiseOptions = {}) {
    this.stop();

    const speed = options.speed ?? 1.0;
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1400;
    const startX = -320;
    const endX = viewportWidth + 320;
    const durationMs = Math.max(7000, 15000 / speed);

    const keyframes: Keyframe[] = [
      { transform: `translate3d(${startX}px, 0px, 0px)` },
      { transform: `translate3d(${endX}px, 0px, 0px)` },
    ];

    const timing: KeyframeEffectOptions = {
      duration: durationMs,
      iterations: Infinity,
      easing: "linear",
    };

    this.animation = this.element.animate(keyframes, timing);

    if (options.onRepeat) {
      this.animation.addEventListener("iteration", options.onRepeat);
    }
  }

  public slowDown(targetRate = 0.15) {
    if (this.animation) {
      this.animation.playbackRate = targetRate;
    }
  }

  public resume(targetRate = 1.0) {
    if (this.animation) {
      this.animation.playbackRate = targetRate;
    }
  }

  public stop() {
    if (this.animation) {
      this.animation.cancel();
      this.animation = null;
    }
  }
}
