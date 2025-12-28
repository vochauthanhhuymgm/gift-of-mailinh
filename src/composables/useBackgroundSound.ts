import { ref } from 'vue';

export type Mode = 'morning' | 'night';

const audioCache = new Map<Mode, HTMLAudioElement>();

function fallbackTone(mode: Mode) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    // different frequencies for morning/night
    o.frequency.value = mode === 'morning' ? 880 : 220;
    g.gain.value = 0;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.linearRampToValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.15, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    o.start(now);
    o.stop(now + 0.6);
    // close context after tone finishes
    setTimeout(() => {
      if ((ctx as any).close) (ctx as any).close();
    }, 800);
  } catch (e) {
    // no-op fallback
    // console.warn('fallback tone failed', e)
  }
}

export function useBackgroundSound() {
  const playing = ref(false);

  const play = async (mode: Mode) => {
    const src = `/sounds/${mode}.mp3`;

    try {
      // Pause any other mode that's currently playing
      audioCache.forEach((a, m) => {
        if (m !== mode) {
          try {
            a.pause();
            a.currentTime = 0;
          } catch {}
        }
      });

      let audio = audioCache.get(mode);
      if (!audio) {
        audio = new Audio(src);
        audio.preload = 'auto';
        audio.loop = true; // loop endlessly
        audioCache.set(mode, audio);
      }
      // ensure playback starts from beginning when toggling
      try {
        audio.currentTime = 0;
      } catch {}
      playing.value = true;
      await audio.play();
    } catch (err) {
      // If fetch/play fails (placeholder file or CORS), use fallback tone
      fallbackTone(mode);
      playing.value = false;
    }
  };

  return { play, playing };
}
